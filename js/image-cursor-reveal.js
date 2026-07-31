(function () {
  "use strict";
  if (window.imageCursorRevealInitialized) return;
  window.imageCursorRevealInitialized = true;

  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function initImageCursorReveal(root) {
    root = root || document;
    var wrappers = root.querySelectorAll("[data-image-reveal]");
    for (var i = 0; i < wrappers.length; i++) {
      build(wrappers[i]);
    }
  }

  function build(wrapper) {
    if (wrapper._revealBuilt) return;
    wrapper._revealBuilt = true;

    var label = wrapper.getAttribute("data-image-reveal") || "VIEW";
    var cursorEl = document.createElement("div");
    cursorEl.className = "img-reveal-cursor";
    cursorEl.textContent = label;
    wrapper.appendChild(cursorEl);

    var supportsHover = window.matchMedia("(hover: hover)").matches;
    var isHovering = false;
    var pos = { x: 0, y: 0 };
    var target = { x: 0, y: 0 };
    var raf = null;

    function animate() {
      pos.x += (target.x - pos.x) * 0.18;
      pos.y += (target.y - pos.y) * 0.18;
      cursorEl.style.transform = "translate(" + pos.x + "px, " + pos.y + "px) translate(-50%, -50%)";
      raf = requestAnimationFrame(animate);
    }
    if (!prefersReduced) {
      raf = requestAnimationFrame(animate);
    }

    function handleEnter() {
      isHovering = true;
      cursorEl.classList.add("visible");
    }

    function handleLeave() {
      isHovering = false;
      cursorEl.classList.remove("visible");
    }

    function handleMove(e) {
      var rect = wrapper.getBoundingClientRect();
      target.x = e.clientX - rect.left;
      target.y = e.clientY - rect.top;
      if (prefersReduced) {
        pos.x = target.x;
        pos.y = target.y;
        cursorEl.style.transform = "translate(" + pos.x + "px, " + pos.y + "px) translate(-50%, -50%)";
      }
    }

    if (supportsHover && !prefersReduced) {
      wrapper.addEventListener("mouseenter", handleEnter);
      wrapper.addEventListener("mouseleave", handleLeave);
      wrapper.addEventListener("mousemove", handleMove);
    }

    if (!supportsHover) {
      var mobilePill = document.createElement("div");
      mobilePill.className = "img-reveal-mobile-pill";
      mobilePill.textContent = "Tap to explore";
      wrapper.appendChild(mobilePill);
    }
  }

  function cleanup(root) {
    root = root || document;
    var wrappers = root.querySelectorAll("[data-image-reveal]");
    for (var i = 0; i < wrappers.length; i++) {
      var w = wrappers[i];
      if (w._revealBuilt) {
        var c = w.querySelector(".img-reveal-cursor");
        if (c) c.remove();
        var p = w.querySelector(".img-reveal-mobile-pill");
        if (p) p.remove();
        w._revealBuilt = false;
      }
    }
  }

  window.ImageCursorReveal = {
    init: initImageCursorReveal,
    cleanup: cleanup,
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      initImageCursorReveal();
    });
  } else {
    initImageCursorReveal();
  }
})();
