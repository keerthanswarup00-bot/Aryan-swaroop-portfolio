# 08 — Accessibility

Assessed against WCAG 2.1 AA. The site's a11y foundation is strong (carried from prior audits and re-verified in current source).

## Verified strong (no action)
- **Skip-to-content** link first in every page (`.skip-to-content`, revealed on `:focus-visible`). ✅
- **`:focus-visible` outlines** site-wide (`style.css`), with page-specific white outlines on dark components (`.btn`, `.nav-cta`, `.hamburger`, `.overlay-resume`). ✅
- **Comprehensive `prefers-reduced-motion`**: CSS kills animations/transitions and hides the custom cursor (`#cur{display:none!important} body{cursor:auto}`); each JS animation module checks it (game intro, hero chars, home-motion horizontal, storytelling, sticky-featured, before-after intro). ✅
- **Semantic landmarks**: `<header>`, `<nav>`, `<main>`, `<section aria-label>`, `<footer>`; single `<h1>` per page. ✅
- **Alt text** on every content `<img>` (only `lb-img` is a JS-populated lightbox placeholder — benign). ✅
- **Playground tiles** are `<button class="pg-item" aria-label="View image / Play video">` — properly focusable and labeled. ✅
- **Flipbook (desktop)** has prev/next buttons with `aria-label` + arrow-key support + focusable pages. ✅
- **Before/after slider** keyboard arrows + pointer capture + `touch-action: pan-y`. ✅
- **Buttons vs. links**: nav trigger is `<button>`, menu close is `<button>`, tiles are `<button>`, links are anchors — correct roles. ✅
- **Reduced-motion static fallbacks** for GSAP sections verified (`.csx` static layout, `.sfp` stacked fallback, `.cs-story` static). ✅

## Issues to fix

### High
1. **Heading hierarchy skips (M3)** — `real-estate.html` & `builds.html`: `h1 → h3` (work-card titles); `about.html`: `h1 → h3` (story blocks) and `h2 → h4` (resume sections). Fix by re-leveling card/story titles to `h2` and resume section headings to `h3`. ~30 min.

### Medium
2. **Mega-menu not keyboard-openable** — confirmed in `script.js:265-272`: the menu opens only on `mouseenter` (desktop) or `click` (which on desktop just toggles, but the trigger's natural `Enter` keypress doesn't fire click for a `<button>`? it does — buttons activate on Enter/Space, so **click works for keyboard**; however `mouseleave` isn't the problem — the real gap is that focusing the trigger does not *reveal* the panel, and the CSS panel is `visibility:hidden; pointer-events:none` so its links are unfocusable until `.open` is applied). Practically: a keyboard user can `Tab` to "Design", press Enter (→ `.open` via the click handler — works), then Tab into links; but `Escape` (`script.js:273`) removes `.open` without moving focus and the panel doesn't re-open on focus. Cleaner: add a `:focus-within` rule for `.mega-menu-root` so the panel stays open while any descendant is focused, and close on focus-out. ~30 min.
3. **Touch targets < 44 px (M4, partial)** — hamburger is now 44×44 on mobile (fixed via `css/mobile-fixes.css`), but: `copy-email` (padding 0, ~13px tall), footer social links, `.teaser-link` ("View Live", ~12.5px font, no padding), `.resume-btn` on small screens (hidden ≤700px — by design). Enlarge padding/min-height on interactive inline elements. 1–2 h.

### Low
4. **Contrast under AA (L4)** — `.mobile-subtitle` at `rgba(255,255,255,.45)` ≈ 4.2:1 and `.mobile-project-sub` at `rgba(255,255,255,.3)` ≈ 1.8:1 (on #000) are below 4.5:1 for small text. Bump to ≥ .55 and ≥ .48 respectively. `.mobile-cs-desc` (.45) ≈ 4.16:1 — bump to .55. 15 min.
5. **Custom cursor risk (B-M6)** — `body{cursor:none}` without JS fallback. If `script.js` is blocked, desktop shows no cursor. Prefer: apply `cursor:none` only after cursor JS initializes (e.g. set a class on `body`), keep default cursor otherwise.
6. **Game controls discoverability** — the endless runner uses Space/↑/W + tap; instruction text is drawn on canvas (not in DOM). Add a visible/sr-only control hint near the canvas (keyboard users and screen-reader users get no instructions otherwise).
7. **No `<noscript>` fallback text** for `#game` and the flipbook section (blank canvas/area with JS disabled).

## Form audit
No forms exist (contact = `mailto:` in footer). N/A. If a form is ever added: labels, focus, and `aria-required` apply.
