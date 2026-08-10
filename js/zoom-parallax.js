(function () {
  var root = document.getElementById('reParallax');
  if (!root || root.dataset.zpReady) return;
  root.dataset.zpReady = '1';
  var items = root.querySelectorAll('.zp-item');
  var copy = root.querySelector('.zp-copy');
  if (!items.length) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.documentElement.classList.add('js');
  var SCALES = [4, 5, 6, 5, 6, 8, 9];
  var vh = window.innerHeight || document.documentElement.clientHeight;
  var ticking = false;

  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }

  function frame() {
    ticking = false;
    var rect = root.getBoundingClientRect();
    var total = rect.height - vh;
    if (total <= 0) return;
    var p = clamp(-rect.top / total, 0, 1);
    for (var i = 0; i < items.length; i++) {
      items[i].style.transform = 'scale(' + (1 + (SCALES[i] - 1) * p) + ')';
    }
    if (copy) {
      var o = 1 - clamp(p * 5, 0, 1);
      copy.style.opacity = String(o);
      copy.style.visibility = o > 0.01 ? 'visible' : 'hidden';
    }
  }

  function request() {
    if (!ticking) { ticking = true; requestAnimationFrame(frame); }
  }

  window.addEventListener('scroll', request, { passive: true });
  window.addEventListener('resize', request, { passive: true });
  window.addEventListener('load', request);
  frame();
})();
