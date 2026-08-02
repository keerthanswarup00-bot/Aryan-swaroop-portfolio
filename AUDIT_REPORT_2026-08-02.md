# Website Audit Report — aryanswaroop.com

**Date:** 2026-08-02
**Scope:** Full audit of the local source (served at `localhost:8123`) plus the production site (`https://www.aryanswaroop.com`).
**Method:** Headless Chromium (CDP) instrumentation across all 11 pages, network profiling at desktop + 390px mobile, resource-byte accounting, live crawls of internal/external links, production header/DNS checks, static source review.

---

## Executive Summary

| Category | Grade | Notes |
|---|---|---|
| Runtime stability / errors | A | 0 console errors on all 11 pages |
| SEO / structured data | A | Valid JSON-LD on all pages, canonicals, sitemap, llms.txt |
| Accessibility | B+ | Skip-links, focus-visible, reduced-motion, alt text; heading-skips + small touch targets |
| Security | B+ | Good Vercel headers + HSTS; no CSP |
| Performance | C+ | 4 pages exceed ~1.5 MB; playground 4.9 MB; ~1 MB of nav/featured imagery per page |
| Mobile UX | C | **Brahmi mobile flipbook renders blank**; touch targets under 44px |
| Analytics / measurement | D | Zero tracking |
| **Overall** | **B+ (87/100)** | Technically clean and SEO-excellent, but real mobile/performance issues block a top grade |

### Critical (must fix)
1. **Mobile flipbook on the Brahmi case study is blank.** The `.mobile-only .cs-flipbook-embed` uses an Elfsight widget (`elfsightcdn.com/platform.js`) configured as an unconfigured "Untitled Flipbook". In-browser verification shows the widget shell loads but renders **no iframe and no content** — mobile visitors see an empty section in a flagship case study.

### High priority
2. **Playground downloads 4.9 MB** — ten `<video preload="auto">` files (~4.6 MB of .m4v), none with a poster. LCP on the page is a video first frame.
3. **Oversized imagery in shared nav/featured components** — `paavani-cards.avif` (363 KB) is displayed at ~72×80 px in the "Case Studies" dropdown on every page; the homepage's sticky-featured stack uses `.jpg` where `.avif` files ~8–9× smaller already exist (`brahmi-doorway.jpg` 455 KB vs `.avif` 56 KB).
4. **Stale link** on `builds.html:278` — "View Live →" points to `https://aryanswaroopportfolio.vercel.app` (the old deployment of this portfolio), not the product.

---

## Detailed Findings

### Critical

**C1. Brahmi mobile flipbook renders empty**
- **Location:** `work/brahmi.html` → `.mobile-only > .cs-flipbook-embed` (Elfsight `elfsight-app-395cf148-…`)
- **Issue:** Third-party Elfsight widget, labeled "Untitled Flipbook", never renders content. CDP check after lazy-load trigger: widget root exists but zero iframes, zero visible text.
- **Impact:** Mobile visitors to the biggest case study cannot see the 44-page identity system; reflects poorly on the designer's own site.
- **Recommendation:** Reuse the existing, verified custom PageFlip flipbook (`js/flipbook-desktop.js` + `css/premium-flipbook.css`) on mobile with a mobile layout (smaller tap zones, portrait-friendly sizing), and remove the Elfsight script entirely. If Elfsight must stay, configure a real project and set an explicit poster/loading state.
- **Effort:** Half day.

### High

**H1. Playground page weight (4.9 MB)**
- **Location:** `playground.html`
- **Issue:** 10 `<video preload="auto" playsinline>` without posters; all 10 files (~4.6 MB) fetched on load; LCP is a video first frame.
- **Impact:** Slowest page on the site; heavy on mobile data; LCP risk on real networks.
- **Recommendation:** `preload="none"` (or `metadata`), reuse the existing `pg-*.avif` stills as `poster`, swap to WebM/H.264 and load `src` only when the tile nears the viewport (IntersectionObserver) or on hover. Keep a static image fallback for reduced-motion.
- **Effort:** 2–4 hours.

**H2. Oversized recurring imagery**
- **Location:** shared nav (`dropdown.js` mega-menu) + `index.html` sticky-featured section
- **Issue:** `paavani-cards.avif` is 363 KB and served as a 72×80 px dropdown thumbnail on **every page** (and `fetchpriority="high"` preloaded on index + real-estate). Homepage sticky-featured cards use `.jpg` (`brahmi-doorway.jpg` 455 KB, `brahmi-label.jpg` 383 KB) though `.avif` variants 8–9× smaller exist.
- **Impact:** ~1 MB of mostly avoidable bytes per homepage visit; site-wide tax from the dropdown thumbnails.
- **Recommendation:** Downscale `paavani-cards` to a real thumbnail (≤30 KB) or point the dropdown at an existing small `mega-*` image; switch homepage sticky-featured cards to `<picture>`/AVIF. Homepage drops ~900 KB (~40%).
- **Effort:** 1–2 hours.

**H3. Stale "View Live" link**
- **Location:** `builds.html:278`
- **Issue:** Links to `https://aryanswaroopportfolio.vercel.app` — an old deployment of the portfolio itself.
- **Impact:** Confusing/broken CTA that sends clients to the wrong destination.
- **Recommendation:** Point to the actual product URL or remove.
- **Effort:** 5 min.

### Medium

| # | Location | Issue | Recommendation | Effort |
|---|---|---|---|---|
| M1 | Site-wide | **No web analytics** (no GA4/Plausible/UMami). No conversion or traffic measurement at all | Add privacy-friendly analytics (Plausible/Umami recommended) to track which case studies convert | 1–2 h |
| M2 | about.html, changelog.html, playground.html | **Missing footer copyright** (`foot-bottom` present on 8/11 pages); no Privacy Policy / Terms anywhere | Add consistent footer across pages; add a Privacy Policy if analytics/cookies are introduced | 1 h |
| M3 | about.html, real-estate.html, builds.html | **Heading hierarchy skips** (h1→h3; about also h2→h4) | Restructure headings to h1→h2→h3 without jumps | 30 min |
| M4 | All pages (mobile) | **Touch targets below 44 px** — hamburger (28×24 content / ~40px hit), `copy-email` button, footer social links, "View Live" links | Enlarge hit areas (padding/min-height ≥44 px) | 1–2 h |
| M5 | brahmi.html | **Third-party Elfsight script** loads regardless of mobile fix | Remove when replacing with custom flipbook | part of C1 |
| M6 | vercel.json | **No Content-Security-Policy** header | Add a CSP allowlisting self + fonts.googleapis/gstatic + unpkg + allowed iframe origins; test before shipping | 2–4 h |
| M7 | builds.html / real-estate.html | **`arvi-*.png` before/after assets (~5 MB total, no webp/avif variants)** | Re-encode to AVIF/WebP (~80% smaller) | 1–2 h |

### Low

| # | Location | Issue | Recommendation | Effort |
|---|---|---|---|---|
| L1 | js/ | Dead code: `turn.js` (62 KB), `premium-flipbook.js`, `bean-trail.js`, `kolam-reveal.js` unused by any page | Delete (game engine is used via `main.js` — keep it) | 30 min |
| L2 | server.py | Legacy local image-upload tool with sha256 of a bearer token; not in production config | Note only — do not deploy; replace with Vercel Blob admin flow if ever needed | — |
| L3 | work/paavani-properties.html | Interactive `<iframe src="">` resolves to the page URL (empty-src behavior); hidden until click, no extra request observed | Set `srcdoc=""` for hygiene | 10 min |
| L4 | CSS | A few 40–45% white-on-black text nodes (`.mobile-subtitle`, `.mobile-project-sub`) sit at ~4.4:1, just under WCAG AA | Bump to 50% opacity | 15 min |
| L5 | index.html | About-page LCP spiked to 5.4 s once in testing (portrait image lazy-load race) — not reproducible | Confirm with RUM; consider eager-loading the portrait | — |
| L6 | Security | `.env.local` (Vercel OIDC token) is gitignored — OK; no other secrets found in frontend | No action | — |

---

## Performance Metrics

### Page transfer (fresh load, desktop, localhost — representative of relative weight)

| Page | Transfer | Heaviest resources |
|---|---|---|
| playground.html | **4.9 MB** | 10 × m4v videos (~4.6 MB) |
| work/brahmi.html | 4.9 MB | flipbook page-*.jpg (lazy), stickers.jpg 521 KB |
| index.html | 2.3 MB | brahmi-doorway.jpg 456 KB, brahmi-label.jpg 384 KB, paavani-cards.avif 363 KB |
| lifestyle.html | 1.6 MB | paavani-cards.avif 363 KB + case images |
| real-estate.html | 1.5 MB | paavani-cards.avif (preloaded) + case images |
| builds.html | 852 KB | — |
| about.html | 707 KB | — |
| 404.html | 619 KB | — |
| tools / changelog | ~597 KB | paavani-cards.avif 363 KB dominates |

### Core Web Vitals (local, Chromium)

- **FCP:** 144–484 ms across pages (local).
- **LCP:** mostly <500 ms; index 1.58 s under simulated 4G (intro overlay text); brahmi had no LCP entry (likely poster/video — verify with Lighthouse on production).
- **CLS:** 0.0000–0.0101 (well under the 0.1 threshold) on all pages.
- **TTFB:** 74–185 ms (local server; production TTFB will be higher).

### Image / asset health
- 103 AVIF / 103 WebP / 133 JPG triples — good discipline; **exceptions** are the `.jpg`-only homepage featured images and the `arvi-*.png` set.
- Fonts: Google Fonts preloaded with async swap + `preconnect` — good pattern; ~700 KB worst-case woff2 but only used subsets load.
- `images/` totals **50 MB** on disk; `images/brahmi/` flipbook pages = 3 MB (44 pages, ~60–115 KB each — reasonable).
- No gzip/br for HTML at the local server; Vercel production serves compressed assets + cache headers (`images/*`: `immutable` 1 yr; CSS/JS: 300 s; HTML: `must-revalidate`).

---

## SEO & Structured Data

- **All 11 pages:** unique `<title>`, meta description (110–229 chars), canonical, `lang="en"`, viewport, robots (`index` for content, `noindex` on changelog/404 — correct).
- **Open Graph + Twitter cards:** present on all pages (og:title/description/image/url/type, twitter:card=summary_large_image).
- **JSON-LD:** **valid on every page** — Person, BreadcrumbList, WebPage, Article (case studies), CreativeWork + ImageObject (work pages), SiteNavigationElement. No parse errors.
- **Sitemap:** `sitemap.xml` (9 URLs) + `sitemap-images.xml`; **all 9 URLs return 200 in production**; robots.txt lists both. Missing only the (noindexed) changelog.
- **robots.txt:** allows AI crawlers explicitly (GPTBot, ClaudeBot, etc.) — intentional for AI discoverability.
- **Internal links:** all nav links use extensionless paths (Vercel `cleanUrls`) — verified working in production; local Python server 404s on them (testing artifact only). No real broken internal links.
- **External links:** 5 project links 200 OK; `linkedin` 403 to bots (fine in browsers), `behance` 301→profile, `vr-devaiah-enclave.vercel.app` 200 — all acceptable. One stale link (H3).
- **Production:** apex → `www` 307; HTTPS + HSTS valid; custom 404 served correctly.
- **Heading structure:** single H1 per page; skips on 3 pages (M3).

---

## Accessibility

- Strong: skip-to-content on all pages, `:focus-visible` outlines, comprehensive `prefers-reduced-motion` handling (CSS + JS), semantic landmarks, all `<img>` have alt (the one flagged `lb-img` is a JS-populated lightbox placeholder — benign), 44-page flipbook has arrow buttons with `aria-label`.
- Gaps: heading skips (M3), touch targets (M4), a few sub-4.5:1 contrast nodes (L4). Keyboard focus on the mega-menu dropdown relies on hover/JS — verify tab-order works (`.nav-dropdown-trigger` has `aria-expanded`/`aria-haspopup`; the open state is driven by `dropdown.js`).
- No form fields exist anywhere (contact is `mailto:`), so form-label audits are N/A.

---

## Security

- **Production headers:** `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`, HSTS (Vercel), image caching `immutable`. **Missing: CSP.**
- **Secrets:** `.env.local` holds a Vercel OIDC token but is gitignored; no API keys in committed frontend code. `api/manifest.js` uses `@vercel/blob` server-side with `Access-Control-Allow-Origin: *` (returns a public image manifest — acceptable; ensure the blob store only contains intended public images).
- **Attack surface:** static site, no forms/database/auth, so XSS/SQLi/CSRF risk is minimal. Only external code: Google Fonts, unpkg page-flip (jsdelivr alternative recommended for reliability), Elfsight, and the VR iframe (loaded on click).

---

## Analytics, Conversion & Business

- **Analytics:** none — biggest business gap. No way to see traffic, referral sources, or which case studies get to the email CTA.
- **Conversion path:** clear and strong — every page ends in a "Let's talk about the role" footer with Email Me + Resume download; homepage hero + stats give social proof; case studies are detailed.
- **Trust signals:** good (30+ projects, 44-page system, resume, LinkedIn/Behance, "open to work" status). No testimonials/client quotes section — an easy addition for credibility.
- **Competitor/positioning:** the site is unusually strong for a senior-designer portfolio (interactive flipbook, 3D, custom game, rich structured data, llms.txt). Differentiation is clear ("end-to-end brand systems", real-estate + lifestyle verticals). Missing vs. peers: blog/thought-leadership, client testimonials, and (of course) analytics.

---

## Top 10 Recommendations (priority order)

1. Fix/replace the blank mobile Brahmi flipbook (C1).
2. Slash Playground weight: `preload="none"` + posters + lazy video (H1).
3. Right-size `paavani-cards.avif` for the dropdown; use existing AVIFs on the homepage sticky-featured cards (H2) — ~40% homepage savings.
4. Fix the stale `aryanswaroopportfolio.vercel.app` link (H3).
5. Install privacy-friendly analytics (Plausible/Umami) (M1).
6. Add a CSP to `vercel.json` (M6).
7. Fix heading skips on about/real-estate/builds (M3).
8. Enlarge mobile touch targets ≥44 px (M4).
9. Delete dead JS (`turn.js`, `premium-flipbook.js`, `bean-trail.js`, `kolam-reveal.js`) (L1).
10. Add footer copyright consistency + Privacy Policy; convert `arvi-*.png` (M2/L…).

### Quick wins (high impact, low effort)
- H2 (AVIF swap + dropdown thumbnail) — 1–2 h, biggest byte win.
- H3 (stale link) — 5 min.
- M3 (heading skips) — 30 min.
- L1 (dead code) — 30 min.
- M2 (footer consistency) — 1 h.

### Suggested roadmap
- **Week 1:** C1 (mobile flipbook), H1 (playground), H3 (link), M3 (headings).
- **Week 2:** H2 (image sizes), M4 (touch targets), M2 (footer/privacy), M1 (analytics).
- **Week 3+:** M6 (CSP), L1/L4 cleanup, L3/L5 hygiene, then measure with RUM (CrUX/Lighthouse CI) and iterate.

---

## Verified Good (no action)

- Zero JS console errors on all 11 pages; no `console.log`/TODO/FIXME left in source.
- No horizontal overflow at 390 px on any page; layouts degrade cleanly to single column.
- Desktop flipbook: initializes, no scroll snapping, stable height (recently fixed).
- All JSON-LD valid; all sitemap URLs live; robots/llms.txt/security.txt/humans.txt present.
- Reduced-motion, skip-links, focus-visible, semantic landmarks all present site-wide.
- Security headers + HSTS in production; apex→www redirect correct.

---

## Caveats

- **Cross-browser:** only Chromium (Brave) was automatable here; Firefox/Safari not installed on this machine. The Elfsight finding and video behavior should be sanity-checked in Safari (iOS) and Chrome Android.
- **Vitals:** measured on localhost (LAN) with simulated 4G — absolute numbers are indicative, not production-grade; use CrUX + Lighthouse on the live domain for final numbers.
- The Elfsight "blank" result was observed after the lazy-load trigger in a headless browser; worth one manual phone check before shipping the fix.
