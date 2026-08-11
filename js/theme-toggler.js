(() => {
  "use strict";

  /*
   * AnimatedThemeToggler — vanilla port of the magic-ui View Transitions
   * theme toggler (Nazam Kalsi et al.). Toggles `html.dark`, reveals the new
   * theme with a clip-path wipe via `document.startViewTransition`, persists
   * to localStorage. Credit: magic-ui / Nazam Kalsi.
   */

  const CONFIG = {
    duration: 400,
    variant: "circle", // circle | square | triangle | diamond | hexagon | rectangle | star
    fromCenter: true,
    storageKey: "theme"
  };

  const button = document.getElementById("themeToggle");
  if (!button) return;

  const root = document.documentElement;
  const LIGHT = "light";
  const DARK = "dark";
  const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function getVariant() {
    return button.dataset.variant || CONFIG.variant;
  }

  function getThemeTransitionClipPaths(variant, cx, cy, maxRadius, vw, vh) {
    const star =
      "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)";
    const hexagon = "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)";
    const diamond =
      "polygon(" + (cx - maxRadius) + "px 50%, 50% " + (cy - maxRadius) + "px, " +
      (cx + maxRadius) + "px 50%, 50% " + (cy + maxRadius) + "px)";
    const square =
      "polygon(calc(" + (cx - maxRadius) + "px) calc(" + (cy - maxRadius) + "px), " +
      "calc(" + (cx + maxRadius) + "px) calc(" + (cy - maxRadius) + "px), " +
      "calc(" + (cx + maxRadius) + "px) calc(" + (cy + maxRadius) + "px), " +
      "calc(" + (cx - maxRadius) + "px) calc(" + (cy + maxRadius) + "px))";
    const rectangle =
      "polygon(0px calc(" + (cy - maxRadius) + "px), 100% calc(" + (cy - maxRadius) + "px), " +
      "100% calc(" + (cy + maxRadius) + "px), 0px calc(" + (cy + maxRadius) + "px))";
    const triangle =
      "polygon(" + cx + "px calc(" + (cy - maxRadius * 2.2) + "px), " +
      "calc(" + (cx - maxRadius * 1.6) + "px) calc(" + (cy + maxRadius) + "px), " +
      "calc(" + (cx + maxRadius * 1.6) + "px) calc(" + (cy + maxRadius) + "px))";
    const circle = "circle(" + maxRadius + "px at " + cx + "px " + cy + "px)";

    switch (variant) {
      case "star":
        return [star, star.replace("50% 70%", "50% 100%")];
      case "hexagon":
        return [hexagon, hexagon];
      case "diamond":
        return [diamond, diamond];
      case "square":
        return [square, square];
      case "rectangle":
        return [rectangle, rectangle];
      case "triangle":
        return [triangle, triangle];
      case "circle":
        return [
          circle,
          "circle(" + Math.hypot(vw, vh) / Math.SQRT2 + "px at " + cx + "px " + cy + "px)"
        ];
    }
    return [circle, circle];
  }

  function currentTheme() {
    return root.classList.contains(DARK) ? DARK : LIGHT;
  }

  function persist(theme) {
    try {
      localStorage.setItem(CONFIG.storageKey, theme);
    } catch (e) {
      /* private mode — non-fatal */
    }
  }

  function applyTheme(theme) {
    root.classList.toggle(DARK, theme === DARK);
    persist(theme);
  }

  function applyInitialTheme() {
    let saved = null;
    try {
      saved = localStorage.getItem(CONFIG.storageKey);
    } catch (e) {
      /* ignore */
    }
    if (saved === DARK) applyTheme(DARK);
  }

  let isTransitioning = false;

  function toggleTheme() {
    const next = currentTheme() === LIGHT ? DARK : LIGHT;

    if (document.startViewTransition && !isTransitioning && !REDUCED) {
      isTransitioning = true;
      root.dataset.magicuiThemeVt = "active";
      root.style.setProperty("--magicui-theme-toggle-vt-duration", CONFIG.duration + "ms");

      const x = root.clientWidth;
      const y = root.clientHeight;
      const maxRadius = Math.max(x, y, Math.hypot(x, y) / Math.SQRT2);
      const fromCenter = button.dataset.fromCenter === "false" ? false : CONFIG.fromCenter;
      const clip = getThemeTransitionClipPaths(
        getVariant(),
        fromCenter ? x / 2 : x - 100,
        fromCenter ? y / 2 : 100,
        maxRadius,
        x,
        y
      );

      const transition = document.startViewTransition(() => {
        applyTheme(next);
      });

      transition.ready.finally(() => {
        root.style.setProperty("--magicui-theme-vt-clip-from", clip[0]);
        root.style.setProperty("--magicui-theme-vt-clip-to", clip[1]);
      });

      transition.finished.finally(() => {
        delete root.dataset.magicuiThemeVt;
        root.style.removeProperty("--magicui-theme-toggle-vt-duration");
        root.style.removeProperty("--magicui-theme-vt-clip-from");
        root.style.removeProperty("--magicui-theme-vt-clip-to");
        isTransitioning = false;
      });
    } else {
      applyTheme(next);
    }
  }

  button.addEventListener("click", toggleTheme);
  applyInitialTheme();
})();
