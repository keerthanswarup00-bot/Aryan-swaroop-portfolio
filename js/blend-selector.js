(function () {
  "use strict";
  var buttons = document.querySelectorAll(".blend-btn");
  var photos = document.querySelectorAll(".blend-photo");
  if (!buttons.length || !photos.length) return;

  buttons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var index = parseInt(btn.dataset.index, 10);
      buttons.forEach(function (b) {
        b.classList.remove("active");
      });
      btn.classList.add("active");
      photos.forEach(function (p, i) {
        p.classList.toggle("active", i === index);
      });
    });
  });
})();
