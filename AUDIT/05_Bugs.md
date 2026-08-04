# 05 — Bugs

Verified bug list. **Severity key:** 🔴 Critical → must fix; 🟠 High; 🟡 Medium; 🔵 Low. "Prior audit" column refers to `AUDIT_REPORT_2026-08-02.md` (2026-08-02). Every claim below was re-verified against current source on 2026-08-03.

## Severity overview

| ID | Severity | Location | Bug | Prior audit |
|---|---|---|---|---|
| B-C1 | 🔴 | `work/brahmi.html:314-315` | Mobile flipbook is an unconfigured Elfsight widget → renders blank; desktop PageFlip is hidden ≤767px, so mobile sees an empty section in the flagship case study | C1 — **still open** |
| B-H1 | 🟠 | `builds.html:323` | "View Live →" → `https://aryanswaroopportfolio.vercel.app` (old deploy of the portfolio itself) | H3 — **still open** |
| B-H2 | 🟠 | `dropdown.js:81` (injected everywhere) | `paavani-cards.avif` (371 KB) shipped in the Design mega-menu at a 72×80 thumb on **every** page | H2 — **partially open** |
| B-H3 | 🟠 | `playground.html:331-390` | 10 `<video preload="auto">` (~4.5 MB) fetched on load; no posters | H1 — **still open** |
| B-H4 | 🟠 | `browserconfig.xml` | References `/mstile-150x150.png` which does **not exist** → 404 on IE/Edge tile requests (new finding) | — new |
| B-H5 | 🟠 | `work/paavani-properties.html` | `api/manifest.js` blob listing is unauthenticated (`*` CORS) (new finding) | — new |

## Critical

### B-C1 — Blank mobile flipbook on the Brahmi case study
- **Where:** `work/brahmi.html:314-315` (`.mobile-only > .cs-flipbook-embed > div.elfsight-app-…` + `platform.js` script tag).
- **What:** The mobile-only flipbook uses the third-party Elfsight "Untitled Flipbook" widget, which loads its shell but never renders a book. Desktop's custom PageFlip book (`js/flipbook-desktop.js`) is scoped to `≥768px` (`.desktop-only` / `.mobile-only`, `css/premium-flipbook.css:201-208`).
- **Result:** On phones, the flagship 44-page identity case study has an empty section where the book should be.
- **Prior:** Confirmed blank via headless CDP in the 2026-08-02 audit. Source unchanged since.
- **Fix (recommended):** Reuse the working PageFlip book on mobile with portrait-friendly sizing and tap-zone tuning; delete the Elfsight script and the `.cs-flipbook-embed` block. Half-day.

## High

### B-H1 — Stale "View Live" CTA
- **Where:** `builds.html:323`.
- **What:** `<a href="https://aryanswaroopportfolio.vercel.app">` — an old deployment of *this portfolio*, not the featured product. `rel="noopener noreferrer"` is present (good) but the destination is wrong.
- **Fix:** Point to the real product (e.g. the Selixo site) or remove the link. 5 min.

### B-H2 — Site-wide mega-menu image tax
- **Where:** `dropdown.js:81-83` (injected into `#designDropdown` on all 11 pages).
- **What:** `.mega-cs-card-img img` uses `paavani-cards.avif` (371 KB, 800×640 source) for a **72×80 px** thumbnail. The mega-menu root is `visibility:hidden` but **not** `display:none`, so `loading="lazy"` still fires — the file downloads on every page. (The homepage sticky-featured part of the old H2 *was* fixed: `index.html:438-471` now uses `sfp-*.avif/.webp/.jpg` triplets.)
- **Fix:** Point the mega-menu at a small `mega-paavani.avif` (≈5–10 KB, matching the other mega-* images which are 2–10 KB) or use `data-src` + swap on dropdown open.

### B-H3 — Playground loads all 10 videos eagerly
- **Where:** `playground.html:331-390`.
- **What:** 10 × `<video preload="auto" playsinline muted loop>` = **4.53 MB** total fetched on page load (sizes: 98 KB → 1,045 KB each). No `poster`. LCP is a video first frame.
- **Fix:** `preload="none"` (or `metadata`) + existing `pg-*.avif` stills as `poster`; load `src` via the existing IntersectionObserver (`playground.js`) when the tile nears the viewport. 2–4 h.

### B-H4 — Missing favicon file referenced by browserconfig.xml
- **Where:** `browserconfig.xml` → `/mstile-150x150.png`.
- **What:** No such file in the repo (`images/` + root). Request 404s. Fix by generating a 150×150 tile from the existing favicon source (`archive/favicon-source/`) or deleting the `<square150x150logo>` entry.

### B-H5 — Unauthenticated serverless blob listing (new)
- **Where:** `api/manifest.js`.
- **What:** Any origin can `GET /api/manifest` and enumerate the `images/*` keys in the `@vercel/blob` store, with `Access-Control-Allow-Origin: *`. The store contains intended-public images, so risk is low, but the endpoint is also reachable to *write* nothing (read-only) — acceptable today. Flagging so it's an explicit decision; gate it if it ever exposes internal files. (See 09.)

## Medium

| ID | Location | Bug |
|---|---|---|
| B-M1 | about, changelog, playground | Footer missing `foot-bottom` (copyright row) — `grep -c foot-bottom` = 0 on all three. Site-wide inconsistency. |
| B-M2 | about, real-estate, builds | Heading hierarchy skips: `h1 → h3` (card/story titles), about also `h2 → h4`. |
| B-M3 | `work/paavani-properties.html` | `<iframe id="interactiveFrame" src="">` — empty `src` makes the browser re-request the current page URL before JS fills it in. Use `srcdoc=""` or omit `src` until `paavani.js` sets it. |
| B-M4 | `work/brahmi.html` | Elfsight `platform.js` (async) executes on **desktop** too, since it sits inside `.mobile-only` (a `display:none` subtree still runs scripts) → extra third-party JS + network request on every brahmi visit. |
| B-M5 | `work/brahmi.html:301` | Inline `style="…"` on `.premium-flipbook-wrapper` duplicates rules in `css/premium-flipbook.css` — drift risk. |
| B-M6 | `style.css:1` | `body { cursor: none; }` with no `noscript`/JS-confirm fallback — if `script.js` fails, desktop has no visible cursor. |

## Low

| ID | Location | Bug |
|---|---|---|
| B-L1 | `js/` | Dead files still shipping: `turn.js` (62 KB), `premium-flipbook.js`, `bean-trail.js`, `kolam-reveal.js`, `AssetLoader.js` (stub). All unreferenced (grep-verified). |
| B-L2 | `images/` | `ishav-guards-guards.*` — doubled word in filename (harmless). |
| B-L3 | `style.css` | `.mobile-subtitle` (rgba 255,255,255,.45) ≈ 4.2:1 and `.mobile-project-sub` (rgba .3) ≈ 1.8:1 on black — under WCAG AA for small text. |
| B-L4 | `browserconfig.xml` | Whole file only matters for legacy IE — could be dropped along with B-H4. |
| B-L5 | `work/brahmi.html` | `js/flipbook-desktop.js` loads `page-flip@2.0.7` from `unpkg.com` — a runtime dependency; if unpkg is unreachable the desktop book silently fails (no fallback message). Consider vendoring the library like gsap/lenis. |

## Regression check (things prior audit said were OK — re-verified OK)
- 0 JS console errors claim not re-measured; source is unchanged except nav timestamp.
- Desktop PageFlip book initializes and is keyboard-operable (code path intact).
- No horizontal overflow at 390 px — `css/mobile-fixes.css` covers every media container (verified selectors).
- All JSON-LD blocks present on all 11 pages.
- Reduced-motion blocks in both CSS and JS still intact.
- No `console.log`/`TODO`/`FIXME` in source (re-grepped clean).
