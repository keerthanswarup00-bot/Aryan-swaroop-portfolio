/* Featured Case Study — Sastry's by Brahmi, sticky-left scroll storytelling.
   The left column (image only) is pinned via CSS position:sticky;
   the right column is normal document flow — each block reserves its own scroll
   distance (min-height) and reveals in-place: fade in (opacity 0->1, y 40->0,
   power3.out), hold, then fade out slightly (opacity 1->0.35) as it leaves.

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
      gsap.set(blocks, { opacity: 0, y: 40, force3D: true });

      blocks.forEach(function (block) {
        // Fade in as the block travels from the bottom of the viewport to
        // just below center, then hold it while centered.
        gsap.fromTo(block, { opacity: 0, y: 40 }, {
          opacity: 1,
          y: 0,
          ease: 'power3.out',
          duration: 0.7,
          scrollTrigger: {
            trigger: block,
            start: 'top bottom',
            end: 'top 55%',
            scrub: true,
            invalidateOnRefresh: true
          }
        });

        // Fade out slightly (never fully away) as the block scrolls past.
        // immediateRender:false stops this tween from hijacking opacity while
        // the fade-in (or the pre-scroll hidden state) is still in control.
        gsap.fromTo(block, { opacity: 1 }, {
          opacity: 0.35,
          ease: 'power3.out',
          duration: 0.7,
          immediateRender: false,
          scrollTrigger: {
            trigger: block,
            start: 'top 30%',
            end: 'top -30%',
            scrub: true,
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
