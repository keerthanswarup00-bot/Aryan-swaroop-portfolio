/* Featured Case Study — Sastry's by Brahmi, sticky-left scroll storytelling.
   The left column (label + heading + image) is pinned via CSS position:sticky;
   the right column holds one scrubbed GSAP timeline that fades each block in
   (opacity 0->1, y 40->0, power3.out), holds it, then fades it away upward
   (opacity 1->0, y ->-20) before the next block takes its place.

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

    // Safety: the sticky left column must fit the viewport (image containment
    // keeps it small on short screens; bail out to the static layout if not).
    if (left.offsetHeight + 16 > window.innerHeight) {
      section.classList.remove('csx-anim');
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    ctx = gsap.context(function () {
      var fadeIn = 1;
      var hold = 2.2;
      var fadeOut = 1;
      var segment = fadeIn + hold + fadeOut;

      gsap.set(blocks, { opacity: 0, y: 40, force3D: true });

      var tl = gsap.timeline({
        defaults: { ease: 'power3.out', duration: 1 },
        scrollTrigger: {
          trigger: right,
          start: 'top top',
          end: function () { return '+=' + (right.offsetHeight - stage.offsetHeight); },
          scrub: 0.5,
          invalidateOnRefresh: true
        }
      });

      blocks.forEach(function (block, i) {
        var t = i * segment;
        tl.to(block, { opacity: 1, y: 0, duration: fadeIn }, t)
          .to(block, { opacity: 0, y: -20, duration: fadeOut }, t + fadeIn + hold);
      });

      tl.to({}, { duration: 1.6 });
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
