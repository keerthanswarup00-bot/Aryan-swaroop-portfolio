(function () {
  "use strict";
  var buttons = document.querySelectorAll(".blend-btn");
  var display = document.getElementById("blendImage");
  if (!buttons.length || !display) return;

  buttons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      buttons.forEach(function (b) {
        b.classList.remove("active");
      });
      btn.classList.add("active");
      display.style.opacity = "0";
      setTimeout(function () {
        display.src = btn.dataset.img;
        display.alt = "Sastry's by Brahmi \u2014 " + btn.dataset.label;
        display.style.opacity = "1";
      }, 200);
    });
  });
})();
