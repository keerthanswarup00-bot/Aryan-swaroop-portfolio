/* Sticky Featured Projects — Skiper17-style stacked images (GSAP + ScrollTrigger)
   Adapted to a scoped gsap.context so cleanup only kills this section's triggers. */
(function () {
  'use strict';

  var section = document.getElementById('sticky-featured');
  var stage = section ? section.querySelector('.sfp-stage') : null;
  var stack = section ? section.querySelector('.sfp-stack') : null;
  if (!section || !stage || !stack) return;

  var cards = Array.prototype.slice.call(stack.querySelectorAll('.sfp-card'));
  var media = Array.prototype.slice.call(stack.querySelectorAll('.sfp-media'));
  if (media.length < 2 || !window.gsap || !window.ScrollTrigger) return;

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) {
    section.classList.add('sfp-static');
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  var mq = window.matchMedia('(min-width: 901px)');
  var ctx = null;
  var ro = null;
  var io = null;

  function teardown() {
    if (ro) { ro.disconnect(); ro = null; }
    if (ctx) { ctx.revert(); ctx = null; }
  }

  function initDesktop() {
    teardown();
    section.classList.remove('sfp-static');
    if (io) { cards.forEach(function (c) { io.unobserve(c); }); }
    cards.forEach(function (c) { c.classList.remove('in-view'); });

    gsap.set(media[0], { y: 0, scale: 1, rotation: 0, opacity: 1, filter: 'blur(0px) brightness(1)' });
    for (var i = 1; i < media.length; i++) {
      gsap.set(media[i], { y: stage.offsetHeight, scale: 1, rotation: 0, opacity: 1, filter: 'blur(0px) brightness(1)' });
    }

    ro = new ResizeObserver(function () { ScrollTrigger.refresh(); });
    ro.observe(stage);

    ctx = gsap.context(function () {
      var tl = gsap.timeline({
        scrollTrigger: {
          trigger: stage,
          start: 'top top',
          end: function () { return '+=' + window.innerHeight * (media.length - 1); },
          pin: true,
          scrub: 0.5,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true
        }
      });

      for (var i = 0; i < media.length - 1; i++) {
        tl.to(media[i], {
          scale: 0.92,
          opacity: 0.75,
          rotation: 1,
          filter: 'blur(3px) brightness(0.8)',
          duration: 1,
          ease: 'none'
        }, i);
        tl.to(media[i + 1], { y: 0, duration: 1, ease: 'none' }, i);
      }
    }, section);
  }

  function initMobile() {
    teardown();
    if (!io) {
      io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.2, rootMargin: '0px 0px -8% 0px' });
    }
    cards.forEach(function (c) { io.observe(c); });
  }

  function refresh() {
    if (window.ScrollTrigger) ScrollTrigger.refresh();
  }

  mq.addEventListener('change', function () {
    if (mq.matches) initDesktop(); else initMobile();
  });
  if (mq.matches) initDesktop(); else initMobile();

  window.addEventListener('load', refresh);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(refresh);
  }
})();
