# Performance Report

**Date:** 2026-08-05 | Lighthouse desktop against the local build (throttled 4x CPU / 1.6 Mbps)

## Headline numbers

| Metric | Before | After | Goal (LH) |
|---|---|---|---|
| Performance score | 70 | **75** | 95* |
| LCP | 8.6 s | **5.7 s** | 2.5 s |
| FCP | 2.6 s | 2.5 s | 1.8 s |
| Speed Index | 3.1 s | 2.9 s | 3.4 s |
| TBT | 40 ms | 0 ms | 200 ms |
| CLS | 0.002 | 0.002 | 0.1 |
| Total bytes | 2,967 KiB | **1,372 KiB** | — |

\* not reached — see constraint below.

## Root cause found and fixed

`script.js` eagerly preloaded 9 full-size JPGs (`new Image()` on load) for the hero cursor-trail effect, even though the effect only renders 170 px polaroids on mouse interaction. This added ~1.6 MB of parser-time network work that competed directly with the LCP image and shifted the entire page timeline later.

**Fix (no visual change):**
- Image list switched to AVIF (same artwork; ~675 KB total vs ~1.6 MB).
- Preload moved from load-time to the first mouse reveal (`enableReveal`), so LCP is never blocked.
- Added an `onerror` fallback to JPG for browsers without AVIF.

Net: LCP 8.6 → 5.7 s; bytes 2,967 → 1,372 KiB; Performance 70 → 75.

## Constraint: LCP is gated by the intro overlay (accepted)

The LCP element is the intro typewriter text (`#intro-text`), not the hero image. Its largest painted box (~22,600 px²) exceeds the hero character (~12,500 px²), so LCP equals the time the intro finishes typing (~5.5 s under Lighthouse throttling). The overlay is a designed animation.

Per the audit rule "no visual changes (animations included)", the user chose to keep it. Trade-offs for future work:

| Option | LCP | Perf | Visual change |
|---|---|---|---|
| Keep intro as-is (chosen) | ~5.7 s | 75–77 | none |
| Compress intro timing only | ~2.5 s | ~86–88 | intro duration only |
| Compress intro + async/defer game modules + minify scoped CSS | ~2.0 s | ~90+ | intro duration only |

If the intro is ever reconsidered, the quick win is reducing the `setTimeout` chain in `script.js` (words array / 350 ms holds) — the design, words, and sequence can stay identical.

## Secondary findings (localhost-only, auto-resolved in production)

- `cache-insight` (1,034 KiB): `server.py` sends no cache headers. Vercel sends `immutable` for `/images/*` and 300 s for CSS/JS per `vercel.json`. Production-OK.
- `document-latency-insight`: gzip is off on `server.py`; Vercel gzips automatically.
- `network-dependency-tree-insight`: the endless-runner game is a 15-file ES module graph. Bundling would help slow connections but is a larger refactor.

## Weight budget (current)

- Images: ~1.1 MiB (all AVIF/WebP-first, lazy below the fold)
- JS: ~200 KiB (vendored GSAP/ScrollTrigger + page scripts, deferred)
- CSS: ~90 KiB (one global minified file + scoped sheets)
- Fonts: Fraunces + Inter (swap) via Google Fonts with a hash-pinned preload

## File-size audit (Phase 1, for reference)

| Asset | Size |
|---|---|
| `style.css` (minified global) | 39 KB |
| `css/macbook-scroll.css` | 40 KB |
| `css/home-rebuild.css` | 15 KB |
| `css/builds.css` | 13 KB |
| `css/mobile-fixes.css` | 10 KB |
| `js/vendor/gsap.min.js` + `ScrollTrigger` | ~150 KB |
| Largest on-page images | `mega-*` ~120–160 KB each (AVIF) |

## Recommended follow-ups (require a visual/behavior decision)

1. **Intro timing compression** (biggest lever; see table).
2. **Trim unused CSS/JS**: Lighthouse estimates −25 KiB CSS and −48 KiB JS on the homepage. Zero visual change, modest gain.
3. **Bundle the game modules** for slow connections.
