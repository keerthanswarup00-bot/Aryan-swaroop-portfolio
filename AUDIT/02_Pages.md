# 02 — Pages

Per-page audit of all 11 HTML documents. Every page shares the same head pattern (font preload + async swap, `style.css`, page-specific CSS, `mobile-fixes.css` last) and the same body chrome (skip-link, header with mega-menu, mobile menu, footer, cursor, intro overlay via `script.js`).

Shared scripts: `dropdown.js` (defer) + `script.js` (defer) on **every** page.

---

## index.html — Home

- **Head:** title "Aryan Swaroop — Brand Designer & Creative Lead", unique description, canonical `/`, OG/Twitter (`portrait.jpg`), full JSON-LD (Person, WebSite, WebPage, CollectionPage/ItemList), `prefetch` of `/about` + `/real-estate`.
- **Sections:** hero (two `h1` hero lines, char-split animation, reveal images, stats 302+/30+/50+), scroll-reveal lead claim, **featured Brahmi case study** (`#brahmi.csx`), horizontal work section (`#workHorizontal`), sticky featured stack (`sticky-featured`), games section, footer.
- **Scripts:** gsap + ScrollTrigger, `sticky-featured-projects.js`, `home-motion.js`, `brahmi-story.js`, `dropdown.js`, `script.js`, `main.js` (module → game).
- **Headings:** one `h1` (both hero lines are inside the same `<h1>` wrapper per page — grep shows a single `<h1`), then h2s. Clean hierarchy.
- **Notes:** `#brahmi.csx` degrades to a static stacked layout without JS; `home-motion.js` horizontal-jacks only ≥901px; game canvas runs on this page too (deliberate, per RELEASE_NOTES v2.0 "game restricted to home and 404").

## about.html — About

- **Head:** unique title/description, canonical `/about`, OG (`portrait.jpg`), AboutPage/ProfilePage JSON-LD.
- **Sections:** full-screen hero (dark), story blocks with images, experience/education resume.
- **Scripts:** dropdown + script only.
- **Issues:**
  - **No footer copyright** (`foot-bottom` absent — verified). Page ends without the shared footer bottom row → inconsistent with 8 other pages.
  - **Heading skips:** `h1 → h3` (story block headings) then `h2 → h4` (resume sections) — violates sequential heading order.

## real-estate.html — Real Estate

- **Head:** unique, canonical `/real-estate`, OG (`paavani-main-gate.jpg`), CreativeWork + ImageObject JSON-LD.
- **Sections:** page header, work-grid cards (Paavani, Sidvin Serenity, Royal Farm, VR Devaiah), idea gallery, devaiah image rows, gallery.
- **Scripts:** dropdown, script, `lightbox.js`.
- **Issues:**
  - **Heading skips:** `h1 → h3` (work-card titles) directly; several h2s follow.
  - Uses `.jpg` images in cards (see 06 — `.avif` twins exist and are ~8× smaller; only some cards use `<picture>`).

## lifestyle.html — Lifestyle

- **Head:** unique, canonical `/lifestyle`, OG (`brahmi-pourshot.jpg`), CreativeWork JSON-LD.
- **Sections:** header, work-grid (Brahmi, Isha V, Snehaloka), before/after slider (`arvi-*`), galleries.
- **Scripts:** dropdown, script, `lightbox.js`, `before-after.js`.
- **Notes:** before/after slider uses `arvi-before.png`/`arvi-after.png` (~1.5 MB of the page weight); `.avif` variants exist for arvi set? No — arvi has avif/webp (arvi-after.avif 77 KB exists). Page uses png though. See 06.

## builds.html — Builds

- **Head:** unique, canonical `/builds`, OG (`build-selixo.jpg`), CreativeWork JSON-LD with images/keywords (from SEO pass).
- **Sections:** header, work-grid (Selixo, AlbumFlow, Striv, Foundations), bottom link to real-estate.
- **Scripts:** dropdown, script, `lightbox.js`.
- **Issues:**
  - **Stale CTA:** `builds.html:323` "View Live →" → `https://aryanswaroopportfolio.vercel.app` (old deployment of this portfolio, not the product). High-priority.
  - **Heading skips:** `h1 → h3` (card titles).

## tools.html — Tools

- **Head:** unique, canonical `/tools`, OG (`portrait.jpg`), ProfilePage JSON-LD.
- **Sections:** header, tool-groups grid, resume block (download PDF + copy email).
- **Scripts:** dropdown + script.
- **Clean:** no heading skips, footer present.

## playground.html — Playground

- **Head:** unique, canonical `/playground`, OG/Twitter (`playground-preview.png`), CollectionPage JSON-LD.
- **Sections:** hero, section-labeled editorial grid of 11 `pg-*` images + 10 `pg-video-*` tiles.
- **Scripts:** dropdown, script, `playground.js`, gsap + ScrollTrigger + CustomEase + lenis, `playground-gallery.js`.
- **Issues:**
  - **No footer copyright** (`foot-bottom` absent).
  - **10 videos all `preload="auto"`** → ~4.6 MB fetched on load (line ~390+). Highest-weight page on the site. (`width="800" height="1000"` set, no `poster`.)
  - Tiles are `<button class="pg-item" aria-label="View image">` — good semantics (buttons, focusable).

## changelog.html — Changelog

- **Head:** **noindex** (correct), unique title/description, canonical `/changelog`, CollectionPage JSON-LD (BreadcrumbList `@id` fixed in SEO pass).
- **Scripts:** dropdown + script.
- **Issues:**
  - **No footer copyright** (`foot-bottom` absent).
  - Heading hierarchy clean (h1 → h2 → h3).

## 404.html — Custom 404 + Game

- **Head:** noindex, canonical `/`, clear title/description.
- **Sections:** not-found text, **endless-runner game** section, "Head Back Home" button.
- **Scripts:** dropdown, script, `main.js` (module → game). `lightbox.js` NOT loaded (no images needing it).
- **Notes:** game boots on this page AND on index. The 404 links Home from the game section (README of game section). Duplicate game-section divs were merged in v2.0 — verified single section.

## work/brahmi.html — Brahmi Coffee Roasters (case study)

- **Head:** unique, canonical `/work/brahmi`, OG (`brahmi-pourshot.jpg`), Article + CreativeWork + ImageObject JSON-LD.
- **Sections:** teal/brass kolam header, overview, story blocks (reveal-on-scroll), blend selector (packaging variants), 44-page flipbook, storytelling section, next-project link.
- **Scripts:** `flipbook-desktop.js`, dropdown, script, `lightbox.js`, `reveal-on-scroll.js`, `blend-selector.js`, gsap + ScrollTrigger, `storytelling.js`. **Plus Elfsight script inline.**
- **Issues:**
  - **CRITICAL (C1):** mobile-only flipbook = Elfsight "Untitled Flipbook" widget (`work/brahmi.html:314-315`). Known to render blank (headless CDP verification, prior audit). Desktop PageFlip book is hidden ≤767px via `.desktop-only`/`.mobile-only` (premium-flipbook.css:201-208). Result: flagship case study has no working flipbook on mobile.
  - Desktop book depends on external `https://unpkg.com/page-flip@2.0.7/...` — single point of failure if unpkg is unreachable (script.onerror silently no-ops; wrapper never reveals if JS fails — actually wrapper reveal uses IntersectionObserver regardless, so the *book* would just be missing pages).
  - Inline `style` attributes on `.premium-flipbook-wrapper` (line 301) duplicate `css/premium-flipbook.css` rules — drift risk.
  - The Elfsight script is `async` and loads on desktop too (it's inside `.mobile-only`, but a `<script>` inside a `display:none` container still executes).

## work/paavani-properties.html — Paavani Properties (case study)

- **Head:** unique, canonical `/work/paavani-properties`, OG (`hero-paavani-main.jpg`), Article/CreativeWork JSON-LD.
- **Sections:** dark hero (parallax), overview, result stat (big number), stats strip (count-up), process steps, applied-everywhere grid, interactive VR embed, next-project link, reading-progress rail.
- **Scripts:** dropdown, script, `lightbox.js`, `reveal-on-scroll.js`, `paavani.js`, gsap + ScrollTrigger, `storytelling.js`.
- **Issues:**
  - **Empty-src iframe:** `<iframe id="interactiveFrame" src="" title="VR Devaiah Enclave — Interactive Plot Finder">` — resolved by `paavani.js` only on scroll into view (good), but the raw empty `src=""` re-fetches the current page URL before JS runs (hygiene: use `srcdoc=""`).
  - The interactive embed loads an **external app** `https://vr-devaiah-enclave.vercel.app/` (a separate Vercel deploy) — a runtime dependency that must stay alive.
  - Stats/parallax/embed all degrade gracefully on reduced-motion (verified in `paavani.js`).

---

## Cross-page consistency

| Check | Result |
|---|---|
| Exactly one `<h1>` | ✅ all 11 pages |
| Unique meta description | ✅ all pages |
| Canonical | ✅ all pages |
| OG + Twitter cards | ✅ all pages |
| JSON-LD | ✅ all pages (validated in prior audits; structure unchanged since) |
| `lang="en"` | ✅ |
| Footer `foot-bottom` | ❌ missing on **about, changelog, playground** |
| Heading-order skips | ❌ **about, real-estate, builds** |
| Skip-to-content link | ✅ all pages |
| `<main>` semantic wrapper | ✅ |
| External links `rel="noopener noreferrer"` | ✅ (verified on stale link too) |
