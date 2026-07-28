# OpenCode Build Prompt — aryanswaroop.com (Vanilla HTML / CSS / JS)

Stack corrected: this site is **static HTML + vanilla JS**, not Next.js/React. Everything below is framework-free — plain `<script>` tags, CSS, and the Intersection Observer / sessionStorage APIs that ship in every browser. Paste the prompt into OpenCode, then use the reference code as the starting point.

If your build actually uses a bundler (Vite/Parcel) or a library already (GSAP, anime.js), say so before running this — the code below assumes none of that and will work either way, but it's not taking advantage of a library you may already have loaded.

---

## PROMPT TO PASTE

```
You are working on my static HTML/CSS/vanilla JS portfolio site (aryanswaroop.com).
Do NOT introduce React, Next.js, Vue, or any build tooling — this site is plain HTML
pages with linked CSS and JS files, no framework, no bundler unless one already
exists in the repo. Implement the four features below exactly as specced. Match my
existing design tokens (background #FAFAF8, black text/accents) wherever a new
component needs a color choice I haven't specified. Ask me before deviating from
any spec below — do not silently "improve" the design or add a framework.

Reference implementations are provided as a starting point, not a final answer —
adapt them to my actual file structure and existing pages/partials.

=====================================================================
FEATURE 1 — Sticky header with scroll progress bar
=====================================================================
- Fixed header, full width, sits above all content, backdrop-blur.
- Left side: circular avatar (44px) + name "Aryan Swaroop" on top line.
  Below it, smaller/lighter text: "Open to work" next to a small green dot
  that pulses (animated ring, not just a static dot).
- Right side: hamburger icon (two lines, no text label).
- Hamburger opens a fullscreen black overlay nav with links, in this order:
  Real Estate, Lifestyle, Builds, Tools, About Me.
- Directly below the header row: a 2px scroll-progress line, full width,
  empty/light track, filled left-to-right in black as the user scrolls
  through the ENTIRE page (0% at top, 100% at bottom of document).
- This header/nav/progress-bar markup needs to live on every page. If the
  site doesn't already have a shared include/partial system, use a small
  JS fetch-and-inject pattern or ask me how partials are currently handled
  before duplicating this markup across every HTML file by hand.

=====================================================================
FEATURE 2 — About Me page (contains Resume)
=====================================================================
Route: /about.html (or /about/, match existing URL pattern)

Section 1 (first viewport, full black background, full white text):
- Exactly 3 lines, centered, large type, filling the full screen height.
  Content: who I am / what I build / my experience summary — condensed
  from my existing About copy on the homepage.

Section 2 (scroll-revealed via Intersection Observer, white background,
black text):
- Three blocks that fade/slide in on scroll (once each, not repeating):
  1. "What I do" — current disciplines (brand, packaging, video, 3D, web builds)
  2. "What I've been doing" — recent real work (Paavani Properties, Sastry's
     by Brahmi, AlbumFlow, Selectly)
  3. "How I became multidisciplinary" — the actual narrative of why, in my
     voice, not generic "I love wearing many hats" copy

Section 3 (below the journey, same page — Resume):
- A "Resume" section rendered as REAL page content (not a screenshot/mockup) —
  Summary, Experience, Skills, Independent Product & Technical Projects,
  Selected Design Projects, Certificates, Education, Languages.
- Must be responsive: single-column stack on mobile, wider grid/columns on
  desktop, using plain CSS media queries matching the rest of the site.
- Include a "Download PDF" button at the top linking to the actual resume file.
- Use the exact content supplied in the reference HTML below — do not
  paraphrase or shorten bullet points.

=====================================================================
FEATURE 3 — Intro flash sequence (site load, once per session)
=====================================================================
- Full black screen, on top of everything, on first load only (gate with
  sessionStorage so it does NOT replay on every navigation/visit).
- Step 1: my name ("Aryan Swaroop") fades in slowly (~800ms ease-in), holds
  briefly, fades out.
- Step 2: a fast flash sequence of words, each appearing instantly and
  disappearing instantly (snap cut, no fade) as the next one snaps in —
  roughly 140ms per word:
  .Branding → .Designer → .3D Walkthrough → .Developer → .Marketing → .Motion Design
- After the last word, the overlay is removed/hidden and the site is revealed.
- Total sequence should land under ~2.2 seconds.
```

---

## REFERENCE CODE

### 1. Header + scroll progress bar

```html
<!-- partials/header.html — inject into every page, e.g. via a small include script -->
<header class="site-header" id="siteHeader">
  <div class="header-row">
    <div class="header-left">
      <img src="/images/portrait.jpg" alt="Aryan Swaroop" class="avatar" />
      <div class="header-identity">
        <span class="header-name">Aryan Swaroop</span>
        <span class="header-status">
          <span class="status-dot"><span class="status-ping"></span></span>
          Open to work
        </span>
      </div>
    </div>
    <button class="hamburger-btn" id="hamburgerBtn" aria-label="Open menu">
      <span></span>
      <span></span>
    </button>
  </div>
  <div class="scroll-track">
    <div class="scroll-fill" id="scrollFill"></div>
  </div>
</header>

<nav class="nav-overlay" id="navOverlay">
  <button class="nav-close" id="navClose" aria-label="Close menu">×</button>
  <a href="/real-estate.html">Real Estate</a>
  <a href="/lifestyle.html">Lifestyle</a>
  <a href="/builds.html">Builds</a>
  <a href="/tools.html">Tools</a>
  <a href="/about.html">About Me</a>
</nav>
```

```css
/* css/header.css */
:root {
  --bg: #FAFAF8;
  --fg: #000000;
}

.site-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 50;
  background: rgba(250, 250, 248, 0.9);
  backdrop-filter: blur(6px);
}

.header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
}

.header-left { display: flex; align-items: center; gap: 0.75rem; }

.avatar { width: 44px; height: 44px; border-radius: 50%; object-fit: cover; }

.header-identity { display: flex; flex-direction: column; line-height: 1.2; }

.header-name { font-size: 0.875rem; font-weight: 600; color: var(--fg); }

.header-status {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  color: #737373;
}

.status-dot { position: relative; display: inline-flex; width: 8px; height: 8px; }
.status-dot::after {
  content: "";
  position: absolute;
  inset: 0;
  background: #22c55e;
  border-radius: 50%;
}
.status-ping {
  position: absolute;
  inset: 0;
  background: #22c55e;
  border-radius: 50%;
  opacity: 0.75;
  animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
}
@keyframes ping {
  75%, 100% { transform: scale(2.2); opacity: 0; }
}

.hamburger-btn {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 28px;
  background: none;
  border: none;
  cursor: pointer;
}
.hamburger-btn span { height: 1.5px; width: 100%; background: #000000; }

.scroll-track { height: 2px; width: 100%; background: #e5e5e5; }
.scroll-fill { height: 100%; width: 0%; background: #000000; transition: width 0.15s linear; }

.nav-overlay {
  position: fixed;
  inset: 0;
  background: #000000;
  color: #ffffff;
  z-index: 60;
  display: none;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
}
.nav-overlay.open { display: flex; }
.nav-overlay a { color: #ffffff; font-size: 2.5rem; font-weight: 500; text-decoration: none; }
.nav-overlay a:hover { opacity: 0.6; }
.nav-close {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  font-size: 2rem;
  background: none;
  border: none;
  color: #ffffff;
  cursor: pointer;
}
```

```js
// js/header.js
document.addEventListener("DOMContentLoaded", () => {
  const scrollFill = document.getElementById("scrollFill");

  function updateScrollProgress() {
    const doc = document.documentElement;
    const scrollTop = doc.scrollTop;
    const scrollHeight = doc.scrollHeight - doc.clientHeight;
    const pct = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    scrollFill.style.width = pct + "%";
  }
  window.addEventListener("scroll", updateScrollProgress, { passive: true });
  updateScrollProgress();

  const hamburgerBtn = document.getElementById("hamburgerBtn");
  const navOverlay = document.getElementById("navOverlay");
  const navClose = document.getElementById("navClose");

  hamburgerBtn.addEventListener("click", () => navOverlay.classList.add("open"));
  navClose.addEventListener("click", () => navOverlay.classList.remove("open"));
  navOverlay.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => navOverlay.classList.remove("open"))
  );
});
```

### 2. About Me page (hero + scroll-revealed journey)

```html
<!-- about.html (body content, wrap with your existing <head>/header include) -->
<main class="about-page">
  <section class="about-hero">
    <p>
      I'm a brand designer and developer from Bengaluru.<br />
      I build identity systems that hold up in print, on screen, and in space.<br />
      Three years leading creative end-to-end, from strategy to shipped result.
    </p>
  </section>

  <section class="about-journey">
    <div class="reveal-block">
      <h3>What I do</h3>
      <p>Brand identity, packaging, video, 3D visualization, and the web builds that ship it — under one roof, for founders who need more than a logo.</p>
    </div>
    <div class="reveal-block">
      <h3>What I've been doing</h3>
      <p>Leading creative at Paavani Properties across 30+ projects. Building Sastry's by Brahmi's full packaging system. Shipping SaaS tools — AlbumFlow, Selectly — in React, Next.js, and Supabase on the side.</p>
    </div>
    <div class="reveal-block">
      <h3>How I became multidisciplinary</h3>
      <p>Every brand I worked on needed something the last designer couldn't give it — a working prototype, a rendered walkthrough, a system that survived contact with a dev handoff. I stopped waiting for someone else to build it.</p>
    </div>
  </section>

  <!-- Resume section goes here — see Feature 3 markup below -->
</main>
```

```css
/* css/about.css */
.about-page { background: #000000; color: #ffffff; }

.about-hero {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 2rem;
}
.about-hero p {
  max-width: 60rem;
  text-align: center;
  font-size: clamp(1.75rem, 5vw, 3rem);
  font-weight: 500;
  line-height: 1.3;
}

.about-journey {
  min-height: 100vh;
  background: #ffffff;
  color: #000000;
  padding: 6rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 4rem;
  max-width: 48rem;
  margin: 0 auto;
}

.reveal-block {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}
.reveal-block.visible { opacity: 1; transform: translateY(0); }

.reveal-block h3 {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: #737373;
  margin-bottom: 0.75rem;
}
.reveal-block p { font-size: clamp(1.1rem, 2vw, 1.5rem); line-height: 1.6; }
```

```js
// js/reveal-on-scroll.js
document.addEventListener("DOMContentLoaded", () => {
  const revealBlocks = document.querySelectorAll(".reveal-block");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );
  revealBlocks.forEach((block) => observer.observe(block));
});
```

### 3. Resume section (real content, responsive — no screenshots)

```html
<!-- Insert directly after .about-journey inside about.html -->
<section class="resume-section">
  <div class="resume-header">
    <h2>Aryan Swaroop</h2>
    <p class="resume-title">
      Brand Designer & Creative Lead — Branding, Video & 3D Visualization · Front-End Development (React, Next.js, Supabase)
    </p>
    <div class="resume-contact">
      <span>Bengaluru, India</span>
      <a href="mailto:aryanswaroop.0@gmail.com">aryanswaroop.0@gmail.com</a>
      <a href="https://linkedin.com/in/aryanswaroop" target="_blank">LinkedIn</a>
      <a href="https://behance.net/Aryan-swaroop" target="_blank">Behance</a>
    </div>
    <a href="/Aryan_Swaroop_Resume.pdf" download class="resume-download-btn">Download PDF</a>
  </div>

  <div class="resume-block">
    <h3>Summary</h3>
    <p class="resume-summary">
      Brand Designer and Creative Lead with 3+ years leading end-to-end creative —
      brand identity, packaging, video, 3D visualization, and digital campaigns —
      across real estate, F&amp;B, and consumer brands. Built and ran a Meta Ads +
      creative system for Paavani Properties that generated 302 leads in 66 days
      at ₹82 per lead. Builds functional web products in React, Next.js, and
      Supabase — a rare combination of brand thinking and shipping code.
    </p>
  </div>

  <div class="resume-block">
    <h3>Experience</h3>

    <div class="resume-job">
      <div class="resume-job-meta">
        <p class="resume-role">Creative Lead</p>
        <p class="resume-company">Paavani Properties and Marketing</p>
        <p class="resume-dates">2024 – April 2026</p>
      </div>
      <ul class="resume-bullets">
        <li>Led creative execution across 30+ real estate projects — brand identity, print, digital, video, and 3D.</li>
        <li>Produced 50+ marketing videos and a full suite of 3D renders and walkthroughs to improve buyer clarity.</li>
        <li>Built and ran a Meta Ads + creative system generating 302 leads in 66 days at ₹82 per lead.</li>
        <li>Drove 3× brand visibility and ~25% lead growth through consistent identity systems across projects.</li>
      </ul>
    </div>

    <div class="resume-job">
      <div class="resume-job-meta">
        <p class="resume-role">Branding Designer</p>
        <p class="resume-company">Destiny</p>
        <p class="resume-dates">2023 – 2024</p>
      </div>
      <ul class="resume-bullets">
        <li>Built brand identities for 10+ client brands across categories.</li>
        <li>Delivered 100+ digital creatives and 15+ promotional videos under multi-client, tight-timeline delivery.</li>
        <li>Improved brand consistency across clients through visual audits and reusable design systems.</li>
      </ul>
    </div>

    <div class="resume-job">
      <div class="resume-job-meta">
        <p class="resume-role">Graphic Designer & Video Editor</p>
        <p class="resume-company">Director In</p>
        <p class="resume-dates">2022 – 2023</p>
      </div>
      <ul class="resume-bullets">
        <li>Shot and edited founder interviews and podcasts; restructured long-form content for short-form platforms.</li>
        <li>Maintained a consistent, trust-led visual tone across all founder-facing content.</li>
      </ul>
    </div>
  </div>

  <div class="resume-block">
    <h3>Skills</h3>
    <div class="resume-skills-grid">
      <div>
        <p class="resume-skill-category">Brand & Visual Design</p>
        <p class="resume-skill-list">Brand Identity Systems · Visual Communication · Typography & Layout · Packaging · Brand Guidelines</p>
      </div>
      <div>
        <p class="resume-skill-category">Video, Motion & 3D</p>
        <p class="resume-skill-list">Video Editing (Reels, Walkthroughs, Brand Films) · Motion Graphics · 3D Visualization (SketchUp, Lumion, TwinMotion, D5 Render) · Drone Video Coordination</p>
      </div>
      <div>
        <p class="resume-skill-category">Digital & Technical</p>
        <p class="resume-skill-list">React · Next.js · Supabase · Figma · Wix Studio · AI-Assisted Design Workflows</p>
      </div>
      <div>
        <p class="resume-skill-category">Marketing</p>
        <p class="resume-skill-list">Campaign & Performance Creatives · Social Media Strategy · Meta Ads Creative · Lead Generation Systems</p>
      </div>
      <div>
        <p class="resume-skill-category">Tools</p>
        <p class="resume-skill-list">Photoshop · Illustrator · InDesign · Premiere Pro · After Effects</p>
      </div>
    </div>
  </div>

  <div class="resume-block">
    <h3>Independent Product & Technical Projects</h3>
    <div class="resume-project-list">
      <div><p class="resume-project-name">VR Devaiah Enclave Plot Finder</p><p class="resume-project-desc">Interactive plot-finder web app for a 50-plot residential launch; live availability by size/type, admin dashboard, Supabase backend.</p></div>
      <div><p class="resume-project-name">Selectly</p><p class="resume-project-desc">Wedding photography SaaS platform built in Next.js and Supabase; client galleries, image-selection workflow, admin dashboard.</p></div>
      <div><p class="resume-project-name">AlbumFlow</p><p class="resume-project-desc">Photographer SaaS platform in Next.js and Supabase; resolved a production-critical RLS security issue and built core storage/API architecture.</p></div>
      <div><p class="resume-project-name">Striv</p><p class="resume-project-desc">Fitness progress-tracking PWA built in React with real training and body-composition data models.</p></div>
      <div><p class="resume-project-name">Foundations</p><p class="resume-project-desc">Interactive workout guide eBook built as a structured web app in Next.js; science-based nutrition, training, and recovery content.</p></div>
    </div>
  </div>

  <div class="resume-block">
    <h3>Selected Design Projects</h3>
    <div class="resume-project-list">
      <div><p class="resume-project-name">Paavani Properties</p><p class="resume-project-desc">End-to-end brand system: identity, brochures, site creatives, reels, 3D renders and walkthrough videos across multiple developments.</p></div>
      <div><p class="resume-project-name">Sidvin Serenity</p><p class="resume-project-desc">Go-to-market print and campaign system: outdoor signage, sales brochure, standee, and subway billboard placement.</p></div>
      <div><p class="resume-project-name">Royal Farm</p><p class="resume-project-desc">Mascot-led brand identity built for working professionals seeking a lifestyle shift; displaced an incumbent agency's existing brand direction.</p></div>
      <div><p class="resume-project-name">Sastry's by Brahmi</p><p class="resume-project-desc">Complete brand identity and packaging system: logo, color, typography, and a scalable packaging line with premium South-Indian positioning.</p></div>
      <div><p class="resume-project-name">Isha V</p><p class="resume-project-desc">Security & Facility Management brand system: identity, uniforms and vehicle branding, service collateral, and website, applied across guards, crews, and digital.</p></div>
    </div>
  </div>

  <div class="resume-footer-grid">
    <div>
      <h3>Certificates</h3>
      <p>Graphic Design & Visual Communication — Lumos<br />Digital Marketing — New Horizon College</p>
    </div>
    <div>
      <h3>Education</h3>
      <p>BBA, New Horizon College, Bengaluru<br />Finance, Business Analytics & Corporate Operations — Digital Marketing specialisation · 2021–2024</p>
    </div>
    <div>
      <h3>Languages</h3>
      <p>English · Kannada · Hindi · Telugu</p>
    </div>
  </div>
</section>
```

```css
/* css/resume.css */
.resume-section {
  background: #ffffff;
  color: #000000;
  padding: 6rem 1.5rem;
  max-width: 64rem;
  margin: 0 auto;
}

.resume-header { border-bottom: 1px solid #e5e5e5; padding-bottom: 2rem; margin-bottom: 4rem; }
.resume-header h2 { font-size: clamp(1.75rem, 4vw, 3rem); font-weight: 600; margin-bottom: 0.5rem; }
.resume-title { color: #525252; font-size: clamp(0.95rem, 1.5vw, 1.15rem); margin-bottom: 1rem; }
.resume-contact { display: flex; flex-wrap: wrap; gap: 1rem; font-size: 0.875rem; color: #737373; }
.resume-contact a { color: #737373; text-decoration: underline; }
.resume-download-btn {
  display: inline-block;
  margin-top: 1.5rem;
  border: 1px solid #000000;
  padding: 0.65rem 1.25rem;
  border-radius: 999px;
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
  color: #000000;
  transition: background 0.2s, color 0.2s;
}
.resume-download-btn:hover { background: #000000; color: #ffffff; }

.resume-block { margin-bottom: 4rem; }
.resume-block h3 {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: #737373;
  margin-bottom: 1.5rem;
}

.resume-job { display: grid; gap: 0.5rem; margin-bottom: 2.5rem; }
.resume-role { font-weight: 600; font-size: 1rem; }
.resume-company { color: #737373; font-size: 0.9rem; }
.resume-dates { color: #a3a3a3; font-size: 0.8rem; margin-top: 0.25rem; }
.resume-bullets { list-style: disc; padding-left: 1.1rem; display: flex; flex-direction: column; gap: 0.4rem; font-size: 0.95rem; color: #404040; }

.resume-skills-grid { display: grid; grid-template-columns: 1fr; gap: 1.5rem; }
.resume-skill-category { font-weight: 600; font-size: 0.9rem; margin-bottom: 0.35rem; }
.resume-skill-list { color: #525252; font-size: 0.9rem; line-height: 1.5; }

.resume-project-list { display: flex; flex-direction: column; gap: 1.25rem; }
.resume-project-name { font-weight: 600; font-size: 0.95rem; }
.resume-project-desc { color: #525252; font-size: 0.95rem; line-height: 1.5; }

.resume-footer-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e5e5e5;
}
.resume-footer-grid h3 {
  font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.15em;
  color: #737373; margin-bottom: 0.75rem;
}
.resume-footer-grid p { font-size: 0.9rem; color: #404040; line-height: 1.5; }

@media (min-width: 768px) {
  .resume-job { grid-template-columns: 200px 1fr; gap: 2rem; }
  .resume-skills-grid { grid-template-columns: 1fr 1fr; column-gap: 2.5rem; }
  .resume-footer-grid { grid-template-columns: 1fr 1fr 1fr; }
}
```

### 4. Intro flash sequence

```html
<!-- Place right after <body> opens, before header include -->
<div class="intro-overlay" id="introOverlay">
  <span class="intro-text" id="introText"></span>
</div>
```

```css
/* css/intro.css */
.intro-overlay {
  position: fixed;
  inset: 0;
  background: #000000;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
}
.intro-overlay.hidden { display: none; }

.intro-text {
  color: #ffffff;
  font-size: clamp(2rem, 6vw, 3rem);
  font-weight: 600;
  opacity: 0;
}
.intro-text.fade-in { opacity: 1; transition: opacity 0.8s ease-in-out; }
.intro-text.fade-out { opacity: 0; transition: opacity 0.8s ease-in-out; }
.intro-text.snap { opacity: 1; transition: none; font-weight: 500; }
```

```js
// js/intro.js
(function () {
  document.addEventListener("DOMContentLoaded", () => {
    const overlay = document.getElementById("introOverlay");
    const textEl = document.getElementById("introText");

    if (sessionStorage.getItem("introSeen")) {
      overlay.classList.add("hidden");
      return;
    }

    const FLASH_WORDS = ["Branding", "Designer", "3D Walkthrough", "Developer", "Video Editor", "Content Creator"];
    const FLASH_INTERVAL = 140; // ms per word

    textEl.textContent = "Aryan Swaroop";
    textEl.className = "intro-text";
    requestAnimationFrame(() => textEl.classList.add("fade-in"));

    setTimeout(() => {
      textEl.classList.remove("fade-in");
      textEl.classList.add("fade-out");
    }, 900);

    setTimeout(runFlashSequence, 1400);

    function runFlashSequence() {
      let i = 0;
      function showNext() {
        if (i >= FLASH_WORDS.length) {
          overlay.classList.add("hidden");
          sessionStorage.setItem("introSeen", "true");
          return;
        }
        textEl.textContent = FLASH_WORDS[i];
        textEl.className = "intro-text snap";
        i++;
        setTimeout(showNext, FLASH_INTERVAL);
      }
      showNext();
    }
  });
})();
```

---

## Before you run this

1. Confirm the two placeholder intro words — "Video Editor" / "Content Creator" — or swap them.
2. Fix the "Selixo" vs "Selectly" naming mismatch in your resume PDF before this goes live — flagged last round, still unresolved. Both this HTML resume and your PDF need to say the same thing.
3. Tell OpenCode plainly how your site currently shares markup across pages (separate HTML files with duplicated header, a build step, server-side includes, etc.) — the header/nav in Feature 1 needs to appear on every page, and "just copy-paste this into every file" is a maintenance trap you'll regret the next time you edit the nav.
4. Ship in this order: header/progress bar → about page → resume section → intro sequence last.
