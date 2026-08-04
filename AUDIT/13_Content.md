# 13 — Content

Editorial/business-content review. The site reads as a polished senior-designer portfolio; content work here is light-touch polish, not repair.

## Copy & positioning
- **Value proposition is consistent:** "Brand Designer & Creative Lead", end-to-end brand systems, real-estate + lifestyle verticals, web products, 3D/motion. Homepage hero + lead claim + stats (302+ projects, 30+ brands, 50+ systems) reinforce it.
- **Case-study depth is a differentiator:** 44-page Brahmi identity, Paavani end-to-end system, process sections, "what was applied everywhere" grids. Genuinely strong content.
- **AI-discoverability copy:** sr-only AI summary blocks on real-estate/lifestyle/builds/tools/playground + `llms.txt` — consistent, well-written, and future-proofing well.

## Assets & documents
| Asset | Size | Usage | Note |
|---|---|---|---|
| `Aryan_Swaroop_Resume.pdf` | — | tools.html + nav/mobile "Resume" | fine |
| `Realtors_Edge_Playbook.pdf` | — | real-estate.html | fine |
| `pdfs/brahmi-brand.pdf` | 5.9 MB | work/brahmi.html download | large for a download; acceptable for a brand deck, but consider a compressed edition |

## Content issues

1. **File naming:** `ishav-guards-guards.avif/.webp/.jpg` — doubled word; rename for professionalism of the repo (also affects any sitemap-image URL if it's referenced — it isn't).
2. **Footer drift (M2):** © row missing on about/changelog/playground. The mobile-menu footer says **"© 2026"** and the page footers use a JS-year — after 2026 these need the year rollover handled consistently (JS-year pattern is fine, just keep it site-wide).
3. **Stats consistency:** hero claims 302+/30+/50+; verify these match the resume/PDF and aren't drifting as projects are added.
4. **Changelog freshness:** `changelog.html` (noindex) is maintained; it documents the AVIF pass, game merge, flipbook fix, mobile fixes — good practice. Keep it in sync with 15 when fixes land.
5. **Testimonials gap:** no client quotes/testimonial anywhere (noted in 07). A single "what clients say" block on real-estate or the homepage would add credibility for a senior hire search.
6. **Security/contact:** `security.txt` and `humans.txt` are present and accurate.
7. **404 tone:** "You've wandered off the map" + game + "Head Back Home" — on-brand and helpful.

## Verdict
Content is a strength. Only mechanical fixes needed: footer consistency (M2), one filename typo, and optional additions (testimonials, compressed brand PDF).
