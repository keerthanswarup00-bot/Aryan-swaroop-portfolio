# AI CODEBASE GUIDE — Aryan Swaroop Portfolio

> **Purpose:** Single source of truth for AI coding assistants (Claude, GPT, Gemini, Cursor, OpenCode, etc.) so they can accurately understand and safely modify this project before making changes.
>
> **Method:** Everything in this document was derived directly from the repository on 2026-08-04. Nothing is assumed; nothing is hallucinated. If a statement here contradicts the code, **the code is the authority** — update this document.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Technology Stack](#2-technology-stack)
3. [Project Architecture](#3-project-architecture)
4. [Entry Point](#4-entry-point)
5. [Routing](#5-routing)
6. [Components](#6-components)
7. [Pages](#7-pages)
8. [Styling System](#8-styling-system)
9. [Design System](#9-design-system)
10. [Animation System](#10-animation-system)
11. [State Management](#11-state-management)
12. [Hooks](#12-hooks)
13. [Utility Functions](#13-utility-functions)
14. [Data Flow](#14-data-flow)
15. [Assets](#15-assets)
16. [Performance](#16-performance)
17. [Accessibility](#17-accessibility)
18. [SEO](#18-seo)
19. [Build Configuration](#19-build-configuration)
20. [Dependencies](#20-dependencies)
21. [Coding Standards](#21-coding-standards)
22. [Patterns Used](#22-patterns-used)
23. [Feature Inventory](#23-feature-inventory)
24. [Known Technical Debt](#24-known-technical-debt)
25. [AI Development Guide](#25-ai-development-guide)
26. [Project Statistics](#26-project-statistics)
27. [Improvement Opportunities](#27-improvement-opportunities)

---

## 1. Project Overview

**What it is:** A hand-coded, static, single-developer portfolio website for **Aryan Swaroop** — a Brand Designer & Creative Lead based in Bengaluru, India. It showcases real-estate brand systems, lifestyle/packaging identities, web-product builds ("Builds"), motion experiments ("Playground"), a tools/skills page, and an interactive Canvas endless-runner game embedded on the homepage and 404 page.

**Purpose / audience:** Hiring managers and creative directors evaluating Aryan for **Creative Lead / Brand Designer / Creative Director** roles. The primary CTA is `mailto:aryanswaroop.0@gmail.com`, plus a downloadable resume PDF. The copy states he is "Open to work" and the footer CTA is *"Let's talk about the role."*

**Design philosophy:** Storytelling over grids. Real numbers over vague claims ("302 qualified leads in 66 days at ₹82 per lead", "30+ projects led", "50+ films produced"). Motion rewards scrolling — it is never decoration. Every animated component has a `prefers-reduced-motion` fallback and a no-JS static state. Craft is the selling point: the code quality is part of the portfolio.

**Brand personality:** Restless and multidisciplinary — *"Restless by nature. Multidisciplinary by design."* Dark luxury sections alternate with warm paper-white editorial sections. Tagline in `llms.txt`: *"Not another portfolio. Just my best work."*

**Application type:** Static Multi-Page Application (MPA). 11 hand-coded HTML pages. No framework, no SPA, no SSR, no build step. Vanilla JavaScript (ES5-style IIFEs plus one ES module game graph). Deployed straight from the git repository on Vercel with clean URLs and a custom domain.

**Production readiness:** Production-ready and **live** at `https://www.aryanswaroop.com`. It has a live CSP, immutable image caching, token-gated serverless API, structured data on all pages, `robots.txt` / sitemaps / `llms.txt`, and a documented audit trail in `AUDIT/`. Prior self-audits rate it 86–94/100 (see `AUDIT/FINAL_SCORECARD.md`). Known open issue: the mobile Brahmi flipbook renders blank (see [§24 Known Technical Debt](#24-known-technical-debt)).

**Deployment:** `git push` → Vercel (zero-config static). Git remote: `git@github.com:keerthanswarup00-bot/Aryan-swaroop-portfolio.git`. Vercel project: `aryan-swaroop-portfolio-9hor`.

---

## 2. Technology Stack

Only technologies that actually exist in the repository are listed. Versions are pinned values.

| Technology | Version | Where / How used |
|---|---|---|
| HTML5 | — | All 11 pages, hand-coded |
| CSS3 | — | Global + 10 scoped stylesheets |
| JavaScript (Vanilla) | ES5-style IIFEs + ES modules | Page scripts, game module graph |
| **GSAP** | **3.15.0** | Vendored at `js/vendor/gsap.min.js`; scroll scrub/pin work |
| **ScrollTrigger** | part of GSAP 3.15.0 | Vendored at `js/vendor/ScrollTrigger.min.js` |
| **CustomEase** | bundled with GSAP 3.15.0 | Vendored at `js/vendor/CustomEase.min.js`; playground custom ease `pgEase` |
| **Lenis** | **1.3.25** | Vendored at `js/vendor/lenis.min.js`; smooth scroll on Playground only |
| **PageFlip** (St.PageFlip) | **2.0.7** | NOT vendored; dynamically loaded from `https://unpkg.com/page-flip@2.0.7/...` at runtime on the Brahmi case study |
| **@vercel/blob** | **^2.6.1** (pinned 2.6.1 in lockfile) | `api/manifest.js` serverless function |
| Python `http.server` | stdlib | `server.py` local dev/upload server (not used in production) |
| Google Fonts | — | **Fraunces** (serif display) + **Inter** (sans UI), loaded via CDN with preload `onload` swap |
| Node.js | ≥20 (required by `@vercel/blob`) | `scripts/build-nav.mjs` (nav/footer generator), `npm run build:nav` |
| Vercel | — | Hosting, `vercel.json` headers/routes, serverless function runtime |

**Not present:** TypeScript, React, Next.js, Vue, Tailwind, PostCSS, Vite, webpack, Sass/SCSS, CSS modules, Framer Motion, Three.js, Zustand, Redux, Router. "React / Next.js / Supabase" appear only as *content copy* describing Aryan's other shipped products (see `llms.txt`, `index.html` JSON-LD), not as technologies used in this repository.

**jQuery** (`$`) and **Turn.js** are referenced by `js/premium-flipbook.js`, but that file is **not loaded** by any page and neither library is present — the live flipbook is `js/flipbook-desktop.js` (PageFlip).

---

## 3. Project Architecture

### Folder structure

```text
/  (repo root = web root, served as-is)
├── index.html              Homepage (hero, featured work, Brahmi teaser, work carousel, game)
├── about.html              Bio + resume
├── real-estate.html        Real-estate case studies (4)
├── lifestyle.html          Lifestyle case studies (4, incl. before/after slider)
├── builds.html             Web-product builds (MacBook hero + 3D pin cards)
├── playground.html         Editorial media gallery (11 photos + 10 videos)
├── tools.html              Tools & skills
├── changelog.html          Site changelog
├── 404.html                Custom 404 + endless-runner game
├── work/                   Nested case-study pages (2 levels deep)
│   ├── brahmi.html         Brahmi Coffee Roasters case study (flipbook)
│   └── paavani-properties.html  Paavani case study (VR iframe)
├── style.css               Minified GLOBAL stylesheet (~39 KB, 10 physical lines)
├── css/                    10 scoped stylesheets (loaded per page)
│   ├── home-rebuild.css    Homepage rebuild (csx story, work carousel, sticky stack, floating character)
│   ├── macbook-scroll.css  Builds MacBook hero
│   ├── builds.css          Builds 3D pin cards
│   ├── mobile-fixes.css    Mobile safety net (≤768px), loaded LAST on every page
│   ├── paavani.css         Paavani case study overrides
│   ├── playground.css      Playground gallery
│   ├── premium-flipbook.css  Brahmi desktop flipbook
│   ├── storytelling.css    Pinned case-study narrative
│   ├── case-study.css      Base case-study template (light)
│   └── case-study-dark.css Dark-theme counterpart + reveal utilities
├── js/
│   ├── vendor/             Vendored libs — gsap.min.js, ScrollTrigger.min.js, CustomEase.min.js, lenis.min.js
│   ├── *.js                13 page-specific scripts + 14 game module files (see §6, §23)
├── script.js               GLOBAL behavior (cursor, intro, scroll bar, mobile menu, dropdown, copy-email, hero trail, counters, reveal) — loaded on every page
├── dropdown.js             Builds the Design mega-menu markup — loaded on every page
├── before-after.js         Arvi Hospital compare slider (lifestyle only)
├── lightbox.js             Desktop lightbox (real-estate / lifestyle)
├── playground.js           Playground lightbox + lazy videos
├── main.js                 ES-module entry for the endless-runner game
├── scripts/
│   └── build-nav.mjs       SINGLE SOURCE OF TRUTH for header + mobile menu + footer HTML
├── api/
│   └── manifest.js         Vercel serverless: lists @vercel/blob image keys (token-gated)
├── images/                 363 files, 50 MB — AVIF/WebP/JPG triplets + PNGs + videos
│   └── brahmi/             page-01.jpg … page-44.jpg (flipbook pages)
├── pdfs/
│   └── brahmi-brand.pdf    44-page brand guideline PDF (currently UNLINKED in markup)
├── archive/                Original favicon + source images (not served)
├── AUDIT/                  Self-audit findings 00–15 + FINAL_SCORECARD (reference docs)
├── *.md                    Docs: CLAUDE.md, PROJECT_CONTEXT.md, RELEASE_NOTES.md, audit/remediation reports, SEO_CHANGELOG.md
├── *.txt / *.xml / *.json  robots.txt, llms.txt, humans.txt, security.txt, sitemap.xml, sitemap-images.xml, site.webmanifest, browserconfig.xml
├── favicons                favicon.ico + PNG set + apple-touch-icon + mstile-150x150.png
├── google469c96c221aaafc3.html  Google Search Console verification file
├── server.py               Local Python dev server with authenticated upload/delete (local tooling)
├── vercel.json             Deployment config (cleanUrls, routes, headers, CSP, function)
├── package.json            Declares gsap/lenis/@vercel/blob (see §20)
└── package-lock.json       Pins dependency versions
```

### Responsibility of every folder

- **Root `.html` pages** — content. Each page is self-contained: own `<head>` SEO block, generated header/menu/footer, own script tags.
- **`css/`** — page-scoped styling. `style.css` (global) is minified; the scoped sheets are hand-written. `mobile-fixes.css` is the cross-page mobile hardening layer and **must load last**.
- **`js/`** — behavior. `vendor/` holds frozen vendored libraries (never edit; bump versions by re-vendoring + cache-buster). Page scripts are deferred IIFEs keyed to elements present on their page.
- **`scripts/build-nav.mjs`** — the code generator that rewrites every page's header, mobile menu, and footer. This is the single most important file to understand before editing navigation.
- **`api/`** — the only server-side code. Runs on Vercel's serverless Node runtime.
- **`images/`** — every binary asset. AVIF → WebP → JPG triplets share a base filename. `images/brahmi/` holds the 44 flipbook page scans.
- **`AUDIT/`, `*.md`** — documentation of the site's self-audit history and current findings. Useful context, not code.

### Application flow

```text
Browser → vercel.json routing/headers → static HTML page
    │
    ├── <head>: fonts (preload+onload), style.css?v=, css/<page>.css?v=, css/mobile-fixes.css?v=
    │            JSON-LD structured data, meta/OG/Twitter, favicons, canonical
    │
    ├── <body>: skip link → .ai-summary (sr-only) → #cur (cursor) →
    │            [generated header] → <main> → [generated footer] → [optional game section]
    │
    └── scripts (defer unless noted):
        dropdown.js  → injects mega-menu markup into #designDropdown
        script.js    → cursor, intro overlay, scroll bar, mobile menu, dropdown focus logic,
                       copy-email, type-cycle, reveals, hero char split + cursor trail, counters
        <page>.js    → page-specific motion/behavior (gsap scrub, lightbox, slider, flipbook…)
        main.js      → (home + 404 only) ES-module game graph on <canvas id="game">
```

---

## 4. Entry Point

There is **no single application entry point** — this is a multi-page static site. Each HTML file is its own entry. The closest analogues:

- **Root component (shared chrome):** `scripts/build-nav.mjs` exports `HEADER_HTML`, `MOBILE_MENU_HTML`, `FOOTER_HTML`. Every page embeds byte-identical copies generated by `npm run build:nav` (build script: `node scripts/build-nav.mjs`).
- **Global behavior script:** `script.js` (defer) runs on every page — cursor, scroll progress, mobile menu, mega-dropdown focus handling, copy-email, type-cycle, reveal observers, hero text split + cursor image trail, stat counters, intro flash. It is ES5-style, element-guarded (each IIFE returns early if its element is missing).
- **Dropdown injection:** `dropdown.js` (defer) appends the Design mega-menu markup (`<div class="mega-menu-root">`) inside `#designDropdown` on every page.
- **Game entry:** `main.js` (type="module") — imports the game module graph and boots it on `<canvas id="game">` (present only on `index.html` and `404.html`):
  ```js
  // main.js
  import { Game } from './js/Game.js';
  const canvas = document.querySelector('#game');
  const game = new Game(canvas, document.querySelector('#mute'));
  game.start();
  ```

### Startup order on a typical page (e.g. `index.html`)

```text
1. <head> parses: preconnect fonts.googleapis/gstatic → font preload link (onload swaps to stylesheet)
   → style.css?v= → css/home-rebuild.css?v= → JSON-LD → LCP image preload → css/mobile-fixes.css?v=
2. Body parses; header/mobile-menu/footer are already in the HTML (generated).
3. Deferred scripts run after DOM parse (document order):
   js/vendor/gsap.min.js + ScrollTrigger.min.js (eager, non-defer) →
   js/sticky-featured-projects.js → js/home-motion.js → js/floating-character.js →
   js/brahmi-story.js → dropdown.js → script.js → main.js (module)
4. script.js intro overlay animates words, fires CustomEvent 'hero:ready' →
   stat counters animate; hero line splits into .hero-char spans; cursor trail activates on desktop.
5. IntersectionObserver / ScrollTrigger reveal content as the user scrolls.
```

---

## 5. Routing

**Routing library:** None. Multi-page static navigation. Vercel's `cleanUrls: true` in `vercel.json` maps extensionless requests to the matching `.html` file.

**Link style:** Nav, sitemaps, and most in-content links use extensionless URLs (`/real-estate`). Two inconsistencies exist (all fine in production due to cleanUrls):
- The mobile menu (`build-nav.mjs`) links to `/work/brahmi.html` and `/work/paavani-properties.html` (with extension).
- `dropdown.js` links to `/work/brahmi` and `/work/paavani-properties` (without).

**404 behavior:** `/404` returns `404.html` which is `noindex, follow` and canonicalizes to `/`.

### Routing table

| Public URL | File | Indexed | Notes |
|---|---|---|---|
| `/` | `index.html` | ✅ | Homepage + game |
| `/about` | `about.html` | ✅ | |
| `/real-estate` | `real-estate.html` | ✅ | |
| `/lifestyle` | `lifestyle.html` | ✅ | |
| `/builds` | `builds.html` | ✅ | `body.page-dark` |
| `/tools` | `tools.html` | ✅ | |
| `/playground` | `playground.html` | ✅ | |
| `/changelog` | `changelog.html` | ❌ `noindex, follow` | |
| `/work/brahmi` | `work/brahmi.html` | ✅ | `body.page-dark` |
| `/work/paavani-properties` | `work/paavani-properties.html` | ✅ | `body.page-dark` |
| `/404` | `404.html` | ❌ `noindex, follow` | canonical → `/` |
| `/google469c96c221aaafc3.html` | file | — | GSC verification; `vercel.json` route bypasses cleanUrls |
| `/builds/selixo` | — | — | Link target only; external app owned by Aryan |
| `https://vr-devaiah-enclave.vercel.app` | — | — | Live VR plot-finder iframe (external) |

**Protected routes:** None — the site is fully public. The only gated endpoint is `GET /api/manifest` (serverless), which requires the `x-admin-token` header (see §19).

**Layouts:** No layout system. Each page repeats the generated header/menu/footer markup; `scripts/build-nav.mjs` is what keeps them identical.

**Local server caveat:** `server.py` (the local dev server) does **not** implement cleanUrls — extensionless links like `/real-estate` will 404 locally (documented expectation in CLAUDE.md). Test extensionless URLs via Vercel preview, or navigate to the `.html` file directly.

---

## 6. Components

This is a static site, so "components" are **recurring markup patterns + their JS behaviors**, not framework components. Grouped by category:

### 6.1 Navigation / chrome (site-wide, generated)

| Component | Markup source | Behavior source | Where used |
|---|---|---|---|
| **Header** (`.site-header`, avatar, nav links, Resume button, hamburger, scroll-track) | `build-nav.mjs` `HEADER_HTML` | `script.js` (scroll bar, `is-compact`, `nav-dark`) | all 11 pages |
| **Mobile menu** (`.mobile-menu#mobileMenu`, full-screen drawer) | `build-nav.mjs` `MOBILE_MENU_HTML` | `script.js` (open/close, stagger, swipe-down close, Escape) | all 11 pages |
| **Design mega-dropdown** (`.mega-menu-root` injected into `#designDropdown`) | `dropdown.js` | `script.js` + `dropdown.js` (hover/click/keyboard focus) | all 11 pages |
| **Footer** (`.theme-dark`, contact row, copy-email, `foot-bottom`) | `build-nav.mjs` `FOOTER_HTML` | `script.js` (copy-email) | all 11 pages |

### 6.2 UI primitives (defined in `style.css`)

| Component | Purpose | Notes |
|---|---|---|
| `.btn`, `.btn-solid`, `.btn-ghost` | Pill buttons (100px radius) | `<a>` or `<button>`; `data-cur` labels cursor |
| `.kicker` | 13px uppercase accent section label | `section .kicker` participates in reveal |
| `.copy-email` | Email copy-to-clipboard button | `data-email` attribute; `.copied` state |
| `.status-ping` / `.status-dot` | "Open to work" green pulse dot | keyframe `pulse-ring` |
| `.teaser-link` | Arrow link used in work slides | ≥44px touch target via `::before` |
| `.skip-to-content`, `.sr-only` | A11y utilities | first element in `<body>` |
| `.wrap` | 1240px max-width container | 40px gutters (20px ≤700px) |

### 6.3 Content / portfolio components

| Component | CSS | JS | Purpose |
|---|---|---|---|
| `.feature-grid` / `.feature-visual` / `.feature-copy` | `style.css` | `lightbox.js` (click) | Case-study hero layout, repeated per project |
| `.feature-meta` | `style.css` | — | 4-column Role/Scope/Process/Result block |
| `.gallery-strip` / `.gallery-tile` | `style.css` | `lightbox.js` | Horizontal strip of lightbox tiles |
| `.idea-gallery` / `.idea-tile` | `style.css` | `lightbox.js` | "Applied to the Pack" gallery (lifestyle) |
| `.work-grid` / `.work-grid-3` / `.work-card` / `.work-visual` | `style.css` | `lightbox.js` | 3-card work grids (real-estate) |
| `.devaiah-row` (`-2`/`-3`) | `style.css` | `lightbox.js` | Responsive web-app screenshot rows |
| `.csx` story (`.csx-left`, `.csx-stage`, `.csx-block`) | `home-rebuild.css` | `js/brahmi-story.js` | Sticky-left scroll storytelling (homepage) |
| `.sfp-card` / `.sfp-stack` / `.sfp-stage` | `home-rebuild.css` | `js/sticky-featured-projects.js` | Pinned stacked images (homepage) |
| `.work-horizontal` / `.work-slide` | `home-rebuild.css` | `js/home-motion.js` | Horizontal scroll-jack carousel (homepage) |
| `.compare-slider` | `style.css` | `before-after.js` | Before/after clip-path slider (lifestyle Arvi) |
| `.lb-overlay` (lightbox) | `style.css` | `lightbox.js` | Desktop-only image lightbox |
| `.pin-cell` / `.pin-card` (3D pin cards) | `builds.css` | `js/builds-motion.js` (renders from config) | Builds project cards |
| `.macbook-scroll-*` | `macbook-scroll.css` | `js/macbook-scroll.js` | Builds scroll-opened laptop hero |
| `.pg-item` / `.pg-grid` | `playground.css` | `playground.js` + `js/playground-gallery.js` | Playground gallery tiles + lightbox |
| `.premium-flipbook-*` / `.fb-desktop__*` | `premium-flipbook.css` | `js/flipbook-desktop.js` | 44-page PageFlip book (Brahmi, desktop) |
| `.cs-story` / `.cs-story__slide` | `storytelling.css` | `js/storytelling.js` | Pinned scroll-scrubbed narrative (case studies) |
| `.cs-stat` / `.cs-stat-num` | `paavani.css` | `js/paavani.js` | Count-up stats (Paavani) |
| `.cs-interactive-embed` / `#interactiveFrame` | `paavani.css` | `js/paavani.js` | Lazy VR plot-finder iframe (Paavani) |
| `.cs-hero-visual--parallax` | `paavani.css` | `js/paavani.js` | Hero parallax (Paavani) |
| `.reveal-block` / `.reveal-child` | `case-study-dark.css` | `js/reveal-on-scroll.js` | Case-study scroll reveals |
| `.blend-btn` / `.blend-photo` | `case-study-dark.css` | `js/blend-selector.js` | Photo blend switcher — **no live markup; inert** |
| `.floating-character` | `home-rebuild.css` | `js/floating-character.js` | Hero floating pixel character (homepage) |
| `.game-shell` / `#game` / `#mute` | `style.css` | `main.js` → game modules | Endless-runner canvas game |

### 6.4 Game components (ES modules, zero dependencies)

All in `js/`, consumed by `main.js`:

| File | Class/role | Purpose |
|---|---|---|
| `js/Game.js` | `Game` | Orchestrator: loop, update, collision, modes |
| `js/Renderer.js` | `Renderer` | Canvas 2D pixel-art drawing (player, autos, cows, potholes, skyline) |
| `js/Player.js` | `Player` | Runner physics + animation frames |
| `js/Obstacle.js` | `Obstacle` | Auto rickshaw / cow / pothole obstacles |
| `js/Ground.js` | `Ground` | Scrolling ground bits |
| `js/Background.js` | `Background` | Parallax landmarks (metro, coconut) |
| `js/Cloud.js` | `Cloud` | Drifting clouds |
| `js/Score.js` | `Score` | Score + high-score (localStorage) |
| `js/Sound.js` | `Sound` | Web Audio chiptune music + SFX |
| `js/Input.js` | `Input` | Keyboard + pointer jump input |
| `js/Particle.js` | `Particle` | Running dust particles |
| `js/Intro.js` | `Intro` | Intro/title state machine |
| `js/Physics.js` | — | `GRAVITY`, `JUMP_FORCE`, `TERMINAL_VELOCITY`, `stepVelocity` |
| `js/Utils.js` | — | `clamp`, `rand`, `chance`, `padScore` |

---

## 7. Pages

### 7.1 `index.html` (707 lines) — Homepage

**Purpose:** The cinematic landing page. Drives hiring-manager conversion.

**Sections, in order:** intro overlay (`#intro-overlay`) → custom cursor (`#cur`) → generated header → hero (`#hero-section.theme-dark`, two `h1`-level `.hero-line` split into `.hero-char` spans, `#cursorTrailLayer`, animated stat counters 302/30/50, scroll prompt, `.floating-character` link to the game) → mobile progress bar → scroll-reveal text (`#credibilityReveal` / `.srt-paragraph`, word-by-word opacity) → sticky featured projects (`#sticky-featured` / `.sfp-card` ×6) → Brahmi case-study teaser (`#brahmi.csx`, sticky-left storytelling) → horizontal work carousel (`#work`, "Three ways I build brands") → About teaser → generated footer → game section (`#game` canvas + `#mute`).

**Scripts:** `gsap.min.js`, `ScrollTrigger.min.js`, `js/sticky-featured-projects.js`, `js/home-motion.js`, `js/floating-character.js`, `js/brahmi-story.js`, `dropdown.js`, `script.js`, `main.js` (module). CSS: `style.css`, `css/home-rebuild.css`, `css/mobile-fixes.css`.

**Animations:** intro word flash; hero char split + per-char hover stagger + inverted overlap; cursor trail spawning 9 Brahmi images behind the cursor (desktop only); stat count-up; srt word reveal on scroll; GSAP pinned stacked featured projects; `csx` sticky-left story fade-ins; GSAP horizontal scroll-jack for the work carousel; floating character idle levitation.

**State:** `localStorage` — `auto-run-high` (game), `game_muted` (sound). Custom events: `hero:ready`, `revealblock`/`revealunblock`.

### 7.2 `about.html` (389 lines) — About

**Purpose:** Bio + resume. Hero h1 ("broken laptop at 14"), alternating editorial story blocks (`.about-story-block.reveal` / `.about-story-image.reveal`), experience timeline (Creative Lead @ Paavani, Branding Designer @ Destiny, Graphic Designer @ Director In), certificates/education/languages columns, resume PDF download.

**Scripts:** `dropdown.js`, `script.js` only. **Animations:** generic `.reveal` scroll reveals, cursor, scroll bar.

**Known markup quirk:** lines 264–274 — a `.about-story-image` contains a double-nested `<picture>` (outer missing `loading`/alt). See §24.

### 7.3 `real-estate.html` (444 lines) — Real Estate

**Purpose:** 4 real-estate case studies: Paavani Properties (with `#paavani` id), VR Devaiah Enclave (`.devaiah-gallery`), Sidvin Serenity (`.work-grid-3`), Royal Farm (`.work-grid-3`). Includes "Free Resource — The Realtor's Edge Playbook" download block (`pdfs/Realtors_Edge_Playbook.pdf`).

**Scripts:** `dropdown.js`, `script.js`, `lightbox.js` (loaded **without** `defer` here). **Interactions:** desktop lightbox on `.feature-visual`, `.gallery-tile`, `.work-visual`, `.devaiah-row img`. No animated counters, no scroll reveals.

### 7.4 `lifestyle.html` (598 lines, largest page) — Lifestyle

**Purpose:** 4 lifestyle case studies: Brahmi Coffee Roasters (`.idea-gallery` ×8), Isha V, **Arvi Hospital** (includes the only `.compare-slider` before/after interaction), Snehaloka Cricket Academy.

**Scripts:** `dropdown.js`, `script.js`, `lightbox.js`, `before-after.js`. **Interactions:** lightbox; compare slider with pointer/keyboard (arrows ±5, Shift ±10, Home/End), `clipPath: inset()` before-image reveal, `aria-valuenow` sync, IntersectionObserver reveal. Arvi tiles use `.png` fallbacks (not `.jpg`).

### 7.5 `builds.html` (328 lines) — Web Product Builds

**Purpose:** Web products: IronLog, AlbumFlow, Selixo, Fitness Guide, Property Image Optimizer, Weekend Planner. `body.page-dark`.

**Sections:** `#macbookScroll` (200vh GSAP-scrubbed MacBook that opens and lifts away) → `#buildsGrid` (JS-rendered 3D pin cards from the `BUILDS` config in `js/builds-motion.js`) → related-work links.

**Scripts:** `gsap.min.js`, `ScrollTrigger.min.js`, `dropdown.js`, `script.js`, `js/macbook-scroll.js`, `js/builds-motion.js`. CSS: `style.css`, `css/builds.css`, `css/macbook-scroll.css`, `css/mobile-fixes.css`. Card images use `-400/-800/-1600` AVIF/WebP/JPG variants generated per the `w`/`h` config fields.

### 7.6 `playground.html` (401 lines) — Playground

**Purpose:** Editorial gallery: 11 images + 10 videos in two `.pg-grid` grids (`#pgPhotos`, `#pgVideos`). `theme-color #000000`.

**Sections:** hero → photo grid → video grid → `#pgLightbox`.

**Scripts:** `dropdown.js`, `script.js`, `playground.js` (lightbox + lazy videos), `gsap.min.js`, `ScrollTrigger.min.js`, `CustomEase.min.js`, `lenis.min.js`, `js/playground-gallery.js` (motion layer). **Interactions:** Lenis smooth scroll wired to ScrollTrigger; staggered entrance reveals; videos are `preload="none"` with AVIF posters and viewport-gated `src` (set from `data-src` on first intersect); lightbox stops/restarts Lenis.

### 7.7 `tools.html` (291 lines) — Tools & Skills

**Purpose:** Skills grouped by discipline (Design / Motion & 3D / Digital & Technical) + resume download. **No page-specific CSS or JS.** Simplest page.

### 7.8 `changelog.html` (326 lines) — Changelog

**Purpose:** 7 dated site-update entries, `noindex, follow`. Heavy use of inline styles referencing CSS custom properties (`var(--line)`, `var(--graphite)`, `var(--serif)`).

### 7.9 `404.html` (251 lines) — Not Found + Game

**Purpose:** Custom 404 with the endless-runner game as primary engagement. `noindex, follow`, canonical → `/`. Game section sits **before** `<main>`; `removeGameFootBottom()` in `build-nav.mjs` dedupes its footer row.

### 7.10 `work/brahmi.html` (358 lines) — Brahmi Coffee Roasters case study

**Purpose:** Flagship brand-identity case study (coffee). `body.page-dark`.

**Sections:** hero → overview meta grid → autoplay process video (WebM + MP4 poster) → `#brahmi`-pinned storytelling (`.cs-story` ×3 slides: Brief/The Problem/Process) → interleave images + `cs-image-row` → Result → **44-page flipbook** (`.premium-flipbook-wrapper` desktop-only via `js/flipbook-desktop.js`; `.mobile-only` Elfsight widget which is **dead/blank**) → next-project nav.

**Scripts:** `js/flipbook-desktop.js`, `dropdown.js`, `script.js`, `lightbox.js` (inert — no targets), `js/reveal-on-scroll.js`, `js/blend-selector.js` (inert — no targets), `gsap.min.js`, `ScrollTrigger.min.js`, `js/storytelling.js`. CSS: `case-study.css`, `case-study-dark.css`, `premium-flipbook.css`, `storytelling.css`, `mobile-fixes.css`. PageFlip 2.0.7 loads dynamically from unpkg (CSP-allowlisted).

### 7.11 `work/paavani-properties.html` (443 lines) — Paavani case study

**Purpose:** End-to-end brand system for a real-estate developer, with a **live VR plot-finder iframe**. `body.page-dark`.

**Sections:** parallax hero → 4 count-up stats (30+ / 50 / 302 / ₹82) → `.cs-story` pinned narrative (`data-scrollvh-desktop="1.4"`, `data-scrollvh-mobile="1.1"`) → 4-step process (`ol.cs-process-steps`) → overview block → giant 302 result stat → live interactive embed (`#interactiveFrame` lazy-loads `https://vr-devaiah-enclave.vercel.app/`) → applied-everywhere grid → next-project nav.

**Scripts:** `dropdown.js`, `script.js`, `lightbox.js` (inert), `js/reveal-on-scroll.js`, `js/paavani.js`, `gsap.min.js`, `ScrollTrigger.min.js`, `js/storytelling.js`. CSS: `case-study.css`, `case-study-dark.css`, `paavani.css`, `storytelling.css`, `mobile-fixes.css`.

---

## 8. Styling System

- **No Tailwind / SCSS / CSS modules.** Plain CSS: one **minified** global `style.css` (10 physical lines, ~39 KB) + **10 hand-written scoped stylesheets** in `css/`.
- **Global tokens** live in `:root` inside `style.css`:
  ```css
  :root {
    --paper:#FAFAF8; --ink:#0E0E0F; --graphite:#6B6B6B; --line:#E4E3DE;
    --accent:#C41E3A; --serif:'Fraunces',serif; --sans:'Inter',sans-serif;
    --hero-text:#111111; --hero-invert:#ffffff;
    --nav-height:90px; --nav-height-scrolled:66px;
  }
  ```
- **Scoped variables:** `css/builds.css` adds `--accent-soft:#e4576b` on `body.page-dark`; `css/home-rebuild.css` adds `--char-duration` (default `6s`); `css/case-study.css` scopes `--cs-accent/--cs-header-bg/--cs-header-text` to `.case-study` with a `.theme-brahmi` override (brass `#C99A4B`, teal `#0F3B3E`, cream `#F5F1E8`); `css/premium-flipbook.css` reads `--flipbook-shift` (JS-set).
- **Theme system:** No `.theme-dark`/`.theme-light` classes exist. Dark mode is achieved with `body.page-dark` (implemented in `case-study-dark.css`), plus `theme-dark` semantic class only in the generated footer markup. Dark surfaces: `#000` (playground/menu), `#050505` (builds/macbook/flipbook), `#111`/`#0a0a0a` (cards).
- **Utilities:** `.wrap` (1240px container), `.sr-only`, `.kicker`, `.tight`.
- **Responsive strategy:** desktop-first base CSS; breakpoints are mostly `max-width:` at 480/700/768/820/900/1024/1279; `min-width:640/641/701/1024`; hover gating via `(hover:hover) and (pointer:fine)`; `prefers-reduced-motion:reduce` in 9 of 11 CSS files. `css/mobile-fixes.css` is the ≤768px hardening layer (loaded last, uses `!important` liberally).
- **Key techniques:** `backdrop-filter` (header, mega-menu, compare handle), `clip-path: inset()` (compare slider), `mix-blend-mode` (difference cursor/hero, overlay grain, screen glass), `mask-image` + `-webkit-text-stroke` (MacBook), `position:sticky` (only `home-rebuild.css` `.csx-left`), SVG/data-URI backgrounds (keyboard, grain, noise, diamond pattern), `perspective` + `rotateX` (MacBook, pin cards).
- **Fonts:** Google Fonts `Fraunces` (display serif, `--serif`) and `Inter` (UI sans, `--sans`). Loaded with `<link rel="preload" as="style" onload="this.onload=null;this.rel='stylesheet'">` + `<noscript>` fallback; the inline `onload` handler is CSP hash-pinned.
- **Cache-busting:** every asset URL carries `?v=YYYYMMDD` (e.g. `style.css?v=20260901`). Bump the date whenever the file changes. Images are served `immutable` for 1 year, so **changed images must get a new filename or a new `?v=`**.

---

## 9. Design System

| Token | Value | Usage |
|---|---|---|
| **Primary color** | `--accent` `#C41E3A` (crimson) | CTAs, labels, kickers, dots, markers |
| **Accent (soft)** | `--accent-soft` `#e4576b` | Pin-card glow (builds) |
| **Paper (light bg)** | `--paper` `#FAFAF8` | Page backgrounds, light sections |
| **Ink (text/dark bg)** | `--ink` `#0E0E0F` | Primary text, dark section background |
| **Graphite (muted)** | `--graphite` `#6B6B6B` | Secondary text |
| **Line (hairline)** | `--line` `#E4E3DE` | Borders/dividers (light) |
| **Dark surfaces** | `#000`, `#050505`, `#111`, `#0a0a0a` | Dark pages, menus, cards |
| **Dark text/dividers** | `#F5F5F5`, `#E0E0E0`, `#2A2A2A` | Case-study dark theme |
| **Status green** | `#22c55e` | "Open to work" ping |
| **Brahmi palette** | brass `#C99A4B`, teal `#0F3B3E`, cream `#F5F1E8`, sand `#C9BFA8` | Brahmi case-study scoped theme |

**Typography:** Fraunces (`--serif`) for all display/headline type — hero lines, section titles, card names, big stats (`clamp(2.2rem,5vw,3.75rem)` etc.). Inter (`--sans`) for body/UI. `.kicker` = 13px uppercase accent label. `text-wrap: balance/pretty` used in spots.

**Border radius scale:** `4px` (game shell, teasers), `8px` (images, gallery), `12px`/`14px`, `24px` (mega-menu, macbook, pin-card), `100px`/`999px` (pill buttons), `50%` (avatars/dots).

**Spacing:** `.wrap` = 1240px, gutters `40px` → `20px` (mobile forces `24px`); section vertical rhythm `clamp(56px,8vh,88px)`; footer `70px 0 50px`.

**Buttons:** `.btn` pill (100px radius). `.btn-solid` (accent/ink filled), `.btn-ghost` (outlined). Arrow CTAs `.teaser-link`. ≥44px touch targets on mobile.

**Cards:** `.work-card`, `.pin-card` (3D hover tilt), `.sfp-card` (pinned stack), `.mega-project`, `.mega-cs-card`, `.mobile-project-row`. All rounded 8–24px with media + caption hierarchy.

**Inputs:** No text inputs. The only interactive form control is `.copy-email` (button).

**Icons:** No icon library. Unicode glyphs (`→`, `›`, `&times;`, `&deg;`), inline SVG (compare handle chevrons, MacBook keyboard, status pings via CSS), and emoji (`♪`, `🔇` in the game mute button).

**Dark/light:** Toggled per page via `body.page-dark` (builds, both case studies) — there is **no** runtime theme toggle. The custom cursor (`#cur`) and hero text adapt with `mix-blend-mode: difference` and `.cursor-dark`/`.cursor-light` states.

**Animation language:** Single signature easing `cubic-bezier(.22,1,.36,1)` (expo-out) used ~31× across CSS. Durations: micro 0.2–0.35s, reveals 0.5–0.9s, scrub 1–1.2s, loops 1.6s (pulse) / 6s (float, pin rings). Only `transform`/`opacity` are animated for GPU-friendliness.

---

## 10. Animation System

### Libraries
- **GSAP 3.15.0 + ScrollTrigger** (vendored) — used on index, builds, playground, both case studies.
- **CustomEase** (vendored) — playground only (`pgEase` = `0.22,1,0.36,1`).
- **Lenis 1.3.25** (vendored) — playground only.
- **CSS animations/keyframes** — pure CSS loops (no JS driving).
- **Vanilla rAF + IntersectionObserver** — most site-wide effects.

### Where each technique is used

| Effect | Implementation | Location |
|---|---|---|
| Intro flash sequence (word cycling) | `script.js` IIFE, timers | `index.html` `#intro-overlay` |
| Custom cursor (dot + label + bg-aware invert) | `script.js`, rAF lerp | all pages |
| Scroll progress bar + header compact state | `script.js`, rAF | all pages |
| Hero text split into `.hero-char` + hover stagger | `script.js` | index |
| **Cursor image trail** (spawns 9 Brahmi images) | `script.js`, rAF, overlap inversion | index, desktop only |
| Stat count-up (302/30/50) | `script.js`, rAF `easeOutCubic` | index |
| `.srt-word` scroll-reveal paragraph | `script.js`, scroll handler | index `#credibilityReveal` |
| Generic `.reveal` / `.reveal-block` / `.reveal-child` | `script.js` + `js/reveal-on-scroll.js` | about / case studies |
| Sticky pinned featured-projects stack | `js/sticky-featured-projects.js` (GSAP pin + scrub) | index |
| Horizontal scroll-jack work carousel | `js/home-motion.js` (GSAP pin + scrub) | index |
| Sticky-left Brahmi story (csx) | `js/brahmi-story.js` (GSAP fromTo, `position:sticky` CSS) | index |
| Floating pixel character levitation | `css/home-rebuild.css` keyframes `hero-char-float` + `js/floating-character.js` (duration jitter) | index |
| **MacBook scroll-open hero** | `js/macbook-scroll.js` (GSAP timeline, `rotateX` lid, scrub) | builds |
| 3D pin cards (hover tilt, beam, rings) | pure CSS in `css/builds.css` (`:hover`, fine-pointer gated) + IO reveal in `js/builds-motion.js` | builds |
| Playground staggered entrance + reveals | `js/playground-gallery.js` (GSAP + Lenis) | playground |
| Before/after compare slider | `before-after.js` (pointer/keyboard, `clip-path`) | lifestyle |
| Desktop lightbox (fade, prev/next) | `lightbox.js` | real-estate / lifestyle |
| 44-page flipbook | `js/flipbook-desktop.js` (PageFlip 2.0.7 from unpkg, 700ms flips) | brahmi, desktop ≥768px |
| Pinned storytelling narrative | `js/storytelling.js` (GSAP pin, per-slide enter/retreat with scale/blur/`z`) | both case studies |
| Paavani hero parallax | `js/paavani.js` (rAF-throttled `translate3d` + `scale(1.12)`) | paavani |
| Paavani stat count-up | `js/paavani.js` (IO + rAF) | paavani |
| Lazy iframe load | `js/paavani.js` (IO `rootMargin 300px`) | paavani |
| Endless-runner game | game ES modules + Canvas 2D, `requestAnimationFrame` loop | index + 404 |
| CSS keyframes | `pulse-ring`, `pulse`, `blink`, `hero-char-enter`, `hero-char-float`, `hero-char-shadow`, `pin-ring-pulse`, `csSpin` | various |

**Reduced motion:** Every animation is gated on `window.matchMedia('(prefers-reduced-motion: reduce)')` and every JS-driven component has a static CSS fallback state. `script.js` also removes the intro overlay entirely for reduced-motion users.

---

## 11. State Management

There is **no state-management library** (no Zustand/Redux/Context/Jotai). All state is:

| Kind | What | Where |
|---|---|---|
| `localStorage` | `auto-run-high` (game high score) | `js/Score.js` |
| `localStorage` | `game_muted` (sound toggle) | `js/Sound.js` |
| Global JS objects | `window.__pgLenis` (Lenis instance), `window.__brahmiFlipbook` (PageFlip book), `window.storytellingInit`, `window.paavaniJsInitialized` (idempotency guards) | `js/playground-gallery.js`, `js/flipbook-desktop.js`, `js/storytelling.js`, `js/paavani.js` |
| Custom DOM events | `hero:ready`, `revealblock` / `revealunblock` | `script.js` broadcasts; consumed by counters + cursor trail |
| DOM classes | `.in-view`, `.visible`, `.open`, `.invert`, `.loaded`, `.fade-out`, `.open`, `.csx-anim`, `.macbook-anim`, `body.past-hero`, `body.lb-open`, etc. | everywhere — the primary state signal |
| Game object state | `Game.mode`, `Game.running`, etc. | `js/Game.js` |

---

## 12. Hooks

**No React/vanilla hooks exist** (this is a React-free codebase). The functional equivalents — reusable JS helper patterns — are:

- **IntersectionObserver reveal helpers** — recreated per file rather than shared: `script.js` (§reveal), `js/reveal-on-scroll.js`, `js/builds-motion.js` (`revealCards`), `js/playground-gallery.js`, `js/paavani.js` (stats + iframe), `before-after.js`, `js/flipbook-desktop.js`, `js/playground.js` (videos).
- **Stat count-up** — two near-duplicate implementations: `script.js` (`.stat-count`, `easeOutCubic`, 1500ms) and `js/paavani.js` (`.cs-stat-num`, `1-(1-p)^3`, 900ms, prefix/suffix support).
- **rAF-throttled scroll handlers** — `script.js` (scroll bar, hero-active check, overlap loop), `js/paavani.js` (parallax), `before-after.js` (resize).
- **Reveal-blocking event pattern** — `script.js` dispatches `revealblock`/`revealunblock` on header hover and dropdown open to pause the hero cursor trail.

If you must add a reusable hook, follow the existing pattern: **IIFE + element guard + reduced-motion check + IntersectionObserver + rAF**, ES5-style `var`/function declarations.

---

## 13. Utility Functions

| Utility | File | Purpose |
|---|---|---|
| `clamp(value, min, max)` | `js/Utils.js` | Number clamping (game) |
| `rand(min, max)` | `js/Utils.js` | Random float (game) |
| `chance(probability)` | `js/Utils.js` | Boolean random (game) |
| `padScore(score)` | `js/Utils.js` | 5-digit zero-padded score text (game) |
| `GRAVITY`, `JUMP_FORCE`, `TERMINAL_VELOCITY`, `stepVelocity()` | `js/Physics.js` | Game physics constants |
| `typeCycle(el, words)` | `script.js` | Type/delete text loop (`.type-cycle`) |
| `splitIntoChars(el, text)` | `script.js` | Splits hero text into `.hero-word`/`.hero-char` spans |
| `sectionTheme(el)` / `themeAt(x,y)` / `applyTheme()` | `script.js` | Cursor background-theme detection |
| `findEndIndex(html, start, tagName)` | `scripts/build-nav.mjs` | Balanced-tag scanning for menu replacement |
| `replaceHeader/replaceMobileMenu/replaceFooter/removeGameFootBottom` | `scripts/build-nav.mjs` | Nav/footer codegen |
| `parse_multipart`, `check_auth` (sha256 token) | `server.py` | Local upload auth |
| `padPage(n)` / `pageUrl(n)` | `js/flipbook-desktop.js`, `js/premium-flipbook.js` | 44-page URL builder (`page-01.jpg`) |
| `collectWithin(scope)` / `open/go/close` | `lightbox.js` | Lightbox source collection + navigation |

**Constants:** `BUILDS` array (`js/builds-motion.js`) — the config for the six build cards. `HEADER_HTML` / `MOBILE_MENU_HTML` / `FOOTER_HTML` / `TARGETS` (`scripts/build-nav.mjs`) — the nav chrome. `IMAGES`, `MAX_VISIBLE`, `SPAWN_MIN/MAX`, `IMG_SIZE`, `ROTATIONS`, `BEHIND`, `DESKTOP` (`script.js`) — hero trail config. `TOTAL_IMAGES = 44` (`js/flipbook-desktop.js`). `PAGE_W=1280`, `PAGE_H=720`.

---

## 14. Data Flow

- **Content data:** Lives **in the HTML** — there is no CMS and no fetch layer. Text, copy, and image paths are static markup.
- **Derived data:** `js/builds-motion.js` renders the six pin cards into `#buildsGrid` from its local `BUILDS` array (name, sub, href, chips, image basename, width/height). Editing a card = editing `BUILDS`, then re-running `npm run build:nav` **is not required** (this is a runtime JS render, not a build-time template — cache-bump `js/builds-motion.js?v=` instead).
- **Injected markup:** `dropdown.js` injects the mega-menu HTML into `#designDropdown` at runtime; `js/flipbook-desktop.js` builds 44 page `<div><img>` elements from `/images/brahmi/page-NN.jpg`.
- **Attribute-driven behaviors:** `data-cur` (cursor label), `data-email` (copy), `data-target`/`data-suffix`/`data-prefix` (counters), `data-type`/`data-src` (playground), `data-flip-state`/`--flipbook-shift` (flipbook frame state), `data-scrollvh-desktop/mobile` (storytelling pace).
- **External data:** `api/manifest.js` lists `@vercel/blob` image URLs — gated behind `x-admin-token`, not consumed by the site itself (no client call exists).
- **Persistence:** only the game's `localStorage` keys (`auto-run-high`, `game_muted`).
- **Server-side:** none at request time except `api/manifest.js`. The VR iframe and the PageFlip CDN script are the only third-party requests at runtime.

**Prop/Context story:** N/A — no components with props. The "shared props" are CSS variables and generated markup.

---

## 15. Assets

- **Images:** `images/` — 363 files, 50 MB. **AVIF → WebP → JPG triplet convention:** each photo exists in all three formats sharing a basename (e.g. `brahmi-pourshot.{avif,webp,jpg}`), referenced through a `<picture>` with `<source type="image/avif">` then `<source type="image/webp">`, `<img>` fallback, `width`/`height` set, and `loading="lazy" decoding="async"` (hero/LCP images are eager with `fetchpriority="high"`).
  - 119 `.avif`, 119 `.webp`, 95 `.jpg`, 17 `.png`, 10 `.m4v`, 1 `.mp4`.
  - `images/brahmi/` = `page-01.jpg` … `page-44.jpg` (flipbook pages, `images/brahmi` ≈ 3 MB).
  - Responsive variants: nav avatars use `nav-avatar-400/800.*`; build-card images use `-400/-800/-1600` variants.
  - Largest files: `pg-video-*.m4v` (up to 1 MB each), `arvi-*.png` (up to 1 MB), `brahmi-packaging-*.jpg`, `brahmi-process.mp4`.
- **PDFs:** `pdfs/` — `brahmi-brand.pdf` (5.88 MB, **not linked in markup** — see §24), plus root `Aryan_Swaroop_Resume.pdf` and `Realtors_Edge_Playbook.pdf` (both linked and downloadable).
- **Fonts:** not self-hosted; Google Fonts CDN (Fraunces, Inter). No `@font-face` in the repo.
- **Icons/favicons:** `favicon.ico`, `favicon-16/32x32.png`, `android-chrome-192/512x512.png`, `apple-touch-icon.png`, `mstile-150x150.png` (all referenced with `?v=2`). Original sources in `archive/favicon-source/`.
- **Videos:** 10 playground `.m4v` + 1 Brahmi process `.mp4`. Playground videos use `preload="none"`, AVIF posters, and viewport-gated `src`. Brahmi process video is `autoplay muted loop playsinline` with WebM+MP4 sources.
- **Organization/optimization:** images grouped by project prefix (`paavani-*`, `brahmi-*`, `arvi-*`, `ishav-*`, `snehaloka-*`, `build-*`, `mega-*`, `pg-*`, `sfp-*`, `hero-*`). `archive/` holds unused originals (not served).
- **Caching:** `vercel.json` serves `/images/*` with `public, max-age=31536000, immutable` — changed images must get a new filename or `?v=`.

---

## 16. Performance

### Existing optimizations
- **Image formats:** AVIF → WebP → JPG `<picture>` triplets everywhere; `width`/`height` reserved (no CLS); lazy loading + `decoding="async"` on all but eager LCP/hero images; `fetchpriority="high"` preloads on LCP images.
- **Immutable image caching** (1 year) + `?v=YYYYMMDD` cache-busting on CSS/JS.
- **Font loading:** `preconnect` + `preload` + async `onload` swap + `<noscript>` fallback.
- **Lazy media:** playground videos `preload="none"` + posters + viewport-gated `src` (recent B-H3 fix cut page weight from ~4.5 MB to <1.5 MB); paavani iframe lazy-loaded; flipbook images created on demand.
- **Motion budget:** animations restricted to `transform`/`opacity`; `will-change` hints; rAF-throttled scroll handlers; `IntersectionObserver` instead of scroll listeners.
- **Zero runtime deps for the game** (14 ES modules, no libraries).
- **CDN `page-flip`** loaded only on the Brahmi page, only when the wrapper exists.
- **`prefetch`** of `/about` + `/real-estate` on the homepage.

### Bottlenecks / concerns
- **No build step / bundling:** `style.css` is minified but every page loads all of `script.js` (733 lines) + `dropdown.js` + GSAP/ScrollTrigger on some pages that may not need them (e.g. `lightbox.js` loads on both case studies where it is inert; `blend-selector.js` loads on brahmi where inert).
- **Monolithic `script.js`** (25 KB) runs the cursor, intro, scroll bar, menu, dropdown, counters, hero trail, and reveals on **every** page, including ones that use none of those features.
- **Large PNGs:** `arvi-*.png` up to 1 MB (used as fallback/`image-set`); `brahmi-brand.pdf` 5.88 MB unreferenced; `images/brahmi` page scans ≈ 3 MB total.
- **GSAP+ScrollTrigger are sync-loaded** (non-defer) on index/builds/playground/case studies — render-blocking scripts on those pages.
- **No code splitting, no HTTP/2 push config, no critical-CSS inlining.**

### Recommendations summary
See [§27 Improvement Opportunities](#27-improvement-opportunities) for a prioritized list.

---

## 17. Accessibility

Verified invariants across all 11 pages:
- **Semantic HTML:** one `<h1>` per page, sequential heading levels, `<header>/<nav>/<main>/<footer>` landmarks, `<button>` vs `<a>` kept semantically correct.
- **Skip link:** `.skip-to-content` is the first element in `<body>` on every page.
- **Screen-reader support:** `.sr-only` "AI summary" block (`role="note"`, `aria-label`), `alt` text on every `<img>`, `aria-label` on icon-only buttons, `aria-hidden="true"` on decorative elements (`#cur`, cursor trail layer, compare divider), `aria-live="polite"` on flipbook counter, `role="slider"` + `aria-valuenow` on the compare handle, `role="group"` on the compare stage, `aria-labelledby`/`aria-label` on key sections, `aria-expanded`/`aria-haspopup`/`aria-controls` on menu triggers.
- **Keyboard navigation:** mega-dropdown opens on trigger focus, closes on focus-out/Escape (Escape restores focus); flipbook arrows/Home/End; compare slider arrows/Home/End; lightbox Escape/arrows; mobile menu Escape; all flipbook/menu controls are focusable buttons.
- **Focus states:** `:focus-visible` outlines defined.
- **Touch targets:** ≥44px enforced in `css/mobile-fixes.css` (hamburger, copy-email, foot-bottom links, teaser-link via `::before` hit-area expansion; MacBook badge 44px on coarse pointers).
- **Reduced motion:** `prefers-reduced-motion` honored in every JS file and 9/11 CSS files; reduced-motion users get static/instant states (intro overlay removed, reveals shown immediately, stat counters filled, flipbook revealed, Lenis skipped).
- **Contrast:** AA fixes applied for `.mobile-cs-desc` (6.27:1), `.mobile-subtitle`, `.mobile-project-sub`.
- **Residual nits (documented in `AUDIT/`):** `cursor:none` is applied in CSS on `body.page-dark` even before JS initializes (B-M6, optional fix); hero `<h2>` line 2 is technically a second heading of the same level as the `<h1>` on the homepage (intentional design, flagged in audits).

---

## 18. SEO

- **Metadata:** every page has title (50–60 chars), meta description (~140–160 chars), `keywords` on some pages, canonical, `robots` (`index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1`; 404/changelog are `noindex, follow`), `theme-color`, `author`, `referrer`.
- **Open Graph / Twitter:** full `og:*` set (`og:type` website/article/profile, `og:image` 1200×630 with `og:image:width/height/alt`, `og:locale en_IN`) + Twitter `summary_large_image` cards.
- **JSON-LD structured data:** valid `@graph` blocks on **all 11 pages** — Person/WebSite/WebPage/BreadcrumbList/CollectionPage/Article/CreativeWork/ImageObject/ProfilePage/AboutPage, plus `Speakable`, `SearchAction`, `InteractionCounter`, `Occupation` on the homepage. Google Search Console verification file `google469c96c221aaafc3.html` present (with a `vercel.json` route to bypass cleanUrls 308).
- **`robots.txt`:** allows all crawlers incl. 16+ named AI agents (GPTBot, ClaudeBot, Claude-SearchBot, OAI-SearchBot, Perplexity, Google-Extended, Bytespider, Amazonbot, etc.); disallows `/api/`; references both sitemaps.
- **Sitemaps:** `sitemap.xml` (exactly the 9 indexable pages + image entries) and `sitemap-images.xml` (30+ images with captions).
- **AI discoverability:** `llms.txt` (comprehensive AI-readable profile), sr-only `.ai-summary` blocks on every page, `humans.txt`, `security.txt`, `browserconfig.xml`, `site.webmanifest` (PWA manifest, `display: standalone`).
- **Page performance signals:** canonical + extensionless URLs; LCP images preloaded and eager.
- **No robots meta disallow of search on 404/changelog (intentionally `follow`), and no structured data on 404** (single minimal `WebPage` node).

---

## 19. Build Configuration

- **Build tool:** **None.** Zero build step. HTML/CSS/JS are served as authored.
- **Code generation (the one "build"):** `scripts/build-nav.mjs` — run `npm run build:nav` (alias for `node scripts/build-nav.mjs`) to regenerate header + mobile menu + footer across the 11 `TARGETS` files. After adding a page, add it to `TARGETS`. Any nav/footer hand-edit will be overwritten.
- **Local dev server:** `python3 server.py` → `http://localhost:8000` (also exposes authenticated `/upload`, `/upload-resume`, `/delete` for local asset management; extensionless URLs 404 locally — expected).
- **Deployment config (`vercel.json`):**
  - `cleanUrls: true`, `trailingSlash: false`
  - `functions.api/manifest.js` → `maxDuration: 10`
  - Route: `^/google469c96c221aaafc3\.html$` → `/google469c96c221aaafc3` (bypass cleanUrls)
  - Headers: images `immutable` 1 year; `.css|.js` `max-age=300`; `/(.*)` gets **CSP** + `X-Frame-Options: SAMEORIGIN` + `X-Content-Type-Options: nosniff` + `Referrer-Policy: strict-origin-when-cross-origin` + `Permissions-Policy`.
- **CSP (live):** `default-src 'self'; script-src 'self' https://unpkg.com 'unsafe-hashes' 'sha256-1jAmyYXcRq6zFldLe/GCgIDJBiOONdXjTLgEFMDnDSM='; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob:; connect-src 'self'; frame-src 'self' https://vr-devaiah-enclave.vercel.app; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'self'`. The only inline script is the Google Fonts preload `onload` handler (hash-pinned). **Elfsight is deliberately NOT allowlisted** (dead mobile widget). Any new third-party script must be added to this allowlist.
- **Environment variables:** `MANIFEST_ADMIN_TOKEN` (required by `api/manifest.js`; fails closed if unset; callers send it via the `x-admin-token` header). `.env.local` contains a Vercel-generated `VERCEL_OIDC_TOKEN` (gitignored via `.env*`).
- **Serverless function:** `api/manifest.js` — `GET` only, token-gated, `Cache-Control: private, no-store`, lists `@vercel/blob` blobs under `images/`, returns `{ filename: url }`.
- **`package.json`:** `private: true`; single script `build:nav`; deps `@vercel/blob ^2.6.1`, `gsap ^3.15.0`, `lenis ^1.3.25` — gsap/lenis exist only as the source for the vendored browser copies and are **not imported at runtime**. `package-lock.json` is committed (pinned).

---

## 20. Dependencies

| Package | Version | Purpose | Used In |
|---|---|---|---|
| `gsap` | `^3.15.0` (3.15.0) | Animation library — **vendored** to `js/vendor/gsap.min.js` | index, builds, playground, case studies (via vendored file; npm package only for versioning) |
| `lenis` | `^1.3.25` (1.3.25) | Smooth scrolling — **vendored** to `js/vendor/lenis.min.js` | playground only (via vendored file) |
| `@vercel/blob` | `^2.6.1` | Blob storage SDK | `api/manifest.js` |
| `page-flip` | `2.0.7` | Page-flip book engine | Brahmi case study — **loaded at runtime from unpkg CDN** (`flipbook-desktop.js`) |
| Google Fonts (Fraunces + Inter) | — | Webfonts via CDN | all pages |
| Node builtins (`node:fs`, `node:path`, `node:url`) | stdlib | Nav/footer generator | `scripts/build-nav.mjs` |
| Python stdlib (`http.server`, `hashlib`, etc.) | stdlib | Local dev/upload server | `server.py` |
| Elfsight `platform.js` | — | Mobile flipbook widget | `work/brahmi.html` (dead — blocked by CSP) |
| jQuery / Turn.js | — | Referenced by `js/premium-flipbook.js` (NOT loaded anywhere) | dead code |

**Transitive deps (from `package-lock.json`, node_modules only):** `@vercel/oidc`, `@vercel/cli-config`, `@vercel/cli-exec`, `async-retry`, `cross-spawn`, `execa`, `get-stream`, `human-signals`, `is-buffer`, `is-node-process`, `is-stream`, `isexe`, `jose`, `merge-stream`, `mimic-fn`, `npm-run-path`, `onetime`, `os-paths`, `path-key`, `retry`, `shebang-command`, `shebang-regex`, `signal-exit`, `strip-final-newline`, `throttleit`, `undici`, `which`, `xdg-app-paths`, `xdg-portable`, `zod`. These exist only to support `@vercel/blob` at build/function time and are not runtime site dependencies.

---

## 21. Coding Standards

- **JavaScript style:** ES5-style IIFEs (`(function(){ ... })()`) with `'use strict'`, `var`, function declarations — deliberately consistent across page scripts. The **game** is modern ES modules (imports/exports, classes). `script.js` is old-style/minified-ish; newer page scripts (`js/builds-motion.js`, `js/macbook-scroll.js`, etc.) use readable `"use strict"` IIFE style with `var`.
- **No comments policy:** older files are comment-free; newer files carry concise block comments explaining *why* (e.g. the pin-card, MacBook, and storytelling headers). Do not add decorative comments.
- **File naming:** kebab-case for HTML/CSS/JS files (`real-estate.html`, `mobile-fixes.css`, `builds-motion.js`). CSS classes kebab-case (`.feature-visual`), JS identifiers camelCase.
- **Page structure:** one `<h1>`, skip link first, `.ai-summary.sr-only` second, then `#cur`, generated header/menu, `<main id="main-content">`, generated footer, page scripts.
- **Asset convention:** AVIF→WebP→JPG `<picture>` triplets, `width`/`height` set, lazy except LCP. Every changed asset gets `?v=YYYYMMDD`.
- **Generated-content rule:** header/mobile-menu/footer are generated by `scripts/build-nav.mjs` — never hand-edit them.
- **Error handling:** static site — no try/catch except defensive library calls; guard every script with element-existence checks; feature-detect (`'IntersectionObserver' in window`, `window.PointerEvent`, `window.gsap`) before use.
- **A11y invariants:** semantic buttons vs links, `alt` everywhere, keyboard support for custom widgets, `prefers-reduced-motion` everywhere, `:focus-visible`.
- **Path style:** root-absolute paths (`/images/...`) are mandatory **inside `build-nav.mjs`**; page files use relative/root-absolute as appropriate for their depth.
- **No framework imports, no TypeScript, no lint/format tooling** — the repo has no eslint/prettier/tsconfig. Readability is enforced by consistency with existing files.

---

## 22. Patterns Used

Only patterns that actually exist:

- **IIFE module pattern** — every page script + `script.js` + `dropdown.js` wraps logic in an immediately-invoked function to avoid leaking globals (the global-leak counter-example: `typeCycle` is defined at top level of `script.js`).
- **Element-guard initialization** — each IIFE returns early when its target element is absent, so the same files load safely on every page.
- **Config-array rendering** — `js/builds-motion.js` `BUILDS` array → generates six cards into `#buildsGrid` (data-driven DOM generation).
- **IntersectionObserver reveal pattern** — the ubiquitous "add `.in-view`/`.visible` once when scrolled into view" behavior (repeated in `script.js`, `reveal-on-scroll.js`, `builds-motion.js`, `playground-gallery.js`, `paavani.js`, `before-after.js`, `flipbook-desktop.js`).
- **GSAP `gsap.context` + `gsap.matchMedia` scoping** — `home-motion.js`, `macbook-scroll.js`, `sticky-featured-projects.js`, `brahmi-story.js`, `storytelling.js` create scoped contexts that `revert()` on teardown/media change.
- **Pinned-scroll storytelling** — ScrollTrigger `pin` + `scrub` timelines (case studies, homepage carousel, featured stack).
- **CSS-gated animation** — JS adds a class (`.macbook-anim`, `.csx-anim`, `.cs-story--active`, `.builds-anim`) that activates animation-only CSS; static fallback otherwise.
- **Data-attribute behavior hooks** — `data-cur`, `data-email`, `data-count`/`data-prefix`/`data-suffix`, `data-type`/`data-src`, `data-scrollvh-*`, `data-flip-state`.
- **Provider-like injection** — `dropdown.js` injects mega-menu markup at runtime; `flipbook-desktop.js` injects the PageFlip CDN script.
- **Custom-event signalling** — `hero:ready`, `revealblock`/`revealunblock`.
- **Canvas pixel-art composition** — the game renders every sprite as `fillRect` primitives (no image assets).
- **Web Audio synthesis** — `Sound.js` generates chiptune music/SFX entirely with oscillators (no audio files).

**Not present:** Compound components, container/presentation split, factory, polymorphic/headless components, provider/context in the framework sense.

---

## 23. Feature Inventory

| Feature | Where | Implementation |
|---|---|---|
| Custom cursor (dot + label + bg-aware invert) | all pages | `script.js` + `#cur` |
| Intro flash / word-cycle overlay | homepage | `script.js` |
| Scroll progress bar + compact header | all pages | `script.js` + `#scrollBar` |
| Mobile full-screen menu (staggered, swipe-close) | all pages | `script.js` + `#mobileMenu` |
| Design mega-dropdown (hover/click/keyboard) | all pages | `dropdown.js` + `script.js` |
| "Open to work" status ping | header | CSS `pulse-ring` |
| Copy-email button | footer all pages | `script.js` + `.copy-email` |
| Sticky pinned featured-projects stack | homepage | `js/sticky-featured-projects.js` |
| Horizontal scroll-jack carousel | homepage | `js/home-motion.js` |
| Sticky-left case-study storytelling (csx) | homepage | `js/brahmi-story.js` |
| Hero char split + hover stagger + inverted overlap | homepage | `script.js` |
| Cursor image trail | homepage | `script.js` |
| Word-by-word scroll-reveal paragraph | homepage | `script.js` `#credibilityReveal` |
| Floating pixel character → smooth scroll to game | homepage | `js/floating-character.js` + CSS |
| MacBook scroll-open hero | builds | `js/macbook-scroll.js` |
| 3D pin cards (CSS tilt + badge + beam + rings) | builds | `js/builds-motion.js` + `builds.css` |
| Editorial gallery + lightbox | playground | `playground.js` + `playground-gallery.js` |
| Lazy autoplay videos (posters, viewport-gated) | playground | `playground.js` |
| Lenis smooth scroll | playground | `playground-gallery.js` |
| Desktop image lightbox (keyboard nav) | real-estate, lifestyle | `lightbox.js` |
| Before/after compare slider | lifestyle (Arvi) | `before-after.js` |
| Stat count-up (302/30/50 / 30+/50/302/₹82) | homepage, paavani | `script.js` / `js/paavani.js` |
| Pinned storytelling narrative | case studies | `js/storytelling.js` |
| Hero parallax | paavani | `js/paavani.js` |
| Lazy VR plot-finder iframe | paavani | `js/paavani.js` |
| 44-page desktop flipbook | brahmi | `js/flipbook-desktop.js` + PageFlip |
| Reveal-on-scroll blocks + staggered children | case studies | `js/reveal-on-scroll.js` |
| Autoplay process video | brahmi | inline `<video>` |
| Endless-runner game (Canvas + Web Audio) | homepage, 404 | ES module graph via `main.js` |
| Photo blend selector | (dead) | `js/blend-selector.js` — no markup |
| Mobile flipbook (Elfsight) | (dead) | `work/brahmi.html` — blank, CSP-blocked |
| Type-cycling headline | (dead markup) | `script.js` `.type-cycle` — no current markup |
| SEO/AI suite | all pages | JSON-LD, `llms.txt`, robots, sitemaps, sr-only summaries |

---

## 24. Known Technical Debt

Derived from the code + the self-audit trail (`AUDIT/`, `REMEDIATION_REPORT_2026-08-03.md`):

1. **Broken mobile Brahmi flipbook (critical, documented):** `work/brahmi.html:314-315` uses an unconfigured Elfsight widget that renders blank on mobile; the working PageFlip book (`js/flipbook-desktop.js`) is desktop-only ≥768px. The fix plan is `AUDIT/15_Priority_Fixes.md` item 1 (reuse PageFlip with portrait sizing, remove Elfsight). **Do not "fix" by editing `work/brahmi.html` alone.**
2. **Dead/inert scripts shipped:** `js/premium-flipbook.js` (jQuery/Turn version — not loaded), `js/brahmi-story.js` (superseded by `js/storytelling.js` — not loaded), `js/blend-selector.js` (loaded on brahmi but zero `.blend-btn` markup), `lightbox.js` (loaded on both case studies but no lightbox targets). Not deleted due to the "flipbook freeze" (L1).
3. **Stale "View Live" link** (`builds.html`): a build card points to an old portfolio deployment instead of the product (B-H1, deferred by owner).
4. **`pdfs/brahmi-brand.pdf` (5.88 MB)** exists but is **not linked anywhere** in the current markup.
5. **`about.html` nested `<picture>` bug** (lines 264–274): a `<picture>` nested inside another `<picture>` with missing `loading`/alt on the outer.
6. **Monolithic `script.js`** (733 lines) bundles unrelated behaviors site-wide; **`style.css` is minified** (10 giant lines) — both are maintenance costs.
7. **No analytics** (M1) — site is unmeasurable; adding analytics requires updating the CSP `connect-src`.
8. **Unused/legacy code:** `server.py` hardcodes an admin SHA-256 token; `.env.local` holds a `VERCEL_OIDC_TOKEN` (gitignored — never commit); `archive/` holds unused source images; `js/vendor/` GSAP+ScrollTrigger sync-loaded on pages where only part is used.
9. **CLAUDE.md drift:** CLAUDE.md says "8 scoped stylesheets" — the repo now has **10** (builds.css and macbook-scroll.css added); it also still calls the CSP/Elfsight state as of 08-03 (see `REMEDIATION_REPORT` note). Treat `AI_CODEBASE_GUIDE.md` + `PROJECT_CONTEXT.md` as the current truth.
10. **CSS duplication:** two near-identical stat count-up implementations (`script.js` vs `paavani.js`); `.reveal`/`.reveal-block` systems coexist; `.status-ping` and `.status-dot` both exist.
11. **Filename nits:** `ishav-guards-guards.*` (doubled word); `arvi-*.png` used as JPG fallback inconsistently (lifestyle tiles).
12. **Naming mismatch:** links to `/work/brahmi` vs `/work/brahmi.html` differ between `dropdown.js` and the mobile menu.
13. **`cursor:none` before JS init** on `body.page-dark` (CSS applies it even when JS is disabled) — flagged B-M6 (optional).
14. **No `llms-full.txt`** (skipped by owner), no `noscript` content for `#game`/flipbook.
15. **CSP tension:** adding any third-party script/analytics/frame requires editing the hash-pinned CSP in `vercel.json`.

---

## 25. AI Development Guide

### Golden rules

1. **Never rewrite unrelated components.** Change only what the task requires; preserve the existing design language everywhere else.
2. **Header, mobile menu, and footer are generated — never hand-edit them.** Edit `scripts/build-nav.mjs` (`HEADER_HTML`, `MOBILE_MENU_HTML`, `FOOTER_HTML`, `TARGETS`) and run `npm run build:nav` to propagate. If a header/menu/footer edit does not survive `build:nav`, it was made in the wrong place. When adding a page, add it to `TARGETS`.
3. **The Brahmi mobile flipbook is frozen.** Do not "fix" it by touching `work/brahmi.html` alone; the plan is `AUDIT/15_Priority_Fixes.md` item 1, coordinated with the flipbook strategy.
4. **Follow the existing conventions before introducing new patterns** — ES5 IIFE page scripts, element guards, kebab CSS classes, `prefers-reduced-motion` everywhere.
5. **Never add a dependency for something achievable with existing tools.** The game is zero-dependency; the site vendors GSAP/Lenis. New third-party scripts also require a CSP allowlist edit in `vercel.json` (and a CDP verification pass).

### Architecture rules

- Static MPA. New pages = new `.html` at root (or `work/`) + page CSS in `css/` + page JS in `js/` (defer) + entry in `TARGETS` (`build-nav.mjs`) + sitemap entries if indexable.
- `style.css` = global, minified. Put **new** styles in the page-scoped stylesheet, not `style.css`. `css/mobile-fixes.css` stays the last-loaded mobile hardening layer.
- Vendor libs live in `js/vendor/` — treat as frozen; bump versions by re-vendoring the exact release and bumping `?v=`.
- Page scripts are loaded with `defer`; only `js/vendor/*` and a few page-specific non-defer scripts load eagerly.

### Naming conventions

- Files: kebab-case (`builds-motion.js`, `mobile-fixes.css`). Classes: kebab-case. JS identifiers: camelCase.
- Images: `<subject>-<context>.{avif,webp,jpg}` triplets; responsive variants use `-400`/`-800`/`-1600` suffixes; keep `width`/`height` accurate in markup.
- Every changed asset gets a bumped `?v=YYYYMMDD` on its URL. Changed images MUST get a new filename or `?v=` (they are cached immutable for 1 year).

### Coding style

- Page scripts: `(function () { 'use strict'; ... })()` with `var`. Guard on element existence first. Feature-detect (`window.gsap`, `IntersectionObserver`, `matchMedia`) before use.
- No TypeScript; no lint/format tooling exists — match surrounding formatting.
- No comments unless they explain *why* (the newer motion files model this well).
- `transform`/`opacity` only for animated properties. Use `will-change` sparingly and clean it up.

### Animation conventions

- Every animation needs a `prefers-reduced-motion` fallback and a no-JS/static state.
- Reuse the site's easing `cubic-bezier(.22,1,.36,1)`; GSAP work uses `gsap.context()`/`gsap.matchMedia()` and reverts on teardown.
- New GSAP/ScrollTrigger usage must call `ScrollTrigger.refresh()` after `load` and `document.fonts.ready` (existing pattern).

### Responsive conventions

- Desktop-first CSS; breakpoints at 480/700/768/820/900/1024/1279. Add mobile overrides to the page's scoped sheet; use `css/mobile-fixes.css` only for cross-page hardening.
- Touch targets ≥44px on mobile (`.copy-email`, `.foot-bottom a`, `.teaser-link` already have `::before` hit-area expanders — follow that pattern instead of adding padding/height).
- Test `(hover:hover) and (pointer:fine)` gating for hover-only effects; `(hover:none),(pointer:coarse)` for touch fallbacks.

### Component / reuse rules

- Reuse existing patterns: `.feature-grid`/`.feature-copy`/`.feature-meta`, `.gallery-strip`/`.gallery-tile`, `.work-grid-3`/`.work-card`, `.btn-solid`/`.btn-ghost`, `.kicker`. Don't invent parallel systems.
- If markup must repeat across pages (e.g. a new nav element), put it in `build-nav.mjs`, not in each page.

### Performance expectations

- Preserve lazy loading, `width`/`height` on images, eager only for LCP, `decoding="async"`, and `picture` triplets.
- Don't add heavy libraries; the site already flags missing analytics and sync-loaded vendor scripts as debt. If a script is only needed on one page, load it only on that page.
- Keep new JS as small IIFEs; avoid loading scripts on pages that don't use them.

### Accessibility expectations

- Exactly one `<h1>`; sequential heading levels; skip-link first; `:focus-visible` outlines; `alt` on every `<img>`; `<button>` vs `<a>` semantic correctness; ARIA for any custom widget (slider `role="slider"` + `aria-valuenow`, menus `aria-expanded`, live regions `aria-live`); keyboard support for new interactive components; `prefers-reduced-motion`.

### Working with this repo (workflow)

1. Read `scripts/build-nav.mjs` before any nav/footer change.
2. Edit page content in the `.html`; page styles in `css/<page>.css`; page behavior in `js/<page>.js`.
3. Cache-bump every edited CSS/JS URL (`?v=YYYYMMDD`) across the pages that reference it.
4. Run `npm run build:nav` if `build-nav.mjs` was touched; it rewrites all 11 pages.
5. Verify locally with `python3 server.py` (remember: extensionless URLs 404 locally — use `.html` paths or a Vercel preview). For CSP changes, re-verify with the headless CDP pass described in the audit docs.
6. Never commit secrets (`.env*` is gitignored). Commit only when asked.

---

## 26. Project Statistics

Measured 2026-08-04.

| Metric | Value |
|---|---|
| HTML pages (excluding verification file) | **11** (9 root + 2 in `work/`) |
| Total HTML files (incl. `google469...html`) | 12 |
| Total HTML lines | 4,536 |
| CSS files | **11** (1 minified global `style.css` + 10 scoped) |
| Total CSS lines | 3,387 |
| JavaScript files | **37** (6 root, 13 page-specific in `js/`, 14 game modules, 4 vendor) |
| Page-script JS lines | 1,196 (`js/*.js` page scripts) |
| Root script lines | 1,093 (`script.js` + `dropdown.js` + `before-after.js` + `lightbox.js` + `playground.js` + `main.js`) |
| Game module lines | 350 |
| Vendor lines | 4 files (GSAP 3.15.0, ScrollTrigger, CustomEase, Lenis 1.3.25) |
| TypeScript files | **0** |
| Node build scripts | 1 (`scripts/build-nav.mjs`) |
| Serverless functions | 1 (`api/manifest.js`) |
| Image files | **363** (119 AVIF, 119 WebP, 95 JPG, 17 PNG, 10 M4V, 1 MP4) |
| Images total size | **50 MB** |
| Flipbook page scans | 44 (`images/brahmi/page-01…44.jpg`, ≈3 MB) |
| PDFs | 3 (`Aryan_Swaroop_Resume.pdf`, `Realtors_Edge_Playbook.pdf`, `pdfs/brahmi-brand.pdf`) |
| Favicons | 7 |
| Repo source size (excluding node_modules/.git) | ≈ 60 MB |
| Repo size incl. node_modules + .git | ≈ 305 MB |
| Largest component (JS) | `script.js` — 733 lines / ~25 KB |
| Largest page (HTML) | `lifestyle.html` — 598 lines |
| Largest CSS file | `css/macbook-scroll.css` — 417 lines (mostly one SVG data-URI) |
| Custom hooks | 0 (no React) |
| Utility modules | `js/Utils.js` + `js/Physics.js` (game) |
| npm dependencies | 3 direct (`@vercel/blob`, `gsap`, `lenis`) |

---

## 27. Improvement Opportunities

Every recommendation is grounded in actual findings from the code and the audit trail.

### Low priority
- Fix the `about.html` double-nested `<picture>` (L264–274) — remove the redundant outer `<picture>`, restore `loading`/alt on the inner `<img>`.
- Link `pdfs/brahmi-brand.pdf` from the Brahmi flipbook section (currently the file is orphaned).
- Rename `ishav-guards-guards.*`; normalize `arvi-*.png` vs `.jpg` fallback usage in lifestyle tiles.
- Reconcile `/work/brahmi` vs `/work/brahmi.html` link styles between `dropdown.js` and `build-nav.mjs` mobile menu.
- Add `<noscript>` fallback content for `#game` and the flipbook; apply `cursor:none` only after JS confirms a fine pointer (B-M6).
- Remove `js/blend-selector.js` from `work/brahmi.html` and `lightbox.js` from both case studies (inert loads) once verified.
- Update CLAUDE.md's "8 scoped stylesheets" count and CSP status to match reality.

### Medium priority
- **Split `script.js`** into per-feature modules loaded only where needed (cursor, mobile menu, dropdown, counters, hero trail). Biggest maintainability win available.
- **Un-minify `style.css`** (or split it) so global styles are reviewable — the 10-line minified file is the main source of CSS confusion.
- **Deduplicate the count-up animation** between `script.js` and `js/paavani.js` into one shared utility.
- **Defer/conditionally load GSAP+ScrollTrigger** (currently sync-blocking on pages that need them) — e.g. load only where `window.gsap` consumers exist.
- **Standardize the ARIA for the hero's second line** (`<h2 id="hero-line-2">` alongside the `<h1>`) — either visually re-level it or confirm intent in the audit notes.
- Add analytics (self-hosted Plausible/Umami, or allowlist an origin in the CSP `connect-src`) to close the D-grade measurement gap (M1).

### High priority
- **Fix the Brahmi mobile flipbook (B-C1).** Replace the dead Elfsight widget with a portrait-friendly PageFlip instance on mobile (per `AUDIT/15_Priority_Fixes.md` #1) and remove the Elfsight script. This is the flagship case study; Mobile UX is the weakest category.
- **Fix or remove the stale "View Live" link (B-H1)** on `builds.html` pointing at the old portfolio deployment.
- **Trim the remaining heavy PNGs** (`arvi-*.png` ≤1 MB each, `brahmi-process.mp4`, `brahmi-brand.pdf`) with AVIF/compression to further cut the heaviest pages.

### Critical
- **Nothing currently blocks production** (the site is live and audited at 86/100). The single most impactful item is the **mobile Brahmi flipbook** (B-C1), which is the only user-visible broken feature. After that, executing `AUDIT/15_Priority_Fixes.md` Weeks 1–2 (C1, H1, H2, M2, M3) would realistically raise the audit score from 86 → 93–96 per the audit's own projection.

---

*End of AI CODEBASE GUIDE. Verified against the repository on 2026-08-04. The code is the authority; update this document whenever its claims change.*
