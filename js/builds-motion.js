/* Builds — cinematic Apple-style MacBook hero (scroll-open lid + screenshot
   slideshow), Aceternity-style 3D pin cards (CSS-only hover tilt + badge +
   beam + rings; no cursor tracking), scroll reveal. Vanilla ES5-style for
   consistency with the rest of the site. Animates only transform/opacity;
   honours prefers-reduced-motion. */
(function () {
  "use strict";

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!reduce) {
    document.documentElement.classList.add("builds-anim");
  }

  /* ============================================================
     CONFIG — single source of truth for the six build cards.
     Edit name / sub / href / chips / img here.
     - hrefs starting with "/" open in the same tab; full URLs open
       in a new tab (target="_blank" + rel="noopener noreferrer").
     - img = filename base inside /images; the file must ship the
       -400 / -800 AVIF+WebP+JPG variants. When the source image is
       >= 1600px wide, -1600 variants are expected and used.
     ============================================================ */
  var BUILDS = [
    { name: "IronLog", sub: "AI Workout Platform", href: "/builds/ironlog", chips: ["React", "Supabase", "AI"], img: "build-striv", alt: "IronLog — AI workout platform", w: 2880, h: 1612 },
    { name: "AlbumFlow", sub: "Photographer SaaS", href: "/builds/albumflow", chips: ["Next.js", "Supabase"], img: "build-albumflow", alt: "AlbumFlow — photographer SaaS application", w: 1200, h: 672 },
    { name: "Selixo", sub: "Wedding Photography SaaS", href: "/builds/selixo", chips: ["Next.js", "Supabase"], img: "build-selixo", alt: "Selixo — wedding photography SaaS dashboard", w: 2880, h: 1616 },
    { name: "Expenses Tracker", sub: "Personal finance tracker", href: "/builds/expenses", chips: ["Next.js", "Supabase"], img: "build-foundations", alt: "Expenses Tracker — personal finance web app", w: 2880, h: 1614 },
    { name: "Property Image Optimizer", sub: "Real estate image tool", href: "/builds/property-optimizer", chips: ["Canvas API"], img: "build-imageoptimizer", alt: "Property Image Optimizer — browser-only image tool", w: 1200, h: 675 },
    { name: "Weekend Planner", sub: "Bangalore spot finder", href: "/builds/weekend-planner", chips: ["Next.js"], img: "build-weekend", alt: "Weekend Planner — Bangalore spot finder", w: 1200, h: 672 }
  ];

  /* ============================================================
     CONFIG — MacBook screen slideshow. Swap img paths here; each
     entry needs the -400 / -800 AVIF+WebP+JPG variants in /images.
     ============================================================ */
  var SCREENS = [
    { img: "build-striv", alt: "IronLog — AI workout platform", w: 2880, h: 1612 },
    { img: "build-albumflow", alt: "AlbumFlow — photographer SaaS application", w: 1200, h: 672 },
    { img: "build-selixo", alt: "Selixo — wedding photography SaaS dashboard", w: 2880, h: 1616 },
    { img: "build-foundations", alt: "Expenses Tracker — personal finance web app", w: 2880, h: 1614 },
    { img: "build-imageoptimizer", alt: "Property Image Optimizer — browser-only image tool", w: 1200, h: 675 }
  ];

  /* Tilt tuning — removed: the 3D pin interaction is now pure CSS
     (`:hover` on .pin-cell toggles two fixed states), so no JS tilt
     or cursor-tracking exists on this page. */

  var hero = document.getElementById("buildsHero");
  var heroWord = document.getElementById("buildsHeroWord");
  var grid = document.getElementById("buildsGrid");
  var lid = document.getElementById("macbookLid");
  var mac = document.getElementById("macbook");
  var cue = document.getElementById("buildsHeroCue");
  var macScale = 1;

  /* ============================================================
     RENDER — builds the six cards from BUILDS into #buildsGrid.
     Each card gets the 3D-pin layers (floor, beam, rings, badge)
     as absolutely-positioned siblings of .pin-card inside the
     perspective .pin-cell; the card's own content is untouched.
     The badge links to the SAME href as the card link.
     ============================================================ */
  function render() {
    if (!grid || !BUILDS.length) return;
    var sizes = "(max-width:700px) calc(100vw - 48px), 560px";
    var html = "";
    for (var i = 0; i < BUILDS.length; i++) {
      var b = BUILDS[i];
      var internal = b.href.charAt(0) === "/";
      var ext = internal ? "" : ' target="_blank" rel="noopener noreferrer"';
      var big = b.w >= 1600;
      var chips = "";
      for (var c = 0; c < b.chips.length; c++) {
        chips += '<span class="pin-chip">' + b.chips[c] + "</span>";
      }
      html +=
        '<div class="pin-cell">' +
          '<span class="pin-floor" aria-hidden="true"></span>' +
          '<span class="pin-beam" aria-hidden="true"></span>' +
          '<span class="pin-ring pin-ring-1" aria-hidden="true"></span>' +
          '<span class="pin-ring pin-ring-2" aria-hidden="true"></span>' +
          '<span class="pin-ring pin-ring-3" aria-hidden="true"></span>' +
          '<a class="pin-badge" href="' + b.href + '"' + ext + ' aria-label="Open build: ' + b.name + '">' +
            '<span class="pin-badge-label">' + b.name + "</span>" +
            '<span class="pin-badge-line" aria-hidden="true"></span>' +
          "</a>" +
          '<article class="pin-card">' +
            '<a class="pin-link" href="' + b.href + '"' + ext + ' aria-label="View project: ' + b.name + '">' +
              '<div class="pin-media">' +
                "<picture>" +
                  '<source srcset="images/' + b.img + '-400.avif 400w, images/' + b.img + '-800.avif 800w' + (big ? ", images/" + b.img + "-1600.avif 1600w" : "") + '" type="image/avif" sizes="' + sizes + '">' +
                  '<source srcset="images/' + b.img + '-400.webp 400w, images/' + b.img + '-800.webp 800w' + (big ? ", images/" + b.img + "-1600.webp 1600w" : "") + '" type="image/webp" sizes="' + sizes + '">' +
                  '<img loading="lazy" decoding="async" src="images/' + b.img + '.jpg" srcset="images/' + b.img + '-400.jpg 400w, images/' + b.img + '-800.jpg 800w' + (big ? ", images/" + b.img + "-1600.jpg 1600w" : "") + '" sizes="' + sizes + '" width="' + b.w + '" height="' + b.h + '" alt="' + b.alt + '">' +
                "</picture>" +
                '<span class="pin-shine" aria-hidden="true"></span>' +
              "</div>" +
              '<div class="pin-body">' +
                '<h3 class="pin-name">' + b.name + "</h3>" +
                '<p class="pin-sub">' + b.sub + "</p>" +
                '<div class="pin-chips">' + chips + "</div>" +
                '<span class="pin-cta">View Project <span class="pin-cta-arrow" aria-hidden="true">&rarr;</span></span>' +
              "</div>" +
            "</a>" +
          "</article>" +
        "</div>";
    }
    grid.innerHTML = html;
  }

  /* ============================================================
     MACBOOK SLIDESHOW — renders SCREENS as fading slides.
     ============================================================ */
  function renderSlides() {
    var box = document.getElementById("macbookSlides");
    if (!box || !SCREENS.length) return;
    var sizes = "min(880px, 92vw)";
    var html = "";
    for (var i = 0; i < SCREENS.length; i++) {
      var s = SCREENS[i];
      html +=
        '<div class="macbook-slide">' +
          "<picture>" +
            '<source srcset="images/' + s.img + '-400.avif 400w, images/' + s.img + '-800.avif 800w" type="image/avif" sizes="' + sizes + '">' +
            '<source srcset="images/' + s.img + '-400.webp 400w, images/' + s.img + '-800.webp 800w" type="image/webp" sizes="' + sizes + '">' +
            '<img loading="lazy" decoding="async" src="images/' + s.img + '.jpg" srcset="images/' + s.img + '-400.jpg 400w, images/' + s.img + '-800.jpg 800w" sizes="' + sizes + '" width="' + s.w + '" height="' + s.h + '" alt="' + s.alt + '">' +
          "</picture>" +
        "</div>";
    }
    box.innerHTML = html;
  }

  function initSlideshow() {
    var box = document.getElementById("macbookSlides");
    var logo = document.getElementById("macbookLogo");
    if (!box) return;
    var slides = Array.prototype.slice.call(box.querySelectorAll(".macbook-slide"));
    if (!slides.length) return;
    var cur = 0;

    if (reduce) {
      slides[0].classList.add("is-active");
      if (logo) logo.classList.add("is-hidden");
      return;
    }

    /* Boot: the AS monogram fades out as the first screenshot fades in. */
    setTimeout(function () {
      if (slides[0]) slides[0].classList.add("is-active");
      if (logo) logo.classList.add("is-hidden");
    }, 1100);

    var timer = null;
    function next() {
      slides[cur].classList.remove("is-active");
      cur = (cur + 1) % slides.length;
      slides[cur].classList.add("is-active");
    }
    function start() {
      if (!timer) timer = setInterval(next, 4000);
    }
    function stop() {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    }

    /* Only cycle while the MacBook is on screen — saves cycles. */
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(
        function (entries) {
          for (var i = 0; i < entries.length; i++) {
            if (entries[i].isIntersecting) start();
            else stop();
          }
        },
        { threshold: 0.15 }
      );
      io.observe(box);
    } else {
      start();
    }
  }

  /* ============================================================
     HERO ENTRANCE — staggered fade-up on load.
     ============================================================ */
  function entrance() {
    var els = document.querySelectorAll(".builds-hero-eyebrow, .builds-hero-title, .builds-hero-sub, .builds-hero-cue, .macbook-stage");
    var i = 0;
    for (var k = 0; k < els.length; k++) {
      (function (el, delay) {
        setTimeout(function () { el.classList.add("in-view"); }, delay);
      })(els[k], 140 + i++ * 160);
    }
  }

  /* ============================================================
     SCROLL REVEAL (once, staggered 80ms) — animates .pin-cell
     (opacity + transform), so it never fights the card tilt.
     ============================================================ */
  function revealCards() {
    var cells = Array.prototype.slice.call(document.querySelectorAll(".pin-cell"));
    if (!cells.length) return;
    if (reduce || !("IntersectionObserver" in window)) {
      for (var j = 0; j < cells.length; j++) cells[j].classList.add("in-view");
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        for (var e = 0; e < entries.length; e++) {
          if (!entries[e].isIntersecting) continue;
          var cell = entries[e].target;
          var idx = cells.indexOf(cell);
          cell.style.transitionDelay = idx * 80 + "ms";
          cell.classList.add("in-view");
          io.unobserve(cell);
          (function (c, d) {
            setTimeout(function () {
              c.style.transitionDelay = "";
              c.style.willChange = "auto";
            }, 1200 + d);
          })(cell, idx * 80);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    for (var i = 0; i < cells.length; i++) io.observe(cells[i]);

    /* Featured Builds heading fades up just before the cards arrive. */
    var secTitle = document.querySelector(".builds-section-title");
    if (secTitle) {
      var tio = new IntersectionObserver(
        function (entries) {
          for (var e = 0; e < entries.length; e++) {
            if (!entries[e].isIntersecting) continue;
            entries[e].target.classList.add("in-view");
            tio.unobserve(entries[e].target);
          }
        },
        { threshold: 0.1, rootMargin: "0px 0px -12% 0px" }
      );
      tio.observe(secTitle);
    }
  }

  /* ============================================================
     3D PIN — handled in pure CSS: .pin-cell:hover (gated to fine
     pointers) toggles the card tilt, badge, beam and rings. No JS
     here — the reference only switches between two fixed states on
     mouseenter/leave, which CSS `:hover` does natively. The tilt
     lives on .pin-card, the layers on .pin-cell, so they never
     fight the scroll-reveal that animates .pin-cell itself.
     ============================================================ */

  /* ============================================================
     HERO SCROLL — scroll-opens the MacBook lid, gently scales
     the laptop, drifts the outline word, fades the scroll cue.
     All transform/opacity, rAF-throttled, linear + luxurious.
     ============================================================ */
  function lerp2(p, a, b, f, t) {
    if (p <= a) return f;
    if (p >= b) return t;
    return f + (t - f) * ((p - a) / (b - a));
  }

  function setMacScale() {
    macScale = window.innerWidth <= 700 ? 0.8 : 1;
  }

  var ticking = false;

  function heroTick() {
    ticking = false;
    if (!hero) return;
    var vh = window.innerHeight || 1;
    var top = hero.getBoundingClientRect().top;
    var range = Math.max(hero.offsetHeight - vh, 1);
    var p = Math.min(Math.max(-top / range, 0), 1);

    if (cue) {
      if (-top > 60) cue.style.opacity = 0;
      else if (cue.style.opacity === "0") cue.style.opacity = "";
    }

    if (reduce) return;

    /* Outline word drifts up, capped at 80px. */
    if (heroWord) {
      var wy = Math.min(Math.max(-top * 0.06, 0), 80);
      heroWord.style.transform = "translate3d(-50%, calc(-50% + " + wy.toFixed(1) + "px), 0)";
    }

    /* Lid unrolls toward the viewer: hold the closed pose, then open. */
    if (lid) {
      var r = lerp2(p, 0.1, 0.62, -32, 0);
      var sy = lerp2(p, 0, 0.55, 0.78, 1.02);
      var ty = lerp2(p, 0, 0.55, 0, 30);
      lid.style.transform =
        "translate3d(0," + ty.toFixed(2) + "px,0) scaleY(" + sy.toFixed(3) + ") rotateX(" + r.toFixed(2) + "deg)";
    }

    /* Whole laptop settles in as the hero scrolls. */
    if (mac) {
      var ls = lerp2(p, 0, 0.45, 0.92, 1.03);
      mac.style.transform = "scale(" + (ls * macScale).toFixed(3) + ")";
    }
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(heroTick);
    }
  }

  /* ============================================================
     INIT
     ============================================================ */
  render();
  renderSlides();
  entrance();
  revealCards();

  setMacScale();
  heroTick();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", function () {
    setMacScale();
    onScroll();
  }, { passive: true });

  initSlideshow();
})();
