(function () {
  'use strict';

  if (window.innerWidth >= 768) return;

  var TOTAL_IMAGES = 44;
  var PAGE_W = 1280;
  var PAGE_H = 720;
  var FLIP_MS = 450;
  var SWIPE_DIST = 45;

  function pad(n) {
    return n < 10 ? '0' + n : '' + n;
  }

  function pageUrl(i) {
    return '/images/brahmi/page-' + pad(i) + '.jpg';
  }

  var stage = document.getElementById('mobile-flipbook');
  if (!stage) return;

  var page = stage.querySelector('.fb-custom__page');
  var pageImg = page ? page.querySelector('img') : null;
  var flip = stage.querySelector('.fb-custom__flip');
  var flipImg = flip ? flip.querySelector('img') : null;
  var stack = stage.querySelector('.fb-custom__stack');
  var holder = stage.closest('.fb-custom');
  var prevBtn = document.querySelector('.fb-custom__prev');
  var nextBtn = document.querySelector('.fb-custom__next');

  if (!page || !pageImg || !flip || !flipImg || !stack) return;

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) stage.classList.add('fb-custom--noanim');

  var index = 0;
  var flipping = false;
  var stackMax = 23;
  var dim = { w: 0, h: 0 };

  var ARROW_SPACE = 42;

  function calcDim() {
    var avail = holder ? holder.getBoundingClientRect().width : stage.getBoundingClientRect().width;
    var maxStage = Math.max(220, avail - 2 * ARROW_SPACE);
    var w = Math.round(Math.min(Math.max(maxStage * 0.92, 180), 360));
    var s = Math.min(28, Math.max(14, Math.round(w * 0.07)));
    if (w + s > maxStage) w = Math.max(160, maxStage - s);
    var h = Math.round(w * PAGE_H / PAGE_W);
    return { w: w, s: s, h: h };
  }

  function applyState() {
    var open = index > 0;
    var stackW = open ? Math.min(stackMax, 3 + index * 0.55) : 0;
    var pageLeft = open ? stackMax : stackMax / 2;
    stack.style.width = stackW + 'px';
    stack.style.opacity = open ? '1' : '0';
    page.style.left = pageLeft + 'px';
    flip.style.left = pageLeft + 'px';
    if (prevBtn) prevBtn.disabled = index <= 0;
    if (nextBtn) nextBtn.disabled = index >= TOTAL_IMAGES - 1;
  }

  function applySize() {
    var d = calcDim();
    if (d.w === dim.w && d.s === stackMax && d.h === dim.h) return;
    dim = { w: d.w, h: d.h };
    stackMax = d.s;
    stage.style.width = (d.w + stackMax) + 'px';
    stage.style.height = d.h + 'px';
    page.style.width = d.w + 'px';
    flip.style.width = d.w + 'px';
    applyState();
  }

  function preload() {
    var cur = index + 1;
    [cur - 1, cur + 1, cur + 2].forEach(function (i) {
      if (i >= 1 && i <= TOTAL_IMAGES) {
        var im = new Image();
        im.src = pageUrl(i);
      }
    });
  }

  function finishFlip() {
    flip.classList.remove('active', 'turn-next', 'turn-prev', 'start');
    flipping = false;
    applyState();
    preload();
  }

  function waitFlip(done) {
    var doneOnce = false;
    function finish() {
      if (doneOnce) return;
      doneOnce = true;
      flip.removeEventListener('transitionend', onEnd);
      done();
    }
    function onEnd(e) {
      if (e.propertyName === 'transform') finish();
    }
    flip.addEventListener('transitionend', onEnd);
    setTimeout(finish, FLIP_MS + 140);
  }

  function flipNext() {
    if (flipping || index >= TOTAL_IMAGES - 1) return;
    if (reduced) {
      index++;
      applyState();
      preload();
      return;
    }
    flipping = true;
    flipImg.src = pageUrl(index + 1);
    pageImg.src = pageUrl(index + 2);
    flip.classList.remove('turn-next', 'turn-prev', 'start');
    flip.classList.add('active');
    void flip.offsetWidth;
    flip.classList.add('turn-next');
    index++;
    waitFlip(finishFlip);
  }

  function flipPrev() {
    if (flipping || index <= 0) return;
    if (reduced) {
      index--;
      applyState();
      preload();
      return;
    }
    flipping = true;
    flipImg.src = pageUrl(index);
    pageImg.src = pageUrl(index);
    flip.classList.remove('turn-next', 'turn-prev', 'start');
    flip.classList.add('active', 'turn-prev', 'start');
    void flip.offsetWidth;
    flip.classList.remove('start');
    index--;
    waitFlip(finishFlip);
  }

  var sx = 0;
  var sy = 0;
  var swiping = false;

  stage.addEventListener('touchstart', function (e) {
    if (flipping) return;
    sx = e.touches[0].clientX;
    sy = e.touches[0].clientY;
    swiping = false;
  }, { passive: true });

  stage.addEventListener('touchmove', function (e) {
    if (flipping) return;
    var dx = e.touches[0].clientX - sx;
    var dy = e.touches[0].clientY - sy;
    if (Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy)) {
      swiping = true;
      e.preventDefault();
    }
  }, { passive: false });

  stage.addEventListener('touchend', function (e) {
    if (flipping || !swiping) return;
    var dx = e.changedTouches[0].clientX - sx;
    if (dx < -SWIPE_DIST) flipNext();
    else if (dx > SWIPE_DIST) flipPrev();
  });

  if (prevBtn) prevBtn.addEventListener('click', flipPrev);
  if (nextBtn) nextBtn.addEventListener('click', flipNext);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') { e.preventDefault(); flipPrev(); }
    if (e.key === 'ArrowRight') { e.preventDefault(); flipNext(); }
  });

  var rt = null;
  function onResize() {
    if (rt) clearTimeout(rt);
    rt = setTimeout(function () { applySize(); }, 180);
  }

  if (typeof ResizeObserver !== 'undefined') {
    var ro = new ResizeObserver(onResize);
    ro.observe(holder || stage);
  }
  window.addEventListener('resize', onResize);

  applySize();
  applyState();
  preload();
})();
