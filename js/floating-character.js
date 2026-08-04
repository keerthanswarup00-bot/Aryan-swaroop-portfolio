/* Floating pixel character — organic idle drift + smooth scroll to the game.
   Picks one randomized levitation duration at load so the float never runs on
   a clean 6s beat. Must NOT re-randomize on animationiteration: mutating
   animation-duration on a running CSS animation forces Chromium to restart it,
   and each restart re-fires animationiteration — a feedback loop that makes
   the character flicker fast up and down. No-JS / reduced-motion stays static. */
(function () {
  'use strict';
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var anchor = document.querySelector('.floating-character');
  if (!anchor) return;

  if (!reduced) {
    var BASE = 6;
    var VARY = 0.4;
    var d = BASE + (Math.random() - 0.5) * 2 * VARY;
    anchor.style.setProperty('--char-duration', d.toFixed(2) + 's');
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
