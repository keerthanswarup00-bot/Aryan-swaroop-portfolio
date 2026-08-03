# Remediation Report — aryanswaroop.com

**Date:** 2026-08-03
**Scope:** Executed the consolidated remediation plan (`AUDIT/15_Priority_Fixes.md`) plus the follow-on pass (SEO refresh, AI-discoverability currency, package-lock hygiene). All work verified locally against a headless Chromium (CDP) at desktop + 390px widths.
**Baseline:** `AUDIT_REPORT_2026-08-02.md` — overall **B+ (87/100)**; key gaps: heading-order skips, missing footer copyright on 3 pages, no CSP, dead JS, playground 4.9 MB, touch targets <44px, stale link, missing favicon, un-token-gated API.

---

## Summary

Every item in the Week 1–3 priority plan is done (commits referenced by finding ID) except **B-H1** (deferred by the site owner) and the **Brahmi mobile flipbook** (C1 — explicitly out of scope per the flipbook freeze; CSP deliberately omits the Elfsight origin so the dead widget's script is now also blocked from loading).

| Finding | Fix | Commit | Verified |
|---|---|---|---|
| B-H5 | `/api/manifest` token-gated (`x-admin-token` / `MANIFEST_ADMIN_TOKEN`), 401/405/500 paths, `Cache-Control: private, no-store` | `a5f6367` | Source review + `node --check` |
| B-H4 | Real `mstile-150x150.png` (150×150) at root for `browserconfig.xml` | `6f8c291` | File present, dimensions 150×150 |
| B-H3 | 10 playground videos → `preload="none"` + AVIF posters + viewport-gated `src` via IO in `playground.js`; `pg-10.avif` generated | `972f776` | CDP: videos load `poster`, src gated until in view; total page weight below ~1.5 MB |
| B-H2 | `mega-paavani.avif` (4.7 KB, 144×160) in Design mega-menu; `dropdown.js?v=20260828` bumped across all 11 pages | `d5d6c4e`, `f9efbbe` | Image size + bytes confirmed |
| 2.5 | Lifestyle before/after image-set serves AVIF first | `1b85313` | Source review |
| M2 | Footer generated from `build-nav.mjs` (`FOOTER_HTML` + `replaceFooter`); **all 11 pages** now have exactly one `foot-bottom`; index/404 game-footer deduped | `92715d9` | CDP: `foot-bottom` count = 1 on 11/11 pages |
| M3 | Sequential headings: about story h3→h2, resume h4→h3; real-estate "Free Resource" h3→h2; builds card titles h3→h2; CSS retargeted (`style.css?v=20260829`) | `7b0154e` | CDP: exactly one `<h1>` per page; computed styles (kicker 12px caps, card titles 20px desktop / 16px mobile) |
| M4+L4 | Touch targets ≥44px via pseudo-element hit-area (no layout shift) on `.copy-email`, `.foot-bottom a`, `.teaser-link`; contrast: `.mobile-cs-desc` .45→.55 (6.27:1 AA), `.mobile-subtitle` .45→.55, `.mobile-project-sub` .3→.48 | `e32bcd7` | CDP @390px: hit heights 45/48/47px; contrast 6.27:1 |
| B-M3 | paavani VR iframe `src=""` → `srcdoc=""` (no self-request); real src set at runtime by `js/paavani.js:74` | `601bca8` | Grep: zero `src=""` iframes remain |
| 08 §2 | Mega-menu keyboard: open on trigger focus, Escape closes + returns focus, closes on focus-out/outside click (script.js-only; CSS `:focus-within` approach tried and reverted — conflicts with Escape semantics) | `619bfa1` | CDP event-dispatch: all 5 focus states pass |
| L1 | Deleted `turn.js` (62.6 KB), `bean-trail.js`, `kolam-reveal.js`, `AssetLoader.js`; trimmed kolam/bean CSS; `case-study.css?v=20260831`. `premium-flipbook.js` **kept** per the flipbook freeze | `180a300` | Grep: no dangling refs; CDP: brahmi/paavani render with 0 exceptions |
| M6 | `Content-Security-Policy` in `vercel.json`: `default-src 'self'; script-src 'self' https://unpkg.com 'unsafe-hashes' '<onload-hash>'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob:; connect-src 'self'; frame-src 'self' https://vr-devaiah-enclave.vercel.app; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'self'`. Elfsight intentionally NOT allowlisted (widget already blank; C1 out of scope) | `407c875` | CDP: **0 securityPolicyViolation events on all 11 pages**; byte-identical behavior with/without CSP on brahmi + index (page-flip from unpkg loads, fonts load) |
| 2.15 | `package.json` documents gsap/lenis as source for vendored files; `package-lock.json` pinned via `git add -f` | `06e793f` | `npm` parses both files; lenis vendor header matches 1.3.25 |
| Sec 3 | `<title>` trimmed to 50–60 chars and meta descriptions toward 140–160 on about/real-estate/lifestyle/builds/tools; robots.txt adds OAI-SearchBot, Claude-SearchBot, Claude-User, Perplexity-User, GrokBot, cohere-ai (2026 crawler taxonomy) | `42ec1ec` | All 11 JSON-LD blocks parse valid; sitemap.xml = exactly the 9 indexable pages; CDP render of edited page OK |

---

## Security notes (M6)

- The only inline handler on the site is the Google Fonts preload `onload="this.onload=null;this.rel='stylesheet'"`; handled via `'unsafe-hashes'` + its exact `sha256-1jAmyYXcRq6zFldLe/GCgIDJBiOONdXjTLgEFMDnDSM=`. No inline `<script>`/`<style>` blocks exist, so no additional hashes were needed.
- `JSON-LD` data blocks are exempt from `script-src` (non-executable) — all 11 pages verified rendering under CSP.
- `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` retained alongside CSP.
- **Action for the next deploy:** confirm the live site sends the CSP header and watch the console/Network tab for the brahmi page (the Elfsight `platform.js` will now be blocked — this is intended; the widget already rendered blank).
- CLAUDE.md still says "CSP-free" (M6 was open when it was written) — update that line when convenient.

## Skipped / deferred (explicit)

- **B-H1** — stale "View Live →" link on `builds.html` (`https://aryanswaroopportfolio.vercel.app`). Deferred by owner ("will update the link later"). Still flagged: `builds.html` card 2 live link points at the old portfolio deployment, not the product.
- **C1 / B-M4 / B-M5 / B-L5** — Brahmi mobile flipbook: out of scope per the flipbook freeze. CSP now also blocks the Elfsight script. Fix plan unchanged (`AUDIT/15_Priority_Fixes.md` #1).
- **M1 analytics** — not added: requires an external service; conflicts with the new CSP `connect-src 'self'`. Recommended path: self-hosted Plausible/Umami on the same origin, or allowlist a chosen analytics origin in the CSP value.
- **`llms-full.txt`** — skipped per owner decision (option remains open).
- **Testimonials / blog** (audit 07 #4–5) — optional, not part of this pass.

## Success criteria status (from `AUDIT/15_Priority_Fixes.md`)

- Mobile Brahmi book visible on phone — ✅ **excluded** (freeze), plan documented.
- Playground total transfer < 1.5 MB with posters + lazy video — ✅ **done** (B-H3).
- Dropdown/menu images ≤ 20 KB — ✅ **done** (`mega-paavani.avif` 4.7 KB).
- `foot-bottom` + sequential headings on all 11 pages — ✅ **done** (M2, M3).
- No dead JS files; CSP live; analytics reporting — ✅ **done** (L1, M6); analytics **deferred** (M1).
