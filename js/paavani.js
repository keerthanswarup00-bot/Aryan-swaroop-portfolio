(function () {
  "use strict";
  if (window.paavaniJsInitialized) return;
  window.paavaniJsInitialized = true;

  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* 1. Stat count-up */
  var statEls = document.querySelectorAll(".cs-stat-num");
  if (statEls.length) {
    if (prefersReduced) {
      for (var i = 0; i < statEls.length; i++) {
        var el = statEls[i];
        el.textContent = (el.getAttribute("data-prefix") || "") + (el.getAttribute("data-count") || "0") + (el.getAttribute("data-suffix") || "");
      }
    } else if ("IntersectionObserver" in window) {
      function animateStat(el) {
        var target = parseFloat(el.getAttribute("data-count")) || 0;
        var prefix = el.getAttribute("data-prefix") || "";
        var suffix = el.getAttribute("data-suffix") || "";
        var duration = 900;
        var start = null;
        function frame(ts) {
          if (!start) start = ts;
          var p = Math.min(1, (ts - start) / duration);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = prefix + Math.round(target * eased) + suffix;
          if (p < 1) window.requestAnimationFrame(frame);
        }
        window.requestAnimationFrame(frame);
      }
      var statObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateStat(entry.target);
            statObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.4 });
      for (var s = 0; s < statEls.length; s++) {
        statObserver.observe(statEls[s]);
      }
    }
  }

  /* 2. Hero parallax */
  var heroVisual = document.querySelector(".cs-hero-visual--parallax");
  if (heroVisual && !prefersReduced && window.matchMedia("(min-width: 1024px)").matches) {
    var heroImg = heroVisual.querySelector("img");
    if (heroImg) {
      var ticking = false;
      function updateParallax() {
        ticking = false;
        var rect = heroVisual.getBoundingClientRect();
        var offset = Math.min(Math.max(rect.top, -window.innerHeight * 0.4), window.innerHeight * 0.4);
        heroImg.style.transform = "translate3d(0," + (offset * 0.12).toFixed(1) + "px,0) scale(1.12)";
      }
      window.addEventListener("scroll", function () {
        if (!ticking) {
          ticking = true;
          window.requestAnimationFrame(updateParallax);
        }
      }, { passive: true });
      updateParallax();
    }
  }

  /* 3. Interactive iframe — load live tool when scrolled into view */
  var embed = document.getElementById("interactiveEmbed");
  var frame = document.getElementById("interactiveFrame");
  var loading = document.getElementById("interactiveLoading");
  if (embed && frame) {
    var loadFrame = function () {
      frame.setAttribute("src", "https://vr-devaiah-enclave.vercel.app/");
      var done = false;
      var timer = setTimeout(function () {
        if (!done) {
          done = true;
          if (loading) loading.hidden = true;
        }
      }, 15000);
      frame.addEventListener("load", function () {
        if (!done) {
          done = true;
          clearTimeout(timer);
          if (loading) loading.hidden = true;
        }
      });
    };
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            io.disconnect();
            loadFrame();
          }
        });
      }, { rootMargin: "300px 0px" });
      io.observe(embed);
    } else {
      loadFrame();
    }
  }

  })();

