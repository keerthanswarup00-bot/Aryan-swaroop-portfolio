# 12 — Code Quality

## Strengths
- **Single source of truth for nav:** `scripts/build-nav.mjs` exports `HEADER_HTML`/`MOBILE_MENU_HTML`; `npm run build:nav` rewrites all 11 pages. Byte-identical headers guaranteed (verified — all pages share identical header/mobile-menu markup).
- **Clean module split for the game:** 14 small ES modules with single responsibilities (`Game/Input/Player/Obstacle/Ground/Cloud/Background/Score/Sound/Physics/Renderer/Particle/Intro/Utils`) — genuinely good structure for a canvas game.
- **No `console.log`/`TODO`/`FIXME`** anywhere in committed source.
- **Consistent cache-busting** (`?v=YYYYMMDD`) on CSS/JS/favicons.
- **Consistent `<picture>` triplets** (AVIF→WebP→JPG) with `width`/`height` reserved on images.
- **Reduced-motion + static fallbacks** consistently applied per feature.
- **Semantic HTML + aria patterns** used correctly throughout.

## Weaknesses

1. **`style.css` is minified to 9 lines** — no comments, no organization, no source map, no build step to regenerate it. Every edit to it is a needle-in-haystack edit against giant minified lines (the cursor/header/mobile-menu rules all live on lines 1–3). This is the biggest maintainability tax in the repo. Options: adopt a real build (LightningCSS/Tailwind) or at minimum split into per-section files and comment them.
2. **Footer is hand-duplicated across 11 pages** — it is *not* part of `build-nav.mjs` (only header + mobile menu are). Evidence of drift: `about`, `changelog`, `playground` are missing the `foot-bottom` copyright row (M2). **Fix: move the footer into `build-nav.mjs` and regenerate** — this both fixes M2 and prevents future drift.
3. **Dead code (5 files):** `js/turn.js` (62 KB), `js/premium-flipbook.js`, `js/bean-trail.js`, `js/kolam-reveal.js`, `js/AssetLoader.js` (stub). All unreferenced (grep-verified). Delete. Also `css/case-study.css` kolam/bean-trail rules ship but never animate (drivers deleted) — trim those rules if the animations aren't coming back.
4. **Inline-style duplication** at `work/brahmi.html:301` (`.premium-flipbook-wrapper` `style="…"`) vs `css/premium-flipbook.css` — drift risk.
5. **Two flipbook implementations shipped:** `js/flipbook-desktop.js` (used, PageFlip) + `js/premium-flipbook.js` + `js/turn.js` (dead, Turn.js). Consolidate.
6. **`package.json`** declares `gsap`/`lenis` as deps but the runtime uses vendored copies — misleading; document or prune.
7. **Minified vendor files with no version comment** (`gsap.min.js` etc.) — pin versions in filenames or a comment for traceability.
8. **`server.py`** is a legacy local tool (admin upload w/ sha256 token) not used in production — mark as dev-only in a comment or move to `scripts/`.
9. **Naming:** `ishav-guards-guards.*` (doubled word); `browserconfig.xml` → missing `mstile` (B-H4). Minor but sloppy at the margins.

## Maintenance recommendations (priority order)
1. Generate the **footer** from `build-nav.mjs` (fixes M2 + prevents drift). — 1 h
2. **Delete dead JS** (L1). — 30 min
3. **Stop minifying `style.css` by hand**: add a `styles/` source dir + a tiny build script (or commit the readable version; Vercel/gzip makes minification marginal at 37 KB). — 2–3 h
4. Consolidate flipbook code into one file + vendor page-flip. — 2 h
5. Prune `gsap`/`lenis` from `package.json` or add a `// vendored from X@Y` header. — 15 min
