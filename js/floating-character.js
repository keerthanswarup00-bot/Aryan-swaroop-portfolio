/* Floating pixel character — organic idle drift + smooth scroll to the game.
   Keeps the CSS idle animation alive but nudges the per-cycle duration so the
   levitation never loops perfectly. No-JS / reduced-motion stays fully static. */
(function () {
  'use strict';
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var anchor = document.querySelector('.floating-character');
  if (!anchor) return;

  if (!reduced) {
    var idle = anchor.querySelector('.floating-character-idle');
    var BASE = 5.2;
    var VARY = 0.35;
    var setDuration = function () {
      var d = BASE + (Math.random() - 0.5) * 2 * VARY;
      anchor.style.setProperty('--char-duration', d.toFixed(2) + 's');
    };
    setDuration();
    if (idle) {
      idle.addEventListener('animationiteration', setDuration, { passive: true });
    }
  }

  var game = document.getElementById('game');
  if (game) {
    anchor.addEventListener('click', function (e) {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      if (reduced || !('scrollBehavior' in document.documentElement.style)) {
        game.scrollIntoView();
      } else {
        game.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }
})();
