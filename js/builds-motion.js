/* Builds — Aceternity-style 3D pin cards (CSS-only hover tilt + badge +
   beam + rings; no cursor tracking), scroll reveal. Vanilla ES5-style for
   consistency with the rest of the site. The scroll-scrub MacBook hero lives
   in js/macbook-scroll.js. Animates only transform/opacity; honours
   prefers-reduced-motion. */
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
    { name: "IronLog", sub: "AI Workout Platform", href: "https://workout-tracker-virid-kappa.vercel.app", chips: ["React", "Supabase", "AI"], img: "build-striv", alt: "IronLog — AI workout platform", w: 2880, h: 1612 },
    { name: "AlbumFlow", sub: "Photographer SaaS", href: "https://albumflow-seven.vercel.app", chips: ["Next.js", "Supabase"], img: "build-albumflow", alt: "AlbumFlow — photographer SaaS application", w: 1200, h: 672 },
    { name: "Selixo", sub: "Wedding Photography SaaS", href: "/builds/selixo", chips: ["Next.js", "Supabase"], img: "build-selixo", alt: "Selixo — wedding photography SaaS dashboard", w: 2880, h: 1616 },
    { name: "Fitness Guide", sub: "Fitness & wellness guide", href: "https://aryan-guide.vercel.app", chips: ["Next.js", "Supabase"], img: "build-foundations", alt: "Fitness Guide — personal fitness web app", w: 2880, h: 1614 },
    { name: "Property Image Optimizer", sub: "Real estate image tool", href: "https://property-image-optimizer.vercel.app", chips: ["Canvas API"], img: "build-imageoptimizer", alt: "Property Image Optimizer — browser-only image tool", w: 1200, h: 675 },
    { name: "Weekend Planner", sub: "Bangalore spot finder", href: "https://bangalore-gamma.vercel.app", chips: ["Next.js"], img: "build-weekend", alt: "Weekend Planner — Bangalore spot finder", w: 1200, h: 672 }
  ];

  var grid = document.getElementById("buildsGrid");

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
     INIT
     ============================================================ */
  render();
  revealCards();

  /* Re-run reveal after the hero image loads (it can shift layout). */
  window.addEventListener("load", function () {
    revealCards();
  });
})();
