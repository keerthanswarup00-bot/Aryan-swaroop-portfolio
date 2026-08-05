# Changelog — Production-Readiness Pass (2026-08-05)

No visual changes in this pass.

## 2026-08-05 — Audit fixes (uncommitted → this push)

### Performance
- **`script.js`** — hero cursor-trail images switched from JPG to AVIF; eager load-time preload replaced with first-interaction preload (`enableReveal`); added JPG `onerror` fallback. LCP 8.6 s → 5.7 s, total bytes 2,967 KiB → 1,372 KiB, Lighthouse Performance 70 → 75.
- **`index.html`** (and all pages) — `script.js` cache-buster `v=20260831` → `v=20260910`; `sticky-featured-projects.js` `v=20260812` → `v=20260910`.

### Bug fixes
- **`js/sticky-featured-projects.js`** — sticky-featured timeline made exactly 5.0 s (in-place cross-fade + trailing hold) so the scroll scrub maps 1:1 and every image settles at its hold point.

### Housekeeping
- Removed 14 unreferenced images (`advocate-grid.jpg`, `brahmi-packaging-1..3.avif/.webp`, `brahmi-stickers.avif/.webp`, `nav-avatar-400.jpg`, `nav-avatar-800.jpg`, `nav-avatar.avif/.webp`, `devaiah-plotmap.jpg`).

### Deliverables added
- `PRODUCTION_AUDIT.md` — full audit scope, scores, constraint summary.
- `SEO_REPORT.md` — SEO 100 verified (metadata, sitemaps, robots, OG).
- `PERFORMANCE_REPORT.md` — before/after metrics, LCP root cause + constraint trade-offs.
- `BUG_REPORT.md` — findings with severity and resolution status.
- `CHANGELOG.md` — this file.

---

### Prior work in this tree (from the previous session, pending commit)
- Header & mobile menu redesign (avatar 44 → 52 px, nav height 68 → 90 px, macbook badge 44 px touch target), cache-busters `20260906`/`20260907`.
- See `REMEDIATION_REPORT_2026-08-03.md` for the earlier remediation pass.
