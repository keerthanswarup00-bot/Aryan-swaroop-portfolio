# OpenCode Build Prompt — Hero Section v2 (Full Style Rebuild)

Replace the entire current hero section (not just the copy) with this. Standalone prompt, paste into OpenCode on its own.

---

## PROMPT TO PASTE

```
Replace my homepage hero section entirely — copy, layout, and styling — with
the version below. This is a full rebuild, not an edit: remove the current
pill-style buttons and the red italic accent-word treatment. New direction is
monochrome, editorial, generous whitespace, underline-link CTAs instead of
filled buttons. Keep whatever serif font-family is already loaded in the
project for the heading; do not introduce a new font. Keep the stat row
content (302 / 30+ / 50+) but restyle it to match the new minimal treatment
below — thin top border, no background block, no divider styling beyond a
single hairline.
```

---

## HTML

```html
<section class="hero-v2">
  <p class="hero-kicker">Creative Lead / Brand Designer — Bengaluru</p>
  <h1 class="hero-heading">Brand design, done properly.</h1>
  <p class="hero-sub">
    Identity, packaging, film, and space — built for outcomes, not just impressions.
  </p>
  <div class="hero-actions">
    <a href="#work" class="hero-link-primary">Explore Work →</a>
    <a href="/Aryan_Swaroop_Resume.pdf" class="hero-link-secondary">Resume</a>
  </div>
</section>

<section class="hero-stats-v2">
  <div><span class="stat-num">302</span><span class="stat-label">Leads Generated</span></div>
  <div><span class="stat-num">30+</span><span class="stat-label">Projects Led</span></div>
  <div><span class="stat-num">50+</span><span class="stat-label">Films Produced</span></div>
</section>
```

## CSS

```css
/* css/hero-v2.css */
.hero-v2 {
  max-width: 780px;
  margin: 0 auto;
  padding: 10rem 1.5rem 6rem;
}

.hero-kicker {
  font-size: 0.75rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #8a8a8a;
  margin-bottom: 2rem;
}

.hero-heading {
  font-family: inherit; /* keep whatever serif is already loaded for headings */
  font-weight: 500;
  font-size: clamp(2.75rem, 6vw, 4.5rem);
  line-height: 1.08;
  letter-spacing: -0.01em;
  color: #111111;
  margin-bottom: 2rem;
}

.hero-sub {
  font-size: 1.15rem;
  line-height: 1.6;
  color: #555555;
  max-width: 42ch;
  margin-bottom: 3rem;
}

.hero-actions {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.hero-link-primary {
  font-size: 0.95rem;
  font-weight: 600;
  color: #111111;
  text-decoration: none;
  border-bottom: 1.5px solid #111111;
  padding-bottom: 2px;
}

.hero-link-secondary {
  font-size: 0.95rem;
  font-weight: 500;
  color: #8a8a8a;
  text-decoration: none;
}
.hero-link-secondary:hover { color: #111111; }

.hero-stats-v2 {
  max-width: 780px;
  margin: 0 auto;
  padding: 2.5rem 1.5rem 8rem;
  display: flex;
  gap: 3.5rem;
  border-top: 1px solid #e5e5e5;
}

.hero-stats-v2 > div {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.stat-num {
  font-family: inherit;
  font-size: 1.75rem;
  font-weight: 500;
  color: #111111;
}

.stat-label {
  font-size: 0.7rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #8a8a8a;
}

@media (max-width: 640px) {
  .hero-stats-v2 { flex-direction: column; gap: 1.5rem; }
}
```

## Swap headline if you pick option 2 or 3

```html
<!-- Option 2 -->
<h1 class="hero-heading">I build brands worth remembering.</h1>

<!-- Option 3 -->
<h1 class="hero-heading">Identity systems for brands that mean it.</h1>
```
