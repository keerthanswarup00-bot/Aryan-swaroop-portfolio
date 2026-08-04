# 15 — Priority Fix Plan

Consolidated, ordered remediation plan. Each item references the finding ID from `05_Bugs.md` and the supporting doc. **"Prior audit" status** confirms the 08-02 findings are all still open except where noted (the homepage sticky-featured AVIF swap was already applied).

## Week 1 — correctness (user-visible bugs)

| # | Fix | Ref | Effort |
|---|---|---|---|
| 1 | **Re-enable the flipbook on mobile** — reuse `js/flipbook-desktop.js` PageFlip book with portrait-friendly sizing + larger tap zones; remove the Elfsight widget + `platform.js` script; remove the inline `style` dup on `.premium-flipbook-wrapper`. Optionally vendor `page-flip` from unpkg. | B-C1, B-M4, B-M5, B-L5 | Half day |
| 2 | **Fix stale "View Live" link** → real product URL or remove. | B-H1 | 5 min |
| 3 | **Fix `browserconfig.xml`** → generate a real `mstile-150x150.png` (favicon source exists in `archive/favicon-source/`) or drop the `<square150x150logo>` entry. | B-H4 | 15 min |
| 4 | **Playground videos** → `preload="none"` + `poster` from `pg-*.avif` stills + viewport-gated `src` (reuse the existing IntersectionObserver in `playground.js`). | B-H3 | 2–4 h |

## Week 2 — performance & consistency

| # | Fix | Ref | Effort |
|---|---|---|---|
| 5 | **Right-size the dropdown thumb** → generate `mega-paavani.avif` (~8 KB, matching the other mega-* images) for the Design mega-menu; keep `paavani-cards.avif` for the real-estate card. | B-H2 | 30 min |
| 6 | **Generate the footer from `build-nav.mjs`** (moves `foot-bottom` to all pages) — fixes footer drift on about/changelog/playground. | M2 | 1 h |
| 7 | **Fix heading skips** on about/real-estate/builds (card/story titles → `h2`, resume sections → `h3`). | M3 | 30 min |
| 8 | **Enlarge remaining touch targets** ≥44 px (`copy-email`, footer socials, `.teaser-link`). | M4 | 1–2 h |

## Week 3 — hardening & hygiene

| # | Fix | Ref | Effort |
|---|---|---|---|
| 9 | **Add a CSP** to `vercel.json` (allowlist `self` + fonts.googleapis/gstatic + unpkg + allowed frame origins; `unsafe-inline` for styles). | M6 | 2–4 h |
| 10 | **Delete dead JS** (`turn.js`, `premium-flipbook.js`, `bean-trail.js`, `kolam-reveal.js`, `AssetLoader.js`) + trim unused kolam/bean CSS rules. | L1 | 30 min |
| 11 | **Mega-menu keyboard/focus** — `:focus-within` open + focus-out close. | 08 §2 | 30 min |
| 12 | **Contrast bumps** (`.mobile-subtitle`/`.mobile-cs-desc` → ≥.55, `.mobile-project-sub` → ≥.48). | L4 | 15 min |
| 13 | **Add privacy-friendly analytics** (Plausible/Umami). | M1 | 1–2 h |
| 14 | **Decide on `api/manifest.js`** — document as intentionally public or gate behind an admin token; then `git add package-lock.json` + prune redundant `gsap`/`lenis` npm deps. | B-H5, 11 §package-lock | 1 h |

## Optional / nice-to-have
- `cursor:none` only after JS initializes (B-M6); sr-only game controls hint + `<noscript>` for `#game`/flipbook (08 §6–7); `srcdoc=""` on the VR iframe (L3); add `.avif` to arvi `image-set` (06 §4); testimonials + compressed `brahmi-brand.pdf` (13); rename `ishav-guards-guards.*` (L2/13).

## Success criteria (when to re-audit)
- Mobile Brahmi case study shows the 44-page book on a real phone. ✅ C1
- Playground total transfer < 1.5 MB with posters + lazy video. ✅ H1
- Site-wide dropdown/menu images ≤ 20 KB each. ✅ H2
- `foot-bottom` + sequential headings on all 11 pages. ✅ M2/M3
- No dead JS files; CSP live; analytics reporting. ✅ L1/M6/M1
