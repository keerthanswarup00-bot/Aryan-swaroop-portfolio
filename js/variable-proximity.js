/* About hero — React Bits <VariableProximity /> adapted to vanilla JS.
   Each letter of the hero headline responds to cursor proximity through the
   variable font axes (wght 500->900, opsz 9->72, linear falloff, radius 150).
   The h1 stays as static semantic text when JS is unavailable,
   prefers-reduced-motion is set, or the device has no hover. */
(function () {
  'use strict';

  var h1 = document.querySelector('.about-hero-inner h1');
  if (!h1) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return;

  var container = document.querySelector('.about-hero-inner') || h1.parentElement;

  var fromSettings = [['wght', 500], ['opsz', 9]];
  var toSettings = [['wght', 900], ['opsz', 72]];
  var radius = 150;
  var falloff = 'linear';

  var fromString = "'wght' 500, 'opsz' 9";
  var letters = [];
  var mousePosition = { x: 0, y: 0 };
  var lastPosition = { x: null, y: null };
  var frameId = 0;

  function calculateFalloff(distance) {
    var norm = Math.min(Math.max(1 - distance / radius, 0), 1);
    if (falloff === 'exponential') return norm * norm;
    if (falloff === 'gaussian') {
      return Math.exp(-Math.pow(distance / (radius / 2), 2) / 2);
    }
    return norm;
  }

  function build() {
    var fullText = h1.textContent;
    var fragment = document.createDocumentFragment();

    Array.prototype.slice.call(h1.childNodes).forEach(function (node) {
      if (node.nodeName === 'BR') {
        var br = document.createElement('span');
        br.className = 'vp-break';
        br.setAttribute('aria-hidden', 'true');
        fragment.appendChild(br);
        return;
      }
      if (node.nodeType !== 3) return;

      var tokens = node.nodeValue.split(/(\s+)/);
      tokens.forEach(function (token) {
        if (!token) return;
        if (/^\s+$/.test(token)) {
          var space = document.createElement('span');
          space.setAttribute('aria-hidden', 'true');
          space.appendChild(document.createTextNode('\u00a0'));
          fragment.appendChild(space);
          return;
        }
        var word = document.createElement('span');
        word.className = 'vp-word';
        for (var i = 0; i < token.length; i++) {
          var letter = document.createElement('span');
          letter.className = 'vp-letter';
          letter.setAttribute('aria-hidden', 'true');
          letter.appendChild(document.createTextNode(token.charAt(i)));
          word.appendChild(letter);
          letters.push(letter);
        }
        fragment.appendChild(word);
      });
    });

    var sr = document.createElement('span');
    sr.className = 'sr-only';
    sr.textContent = fullText;
    fragment.appendChild(sr);

    h1.textContent = '';
    h1.appendChild(fragment);
  }

  function update() {
    if (lastPosition.x === mousePosition.x && lastPosition.y === mousePosition.y) return;
    lastPosition.x = mousePosition.x;
    lastPosition.y = mousePosition.y;

    var containerRect = container.getBoundingClientRect();

    for (var i = 0; i < letters.length; i++) {
      var letter = letters[i];
      var rect = letter.getBoundingClientRect();
      var cx = rect.left + rect.width / 2 - containerRect.left;
      var cy = rect.top + rect.height / 2 - containerRect.top;

      var dx = mousePosition.x - cx;
      var dy = mousePosition.y - cy;
      var distance = Math.sqrt(dx * dx + dy * dy);

      if (distance >= radius) {
        letter.style.fontVariationSettings = fromString;
        continue;
      }

      var value = calculateFalloff(distance);
      var parts = [];
      for (var j = 0; j < fromSettings.length; j++) {
        var from = fromSettings[j];
        var to = toSettings[j];
        var interp = from[1] + (to[1] - from[1]) * value;
        parts.push("'" + from[0] + "' " + interp);
      }
      letter.style.fontVariationSettings = parts.join(', ');
    }
  }

  function loop() {
    update();
    frameId = requestAnimationFrame(loop);
  }

  function onMouseMove(ev) {
    var rect = container.getBoundingClientRect();
    mousePosition.x = ev.clientX - rect.left;
    mousePosition.y = ev.clientY - rect.top;
  }

  function invalidate() {
    lastPosition.x = null;
    lastPosition.y = null;
  }

  build();
  window.addEventListener('mousemove', onMouseMove, { passive: true });
  window.addEventListener('scroll', invalidate, { passive: true });
  window.addEventListener('resize', invalidate);
  loop();
})();
