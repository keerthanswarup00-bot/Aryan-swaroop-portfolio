/* Storytelling Scroll Section — pinned GSAP narrative
   Replaces the Brief / Problem / Process blocks with a full-screen,
   scroll-scrubbed storytelling sequence. Each paragraph enters from
   slightly below, holds still for reading, then retreats backward into
   darkness (scale + blur + perspective depth — never an upward exit).

   Degrades to a static readable flow when JS is unavailable or
   prefers-reduced-motion is set. Scoped via gsap.matchMedia so the
   desktop / mobile setups revert and clean up automatically. */
(function () {
  'use strict';

  if (window.storytellingInit) return;
  window.storytellingInit = true;

  var sections = document.querySelectorAll('.cs-story');
  if (!sections.length || !window.gsap || !window.ScrollTrigger) return;

  gsap.registerPlugin(ScrollTrigger);

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var mm = gsap.matchMedia();

  function activate(section, pin, slides, scrollVh) {
    section.classList.add('cs-story--active');

    var count = slides.length;
    var perSlide = 1 / count;

    gsap.set(slides, { opacity: 0, y: 40, scale: 1, z: 0 });

    /* The first slide (Brief) stays visible from the start so the pinned
       section never scrolls in as an empty black screen — it arrives already
       showing the Brief text. */
    gsap.set(slides[0], { opacity: 1, y: 0, scale: 1, z: 0 });

    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: pin,
        start: 'top top',
        end: function () { return '+=' + window.innerHeight * scrollVh; },
        pin: true,
        pinSpacing: true,
        scrub: 0.5,
        anticipatePin: 1,
        invalidateOnRefresh: true
      }
    });

    slides.forEach(function (slide, i) {
      var seg = i * perSlide;

      if (i > 0) {
        tl.to(slide, {
          opacity: 1,
          y: 0,
          ease: 'power3.out',
          duration: perSlide * 0.18
        }, seg);
      }

      tl.to(slide, {
        opacity: 0,
        y: 0,
        scale: 0.96,
        z: -40,
        ease: 'power2.in',
        duration: perSlide * 0.22
      }, seg + perSlide * 0.52);
    });
  }

  sections.forEach(function (section) {
    var pin = section.querySelector('.cs-story__pin');
    var slides = Array.prototype.slice.call(section.querySelectorAll('.cs-story__slide'));
    if (!pin || slides.length < 2) return;

    var paceDesktop = parseFloat(section.getAttribute('data-scrollvh-desktop')) || 2;
    var paceMobile = parseFloat(section.getAttribute('data-scrollvh-mobile')) || 1.5;

    mm.add('(min-width: 901px)', function () {
      activate(section, pin, slides, paceDesktop);
    });
    mm.add('(max-width: 900px)', function () {
      activate(section, pin, slides, paceMobile);
    });
  });

  window.addEventListener('load', function () {
    if (window.ScrollTrigger) ScrollTrigger.refresh();
  });
})();
