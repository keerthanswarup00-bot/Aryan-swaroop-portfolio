/* Playground — editorial gallery motion layer
   Requires: gsap.min.js, ScrollTrigger.min.js, CustomEase.min.js, lenis.min.js
   All animation is transform/opacity only for GPU-accelerated motion. */
document.addEventListener('DOMContentLoaded', function () {
  var grid = document.getElementById('pgGrid');
  var heroInner = document.querySelector('.pg-hero-inner');
  if (!grid || !window.gsap || !window.ScrollTrigger) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var gsap = window.gsap;
  var ScrollTrigger = window.ScrollTrigger;

  gsap.registerPlugin(ScrollTrigger);
  if (window.CustomEase) {
    gsap.registerPlugin(window.CustomEase);
    window.CustomEase.create('pgEase', '0.22,1,0.36,1');
  }
  var ease = window.CustomEase ? 'pgEase' : 'power3.out';

  /* ---- Lenis smooth scroll ---- */
  var lenis = null;
  if (window.Lenis && !reduceMotion) {
    lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    window.__pgLenis = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
    document.documentElement.style.scrollBehavior = 'auto';
  }

  if (reduceMotion) return;

  var items = Array.prototype.slice.call(grid.querySelectorAll('.pg-item'));
  if (!items.length) return;

  var medias = items.map(function (item) { return item.querySelector('.pg-media'); });
  var viewportH = window.innerHeight;
  var initial = [];

  /* Below-the-fold items start hidden and reveal once on scroll. */
  items.forEach(function (item) {
    if (item.getBoundingClientRect().top < viewportH * 1.02) {
      initial.push(item);
    } else {
      gsap.set(item, { y: 60, scale: 0.98, opacity: 0 });
      ScrollTrigger.create({
        trigger: item,
        start: 'top 92%',
        once: true,
        onEnter: function () {
          gsap.to(item, { y: 0, scale: 1, opacity: 1, duration: 0.7, ease: 'power3.out', overwrite: 'auto' });
        }
      });
    }
  });

  /* Page-load entrance: images float upward into place. */
  if (initial.length) {
    gsap.set(initial, { y: 120, scale: 0.96, opacity: 0 });
    gsap.to(initial, { y: 0, scale: 1, opacity: 1, duration: 0.8, ease: ease, stagger: 0.06, delay: 0.1 });
  }

  /* Hero fades upward on load. */
  if (heroInner) {
    var h1 = heroInner.querySelector('h1');
    var p = heroInner.querySelector('p');
    gsap.set([h1, p], { y: 48, opacity: 0 });
    gsap.to([h1, p], { y: 0, opacity: 1, duration: 0.9, ease: ease, stagger: 0.08, delay: 0.1 });
  }

  /* Subtle parallax: each media drifts at its own speed. */
  var parallaxScale = window.innerWidth < 768 ? 0.6 : 1;
  items.forEach(function (item, i) {
    var media = medias[i];
    if (!media) return;
    var speed = (14 + (i % 5) * 3) * parallaxScale;
    var dist = i % 2 === 0 ? speed : -speed;
    gsap.fromTo(media, { y: -dist }, {
      y: dist,
      ease: 'none',
      scrollTrigger: {
        trigger: item,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.8
      }
    });
  });

  window.addEventListener('load', function () { ScrollTrigger.refresh(); });
});
