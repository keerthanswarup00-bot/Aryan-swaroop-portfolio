# 03 — Components

Inventory of the shared UI components and their per-instance issues. All components live in `style.css` (minified global) unless noted.

---

## Skip-to-content link
Every page: `<a href="#main" class="skip-link">Skip to content</a>` at the very top. CSS: `.skip-link` absolute-positioned, revealed on `:focus-visible`. ✅ Present and functional on all 11 pages.

## Custom cursor
- Pattern: `body { cursor: none; }` + a fixed `#custom-cursor` div with a radial-gradient dot + trailing element, animated in `script.js` (move/tap/pointer events, `prefers-reduced-motion` bypass). Only becomes active via `@media (hover:hover) and (pointer:fine)`.
- **Issue:** hard `cursor:none` on `body` while the *live* cursor element is JS-animated. If `script.js` fails to load (ad-blocker collision, CDN issue), the whole site has no visible cursor on desktop. `@supports`/progressive-enhancement fallback would be safer: keep `cursor:none` only after JS confirms the cursor is alive.

## Header + Design mega-menu (`dropdown.js`)
- One shared `scripts/build-nav.mjs` exports `HEADER_HTML` and `MOBILE_MENU_HTML`; both are injected via `dropdown.js` into `#designDropdown` / `#mobileMenu` on every page. Single source of truth — good.
- Desktop: `.design-dropdown` opens on hover AND focus-within; contains 5 mega-cards (nav-avatar + 4 project previews). `aria-haspopup`, `aria-expanded` toggling present.
- **Issue:** the mega-menu ships `paavani-cards.avif` (371 KB) on **every** page load, even though it's only visible on hover of "Design". All other mega-menu images total ≈ 40 KB — `paavani-cards.avif` is ~92% of the menu's image weight. Should be a real thumbnail or swapped in on open — see 06.
- Keyboard: links inside are tabbable; menu doesn't close on `Escape` (minor a11y gap).

## Mobile menu
- Hamburger button 44×44px (mobile-fixes.css), injects `MOBILE_MENU_HTML`; toggles `.open`, locks scroll (`body.no-scroll`), closes on link click. Focus not trapped (acceptable for menu with links; minor).

## Hero (home)
- Two `h1` lines split into chars and animated with GSAP stagger; reveal images (portrait + reel) masked by `.clip-path` reveal; stats row 302+/30+/50+ with count-up (JS, fallback static text). Reduced-motion: animations disabled, static layout.
- `#reel` video poster handling ok. ✅

## Work grid cards (real-estate / lifestyle / builds)
- `.work-grid` responsive 2/3-col; each `.work-card` = figure + overlay + title + tags + link.
- **Issue:** heading order `h1 → h3` inside cards on real-estate and builds (skips h2) — a11y; and card images often use `.jpg` only despite `.avif` triplets existing (06).

## Sticky featured stack (`sticky-featured-projects.js`, home)
- GSAP/ScrollTrigger pinned container; cards stack/fan on scroll; static fallback layout without JS. Reduced-motion handled. ✅
- **Note:** since the 08-02 audit the cards were converted to `sfp-*.avif/.webp/.jpg` `<picture>` triplets (verified `index.html:438-471`) — the prior heavyweight `.jpg` issue here is resolved.

## Flipbook (work/brahmi)
- Desktop ≥768px: `.fb-desktop` → `js/flipbook-desktop.js` builds a PageFlip book from `/images/brahmi/page-01…44.jpg` (3 MB total). Prev/next arrows, page counter, arrow-key support, `focusable` pages. Loads `page-flip@2.0.7` from unpkg at runtime (external dependency).
- Mobile <768px: `.cs-flipbook-embed` → **Elfsight "Untitled Flipbook" widget** (`work/brahmi.html:314-315`), known to render blank (confirmed headless in prior audit). **This is finding C1.** The desktop book is explicitly hidden ≤767px (`desktop-only`/`mobile-only` toggles, premium-flipbook.css:201-208), so mobile gets nothing.
- Styling drift: inline `style` on `.premium-flipbook-wrapper` (line 301) duplicates CSS file rules.
- The Elfsight `<script async>` executes on desktop too (it sits in a `display:none` subtree but still loads).

## Before/after compare slider (`before-after.js`, lifestyle → Arvi Hospital)
- **2026-08-04 redesign (premium editorial):** kept the drag interaction, replaced the whole visual language — `.compare-stage` breakout box (≤1200px, 16:9, `border-radius:28px`, `1px solid rgba(255,255,255,.08)` border, `0 20px 60px rgba(0,0,0,.35)` shadow), 2px white divider, 48px glass handle (`rgba(10,10,10,.85)` + `blur(12px)` + white ↔ SVG; 40px on mobile), uppercase `Before`/`After` corner labels, AVIF→WebP→PNG `<picture>` triplets with real `loading="lazy"`/`decoding="async"` (resolves old finding 06), `alt` on both images.
- Interaction: drag anywhere on the slider (`pointerdown` + `setPointerCapture`), `touch-action: pan-y` so vertical page-scroll still works on mobile, no hover mode, no autoplay. While dragging: handle `scale(1.08)`, divider opacity `.4 → .8`. Keyboard: ←/→ (±5, Shift ±10), Home/End. A11y: `role="slider"` on the handle, `aria-valuemin/max/now`, `role="group"` + label on the container, `:focus-visible` red outline.
- Entrance: one-time IntersectionObserver reveal (`opacity 0→1`, `translateY(40px)→0`, `scale .98→1`, 0.9s `cubic-bezier(.22,1,.36,1)`) + `clip-path: inset(100% 0 0 0) → inset(0)` mask unveil (1s); the preceding "Applied Across the Brand" gallery (`gallery-strip.compare-prev`) fades to `.45`. `prefers-reduced-motion` and no-`IntersectionObserver` bypass the animation entirely (static split at 50%); no-JS fallback = CSS-only 50% split with both images visible.

## Lightbox (`lightbox.js`)
- Desktop-only (`≥1024px`); binds to `.feature-visual`, `.gallery-tile`, `.work-visual`, `.idea-tile`, `.devaiah-row img`; full-screen overlay, ESC/click to close, focus moved on open/restored on close, no scroll. **Issue:** mobile users get no lightbox/zoom on galleries (a deliberate choice per code comment, but playground now has its own mobile-friendly lightbox — the old one could be extended).

## Playground gallery (`playground.js`)
- Buttons (`<button class="pg-item" aria-label="View image">`) → desktop lightbox; IntersectionObserver autoplay/pause for videos. ✅ a11y-correct; `aria-label="View video"` for video tiles (verified).

## Footer
- Shared: brand block, 4 nav columns, design-project column, social links, `foot-bottom` (© 2025 Aryan Swaroop · "Built with care…" + year JS).
- **Issue:** `foot-bottom` (copyright row) missing on **about, changelog, playground** — inconsistent site-wide footer.

## Intro overlay (`script.js`)
- Dark overlay that slides up on load (home/about/etc.), respects reduced-motion. ✅

## Reading-progress rail (work/paavani)
- Fixed left rail, height = scroll progress via ScrollTrigger. ✅ decorative only.

## Reveal-on-scroll (`reveal-on-scroll.js`, work/*)
- `.reveal-block`/`.reveal-child` IntersectionObserver, threshold + `once`. ✅

## Blend selector (`blend-selector.js`, work/brahmi)
- `.blend-btn` group switches `.blend-photo` visibility for packaging-variant photos. ✅

## Search tooling note
No search/filter component exists; none required for a portfolio.
