# 10 — Responsive & Mobile UX

Re-verification of the mobile experience against the 08-02 audit (which graded Mobile UX a **C**, primarily due to the blank mobile flipbook).

## What works (verified)
- **No horizontal overflow at 390 px** — `css/mobile-fixes.css` forces `overflow-x:hidden`, clamps every media container (`feature-visual`, `gallery-tile`, `work-visual`, `idea-visual`, `devaiah-row img`, `about-story-image`, `teaser-visual`, `about-photo`, `cs-gallery`, `cs-interleave-image`, `cs-image-row`) and gives `height:auto !important`. ✅
- **Single-column degradation** on ≤700px for work-grid, teaser-grid, tool-groups, about-grid, resume-bottom, gallery-strip. ✅
- **Hamburger is 44×44** (mobile-fixes.css section 10). ✅
- **Mobile progress bar** below the hero (`.mobile-progress`, section 12). ✅
- **Compact-screen tweaks** for iPhone SE (≤380×720, section 11). ✅
- **Hero type sizing** scales `clamp(30px,9vw,60px)`, `text-wrap: balance`. ✅
- **Safe-area insets** respected in header/menu/close button. ✅
- **Reduced-motion** respected at mobile. ✅

## Breakpoints used
- ≤700px: nav hides, hamburger shows; single-column grids.
- ≤768px: mobile-fixes take effect; flipbook `mobile-only` variant shows, `desktop-only` hides.
- ≤900px: custom cursor off; horizontal scroll-jack off.
- ≤920px: devaiah rows collapse.
- ≥1024px: desktop lightbox active.
- ≥701px: navlinks show.

## Remaining issues

### Critical
1. **B-C1 (mobile flipbook blank)** — the whole reason Mobile UX scored C. On ≤767px the working PageFlip book is hidden and the Elfsight widget renders nothing. **Fix the flipbook on mobile (see 05 / 15).**

### Medium
2. **M4 touch targets (partial)** — remaining sub-44px interactive elements: `copy-email`, footer social links, `.teaser-link` (builds), `.resume-btn` font (has padding 8×18 — hit ~37px tall on desktop; hidden on mobile by design). Bump padding/min-height ≥44px on the interactive inline items.
3. **Playground videos on cellular** — `preload="auto"` on 10 videos (4.5 MB) is a hard mobile-data cost; also **no poster**, so tiles are blank (black) until playback on mobile (autoplay may be blocked). B-H3 fix directly improves mobile UX here.

### Low
4. **Real-estate card images** — a few cards still use `.jpg`-only (`.avif` twins exist). Not a layout issue, but mobile data cost.
5. **Lightbox is desktop-only (≥1024px)** — intentional; mobile relies on `playground.js` lightbox only on the playground page. Galleries on real-estate/lifestyle/brahmi have no mobile zoom. Consider extending the playground lightbox pattern site-wide on mobile.

## Verdict
Structural responsiveness is genuinely good (no overflow, sane breakpoints, safe-area handling, compact-screen tuning). The **single blocking mobile issue remains the Brahmi flipbook**, followed by the video/preload cost on the playground. Score once fixed: Mobile UX from C → A-.
