# Release Notes

## v2.0 — July 2026

### Added
- AI metadata (Open Graph, Twitter Cards, JSON-LD structured data across all 9 pages)
- Speakable schema for voice assistants
- Expanded Person schema (nationality, credentials, InteractionCounter)
- SearchAction on WebSite schema
- BreadcrumbList on every page
- Image sitemap (sitemap-images.xml with 30+ entries)
- llms.txt (comprehensive AI-readable site description)
- /changelog page with update history
- security.txt, humans.txt, browserconfig.xml
- AI summary blocks (sr-only) on all pages
- Skip-to-content accessibility link on all pages
- Semantic `<main>` wrapping on all pages
- Verification tag placeholders (Google, Bing)
- Preconnect to fonts.gstatic.com
- 15+ AI bot allowances in robots.txt (ClaudeBot, PerplexityBot, Bytespider, Amazonbot, Applebot-Extended, etc.)
- Playground page with 22 media items (optimized WebP + H.264)
- Custom cursor system with background-aware inversion
- Premium mega dropdown navigation (Owen Hudock–matched)
- Mobile menu with staggered fade-in, swipe-to-close
- Endless runner game with chiptune audio toggle
- Intro flash sequence on homepage

### Fixed
- Navigation aria-controls pointing to correct mobileMenu ID
- Nested `<nav>` elements properly labeled with aria-label
- External links secured with rel="noopener noreferrer"
- Dead /api/manifest fetch removed from script.js
- 404 page duplicate game-section divs merged
- Playground video cleanup on lightbox close (pause + src clear)
- Video loading: preload="auto" replacing metadata+lazy for faster playback
- Broken `<nav>` closing tags restored after sed edits
- About page missing foot-bottom and data-cur attributes

### Changed
- Game section restricted to home and 404 pages only
- Mega menu nav thumbnails cache-busted with -2.png suffix
- Mobile navbar padding/spacing tightened for phones
- Videos compressed from ~55MB to ~5.5MB total (H.264 720p CRF28)
- Images optimized to WebP (800px, quality 82)

### Performance
- Preconnect hints for Google Fonts
- Font loading via preload + async stylesheet swap
- Video faststart flag for progressive loading
- Lazy loading on below-fold images
- decoding="async" on all images

### Accessibility
- Skip-to-content links with keyboard focus styles
- ARIA labels on all interactive elements
- Screen reader-only AI summary blocks
- prefers-reduced-motion support on intro and animations
- Semantic heading hierarchy maintained across all pages

---

## v1.0 — July 2026

### Initial Launch
- 7 pages: Home, Real Estate, Lifestyle, Builds, Tools, About, 404
- Shared CSS/JS architecture
- Custom cursor with background-aware inversion
- Scroll-reveal animations
- Stats rolling counter animation
- Favicon system (ICO, PNG, Apple Touch Icon)
- Meta/OG/Twitter tags on all pages
- Deployed on Vercel with clean URLs
- Endless runner game with Canvas API
