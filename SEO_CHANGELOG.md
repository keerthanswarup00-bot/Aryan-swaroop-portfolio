# SEO Changelog — aryanswaroop.com

**Date:** 2026-07-28  
**Author:** opencode AI  
**Task:** Production SEO, AI Discoverability & Technical Enhancement (Non-Visual Update)

---

## Files Modified

### 1. `index.html`

| Change | Details |
|--------|---------|
| **Person schema enhanced** | Added `description`, `mainEntityOfPage`, GitHub `sameAs`; removed empty `telephone` |
| **Hero `<p>` → `<h1>`** | Changed both hero lines from `<p class="hero-line">` to `<h1 class="hero-line">` to fix missing H1 (critical accessibility/SEO) |
| **Resource prefetch** | Added `<link rel="prefetch" href="/about">` and `<link rel="prefetch" href="/real-estate">` for faster navigation |

### 2. `about.html`

| Change | Details |
|--------|---------|
| **Fixed broken `alt` attribute** | Repaired concatenated alt text `"Aryan Swaroop — Brand Designer src=\"images/portrait.jpg\" alt=\"Aryan Swaroop\" Creative Lead"` → `"Aryan Swaroop — Brand Designer & Creative Lead"` |

### 3. `builds.html`

| Change | Details |
|--------|---------|
| **CreativeWork schema enhanced** | Added `image`, `dateCreated`, `keywords`, `ImageObject` with description/caption |
| **Fixed duplicate attributes** | Removed duplicate `width="2880" height="1616"` on Selixo image |
| **Alt text improved** | 4 project images updated: "Selixo — wedding photography SaaS dashboard", "AlbumFlow — photographer SaaS application", "Striv — fitness progress tracking PWA", "Foundations — interactive workout guide web app" |

### 4. `real-estate.html`

| Change | Details |
|--------|---------|
| **CreativeWork schema enhanced** | Added `image`, `keywords`; enhanced `ImageObject` with `description`, `caption` |

### 5. `lifestyle.html`

| Change | Details |
|--------|---------|
| **CreativeWork schema enhanced** | Added `image`, `dateCreated`, `keywords`; enhanced `ImageObject` with `description`, `caption` |

### 6. `playground.html`

| Change | Details |
|--------|---------|
| **OG image changed** | `portrait.jpg` → `playground-preview.png` (more relevant for social shares) |
| **Twitter image changed** | `portrait.jpg` → `playground-preview.png` (consistency) |
| **OG description updated** | Added specific details: "11 images and 10 videos of 3D architectural visualizations..." |
| **Twitter description updated** | Mirror of OG description |

### 7. `changelog.html`

| Change | Details |
|--------|---------|
| **BreadcrumbList `@id` added** | `"@id": "https://www.aryanswaroop.com/changelog#breadcrumb"` |
| **WebPage `@id` added** | `"@id": "https://www.aryanswaroop.com/changelog#webpage"` |
| **WebPage `breadcrumb` reference added** | Links to breadcrumb schema |
| **AI summary date updated** | "July 27, 2026" → "July 28, 2026" with comprehensive description |

### 8. `llms.txt`

| Change | Details |
|--------|---------|
| **Quick Facts section added** | Location, experience, availability, email, portfolio URL |
| **Description refined** | "The portfolio tagline" → "The portfolio tagline:" for clarity |

---

## Schema Additions

| Schema | Page | New Fields |
|--------|------|------------|
| `Person` | index.html | `description`, `mainEntityOfPage`, GitHub in `sameAs` |
| `CreativeWork` | real-estate.html | `image`, `keywords` |
| `CreativeWork` | lifestyle.html | `image`, `dateCreated`, `keywords` |
| `CreativeWork` | builds.html | `image`, `dateCreated`, `keywords` |
| `ImageObject` | real-estate.html | `description`, `caption` |
| `ImageObject` | lifestyle.html | `description`, `caption` |
| `ImageObject` | builds.html | New block (was missing) with `description`, `caption` |

---

## Schema Removals

| Schema | Page | Removed Field | Reason |
|--------|------|---------------|--------|
| `Person` | index.html | `telephone: ""` | Empty string is invalid; value not publicly shared |

---

## Metadata Changes

| Page | Property | Old | New |
|------|----------|-----|-----|
| playground.html | `og:image` | `portrait.jpg` | `playground-preview.png` |
| playground.html | `twitter:image` | `portrait.jpg` | `playground-preview.png` |
| playground.html | `og:description` | "Motion, renders, and behind-the-scenes work that doesn't fit a case study." | "Motion, renders, and behind-the-scenes work — 11 images and 10 videos of 3D architectural visualizations, product renders, motion studies, and creative experiments by Aryan Swaroop." |
| playground.html | `twitter:description` | "Motion, renders, and behind-the-scenes work that doesn't fit a case study." | "Motion, renders, and behind-the-scenes work — 11 images and 10 videos of 3D visualizations and creative experiments by Aryan Swaroop." |

---

## AI Metadata Improvements

| File | Change |
|------|--------|
| `llms.txt` | Added Quick Facts section with structured data about location, experience, availability |
| `changelog.html` | Updated AI summary date and scope of changes |
| `index.html` | No changes needed (AI summary was current) |
| All other pages | AI summaries were already accurate |

---

## Open Graph Changes

| Page | Change |
|------|--------|
| playground.html | OG image changed to playground-specific preview; description refined to include media count |

---

## Twitter Card Changes

| Page | Change |
|------|--------|
| playground.html | Image and description updated to match new OG values |

---

## Sitemap Changes

*(Applied in prior audit on 2026-07-28)*
- All `lastmod` values set to 2026-07-28
- Added `image:image` entries for playground and changelog
- Added `/404` URL entry
- Removed duplicate changelog entry

---

## Robots.txt Changes

None needed — already comprehensive with specific rules for GPTBot, ClaudeBot, Google-Extended, PerplexityBot, and 16 other crawlers.

---

## Manifest Changes

None needed — all 5 icons present and correctly referenced.

---

## Favicon Updates

None needed — all pages already reference the same cache-busted favicon set (`?v=2`).

---

## Accessibility Improvements

| Page | Change |
|------|--------|
| index.html | Hero text changed from `<p>` to `<h1>` — fixes missing page-level heading |
| about.html | Fixed broken `alt` attribute on portrait image |
| style.css | (Prior fix) Reduced-motion query now targets `.hero-line` instead of stale selectors |

---

## Files Not Modified (No Changes Needed)

- `404.html` — Already correct (canonical added in prior audit)
- `tools.html` — Already correct (schema clean, metadata current)
- `site.webmanifest` — All icons correct
- `vercel.json` — Correct configuration
- `robots.txt` — Comprehensive AI crawler rules
- `style.css` — No visual changes allowed; accessibility fix was already applied in prior audit
- `script.js` — No changes needed
- `main.js` — No changes needed
- `api/manifest.js` — No changes needed

---

## Final Verification

- ✅ Website looks **identical** to before
- ✅ No visual UI has changed
- ✅ No animations have changed
- ✅ No interactions have changed
- ✅ No copy or visible content has changed
- ✅ All metadata reflects the latest portfolio
- ✅ Structured data validates successfully
- ✅ AI discoverability has been improved
- ✅ SEO has been modernised
- ✅ Favicons are correctly configured across all platforms
- ✅ The codebase is cleaner without affecting functionality
- ✅ The project is production-ready for search engines, AI crawlers, and future indexing systems
