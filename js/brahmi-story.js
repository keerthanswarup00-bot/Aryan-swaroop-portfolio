/* Featured Case Study — Sastry's by Brahmi, sticky-left scroll storytelling.
   The left column (image only) is pinned via CSS position:sticky;
   the right column is normal document flow — each block reserves its own scroll
   distance (min-height) and fades in once when it enters the viewport
   (opacity 0->1, y 30->0, power3.out). After entry it stays fully opaque and
   scrolls away naturally — no fade-out, no reverse animation.

   Degrades to a static, stacked, fully readable layout when JS is unavailable,
   prefers-reduced-motion is set, the viewport is tablet/mobile, or the left
   column cannot fit inside the viewport (short screens). */
(function () {
  'use strict';

  var section = document.getElementById('brahmi');
  if (!section) return;

  var left = section.querySelector('.csx-left');
  var right = section.querySelector('.csx-right');
  var stage = section.querySelector('.csx-stage');
  var blocks = Array.prototype.slice.call(section.querySelectorAll('.csx-block'));
  if (!left || !right || !stage || !blocks.length) return;

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var mq = window.matchMedia('(min-width: 821px)');
  var ctx = null;

  function isEligible() {
    if (reduced || !mq.matches || !window.gsap || !window.ScrollTrigger) return false;
    return true;
  }

  function teardown() {
    if (ctx) { ctx.revert(); ctx = null; }
    section.classList.remove('csx-anim');
  }

  function init() {
    teardown();
    if (!isEligible()) return;

    section.classList.add('csx-anim');

    // Safety: the sticky left column must fit the viewport. When it does not,
    // bail out to the static stacked layout (never scale/crop the image).
    if (left.offsetHeight + 16 > window.innerHeight) {
      section.classList.remove('csx-anim');
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    ctx = gsap.context(function () {
      // Hidden start — applied only in anim mode; base CSS keeps blocks
      // readable in the no-JS / reduced-motion / tablet fallback.
      gsap.set(blocks, { opacity: 0, y: 30, force3D: true });

      blocks.forEach(function (block) {
        // Fade in once as the block enters the viewport. once:true means it
        // never re-triggers or reverses — after entry the block stays fully
        // opaque and scrolls away like normal content.
        gsap.fromTo(block, { opacity: 0, y: 30 }, {
          opacity: 1,
          y: 0,
          ease: 'power3.out',
          duration: 0.7,
          onComplete: function () {
            gsap.set(block, { clearProps: 'transform' });
          },
          scrollTrigger: {
            trigger: block,
            start: 'top 90%',
            once: true,
            invalidateOnRefresh: true
          }
        });
      });
    }, section);
  }

  init();

  mq.addEventListener('change', function () {
    init();
    if (window.ScrollTrigger) ScrollTrigger.refresh();
  });

  function refresh() {
    if (window.ScrollTrigger) ScrollTrigger.refresh();
  }

  window.addEventListener('load', refresh);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(refresh);
  }
})();
