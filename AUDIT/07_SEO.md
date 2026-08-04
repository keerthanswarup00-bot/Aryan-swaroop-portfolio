# 07 — SEO & Structured Data

Re-verification pass against `PRODUCTION_AUDIT_REPORT.md` (2026-07-28, scored **94/100**) and the 08-02 audit. All 11 pages verified in current source on 2026-08-03.

## Verified present (no action)

| Check | Result |
|---|---|
| Unique `<title>` per page | ✅ 11/11 |
| Unique meta description (110–229 chars) | ✅ 11/11 |
| Canonical (`rel="canonical"`) | ✅ 11/11 |
| `lang="en"`, viewport | ✅ 11/11 |
| Indexation: `noindex` only on changelog + 404 (correct) | ✅ |
| `404.html` canonical → `/` | ✅ (avoids orphan indexing; page is noindexed anyway) |
| Open Graph + Twitter cards (og:title/desc/image/url/type, twitter:card=summary_large_image) | ✅ 11/11 |
| JSON-LD (Person, WebSite, WebPage, BreadcrumbList, Article, CreativeWork, ImageObject, CollectionPage, AboutPage) | ✅ 11/11 — structure unchanged from validated set |
| Single `<h1>` per page | ✅ 11/11 |
| `sitemap.xml` → 9 URLs, exactly the indexable pages | ✅ |
| `sitemap-images.xml` → 30+ image entries | ✅ |
| `robots.txt` lists both sitemaps | ✅ |
| `llms.txt` | ✅ |
| `security.txt` / `humans.txt` | ✅ |

## robots.txt (current)
- `User-agent: *` → `Allow: /`, `Disallow: /api/`.
- **16 explicitly named AI agents** allowed: GPTBot, ChatGPT-User, ClaudeBot, Claude-Web, anthropic-ai, Google-Extended, PerplexityBot, Perplexity, Bytespider, CCBot, Amazonbot, Applebot-Extended, YouBot, Meta-ExternalAgent, FacebookBot, Yandex.
- Deliberate AI-discoverability strategy (documented in prior audits) — consistent with `llms.txt` and the sr-only AI summary blocks on real-estate/lifestyle/builds/tools/playground.
- Note: `Disallow: /api/` correctly blocks `/api/manifest` from indexing.

## Issues

1. **Heading-order skips (M3)** — real-estate & builds `h1 → h3`; about `h1 → h3` and `h2 → h4`. Screen readers/SEO extractors assume sequential levels. 30-min fix (promote card titles to `h2`, story-block labels to `h2` where they follow h1).
2. **Missing footer copyright on 3 pages (M2)** — about, changelog, playground end without the `foot-bottom` row → inconsistent crawl of link structure (8/11 pages have it). 1 h.
3. **No web analytics (M1)** — zero tracking on all 11 pages; no way to measure which case studies convert to the email CTA. Recommend privacy-friendly (Plausible/Umami) — 1–2 h.
4. **No testimonials / client quotes** — easy credibility add for a senior-designer portfolio (business, not technical).
5. **No blog/thought-leadership** — gaps vs. peers; optional.
6. **404 content** — custom 404 with the game is strong for UX; keep the "Head Back Home" CTA above the fold (verified it is).

## sitemap vs. pages consistency
All 9 `sitemap.xml` URLs correspond to real pages (7 root pages + 2 case studies), extensionless (correct for Vercel `cleanUrls`). Changelog correctly excluded. No orphan/noindex URLs listed. ✅

## Verdict
SEO remains the site's strongest pillar (~94/100 stands). The only regressions to close are the three Mediums (heading order, footer consistency, analytics) — none affect ranking signals materially, but all affect crawl/inclusion quality and measurement.
