(function () {
  "use strict";
  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function revealAll(container) {
    var els = container.querySelectorAll(".reveal-block");
    for (var i = 0; i < els.length; i++) {
      els[i].classList.add("visible");
    }
  }

  if (prefersReduced) {
    revealAll(document);
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          el.classList.add("visible");

          var children = el.querySelectorAll(".reveal-child");
          if (children.length) {
            for (var i = 0; i < children.length; i++) {
              (function (child, index) {
                var delay = index * 120;
                setTimeout(function () {
                  child.classList.add("visible");
                }, delay);
              })(children[i], i);
            }
          }

          observer.unobserve(el);
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
