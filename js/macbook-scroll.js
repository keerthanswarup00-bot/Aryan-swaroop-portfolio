/* Builds hero — MacBook Scroll (GSAP + ScrollTrigger).
   A single scrubbed timeline drives the whole effect, ported from Aceternity's
   MacbookScroll:
     - heading:  opacity 1→0 over [0, 0.2]; translateY 0→100px over [0, 0.3]
      - lid:      scaleX 1.2→1.5 and scaleY 0.6→1.5 over [0, 0.3];
                  rotateX held at -28deg until 0.12 (pause-then-open keyframe),
                  then -28→0 over [0.12, 0.3]
                  transformOrigin: top (the lid's top edge stays pinned while
                  the screen expands down over the deck)
      - lid:      translateY 0→1500px over [0, 1] carries the lid DOWN and
                  off the bottom across the full scroll range
   The default CSS state is the fully-open laptop, so reduced-motion and no-JS
   visitors get a static machine; .macbook-anim only lands when the scrub is
   live and gates the 200vh canvas in css/macbook-scroll.css.
   Animates transform/opacity only. */
(function () {
  'use strict';

  var section = document.getElementById('macbookScroll');
  var heading = document.getElementById('buildsHeroTitle');
  var lid = document.getElementById('macbookScrollLid');
  var stage = section ? section.querySelector('.macbook-scroll-stage') : null;
  if (!section || !heading || !lid || !stage || !window.gsap || !window.ScrollTrigger) return;

  var mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  var ctx = null;

  function teardown() {
    if (ctx) {
      ctx.revert();
      ctx = null;
    }
    section.classList.remove('macbook-anim');
  }

  function init() {
    teardown();
    if (mq.matches) return;

    gsap.registerPlugin(ScrollTrigger);
    section.classList.add('macbook-anim');

    ctx = gsap.context(function () {
      /* Explicit starting poses — the CSS default is the fully-open laptop,
         so the scrub needs these "from" values. Both live inside the context
         so ctx.revert() (reduced-motion flip mid-session) clears them. */
      gsap.set(lid, { scaleX: 1.2, scaleY: 0.6, rotateX: -28, transformOrigin: 'top' });
      gsap.set(heading, { opacity: 1, y: 0 });

      var tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
          invalidateOnRefresh: true
        }
      });

      /* Heading fades and slides down/away as the lid begins to open. */
      tl.to(heading, { opacity: 0, duration: 0.2, ease: 'none' }, 0);
      tl.to(heading, { y: 100, duration: 0.3, ease: 'none' }, 0);

      /* Lid unfurls: scale grows over [0, 0.3] (eased so the pop reads
         smoothly) while rotateX holds -28deg until 0.12, then flattens to 0
         by 0.30. */
      tl.to(lid, { scaleX: 1.5, duration: 0.3, ease: 'power1.inOut' }, 0);
      tl.to(lid, { scaleY: 1.5, duration: 0.3, ease: 'power1.inOut' }, 0);
      tl.to(lid, { rotateX: 0, duration: 0.18, ease: 'power1.inOut' }, 0.12);

      /* Carry the lid DOWN (+1500) across the full scroll range — it travels
         out of view at the bottom of the section, making room for whatever
         follows the hero. Matches the reference source:
         const translate = useTransform(scrollYProgress, [0, 1], [0, 1500]); */
      tl.to(lid, { y: 1500, duration: 1, ease: 'none' }, 0);
    }, section);
  }

  init();

  /* Recalculate after late-loading assets change the section height. */
  function refresh() {
    if (window.ScrollTrigger) ScrollTrigger.refresh();
  }
  window.addEventListener('load', refresh);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(refresh);
  }

  /* Restore/pause if the motion preference flips after load. */
  if (mq.addEventListener) mq.addEventListener('change', init);
})();
