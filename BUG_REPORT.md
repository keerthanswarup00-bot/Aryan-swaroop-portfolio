# Bug Report

**Date:** 2026-08-05 | Findings from CDP sweeps, Lighthouse, and static analysis

Severity: **Fixed** = resolved this pass · **Accepted** = deliberate/design, documented · **Info** = benign

---

## Fixed

### F1 — 1.6 MB eager image preload on every page load (perf)
`script.js` preloaded 9 full-size JPGs for the hero cursor-trail at parse time. **Fixed** — switched to AVIF + on-interaction preload. See PERFORMANCE_REPORT.

### F2 — Sticky-featured: final image never settled (visual hold bug)
`js/sticky-featured-projects.js` had a 4.5 s timeline mapped over 5 viewports, so the last image could never settle at its hold point. **Fixed** — cross-fade-in-place + trailing hold, timeline exactly 5.0 s. Verified via CDP (every image reaches opacity 1 / blur 0 at its hold). Cache-buster bumped to `v=20260910`.

### F3 — 14 orphan images bloating the repo (housekeeping)
Deleted: `advocate-grid.jpg`, `brahmi-packaging-1..3.{avif,webp}`, `brahmi-stickers.{avif,webp}`, `nav-avatar-400.jpg`, `nav-avatar-800.jpg`, `nav-avatar.{avif,webp}`, `devaiah-plotmap.jpg`. Zero references (static + dynamic); all 11 pages re-verified with zero broken images.

---

## Accepted / documented (no visual change allowed)

### A1 — LCP is gated by the intro overlay (perf)
The intro typewriter is the largest painted element, capping LCP at ~5.7 s and Performance at ~75–77. Keeping per decision. Full trade-off table in PERFORMANCE_REPORT.md.

### A2 — Low-contrast items (a11y, 2 nodes)
- `.kicker` in hero: `#c41e3a` on dark, contrast 3.3:1 (AA large-text passes at ≥3:1; this is small text).
- `#srtParagraph .srt-word` at `opacity: 0.25`: contrast 1.74:1 — the dimmed state is the scroll-reveal design (words animate to full opacity on scroll).

Both require a color/opacity change to pass; left as-is.

### A3 — Touch targets under 44 px (a11y, minor)
- `button.copy-email` (footer): 194×17 px — below the WCAG 2.2 *minimum* 24 px. Recommend ≥24 px next CSS pass.
- `a.floating-character` (game link): 25×42 px.
- Footer LinkedIn/Behance links and teaser "View projects →" links (~16–20 px tall): inline-text links, exempt under WCAG 2.5.8.
- `nav-dropdown-trigger` / `resume-btn` / `macbook-scroll-badge`: 44 px at 768 px — the 44 px minimum applies at the mobile breakpoint; these sit at the desktop boundary. No change made.

### A4 — Prefetch 404s on localhost (harmless)
`<link rel="prefetch" href="/about">` + `/real-estate` return 404 on `server.py` (no clean URLs). On Vercel `cleanUrls` resolves them; the two `errors-in-console` entries are this, and only this.

---

## Info / pre-existing (not regressions)

### I1 — Lightbox placeholder images report `naturalWidth === 0`
`.lb-img` inside `.lb-stage` start with no `src` (assigned on open). Benign; not broken.

### I2 — Sticky-featured 5th card aspect
The 5th `.sfp-media` renders 742 px tall vs 630 px for the others (aspect-ratio of the source art in `css/home-rebuild.css`). Pre-existing, not caused by the hold fix.

### I3 — Brahmi mobile flipbook is blank (known, out of scope)
Unconfigured Elfsight widget on `work/brahmi.html`; the working book is `js/flipbook-desktop.js` (desktop ≥768 px). Plan: `AUDIT/15_Priority_Fixes.md` item 1. Elfsight intentionally not allowlisted in the CSP.

### I4 — `build-*` / `devaiah-*` image variants kept on purpose
Referenced dynamically by `builds-motion.js` (`b.img + '-400.avif'` etc.) and `<picture>` srcsets. Static scans mis-report them as orphans; do not delete without a dynamic-reference-aware sweep.
