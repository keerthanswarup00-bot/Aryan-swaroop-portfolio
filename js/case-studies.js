/* Featured Case Studies — React Bits <FlowingMenu /> adapted to vanilla + GSAP.
   Two menu rows; hovering reveals a white marquee overlay that slides in from
   the closest edge and scrolls the item text + image pills in a seamless loop.
   Degrades to a static, fully readable list when JS/GSAP is unavailable or
   prefers-reduced-motion is set. */
(function () {
  'use strict';

  var wrap = document.querySelector('.menu-wrap');
  if (!wrap) return;

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced || !window.gsap) return;

  var speed = 15;
  var items = Array.prototype.slice.call(wrap.querySelectorAll('.menu__item'));
  var marqueeTweens = [];
  var rafId = 0;

  function distMetric(x, y, x2, y2) {
    var xDiff = x - x2;
    var yDiff = y - y2;
    return xDiff * xDiff + yDiff * yDiff;
  }

  function findClosestEdge(mouseX, mouseY, width, height) {
    var topEdgeDist = distMetric(mouseX, mouseY, width / 2, 0);
    var bottomEdgeDist = distMetric(mouseX, mouseY, width / 2, height);
    return topEdgeDist < bottomEdgeDist ? 'top' : 'bottom';
  }

  function setupMarquee(item) {
    var inner = item.querySelector('.marquee__inner');
    var template = item.querySelector('.marquee__part');
    if (!inner || !template) return;

    var contentWidth = template.offsetWidth;
    if (!contentWidth) return;

    var needed = Math.max(4, Math.ceil(window.innerWidth / contentWidth) + 2);
    var parts = item.querySelectorAll('.marquee__part');
    for (var i = parts.length; i < needed; i++) {
      inner.appendChild(template.cloneNode(true));
    }

    for (var t = marqueeTweens.length - 1; t >= 0; t--) {
      if (marqueeTweens[t].el === inner) {
        marqueeTweens[t].tween.kill();
        marqueeTweens.splice(t, 1);
      }
    }
    marqueeTweens.push({
      el: inner,
      tween: gsap.to(inner, {
        x: -contentWidth,
        duration: speed,
        ease: 'none',
        repeat: -1
      })
    });
  }

  function setupHover(item) {
    var link = item.querySelector('.menu__item-link');
    var marquee = item.querySelector('.marquee');
    var inner = item.querySelector('.marquee__inner');
    if (!link || !marquee || !inner) return;

    var defaults = { duration: 0.6, ease: 'expo' };

    function edgeFromEvent(ev) {
      var rect = item.getBoundingClientRect();
      var x = ev.clientX - rect.left;
      var y = ev.clientY - rect.top;
      return findClosestEdge(x, y, rect.width, rect.height);
    }

    function enter(ev) {
      var edge = edgeFromEvent(ev);
      gsap
        .timeline({ defaults: defaults })
        .set(marquee, { y: edge === 'top' ? '-101%' : '101%' }, 0)
        .set(inner, { y: edge === 'top' ? '101%' : '-101%' }, 0)
        .to([marquee, inner], { y: '0%' }, 0);
    }

    function leave(ev) {
      var edge = edgeFromEvent(ev);
      gsap
        .timeline({ defaults: defaults })
        .to(marquee, { y: edge === 'top' ? '-101%' : '101%' }, 0)
        .to(inner, { y: edge === 'top' ? '101%' : '-101%' }, 0);
    }

    link.addEventListener('mouseenter', enter);
    link.addEventListener('mouseleave', leave);
    link.addEventListener('focusin', enter);
    link.addEventListener('focusout', leave);
  }

  function onResize() {
    if (rafId) return;
    rafId = requestAnimationFrame(function () {
      rafId = 0;
      items.forEach(setupMarquee);
    });
  }

  items.forEach(function (item) {
    setupMarquee(item);
    setupHover(item);
  });
  window.addEventListener('resize', onResize);
})();
