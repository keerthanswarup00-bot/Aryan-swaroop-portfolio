# 11 — Dependencies

## Third-party code actually executed in the browser

| Dependency | Version/Pin | Source | Where used | Risk |
|---|---|---|---|---|
| Google Fonts (Fraunces, Inter) | unversioned (latest CSS) | `fonts.googleapis.com` / `fonts.gstatic.com` | all pages, preloaded + async swap | low; standard |
| GSAP | 3.15.0 | **vendored** `js/vendor/gsap.min.js` (73 KB) | index, work/*, playground | none (local) |
| ScrollTrigger | 3.15.0 | **vendored** `js/vendor/ScrollTrigger.min.js` (44.6 KB) | same | none |
| CustomEase | (with 3.15) | **vendored** `js/vendor/CustomEase.min.js` (7.1 KB) | playground | none |
| Lenis | 1.3.25 | **vendored** `js/vendor/lenis.min.js` (18.4 KB) | playground | none |
| page-flip | 2.0.7 | **CDN** `https://unpkg.com/page-flip@2.0.7/…` | work/brahmi (desktop flipbook) | **unpkg outage/compromise = broken book** (see 05 B-L5, 09) |
| Elfsight | unversioned `platform.js` | `https://elfsightcdn.com/…` | work/brahmi (mobile widget — broken anyway, B-C1) | **to be removed with the flipbook fix** |
| VR Devaiah app | — | `https://vr-devaiah-enclave.vercel.app/` (iframe, lazy) | work/paavani | third-party app must stay alive |

**Policy:** everything except Google Fonts is either vendored or should be. `page-flip` is the only render-critical CDN dep — vendor it (the repo already vendors gsap/lenis this way).

## npm dependencies (`package.json`)
- `@vercel/blob` `^2.6.1` — used by `api/manifest.js` (serverless).
- `gsap` `^3.15.0`, `lenis` `^1.3.25` — declared but **not used from `node_modules` at runtime** (browser copies are in `js/vendor/`). Redundant declarations; could be pruned or documented as "source for vendored files".
- `devDependencies`: none. Build step: none (`npm run build:nav` only rewrites committed HTML).

## `package-lock.json` is gitignored
- The lockfile exists locally but `.gitignore` excludes it (unusual). For a no-build static repo this is low-impact, but it means dependency versions in `node_modules` aren't reproducible for `@vercel/blob` in CI. Recommend committing the lockfile or pinning `@vercel/blob` exactly.

## Asset inventory (images/ — 357 files, 50 MB)
- Format discipline: AVIF + WebP + JPG triplets for most project images (≈103/103/133).
- `images/brahmi/` 44 flipbook pages: 3 MB (~60–115 KB each) — reasonable.
- Videos: 10 `pg-video-*.m4v` 4.53 MB + `brahmi-process.mp4` 524 KB (+ `.webm` twin).
- Outliers (no triplet): `arvi-*.png` (legacy fallbacks — webp now served via image-set, see 06), `nav-avatar.png` (476 KB fallback, has -400/-800 variants now), `build-imageoptimizer-*.jpg/avif/webp` variants exist.
- Dead/unused still on disk: `archive/` (.DS_Store only), `ishav-guards-guards.*` (renaming candidate).

## Runtime risk summary
1. unpkg page-flip — vendor it.
2. Elfsight — remove with C1.
3. Google Fonts — keep (standard, resilient).
4. VR iframe app — external deploy; keep but monitor.
