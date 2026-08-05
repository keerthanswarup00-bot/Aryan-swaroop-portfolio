# 00 — Project Overview

**Audit date:** 2026-08-03
**Audit scope:** Complete zero-assumption review of the entire repository — every HTML page, stylesheet, script, serverless function, config file, asset, and document.
**Repo root:** `Aryan Swaroop Portfolio/`

---

## 1. What this is

A hand-coded, static **single-developer design portfolio** for Aryan Swaroop — Brand Designer & Creative Lead based in Bengaluru. It showcases brand identity systems (real estate + lifestyle), 3D visualization, video production, and web products. The site deliberately presents itself as a *portfolio first*, with several self-built interactive showpieces (custom cursor, mega-menu, endless-runner canvas game, interactive 3D flipbook, before/after slider, storytelling scroll sections).

## 2. Technical stack (as actually used)

| Layer | Technology |
|---|---|
| Markup | Vanilla HTML5 (11 pages), no templating, no build step |
| Styles | One minified global `style.css` + 8 scoped stylesheets in `css/` (loaded per page) |
| Scripts | Vanilla JS (IIFE modules + ES modules for the game), GSAP 3.15, ScrollTrigger, CustomEase, Lenis (all vendored under `js/vendor/`) |
| Fonts | Google Fonts: Fraunces (serif display) + Inter (sans) via `preload` + async swap |
| Backend | One Vercel serverless function `api/manifest.js` using `@vercel/blob` |
| Dev tooling | `scripts/build-nav.mjs` (single source of truth for nav markup); `server.py` (local Python server with an admin image-upload endpoint) |
| Hosting | Vercel project `aryan-swaroop-portfolio-9hor`, domain `https://www.aryanswaroop.com`, clean URLs enabled |

## 3. Site map

| Page | Path | Purpose | Indexable |
|---|---|---|---|
| Home | `/` (`index.html`) | Hero, intro claim, featured Brahmi story, horizontal work, sticky featured stack, game | yes |
| About | `/about` | Story, experience, resume | yes |
| Real Estate | `/real-estate` | Paavani / Sidvin / Royal Farm / VR Devaiah case tiles + galleries | yes |
| Lifestyle | `/lifestyle` | Brahmi coffee, Isha V, Snehaloka | yes |
| Builds | `/builds` | Selixo, AlbumFlow, Striv, Foundations (web products) | yes |
| Tools | `/tools` | Skills groups + resume download | yes |
| Playground | `/playground` | 11-image / 10-video editorial gallery | yes |
| 404 / Game | `/404` | Custom 404 with endless-runner game | yes (`/404`) |
| Work — Brahmi | `/work/brahmi` | Brahmi Coffee Roasters case study (44-page flipbook) | yes |
| Work — Paavani | `/work/paavani-properties` | Paavani Properties case study (stats, process, VR embed) | yes |
| Changelog | `/changelog` | Site update history | **noindex** (correct) |

`sitemap.xml` lists 9 indexable URLs (all of the above except changelog). `robots.txt` allows all crawlers plus 16 explicitly named AI bots and disallows `/api/`.

## 4. Notable strengths (verified in code)

- **SEO / structured data:** unique titles, descriptions, canonicals, Open Graph + Twitter cards, and valid JSON-LD (Person, WebSite, WebPage, BreadcrumbList, CreativeWork, ImageObject) on every page.
- **AI discoverability:** `llms.txt`, explicit AI-bot allowances in `robots.txt`, sr-only AI summary blocks, `security.txt`, `humans.txt`.
- **Accessibility foundations:** skip-to-content, `:focus-visible` outlines, extensive `prefers-reduced-motion` handling in both CSS and JS, semantic landmarks, alt text everywhere, keyboard support on the flipbook.
- **Performance discipline:** AVIF/WebP/JPG triplets for most images, `loading="lazy"` + `decoding="async"`, font preload/preconnect, aggressive Vercel caching (`immutable` 1 yr for images).
- **Code organization:** game engine cleanly split into small ES modules; nav generated from one source of truth; every page uses a consistent `?v=YYYYMMDD` cache-busting pattern.

## 5. Headline issues (full details in 05 and 15)

1. **Critical — blank mobile flipbook:** `work/brahmi.html:314-315` still uses an unconfigured Elfsight "Untitled Flipbook" widget for the mobile-only version; the desktop `PageFlip` book (`js/flipbook-desktop.js`) works but is desktop-only (`≥768px`). Mobile visitors of the flagship case study see an empty section.
2. **High — stale CTA:** `builds.html:323` "View Live →" links to `https://aryanswaroopportfolio.vercel.app` (an old deployment of this portfolio).
3. **High — page weight:** `playground.html` loads 10 videos with `preload="auto"` (~4.6 MB); the shared nav dropdown ships an oversized `paavani-cards.avif` (371 KB) at ~72×80 px on every page.
4. **Broken asset reference:** `browserconfig.xml` references `/mstile-150x150.png`, which does not exist in the repo.
5. **Nothing from the 2026-08-02 audit was fixed:** every Critical/High/Medium finding in `AUDIT_REPORT_2026-08-02.md` is still present in the current source.

## 6. Prior audits (context)

| Report | Date | Verdict | Status of findings |
|---|---|---|---|
| `PRODUCTION_AUDIT_REPORT.md` | 2026-07-28 | 94/100 (SEO/tech/AI) | Describes fixes already applied |
| `SEO_CHANGELOG.md` | 2026-07-28 | — | Per-file change log of the SEO pass |
| `RELEASE_NOTES.md` | 2026-07 | v1.0 → v2.0 | Feature history |
| `AUDIT_REPORT_2026-08-02.md` | 2026-08-02 | B+ (87/100) | **All open items still reproduce today (verified in this audit)** |

## 7. How to run

- `npm run build:nav` — regenerates the shared header/mobile-menu HTML from `scripts/build-nav.mjs`.
- `python3 server.py` — local server (note: it 404s extensionless paths; Vercel's `cleanUrls` is what makes `/real-estate` work in production).
- Vercel serves the repo directly; no build step (only `build:nav` output is committed).
