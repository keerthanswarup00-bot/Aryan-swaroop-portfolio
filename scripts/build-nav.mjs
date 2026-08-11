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
      <button class="search-trigger" id="searchTrigger" type="button" aria-label="Search the site" aria-haspopup="dialog" aria-expanded="false" data-search-trigger>
        <svg class="search-trigger-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
        <kbd class="search-trigger-kbd" aria-hidden="true">&#8984;K</kbd>
      </button>
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
      <a href="/work/brahmi" class="mobile-project-row">
        <div class="mobile-project-thumb"><picture>
          <source srcset="/images/brahmi-pourshot.avif" type="image/avif">
          <source srcset="/images/brahmi-pourshot.webp" type="image/webp">
          <img src="/images/brahmi-pourshot.jpg" alt="Brahmi Coffee" width="800" height="1000" loading="lazy" decoding="async">
        </picture></div>
        <div class="mobile-project-info"><span class="mobile-project-title">Brahmi Coffee</span><span class="mobile-cs-desc">Identity, Packaging &amp; Brand System</span></div>
        <span class="mobile-project-arrow">&rarr;</span>
      </a>
      <a href="/work/paavani-properties" class="mobile-project-row">
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
      <div class="social-flip" data-cur="GO" aria-label="Social links">
        <span class="sf-clip" aria-hidden="true"><span class="sf-border sf-border-top"></span><span class="sf-border sf-border-bottom"></span></span>
        <a class="sf-btn" href="https://github.com/keerthanswarup00-bot" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><span class="sf-inner"><span class="sf-face sf-front">C</span><span class="sf-face sf-back"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512" width="18" height="18" fill="currentColor"><path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.7-15.5 1.6-15.5 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.8c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2.3z"/></svg></span></span><span class="sf-tip" role="tooltip">GitHub</span></a>
        <a class="sf-btn" href="https://www.behance.net/Aryan-swaroop" target="_blank" rel="noopener noreferrer" aria-label="Behance"><span class="sf-inner"><span class="sf-face sf-front">O</span><span class="sf-face sf-back"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" width="20" height="18" fill="currentColor"><path d="M232 237.2c31.8-15.2 48.4-38.2 48.4-74 0-70.6-52.6-87.8-113.3-87.8H0v354.4h171.8c64.4 0 124.9-30.9 124.9-102.9 0-44.5-21.1-77.4-64.7-89.7zM77.9 135.9H151c28.1 0 53.4 7.9 53.4 40.5 0 30.1-19.7 42.2-47.5 42.2h-79v-82.7zm83.3 233.7H77.9V272h84.9c34.3 0 56 14.3 56 50.6 0 35.8-25.9 47-57.6 47zm358.5-240.7H376V94h143.7v34.9zM576 305.2c0-75.9-44.4-139.2-124.9-139.2-78.2 0-131.3 58.8-131.3 135.8 0 79.9 50.3 134.7 131.3 134.7 61.3 0 101-27.6 120.1-86.3H509c-6.7 21.9-34.3 33.5-55.7 33.5-41.3 0-63-24.2-63-65.3h185.1c.3-4.2.6-8.7.6-13.2zM390.4 274c2.3-33.7 24.7-54.8 58.5-54.8 35.4 0 53.2 20.8 56.2 54.8H390.4z"/></svg></span></span><span class="sf-tip" role="tooltip">Behance</span></a>
        <a class="sf-btn" href="https://www.linkedin.com/in/aryanswaroop/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><span class="sf-inner"><span class="sf-face sf-front">N</span><span class="sf-face sf-back"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="18" height="18" fill="currentColor"><path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z"/></svg></span></span><span class="sf-tip" role="tooltip">LinkedIn</span></a>
        <a class="sf-btn" href="https://www.instagram.com/arya.nswaroop/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><span class="sf-inner"><span class="sf-face sf-front">T</span><span class="sf-face sf-back"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="18" height="18" fill="currentColor"><path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"/></svg></span></span><span class="sf-tip" role="tooltip">Instagram</span></a>
        <button type="button" class="sf-btn" data-copy-email="aryanswaroop.0@gmail.com" aria-label="Copy email address"><span class="sf-inner"><span class="sf-face sf-front">C</span><span class="sf-face sf-back"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="18" height="18" fill="currentColor"><path d="M502.3 190.8c3.9-3.1 9.7-.2 9.7 4.7V400c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V195.6c0-5 5.7-7.8 9.7-4.7 22.4 17.4 52.1 39.5 154.1 113.6 21.1 15.4 56.7 47.8 92.2 47.6 35.7.3 72-32.8 92.3-47.6 102-74.1 131.6-96.3 154.1-113.7zM256 320c23.2.4 56.6-29.2 73.4-41.4 132.7-96.3 142.8-104.7 173.4-128.7 5.8-4.5 9.2-11.5 9.2-18.9 0-20.9-16.9-37.8-37.8-37.8H48C21.5 93.3 0 114.8 0 141.4c0 7.4 3.4 14.3 9.2 18.9 30.6 23.9 40.7 32.4 173.4 128.7 16.8 12.2 50.2 41.8 73.4 41.4z"/></svg></span></span><span class="sf-tip" role="tooltip">Copy email</span></button>
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
  const start = html.indexOf('<header class="site-header');
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
