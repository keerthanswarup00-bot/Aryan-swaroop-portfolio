(function () {
  "use strict";
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var header = document.querySelector(".cs-header");
  var trailLayer = document.getElementById("beanTrailLayer");
  if (!header || !trailLayer) return;
  if (window.matchMedia("(max-width: 768px)").matches) return;

  var lastSpawn = 0;

  header.addEventListener("mousemove", function (e) {
    var now = performance.now();
    if (now - lastSpawn < 180) return;
    lastSpawn = now;

    var rect = header.getBoundingClientRect();
    var bean = document.createElement("div");
    bean.className = "bean-particle";
    bean.style.left = e.clientX - rect.left + "px";
    bean.style.top = e.clientY - rect.top + "px";
    trailLayer.appendChild(bean);

    requestAnimationFrame(function () {
      bean.classList.add("show");
    });
    setTimeout(function () {
      bean.classList.add("fade-out");
    }, 400);
    setTimeout(function () {
      bean.remove();
    }, 900);
  });
})();
