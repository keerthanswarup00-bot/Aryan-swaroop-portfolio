# 09 — Security

Attack surface is small (static site, no forms/database/auth). This pass re-verifies the 08-02 security review and adds new findings.

## Production headers (per `vercel.json`, re-verified)
- `X-Frame-Options: SAMEORIGIN`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy` (strict-origin-when-cross-origin implied)
- `Permissions-Policy`
- HSTS (Vercel platform default)
- Caching: images `immutable` 1 yr, CSS/JS 300 s, HTML revalidate
- **No Content-Security-Policy** — still missing (M6). With three third-party scripts on the site (Google Fonts, unpkg page-flip, Elfsight `platform.js`), a CSP would need `font-src fonts.googleapis.com fonts.gstatic.com`, `script-src 'self' unpkg.com cdn.elfsight.com elfsightcdn.com`, `style-src 'unsafe-inline'` (the site uses inline styles in HTML and `image-set` background-image), `frame-src https://vr-devaiah-enclave.vercel.app https://*.elfsight.com`. Feasible; test before shipping.

## Secrets
- `.env.local` contains `VERCEL_OIDC_TOKEN` (build-time OIDC JWT). Gitignored (`.gitignore` has `.env*`) and **not** in the commit — verified via `git check-ignore`. Present in the working tree; standard Vercel pattern. Keep gitignored.
- No API keys, tokens, or emails-as-secrets in committed frontend/HTML. `security.txt` intentionally exposes a contact email.
- `api/manifest.js` uses `@vercel/blob` server-side; no client credential exposure.

## Findings

### New — B-H5: unauthenticated blob enumeration (`api/manifest.js`)
- Any origin can `GET /api/manifest` (CORS `*`) and enumerate `images/*` keys in the blob store. Read-only; images are intended-public. Risk today is low, but:
  - `robots.txt` correctly disallows `/api/` for search bots (doesn't stop humans).
  - If the blob store ever gains non-public assets, this endpoint leaks their keys (though not contents).
  - Recommend gating behind an `x-admin-token` header when a write/admin path is added; otherwise document as intentionally public.

### Carried from 08-02 (status)
| ID | Finding | Status |
|---|---|---|
| M6 | No CSP | **Open** (add with the 3-party script allowlist above) |
| L6 | `.env.local` gitignored | OK — no action |
| L2 | `server.py` admin upload w/ sha256 `ADMIN_HASH` | Dev-only, not deployed — no action, do not deploy |

## Dependency/third-party risk (JS executed in browsers)
1. **Google Fonts** (fonts.googleapis.com/gstatic.com) — external, standard.
2. **unpkg `page-flip@2.0.7`** (work/brahmi, desktop) — unpinned beyond minor; a compromise or outage of unpkg breaks/fails the book. Vendor it (site already vendors gsap/lenis the same way).
3. **Elfsight `platform.js`** (work/brahmi) — loads on desktop too (B-M4); remove with the flipbook fix (B-C1).
4. **VR iframe** (`https://vr-devaiah-enclave.vercel.app`) — third-party app embeds page content. Loaded only on scroll into view; iframe is sandboxed? Verify `sandbox` attribute — if absent, the embedded app has full same-origin privileges of the host document's *sandbox* (it's cross-origin so it can't read the host, but it can popup/focus-top etc.). Add `sandbox="allow-scripts allow-same-origin allow-popups"` (relaxed but safer) or confirm the app is trusted.

## XSS / injection surface
- No user-controlled input is reflected anywhere (no forms, no URL params read into DOM — verify no `location.search` usage). Grep for `innerHTML`/`insertAdjacentHTML`:
  - `dropdown.js:5` uses `insertAdjacentHTML` with **static** strings — safe.
  - `lightbox.js`/`playground.js` set `src` from `data-*` attributes — safe (attribute values are developer-controlled).
- No `eval`, no `document.write`. ✅

## Supply chain
- `node_modules` contains `@vercel/blob`, `gsap`, `lenis` (package.json). Only `@vercel/blob` is used at runtime (in the serverless function); `gsap`/`lenis` in the browser are served from `js/vendor/` (committed). `npm audit` — run locally to confirm; no known CVEs flagged in prior pass.

## Summary verdict
Static-site risk is minimal and the platform headers are solid. **Only new action item is deciding on B-H5** (document or gate the manifest endpoint) and **M6** (CSP) remains the biggest open hardening item.
