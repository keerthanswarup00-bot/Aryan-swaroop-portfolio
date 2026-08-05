# 01 — Codebase Map

Complete inventory of every tracked file, verified by walking the tree (excluding `node_modules/`, `.git/`, `.vercel/`). Line counts for source files are approximate snapshots at audit time.

---

## Root files

| File | Bytes | Purpose |
|---|---|---|
| `index.html` | ~700 lines | Homepage — hero, intro claim, featured Brahmi story, horizontal work, sticky featured, game |
| `about.html` | ~380 | About page — hero, story blocks, experience, education |
| `real-estate.html` | ~440 | Real-estate case tiles + devaiah gallery |
| `lifestyle.html` | ~570 | Lifestyle case tiles + before/after slider |
| `builds.html` | ~366 | Web-product builds + "View Live" CTAs |
| `tools.html` | ~288 | Skills groups + resume block |
| `playground.html` | ~390 | Editorial gallery (11 images / 10 videos) |
| `changelog.html` | ~307 | Site changelog (noindex) |
| `404.html` | ~248 | Custom 404 + endless-runner game |
| `style.css` | 37,718 (minified, 9 lines) | Global design system + components (cursor, header, mega-menu, mobile menu, hero, footer, lightbox, before/after…) |
| `script.js` | ~60 | Intro overlay, page fade transitions, cursor, Safari detection, scrollbar |
| `main.js` | — | ES-module entry: boots the endless-runner game on `#game` (index + 404) |
| `dropdown.js` | — | Injects the Design mega-menu + mobile menu into `#designDropdown` |
| `lightbox.js` | — | Desktop-only (≥1024px) lightbox for `.feature-visual` / `.gallery-tile` / `.work-visual` / `.idea-tile` / `.devaiah-row img` |
| `before-after.js` | — | Before/after slider with pointer capture + keyboard arrows (lifestyle) |
| `playground.js` | — | Playground lightbox + IntersectionObserver video autoplay/pause |
| `api/manifest.js` | — | Vercel serverless: lists `@vercel/blob` `images/*` into a JSON manifest (CORS `*`) |
| `scripts/build-nav.mjs` | — | Single source of truth: exports `HEADER_HTML` / `MOBILE_MENU_HTML` |
| `server.py` | — | Local Python server + admin image-upload endpoint (sha256 `ADMIN_HASH`) |
| `vercel.json` | — | cleanUrls, trailingSlash:false, caching, security headers, api maxDuration |
| `package.json` | — | private; dep `@vercel/blob ^2.6.1`, `gsap ^3.15.0`, `lenis ^1.3.25`; script `build:nav` |
| `package-lock.json` | — | Present on disk but **gitignored** (unusual; see 11) |
| `.gitignore` | — | `.DS_Store`, `node_modules/`, `package-lock.json`, `.vercel/`, `.env*` |
| `.env.local` | ~1 | Contains `VERCEL_OIDC_TOKEN` (build-time OIDC JWT) — gitignored but present in working tree (see 09) |
| `robots.txt` | — | Allows all bots + 20 named AI crawlers; lists both sitemaps |
| `llms.txt` | — | AI-readable site description, projects, contact, "how to cite" |
| `security.txt` | — | Contact email for security reports |
| `humans.txt` | — | Stack + credits (states "static HTML/CSS/JS", Fraunces/Inter, Canvas game, Vercel) |
| `site.webmanifest` | — | PWA manifest, theme `#FAFAF8`, 5 icons with `?v=2`, standalone |
| `browserconfig.xml` | — | References `/mstile-150x150.png` — **file does not exist** (broken ref) |
| `sitemap.xml` | — | 9 URLs (all indexable pages) |
| `sitemap-images.xml` | — | 30+ image:image entries across 6 URLs |
| `Aryan_Swaroop_Resume.pdf` | ~? | Resume download |
| `Realtors_Edge_Playbook.pdf` | ~? | PDF download (real estate) |
| `AUDIT_REPORT_2026-08-02.md` | 15,340 | Prior full audit (B+, 87/100) |
| `PRODUCTION_AUDIT_REPORT.md` | 10,999 | Prior SEO/AI audit (94/100) |
| `SEO_CHANGELOG.md` | 7,384 | Change log of the SEO pass |
| `RELEASE_NOTES.md` | 2,871 | v1.0 → v2.0 release notes |

## `css/` (8 files + root `style.css`)

| File | Purpose / notes |
|---|---|
| `style.css` (root) | Global system — all page chrome + shared components. Minified to 9 long lines; contains ~1,536 CSS rules after formatting. `body{cursor:none}` custom-cursor pattern; reduced-motion block kills animations. |
| `css/case-study.css` | Case-study template: overview grid, gallery, kolam draw animation, bean-trail particles, blend selector, media figure static/video swap. |
| `css/case-study-dark.css` | Dark theme overrides: `.page-dark`, `.cs-dark` — dark case studies (Brahmi header teal, paavani). |
| `css/home-rebuild.css` | Homepage rebuild: hero prompt, lead claim, Brahmi `.csx` sticky storytelling, horizontal work section, sticky-featured `.sfp` stack + static/reduced-motion fallbacks. |
| `css/mobile-fixes.css` | Loaded last on every page; mobile (≤768px) safety net: overflow-x, image containment, hero spacing, hamburger 44px, mobile progress bar, menu spacing. |
| `css/paavani.css` | Paavani case study: hero, overview, result stat, interactive embed (full-bleed iframe), applied grid, stats strip, process, reading-progress rail, parallax. |
| `css/playground.css` | Playground gallery: `.pg-grid` responsive (1/3/5/6 cols), `.pg-item`, hover scale, reduced-motion. |
| `css/premium-flipbook.css` | Full-bleed flipbook section, `.fb-desktop` nav/counter, `desktop-only`/`mobile-only` toggles, `.cs-flipbook-embed` (Elfsight container). |
| `css/storytelling.css` | Pinned GSAP storytelling section `.cs-story` + static fallback + `.cs-story--active` full-screen state. |

## `js/`

| File | Loaded on | Purpose |
|---|---|---|
| `js/Game.js` | via `main.js` (index, 404) | Game engine: orchestrates loop, spawning, collisions, score, sound, canvas scaling |
| `js/Input.js` | " | Space/ArrowUp/KeyW + pointer tap; prevents default |
| `js/Player.js` | " | Runner physics (gravity, jump, 4-frame run cycle, hitbox) |
| `js/Obstacle.js` | " | Auto (3 sizes) / cow / pothole spawn logic + hitboxes |
| `js/Ground.js` | " | Scrolling ground texture bits |
| `js/Cloud.js` | " | Parallax clouds |
| `js/Background.js` | " | Metro + coconut silhouettes near the horizon |
| `js/Score.js` | " | Score + localStorage high score (`auto-run-high`) |
| `js/Sound.js` | " | WebAudio SFX + procedural chiptune loop; mute persisted in `game_muted` |
| `js/Physics.js` | " | GRAVITY/JUMP_FORCE/TERMINAL_VELOCITY + `stepVelocity` |
| `js/Renderer.js` | " | Pixel-art canvas drawing (player, auto, cow, pothole, intro, game-over) |
| `js/Particle.js` | " | Dust particle |
| `js/Intro.js` | " | Intro/instruction timing state machine |
| `js/Utils.js` | " | `clamp`, `rand`, `chance`, `padScore` |
| `js/AssetLoader.js` | " | **Stub** — extension-point placeholder, unused |
| `js/sticky-featured-projects.js` | index | GSAP/ScrollTrigger pinned stack of featured cards |
| `js/home-motion.js` | index | GSAP horizontal scroll-jack for `#workHorizontal` (≥901px) |
| `js/brahmi-story.js` | index | Adds `.csx-anim`; pinned sticky-left storytelling for `#brahmi` (≥901px) |
| `js/flipbook-desktop.js` | work/brahmi | PageFlip book (44 pages, `/images/brahmi/page-NN.jpg`), prev/next/keyboard; loads `page-flip@2.0.7` from unpkg |
| `js/reveal-on-scroll.js` | work/* | `.reveal-block` / `.reveal-child` IntersectionObserver reveals |
| `js/blend-selector.js` | work/brahmi | Brand-variant photo switcher (`.blend-btn` / `.blend-photo`) |
| `js/kolam-reveal.js` | — | **Dead code** — not referenced by any page |
| `js/bean-trail.js` | — | **Dead code** — not referenced by any page |
| `js/premium-flipbook.js` | — | **Dead code** — jQuery Turn.js version, not referenced |
| `js/turn.js` | — | **Dead code** — vendored Turn.js 4.1.0 (62 KB), not referenced |
| `js/storytelling.js` | work/* | Pinned GSAP narrative; `.cs-story`; reduced-motion/static fallback |
| `js/paavani.js` | work/paavani | Stat count-up, hero parallax, lazy-load VR iframe |
| `js/playground-gallery.js` | playground | Lenis smooth scroll + GSAP reveal + hero entrance |
| `js/vendor/gsap.min.js` | index, work/*, playground | GSAP 3.15.0 (73 KB) |
| `js/vendor/ScrollTrigger.min.js` | index, work/*, playground | (44.6 KB) |
| `js/vendor/CustomEase.min.js` | playground | (7.1 KB) |
| `js/vendor/lenis.min.js` | playground | (18.4 KB) |

## `work/`

| File | Purpose |
|---|---|
| `work/brahmi.html` | Brahmi Coffee Roasters case study — kolam header, story blocks, blend selector, desktop PageFlip book + **broken mobile Elfsight widget**, storytelling section |
| `work/paavani-properties.html` | Paavani case study — dark hero, stats count-up, process steps, interactive VR iframe embed, reading-progress rail |

## `images/` (357 files, 50 MB) + `images/brahmi/`

- **Format discipline:** most project assets exist as AVIF + WebP + JPG triplets (≈103/103/133). Pages use `<picture>` with AVIF→WebP→JPG fallback.
- **`images/brahmi/`:** 44 flipbook pages (`page-01.jpg` … `page-44.jpg`), 3 MB total (~60–115 KB each) — reasonable.
- **Video:** 10 `pg-video-01…10.m4v` (~4.6 MB total, largest `pg-video-04` 1,024 KB) + `brahmi-process.mp4` (524 KB) + `.webm` twin.
- **Heavy non-triplet assets:** `arvi-*.png` before/after set (~5 MB, no AVIF/WebP), `nav-avatar.png` (476 KB, AVIF/WebP triplets also exist), `build-preview.png`, `mega-*.png`, `playground-preview.png`.
- **Naming oddity:** `ishav-guards-guards.avif/.jpg/.webp` (doubled word) — harmless but sloppy.

## `pdfs/`

- `pdfs/brahmi-brand.pdf` — 5.9 MB brand deck (referenced from work/brahmi as a download).
- Root PDFs: `Aryan_Swaroop_Resume.pdf`, `Realtors_Edge_Playbook.pdf`.

## `archive/`

- `archive/source-images/final-images/`, `archive/favicon-source/favicon-io/` — source material, only `.DS_Store` files remain (24 KB). Safe to delete or leave; not served.

## `.vercel/`, `node_modules/`

- Present locally (gitignored). `node_modules` contains `@vercel/blob`, `gsap`, `lenis` per package.json.
- **Note:** pages load GSAP/Lenis from `js/vendor/*.js`, not from `node_modules` — the package.json deps only reflect `@vercel/blob` in the serverless function; `gsap`/`lenis` in package.json are effectively unused by the runtime build.

## Excluded by audit (per scope)

`node_modules/`, `.git/`, `.vercel/`, `.DS_Store`.
