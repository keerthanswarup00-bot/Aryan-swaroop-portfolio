# 04 — Features

Feature-by-feature audit of the interactive and content features actually shipped (and the dead ones still in the repo).

---

## 1. Endless-runner canvas game (home + 404)
- **Entry:** `main.js` (ES module) boots the engine into `#game` on `index.html` and `404.html`.
- **Engine (all ES modules in `js/`):** `Game.js` orchestrates loop/spawning/collisions/score/sound; `Input.js` (Space/ArrowUp/W + tap, `preventDefault`); `Player.js` (gravity/jump/4-frame run cycle/hitbox); `Obstacle.js` (3 autos + cow + pothole); `Ground.js` scrolling; `Cloud.js` parallax; `Background.js` metro+coconut skyline; `Score.js` + localStorage high score key `auto-run-high`; `Sound.js` WebAudio SFX + procedural chiptune, mute persisted in `game_muted`; `Physics.js` constants; `Renderer.js` pixel-art canvas drawing; `Particle.js` dust; `Intro.js` instruction state machine; `Utils.js` (`clamp/rand/chance/padScore`).
- **Vendored:** `js/Game.js` etc. are all local — no runtime deps. ✅
- **Strengths:** clean module split; canvas resizes via DPR; game-over → restart; mute button; reduced-motion respected (`game` won't auto-run? verified engine checks reduced-motion and shows static intro).
- **Issues:**
  - `js/AssetLoader.js` is a stub (extension point, unused — dead weight in module graph).
  - Game section on homepage duplicates the 404 one in *concept*, not code (single module — fine).
  - No `<noscript>` message for `#game` area (canvas area is blank for no-JS users on 404).

## 2. GSAP horizontal scroll-jack (`home-motion.js`, home)
- `#workHorizontal` pins and translates horizontally ≥901px; `prefers-reduced-motion` → natural vertical scroll fallback. Nested ScrollTriggers guarded for `matchMedia`. ✅

## 3. Sticky featured stack (`sticky-featured-projects.js`, home)
- Pinned stacking of `.sfp` cards; scroll-tied; static fallback + reduced-motion branch. ✅

## 4. Brahmi featured storytelling (`brahmi-story.js`, home)
- Adds `.csx-anim`; pinned sticky-left text + right visual for `#brahmi` ≥901px; fallback static stacked layout. ✅

## 5. Case-study storytelling (`storytelling.js`, work/*)
- Pinned GSAP narrative `.cs-story` with `--active` full-screen state; static fallback; reduced-motion respected. ✅

## 6. Kolam draw animation + bean-trail particles (work/brahmi)
- `.kolam` draw-in and bean-trail are present in `css/case-study.css`, but the **drivers `js/kolam-reveal.js` and `js/bean-trail.js` are not referenced by any page** → dead code (the animations ship in CSS but never run; ~1 KB). Either wire them up or delete.

## 7. Premium flipbook — jQuery Turn.js (`js/premium-flipbook.js` + `js/turn.js`)
- **Entirely dead:** not referenced by any page. `js/turn.js` (Turn.js 4.1.0, 62 KB) + the wrapper file are unreachable. The shipped flipbook is `js/flipbook-desktop.js` (PageFlip). Delete both files.
- Presumably the original flipbook implementation superseded by the PageFlip version (see RELEASE_NOTES).

## 8. VR Devaiah interactive plot finder (work/paavani)
- Full-bleed `<iframe id="interactiveFrame">` embeds external app `https://vr-devaiah-enclave.vercel.app/`; loaded lazily on scroll into view by `paavani.js` (empty `src` until then). **Issues:** raw `src=""` re-requests the current page pre-JS; and the embed is a hard runtime dependency on another Vercel deployment staying alive.
- Fallback caption + link provided when iframe fails to load? `paavani.js` shows a "Open in new tab" link on load error (verified). ✅

## 9. PDF downloads
- `Aryan_Swaroop_Resume.pdf` (tools.html download), `Realtors_Edge_Playbook.pdf` (real-estate), `pdfs/brahmi-brand.pdf` (5.9 MB, work/brahmi download). All `download` attributes + `rel`. ✅

## 10. AI-discoverability suite
- `robots.txt`: allows all + 16 explicitly named AI crawlers (GPTBot, ClaudeBot, Perplexity, etc.), lists both sitemaps.
- `llms.txt`: site description, project list with URLs, contact, "how to cite".
- **sr-only AI summary blocks:** on real-estate, lifestyle, builds, tools, playground (visible only to screen readers / AI crawlers — verified present).
- `security.txt` (contact), `humans.txt` (stack/credits). ✅

## 11. SEO/structured-data feature set
- JSON-LD (Person, WebSite, WebPage, BreadcrumbList, CreativeWork, ImageObject, CollectionPage, AboutPage) on all pages; canonical + OG + Twitter; `sitemap.xml` + `sitemap-images.xml`. Verified unchanged from the 94/100 production audit.

## 12. Serverless API (`api/manifest.js`)
- `GET` lists `images/*` from `@vercel/blob` → JSON manifest, `Access-Control-Allow-Origin: *`. Used by… (no consumer found in pages — appears future-facing / for admin). Unauthenticated blob enumeration (09).

## 13. Local admin uploader (`server.py`)
- `POST /upload` stores images under `images/uploads/` guarded by `ADMIN_HASH` (sha256 of a passphrase). Development-only; not part of the Vercel deploy.

## 14. Cache-busting convention
- All asset references use `?v=YYYYMMDD` (e.g. `style.css?v=20260801`). Consistent across pages. ✅

## Dead-code summary (candidates for removal)
| File | Size | Status |
|---|---|---|
| `js/kolam-reveal.js` | small | unreferenced |
| `js/bean-trail.js` | small | unreferenced |
| `js/premium-flipbook.js` | small | unreferenced (Turn.js version) |
| `js/turn.js` | 62 KB | unreferenced |
| `js/AssetLoader.js` | small | stub, unused |
| `archive/` | 24 KB | `.DS_Store` only |
