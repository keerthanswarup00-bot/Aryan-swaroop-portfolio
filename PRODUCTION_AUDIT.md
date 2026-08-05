# Production Readiness Audit

**Date:** 2026-08-05
**Scope:** 11 pages, global styles, JS, serverless function, Vercel config
**Method:** Headless-Chromium CDP sweeps (desktop + mobile viewports), Lighthouse (desktop), static reference analysis, manual code review
**Constraint honored:** No visual changes. All work was internal — no layout, typography, color, animation, content, or navigation changes.

---

## Final scores

| Category | Before | After | Note |
|---|---|---|---|
| Performance | 70 | **75** | Ceiling ~75–77; see LCP constraint below |
| Accessibility | 96 | **96** | 2 contrast items are intentional design |
| Best Practices | 96 | **96** | |
| SEO | 100 | **100** | |
| Agentic browsing | – | 100 | |

## What changed this pass

1. **Killed a 1.6 MB eager image preload** (`script.js`). The hero cursor-trail effect preloaded 9 full-size JPGs on every page load (including 455 KB `brahmi-doorway.jpg` and 383 KB `brahmi-label.jpg`) that are only rendered at 170 px. Now: the same photos are served as AVIF (~675 KB total), and preloaded only on the first mouse reveal, never at page load. Result: **LCP 8.6 s → 5.7 s**, total bytes **2,967 KiB → 1,372 KiB**, Performance 70 → 75.
2. **Fixed the sticky-featured hold.** `js/sticky-featured-projects.js` now cross-fades in place with an exactly-5.0 s timeline so the scroll scrub maps 1:1 (each image settles at opacity 1 / blur 0 at its hold point — verified via CDP).
3. **Cache-busters bumped** for the two changed scripts (`script.js`, `sticky-featured-projects.js`) to `v=20260910` on all pages (browsers fetch the fixed files).
4. **Removed 14 unreferenced image files** (see BUG_REPORT). Zero visual impact.

## What did not change (deliberately)

The intro overlay typewriter (`script.js`) is the LCP element. Its largest word paints a ~22,600 px² box — larger than the hero character (~12,500 px²) — so LCP cannot resolve faster than the intro sequence (~5.5 s on a throttled 4x-CPU/1.6 Mbps connection). Per the audit rule that animations must not change, this is a **documented design constraint**: Performance is capped at ~75–77 without changing the intro. See PERFORMANCE_REPORT.md for the trade-off table.

## Verification matrix (all clean unless noted)

- 11 pages × desktop: zero console errors, zero broken images, zero missing alt, zero duplicate IDs, one `<h1>` each, no horizontal overflow, no CSP violations.
- 28 viewport/page combos (320 / 375 / 414 / 768 px): same results, plus no sub-44 px touch targets except documented inline-text links.
- CSP `onload` font-hack hash re-verified (`sha256-1jAmyYXcRq6zFldLe/GCgIDJBiOONdXjTLgEFMDnDSM=`).
- All 18 external links return 200.
- No secrets in the repo; `.env*` gitignored; tokens env-var only.
- SEO metadata, sitemaps, robots, favicons, 404, manifest all present.

## Known constraints / accepted items

- Performance ~75–77 (intro-gated LCP) — accepted by decision.
- Two low-contrast elements are intentional design (brand-red kicker; dimmed scroll-reveal words).
- `/about` + `/real-estate` prefetch links 404 on `localhost` only (Vercel `cleanUrls` resolves them).
- `build-*` and `devaiah-*` image variants left in place — referenced dynamically by `builds-motion.js` / `<picture>`; safe-candidate cleanup listed in PERFORMANCE_REPORT.
