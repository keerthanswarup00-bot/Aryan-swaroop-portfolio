# SEO Report

**Date:** 2026-08-05 | **Lighthouse SEO: 100/100** (desktop)

## Per-page metadata (all present)

Every page ships `<title>`, meta description, canonical, `og:title`, `og:image`, `og:type`, and `twitter:card`.

| Page | Title | Verified |
|---|---|---|
| `/` | Aryan Swaroop — Brand Designer & Creative Lead | ✓ |
| `/about` | About — Aryan Swaroop, Brand Designer & Creative Lead | ✓ |
| `/real-estate` | Real Estate Brand Systems | ✓ |
| `/lifestyle` | Lifestyle Brand Identity | ✓ |
| `/builds` | Web Product Builds | ✓ |
| `/tools` | Tools & Skills | ✓ |
| `/playground` | Playground — Motion, Rendering & Experiments | ✓ |
| `/changelog` | Changelog — Portfolio Updates | ✓ |
| `/work/brahmi` | Sastry's by Brahmi — Brand Identity & Packaging | ✓ |
| `/work/paavani-properties` | Paavani Properties — End-to-End Brand System | ✓ |
| `/404` | Page Not Found | ✓ |

## Structured data / social

- JSON-LD `Person` + `WebSite` present on the homepage; inline scripts are CSP-compatible.
- All 6 `og:image` files verified to exist on disk (AVIF/WebP/JPG sources).
- Canonical URLs use the clean production origin (`https://www.aryanswaroop.com/…`).

## Sitemaps & robots

- `sitemap.xml`: 9 URLs, all live routes, extensionless, match Vercel `cleanUrls`. `/changelog` is intentionally absent (meta page); add it if you want it indexed.
- `sitemap-images.xml`: present (11 KB), referenced from `robots.txt`.
- `robots.txt`: `Allow: /`, `Disallow: /api/`, plus explicit allow rules for AI crawlers (GPTBot, ClaudeBot, Perplexity, etc.) and the sitemap lines.

## Notes / recommendations (non-blocking)

- `og:image` uses JPG/PNG (absolute URLs) — good for social scrapers; no action needed.
- Consider adding `changelog` to `sitemap.xml` if you want that page discoverable.
- Meta descriptions are strong, unique per page; no truncation risk at ~150–160 chars.
- No `<link rel="canonical">` mismatch or duplicate-content pages found.
