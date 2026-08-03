(function () {
  'use strict';
  var slider = document.querySelector('.compare-slider');
  if (!slider) return;

  var stage = slider.closest('.compare-stage') || slider;
  var handle = slider.querySelector('.compare-handle');
  var before = slider.querySelector('.compare-before');
  var marker = slider.querySelector('.compare-marker');
  var prev = document.querySelector('.compare-prev');
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var pct = 50;
  var dragging = false;

  function setMarker() {
    if (!marker) return;
    var w = slider.clientWidth || 1;
    marker.style.transform = 'translate3d(' + (pct / 100) * w + 'px,0,0)';
  }

  function updateSlider(position) {
    pct = Math.max(0, Math.min(100, position));
    if (before) before.style.clipPath = 'inset(0 ' + (100 - pct) + '% 0 0)';
    setMarker();
    if (handle) handle.setAttribute('aria-valuenow', Math.round(pct));
  }

  function getPct(clientX) {
    var r = slider.getBoundingClientRect();
    return ((clientX - r.left) / r.width) * 100;
  }

  function startDrag(e) {
    e.preventDefault();
    dragging = true;
    stage.classList.add('ba-dragging');
    updateSlider(getPct(e.clientX));
    try { slider.setPointerCapture(e.pointerId); } catch (_) {}
  }

  function moveDrag(e) {
    if (!dragging) return;
    updateSlider(getPct(e.clientX));
  }

  function endDrag(e) {
    if (!dragging) return;
    dragging = false;
    stage.classList.remove('ba-dragging');
    try { slider.releasePointerCapture(e.pointerId); } catch (_) {}
  }

  updateSlider(50);

  if (window.PointerEvent) {
    slider.addEventListener('pointerdown', startDrag);
    slider.addEventListener('pointermove', moveDrag);
    slider.addEventListener('pointerup', endDrag);
    slider.addEventListener('pointercancel', endDrag);
  } else if (handle) {
    handle.addEventListener('touchstart', startDrag, { passive: false });
    document.addEventListener('touchmove', moveDrag, { passive: false });
    document.addEventListener('touchend', endDrag);
    handle.addEventListener('mousedown', startDrag);
    document.addEventListener('mousemove', moveDrag);
    document.addEventListener('mouseup', endDrag);
  }

  if (handle) {
    handle.addEventListener('keydown', function (e) {
      var step = e.shiftKey ? 10 : 5;
      if (e.key === 'ArrowLeft') { e.preventDefault(); updateSlider(pct - step); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); updateSlider(pct + step); }
      else if (e.key === 'Home') { e.preventDefault(); updateSlider(0); }
      else if (e.key === 'End') { e.preventDefault(); updateSlider(100); }
    });
  }

  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(setMarker, 100);
  });

  function revealNow() {
    if (prev) prev.classList.add('ba-prev-fade');
    stage.classList.remove('ba-pre');
    stage.classList.add('ba-revealed');
  }

  if (reduced || !window.IntersectionObserver) {
    revealNow();
  } else {
    stage.classList.add('ba-pre');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          revealNow();
          io.disconnect();
        }
      });
    }, { threshold: 0.25 });
    io.observe(stage);
  }
})();
