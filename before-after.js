(function() {
  var wrapper = document.querySelector('.before-after-wrapper');
  if (!wrapper) return;
  var handle = wrapper.querySelector('.handle');
  var beforeWrap = wrapper.querySelector('.before-image-wrapper');

  var pct = 50;
  var dragging = false;

  function updateSlider(position) {
    if (position < 0) position = 0;
    if (position > 100) position = 100;
    pct = position;
    handle.style.left = pct + '%';
    beforeWrap.style.width = pct + '%';
    handle.setAttribute('aria-valuenow', Math.round(pct));
  }

  function getPct(clientX) {
    var rect = wrapper.getBoundingClientRect();
    return ((clientX - rect.left) / rect.width) * 100;
  }

  updateSlider(50);

  function onPointerDown(e) {
    e.preventDefault();
    handle.focus();
    handle.setPointerCapture(e.pointerId);
    dragging = true;
  }

  function onPointerMove(e) {
    if (!dragging) return;
    e.preventDefault();
    updateSlider(getPct(e.clientX));
  }

  function onPointerUp(e) {
    if (!dragging) return;
    dragging = false;
    try { handle.releasePointerCapture(e.pointerId); } catch (_) {}
  }

  handle.addEventListener('pointerdown', onPointerDown);
  document.addEventListener('pointermove', onPointerMove);
  document.addEventListener('pointerup', onPointerUp);
  document.addEventListener('pointercancel', onPointerUp);

  handle.addEventListener('keydown', function(e) {
    var step = e.shiftKey ? 10 : 5;
    if (e.key === 'ArrowLeft') { e.preventDefault(); updateSlider(pct - step); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); updateSlider(pct + step); }
  });

  if (!window.PointerEvent) {
    handle.addEventListener('touchstart', function(e) {
      e.preventDefault();
      handle.focus();
      dragging = true;
      var pos = getPct(e.touches[0].clientX);
    }, { passive: false });
    document.addEventListener('touchmove', function(e) {
      if (!dragging) return;
      e.preventDefault();
      updateSlider(getPct(e.touches[0].clientX));
    }, { passive: false });
    document.addEventListener('touchend', function() { dragging = false; });

    handle.addEventListener('mousedown', function(e) {
      e.preventDefault();
      handle.focus();
      dragging = true;
    });
    document.addEventListener('mousemove', function(e) {
      if (!dragging) return;
      e.preventDefault();
      updateSlider(getPct(e.clientX));
    });
    document.addEventListener('mouseup', function() { dragging = false; });
  }

  var resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() { updateSlider(pct); }, 100);
  });
})();
