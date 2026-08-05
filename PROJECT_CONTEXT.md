# PROJECT_CONTEXT.md — Aryan Swaroop Portfolio

> **Single source of truth for the entire codebase.** This file is written so it can be handed to any AI model (Claude, ChatGPT, Gemini, etc.) that must understand and safely modify this project. Everything below was verified against the actual source on 2026-08-04. If a statement here contradicts the code, the code is the authority — update this file.

---

## 1. Project Overview

**Project name:** Aryan Swaroop Portfolio (`aryanswaroop.com`)

**What it is:** A hand-coded, static, single-developer portfolio website for **Aryan Swaroop** — a Brand Designer & Creative Lead based in Bengaluru, India. It showcases his real-estate brand systems, lifestyle/packaging identities, web-product builds, motion experiments, and an interactive Canvas endless-runner game.

**Target audience:** Hiring managers and creative directors evaluating Aryan for **Creative Lead / Brand Designer / Creative Director** roles; also design peers and potential clients. The copy explicitly states he is "open to work" and the footer CTA is "Let's talk about the role."

**Main goals:**
1. Convert visitors into interview requests (primary CTA = `mailto:aryanswaroop.0@gmail.com`, plus a downloadable resume PDF).
2. Demonstrate proof of results, not just aesthetics: "302 qualified leads in 66 days at ₹82 per lead", "30+ projects led", "50+ films produced".
3. Feel genuinely handcrafted — an interactive flipbook, a playable 404 game, cursor-reveal images, and scroll-scrubbed case studies — so the site itself is a portfolio piece.

**Overall experience:** Cinematic, tactile, editorial. Every scroll does something: pinned image stacks, horizontal brand-track, scroll-scrubbed case-study storytelling, a scroll-opened MacBook. The tagline in `llms.txt` sums it up: *"Not another portfolio. Just my best work."*

**Brand personality:** Restless, multidisciplinary ("Restless by nature. Multidisciplinary by design."), premium-but-warm. Dark luxury sections alternate with warm paper-white editorial sections.

**Design philosophy:** Storytelling over grids. Real numbers over vague claims. Motion is used to reward scrolling, never for decoration. Every animated component has a `prefers-reduced-motion` fallback and a no-JS static state. Craft is the selling point — the code quality is part of the portfolio.

**User journey:** Intro overlay flash ("Branding. Designer. 3D Walkthrough…") → cinematic hero with animated stat counters → scroll-reveal credibility paragraph → pinned "Selected Work" image stack → featured Brahmi case study (sticky narrative) → horizontal-scroll "Three ways I build brands" → About teaser → footer contact + a playable endless-runner game.

**Fonts:** Fraunces (editorial serif display) + Inter (neutral UI sans).

---

## 2. Tech Stack

```
Framework:      None — hand-coded static HTML. No SSR, no SPA, no build step.
Routing:        Multi-page site; Vercel `cleanUrls: true` (extensionless URLs).
Language:       HTML5 + CSS3 + Vanilla JavaScript (no TypeScript).
Styling:        One minified global style.css + 8 scoped stylesheets in css/.
Animation:      GSAP 3.15 + ScrollTrigger (vendored) for pin/scrub work;
                vanilla rAF + IntersectionObserver + CSS transitions elsewhere;
                Lenis 1.3.25 smooth-scroll (vendored) on the Playground only;
                CustomEase (vendored) on the Playground only.
State:          None (static). Two localStorage keys: 'auto-run-high' (game),
                'game_muted' (audio toggle).
Backend:        One Vercel serverless function api/manifest.js (@vercel/blob)
                — a token-gated image-manifest listing endpoint, not a CMS.
CMS:            None. All content is hand-written HTML.
Deployment:     Vercel (git push → deploy), cleanUrls on, CSP enforced in vercel.json.
Package Manager: npm (only used for scripts/build-nav.mjs + vendoring gsap/lenis).
Image Optimization: AVIF → WebP → JPG <picture> triplets, width/height set,
                loading=lazy (eager for LCP), immutable 1-year image caching.
Build Tools:    npm run build:nav → node scripts/build-nav.mjs (header/footer generator).
Icons:          No icon library. Inline SVGs, unicode glyphs (♫, ×, →, ⯉), text arrows.
Fonts:          Google Fonts (Fraunces + Inter), preload + async swap + noscript fallback.
```

---

## 3. Folder Structure

```
/  (root)
├── *.html                 11 pages, hand-coded (index, about, real-estate, lifestyle,
│                           builds, tools, playground, changelog, 404, work/brahmi,
│                           work/paavani-properties)
├── style.css              MINIFIED global stylesheet (only 10 lines, all custom
│                           properties + base rules) — referenced as style.css?v=YYYYMMDD
├── script.js              Global site behavior (cursor, mobile menu, mega-menu, intro,
│                           counters, scroll bar, page transitions, reveals). On all pages.
├── main.js                ES-module entry point for the endless-runner game (5 lines)
├── dropdown.js            Injects the "Design" mega-menu markup into #designDropdown
├── lightbox.js            Desktop-only (≥1024px) gallery lightbox
├── before-after.js        Drag/keys before-after slider (lifestyle page only)
├── playground.js          Playground lightbox + video lazy-load/autoplay
├── css/                   Scoped stylesheets (home-rebuild, mobile-fixes, case-study,
│                           case-study-dark, builds, paavani, playground,
│                           premium-flipbook, storytelling)
├── js/                    Page/interaction scripts + the ES-module game modules
│   └── vendor/            Minified vendored copies of gsap, ScrollTrigger,
│                           CustomEase, lenis (NOT imported from node_modules at runtime)
├── scripts/
│   └── build-nav.mjs      Single source of truth for header + mobile menu + footer;
│                           regenerates them into all 11 TARGETS pages
├── api/
│   └── manifest.js        Vercel serverless function (@vercel/blob image listing)
├── images/                361 files; AVIF/WebP/JPG triplets; images/brahmi/ holds the
│                           44 flipbook page images (page-01.jpg … page-44.jpg)
├── pdfs/                  PDFs (brahmi-brand.pdf — source for the flipbook pages)
├── AUDIT/                 00–15 audit reports + FINAL_SCORECARD (source of truth for
│                           findings; prior full reports are AUDIT_REPORT_2026-08-02.md,
│                           PRODUCTION_AUDIT_REPORT.md, REMEDIATION_REPORT_2026-08-03.md)
├── archive/               favicon-source, source-images (reference only, not served)
├── vercel.json            Clean URLs, routes, headers (CSP, caching), function config
├── package.json           npm scripts + gsap/lenis/@vercel/blob as declared deps
├── sitemap.xml            Core sitemap (9 URLs, image entries, lastmod 2026-07-31)
├── sitemap-images.xml     Image sitemap (30+ entries)
├── robots.txt             Allows all search + explicitly allows 16+ AI bots
├── llms.txt               AI-readable site description
├── humans.txt             Credits + stack
├── site.webmanifest       PWA manifest (standalone, icons)
├── browserconfig.xml      Legacy Windows tile config
├── security.txt           Security contact info
├── Aryan_Swaroop_Resume.pdf / Realtors_Edge_Playbook.pdf   Downloadable PDFs
├── google469c96c221aaafc3.html   Google Search Console verification file
├── .env.local / .vercel/  Local/vercel env metadata (do not commit or read secrets)
└── server.py              Local static server (extensionless URLs will 404 — expected)
```

**Folder responsibilities:**
- **`css/`** — page-scoped styles. Files are large (e.g. `builds.css` is 976 lines, `home-rebuild.css` 596, `mobile-fixes.css` 403). Each dark/playful page or case study owns its stylesheet.
- **`js/`** — one file per interaction concern (see §24 Animation Architecture). Game modules are zero-dependency ES modules sharing a rAF loop.
- **`js/vendor/`** — browser-copy vendored libraries so no third-party origin (except unpkg PageFlip on the Brahmi flipbook) is needed at runtime; the CSP only allows `'self'` + `https://unpkg.com`.
- **`scripts/build-nav.mjs`** — the ONLY generator in the project. Header/mobile-menu/footer must never be hand-edited in the HTML.
- **`api/manifest.js`** — a serverless helper; gated behind `MANIFEST_ADMIN_TOKEN`; not called by any page.

---

## 4. Component Library

There is no framework and no component abstraction — "components" are **CSS-class-based HTML fragments** repeated across pages. The important ones:

| Component | Purpose | Location (source of truth) | Used in | Animation |
|---|---|---|---|---|
| **Header** `.site-header` | Fixed nav: avatar+identity, Home/Design/About, Resume pill, hamburger, scroll progress bar | `scripts/build-nav.mjs` `HEADER_HTML` (L12–38) | All 11 pages | Compact-on-scroll (JS), scroll bar (accent fill) |
| **Mega menu** (Design dropdown) | Hover dropdown with featured work thumbs, preview cards, case-study grid | `dropdown.js` (markup) + `script.js` L253–291 (interaction) | All 11 pages | Fade/scale `.22s`, sub-menu `.15s` |
| **Mobile menu** `.mobile-menu` | Full-screen slide menu with avatar, case studies, featured + other sections | `scripts/build-nav.mjs` `MOBILE_MENU_HTML` (L40–145) | All 11 pages | Fade+visibility `.28s cubic-bezier(.22,1,.36,1)`, staggered items, swipe-to-close |
| **Footer** `#contact.theme-dark` | "Let's talk about the role." + email/resume buttons, copy-email, LinkedIn/Behance | `scripts/build-nav.mjs` `FOOTER_HTML` (L147–167) | All 11 pages | None (static); copy button flips accent on success |
| **Custom cursor** `#cur` | 18px dot with label ring; background-aware inversion; image-reveal trail on home hero | `script.js` L54–139, L366–650 | All pages ≥901px + fine pointer | rAF lerp (factor 0.22), `mix-blend-mode: difference` enlarged state |
| **`.kicker`** | Small accent-red uppercase eyebrow above headings | Global `style.css` | Every section | Fades in on scroll (`script.js`) |
| **`.btn` / `.btn-solid` / `.btn-ghost`** | Pill buttons (full / solid / outline) | Global `style.css` | Everywhere | Hover `translateY(-2px)`; solid adds shadow |
| **`.hero-line`** | Editorial serif hero headline | `css/home-rebuild.css` | Home hero | Type-in on page load, word-by-word |
| **`.stat-num` / `.stat-label`** | Animated stat counters | `script.js` `startRolling`/`animateCount` (L663–691) | Home hero, Paavani case study | 1500ms easeOutCubic count-up |
| **`.sfp-card`** | Sticky-featured stacked project images | `js/sticky-featured-projects.js` + `home-rebuild.css` | Home `#sticky-featured` | GSAP pinned stack, blur+fade receding cards |
| **`.work-slide`** | Horizontal brand-category slides | `js/home-motion.js` + `home-rebuild.css` | Home `#work` | GSAP ScrollTrigger pin + scrub horizontal track |
| **`.csx-block`** | Sticky-left featured-case-study blocks | `js/brahmi-story.js` + `home-rebuild.css` | Home `#brahmi` | Sticky image column + GSAP `once:true` fades |
| **`.pin-card`** | "3D" tilt cards (builds grid) | `js/builds-motion.js` + `css/builds.css` | Builds page grid | CSS hover tilt `rotateX(40deg) scale(.8)` + badge/beam/rings; keyboard `:focus-within` parity |
| **`.macbook`** | Apple-style MacBook with slideshow screen | `js/builds-motion.js` + `css/builds.css` | Builds hero | Scroll-driven lid opening + logo fade + screenshot crossfade (4s interval) |
| **`.cs-story__slide`** | Scroll-scrubbed case-study narrative | `js/storytelling.js` + `css/storytelling.css` | `work/brahmi.html`, `work/paavani-properties.html` | GSAP pin + scrub; slides rise then retreat with scale+blur |
| **`.compare-slider`** | Before/after image comparison | `before-after.js` + `css/storytelling.css`? (see `lifestyle.html`) | Lifestyle (Arvi Hospital) | Pointer drag + keyboard; `clip-path: inset()`; scroll reveal |
| **`.premium-flipbook-wrapper` / `.fb-desktop`** | 44-page PageFlip brand-guidelines book | `js/flipbook-desktop.js` + `css/premium-flipbook.css` | `work/brahmi.html` (≥768px) | PageFlip 2.0.7 WebGL flip (700ms), lazy-loaded from unpkg |
| **`.pg-item`** | Playground grid tiles (image or lazy video) | `playground.js` + `js/playground-gallery.js` + `css/playground.css` | Playground | GSAP staggered entrance + Lenis smooth scroll; hover scale 1.02 |
| **`.game-shell` / `#game`** | Canvas endless-runner | `main.js` + `js/Game.js` etc. | Home + 404 | rAF game loop, 4-frame pixel run cycle |
| **`.cs-hero-visual--parallax`** | Parallax case-study hero image | `js/paavani.js` + `css/paavani.css` | Paavani case study | Scroll `translate3d(0, offset*.12, 0) scale(1.12)` (desktop ≥1024px) |
| **`.intro-overlay`** | Page-load word-flash overlay | `script.js` (flashNext, L23) + `style.css` | Home (element present on all pages) | Word cycle then fade `.8s` |
| **`.compare-*`** | see `.compare-slider` | — | — | — |

---

## 5. Pages

All pages share the generated header, mobile menu, footer, custom cursor (`#cur`), skip link, sr-only AI summary, and the Fraunces/Inter font preload. Light pages have `theme-color #FAFAF8`; `builds.html` uses `#050505`; `playground.html` uses `#000000`. Dark pages (`builds`, `playground`, both `work/` case studies) set `class="page-dark"` on `<body>`.

### `index.html` — Home (theme: dark hero → light → dark footer; has game)
Sections: dark hero (kicker, two serif lines, cursor-trail layer, 3 animated stats, scroll prompt) → mobile progress bar → scroll-reveal credibility paragraph (`#srtParagraph`) → **sticky-featured** 6-card pinned stack (`#sticky-featured`) → **Brahmi featured case study** (`#brahmi`, sticky-left narrative) → **horizontal-scroll** "Three ways I build brands" (`#work`, Real Estate / Lifestyle / Builds slides) → About teaser (`#about`, light `#F2F1EB`) → game section (endless-runner canvas) → footer.
SEO: richest page — full Person/WebSite/WebPage/BreadcrumbList/CollectionPage `@graph` (L49–266), speakable schema, `hero` OG image. LCP: `brahmi-pourshot.avif` preload + eager img. Scripts: vendor gsap + ScrollTrigger (sync) → `sticky-featured-projects.js`, `home-motion.js`, `brahmi-story.js`, `dropdown.js`, `script.js`, `main.js` (module). CSS: `style.css`, `home-rebuild.css`, `mobile-fixes.css`.

### `about.html` — About (light)
Sections: `.about-hero` (big editorial h1 + read-more hint) → `.about-story` (alternating `.about-story-block` text + `.about-story-image` images, `.reveal` fade-ins) → `.about-experience` (Experience & Education, resume download, three jobs: Paavani Properties, Destiny, Director In; certificates, education, languages).
SEO: AboutPage/ProfilePage/WebPage + BreadcrumbList `@graph`. LCP: portrait.avif/webp preload, eager. Scripts: `dropdown.js`, `script.js` only. Note: contains a duplicated nested `<picture>` at L268–273 (cosmetic; browsers recover).

### `real-estate.html` — Real Estate brand systems (light)
Sections: `.page-header` ("Vertical Depth" + "The Realtor's Edge Playbook" free download) → **Paavani** case study (`#paavani`, feature-grid + `.gallery-strip` of 6 tiles) → **VR Devaiah Enclave** (text + live-link teaser to `vr-devaiah-enclave.vercel.app` + `.devaiah-gallery` rows) → **Sidvin Serenity** (`.work-grid-3` of Site Signage / Sales Brochure / VR Experience) → **Royal Farm** (Mascot & Identity / Collateral System / Direction Adopted) → Related-work CTA block.
SEO: BreadcrumbList + WebPage + CreativeWork + ImageObject. LCP: `paavani-cards.avif/webp` preload, eager img.
Scripts: `dropdown.js`, `script.js`, `lightbox.js`. **Known issue:** `script.js?v=20260811` here is STALE vs `?v=20260831` on other pages. **Known issue:** malformed nested `<picture>` at L257–265.

### `lifestyle.html` — Lifestyle brand identities (light)
Sections: `.page-header` ("Brand Systems") → **Brahmi Coffee Roasters** (`#brahmi` feature + 8-tile `.idea-gallery` + CTA) → **Isha V** (feature + 4 `.gallery-tile`) → **Arvi Hospital** (feature + 6-tile gallery + the only **before/after slider** `.compare-stage`) → **Snehaloka Cricket Academy** (feature + 3 tiles) → Related-work CTA.
SEO: BreadcrumbList + WebPage + CreativeWork + ImageObject. LCP: `brahmi-pourshot.avif` preload, eager.
Scripts: `dropdown.js`, `script.js`, `lightbox.js`, `before-after.js` (only page). Cursor label "TASTE" on the Brahmi visual.

### `builds.html` — Web product builds (dark, `page-dark`)
Sections: `.builds-hero` (decorative word "BUILDS" + glow/grid/grain layers, eyebrow + split h1/sub, scroll cue, and the **MacBook stage**: lid/screen/deck/shadow) → `.builds-section` (title + `#buildsGrid` populated by JS with 6 pin-cards: IronLog, AlbumFlow, Selixo, Expenses Tracker, Property Image Optimizer, Weekend Planner) → `.builds-related` CTAs.
SEO: BreadcrumbList + WebPage + CreativeWork + ImageObject. No image preloads; LCP is the animated MacBook. **Known issue:** loads `style.css?v=20260830` (stale vs `20260901`).
Scripts: `dropdown.js`, `script.js`, `js/builds-motion.js` (no vendor libs at all — pure vanilla).

### `tools.html` — Tools & skills (light)
Sections: `.page-header` ("Capabilities") → `.tool-groups` (3 groups: **Design** — Photoshop/Illustrator/InDesign/Figma; **Motion & 3D** — Premiere Pro/After Effects/SketchUp/Lumion/TwinMotion/D5; **Digital & Technical** — React/Next.js, Supabase, Wix Studio, AI workflows) → `.resume-block` (Download PDF).
SEO: only page using `ProfilePage` node. No images; LCP is the h1. Scripts: `dropdown.js`, `script.js`.

### `playground.html` — Motion & experiments (dark, `page-dark`)
Sections: `.pg-hero` (h1 + intro) → `#pgPhotos` (11 `.pg-item` buttons, images, first eager) → `#pgVideos` (10 `.pg-item` buttons with lazy `data-src` m4v videos, AVIF posters) → in-page `#pgLightbox`.
SEO: BreadcrumbList + WebPage + CollectionPage. LCP: `pg-brahmi-courtyard.avif/webp` preload, eager. Scripts: `dropdown.js`, `script.js`, `playground.js`, vendor gsap + ScrollTrigger + CustomEase + Lenis (sync), `js/playground-gallery.js` (defer). Heaviest page (~4.5MB of video) per AUDIT/06.

### `changelog.html` — Changelog (light, `noindex`)
Sections: `.page-header` ("What's New") → 7 dated `<article>` entries (2026-08-03 Audit Remediation, 2026-07-27 AI Metadata/SEO, 2026-07-27 Playground, 2026-07-27 Premium Nav, 2026-07-25 Game Audio, 2026-07-25 Endless Runner, 2026-07-25 Site Launch) with Major/Feature/Enhancement badges.
Scripts: `dropdown.js`, `script.js`. No images. Matches `RELEASE_NOTES.md` content.

### `404.html` — Not found (theme-dark; has game)
Unique: the `.game-section` (canvas `#game` 1000×350 + `#mute` button) sits **before** `<main>`. `<main>` holds `.notfound-section`: kicker "404", h1 "This page took a detour.", sub, "Head Back Home" button. `robots: noindex`, canonical → `/`. Single `WebPage` JSON-LD node. Scripts: `dropdown.js`, `script.js`, `main.js` (module — boots the game). `removeGameFootBottom()` in build-nav is a no-op here (no `foot-bottom` inside the game section).

### `work/brahmi.html` — Brahmi Coffee Roasters case study (dark, `page-dark`)
Sections: `header.cs-header` (h1 + subtitle) → `section.cs-overview` (Client/Role/Scope/Tools) → autoplay muted looping **process video** (webm + mp4 sources, poster + static fallback) → **pinned storytelling** (3 slides: Brief / The Problem / Process; `data-scrollvh` defaults 2.0/1.5) → courtyard/pourshot/stickers figures → `.cs-image-row` (3 packaging mockups) → Result block → **flipbook block** (desktop `.fb-desktop` PageFlip 44-page book; mobile shows an **unconfigured blank Elfsight widget** — known issue) → next-project nav to Paavani.
SEO: 3-level BreadcrumbList + Article. LCP: process-video poster (eager).
Scripts: `js/flipbook-desktop.js`, `dropdown.js`, `script.js`, `lightbox.js` (no-op here), `js/reveal-on-scroll.js`, `js/blend-selector.js` (no-op — targets don't exist on this page), vendor gsap + ScrollTrigger, `js/storytelling.js`. CSS: case-study, case-study-dark, premium-flipbook, storytelling.

### `work/paavani-properties.html` — Paavani Properties case study (dark, `page-dark`)
Sections: `header.cs-hero.cs-hero--paavani` (eyebrow, h1, subtitle, **parallax hero visual**) → `section.cs-stats` (4 count-up stats: 30+ / 50 / 302 / ₹82 with `data-count`/`data-prefix`/`data-suffix`) → **pinned storytelling** (Brief/The Problem/Process; `data-scrollvh-desktop="1.4"`, mobile 1.1) → `.cs-process` (4-step process diagram: Brand System / Collateral / 3D Visualization / Campaign) → `.cs-overview` (Role/Scope/Process/Result) → `.cs-result` (giant "302" + "qualified leads") → `.cs-interactive` (lazy-loaded **VR Devaiah Enclave plot-finder iframe** from `vr-devaiah-enclave.vercel.app`, spinner + 15s fallback) → `.cs-applied` (4-image grid labeled IDENTITY/PRINT/3D/CAMPAIGN) → next-project nav to Brahmi.
SEO: 3-level BreadcrumbList + Article. LCP: hero-paavani-main eager.
Scripts: `dropdown.js`, `script.js`, `lightbox.js` (no-op), `js/reveal-on-scroll.js`, `js/paavani.js`, vendor gsap + ScrollTrigger, `js/storytelling.js`. CSS: case-study, case-study-dark, paavani, storytelling.

---

## 6. Design System

### Colors (CSS custom properties in `style.css :root`)

| Token | Value | Usage |
|---|---|---|
| `--paper` | `#FAFAF8` | Light page bg; light text on dark sections |
| `--ink` | `#0E0E0F` | Body text; dark section backgrounds; button fills |
| `--graphite` | `#6B6B6B` | Secondary/muted text |
| `--line` | `#E4E3DE` | Light-theme borders |
| `--accent` | `#C41E3A` | Brand red — kickers, links, cursor dot, scroll bar, focus rings |
| `--serif` | `'Fraunces', serif` | Display font |
| `--sans` | `'Inter', sans-serif` | UI/body font |
| `--hero-text` / `--hero-invert` | `#111111` / `#ffffff` | Hero heading color (light/dark hero) |
| `--nav-height` | `90px` (scrolled 66px) | Header height |

Scoped accents: `case-study.css` defines `--cs-accent` (`#C41E3A`, overridden to brass `#C99A4B` on `.theme-brahmi`), `--cs-header-bg`, `--cs-header-text` (Brahmi: deep teal `#0F3B3E` bg, cream `#F5F1E8` text). `builds.css` defines `--accent-soft: #e4576b` for pin-card glows.

### Typography
- **Fraunces** (serif, editorial): all headings, display numbers, stat figures. Weights 400/500/600, italic 400/500, opsz 9–144.
- **Inter** (sans, neutral): body, labels, buttons, captions. Weights 400/500/600.
- Heading scale is **fluid**: h1 `clamp(36px, 6vw, 68px)`; hero-line `clamp(2.2rem, 5vw, 3.75rem)`; build-hero h1 `clamp(44px, 7vw, 84px)`; playground h1 `clamp(48px, 8vw, 80px)` weight 700; footer h2 `clamp(30px, 5.5vw, 60px)`. Headings use `letter-spacing: -0.01em` to `-0.03em`, `line-height` ~1.05–1.15.
- Kickers/eyebrows: Inter 600, 12px (11–13px variants), `uppercase`, `letter-spacing: 0.1em–0.18em`, accent red.
- Labels: Inter 500–600, 11–13px uppercase, `0.14em–0.2em` tracking, `#9a9a9a`/grey.
- Body: Inter 400, 15–18px, line-height 1.5–1.7. Dark-section body copy is warm grey `#c9c8c4`; `.srt-paragraph` is `clamp(1.4rem, 3vw, 2rem)` with `line-height 1.75`.

### Spacing
- Container `.wrap`: `max-width: 1240px`, `padding: 0 40px` (≤700px → 20px; `mobile-fixes.css` forces 24px ≤768px).
- Section rhythm: `section { padding: 70px 0 }` (≤600px → 48px; `.tight` → 50px); footer `70px 0 50px` (48/36 mobile).
- Grids: 2-col (`1fr 1fr`, gaps 36–60), 3-col `repeat(3,1fr)`, 4-col `repeat(4,1fr)` gap 14, plus playground's 3→5→6-col progressive grid (gap 8→4). Card grids collapse to 1fr at 700–900px.

### Border radius
2px (focus rings, progress), 4px (feature/work visuals), 8px (media, sfp images, fb-nav), 12px (pg-item, blend-display, mobile-close), 14–18px (mega-cards, pin-media, macbook, mobile rows), 24px (mega-menu, pin-card), `999px`/100px (buttons, pills, tags), `50%` (cursor, avatars, status dots). MacBook uses distinctive 9px screen / `0 0 16px 16px` deck.

### Glass / shadow / gradients
- Backdrop blur: header `blur(16px)` over `rgba(0,0,0,.75)` (24px/.92 compact), mega-menu `blur(24px)` over `#000`, compare handle `blur(12px)`.
- Shadows: macbook-screen `0 30px 80px rgba(0,0,0,.55)`, pin-card `0 20px 60px rgba(0,0,0,.45)` (hover `.55`), mega-menu `0 24px 60px rgba(0,0,0,.35)`, btn-solid hover `0 8px 20px rgba(0,0,0,.18)`, pg-item hover `0 16px 40px rgba(255,255,255,.07)`.
- Gradients: `linear-gradient(160deg,#2a2a2a,#151515 60%)` placeholder visuals; `repeating-linear-gradient(135deg,#EFEDE6 0 12px,#E2DFD6 12px 13px)` placeholder-art stripes; MacBook screen `#1d1d23 → #0e0e12`, deck `#17171d → #0b0b0f`; builds hero radial glow + blueprint grid + grain (inline SVG `feTurbulence`, `opacity .035`, `mix-blend-mode: overlay`).

### Cards
- `.sfp-card`: absolute stacked, media `aspect-ratio 4/5`, radius 8, `object-fit: cover`.
- `.work-slide`: 100vw, media `min(44vw, 580px)` `aspect-ratio 4/3`, radius 8.
- `.pin-card`: `#0a0a0a`, radius 24, `1px rgba(255,255,255,.08)` border, top-light radial; hover tilt + badge/beam/rings layers.
- `.teaser-card`/`.work-card`: light, `1px var(--line)` border, radius 4, body padding `18px 20px 22px`.
- `.pg-item`: `aspect-ratio 4/5`, radius 8, bg `#111`.

### Buttons
- `.btn`: `padding 14px 26px`, 14px/600, `radius 100px`, `1px solid var(--ink)`, hover `translateY(-2px)`. `.btn-solid`: ink fill/white text, hover shadow. `.btn-ghost`: transparent. Footer overrides: solid = paper fill/ink text; ghost = `border-color #444`, paper text. `.resume-btn`: white 999px pill, `1px rgba(255,255,255,.4)`, hover inverts to black-on-white; hidden ≤700px. `.copy-email`: ghost button, `#999`, hover paper, copied state accent. `.teaser-link`: accent red, 600, 12.5–13.5px.

### Hover / transition language
Signature ease `cubic-bezier(.22,1,.36,1)`. Durations: color/bg `.2s`, transforms `.2s–.3s`, reveals `.35s–.9s`, media zooms `.4s–.6s`, press states `scale(.98)` `.12s`. Transforms: `translateY(-2px)` buttons, `translateX(4px)` arrows, `scale(1.03–1.04)` thumbs.

### Focus & states
Global `:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px }`. On dark: paper outline for buttons. `.pin-card:focus-within` mirrors the full hover effect (keyboard parity). Custom cursor is disabled ≤900px, on coarse pointers, and under reduced motion.

### Theme
**No `.theme-dark`/`.theme-light` CSS rules exist** — these classes are semantic hooks consumed by `script.js` `sectionTheme()` to switch the cursor. Dark appearance is structural: `footer`, `.feature`, `.hero-section`, `.sticky-featured` hard-code `background: var(--ink)`/`#000` with paper text; dark pages use `body.page-dark` (`#000000` bg, paper text, light mega/mobile menu).

---

## 7. Theme / Visual Language

**Description:** "Dark luxury meets warm editorial." Light sections are paper-white (`#FAFAF8`) with near-black ink text and hairline borders — Swiss-meets-editorial. Dark sections (hero, footer, features, case studies, builds, playground) are near-black with cream text, warm-grey body copy, and one red accent. Everything is serif-led and letter-spaced; imagery is photographic, full-bleed, rounded 4–8px.

**New sections must match by:**
- Using Fraunces for headings (500, tight negative tracking) and Inter for everything else.
- Using tokens: `var(--ink)`, `var(--paper)`, `var(--line)`, `var(--accent)`, `var(--graphite)` — never new hexes (Brahmi's brass `#C99A4B` is the sanctioned exception for that brand's own palette).
- The `.kicker` + heading + paragraph + button block pattern.
- `.wrap` (1240px) containers, 70px section rhythm, 4px–8px media radius.
- `data-cur="LABEL"` on hoverable images/links (feeds the cursor).
- A `.reveal-block`/`.reveal-child` reveal or a GSAP-scroll interaction with the shared ease.
- Respecting `prefers-reduced-motion` and having a no-JS static fallback.
- Semantic headings, one `<h1>`, alt text, `width`/`height` on every image.

---

## 8. Motion Guidelines

**Core rules:** Motion rewards scroll; nothing moves without meaning; every animation has a reduced-motion and no-JS fallback; the signature ease is `cubic-bezier(.22,1,.36,1)` (a "power3-out"-style premium ease).

| Pattern | Spec |
|---|---|
| Button hover | `translateY(-2px)`, `.2s ease`; solid adds `0 8px 20px rgba(0,0,0,.18)` |
| Media zoom | `scale(1.03–1.04)`, `.4s–.6s` |
| Reveal blocks | fade + `y:30–40`, `.35s–.9s`, often staggered 80–160ms |
| Scroll-scrubbed (GSAP) | `scrub: 0.5–1`, `anticipatePin: 1`, `ease:'none'` on track |
| Pinned stacks | `scale .92`, `opacity .75`, `blur(3px) brightness(.8)` on receding cards |
| Custom cursor | rAF lerp factor 0.22; 18px dot; 132px enlarged ring (≥1024px); label follows |
| Intro flash | word swap 350ms hold/40ms gap; overlay fade-in 1.2s, out .6s |
| Typewriter | 55ms type / 28ms delete, 3000ms hold |
| Counters | 1500ms (site) / 900ms (case study) easeOutCubic |
| MacBook | lid `rotateX` from `0.1→0.62` progress + `scaleY(.78→1.02)`; screen crossfade 4s interval; boot fade 1100ms |
| Playground entrance | `y:120 → 0`, `scale:.96 → 1`, `.8s`, stagger `.06`, `pgEase` (`0.22,1,0.36,1`) |
| Case-study slides | enter `power3.out`, exit `power2.in` with `scale:.96, z:-40` (retreat, never up) |
| Before/after | `clip-path: inset(0 X% 0 0)`, 28px radius handle, keyboard step 5 (Shift=10) |
| Page transitions | body opacity fade-out `.18s` on internal clicks |

**Scroll behaviour:** native scroll everywhere except Playground (Lenis `duration 1.1` wired into `gsap.ticker`). Pinned sections: home work-track, home sticky stack, case-study storytelling.

**Mouse interactions:** custom cursor with `data-cur` labels; on the home hero it spawns a trail of rotating portrait images (9 images, 170px, rotation `[-3,-1,0,1,3]`, max 6 visible, life 800–1200ms).

**Hover behaviour:** defined in §6. Only trigger complex effects under `(hover:hover) and (pointer:fine)`.

---

## 9. Scroll Effects Library

| Effect | Where | Implementation |
|---|---|---|
| **Pinned horizontal track** | Home `#work` | `js/home-motion.js`: `gsap.to(track, {x:-overflow, scrollTrigger:{scrub:1, pin:true, anticipatePin:1, invalidateOnRefresh:true}})`; static fallback class `.work-horizontal--static` |
| **Pinned sticky image stack** | Home `#sticky-featured` | `js/sticky-featured-projects.js`: cards stacked; each recedes (scale/blur/fade) as next rises; `scrub:0.5`, `pinSpacing:true`; fallback `.sfp-static` |
| **Sticky narrative (case study on home)** | Home `#brahmi` | `js/brahmi-story.js`: left image column CSS-sticky; right `.csx-block`s fade in `once:true` |
| **Pinned scroll-scrubbed storytelling** | `work/brahmi.html`, `work/paavani-properties.html` | `js/storytelling.js`: `gsap.matchMedia` (≥901px), pinned timeline `scrub:0.5`, slides enter `power3.out` then retreat `scale:.96, z:-40`; pace via `data-scrollvh-*` |
| **Reveal on scroll** | Case studies | `js/reveal-on-scroll.js`: `.reveal-block` → `.visible`, children staggered 120ms, IO threshold 0.15 |
| **Section/heading reveal** | All pages | `script.js`: IO adds visible to `.kicker`/`h2`/`.page-header` (threshold 0.15) |
| **Word-by-word credibility paragraph** | Home `#srtParagraph` | `script.js updateReveal`: per-word opacity from scroll progress |
| **Parallax hero** | Paavani case study | `js/paavani.js`: rAF-throttled `translate3d(0, offset*.12, 0) scale(1.12)` (≥1024px) |
| **Scroll-driven MacBook open** | Builds hero | `js/builds-motion.js heroTick`: piecewise-linear lid unroll + laptop scale + outline-word drift (capped 80px) |
| **Before/after slider** | Lifestyle (Arvi) | `before-after.js`: clip-path inset, pointer/keyboard, IO reveal |
| **Scroll reveals with stagger** | Builds grid | `js/builds-motion.js`: IO threshold 0.12, per-cell stagger `idx*80ms` |
| **Playground entrance + below-fold reveal** | Playground | `js/playground-gallery.js`: GSAP staggered float-up + ScrollTrigger `start:'top 92%', once:true` |
| **Video autoplay on visibility** | Playground grid | `playground.js`: IO threshold 0.25 lazy-loads + plays in-view videos |
| **Cursor image-reveal trail** | Home hero | `script.js`: mousemove spawns portrait thumbnails into `#cursorTrailLayer` |
| **Flipbook** | Brahmi | PageFlip 2.0.7 (unpkg, lazy) WebGL page-flip, 700ms |

---

## 10. UI Patterns

- **Hero:** `kicker` + serif headline(s) + optional animated stats + scroll prompt; dark sections. Case-study hero = eyebrow + h1 + subtitle + large visual.
- **Section header:** `.kicker` (accent, uppercase) + `<h2>` serif. Optional `.section-title` variants (builds).
- **Cards:** `.work-card`, `.teaser-card` (light, bordered), `.pin-card` (dark, tilt), `.mega-project`, `.csx-block`.
- **Media blocks:** `<picture>` triplets (AVIF/WebP/JPG) with `width/height`, `loading=lazy decoding=async` (eager for LCP), wrapped in a rounded, often `data-cur`-labelled `.feature-visual`/`.work-visual`/`.gallery-tile`.
- **Buttons:** pill `.btn` variants; teaser text-links; `copy-email` clipboard button.
- **CTA / related work:** full-width centered `.wrap` (often 720px) with 4 ghost buttons; builds uses `.builds-related-links`.
- **Feature grid:** `1fr 1fr` (visual + copy) collapsing ≤820px; case-study `.feature-grid` `1.1fr .9fr` gap 60.
- **Gallery strips:** `.gallery-strip` 3-col (2-col ≤760/420px); `.idea-gallery` 4-col; `.devaiah-gallery` 2+3 rows; `.cs-gallery`/`.cs-image-row` 3-col.
- **Timeline / process:** Paavani `.cs-process-steps` (4 numbered stages, label + media + note) and About `.resume-exp` (role/company/dates + bullets).
- **Sticky layouts:** home `#brahmi` sticky-left; case-study pinned storytelling; home sticky stack; home horizontal track.
- **Navigation:** desktop mega-menu (hover), full-screen mobile menu, scroll progress bar, mobile progress bar, "Open to work" ping.
- **Footer:** kicker + "Let's talk about the role." + 2 buttons + copy-email + current-status line + foot-bottom (© + socials).
- **Hover micro-interactions:** cursor labels, thumb scale 1.03–1.04, arrows translateX(4px), button lift, pin-card tilt.

---

## 11. Responsive Rules

**Breakpoints (exact):**

| Breakpoint | What changes |
|---|---|
| ≤380px (+ height ≤720px) | Compact hero sizing |
| ≤420px | gallery/idea grids → 2-col |
| ≤480px | buttons shrink (`12px 20px 13px`) |
| ≤600px | sections 48px; footer 48/36; page-header spacing |
| ≤640px | hero-line `clamp(1.3rem,5vw,1.8rem)`; stats wrap; nav-dark solid bg |
| ≤700px | `.wrap` 20px; resume-btn hidden; header rows compact; grids → 1-col; paavani stats 2-col |
| ≥701px | Desktop nav visible; hamburger + mobile-menu hidden |
| ≤760px | gallery 2-col; tool-groups 1-col; about-grid 1-col |
| ≤767px | Playground `.desktop-only` hidden / `.mobile-only` shown; grid 3-col |
| ≤768px | **All of `css/mobile-fixes.css`**: `.wrap` 24px; hamburger 44×44; touch-target `::before` hit areas; compare slider shrinks; case-study padding; cs-gallery 1-col; text-wrap balance/pretty; overflow guards |
| ≤820px | `.feature-grid` 1-col; Brahmi `.csx-mobile` copy swaps in (`.csx-desk` hidden); sticky disabled |
| ≤900px | Custom cursor disabled (`body{cursor:auto}`, `#cur{display:none}`); `.work-grid-3` 2-col; teaser-grid 1-col; work-track → vertical |
| ≤1023px | `.hero-reveal-image` hidden |
| ≥1024px | Playground 3-col; desktop lightbox enabled |
| ≥1200px | Playground 6-col |

**Guidelines:**
- Fluid type via `clamp()` everywhere; mobile h1s ~`9vw` max.
- Media: images keep `aspect-ratio` (SVG/AVIF auto-contain under 768px per mobile-fixes); grids collapse 3→1 (with a 2-col step at 760–900).
- Touch: all interactive targets ≥44px via padding or `::before` hit-area expansion (no layout shift); custom cursor removed on coarse pointers.
- Animations: GSAP pins simplified or swapped to static classes below breakpoints (`.sfp-static`, `.work-horizontal--static`, `.csx-mobile`); flipbook desktop-only ≥768px; parallax ≥1024px; lightbox ≥1024px.
- Reduced motion keeps layout readable by force-showing elements (all `opacity`/`transform` states nulled).

---

## 12. Fonts

- **Primary/display:** **Fraunces** (serif, opsz 9–144) — weights 400/500/600, italics 400/500. Used for all headings, stat numbers, big display numerals, footer h2, hero lines, `em` italics.
- **Body/UI:** **Inter** — weights 400/500/600. Used for body, labels, buttons, captions, menu, nav.
- **Loading:** preload of `https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400;1,9..144,500&family=Inter:wght@400;500;600&display=swap` with `as="style"` + inline `onload` swap (hash-pinned in CSP) + `<noscript>` fallback + `preconnect` to both Google hosts.
- **Usage:** headings `-0.01em…-0.03em` tracking, `line-height 1.05–1.15`; body 15–18px / 1.5–1.7; labels uppercase `0.1–0.2em` tracking. Numbers in stats use `font-variant-numeric: tabular-nums` on case-study stats.

---

## 13. Images

- **Format:** AVIF → WebP → JPG `<picture>` triplets (all three must exist in `images/`). Example: `nav-avatar-400.avif`/`-800.avif` + `.webp` + `.png` fallback for responsive avatars.
- **Aspect ratios:** 4/5 portraits, 4/3 work media, 3/2 case visuals, 16/9 posters, 1/1 thumbnails. Set via `width`/`height` attrs or CSS `aspect-ratio` to prevent CLS.
- **Loading:** `loading="lazy" decoding="async"` everywhere except LCP/hero images (eager + `fetchpriority="high"` + `preload` links on index, about, real-estate, lifestyle, playground).
- **Naming:** `{project}-{subject}.{ext}` (e.g. `brahmi-pourshot.jpg`, `paavani-main-gate.avif`); responsive variants get size suffixes (`nav-avatar-400`, `nav-avatar-800`); flipbook pages `images/brahmi/page-NN.jpg` (01–44); playground videos `pg-video-0N.m4v` + `pg-0N.avif` posters.
- **Caching:** `vercel.json` serves `/images/(.*)` `public, max-age=31536000, immutable` → **any changed image MUST get a new filename or new `?v=`**.
- **Cache-busting:** every asset URL uses `?v=YYYYMMDD`; bump when the asset changes (e.g. `script.js?v=20260831`, `style.css?v=20260901`).
- **Optimization:** AVIF/WebP 800px Q82, videos H.264 720p CRF28 (compressed ~55MB → ~5.5MB per release notes).

---

## 14. Icons

- **No icon library.** Uses inline SVGs (compare-handle arrows), unicode glyphs (`♫` mute, `×` close, `→` arrows, `⯉` copy, `▾` dropdown), and text arrows (`→`).
- Sizes ~13–20px; icon color inherits text color; hover = the element's hover color (e.g. `.copy-icon` follows `.copy-email` hover to paper).
- Custom cursor glyphs/labels are text (e.g. `VIEW`, `SEND`, `STAGE 01`).

---

## 15. Accessibility

- **Semantics:** exactly one `<h1>` per page, sequential heading levels, `<main id="main-content">`, `<nav aria-label>`, landmark roles, skip-link first element.
- **Skip link:** `.skip-to-content` visually-hidden until `:focus` (top 16px, accent ring).
- **Keyboard:** mega-menu and mobile menu Escape-to-close; flipbook arrow/Home/End navigation; before/after slider ArrowLeft/Right/Home/End (Shift = 10 step) with `role="slider"` + live `aria-valuenow`; `.pin-card:focus-within` mirrors hover; `.mega-project.active` mirrors hover.
- **ARIA:** `aria-expanded`/`aria-haspopup` on dropdown trigger and hamburger, `aria-controls`, `aria-hidden` on decorative layers, `aria-live="polite"` on flipbook counter, `aria-label` on canvas, buttons, galleries, lightboxes, `role="note"` on sr-only AI summaries.
- **Focus:** global `:focus-visible` accent outlines (paper outline on dark surfaces); `outline-offset` 3px.
- **Contrast:** ink on paper body text; dark sections use paper/warm-grey (`#c9c8c4`) on near-black; accent red used for emphasis but never as sole text color on light bg.
- **Reduced motion:** `prefers-reduced-motion` disables: intro overlay, custom cursor, page fades, reveals, Lenis, all pin/scrub GSAP work (static fallback classes), tilt/badge/rings, parallax, macbook scroll, flipbook reveal; CSS global `.01ms` animation/transition kill + `cursor:auto`; stats render final values instantly; game music volume reduced.
- **Touch:** targets ≥44px (hamburger 44×44; `::before` hit-area expansion), swipe-to-close mobile menu, tap-to-jump game.
- **Alt text:** every `<img>` has meaningful alt; decorative images `aria-hidden` + empty `alt`.

---

## 16. Performance

- **Images:** AVIF/WebP/JPG triplets, `loading=lazy decoding=async`, `width`/`height` reserved, LCP preload + eager + `fetchpriority="high"`, immutable 1-year image caching.
- **Fonts:** preconnect ×2, preload + async swap + noscript; `display=swap`.
- **Scripts:** page scripts `defer`; game is `type="module"`; GSAP/ScrollTrigger loaded synchronously only on pages that need them (index, playground, both case studies); PageFlip loaded lazily from unpkg only on Brahmi; the flipbook's 44 pages are lazy `<img>`s.
- **Video:** muted/looping/`playsinline`, lazy `data-src` injection + IO-driven autoplay on Playground; faststart flag.
- **Caching:** `vercel.json` — images immutable 1yr; css/js `max-age=300`.
- **Known weight:** Playground ~4.5MB video (heaviest page, AUDIT B-H3); dropdown mega-menu thumbnails ~371KB (AUDIT B-H2); homepage AVIF'd (AUDIT: −900KB landed).
- **Animation optimization:** transforms/opacity only, `will-change` on pinned elements, rAF throttling, `invalidateOnRefresh` on ScrollTrigger, no layout thrash (JS writes transform, reads once).

---

## 17. SEO

- **Metadata:** title, description, keywords, canonical, `theme-color`, author, robots `index,follow,max-image-preview:large` (changelog + 404 are `noindex,follow`), `format-detection=telephone=no`.
- **Open Graph:** title/description/image(1200×630)/url/type(`website`, `profile` on about, `article` on case studies)/site_name/locale `en_IN`.
- **Twitter Cards:** `summary_large_image`, site/creator `@aryanswaroop`.
- **Structured data (JSON-LD `@graph`):** Person (rich: sameAs, knowsAbout, occupation, worksFor, alumniOf, credentials, speakable, InteractionCounter), WebSite (+ SearchAction), WebPage, BreadcrumbList, CollectionPage, CreativeWork, ImageObject, AboutPage/ProfilePage, Article with 3-level breadcrumbs on case studies. Valid on 11/11 pages (per AUDIT/FINAL_SCORECARD).
- **AI-friendly:** `llms.txt`, sr-only `.ai-summary` blocks on every page, 16+ AI bots explicitly allowed in `robots.txt`, `speakable` schema on home.
- **Sitemaps:** `sitemap.xml` (9 URLs, image entries, priorities 0.7–1.0, lastmod 2026-07-31) + `sitemap-images.xml` (30+ entries). Both declared in `robots.txt`.
- **Verification:** Google Search Console file `google469c96c221aaafc3.html`; `verification` meta placeholders noted in release notes.
- **Clean URLs:** Vercel `cleanUrls: true`, no trailing slash; nav links are extensionless (`/real-estate`), local `server.py` will 404 those (expected).

---

## 18. Coding Standards

- **HTML:** hand-written, valid, indented with 2 spaces; inline `style` attributes are common for one-off layout values (backgrounds, gaps, margins); semantic elements + landmarks; `data-cur` attribute everywhere a cursor label is wanted.
- **CSS:** one global minified `style.css` (tokens + base), scoped files by page. Component classes kebab-case (`.feature-grid`, `.csx-block`, `.pg-item`). Values use tokens (`var(--ink)`) not raw hexes. Media queries: mobile-first base + `@media (max-width: …)` overrides.
- **JS:** vanilla ES5-ish for `script.js` (IIFEs, no modules), ES modules for the game and page scripts loaded via `defer`/`type="module"`. Feature-check and early-return (guards like `window.storytellingInit`, `window.paavaniJsInitialized`). No `console.log`, no TODOs/FIXMEs (audit-verified). `prefers-reduced-motion` checked at the top of every animated script. rAF + passive listeners for scroll.
- **Generated files:** header/mobile-menu/footer NEVER hand-edited; edit `scripts/build-nav.mjs` then run `npm run build:nav` (rewrites all 11 `TARGETS`).
- **Asset versions:** every CSS/JS URL ends `?v=YYYYMMDD`; bump the date on every change. Changed images get a new filename or `?v=` (immutable caching).
- **Path style:** root-absolute `/images/...` inside `build-nav.mjs`; relative `images/...` inside root pages; `../images/...` inside `work/` pages.
- **Error handling:** defensive guards for missing DOM; serverless function fails closed (401/500 with `Cache-Control: private, no-store`).

---

## 19. Existing Features Checklist

```
✓ Custom cursor system (background-aware, labels, image-reveal trail)
✓ Intro word-flash overlay (home)
✓ Hero with animated stat counters (home + paavani case study)
✓ Scroll-reveal credibility paragraph (home)
✓ Pinned sticky-featured project stack (home)
✓ Sticky-left featured case study narrative (home)
✓ Horizontal scroll brand track (home)
✓ Mega-menu "Design" dropdown (all pages)
✓ Full-screen mobile menu with swipe-to-close (all pages)
✓ Scroll progress bars (desktop track + mobile bar)
✓ Endless-runner Canvas game with chiptune + mute toggle (home + 404)
✓ Page-load/click fade transitions
✓ Before/after comparison slider (lifestyle)
✓ Desktop image lightbox (real-estate, lifestyle)
✓ Playground gallery + video lightbox + lazy video autoplay (playground)
✓ 3D pin-cards + MacBook scroll animation (builds)
✓ Scroll-scrubbed case-study storytelling (brahmi, paavani)
✓ Stat count-ups + hero parallax + lazy VR iframe (paavani case study)
✓ Desktop PageFlip flipbook (brahmi case study)
✓ Case-study reveal-on-scroll
✓ Copy-email-to-clipboard footer button
✓ Resume + playbook PDF downloads
✓ JSON-LD structured data + OG/Twitter on all pages
✓ sr-only AI summaries + llms.txt + robots AI-bot allowlist
✓ Skip-to-content, focus-visible, reduced-motion everywhere
✓ AVIF/WebP/JPG triplet images + immutable caching
```

---

## 20. Planned Features / Known Issues

**Known issues (documented, do NOT silently "fix"):**
- **Brahmi mobile flipbook is a blank, unconfigured Elfsight widget** (`work/brahmi.html:314–315`). The working book is `js/flipbook-desktop.js` (≥768px). Plan lives in `AUDIT/15_Priority_Fixes.md` item 1. Do not fix by editing brahmi.html alone.
- **`js/premium-flipbook.js` (150 lines) is dead code** — an old jQuery/Turn.js version, unreferenced by any page, intentionally frozen (commit `180a300`, see `REMEDIATION_REPORT_2026-08-03.md`).
- **`js/blend-selector.js` is a no-op on `work/brahmi.html`** (its `.blend-btn`/`.blend-photo` targets don't exist there). Same for `lightbox.js` on both case studies.
- **Stale cache-bust versions:** previously `real-estate.html` loaded `script.js?v=20260811` and `builds.html` loaded `style.css?v=20260830`; both were bumped to the current stamps (`20260831` / `20260901`) on 2026-08-04. Re-check if this ever regresses.
- **Malformed nested `<picture>`** in `real-estate.html:257–265` (browsers recover; cosmetic).
- **`browserconfig.xml`** references `mstile-150x150.png` (file exists at root; previously flagged B-H4).
- **Analytics: none** (AUDIT M1) — deliberate, no tracking scripts.
- **Old-version link** flagged (AUDIT B-H1): builds.html "View Live" historically pointed to an old deploy.

**Planned / backlog (from AUDIT/15_Priority_Fixes.md and FINAL_SCORECARD):**
1. Fix Brahmi mobile flipbook (C1) — top priority.
2. Trim mega-menu dropdown thumbnails (~371KB → save on every page).
3. Optimize Playground video payload (~4.5MB).
4. Add analytics (M1).
5. CSP is now LIVE (M6 closed) — see vercel.json headers; re-verify after any third-party script additions.

**No TODO/FIXME comments, no placeholder components, no disabled features** (audit-verified).

---

## 21. Dependencies

| Package | Version | Why it exists |
|---|---|---|
| `@vercel/blob` | ^2.6.1 | Used by `api/manifest.js` (serverless image listing) |
| `gsap` | ^3.15.0 | Declared as the SOURCE for the vendored copy in `js/vendor/gsap.min.js` (not imported at runtime) |
| `lenis` | ^1.3.25 | Same — source for `js/vendor/lenis.min.js` |

Runtime third-party (NOT in package.json): **PageFlip 2.0.7** loaded lazily from `https://unpkg.com/page-flip@2.0.7/...` by `js/flipbook-desktop.js` (allowlisted in CSP `script-src`), and **Google Fonts** (Fraunces + Inter). jQuery/Turn.js are NOT loaded anywhere (dead code only).

**vendored files in `js/vendor/`:** `gsap.min.js`, `ScrollTrigger.min.js`, `CustomEase.min.js`, `lenis.min.js` — browser copies; no bundler involved.

---

## 22. Custom Hooks / Helpers

No React hooks exist. The closest analogues are **module-scoped init functions** with single-run guards:

| Helper | Purpose | Guard |
|---|---|---|
| `storytellingInit` (in `js/storytelling.js` L13–14) | Idempotent storytelling activation | `if (window.storytellingInit) return` |
| `paavaniJsInitialized` (in `js/paavani.js` L3–4) | Idempotent paavani behaviors | flag check |
| `build-nav.mjs` `findEndIndex/replaceHeader/replaceMobileMenu/replaceFooter/removeGameFootBottom` | Header/footer regeneration into all TARGETS | — |
| `flashNext` (script.js L23) | Intro word cycling | — |
| `splitIntoChars/rand/getImageIdx/spawnAt/checkOverlaps` (script.js L390–573) | Cursor-trail image spawning | — |
| `typeCycle` (script.js L292) | Typewriter headline | — |
| `easeOutCubic` / `animateCount` / `startRolling` (script.js L663–691) | Stat counters | — |
| `updateReveal` (script.js L717) | Word-by-word paragraph reveal | — |
| Game `Utils.js`: `clamp`, `rand`, `chance`, `padScore` | Math/text helpers for the game | — |

---

## 23. Utilities

- **`scripts/build-nav.mjs`** — the only build tool: single source of truth for header/menu/footer; run `npm run build:nav`.
- **`api/manifest.js`** — serverless utility: `GET /api/manifest` lists `images/` blobs; requires `x-admin-token` header == `MANIFEST_ADMIN_TOKEN`; fails closed; no-store cache.
- **`server.py`** — local static server for development (extensionless URLs 404 locally — expected; Vercel cleanUrls handles them in production).
- **Game utilities** (`js/Utils.js`): `clamp(n,min,max)`, `rand(a,b)`, `chance(p)`, `padScore(v)` (5-digit zero-padded).
- **`js/vendor/`** — vendored libs, considered build-time-free.
- **CSS utilities:** `.wrap` (container), `.sr-only`, `.kicker`, `.tight`, `.reveal`, `.reveal-block/.reveal-child`, `.desktop-only`/`.mobile-only`, `.btn-ghost/.btn-solid`, `theme-dark` (cursor hook).

---

## 24. Animation Architecture

**How animations are structured:** Each page/interaction owns a script (or a module in `script.js`). There are three tiers:

1. **Vanilla + CSS classes (most of the site).** `script.js` (10 IIFEs), `before-after.js`, `playground.js`, `builds-motion.js`, `paavani.js`, `reveal-on-scroll.js`. Use CSS classes + transitions, rAF loops, and IntersectionObservers. GSAP is not required here.
2. **GSAP + ScrollTrigger (pin/scrub work).** `home-motion.js` (horizontal track), `sticky-featured-projects.js` (stack), `brahmi-story.js` (sticky case study, `once:true`), `storytelling.js` (pinned case-study narrative, `gsap.matchMedia`). These all require gsap + ScrollTrigger loaded synchronously BEFORE the deferred consumer script.
3. **Game (pure ES modules, zero deps).** `main.js → js/Game.js →` subsystems (Player, Physics, Renderer, Input, Score, Sound, Intro, Obstacle, Ground, Cloud, Background, Particle, Utils). Single rAF loop in `Game.js`, `dt` clamped to 2.2.

**Shared conventions:**
- CustomEase `pgEase = "0.22,1,0.36,1"` (playground); everywhere else uses `ease: 'power3.out'` or CSS `cubic-bezier(.22,1,.36,1)`.
- `scrub: 0.5–1`, `anticipatePin: 1`, `invalidateOnRefresh: true` on all pinned ScrollTriggers.
- `window load` + `document.fonts.ready` → `ScrollTrigger.refresh()` after layout-dependent work.
- Reduced-motion: early return + add static fallback class; never animate.
- Reveal primitives: `.reveal` (script.js IO), `.reveal-block/.reveal-child` (reveal-on-scroll.js), GSAP `once:true` (brahmi-story), IO threshold variants.
- No shared variant system, no providers, no Framer Motion — everything is concrete and per-file.

---

## 25. How to Extend This Project

**Adding a new page:**
1. Copy an existing page's `<head>` boilerplate (meta block, favicons, font preload, style links) and the generated header/mobile-menu/footer blocks.
2. Add the page to `TARGETS` in `scripts/build-nav.mjs` and run `npm run build:nav` (generates header/menu/footer).
3. Use `.wrap`, `.page-header` (kicker + h1 + p), sections at 70px rhythm, `.kicker` headings, `.btn` CTAs, `<picture>` triplets.
4. Add a `<script defer>` for any page-specific interaction; add to `sitemap.xml` + `sitemap-images.xml` + `robots.txt` if indexable.
5. Bump every changed asset's `?v=YYYYMMDD`. New images need all three formats (AVIF/WebP/JPG) in `images/`.

**Adding a new section to an existing page:**
- Match the visual language (§7): tokens, serif headings, `.kicker`, `data-cur` labels, 4–8px media radius.
- Reuse existing components (§4) before writing new CSS; reuse spacing tokens (§6).
- Follow existing animation timing (§8) — do not invent new easings/durations.
- Preserve a11y: one h1 per page, sequential headings, alt text, reduced-motion fallback, no-JS static state.
- Never introduce a new design style or a new color hex (Brahmi brass is the only sanctioned exception).

**Changing shared chrome:** edit `scripts/build-nav.mjs`, run `npm run build:nav`, verify all 11 files regenerated. Hand-edits to headers/footers will be overwritten.

**Performance rules:** lazy-load below-fold media, reserve dimensions, use transforms/opacity for animation, keep the game module-graph pure, and never add a heavy third-party script without updating the CSP allowlist in `vercel.json` and re-running the headless CDP verification pass (per CLAUDE.md).

---

## 26. AI Prompting Guide

Whenever adding a feature:
1. Inspect existing components first (this file §4, plus the actual CSS/JS) — reuse before creating.
2. Reuse utilities and existing script files; only create a new file when the concern is genuinely new.
3. Match current motion: ease `power3.out`/`cubic-bezier(.22,1,.36,1)`, `scrub 0.5–1` for pinned work, `once:true` for one-shot reveals.
4. Never invent a new animation style; extend the existing library (§9) instead.
5. Follow the spacing scale: `.wrap` 1240px, sections 70px, grids 1/2/3/4-col.
6. Preserve responsive behavior: collapse grids ≤760–900px, hide custom cursor ≤900px, mobile-fixes touch targets ≤768px, `.csx-mobile`/`.desktop-only` swaps ≤820px/≤767px.
7. Preserve accessibility: one `<h1>`, skip-link, `:focus-visible`, alt text, `prefers-reduced-motion` fallback + no-JS static state.
8. Do not break existing layouts: verify the 11 TARGETS pages still regenerate via `npm run build:nav` after touching shared chrome.
9. Use existing color tokens (`--ink`, `--paper`, `--line`, `--graphite`, `--accent`) — no new hexes.
10. Follow existing naming: kebab-case classes, `?v=YYYYMMDD` cache-busts, `data-cur` labels, `<picture>` triplets, `loading`/`width`/`height` on every image.
11. Before adding any third-party script/origin, extend the CSP in `vercel.json` and re-verify.
12. Never edit generated headers/menus/footers in the HTML; use `scripts/build-nav.mjs`.

---

## 27. Complete Project Summary

Aryan Swaroop Portfolio (`aryanswaroop.com`) is a static, hand-coded 11-page portfolio for a Bengaluru-based brand designer & creative lead. It has no framework, no bundler, and no CMS — plain HTML5, one minified global stylesheet plus eight scoped stylesheets, and vanilla JavaScript (with vendored GSAP/ScrollTrigger/Lenis for the premium scroll work and a fully self-contained ES-module Canvas game). It deploys straight from the git repo to Vercel with clean extensionless URLs, immutable image caching, and a production Content-Security-Policy enforced via `vercel.json` headers. The only server-side code is a single token-gated `api/manifest.js` (Vercel function + `@vercel/blob`).

The site's identity is **editorial storytelling**: Fraunces serif display type on paper-white and near-black sections, a single red accent (`#C41E3A`), and motion that pays off scrolling — a pinned stack of selected-work images, a horizontal brand-category track, a sticky featured case study, a scroll-scrubbed MacBook on the builds page, pinned scroll-scrubbed storytelling inside both case studies, and an endless-runner game on the home page and 404. Interaction details include a custom background-aware cursor with `data-cur` labels and an image-reveal trail, an animated stat counter system (302 leads / 30 projects / 50 films), a full-screen mobile menu, a hover mega-menu, a 44-page PageFlip brand-guideline flipbook on the Brahmi case study, a before/after slider on the lifestyle page, and an interactive 3D pin-card grid.

The codebase is organized for maintainability with strict conventions: the header, mobile menu, and footer are generated by `scripts/build-nav.mjs` and must never be hand-edited; every asset carries a `?v=YYYYMMDD` cache-buster; images ship as AVIF/WebP/JPG triplets with reserved dimensions and lazy loading; every animated component honors `prefers-reduced-motion` and has a no-JS static fallback. Accessibility is treated as a requirement — skip links, `:focus-visible`, semantic landmarks, ARIA on all interactive widgets, and touch targets ≥44px on mobile. SEO is unusually strong for a portfolio: valid JSON-LD graphs on all 11 pages (Person, WebSite, BreadcrumbList, CollectionPage, Article, ProfilePage, speakable), Open Graph/Twitter cards, dual sitemaps, an AI-bot allowlist in `robots.txt`, `llms.txt`, and sr-only AI summaries — plus 16+ named AI crawlers explicitly allowed.

Content covers four work categories: **Real Estate** (Paavani Properties, VR Devaiah Enclave, Sidvin Serenity, Royal Farm — 302 leads in 66 days at ₹82/lead), **Lifestyle** (Brahmi Coffee Roasters coffee identity, Isha V, Arvi Hospital, Snehaloka Cricket Academy), **Builds** (six shipped web products: IronLog, AlbumFlow, Selixo, Expenses Tracker, Property Image Optimizer, Weekend Planner), and **Playground** (11 stills + 10 videos of motion and 3D experiments). Two deep-dive case studies anchor the work: Brahmi (pinned narrative + video + flipbook) and Paavani (count-up stats, process diagram, live embedded VR plot-finder iframe).

The project carries a known-issue ledger: the Brahmi mobile flipbook is an unconfigured blank Elfsight widget (the working book is desktop-only, ≥768px), `js/premium-flipbook.js` is intentionally frozen dead code, and a few cache-bust versions are stale on `real-estate.html` and `builds.html`. The 2026-08-03 audit scored the site **86/100 (B+)**, with SEO, accessibility, and code-quality the strongest areas and the mobile flipbook, Playground video payload, and lack of analytics the main gaps. A full remediation history and prioritized fix plan live in the `AUDIT/` folder and `REMEDIATION_REPORT_2026-08-03.md`.

**Bottom line for any AI model working here:** this is a small, carefully crafted static site where craft is the product. Match the existing design tokens, animation timing, and accessibility standards exactly; always regenerate the nav after touching shared chrome; bump cache-busters on every asset change; keep the game and vendor code isolated; and treat `prefers-reduced-motion`, the CSP, and the immutable image cache as hard constraints. When in doubt, `scripts/build-nav.mjs`, `style.css`, and the `AUDIT/` folder are the canonical references.
