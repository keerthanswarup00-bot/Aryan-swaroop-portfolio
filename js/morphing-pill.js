(() => {
  "use strict";

  const CONFIG = {
    name: "Aryan",
    eyebrow: "Hello, I\u2019m",
    role: "Brand Designer & Creative Lead",
    bio:
      "Multidisciplinary brand designer and creative lead based in Bengaluru, India \u2014 blending brand identity, packaging, 3D visualization, UI/UX, and front-end development into thoughtful digital experiences across real estate, lifestyle, and consumer brands.",
    avatar: "../images/nav-avatar.png",
    website: "https://www.aryanswaroop.com",
    socials: [
      { label: "Website", href: "https://www.aryanswaroop.com", icon: "website" },
      { label: "GitHub", href: "https://github.com/keerthanswarup00-bot", icon: "github" },
      { label: "Behance", href: "https://www.behance.net/Aryan-swaroop", icon: "behance" },
      { label: "LinkedIn", href: "https://www.linkedin.com/in/aryanswaroop/", icon: "linkedin" },
      { label: "Instagram", href: "https://www.instagram.com/arya.nswaroop/", icon: "instagram" },
      { label: "Email", href: "mailto:aryanswaroop.0@gmail.com", icon: "mail" }
    ]
  };

  const SVG_NS = "http://www.w3.org/2000/svg";

  function svg(size, inner) {
    const el = document.createElementNS(SVG_NS, "svg");
    el.setAttribute("viewBox", "0 0 24 24");
    el.setAttribute("width", String(size));
    el.setAttribute("height", String(size));
    el.setAttribute("fill", "none");
    el.setAttribute("stroke", "currentColor");
    el.setAttribute("stroke-width", "2");
    el.setAttribute("stroke-linecap", "round");
    el.setAttribute("stroke-linejoin", "round");
    el.setAttribute("aria-hidden", "true");
    el.innerHTML = inner;
    return el;
  }

  const ICONS = {
    plus: () => svg(25, '<path d="M12 5v14M5 12h14"/>'),
    user: () => svg(22, '<circle cx="12" cy="8" r="4"/><path d="M4.5 21a7.5 7.5 0 0 1 15 0"/>'),
    share: () => svg(22, '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 10.7 6.8-4.1M8.6 13.3l6.8 4.1"/>'),
    back: () => svg(23, '<path d="m15 18-6-6 6-6M9 12h10"/>'),
    backSmall: () => svg(19, '<path d="m15 18-6-6 6-6M9 12h10"/>'),
    website: () => svg(22, '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.5 4 5.6 4 9s-1.5 6.5-4 9c-2.5-2.5-4-5.6-4-9s1.5-6.5 4-9z"/>'),
    github: () => svg(22, '<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3.3-.4 6.8-1.6 6.8-7A5.5 5.5 0 0 0 19.3 4 5.1 5.1 0 0 0 19.2.5S18 0 15 2a13.4 13.4 0 0 0-7 0C5 0 3.8.5 3.8.5A5.1 5.1 0 0 0 3.7 4a5.5 5.5 0 0 0-1.5 3.5c0 5.4 3.5 6.6 6.8 7A4.8 4.8 0 0 0 8 18v4"/><path d="M8 19c-3 .9-3-1.5-4-2"/>'),
    behance: () => svg(22, '<path d="M3 7v10h7.5a4 4 0 0 0 2-7.5A4 4 0 0 0 10.5 7H3z"/><path d="M3 12h5"/><path d="M14 11h7M14 15h5M16 7h6"/>'),
    linkedin: () => svg(22, '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6Z"/><path d="M2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/>'),
    instagram: () => svg(22, '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>'),
    mail: () => svg(22, '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>')
  };

  const shell = document.getElementById("morphShell");
  const panels = {
    compact: document.getElementById("panelCompact"),
    profile: document.getElementById("panelProfile"),
    bio: document.getElementById("panelBio"),
    socials: document.getElementById("panelSocials")
  };
  const live = document.getElementById("morphLive");

  let state = "compact";
  let busy = false;
  let rafId = null;

  const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------------------------------------------------------------------ */
  /* Shell targets (single source of truth for sizes)                    */
  /* ------------------------------------------------------------------ */

  const DESKTOP = {
    compact: { w: 120, h: 62, r: 999 },
    profile: { w: 316, h: 72, r: 999 },
    bio: { w: 474, r: 22 },
    socials: { w: 412, h: 68, r: 999 }
  };

  const MOBILE = {
    compact: { w: 116, h: 60, r: 999 },
    profile: { w: null, h: 68, r: 999 },
    bio: { w: null, r: 24 },
    socials: { w: null, h: 66, r: 999 }
  };

  function isMobile() {
    return window.innerWidth < 560;
  }

  function measureBio(width) {
    const card = panels.bio.querySelector(".bio-card");
    if (!card) return 150;
    const s = card.style;
    s.flex = "0 0 auto";
    s.width = width + "px";
    s.height = "auto";
    const h = Math.max(150, card.offsetHeight);
    s.flex = "";
    s.width = "";
    s.height = "";
    return h;
  }

  function measureSocials() {
    const panel = panels.socials;
    const s = panel.style;
    s.width = "max-content";
    s.height = "max-content";
    const box = { w: panel.offsetWidth, h: panel.offsetHeight };
    s.width = "";
    s.height = "";
    return box;
  }

  function targets(next) {
    const t = { ...(isMobile() ? MOBILE : DESKTOP)[next] };
    const w = isMobile() ? window.innerWidth : 0;
    if (isMobile()) {
      if (next === "profile") t.w = Math.min(312, w - 28);
      else if (next === "bio") t.w = w - 28;
    }
    if (next === "bio") {
      t.h = measureBio(t.w);
    } else if (next === "socials") {
      const snug = measureSocials();
      t.w = snug.w;
      t.h = snug.h;
    }
    return t;
  }

  /* ------------------------------------------------------------------ */
  /* Spring engine (width, height, border-radius in one rAF loop)        */
  /* ------------------------------------------------------------------ */

  const STIFFNESS = 260;
  const DAMPING = 22;

  function morphTo(target) {
    if (rafId) cancelAnimationFrame(rafId);

    const fromW = shell.offsetWidth;
    const fromH = shell.offsetHeight;
    const fromR = parseFloat(getComputedStyle(shell).borderRadius) || 999;

    if (REDUCED) {
      shell.style.width = target.w + "px";
      shell.style.height = target.h + "px";
      shell.style.borderRadius = target.r + "px";
      busy = false;
      return;
    }

    let w = fromW;
    let h = fromH;
    let r = fromR;
    let vw = 0;
    let vh = 0;
    let vr = 0;
    let last = performance.now();

    function step(now) {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      vw += ((target.w - w) * STIFFNESS - vw * DAMPING) * dt;
      w += vw * dt;
      vh += ((target.h - h) * STIFFNESS - vh * DAMPING) * dt;
      h += vh * dt;
      vr += ((target.r - r) * STIFFNESS - vr * DAMPING) * dt;
      r += vr * dt;

      shell.style.width = w + "px";
      shell.style.height = h + "px";
      shell.style.borderRadius = r + "px";

      const settled =
        Math.abs(target.w - w) < 0.4 && Math.abs(vw) < 0.4 &&
        Math.abs(target.h - h) < 0.4 && Math.abs(vh) < 0.4 &&
        Math.abs(target.r - r) < 0.4 && Math.abs(vr) < 0.4;

      if (!settled) {
        rafId = requestAnimationFrame(step);
      } else {
        shell.style.width = target.w + "px";
        shell.style.height = target.h + "px";
        shell.style.borderRadius = target.r + "px";
        rafId = null;
        busy = false;
      }
    }

    rafId = requestAnimationFrame(step);
  }

  /* ------------------------------------------------------------------ */
  /* Rendering                                                           */
  /* ------------------------------------------------------------------ */

  function avatar(size) {
    const span = document.createElement("span");
    span.className = "mp-avatar";
    span.style.width = size + "px";
    span.style.height = size + "px";
    const img = document.createElement("img");
    img.src = CONFIG.avatar;
    img.alt = CONFIG.name;
    img.width = size;
    img.height = size;
    img.draggable = false;
    img.decoding = "async";
    span.appendChild(img);
    return span;
  }

  function roundButton(label, background, glow, icon, onClick) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "mp-round";
    btn.style.setProperty("--mp-bg", background);
    btn.style.setProperty("--mp-glow", glow);
    btn.setAttribute("aria-label", label);
    btn.title = label;
    btn.appendChild(ICONS[icon]());
    btn.addEventListener("click", onClick);
    return btn;
  }

  function buildCompact() {
    panels.compact.appendChild(avatar(48));
    panels.compact.appendChild(
      roundButton("Open profile", "#27c95f", "rgba(39,201,95,0.55)", "plus", () => go("profile"))
    );
  }

  function buildProfile() {
    const panel = panels.profile;

    const avatarBtn = document.createElement("button");
    avatarBtn.type = "button";
    avatarBtn.className = "mp-avatar-btn";
    avatarBtn.setAttribute("aria-label", "Collapse profile");
    avatarBtn.title = "Collapse profile";
    avatarBtn.appendChild(avatar(54));
    avatarBtn.addEventListener("click", () => go("compact"));
    panel.appendChild(avatarBtn);

    const meta = document.createElement("div");
    meta.className = "profile-meta";
    const eyebrow = document.createElement("div");
    eyebrow.className = "profile-eyebrow";
    eyebrow.textContent = CONFIG.eyebrow;
    const name = document.createElement("div");
    name.className = "profile-name";
    name.textContent = CONFIG.name;
    meta.appendChild(eyebrow);
    meta.appendChild(name);
    panel.appendChild(meta);

    const actions = document.createElement("div");
    actions.className = "profile-actions";
    actions.appendChild(
      roundButton("About", "#ff8a00", "rgba(255,138,0,0.5)", "user", () => go("bio"))
    );
    actions.appendChild(
      roundButton("Social links", "#1689fe", "rgba(22,137,254,0.5)", "share", () => go("socials"))
    );
    panel.appendChild(actions);
  }

  function buildBio() {
    const panel = panels.bio;
    const card = document.createElement("button");
    card.type = "button";
    card.className = "bio-card";
    card.setAttribute("aria-label", "Return to profile");
    card.title = "Return to profile";
    card.addEventListener("click", () => go("profile"));

    const head = document.createElement("span");
    head.className = "bio-head";
    head.appendChild(avatar(48));

    const meta = document.createElement("span");
    meta.className = "bio-meta";
    const eyebrow = document.createElement("span");
    eyebrow.className = "bio-eyebrow";
    eyebrow.textContent = CONFIG.eyebrow + " \u2014 " + CONFIG.role;
    const name = document.createElement("span");
    name.className = "bio-name";
    name.textContent = CONFIG.name;
    meta.appendChild(eyebrow);
    meta.appendChild(name);
    head.appendChild(meta);

    const arrow = ICONS.backSmall();
    arrow.classList.add("bio-back-icon");
    head.appendChild(arrow);

    const text = document.createElement("span");
    text.className = "bio-text";
    text.textContent = CONFIG.bio;

    card.appendChild(head);
    card.appendChild(text);
    panel.appendChild(card);
  }

  function buildSocials() {
    const panel = panels.socials;

    const back = document.createElement("button");
    back.type = "button";
    back.className = "mp-back";
    back.setAttribute("aria-label", "Back to profile");
    back.title = "Back to profile";
    back.appendChild(ICONS.back());
    back.addEventListener("click", () => go("profile"));
    panel.appendChild(back);

    CONFIG.socials.forEach((item, index) => {
      const a = document.createElement("a");
      a.className = "mp-soc";
      a.href = item.href;
      a.setAttribute("aria-label", item.label);
      a.title = item.label;
      if (!item.href.startsWith("mailto:")) {
        a.target = "_blank";
        a.rel = "noopener noreferrer";
      }
      a.style.setProperty("--i", String(index));
      a.appendChild(ICONS[item.icon]());
      panel.appendChild(a);
    });
  }

  /* ------------------------------------------------------------------ */
  /* State machine                                                       */
  /* ------------------------------------------------------------------ */

  const MESSAGES = {
    compact: "Profile collapsed. Press the green button to open it.",
    profile: "Profile open. The avatar closes it. The orange button opens a biography. The blue button opens social links.",
    bio: "Biography open. Press anywhere on the card to return to the profile.",
    socials: "Social links open. Press the back arrow to return to the profile."
  };

  function announce(next) {
    if (live) live.textContent = MESSAGES[next];
  }

  function setActive(next) {
    Object.keys(panels).forEach((key) => {
      panels[key].classList.toggle("is-active", key === next);
    });
    shell.dataset.state = next;
  }

  function go(next) {
    if (busy || next === state) return;
    busy = true;
    state = next;
    setActive(next);
    announce(next);
    morphTo(targets(next));
  }

  window.addEventListener("resize", () => {
    if (busy) return;
    morphTo(targets(state));
  });

  buildCompact();
  buildProfile();
  buildBio();
  buildSocials();
  setActive("compact");
  morphTo(targets("compact"));
})();
