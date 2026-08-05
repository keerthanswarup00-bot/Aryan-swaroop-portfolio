// Single source of truth for the site header + mobile menu.
// After adding/editing a page, regenerate the nav on every page with:
//   node scripts/build-nav.mjs   (or: npm run build:nav)
// HEADER_HTML / MOBILE_MENU_HTML must stay byte-identical across all pages;
// keep asset paths root-absolute (/images/...) so they work on every page.
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

export const HEADER_HTML = `<header class="site-header theme-dark" aria-label="Site">
  <div class="header-row">
    <a href="/" class="header-left">
      <picture>
        <source srcset="/images/nav-avatar-400.avif 400w, /images/nav-avatar-800.avif 800w" sizes="52px" type="image/avif">
        <source srcset="/images/nav-avatar-400.webp 400w, /images/nav-avatar-800.webp 800w" sizes="52px" type="image/webp">
        <img src="/images/nav-avatar.png" alt="Aryan Swaroop" class="header-avatar" width="52" height="52" loading="lazy" decoding="async">
      </picture>
      <div class="header-identity">
        <span class="header-name">Aryan Swaroop</span>
        <span class="header-status"><span class="status-ping"></span>Open to work</span>
      </div>
    </a>
    <nav class="navlinks" aria-label="Primary">
      <a href="/">Home</a>
      <div class="nav-dropdown" id="designDropdown">
        <button class="nav-dropdown-trigger" aria-expanded="false" aria-haspopup="true">Design <span class="dropdown-arrow">&#9662;</span></button>
      </div>
      <a href="/about">About</a>
    </nav>
    <div class="header-right">
      <a href="/Aryan_Swaroop_Resume.pdf" download class="resume-btn">Resume</a>
      <button class="hamburger" id="hamburger" aria-label="Menu" aria-expanded="false" aria-controls="mobileMenu"><span></span><span></span></button>
    </div>
  </div>
  <div class="scroll-track"><div class="scroll-bar" id="scrollBar"></div></div>
</header>`;

export const MOBILE_MENU_HTML = `<div class="mobile-menu" id="mobileMenu" aria-hidden="true">
  <div class="mobile-menu-inner">
    <div class="mobile-top">
      <a href="/" class="mobile-profile">
        <picture>
          <source srcset="/images/nav-avatar-400.avif 400w, /images/nav-avatar-800.avif 800w" sizes="72px" type="image/avif">
          <source srcset="/images/nav-avatar-400.webp 400w, /images/nav-avatar-800.webp 800w" sizes="72px" type="image/webp">
          <img src="/images/nav-avatar.png" alt="Aryan Swaroop" class="mobile-avatar" width="72" height="72" loading="lazy" decoding="async">
        </picture>
        <div class="mobile-identity">
          <span class="mobile-name">Aryan</span>
          <span class="mobile-status"><span class="status-ping"></span>Open to work</span>
        </div>
      </a>
      <button class="mobile-close" id="mobileClose" aria-label="Close menu">&times;</button>
    </div>
    <nav class="mobile-nav">
      <a href="/" class="mobile-nav-link">Home</a>
      <a href="/about" class="mobile-nav-link">About</a>
    </nav>
    <div class="mobile-section">
      <h4 class="mobile-section-heading">Case Studies</h4>
      <a href="/work/brahmi.html" class="mobile-project-row">
        <div class="mobile-project-thumb"><picture>
          <source srcset="/images/brahmi-pourshot.avif" type="image/avif">
          <source srcset="/images/brahmi-pourshot.webp" type="image/webp">
          <img src="/images/brahmi-pourshot.jpg" alt="Brahmi Coffee" width="800" height="1000" loading="lazy" decoding="async">
        </picture></div>
        <div class="mobile-project-info"><span class="mobile-project-title">Brahmi Coffee</span><span class="mobile-cs-desc">Identity, Packaging &amp; Brand System</span></div>
        <span class="mobile-project-arrow">&rarr;</span>
      </a>
      <a href="/work/paavani-properties.html" class="mobile-project-row">
        <div class="mobile-project-thumb"><picture>
          <source srcset="/images/hero-paavani-main.avif" type="image/avif">
          <source srcset="/images/hero-paavani-main.webp" type="image/webp">
          <img src="/images/hero-paavani-main.jpg" alt="Paavani Properties" width="800" height="450" loading="lazy" decoding="async">
        </picture></div>
        <div class="mobile-project-info"><span class="mobile-project-title">Paavani Properties</span><span class="mobile-cs-desc">Real Estate Branding &amp; Marketing</span></div>
        <span class="mobile-project-arrow">&rarr;</span>
      </a>
    </div>
    <div class="mobile-section">
      <h4 class="mobile-section-heading">Featured</h4>
      <a href="/real-estate" class="mobile-project-row">
        <div class="mobile-project-thumb"><picture>
          <source srcset="/images/mega-re-2.avif" type="image/avif">
          <source srcset="/images/mega-re-2.webp" type="image/webp">
          <img src="/images/mega-re-2.png" alt="Real Estate" width="800" height="800" loading="lazy" decoding="async">
        </picture></div>
        <div class="mobile-project-info"><span class="mobile-project-title">Real Estate</span><span class="mobile-cs-desc">Campaigns, branding &amp; art direction</span></div>
        <span class="mobile-project-arrow">&rarr;</span>
      </a>
      <a href="/lifestyle" class="mobile-project-row">
        <div class="mobile-project-thumb"><picture>
          <source srcset="/images/mega-lifestyle-2.avif" type="image/avif">
          <source srcset="/images/mega-lifestyle-2.webp" type="image/webp">
          <img src="/images/mega-lifestyle-2.png" alt="Lifestyle" width="800" height="800" loading="lazy" decoding="async">
        </picture></div>
        <div class="mobile-project-info"><span class="mobile-project-title">Lifestyle</span><span class="mobile-cs-desc">Identity, packaging &amp; campaign work</span></div>
        <span class="mobile-project-arrow">&rarr;</span>
      </a>
      <a href="/builds" class="mobile-project-row">
        <div class="mobile-project-thumb"><picture>
          <source srcset="/images/mega-builds-2.avif" type="image/avif">
          <source srcset="/images/mega-builds-2.webp" type="image/webp">
          <img src="/images/mega-builds-2.png" alt="Build" width="800" height="800" loading="lazy" decoding="async">
        </picture></div>
        <div class="mobile-project-info"><span class="mobile-project-title">Build</span><span class="mobile-cs-desc">Web design, products &amp; experiments</span></div>
        <span class="mobile-project-arrow">&rarr;</span>
      </a>
    </div>
    <div class="mobile-section">
      <h4 class="mobile-section-heading">Other</h4>
      <a href="/tools" class="mobile-project-row">
        <div class="mobile-project-thumb"><picture>
          <source srcset="/images/build-imageoptimizer.avif" type="image/avif">
          <source srcset="/images/build-imageoptimizer.webp" type="image/webp">
          <img src="/images/build-imageoptimizer.jpg" alt="Tools" width="1200" height="675" loading="lazy" decoding="async">
        </picture></div>
        <div class="mobile-project-info"><span class="mobile-project-title">Tools</span><span class="mobile-cs-desc">Design systems &amp; utilities</span></div>
        <span class="mobile-project-arrow">&rarr;</span>
      </a>
      <a href="/Aryan_Swaroop_Resume.pdf" download class="mobile-project-row">
        <div class="mobile-project-thumb"><picture>
          <source srcset="/images/portrait.avif" type="image/avif">
          <source srcset="/images/portrait.webp" type="image/webp">
          <img src="/images/portrait.jpg" alt="Resume" width="600" height="800" loading="lazy" decoding="async">
        </picture></div>
        <div class="mobile-project-info"><span class="mobile-project-title">Resume</span><span class="mobile-cs-desc">Experience &amp; achievements</span></div>
        <span class="mobile-project-arrow">&rarr;</span>
      </a>
      <a href="/playground" class="mobile-project-row">
        <div class="mobile-project-thumb"><picture>
          <source srcset="/images/playground-preview.avif" type="image/avif">
          <source srcset="/images/playground-preview.webp" type="image/webp">
          <img src="/images/playground-preview.png" alt="Playground" width="600" height="251" loading="lazy" decoding="async">
        </picture></div>
        <div class="mobile-project-info"><span class="mobile-project-title">Playground</span><span class="mobile-cs-desc">Motion, renders &amp; experiments</span></div>
        <span class="mobile-project-arrow">&rarr;</span>
      </a>
    </div>
    <div class="mobile-footer">
      <p>Designed &amp; Developed<br>by Aryan Swaroop<br>&copy; 2026</p>
    </div>
  </div>
</div>`;

export const FOOTER_HTML = `<footer id="contact" class="theme-dark">
  <div class="wrap">
    <div class="kicker">Get in touch</div>
    <h2>Let's talk<br><em style="font-style:italic;">about the role.</em></h2>
    <div class="contact-row">
      <a class="btn btn-solid" href="mailto:aryanswaroop.0@gmail.com" data-cur="SEND">Email Me</a>
      <a class="btn btn-ghost" href="/Aryan_Swaroop_Resume.pdf" download data-cur="GET">Resume</a>
    </div>
    <button class="copy-email" data-email="aryanswaroop.0@gmail.com" data-cur="COPY">
      aryanswaroop.0@gmail.com <span class="copy-icon">&#x29C9;</span>
    </button>
    <p class="currently-line">Currently: open to Creative Lead roles in Bengaluru.</p>
    <div class="foot-bottom">
      <span>&copy; Aryan Swaroop, Bengaluru</span>
      <div style="display:flex; gap:22px;">
        <a href="https://linkedin.com/in/aryanswaroop" target="_blank" rel="noopener noreferrer" data-cur="GO">LinkedIn</a>
        <a href="https://behance.net/Aryan-swaroop" target="_blank" rel="noopener noreferrer" data-cur="GO">Behance</a>
      </div>
    </div>
  </div>
</footer>`;

export const TARGETS = [
  'index.html',
  'about.html',
  'real-estate.html',
  'lifestyle.html',
  'builds.html',
  'playground.html',
  'tools.html',
  '404.html',
  'changelog.html',
  'work/paavani-properties.html',
  'work/brahmi.html',
];

function findEndIndex(html, startIndex, tagName) {
  const re = new RegExp(`</?${tagName}[^>]*>`, 'gi');
  re.lastIndex = startIndex;
  let depth = 0;
  let match;
  while ((match = re.exec(html)) !== null) {
    if (match[0].charAt(1) === '/') {
      depth -= 1;
    } else {
      depth += 1;
    }
    if (depth === 0) return re.lastIndex;
  }
  throw new Error(`Unmatched <${tagName}> starting at index ${startIndex}`);
}

function replaceHeader(html) {
  const start = html.indexOf('<header class="site-header"');
  if (start === -1) throw new Error('Header start not found');
  const end = html.indexOf('</header>', start);
  if (end === -1) throw new Error('Header end not found');
  return html.slice(0, start) + HEADER_HTML + html.slice(end + '</header>'.length);
}

function replaceMobileMenu(html) {
  const start = html.indexOf('<div class="mobile-menu" id="mobileMenu"');
  if (start === -1) throw new Error('Mobile menu start not found');
  const end = findEndIndex(html, start, 'div');
  return html.slice(0, start) + MOBILE_MENU_HTML + html.slice(end);
}

function replaceFooter(html) {
  const start = html.indexOf('<footer');
  if (start === -1) throw new Error('Footer start not found');
  const end = html.indexOf('</footer>', start);
  if (end === -1) throw new Error('Footer end not found');
  return html.slice(0, start) + FOOTER_HTML + html.slice(end + '</footer>'.length);
}

function removeGameFootBottom(html) {
  const gsStart = html.indexOf('<div class="game-section">');
  if (gsStart === -1) return html;
  const gsEnd = findEndIndex(html, gsStart, 'div');
  const gs = html.slice(gsStart, gsEnd);
  const fbStart = gs.indexOf('<div class="foot-bottom">');
  if (fbStart === -1) return html;
  const fbEnd = findEndIndex(gs, fbStart, 'div');
  return html.slice(0, gsStart + fbStart) + html.slice(gsStart + fbEnd);
}

function build(file) {
  const path = join(ROOT, file);
  let html = readFileSync(path, 'utf8');
  html = replaceHeader(html);
  html = replaceMobileMenu(html);
  html = replaceFooter(html);
  html = removeGameFootBottom(html);
  writeFileSync(path, html);
  return { file, chars: html.length };
}

let all = '';
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  for (const file of TARGETS) {
    const result = build(file);
    all += `\u2713 ${result.file} (${result.chars} chars)\n`;
  }
  console.log(all.trim());
}
