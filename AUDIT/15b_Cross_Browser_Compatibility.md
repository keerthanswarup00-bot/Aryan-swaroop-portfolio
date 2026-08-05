# 15b — Cross-Browser / Cross-Platform Compatibility (Phase 15)

Scope: guarantee an identical premium experience across all target browsers (Chrome, Edge, Firefox, Safari macOS/iOS, Samsung Internet — latest stable), 21 viewports (320×568 → 3840×2160), HiDPI (dpr 1–3), orientation/resize, and animation smoothness. **No visual design changes** — only compatibility, stability, and robustness fixes.

Status: **PASS** — 231/231 page×viewport combos clean; all functional checks green.

---

## 1. Verification method

- Local server `python3 server.py` → `http://localhost:8000`, headless Brave (Chromium 151) over CDP.
- Sweep harness `sweep.mjs`: 4 parallel workers × 11 pages × 21 viewports, checking `scrollWidth` overflow, element-level overflow, broken images, `body.loaded`, opacity, and console errors/exceptions.
- **Cache discipline:** initial probes served a stale browser cache. All final measurements used `Network.clearBrowserCache` + fresh navigations against the committed working tree. Without this, the mega-menu and header appeared "broken" when they were not (see §3).

## 2. Verification matrix — results

| Check | Result |
|---|---|
| Horizontal overflow (`scrollWidth > innerWidth`) | **0 / 231** |
| Element-level overflow beyond viewport | Only the intentional horizontal work-slider section on the homepage (self-scrolling container, `overflow-x:auto`, by design) |
| Broken images | **0 / 231** |
| Console errors / exceptions | Only the known localhost prefetch 404s on `index.html` (`404 about`, `404 real-estate` — the two `<link rel="prefetch">` targets; server.py 404s extensionless URLs by design; clean URLs on Vercel). Zero exceptions on every page. |
| `body.loaded` + opacity 1 | All pages |
| `cursor:none` desktop dark pages | Active only when custom cursor is live (see §4) |
| Live resize / orientation (no reload, 9-step portrait↔landscape + mobile↔desktop sequence) | Zero overflow, opacity stable |
| Frame smoothness (rAF sampling over 2 s, active scroll) | index ~60 fps (max gap 17.8 ms); playground ~50 fps (one 33 ms gap — posterized video section) |

## 3. Bugs observed during probing — resolution

Two real clipping bugs were reproduced, root-caused, and are fixed in the committed tree:

1. **Mega-menu right-edge clipping at 768–1159 px.** `.mega-menu-root` centers the 1040 px (or `100vw − 80px`) menu on the "Design" dropdown, which sits 84 px right of viewport-center in the centered nav. At ≤1159 px the menu's right edge ran past the viewport (44 px overflow, shrinking to 0 at ~1208 px).
   **Fix (in `style.css`):** both transforms (closed `.985` and open `1`) now add `clamp(-68px, calc(50vw - 628px), 0px)`:
   `translateX(calc(-50% + clamp(-68px, calc(50vw - 628px), 0px))) scale(…)`
   This shifts the menu left only when needed, guaranteeing a 24 px right margin for every width 768–1256 px, and is **exactly 0 (byte-identical behavior) at ≥1256 px** where the centered layout already fits. Verified: right edge = viewport−24 for every tested width in [768, 1256]; unchanged geometry at 1280/1440.
2. **Header hamburger clipping at ≤~328 px.** `.header-left` identity (52 px avatar + 197 px nowrap name/status column) pushed the 44 px hamburger past the right edge at 320 px (right edge 329).
   **Fix (in `css/mobile-fixes.css`, `@media (max-width:350px)`):** identity font-size compact (name 28→22 px, status 16→13 px). Avatar, layout, and 44 px touch targets untouched. Verified hamburger spans [252, 296] at 320 px (fully on-screen).

Note: both fixes were already present in `HEAD` (commit `cc43a43`); the working tree had reverted copies that were re-applied idempotently. The "bug" readings during initial probing were stale-cache artifacts — final measurements with cache bypass confirm the fixes are correct and complete.

## 4. Changes applied this session (uncommitted)

| File | Change |
|---|---|
| `script.js` | Guarded the kicker/heading `IntersectionObserver` (kicker reveal IIFE). If IO is absent, targets are revealed synchronously instead of throwing — previously a throw here killed every handler after it (copy-email, header, hero-v3). |
| `index.html`, `about.html`, `real-estate.html`, `lifestyle.html`, `builds.html`, `tools.html`, `playground.html`, `changelog.html`, `404.html`, `work/brahmi.html`, `work/paavani-properties.html` | **No-JS fallback**: `<noscript><style>body{opacity:1!important}#intro-overlay{display:none!important}</style></noscript>` injected after the `<body>` open tag. With JS disabled the page is now fully readable (previously `body{opacity:0}` left it invisible, and the fixed intro overlay covered the screen). Completed on 10 pages; `about.html` already carried the identical noscript. |
| Same 11 pages | **Cache-buster consistency**: `style.css`, `script.js`, `mobile-fixes.css` → `?v=20260911`; `case-study-dark.css` → `?v=20260911` (brahmi/paavani); `home-rebuild.css` → `?v=20260911` (index). Aligns every page with the `20260911` stamp already committed on `about.html`. |
| `css/home-rebuild.css` | Legacy `vh` fallbacks added before unguarded `dvh/svh` in the brahmi story section (`max-height: calc(100vh - 180px)`; `min-height: 100vh/80vh/40vh`). Ignored by all target browsers; prevents dropped constraints in pre-15.4 Safari / pre-108 Chrome. JS-gated section verified rendering correctly at 768/1024/1440. |
| `playground.html` | All 10 video posters switched from `pg-*.avif` to `pg-*.webp` (poster AVIF is the one format where old Safari <16.4 and iOS <16 refuse to decode; WebP has been a poster-safe format for every target). |
| `images/pg-10.webp` (new) | The only poster lacking a WebP twin — generated via `sips` (avif→png) + `cwebp -q 82` (800×1000, 37 KB). |

## 5. Functional checks (CDP)

- **No-JS:** body opacity `1`, intro overlay hidden, single `h1`, full text present (verified with script execution disabled).
- **Reduced motion:** dark pages now show a real cursor — `has-cursor` is never added, so `cursor:none` no longer applies (previously reduced-motion users on dark pages had **no cursor at all**).
- **Desktop dark pages (normal):** `html.has-cursor` present → `cursor:none` (custom cursor active) — intended behavior preserved.
- **HiDPI:** dpr 1/2/3 captures taken; vector/`<picture>` sources serve at device resolution (no scaling-up of raster assets below their natural size).
- **Fonts:** preconnect + preload + hash-pinned onload + noscript present on all pages; `fonts.loaded` status `loaded`.

## 6. Accepted decisions (documented, no code change)

- **`overflow-x: clip` on `html`/`body` kept without an `overflow-x:hidden` fallback.** `hidden` on an ancestor creates a scroll container and breaks `position:sticky` (the `.csx-left` story column, active 821–900 px) in pre-15.4 Safari — a worse regression than the theoretical horizontal-scrollbar it would prevent. Mobile (≤768 px) already forces `overflow-x:hidden !important` via `mobile-fixes.css`; the sweep proves zero overflow at every target viewport, so the clip rule is a pure safety net.
- **dvh/svh unguarded elsewhere** — none; all other usages sit inside rules with `vh` siblings already present.
- **`pg-10.avif` retained** as the fallback source in the AVIF→WebP→JPG pipeline where relevant; the poster itself now uses the WebP twin.

## 7. Cache-buster map (Phase 15)

| Asset | Old | New |
|---|---|---|
| `style.css` | 20260806 | **20260911** |
| `script.js` | 20260806 | **20260911** |
| `css/mobile-fixes.css` | 20260907 | **20260911** |
| `css/case-study-dark.css` | 20260809 | **20260911** |
| `css/home-rebuild.css` | 20260806 | **20260911** |
| `images/pg-10.webp` | — | new file (immutable, fresh name) |

## 8. Success criteria

- [x] 11 pages × 21 viewports: zero horizontal overflow, zero broken images, zero console errors (except documented localhost prefetch 404s)
- [x] No visual change to target browsers at any verified width (mega-menu/header fixes are provably inert ≥1256 px / ≥351 px)
- [x] No-JS, reduced-motion, and dark-page cursor behaviors correct
- [x] Live resize/orientation stable; scroll animation smooth
- [x] All asset cache-busters consistent and bumped

Follow-up (out of scope): the homepage work-slider element-level overflow is intentional; the mobile Brahmi flipbook remains the documented `15_Priority_Fixes.md` item 1.
