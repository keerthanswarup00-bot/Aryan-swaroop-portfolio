# 06 — Performance

Byte-level resource accounting (verified from disk; production numbers will differ slightly by gzip/brotli). Reference the 2026-08-02 audit for measured vitals; this pass re-verifies the biggest byte sources.

## Site-wide recurring costs

Every page inherits:
1. **The Design mega-menu images** (injected by `dropdown.js`): total ≈ **410 KB** in AVIF for browsers that support it. Breakdown: `paavani-cards.avif` 371 KB (72×80 thumb — the outlier), `mega-re-2.avif` 2.8 KB, `mega-lifestyle-2.avif` 8.6 KB, `mega-builds-2.avif` 4.9 KB, `playground-preview.avif` 17 KB, `build-preview.avif` 7.9 KB. The `paavani-cards.avif` download is ~92% of the menu's image weight and renders at 72×80 px → **right-size to ~10 KB** (B-H2).
2. Header avatar: `nav-avatar-400.avif` (44×44 display) — small, fine.
3. Mobile menu images (`build-nav.mjs`): `brahmi-pourshot.avif`, `hero-paavani-main.avif`, `mega-*` etc., all `loading="lazy"` inside a menu that is `visibility:hidden` until opened — the ones in a *display:none-on-desktop* menu still load on mobile only. Acceptable.
4. Fonts: Google Fonts preloaded (Fraunces + Inter, woff2 subsets), async swap, preconnect. ~700 KB worst case, used subsets only. Good pattern.

## Page weight ledger (fresh load, desktop, AVIF-supporting browser — disk bytes)

| Page | Estimated transfer | Heaviest items |
|---|---|---|
| playground.html | **≈4.9 MB** | 10 videos 4.53 MB (preload=auto) + pg images |
| work/brahmi.html | ≈4.9 MB | flipbook `page-*.jpg` (lazy, 3 MB total) + `stickers.jpg` 521 KB + fonts + mega-menu |
| index.html | ≈1.3 MB | hero/featured images (sfp-*.avif ~365 KB now, was ~1 MB before the AVIF fix) + fonts |
| lifestyle.html | ≈1.1 MB | case images + before/after (webp via image-set) + mega-menu |
| real-estate.html | ≈1.1 MB | `paavani-cards.avif` 371 KB (preloaded `fetchpriority=high`) + case images + mega-menu |
| builds.html | ≈800 KB | case images + mega-menu |
| about.html | ≈650 KB | portrait + story images + mega-menu |
| 404.html | ≈600 KB | game assets (canvas-drawn, no images) + fonts |
| tools / changelog | ≈600 KB | mega-menu dominates |

> Homepage improved substantially since 08-02: sticky-featured cards moved from `.jpg` (455 KB + 384 KB) to `sfp-*.avif` triplets (≈365 KB total). The **site-wide dropdown thumb** remains the main remaining waste.

## Findings

1. **Playground video flood (B-H3)** — 10 × `preload="auto"` m4v = 4.53 MB. Largest: `pg-video-04` 1,045 KB, `pg-video-01` 822 KB. No posters, so LCP is a video first frame. → `preload="none"` + `poster` from `pg-*.avif` stills + viewport-gated `src` (IntersectionObserver already exists in `playground.js`).
2. **`paavani-cards.avif` in the dropdown (B-H2)** — 371 KB at 72×80 px, site-wide. Generate `mega-paavani.avif` ≈ 8 KB. On `real-estate.html` the same file is also a legit 800×640 card and is `preload`+`fetchpriority=high` — keep that usage, just swap the dropdown thumb.
3. **Before/after slider (lifestyle)** — `arvi-before.webp` 68 KB + `arvi-after.webp` 127 KB are served to modern browsers via `image-set()` (`lifestyle.html:475-476`); the ~1.5 MB `.png` fallbacks only load on legacy browsers. **OK as-is.** (Could add `.avif` into the `image-set` list for a further ~2× win — `arvi-after.avif` 78 KB exists.)
4. **Fonts** — preload + swap + preconnect is correct; no FOIT default (swap). ✅
5. **Caching (Vercel headers)** — images `immutable` 1 yr; CSS/JS 300 s; HTML revalidate. ✅
6. **Third-party JS:** unpkg `page-flip@2.0.7` (brahmi desktop) + Elfsight `platform.js` (brahmi, loads on desktop too — B-M4). Both are render-relevant for the flipbook; vendor page-flip locally to remove the unpkg dependency.
7. **CLS:** prior audit measured 0.0000–0.0101. All images in `<picture>` with explicit `width`/`height` (verified in build-nav, dropdown, index sfp) → dimensions reserved. ✅

## Quick-win ledger (effort → bytes)
| Fix | Effort | Savings |
|---|---|---|
| Dropdown thumb → 10 KB | 30 min | ~360 KB on **every** page |
| Playground `preload="none"` + posters | 2–4 h | 4.5 MB on playground |
| Add `.avif` to arvi image-set | 15 min | ~60 KB on lifestyle |
| Vendor page-flip + drop Elfsight | 2–3 h | ~100–200 KB + one less third-party on brahmi |
