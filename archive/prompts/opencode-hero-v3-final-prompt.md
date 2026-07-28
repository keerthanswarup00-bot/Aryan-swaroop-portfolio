# OpenCode Build Prompt — Hero Section v3 (Final)

Standalone prompt. Replaces the entire hero section again — this is the final version, supersedes the v2 file from earlier in this project.

---

## PROMPT TO PASTE

```
Replace my homepage hero section entirely with the version below. Remove
whatever hero markup currently exists (from an earlier version of this
project) and use this instead. Keep whatever serif font-family is already
loaded for headings — do not introduce a new font. Add a subtle one-time
fade-and-rise entrance animation on the heading and sub on page load only
(not on every scroll into view) — tasteful and quick, not a gimmick. The
stats section below the hero needs more visual weight than before: larger
numbers, more vertical breathing room, so it reads as a second strong beat
after the heading, not an afterthought.
```

---

## HTML

```html
<section class="hero-v3">
  <p class="hero-kicker">Creative Lead / Brand Designer — Bengaluru</p>
  <h1 class="hero-heading">Design that performs.</h1>
  <p class="hero-sub">Brand identity, video, and code — built by one person.</p>
  <div class="hero-actions">
    <a href="#work" class="hero-link-primary">Explore Work →</a>
    <a href="/Aryan_Swaroop_Resume.pdf" class="hero-link-secondary">Resume</a>
  </div>
</section>

<section class="hero-stats-v3">
  <div><span class="stat-num">302</span><span class="stat-label">Leads Generated</span></div>
  <div><span class="stat-num">30+</span><span class="stat-label">Projects Led</span></div>
  <div><span class="stat-num">50+</span><span class="stat-label">Films Produced</span></div>
</section>
```

## CSS

```css
/* css/hero-v3.css */
.hero-v3 {
  max-width: 780px;
  margin: 0 auto;
  padding: 11rem 1.5rem 5rem;
}

.hero-kicker {
  font-size: 0.75rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #8a8a8a;
  margin-bottom: 1.75rem;
  opacity: 0;
  animation: heroFadeUp 0.6s ease-out forwards;
}

.hero-heading {
  font-family: inherit;
  font-weight: 600;
  font-size: clamp(3rem, 7vw, 5.25rem);
  line-height: 1.02;
  letter-spacing: -0.02em;
  color: #111111;
  margin-bottom: 1.25rem;
  opacity: 0;
  animation: heroFadeUp 0.7s ease-out 0.1s forwards;
}

.hero-sub {
  font-size: 1rem;
  line-height: 1.5;
  color: #6b6b6b;
  max-width: 34ch;
  margin-bottom: 2.75rem;
  opacity: 0;
  animation: heroFadeUp 0.6s ease-out 0.25s forwards;
}

.hero-actions {
  display: flex;
  align-items: center;
  gap: 2rem;
  opacity: 0;
  animation: heroFadeUp 0.6s ease-out 0.35s forwards;
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

@keyframes heroFadeUp {
  from { opacity: 0; transform: translateY(14px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Stats — more weight than the previous version: bigger numbers, more air */
.hero-stats-v3 {
  max-width: 780px;
  margin: 0 auto;
  padding: 3.5rem 1.5rem 9rem;
  display: flex;
  gap: 4rem;
  border-top: 1px solid #e5e5e5;
}

.hero-stats-v3 > div {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.stat-num {
  font-family: inherit;
  font-size: 2.5rem;
  font-weight: 600;
  color: #111111;
  line-height: 1;
}

.stat-label {
  font-size: 0.72rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #8a8a8a;
}

@media (max-width: 640px) {
  .hero-v3 { padding-top: 8rem; }
  .hero-stats-v3 { flex-direction: column; gap: 1.75rem; padding-bottom: 6rem; }
  .stat-num { font-size: 2rem; }
}
```
