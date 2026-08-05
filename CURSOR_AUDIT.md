# Cursor System Audit & Production Enhancements

Commit: `0c02080` (plus `dcfcf42` prod audit, `e57bde7` sfp-5 swap) · 2026-08-05 · **Follow-up fix `dcaed72`**

## Follow-up: cursor invisible in production (2026-08-05)

Reported after deploy: the cursor was never rendered. Root cause: the JS-opt-in base rule `#cur{display:none}` added for `html.has-cursor` gating was never overridden — the `html.has-cursor #cur{...}` rule set position/size but **no `display`**, so `display:none` persisted and the cursor stayed hidden on every page (JS was still writing transforms). The original shipped without a base `display:none` rule, so this was a regression introduced by the gating change.

Fix: `display:block` added to `html.has-cursor #cur`. Also marked `.intro-overlay` `theme-dark` (index) so the dot is white during the intro animation. Cache-busters bumped to `?v=20260806`.

Re-verified (CDP, Brave): `display:block` + 18×18 on all 11 pages; **black dot** on light sections (about story), **white dot** on dark (index hero, about-hero, builds); **132px difference-blend invert disc with "VIEW"** over `.sfp-media`/`data-cur` images; reduced-motion/mobile gating unchanged.

Part 3 of the engagement: a complete audit of the custom cursor system (`script.js` + `style.css`) and a production-grade enhancement pass. **This was NOT a redesign.** Every approved visual and timing value was preserved exactly; the work was internal correctness, performance, and theme-awareness.

---

## 1. System architecture (as shipped)

- **18px dot** `#cur` (fixed, `z-index:9999`, `pointer-events:none`), positioned via `translate3d(...)` in a rAF loop; `width`/`height` eased toward the target size at `0.22`/frame. No trailing element.
- **Hover disc** `.invert` grows to **132px** (desktop ≥1024px) / **108px** on tablet-range widths, `mix-blend-mode:difference`, with an uppercase label (`span`, 0.22s opacity / 0.32s scale). Delegated `mouseover`/`mouseout` on `document` against `TARGET_SEL = [data-cur], [data-image-reveal], .sfp-media, .pg-item`.
- **Section theming** via `sectionTheme()`/`elementFromPoint`, historically applied on every `mousemove`.
- **Native cursor hidden** by `body { cursor:none }`.
- Gated on: `!prefersReducedMotion` AND `matchMedia('(hover:hover) and (pointer:fine)')`. CSS additionally hides `#cur` at `≤900px`, `prefers-reduced-motion:reduce`, and `hover:none / pointer:coarse`.

## 2. Issues found & fixed

| # | Finding | Fix | File |
|---|---|---|---|
| 1 | **Invisible dot on light pages** — `applyTheme` early-returned when the page default equaled the init theme, so `cursor-dark`/`cursor-light` was never applied and the white dot disappeared on paper backgrounds (reproduced on about.html) | Theme is now (a) applied at init via an explicit class toggle and (b) re-evaluated lazily from the RAF loop on mousemove (debounced with a `moveDirty` flag), so it converges even when the init default matches | `script.js` |
| 2 | **Double cursor over images** — a global `img{cursor:pointer}` re-showed the native pointer over images (e.g. `.feature-visual`) while the custom disc was active | Native-cursor hiding gated behind `html.has-cursor` (added in the cursor-init block) | `style.css`, `script.js` |
| 3 | **`elementFromPoint` in the mousemove event path** — synthetic ×3000 mousemove storm cost **163.8ms** of handler time (jQuery-lightbox attaches ~21 extra window listeners, all re-hit-testing) | Hit-testing moved into the RAF loop; the event handler is now `{ passive:true }` and only stores `tx/ty` + `moveDirty` | `script.js` |
| 4 | **Style writes every frame** — `transform`/`width`/`height` were written 60×/s regardless of movement | Writes skipped when `px/py/size` are unchanged from last frame (3 state vars); `will-change:transform` added | `script.js`, `style.css` |
| 5 | **Reduced-motion rule lost specificity war** — `body{cursor:auto}` could lose to `html.has-cursor body{cursor:none}` | `cursor:auto !important` in all three gating media blocks | `style.css` |
| 6 | Theme markers were missing/ambiguous on several sections | Added `theme-dark` section markers (below) + `data-cur="VIEW"` on both devaiah gallery rows | 5 HTML pages |

Theme markers added: `site-header` (all 11 pages via `scripts/build-nav.mjs` → `npm run build:nav`), index `#brahmi` feature, `about-hero`, real-estate `#paavani` feature + devaiah rows, all 4 lifestyle features, playground `.pg-page`, plus pre-existing `page-dark` (builds, work/brahmi, work/paavani).

## 3. Theme-aware color switching (Phase 4)

- White dot (`cursor-light`) on dark sections, black dot (`cursor-dark`) on light sections — **0.2s CSS color transition**, no flicker (per-section resolution runs at frame rate, not per event).
- No hardcoding: driven by `sectionTheme()` walking ancestors for `theme-dark`/`theme-light` classes and a `page-dark` fallback. Adding a `theme-dark` class to any section is sufficient.
- The `.invert` hover disc is declared **after** `.cursor-dark`/`.cursor-light` in `style.css`, so the approved white `difference`-blend disc always wins during hover regardless of section theme. Confirmed by computed-style inspection.

## 4. Verification results (headless Brave, CDP, `localhost:8000`)

- **Perf:** synthetic mousemove ×3000 handler cost **163.8ms → 9.1ms (−94%)**. Idle measurement is dominated by the approved homepage hero-trail `getBoundingClientRect` loop (~180 layout/s) and the intro overlay — neither touched. Cursor itself does **0 style writes** when parked (verified `#cur` styles static during idle).
- **Light page (the original bug):** about.html `bg rgb(250,250,248)` → `cursor-dark` applied, dot visible.
- **Dark hero:** index hero → `cursor-light` (white) applied.
- **Hover disc:** target hover → `invert:true`, `label:true`, `width:132px`, label text ("PLAY"); leave → animates back to 18px.
- **Accessibility gates:** `prefers-reduced-motion:reduce` → `#cur{display:none}`, no `has-cursor` class, native cursor restored. 390px mobile (coarse pointer) → `#cur` hidden, no `has-cursor`. Touch/selection unaffected (`pointer-events:none`, no user-select override on the dot).
- **All 11 pages:** `#cur` present, `has-cursor` set, `site-header theme-dark`, uniform `?v=20260805` cache-busters, exactly one `<h1>`, **zero broken images** (lazy-load pass accounted for).
- **JS:** `node --check` clean, no console exceptions during any test run.
- **Hero unchanged:** homepage hero markup, `.hero-line` colors, trail, and overlay are untouched; the only index change is the `theme-dark` class on the `#brahmi` feature section.

## 5. Cache-busters & deployment

- `script.js?v=20260805` and `style.css?v=20260805` applied uniformly across all 11 pages (was drifting: some pages still served `20260831`).
- Committed and pushed to `origin/main` (`0c02080`); Vercel auto-deploys.

## 6. Deliverables checklist

- [x] Cursor visuals/timing identical (18px dot, 132/108px difference-blend disc, `translate3d`, 0.22 easing, 0.2s color transitions)
- [x] Light-page dot visibility bug fixed
- [x] No double cursor over images
- [x] Theme-aware color switching, scalable via `theme-dark`/`theme-light` markers
- [x] Mousemove handler cost cut 94%
- [x] Zero cursor writes while parked
- [x] Reduced-motion, ≤900px, and coarse-pointer gates verified
- [x] All 11 pages consistent, no broken images, no console errors
- [x] Homepage hero untouched
- [x] Committed + pushed, Vercel deployment auto-triggered
