/* About — "scroll to explore" morph gallery.
   Vanilla port of the scroll-morph-hero React/framer-motion component.
   GSAP intro (scatter -> line -> circle), then a pinned + scrubbed
   ScrollTrigger morphs the circle into a bottom "rainbow" arc with a
   bounded shuffle as the user keeps scrolling, plus mouse parallax.

   Fallbacks:
   - prefers-reduced-motion or no GSAP/ScrollTrigger -> static arc.
   - viewport < 768px -> static arc (matches the site's desktop-only
     scroll-jack convention, see js/home-motion.js).
   Requires js/vendor/gsap.min.js + js/vendor/ScrollTrigger.min.js loaded first. */
(function () {
  'use strict';

  var section = document.getElementById('aboutMorph');
  if (!section) return;

  var WORK = [
    { img: 'pg-01' },
    { img: 'pg-02' },
    { img: 'pg-03' },
    { img: 'pg-04' },
    { img: 'pg-05' },
    { img: 'pg-06' },
    { img: 'pg-07' },
    { img: 'pg-08' },
    { img: 'pg-09' },
    { img: 'pg-10' },
    { img: 'pg-brahmi-courtyard' },
    { img: 'pg-brahmi-doorway' }
  ];

  var TOTAL = WORK.length;
  var MAX_SCROLL = 3000; // virtual scroll range
  var MORPH_END = 600;   // circle -> arc completes at scroll 600
  var CARD_W = 78;
  var CARD_H = 110.5;

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasGsap = !!(window.gsap && window.ScrollTrigger);
  var desktop = window.matchMedia('(min-width: 768px)');

  var stage = section.querySelector('.about-morph-stage');
  var cardsEl = section.querySelector('.about-morph-cards');
  var headlineEl = section.querySelector('.about-morph-headline');
  var hintEl = section.querySelector('.about-morph-hint');
  var contentEl = section.querySelector('.about-morph-content');

  var cards = [];
  var scatter = [];
  var size = { w: 0, h: 0 };

  var interactive = false;
  var introDone = false;
  var scroll = 0;
  var parallaxTarget = 0;
  var parallax = 0;
  var rafId = 0;

  var st = null;
  var introTl = null;
  var introTrigger = null;

  function lerp(a, b, t) { return a + (b - a) * t; }

  /* --- Card DOM --- */
  function buildCards() {
    var frag = document.createDocumentFragment();
    for (var i = 0; i < WORK.length; i++) {
      var item = WORK[i];

      var card = document.createElement('div');
      card.className = 'morph-card';

      var inner = document.createElement('div');
      inner.className = 'morph-card-inner';

      var front = document.createElement('div');
      front.className = 'morph-card-front';
      var img = document.createElement('img');
      img.src = '/images/' + item.img + '.webp';
      img.width = CARD_W;
      img.height = CARD_H;
      img.alt = '';
      img.loading = 'lazy';
      img.decoding = 'async';
      img.draggable = false;
      img.onerror = function () {
        if (this.dataset.fb) return;
        this.dataset.fb = '1';
        this.src = this.src.replace('.webp', '.avif');
      };
      front.appendChild(img);

      var back = document.createElement('div');
      back.className = 'morph-card-back';
      var backImg = document.createElement('img');
      backImg.src = '/images/' + item.img + '.webp';
      backImg.width = CARD_W;
      backImg.height = CARD_H;
      backImg.alt = '';
      backImg.draggable = false;
      backImg.onerror = function () {
        if (this.dataset.fb) return;
        this.dataset.fb = '1';
        this.src = this.src.replace('.webp', '.avif');
      };
      back.appendChild(backImg);

      inner.appendChild(front);
      inner.appendChild(back);
      card.appendChild(inner);
      frag.appendChild(card);

      scatter.push({
        x: (Math.random() - 0.5) * 1500,
        y: (Math.random() - 0.5) * 1000,
        rotation: (Math.random() - 0.5) * 180
      });
    }
    cardsEl.appendChild(frag);
    cards = Array.prototype.slice.call(cardsEl.children);
  }

  /* --- Layout math (ported 1:1 from the React component) --- */
  function measure() {
    size.w = stage.clientWidth;
    size.h = stage.clientHeight;
  }

  function circlePos(i) {
    var minDim = Math.min(size.w, size.h);
    var r = Math.min(minDim * 0.35, 350);
    var angle = (i / TOTAL) * 360;
    var rad = (angle * Math.PI) / 180;
    return { x: Math.cos(rad) * r, y: Math.sin(rad) * r, rotation: angle + 90 };
  }

  function arcPos(i, rotateValue, parallaxValue) {
    var mobile = size.w < 768;
    var baseRadius = Math.min(size.w, size.h * 1.5);
    var r = baseRadius * (mobile ? 1.4 : 1.1);
    var apexY = size.h * (mobile ? 0.35 : 0.25);
    var centerY = apexY + r;
    var spread = mobile ? 100 : 130;
    var start = -90 - spread / 2;
    var step = spread / (TOTAL - 1);
    var progress = Math.min(Math.max(rotateValue / 360, 0), 1);
    var bounded = -progress * spread * 0.8;
    var angle = start + i * step + bounded;
    var rad = (angle * Math.PI) / 180;
    return {
      x: Math.cos(rad) * r + parallaxValue,
      y: Math.sin(rad) * r + centerY,
      rotation: angle + 90,
      scale: mobile ? 1.4 : 1.8
    };
  }

  // Static fallback positions. Same shape as arcPos, but on small screens the
  // component's very large radius clips almost every card, so shrink it to fit.
  function staticArcPos(i) {
    var mobile = size.w < 768;
    var spread = mobile ? 100 : 130;
    var apexY = size.h * (mobile ? 0.35 : 0.25);
    var r = mobile ? size.h * 0.55 : Math.min(size.w, size.h * 1.5) * 1.1;
    var centerY = apexY + r;
    var start = -90 - spread / 2;
    var step = spread / (TOTAL - 1);
    var angle = start + i * step;
    var rad = (angle * Math.PI) / 180;
    return {
      x: Math.cos(rad) * r,
      y: Math.sin(rad) * r + centerY,
      rotation: angle + 90,
      scale: mobile ? 1.4 : 1.8
    };
  }

  /* --- Render loop (manual morph, like the component's motion values) --- */
  function renderFrame() {
    var m = 0;
    var r = 0;
    if (introDone) {
      m = Math.min(scroll / MORPH_END, 1);
      if (scroll > MORPH_END) {
        r = Math.min((scroll - MORPH_END) / (MAX_SCROLL - MORPH_END), 1) * 360;
      }
    }

    // Content fades in once the arc is mostly formed (morph 0.8 -> 1).
    var co = Math.min(Math.max((m - 0.8) / 0.2, 0), 1);
    contentEl.style.opacity = co.toFixed(3);
    contentEl.style.transform = 'translate(-50%,' + (20 - co * 20).toFixed(2) + 'px)';

    // Intro text fades out during the first half of the morph.
    headlineEl.style.opacity = m < 0.5 ? (1 - m * 2).toFixed(3) : '0';
    hintEl.style.opacity = m < 0.5 ? (0.5 - m).toFixed(3) : '0';

    for (var i = 0; i < cards.length; i++) {
      var c = circlePos(i);
      var a = arcPos(i, r, parallax);
      var x = lerp(c.x, a.x, m);
      var y = lerp(c.y, a.y, m);
      var rot = lerp(c.rotation, a.rotation, m);
      var sc = lerp(1, a.scale, m);
      cards[i].style.transform =
        'translate3d(' + x.toFixed(2) + 'px,' + y.toFixed(2) + 'px,0) ' +
        'rotate(' + rot.toFixed(2) + 'deg) scale(' + sc.toFixed(3) + ')';
    }
  }

  function frame() {
    rafId = requestAnimationFrame(frame);
    parallax += (parallaxTarget - parallax) * 0.08;
    renderFrame();
  }

  function onMouseMove(e) {
    var rect = section.getBoundingClientRect();
    var nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    parallaxTarget = nx * 100;
  }

  /* --- Interactive mode: intro timeline + pinned scrub --- */
  function resetScatter() {
    for (var i = 0; i < cards.length; i++) {
      var s = scatter[i];
      cards[i].style.transform =
        'translate3d(' + s.x + 'px,' + s.y + 'px,0) ' +
        'rotate(' + s.rotation + 'deg) scale(0.6)';
      cards[i].style.opacity = '0';
    }
  }

  function setupInteractive() {
    introDone = false;
    scroll = 0;
    parallax = 0;
    parallaxTarget = 0;
    resetScatter();

    headlineEl.style.opacity = '1';
    hintEl.style.opacity = '1';
    contentEl.style.opacity = '0';
    contentEl.style.transform = 'translate(-50%,20px)';
    section.classList.add('is-live');
    section.classList.remove('is-static');

    introTl = window.gsap.timeline({ onComplete: function () { introDone = true; } });

    // Scatter -> line
    introTl.to(cards, {
      x: function (i) {
        var spacing = 70;
        var total = TOTAL * spacing;
        return i * spacing - total / 2;
      },
      y: 0,
      rotation: 0,
      scale: 1,
      opacity: 1,
      duration: 1,
      ease: 'power2.out'
    }, 0.5);

    // Line -> circle (function targets stay live on resize)
    introTl.to(cards, {
      x: function (i) { return circlePos(i).x; },
      y: function (i) { return circlePos(i).y; },
      rotation: function (i) { return circlePos(i).rotation; },
      duration: 1.2,
      ease: 'power2.inOut'
    }, 2.5);

    introTl.pause(0);

    introTrigger = window.ScrollTrigger.create({
      trigger: section,
      start: 'top 75%',
      once: true,
      onEnter: function () { introTl.play(0); }
    });

    // Play immediately if the section is already within range (e.g. on setup).
    if (section.getBoundingClientRect().top < window.innerHeight * 0.75) {
      introTl.play(0);
    }

    // Pin + scrub drives the virtual scroll value (spring smoothing via scrub:1).
    var proxy = { v: 0 };
    st = window.gsap.to(proxy, {
      v: MAX_SCROLL,
      ease: 'none',
      onUpdate: function () { scroll = proxy.v; },
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: '+=' + MAX_SCROLL,
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true
      }
    });

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    if (!rafId) rafId = requestAnimationFrame(frame);
  }

  function teardownInteractive() {
    if (rafId) { cancelAnimationFrame(rafId); rafId = 0; }
    if (introTl) { introTl.kill(); introTl = null; }
    if (introTrigger) { introTrigger.kill(); introTrigger = null; }
    if (st) {
      var tr = st.scrollTrigger;
      if (tr) tr.kill();
      st.kill();
      st = null;
    }
    window.removeEventListener('mousemove', onMouseMove);
    section.classList.remove('is-live');
  }

  /* --- Static fallback: render the final arc, no scroll interaction --- */
  function renderStatic() {
    for (var i = 0; i < cards.length; i++) {
      var a = staticArcPos(i);
      cards[i].style.transform =
        'translate3d(' + a.x.toFixed(2) + 'px,' + a.y.toFixed(2) + 'px,0) ' +
        'rotate(' + a.rotation.toFixed(2) + 'deg) scale(' + a.scale.toFixed(3) + ')';
      cards[i].style.opacity = '1';
    }
  }

  function setupStatic() {
    teardownInteractive();
    contentEl.style.opacity = '';
    contentEl.style.transform = '';
    headlineEl.style.opacity = '';
    hintEl.style.opacity = '';
    section.classList.add('is-static');
    section.classList.remove('is-live');
    renderStatic();
  }

  /* --- Mode switching --- */
  function applyMode() {
    measure();
    var want = desktop.matches && !reduced && hasGsap;
    if (want && !interactive) {
      setupInteractive();
      interactive = true;
    } else if (!want) {
      if (interactive) interactive = false;
      setupStatic();
    }
    if (window.ScrollTrigger) window.ScrollTrigger.refresh();
  }

  function init() {
    if (!cards.length) buildCards();
    measure();
    applyMode();

    desktop.addEventListener('change', applyMode);
    if (window.ResizeObserver) {
      var ro = new ResizeObserver(measure);
      ro.observe(stage);
    } else {
      window.addEventListener('resize', measure, { passive: true });
    }

    window.addEventListener('load', function () {
      if (window.ScrollTrigger) window.ScrollTrigger.refresh();
    });
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () {
        if (window.ScrollTrigger) window.ScrollTrigger.refresh();
      });
    }
  }

  init();
})();
