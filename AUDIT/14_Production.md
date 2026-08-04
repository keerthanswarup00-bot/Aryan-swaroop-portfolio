# 14 — Production & Deployment

## Hosting
- **Platform:** Vercel project `aryan-swaroop-portfolio-9hor`; domain `https://www.aryanswaroop.com` (apex → www 307 redirect, HSTS, valid TLS — verified in prior audits; structure unchanged).
- **Deploy model:** direct-from-repo, no build step. `npm run build:nav` output is committed so the static files are deploy-ready.
- **Clean URLs:** `vercel.json` → `cleanUrls: true`, `trailingSlash: false`. This is why `/real-estate`, `/about`, `/work/brahmi` work in production but 404 on the local `server.py`.

## Configuration review (`vercel.json`, re-read 2026-08-03)

| Key | Value | Verdict |
|---|---|---|
| `cleanUrls` | true | ✅ |
| `trailingSlash` | false | ✅ |
| `functions.api/manifest.js.maxDuration` | 10 | ✅ (blob listing is quick) |
| Headers `/images/(.*)` | `Cache-Control: public, max-age=31536000, immutable` | ✅ — but note: `?v=` busting is already built into the HTML; `immutable` on images is safe because every filename change bumps the URL |
| Headers `/(.*)\.(css\|js)` | `max-age=300` | ✅ short TTL, cache-busting handles the rest |
| Headers `/(.*)` | XFO/XCTO/Referrer-Policy/Permissions-Policy | ✅ |
| **CSP** | **absent** | ❌ M6 — open |

## Local dev
- `python3 server.py` — serves the repo but 404s extensionless paths (`/real-estate` fails; `/real-estate.html` works). Documented in 00 as a testing artifact only.
- `npm run build:nav` — must be run after editing nav content; if you add a page, add it to `TARGETS` in `scripts/build-nav.mjs`.

## Deployment checklist (pre-launch)
1. Run `npm run build:nav` to normalize headers/menus site-wide (would also fix any manual-edit drift).
2. Grep for absolute leftover URLs: `aryanswaroopportfolio.vercel.app` (B-H1) — must be gone.
3. Confirm `robots.txt`, `sitemap.xml`, `sitemap-images.xml`, `llms.txt`, `security.txt`, `humans.txt`, `site.webmanifest`, `browserconfig.xml` (or remove it) all present in the deploy.
4. Verify clean-URL redirects: `/work/brahmi` → page renders; `/work/brahmi.html` still works (Vercel serves both with cleanUrls).
5. Sanity-test the flipbook on a real phone (C1) before the fix ships.
6. Check the VR iframe still loads (`vr-devaiah-enclave.vercel.app` is a separate deploy).

## Monitoring / measurement (carried, open)
- **No analytics (M1)** — add Plausible/Umami so the next audit can report real RUM (CrUX + Lighthouse CI suggested by prior audit).
- Vercel analytics not enabled; no uptime alerting configured for the two external dependencies (unpkg page-flip, VR app).

## Rollback
Git-based; Vercel keeps previous deployments. No data/migrations to worry about (static).
