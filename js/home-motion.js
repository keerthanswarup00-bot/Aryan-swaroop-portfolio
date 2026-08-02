/* Homepage motion — GSAP horizontal scroll-jack */
(function () {
  'use strict';
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --- Horizontal scroll-jack for "Three ways I build brands" --- */
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
