# OpenCode Build Prompt — Playground Page Only

Standalone prompt. Paste into OpenCode on its own — this doesn't depend on the other features from the main build prompt. Stack: static HTML/CSS/vanilla JS, matching the rest of aryanswaroop.com.

---

## PROMPT TO PASTE

```
Build a new page on my static HTML/CSS/vanilla JS portfolio site (aryanswaroop.com)
called Playground, at /playground.html. Do NOT introduce React, Next.js, or any
build tooling. Match my existing design tokens (background #FAFAF8 on other pages,
but this page uses a black background like my About page hero — #000000 bg,
#ffffff text). Use the shared header/nav partial that already exists on every
other page of the site.

LAYOUT — match this reference exactly:
- Page title "Playground" centered, large, below the header.
- One-line subtitle beneath it.
- Below that: a media grid, THREE EQUAL COLUMNS on desktop, laid out in clean
  rows (not a staggered Pinterest masonry — every item in the same row must
  be the same height, like a uniform photo grid, not variable-height columns).
- Grid must responsively drop to 2 columns on tablet and 1 column on mobile.
- Each grid cell must support three media types interchangeably: static images,
  GIFs, and short muted video clips (auto-looping, behaving like a GIF).
- Clicking any cell opens a fullscreen lightbox showing the media larger. If
  the item is a video, the lightbox version should have visible controls and
  unmuted audio (the grid thumbnail stays muted/silent). Close on background
  click, close button, or Escape key.
- Videos in the grid should only play while scrolled into view, to avoid
  loading/decoding every video at once on page load.

Do not deviate from this layout — no masonry, no scroll-jacking, no page
transitions beyond what's specified. Ask before adding anything not described
here.
```

---

## REFERENCE CODE

### HTML

```html
<!-- playground.html (body content — wrap with existing shared header/nav) -->
<main class="playground-page">
  <section class="playground-hero">
    <h1>Playground</h1>
    <p>Motion, renders, and behind-the-scenes work that doesn't fit a case study.</p>
  </section>

  <section class="playground-grid" id="playgroundGrid">

    <!-- IMAGE item -->
    <button class="pg-item" data-type="image" data-src="/media/playground/snehaloka-render.jpg">
      <img src="/media/playground/snehaloka-render.jpg" alt="[Describe this piece]" loading="lazy" />
    </button>

    <!-- GIF-BEHAVIOR item (recommend .mp4 instead of raw .gif for file size — see notes) -->
    <button class="pg-item" data-type="video" data-src="/media/playground/brahmi-motion.mp4">
      <video src="/media/playground/brahmi-motion.mp4" muted loop playsinline></video>
    </button>

    <!-- SHORT VIDEO CLIP item -->
    <button class="pg-item" data-type="video" data-src="/media/playground/paavani-walkthrough.mp4">
      <video src="/media/playground/paavani-walkthrough.mp4" muted loop playsinline></video>
    </button>

    <!-- Repeat for every real piece — 5+ minimum so the grid doesn't look sparse.
         Keep items in multiples of 3 if possible so the last row stays full. -->

  </section>

  <!-- Lightbox — one shared instance, filled dynamically by JS -->
  <div class="pg-lightbox" id="pgLightbox">
    <button class="pg-lightbox-close" id="pgLightboxClose" aria-label="Close">×</button>
    <div class="pg-lightbox-content" id="pgLightboxContent"></div>
  </div>
</main>
```

### CSS

```css
/* css/playground.css */
.playground-page { background: #000000; color: #ffffff; padding-bottom: 6rem; }

.playground-hero { padding: 8rem 2rem 4rem; text-align: center; }
.playground-hero h1 { font-size: clamp(2.5rem, 6vw, 4rem); font-weight: 700; margin-bottom: 0.75rem; }
.playground-hero p { color: #a3a3a3; font-size: 1.1rem; }

/* Uniform 3-across grid — every item in a row shares the same height */
.playground-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  padding: 0 1.5rem;
}
@media (min-width: 640px) {
  .playground-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (min-width: 1024px) {
  .playground-grid { grid-template-columns: repeat(3, 1fr); }
}

.pg-item {
  position: relative;
  display: block;
  width: 100%;
  aspect-ratio: 4 / 5;
  border: none;
  padding: 0;
  border-radius: 12px;
  overflow: hidden;
  background: #111111;
  cursor: pointer;
}
.pg-item img,
.pg-item video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.4s ease;
}
.pg-item:hover img,
.pg-item:hover video { transform: scale(1.04); }

/* Lightbox */
.pg-lightbox {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.92);
  z-index: 200;
  display: none;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}
.pg-lightbox.open { display: flex; }

.pg-lightbox-content { max-width: 90vw; max-height: 85vh; }
.pg-lightbox-content img,
.pg-lightbox-content video {
  max-width: 90vw;
  max-height: 85vh;
  border-radius: 8px;
  display: block;
}

.pg-lightbox-close {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background: none;
  border: none;
  color: #ffffff;
  font-size: 2.25rem;
  cursor: pointer;
  line-height: 1;
}
```

### JS

```js
// js/playground.js
document.addEventListener("DOMContentLoaded", () => {
  const items = document.querySelectorAll(".pg-item");
  const lightbox = document.getElementById("pgLightbox");
  const lightboxContent = document.getElementById("pgLightboxContent");
  const closeBtn = document.getElementById("pgLightboxClose");

  // Only play grid videos while they're actually visible on screen
  const videos = document.querySelectorAll(".pg-item video");
  const visibilityObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const video = entry.target;
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      });
    },
    { threshold: 0.25 }
  );
  videos.forEach((v) => visibilityObserver.observe(v));

  // Open lightbox on click
  items.forEach((item) => {
    item.addEventListener("click", () => {
      const type = item.dataset.type;
      const src = item.dataset.src;

      lightboxContent.innerHTML = "";

      if (type === "video") {
        const video = document.createElement("video");
        video.src = src;
        video.controls = true;
        video.autoplay = true;
        video.loop = true;
        // Unmuted in the lightbox — grid thumbnails stay muted, this is the
        // "click to actually hear it" moment.
        video.muted = false;
        lightboxContent.appendChild(video);
      } else {
        const img = document.createElement("img");
        img.src = src;
        img.alt = item.querySelector("img")?.alt || "";
        lightboxContent.appendChild(img);
      }

      lightbox.classList.add("open");
    });
  });

  function closeLightbox() {
    lightbox.classList.remove("open");
    lightboxContent.innerHTML = ""; // stops video playback/audio immediately
  }

  closeBtn.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox.classList.contains("open")) closeLightbox();
  });
});
```

---

## Notes before you run this

1. **Convert real `.gif` files to `.mp4`.** Same looping visual, far smaller file size, and it can be paused offscreen (the IntersectionObserver above) — a raw `.gif` can't be paused and will keep decoding even when scrolled past. If you genuinely only have `.gif` files, `<img src="x.gif">` still works in a `.pg-item`, just skip the `data-type="video"` handling for that one.
2. **Aspect ratio is fixed at 4:5** so every row stays uniform regardless of each media file's real dimensions — `object-fit: cover` will crop to fit. If a specific piece looks bad cropped that way, that's a sign to pick a different crop/export from the source, not to break the grid's consistency for one item.
3. **Keep grid items in multiples of 3** where you can, so the last row isn't a lonely single item stranded under two empty columns.
4. Same rule as before: 5+ real pieces minimum before this ships, or it reads as empty rather than intentional.
