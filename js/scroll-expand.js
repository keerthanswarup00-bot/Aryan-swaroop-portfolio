(function () {
  var root = document.querySelector('.scroll-expand');
  if (!root) return;

  var media = root.querySelector('.scroll-expand__media');
  var frame = root.querySelector('.scroll-expand__frame');
  var scrim = root.querySelector('.scroll-expand__scrim');
  if (!media || !frame) return;

  var params = {
    startWidth: 42,
    startHeight: 58,
    startRadius: 24,
    endRadius: 0,
    mediaZoom: 1.1,
    scrollDistance: 1.2,
    holdDistance: 0.35,
    smoothing: 0.1
  };

  var startRadius = params.startRadius;
  var endRadius = params.endRadius;
  var insetX = (100 - params.startWidth) / 200;
  var insetY = (100 - params.startHeight) / 200;
  var clamp = function (n, min, max) { return Math.min(max, Math.max(min, n)); };

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var track = root.querySelector('.scroll-expand__track');
  var stage = root.querySelector('.scroll-expand__stage');
  var stageH = 0;
  var span = 0;
  var distance = 0;

  function measure() {
    stageH = window.innerHeight;
    if (stage) stage.style.height = stageH + 'px';
    distance = stageH * params.scrollDistance;
    span = stageH * (params.scrollDistance + params.holdDistance);
    if (track) track.style.height = (stageH + span) + 'px';
  }

  function readProgress() {
    if (!track || !distance) return 0;
    var top = track.getBoundingClientRect().top;
    return clamp(-top / distance, 0, 1);
  }

  function applyProgress(p) {
    var iy = insetY * (1 - p);
    var ix = insetX * (1 - p);
    var radius = startRadius + (endRadius - startRadius) * p;
    frame.style.clipPath = 'inset(' + (iy * 100) + '% ' + (ix * 100) + '% ' + (iy * 100) + '% ' + (ix * 100) + '% round ' + radius + 'px)';
    media.style.transform = 'scale(' + (1 + (params.mediaZoom - 1) * (1 - p)) + ')';
    if (scrim) scrim.style.opacity = String(p);
  }

  measure();
  window.addEventListener('resize', measure, { passive: true });

  if (reduceMotion) {
    applyProgress(1);
    return;
  }

  var current = 0;
  var target = 0;
  var raf = 0;

  function loop() {
    raf = 0;
    current += (target - current) * clamp(params.smoothing, 0, 1);
    if (Math.abs(target - current) < 0.0001) current = target;
    applyProgress(current);
    if (Math.abs(target - current) > 0.0001) raf = requestAnimationFrame(loop);
  }

  window.addEventListener('scroll', function () {
    target = readProgress();
    if (!raf) raf = requestAnimationFrame(loop);
  }, { passive: true });

  target = readProgress();
  if (Math.abs(target - current) > 0.0001) raf = requestAnimationFrame(loop);
  applyProgress(current);
})();
