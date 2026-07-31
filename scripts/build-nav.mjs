// Single source of truth for the site header + mobile menu.
// After adding/editing a page, regenerate the nav on every page with:
//   node scripts/build-nav.mjs   (or: npm run build:nav)
// HEADER_HTML / MOBILE_MENU_HTML must stay byte-identical across all pages;
// keep asset paths root-absolute (/images/...) so they work on every page.
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

export const HEADER_HTML = `<header class="site-header" aria-label="Site">
  <div class="header-row">
    <a href="/" class="header-left">
      <picture>
        <source srcset="/images/nav-avatar-400.avif 400w, /images/nav-avatar-800.avif 800w" sizes="44px" type="image/avif">
        <source srcset="/images/nav-avatar-400.webp 400w, /images/nav-avatar-800.webp 800w" sizes="44px" type="image/webp">
        <img src="/images/nav-avatar.png" alt="Aryan Swaroop" class="header-avatar" width="44" height="44" loading="lazy" decoding="async">
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
          <source srcset="/images/nav-avatar-400.avif 400w, /images/nav-avatar-800.avif 800w" sizes="56px" type="image/avif">
          <source srcset="/images/nav-avatar-400.webp 400w, /images/nav-avatar-800.webp 800w" sizes="56px" type="image/webp">
          <img src="/images/nav-avatar.png" alt="Aryan Swaroop" class="mobile-avatar" width="56" height="56" loading="lazy" decoding="async">
        </picture>
        <div class="mobile-identity">
          <span class="mobile-name">Aryan Swaroop</span>
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
      <h4 class="mobile-section-heading">Featured Work</h4>
      <a href="/real-estate" class="mobile-project-row">
        <div class="mobile-project-thumb"><picture>
          <source srcset="/images/mega-re-2.avif" type="image/avif">
          <source srcset="/images/mega-re-2.webp" type="image/webp">
          <img src="/images/mega-re-2.png" alt="Real estate brand identity thumbnail" width="800" height="800" loading="lazy" decoding="async">
        </picture></div>
        <div class="mobile-project-info"><span class="mobile-project-title">Real Estate</span><span class="mobile-project-sub">5 min</span></div>
        <span class="mobile-project-arrow">&rarr;</span>
      </a>
      <a href="/lifestyle" class="mobile-project-row">
        <div class="mobile-project-thumb"><picture>
          <source srcset="/images/mega-lifestyle-2.avif" type="image/avif">
          <source srcset="/images/mega-lifestyle-2.webp" type="image/webp">
          <img src="/images/mega-lifestyle-2.png" alt="Lifestyle brand identity thumbnail" width="800" height="800" loading="lazy" decoding="async">
        </picture></div>
        <div class="mobile-project-info"><span class="mobile-project-title">Lifestyle</span><span class="mobile-project-sub">5 min</span></div>
        <span class="mobile-project-arrow">&rarr;</span>
      </a>
      <a href="/builds" class="mobile-project-row">
        <div class="mobile-project-thumb"><picture>
          <source srcset="/images/mega-builds-2.avif" type="image/avif">
          <source srcset="/images/mega-builds-2.webp" type="image/webp">
          <img src="/images/mega-builds-2.png" alt="Web product builds thumbnail" width="800" height="800" loading="lazy" decoding="async">
        </picture></div>
        <div class="mobile-project-info"><span class="mobile-project-title">Builds</span><span class="mobile-project-sub">2 min</span></div>
        <span class="mobile-project-arrow">&rarr;</span>
      </a>
    </div>
    <div class="mobile-section">
      <h4 class="mobile-section-heading">Other</h4>
      <a href="/playground" class="mobile-explore-link">Playground <span>&rarr;</span></a>
      <a href="/Aryan_Swaroop_Resume.pdf" download class="mobile-explore-link">Resume <span>&nearr;</span></a>
      <a href="/tools" class="mobile-explore-link">Tools <span>&rarr;</span></a>
    </div>
    <div class="mobile-footer">
      <p>Designed &amp; Developed<br>by Aryan Swaroop<br>&copy; 2026</p>
    </div>
  </div>
</div>`;

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

function build(file) {
  const path = join(ROOT, file);
  let html = readFileSync(path, 'utf8');
  html = replaceHeader(html);
  html = replaceMobileMenu(html);
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
