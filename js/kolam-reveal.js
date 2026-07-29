(function () {
  "use strict";
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var layer = document.querySelector(".kolam-lines");
  if (!layer) return;

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          layer.classList.add("drawn");
          observer.disconnect();
        }
      });
    },
    { threshold: 0.3 }
  );
  observer.observe(document.querySelector(".cs-header"));
})();
