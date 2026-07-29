(function () {
  "use strict";
  var buttons = document.querySelectorAll(".blend-btn");
  var frames = document.querySelectorAll(".blend-frame");
  if (!buttons.length || !frames.length) return;

  buttons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var blend = btn.dataset.blend;
      buttons.forEach(function (b) {
        b.classList.remove("active");
      });
      btn.classList.add("active");
      frames.forEach(function (f) {
        if (f.dataset.blend === blend) {
          f.classList.add("blend-frame-active");
        } else {
          f.classList.remove("blend-frame-active");
        }
      });
    });
  });
})();
