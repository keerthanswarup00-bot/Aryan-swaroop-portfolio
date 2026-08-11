(() => {
  "use strict";

  const IMAGES = [
    "images/pg-01.webp",
    "images/pg-02.webp",
    "images/pg-03.webp",
    "images/pg-04.webp",
    "images/pg-05.webp",
    "images/pg-06.webp",
    "images/pg-07.webp",
    "images/pg-08.webp",
    "images/pg-09.webp",
    "images/pg-10.webp",
    "images/pg-brahmi-courtyard.webp",
    "images/pg-brahmi-doorway.webp",
    "images/arvi-1.webp"
  ];

  const PATH =
    "M1 209.434C58.5872 255.935 387.926 325.938 482.583 209.434C600.905 63.8051 525.516 -43.2211 427.332 19.9613C329.149 83.1436 352.902 242.723 515.041 267.302C644.752 286.966 943.56 181.94 995 156.5";

  const VIEWBOX = { w: 996, h: 330 };

  const OPTIONS = {
    baseVelocity: 8,
    direction: "normal",
    repeat: 2,
    slowdownOnHover: true,
    slowDownFactor: 0.3,
    draggable: true,
    dragSensitivity: 0.1,
    dragVelocityDecay: 0.96,
    grabCursor: true,
    enableRollingZIndex: true,
    zIndexBase: 1,
    zIndexRange: 10
  };

  const wrap = (min, max, value) => {
    const range = max - min;
    return ((((value - min) % range) + range) % range) + min;
  };

  const wrapEl = document.getElementById("mqWrap");
  const innerEl = document.getElementById("mqInner");
  if (!wrapEl || !innerEl) return;

  const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const SUPPORTED = CSS.supports("offset-path", 'path("M 0 0")');

  const itemCount = IMAGES.length * OPTIONS.repeat;

  const items = [];
  IMAGES.forEach((src, childIndex) => {
    for (let r = 0; r < OPTIONS.repeat; r++) {
      const itemIndex = r * IMAGES.length + childIndex;
      const el = document.createElement("div");
      el.className = "mq-item" + (OPTIONS.grabCursor ? " mq-grab" : "");
      if (r > 0) el.setAttribute("aria-hidden", "true");
      const img = document.createElement("img");
      img.src = src;
      img.alt = "Gallery image " + (childIndex + 1);
      img.loading = "lazy";
      img.decoding = "async";
      img.draggable = false;
      el.appendChild(img);
      innerEl.appendChild(el);
      items.push({
        el,
        position: (itemIndex * 100) / itemCount,
        childIndex
      });
    }
  });

  if (!SUPPORTED) {
    wrapEl.classList.add("mq-static");
    return;
  }

  const pathEl = document.getElementById("mqPath");
  if (pathEl) pathEl.setAttribute("d", PATH);
  items.forEach((it) => {
    it.el.style.offsetPath = "path('" + PATH + "')";
  });

  const updateScale = () => {
    const ww = wrapEl.clientWidth;
    const wh = wrapEl.clientHeight;
    const scale = Math.min(ww / VIEWBOX.w, wh / VIEWBOX.h);
    const scaledW = VIEWBOX.w * scale;
    const scaledH = VIEWBOX.h * scale;
    innerEl.style.width = VIEWBOX.w + "px";
    innerEl.style.height = VIEWBOX.h + "px";
    innerEl.style.transform =
      "translate(" + (ww - scaledW) / 2 + "px, " + (wh - scaledH) / 2 + "px) scale(" + scale + ")";
  };
  updateScale();
  window.addEventListener("resize", updateScale);

  let hovered = false;
  let dragging = false;
  let dragVel = 0;
  const lastPos = { x: 0, y: 0 };

  items.forEach((it) => {
    it.el.addEventListener("mouseenter", () => (hovered = true));
    it.el.addEventListener("mouseleave", () => (hovered = false));
  });

  const onPointerDown = (e) => {
    if (!OPTIONS.draggable) return;
    wrapEl.setPointerCapture(e.pointerId);
    dragging = true;
    dragVel = 0;
    lastPos.x = e.clientX;
    lastPos.y = e.clientY;
    if (OPTIONS.grabCursor) wrapEl.classList.add("mq-grabbing");
  };

  const onPointerMove = (e) => {
    if (!OPTIONS.draggable || !dragging) return;
    const dx = e.clientX - lastPos.x;
    const dy = e.clientY - lastPos.y;
    const delta = Math.hypot(dx, dy);
    dragVel = (dx > 0 ? delta : -delta) * OPTIONS.dragSensitivity;
    lastPos.x = e.clientX;
    lastPos.y = e.clientY;
  };

  const onPointerUp = () => {
    dragging = false;
    if (OPTIONS.grabCursor) wrapEl.classList.remove("mq-grabbing");
  };

  wrapEl.addEventListener("pointerdown", onPointerDown);
  wrapEl.addEventListener("pointermove", onPointerMove);
  wrapEl.addEventListener("pointerup", onPointerUp);
  wrapEl.addEventListener("pointercancel", onPointerUp);

  let baseOffset = 0;
  let hoverFactor = 1;
  let last = performance.now();
  let rafId = null;
  const directionFactor = OPTIONS.direction === "normal" ? 1 : -1;

  const render = () => {
    items.forEach((it) => {
      const d = wrap(0, 100, it.position + baseOffset);
      it.el.style.offsetDistance = d + "%";
      if (OPTIONS.enableRollingZIndex) {
        it.el.style.zIndex = String(
          Math.floor(OPTIONS.zIndexBase + (d / 100) * OPTIONS.zIndexRange)
        );
      }
    });
  };

  const step = (now) => {
    const delta = Math.min(now - last, 100);
    last = now;

    const target =
      hovered && OPTIONS.slowdownOnHover ? OPTIONS.slowDownFactor : 1;
    hoverFactor += (target - hoverFactor) * 0.15;

    if (dragging && OPTIONS.draggable) {
      baseOffset += dragVel;
      dragVel *= 0.9;
      if (Math.abs(dragVel) < 0.01) dragVel = 0;
    } else {
      let moveBy =
        directionFactor * OPTIONS.baseVelocity * (delta / 1000) * hoverFactor;
      if (OPTIONS.draggable && Math.abs(dragVel) > 0.01) {
        moveBy += dragVel;
        dragVel *= OPTIONS.dragVelocityDecay;
      }
      baseOffset += moveBy;
    }

    render();
    rafId = requestAnimationFrame(step);
  };

  if (REDUCED) {
    render();
  } else {
    rafId = requestAnimationFrame(step);
  }
})();
