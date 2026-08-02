/* Homepage motion — case-study beat reveals + GSAP horizontal scroll-jack */
(function () {
  'use strict';
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --- 1. Case study blocks: fade/slide in as they enter view --- */
  var beats = document.querySelectorAll('.cs-beat');
  if (beats.length) {
    if (reduced) {
      beats.forEach(function (b) { b.classList.add('in-view'); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.2, rootMargin: '0px 0px -12% 0px' });
      beats.forEach(function (b) { io.observe(b); });
    }
  }

  /* --- 2. Horizontal scroll-jack for "Three ways I build brands" --- */
  var horizontal = document.getElementById('workHorizontal');
  var track = horizontal ? horizontal.querySelector('.work-horizontal-track') : null;
  if (!horizontal || !track || !window.gsap || !window.ScrollTrigger) {
    return;
  }
  if (reduced) {
    horizontal.classList.add('work-horizontal--static');
    return;
  }

  var mq = window.matchMedia('(min-width: 901px)');
  var ctx = null;

  function initPin() {
    if (ctx) { ctx.revert(); ctx = null; }
    if (!mq.matches) {
      horizontal.classList.add('work-horizontal--static');
      return;
    }
    horizontal.classList.remove('work-horizontal--static');
    gsap.registerPlugin(ScrollTrigger);

    ctx = gsap.context(function () {
      gsap.to(track, {
        x: function () { return -(track.scrollWidth - window.innerWidth); },
        ease: 'none',
        scrollTrigger: {
          trigger: horizontal,
          start: 'top top',
          end: function () { return '+=' + (track.scrollWidth - window.innerWidth); },
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
    }, horizontal);
  }

  initPin();
  mq.addEventListener('change', initPin);
  function refresh() {
    if (window.ScrollTrigger) ScrollTrigger.refresh();
  }
  window.addEventListener('load', refresh);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(refresh);
  }
})();
