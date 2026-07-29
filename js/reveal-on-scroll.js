(function () {
  "use strict";
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var els = document.querySelectorAll(".reveal-block");
    for (var i = 0; i < els.length; i++) {
      els[i].classList.add("visible");
    }
    return;
  }
  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  var blocks = document.querySelectorAll(".reveal-block");
  for (var i = 0; i < blocks.length; i++) {
    observer.observe(blocks[i]);
  }
})();
