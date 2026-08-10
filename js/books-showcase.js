/* Books Showcase — vanilla three.js port of the React "BooksShowcase"
   component (interactive 3D bookshelf). Uses js/vendor/three.module.min.js,
   the same build as scroll-dissolve. No runtime deps, no inline handlers.
   Reduced-motion / no-WebGL / no-JS all degrade to the static list.
   -----------------------------------------------------------------
   To change the books: edit the BOOKS array below. Each book gets a
   procedural cover by default; add `images: { front, back, spine }`
   (paths relative to the page) to use real cover art instead.
    The two placeholder titles are waiting on cover art from Aryan. */

import * as THREE from './vendor/three.module.min.js';

(function () {
  'use strict';

  var BOOKS = [
    {
      id: 'realtors-edge',
      title: 'The Realtor\u2019s Edge',
      author: 'Aryan Swaroop',
      year: '2026',
      stars: 5,
      desc: 'A launch playbook built from four real real-estate campaigns — identity, 3D, film and the funnel that produced 302 leads in 66 days. Every page is field-tested, not theory.',
      link: '/Realtors_Edge_Playbook.pdf',
      linkLabel: 'View',
      front: paintRealtorsFront,
      images: { front: 'images/realtors-edge-cover.png' },
      edge: '#d9cfa9',
      backBg: '#131c38',
      backInk: '246,226,160',
      spineBg: '#16213e',
      spineInk: '#f6e2a0',
      spineFont: '700 38px Georgia',
      chapters: ['Positioning & Launch', 'The Identity System', '3D & Film', 'Campaign Mechanics', 'The Lead Funnel', 'Results & Learnings'],
    },
    {
      id: 'brand-casebook',
      title: 'The Brand Casebook',
      author: 'Aryan Swaroop',
      year: '2026',
      stars: 4,
      desc: 'Selected brand stories and the thinking behind them — identity, packaging and campaigns. Cover art coming soon.',
      edge: '#e5d6da',
      backBg: '#5b2a3c',
      backInk: '243,217,224',
      spineBg: '#5b2a3c',
      spineInk: '#f3d9e0',
      spineFont: '700 38px Georgia',
    },
    {
      id: 'creative-notes',
      title: 'Notes on Creative Work',
      author: 'Aryan Swaroop',
      year: '2026',
      stars: 4,
      desc: 'Process notes across identity, motion and 3D — the small rules that make work feel finished. Cover art coming soon.',
      edge: '#d4e4e8',
      backBg: '#25404b',
      backInk: '214,238,242',
      spineBg: '#25404b',
      spineInk: '#d6eef2',
      spineFont: '700 38px Georgia',
    },
  ];

  var root = document.getElementById('books-showcase');
  if (!root || root.dataset.bsInit) return;
  root.dataset.bsInit = '1';
  document.documentElement.classList.add('js');

  var nojs = root.querySelector('.bs-nojs');
  if (nojs) nojs.remove();

  var RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var N = BOOKS.length;
  if (!N) return;

  /* --------------------------------------------------------------
     Small utilities
     -------------------------------------------------------------- */
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  class Spring {
    constructor(v, k, d) {
      this.v = v;
      this.t = v;
      this.vel = 0;
      this.k = k || 120;
      this.d = d || 14;
    }
    set(v) {
      this.v = v;
      this.t = v;
      this.vel = 0;
      return this;
    }
    update(dt) {
      var a = this.k * (this.t - this.v) - this.d * this.vel;
      this.vel += a * dt;
      this.v += this.vel * dt;
      return this.v;
    }
  }

  function mkCanvas(w, h) {
    var c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    return c;
  }

  function drawSpaced(x, text, cx, y, ls) {
    var prev = x.textAlign;
    x.textAlign = 'left';
    var chars = Array.from(text);
    var tot = 0;
    var ws = chars.map(function (ch) {
      var w = x.measureText(ch).width;
      tot += w;
      return w;
    });
    tot += ls * (chars.length - 1);
    var px = cx - tot / 2;
    chars.forEach(function (ch, i) {
      x.fillText(ch, px, y);
      px += ws[i] + ls;
    });
    x.textAlign = prev;
  }

  function rr(x, px, py, w, h, r) {
    x.beginPath();
    x.moveTo(px + r, py);
    x.arcTo(px + w, py, px + w, py + h, r);
    x.arcTo(px + w, py + h, px, py + h, r);
    x.arcTo(px, py + h, px, py, r);
    x.arcTo(px, py, px + w, py, r);
    x.closePath();
  }

  function trimToWidth(x, text, maxW) {
    if (x.measureText(text).width <= maxW) return text;
    var t = text;
    while (t.length > 1 && x.measureText(t + '...').width > maxW) t = t.slice(0, -1);
    return t + '...';
  }

  /* --------------------------------------------------------------
     Canvas + DOM shell for the detail panel
     -------------------------------------------------------------- */
  root.innerHTML =
    '<canvas class="bs-canvas" aria-hidden="true"></canvas>' +
    '<div class="bs-hero-word" aria-hidden="true"><span>Playbooks</span></div>' +
    '<button type="button" class="bs-open-pill" tabindex="-1" aria-hidden="true">Open</button>' +
    '<button type="button" class="bs-close" aria-label="Close detail view">&#10005;</button>' +
    '<div class="bs-detail" aria-live="polite">' +
      '<div class="bs-detail-inner">' +
        '<h3 class="bs-detail-title"></h3>' +
        '<p class="bs-detail-desc"></p>' +
        '<div class="bs-detail-meta">' +
          '<span class="bs-detail-stars" aria-label="Star rating"></span>' +
          '<span class="bs-detail-rule" aria-hidden="true"></span>' +
          '<span class="bs-detail-label">Goodreads</span>' +
          '<span class="bs-detail-year"></span>' +
        '</div>' +
        '<div class="bs-detail-divider" aria-hidden="true"></div>' +
        '<div class="bs-detail-actions"></div>' +
      '</div>' +
    '</div>';

  var canvasEl = root.querySelector('.bs-canvas');
  var heroWord = root.querySelector('.bs-hero-word');
  var openBtn = root.querySelector('.bs-open-pill');
  var closeBtn = root.querySelector('.bs-close');
  var detailEl = root.querySelector('.bs-detail');
  var detailTitle = root.querySelector('.bs-detail-title');
  var detailDesc = root.querySelector('.bs-detail-desc');
  var detailStars = root.querySelector('.bs-detail-stars');
  var detailYear = root.querySelector('.bs-detail-year');
  var detailActions = root.querySelector('.bs-detail-actions');

  /* --------------------------------------------------------------
     Renderer, scene, camera, lights
     -------------------------------------------------------------- */
  var renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas: canvasEl, antialias: true, alpha: true });
  } catch (err) {
    root.classList.add('bs-webgl-fail');
    root.textContent = '';
    var fail = document.createElement('div');
    fail.className = 'bs-fallback';
    fail.innerHTML = '<h3>3D bookshelf unavailable</h3><p>This experience needs WebGL, which your browser blocked or does not support. The books are listed below instead.</p>';
    var list = document.createElement('ul');
    BOOKS.forEach(function (b) {
      var li = document.createElement('li');
      var a = document.createElement('a');
      a.href = b.link || '#books-showcase';
      a.textContent = b.title + (b.link ? '' : ' (coming soon)');
      li.appendChild(a);
      list.appendChild(li);
    });
    fail.appendChild(list);
    root.appendChild(fail);
    throw new Error('BooksShowcase: WebGL unavailable');
  }

  var dims = { w: 0, h: 0 };
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.92;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  var ANISO = renderer.capabilities.getMaxAnisotropy();

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(26, 1, 0.1, 100);
  camera.position.set(0, 0.1, 9.6);

  function envBlob(x, cx, cy, r, rgb, a) {
    var g = x.createRadialGradient(cx, cy, 0, cx, cy, r);
    g.addColorStop(0, 'rgba(' + rgb + ',' + a + ')');
    g.addColorStop(1, 'rgba(' + rgb + ',0)');
    x.fillStyle = g;
    x.beginPath();
    x.arc(cx, cy, r, 0, 6.2832);
    x.fill();
  }
  (function buildEnv() {
    var c = mkCanvas(512, 256);
    var x = c.getContext('2d');
    var g = x.createLinearGradient(0, 0, 0, 256);
    g.addColorStop(0, '#5a6ba6');
    g.addColorStop(0.55, '#262e52');
    g.addColorStop(1, '#0a0d1d');
    x.fillStyle = g;
    x.fillRect(0, 0, 512, 256);
    envBlob(x, 140, 66, 95, '255,255,255', 0.95);
    envBlob(x, 405, 84, 55, '255,214,168', 0.55);
    envBlob(x, 256, 150, 120, '255,155,185', 0.28);
    var tx = new THREE.CanvasTexture(c);
    tx.mapping = THREE.EquirectangularReflectionMapping;
    var pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromEquirectangular(tx).texture;
    tx.dispose();
    pmrem.dispose();
  })();

  var hemi = new THREE.HemisphereLight(0x8fa0d8, 0x0d1024, 0.32);
  scene.add(hemi);
  var key = new THREE.DirectionalLight(0xffffff, 0.82);
  key.position.set(3.5, 5, 6);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.camera.left = -4;
  key.shadow.camera.right = 4;
  key.shadow.camera.top = 4;
  key.shadow.camera.bottom = -4;
  key.shadow.camera.near = 1;
  key.shadow.camera.far = 20;
  key.shadow.bias = -0.0004;
  key.shadow.normalBias = 0.02;
  scene.add(key);
  var fillLight = new THREE.DirectionalLight(0xa9b6ff, 0.2);
  fillLight.position.set(-4, 1, 4);
  scene.add(fillLight);
  var rim = new THREE.DirectionalLight(0xff9db8, 0.3);
  rim.position.set(-2, 3, -5);
  scene.add(rim);

  var bookRoot = new THREE.Group();
  scene.add(bookRoot);

  /* --------------------------------------------------------------
     Shared procedural textures
     -------------------------------------------------------------- */
  function tex(c) {
    var t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = ANISO;
    return t;
  }

  function loadOrPaint(material, imageURL, paintFallback) {
    material.map = tex(paintFallback());
    material.needsUpdate = true;
    if (!imageURL) return;
    new THREE.TextureLoader().setCrossOrigin('anonymous').load(
      imageURL,
      function (t) {
        t.colorSpace = THREE.SRGBColorSpace;
        t.anisotropy = ANISO;
        material.map = t;
        material.needsUpdate = true;
      },
      undefined,
      function () { /* kept fallback */ },
    );
  }

  function noiseTexture(base, amp, scratches) {
    var s = 256;
    var c = mkCanvas(s, s);
    var x = c.getContext('2d');
    var img = x.createImageData(s, s);
    var d = img.data;
    for (var i = 0; i < d.length; i += 4) {
      var v = base + (Math.random() - 0.5) * 2 * amp;
      d[i] = d[i + 1] = d[i + 2] = v;
      d[i + 3] = 255;
    }
    x.putImageData(img, 0, 0);
    if (scratches) {
      x.strokeStyle = 'rgba(200,200,200,.25)';
      x.lineWidth = 1;
      for (var s2 = 0; s2 < 5; s2++) {
        x.beginPath();
        var y = Math.random() * s;
        x.moveTo(0, y);
        x.lineTo(s, y + (Math.random() - 0.5) * 22);
        x.stroke();
      }
    }
    return new THREE.CanvasTexture(c);
  }
  var laminateBump = noiseTexture(128, 10, true);
  var clothBump = (function () {
    var s = 128;
    var c = mkCanvas(s, s);
    var x = c.getContext('2d');
    x.fillStyle = '#808080';
    x.fillRect(0, 0, s, s);
    for (var i = 0; i < s; i += 2) {
      x.fillStyle = i % 4 === 0 ? 'rgba(255,255,255,.22)' : 'rgba(0,0,0,.22)';
      x.fillRect(i, 0, 1, s);
      x.fillRect(0, i, s, 1);
    }
    return new THREE.CanvasTexture(c);
  })();

  function striationTexture(vertical) {
    var s = 512;
    var c = mkCanvas(s, s);
    var x = c.getContext('2d');
    x.fillStyle = '#ece4d2';
    x.fillRect(0, 0, s, s);
    var p = 0;
    while (p < s) {
      var w = 1 + Math.random() * 2.4;
      var tone = Math.random();
      x.fillStyle =
        tone < 0.12 ? 'rgba(140,125,95,.5)' : tone < 0.5 ? 'rgba(255,255,252,.55)' : 'rgba(190,178,150,.45)';
      if (vertical) x.fillRect(p, 0, w, s);
      else x.fillRect(0, p, s, w);
      p += w + 0.6 + Math.random() * 1.6;
    }
    for (var i = 0; i < 2600; i++) {
      x.fillStyle = 'rgba(120,108,84,' + (Math.random() * 0.1).toFixed(3) + ')';
      x.fillRect(Math.random() * s, Math.random() * s, 1.2, 1.2);
    }
    return tex(c);
  }
  var striV = striationTexture(true);
  var striH = striationTexture(false);

  var endpaperTex = (function () {
    var s = 512;
    var c = mkCanvas(s, s);
    var x = c.getContext('2d');
    x.fillStyle = '#f3edde';
    x.fillRect(0, 0, s, s);
    for (var i = 0; i < 1400; i++) {
      x.fillStyle = 'rgba(120,105,70,' + (0.04 + Math.random() * 0.08).toFixed(3) + ')';
      x.fillRect(Math.random() * s, Math.random() * s, 1.4, 1.4);
    }
    var g = x.createLinearGradient(0, 0, s, 0);
    g.addColorStop(0, 'rgba(0,0,0,.07)');
    g.addColorStop(0.12, 'rgba(0,0,0,0)');
    g.addColorStop(0.88, 'rgba(0,0,0,0)');
    g.addColorStop(1, 'rgba(0,0,0,.07)');
    x.fillStyle = g;
    x.fillRect(0, 0, s, s);
    return tex(c);
  })();

  var blobTex = (function () {
    var s = 256;
    var c = mkCanvas(s, s);
    var x = c.getContext('2d');
    var g = x.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
    g.addColorStop(0, 'rgba(0,0,0,.85)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    x.fillStyle = g;
    x.fillRect(0, 0, s, s);
    return new THREE.CanvasTexture(c);
  })();

  /* --------------------------------------------------------------
     Cover painters
     -------------------------------------------------------------- */
  function paintDefaultFront(x, w, h, o) {
    x.fillStyle = o.bg;
    x.fillRect(0, 0, w, h);
    x.fillStyle = 'rgba(255,255,255,0.06)';
    for (var i = 0; i < 40; i++) x.fillRect(Math.random() * w, Math.random() * h, 2, 2);
    x.fillStyle = '#ffffff';
    x.textAlign = 'center';
    x.font = '700 76px Georgia';
    var words = o.title.split(' ');
    var line = '';
    var lines = [];
    words.forEach(function (word) {
      var test = line ? line + ' ' + word : word;
      if (x.measureText(test).width > w * 0.8 && line) {
        lines.push(line);
        line = word;
      } else line = test;
    });
    if (line) lines.push(line);
    var startY = h * 0.42 - ((lines.length - 1) * 88) / 2;
    lines.forEach(function (l, i) { x.fillText(l, w / 2, startY + i * 88); });
    x.globalAlpha = 0.85;
    x.font = 'italic 40px Georgia';
    x.fillText(o.author, w / 2, startY + lines.length * 88 + 60);
    x.globalAlpha = 1;
    x.strokeStyle = 'rgba(255,255,255,0.4)';
    x.lineWidth = 3;
    x.strokeRect(60, 60, w - 120, h - 120);
  }

  /* The real-estate playbook front cover */
  function paintRealtorsFront(x, w, h) {
    var g = x.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, '#1d2a4e');
    g.addColorStop(0.6, '#131c38');
    g.addColorStop(1, '#0b1126');
    x.fillStyle = g;
    x.fillRect(0, 0, w, h);

    x.strokeStyle = 'rgba(246,226,160,0.07)';
    x.lineWidth = 1;
    for (var i = 1; i < 8; i++) {
      x.beginPath();
      x.moveTo(0, (h / 8) * i);
      x.lineTo(w, (h / 8) * i);
      x.stroke();
    }

    x.fillStyle = 'rgba(10,14,32,0.55)';
    x.fillRect(0, h * 0.68, w, h * 0.32);
    x.fillStyle = 'rgba(18,26,52,0.9)';
    var bh = [34, 52, 28, 70, 44, 60, 38];
    var bw = w / 11;
    for (var j = 0; j < bh.length; j++) {
      x.fillRect(j * bw * 1.35 + bw * 0.4, h * 0.84 - bh[j] * 2.4, bw * 0.8, bh[j] * 2.4);
    }
    x.fillStyle = 'rgba(246,226,160,0.16)';
    for (var k = 1; k < 4; k++) {
      x.fillRect(0, h * (0.68 + k * 0.085), w, 1.5);
    }

    x.textAlign = 'center';
    x.fillStyle = '#f6e2a0';
    x.font = '700 88px Georgia';
    x.fillText('THE REALTOR\u2019S', w / 2, h * 0.3);
    x.fillText('EDGE', w / 2, h * 0.3 + 92);

    x.fillStyle = 'rgba(246,226,160,0.9)';
    x.font = '600 44px Arial';
    drawSpaced(x, 'PLAYBOOK', w / 2, h * 0.44, 18);

    x.fillStyle = 'rgba(233,240,255,0.85)';
    x.font = 'italic 42px Georgia';
    x.fillText('ARYAN SWAROOP', w / 2, h * 0.84);

    x.strokeStyle = 'rgba(246,226,160,0.55)';
    x.lineWidth = 4;
    x.strokeRect(56, 56, w - 112, h - 112);
    x.strokeStyle = 'rgba(246,226,160,0.18)';
    x.strokeRect(74, 74, w - 148, h - 148);
  }

  function paintBack(x, w, h, o) {
    x.fillStyle = o.backBg;
    x.fillRect(0, 0, w, h);
    x.fillStyle = 'rgba(' + o.backInk + ',.5)';
    rr(x, 150, 190, w - 460, 28, 14);
    x.fill();
    for (var i = 0; i < 9; i++) {
      var lw = i === 8 ? w - 560 : w - 300 - Math.random() * 180;
      x.fillStyle = 'rgba(' + o.backInk + ',.2)';
      rr(x, 150, 300 + i * 56, lw, 15, 7);
      x.fill();
    }
    x.fillStyle = 'rgba(' + o.backInk + ',.45)';
    x.beginPath();
    x.arc(178, h - 186, 26, 0, 6.2832);
    x.fill();
    x.fillStyle = '#fff';
    rr(x, w - 330, h - 262, 236, 152, 8);
    x.fill();
    x.fillStyle = '#111';
    var bx = w - 310;
    while (bx < w - 118) {
      var bw = 2 + Math.random() * 6;
      if (Math.random() > 0.42) x.fillRect(bx, h - 242, bw, 96);
      bx += bw + 2 + Math.random() * 4;
    }
    x.font = '500 21px Arial';
    x.textAlign = 'center';
    x.fillText('9 781234 567890', w - 212, h - 124);
    x.textAlign = 'left';
  }

  function paintSpine(x, w, h, o) {
    x.fillStyle = o.spineBg;
    x.fillRect(0, 0, w, h);
    x.save();
    x.translate(w / 2, h / 2);
    x.rotate(Math.PI / 2);
    x.fillStyle = o.spineInk;
    x.font = o.spineFont;
    drawSpaced(x, o.title.toUpperCase(), -h * 0.1, 15, 6);
    x.globalAlpha = 0.85;
    x.font = '600 25px Arial';
    drawSpaced(x, o.author.toUpperCase(), h * 0.325, 9, 4);
    x.globalAlpha = 1;
    x.restore();
    x.fillStyle = o.spineInk;
    x.globalAlpha = 0.6;
    x.fillRect(w / 2 - 26, 92, 52, 3);
    x.fillRect(w / 2 - 26, h - 95, 52, 3);
    x.globalAlpha = 1;
  }

  function makeIndexPageTex(chapters) {
    var w = 1024;
    var h = 1536;
    var c = mkCanvas(w, h);
    var x = c.getContext('2d');
    x.fillStyle = '#f4efdf';
    x.fillRect(0, 0, w, h);
    x.fillStyle = 'rgba(130,110,80,0.07)';
    for (var i = 0; i < 1600; i++) x.fillRect(Math.random() * w, Math.random() * h, 1.1, 1.1);
    x.fillStyle = '#2f2a23';
    x.textAlign = 'center';
    x.font = '700 84px Georgia';
    x.fillText('INDEX', w / 2, 190);
    x.globalAlpha = 0.26;
    x.fillRect(220, 225, w - 440, 3);
    x.globalAlpha = 1;

    var list = chapters && chapters.length
      ? chapters
      : ['Introduction', 'Main Ideas', 'Practical Lessons', 'Case Studies', 'Takeaways', 'Final Notes'];
    x.textAlign = 'left';
    x.font = '500 46px Georgia';
    var y = 318;
    for (var li = 0; li < list.length; li++) {
      var n = String(li + 1).padStart(2, '0');
      var pageNo = String(7 + li * 14).padStart(3, ' ');
      var left = n + '. ' + trimToWidth(x, list[li], 650);
      x.fillStyle = '#2f2a23';
      x.fillText(left, 150, y);
      x.textAlign = 'right';
      x.fillStyle = '#5d5043';
      x.fillText(pageNo, w - 150, y);
      x.textAlign = 'left';
      x.globalAlpha = 0.22;
      x.fillRect(150, y + 16, w - 300, 2);
      x.globalAlpha = 1;
      y += 112;
    }
    return tex(c);
  }

  /* --------------------------------------------------------------
     Book construction
     -------------------------------------------------------------- */
  var W = 1.42;
  var H = 2.14;
  var T = 0.34;
  var CT = 0.032;
  var OV = 0.05;
  var PAGE_N = 12;
  var PW = W - 0.02;
  var PH = H - 0.02;
  var BLOCK_D = 0.245;
  var BLOCK_Z = -0.0205;
  var PIVOT_Z = T / 2 + CT / 2;
  var BPIVOT_Z = -(T / 2 + CT / 2);
  var HINGE_OVERLAP = 0.05;

  var coverGeo = new THREE.BoxGeometry(W + OV, H + OV * 2, CT);
  var blockGeo = new THREE.BoxGeometry(W - 0.015, H, BLOCK_D);
  var pageGeo = new THREE.PlaneGeometry(PW, PH);
  var spineGeo = new THREE.BoxGeometry(0.028, H + OV * 2, T + CT * 2 + 0.006);
  var hitGeo = new THREE.BoxGeometry(1.8, 2.5, 1.15);
  var blobGeo = new THREE.PlaneGeometry(1, 1);
  var hitMat = new THREE.MeshBasicMaterial({ visible: false });

  function std(o) {
    return new THREE.MeshStandardMaterial(Object.assign({ metalness: 0.02 }, o));
  }

  var paperFlat = std({ color: 0xf2ecdd, roughness: 0.95, envMapIntensity: 0.2 });
  var striMatV = std({ map: striV, bumpMap: striV, bumpScale: 0.0025, roughness: 0.95, envMapIntensity: 0.2 });
  var striMatH = std({ map: striH, bumpMap: striH, bumpScale: 0.0025, roughness: 0.95, envMapIntensity: 0.2 });
  var endpaperMat = std({ map: endpaperTex, roughness: 0.9, envMapIntensity: 0.25 });
  var pageMats = [0xf4eee0, 0xf1ebdb, 0xf6f0e3].map(function (c) {
    return std({ color: c, roughness: 0.92, envMapIntensity: 0.22, side: THREE.DoubleSide });
  });

  var bookInstances = [];
  var hitMeshes = [];

  function buildBook(cfg, index) {
    var rootG = new THREE.Group();
    var floatG = new THREE.Group();
    rootG.add(floatG);
    bookRoot.add(rootG);

    var indexPageMat = std({ map: makeIndexPageTex(cfg.chapters), roughness: 0.92, envMapIntensity: 0.2, side: THREE.DoubleSide });

    var edgeColor = cfg.edge || '#eee4cf';
    var mEdge = std({ color: edgeColor, bumpMap: laminateBump, bumpScale: 0.0035, roughness: 0.68, envMapIntensity: 0.3 });
    var mFront = std({ bumpMap: laminateBump, bumpScale: 0.0035, roughness: 0.54, envMapIntensity: 0.28 });
    var mBack = std({ bumpMap: laminateBump, bumpScale: 0.0035, roughness: 0.58, envMapIntensity: 0.26 });
    var mSpine = std({ bumpMap: clothBump, bumpScale: 0.006, roughness: 0.78, envMapIntensity: 0.22 });

    loadOrPaint(mFront, cfg.images && cfg.images.front, function () {
      var c = mkCanvas(1024, 1536);
      var ctx = c.getContext('2d');
      if (cfg.front) cfg.front(ctx, 1024, 1536);
      else paintDefaultFront(ctx, 1024, 1536, { title: cfg.title, author: cfg.author, bg: cfg.spineBg || cfg.backBg || '#22252b' });
      return c;
    });
    loadOrPaint(mBack, cfg.images && cfg.images.back, function () {
      var c = mkCanvas(1024, 1536);
      var ctx = c.getContext('2d');
      if (cfg.back) cfg.back(ctx, 1024, 1536);
      else paintBack(ctx, 1024, 1536, { backBg: cfg.backBg || '#22252b', backInk: cfg.backInk || '255,255,255' });
      return c;
    });
    loadOrPaint(mSpine, cfg.images && cfg.images.spine, function () {
      var c = mkCanvas(220, 1536);
      var ctx = c.getContext('2d');
      if (cfg.spine) cfg.spine(ctx, 220, 1536);
      else
        paintSpine(ctx, 220, 1536, {
          spineBg: cfg.spineBg || cfg.backBg || '#22252b',
          spineInk: cfg.spineInk || '#ffffff',
          spineFont: cfg.spineFont || '700 42px Georgia',
          title: cfg.title,
          author: cfg.author,
        });
      return c;
    });

    var backPivot = new THREE.Group();
    backPivot.position.set(-W / 2 - HINGE_OVERLAP, 0, BPIVOT_Z);
    var backMesh = new THREE.Mesh(coverGeo, [mEdge, mEdge, mEdge, mEdge, endpaperMat, mBack]);
    backMesh.position.x = (W + OV) / 2;
    backMesh.castShadow = backMesh.receiveShadow = true;
    backPivot.add(backMesh);
    floatG.add(backPivot);

    var pivot = new THREE.Group();
    pivot.position.set(-W / 2 - HINGE_OVERLAP, 0, PIVOT_Z);
    var frontMesh = new THREE.Mesh(coverGeo, [mEdge, mEdge, mEdge, mEdge, mFront, endpaperMat]);
    frontMesh.position.x = (W + OV) / 2;
    frontMesh.castShadow = frontMesh.receiveShadow = true;
    pivot.add(frontMesh);
    floatG.add(pivot);

    var spine = new THREE.Mesh(spineGeo, mSpine);
    spine.position.set(-W / 2 - 0.013, 0, 0);
    spine.castShadow = true;
    floatG.add(spine);

    var block = new THREE.Mesh(blockGeo, [striMatV, paperFlat, striMatH, striMatH, paperFlat, paperFlat]);
    block.position.set(-0.0075, 0, BLOCK_Z);
    block.castShadow = block.receiveShadow = true;
    floatG.add(block);

    var pages = [];
    var pageF = [];
    for (var i = 0; i < PAGE_N; i++) {
      var pp = new THREE.Group();
      pp.position.set(-W / 2 + 0.01, (Math.random() - 0.5) * 0.006, 0.166 - i * 0.0042);
      var pm = new THREE.Mesh(pageGeo, i === 0 ? indexPageMat : pageMats[i % 3]);
      pm.position.x = PW / 2;
      pm.rotation.z = (Math.random() - 0.5) * 0.006;
      pp.add(pm);
      floatG.add(pp);
      pages.push(pp);
      pageF.push(0.3 * Math.pow(1 - i / PAGE_N, 2.6));
    }

    var pagesB = [];
    var pageFB = [];
    for (var j = 0; j < 6; j++) {
      var pb = new THREE.Group();
      pb.position.set(-W / 2 + 0.01, (Math.random() - 0.5) * 0.006, -0.166 + j * 0.0042);
      var pbMesh = new THREE.Mesh(pageGeo, pageMats[j % 3]);
      pbMesh.position.x = PW / 2;
      pbMesh.rotation.z = (Math.random() - 0.5) * 0.006;
      pb.add(pbMesh);
      floatG.add(pb);
      pagesB.push(pb);
      pageFB.push(0.3 * Math.pow(1 - j / 6, 2.6));
    }

    var blob = new THREE.Mesh(
      blobGeo,
      new THREE.MeshBasicMaterial({ map: blobTex, transparent: true, opacity: 0.45, depthWrite: false }),
    );
    blob.scale.set(3.1, 3.9, 1);
    blob.position.set(0.1, -0.3, -0.85);
    blob.renderOrder = -5;
    rootG.add(blob);

    var hit = new THREE.Mesh(hitGeo, hitMat);
    floatG.add(hit);

    var springs = {
      px: new Spring(0, 17, 6.8),
      py: new Spring(0, 17, 6.8),
      pz: new Spring(0, 17, 6.8),
      rx: new Spring(0, 17, 6.8),
      ry: new Spring(0, 17, 6.8),
      rz: new Spring(0, 17, 6.8),
      sc: new Spring(1, 17, 6.8),
      tiltX: new Spring(0, 120, 13),
      tiltY: new Spring(0, 120, 13),
      lift: new Spring(0, 120, 13),
      cover: new Spring(0, 90, 12),
      coverB: new Spring(0, 90, 12),
      drag: new Spring(0, 160, 16),
    };

    var b = {
      cfg: cfg,
      index: index,
      root: rootG,
      float: floatG,
      pivot: pivot,
      backPivot: backPivot,
      frontMesh: frontMesh,
      spine: spine,
      block: block,
      pages: pages,
      pageF: pageF,
      pagesB: pagesB,
      pageFB: pageFB,
      hit: hit,
      springs: springs,
      phase: Math.random() * 6.28,
      slotScale: 1,
      hitEdge: null,
      scr: { x: 0, y: 0 },
      orbY: 0,
      orbYv: 0,
      orbPhase: 'idle',
      orbTarget: 0,
      orbXs: new Spring(0, 60, 12),
      exit: null,
    };
    bookInstances.push(b);
    return b;
  }
  BOOKS.forEach(buildBook);
  function bookByHit(m) {
    for (var bi = 0; bi < bookInstances.length; bi++) {
      if (bookInstances[bi].hit === m) return bookInstances[bi];
    }
    return null;
  }

  /* --------------------------------------------------------------
     Floating dust motes (hero air)
     -------------------------------------------------------------- */
  var dustItems = [];
  (function buildDust() {
    var s = 64;
    var c = mkCanvas(s, s);
    var x = c.getContext('2d');
    var g = x.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
    g.addColorStop(0, 'rgba(255,255,255,0.95)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    x.fillStyle = g;
    x.fillRect(0, 0, s, s);
    var dustTex = new THREE.CanvasTexture(c);
    var geo = new THREE.PlaneGeometry(0.06, 0.06);
    for (var i = 0; i < 18; i++) {
      var mat = new THREE.MeshBasicMaterial({ map: dustTex, transparent: true, opacity: 0.35 + Math.random() * 0.4, depthWrite: false });
      var mesh = new THREE.Mesh(geo, mat);
      var baseX = (Math.random() - 0.5) * 9;
      var baseY = (Math.random() - 0.5) * 5.5;
      mesh.position.set(baseX, baseY, -1.2 + Math.random() * 1.6);
      mesh.userData = {
        baseX: baseX,
        baseY: baseY,
        sp: 0.3 + Math.random() * 0.6,
        ph: Math.random() * 6.28,
        amp: 0.35 + Math.random() * 0.7,
      };
      bookRoot.add(mesh);
      dustItems.push(mesh);
    }
  })();

  function updateDust(t, dt) {
    dustItems.forEach(function (d) {
      var u = d.userData;
      u.baseY += Math.sin(t * u.sp + u.ph) * u.amp * dt * 0.25;
      d.position.set(
        u.baseX + Math.cos(t * u.sp * 0.7 + u.ph) * u.amp * 0.4,
        u.baseY,
        d.position.z,
      );
      d.rotation.z += dt * 0.2;
    });
  }

  /* --------------------------------------------------------------
     Floating leaves (detail view)
     -------------------------------------------------------------- */
  var leaves = {
    items: [],
    anchor: null,
    activate: function (book) {
      this.anchor = book;
      this.items.forEach(function (l) {
        l.kick.set(-l.hx + (Math.random() - 0.5) * 0.6, -l.hy + (Math.random() - 0.5) * 0.6, (Math.random() - 0.5) * 0.5);
        l.s.t = l.size;
        l.mesh.visible = true;
      });
    },
    deactivate: function () {
      this.items.forEach(function (l) {
        l.s.t = 0;
      });
    },
    push: function (dx, dy) {
      if (!this.anchor) return;
      this.items.forEach(function (l) {
        l.kick.x += dx * 2.4 * Math.random();
        l.kick.y += -dy * 2.4 * Math.random();
      });
    },
    update: function (dt, t) {
      if (!this.anchor) return;
      var ap = this.anchor.root.position;
      var w = RM ? 0.15 : 1;
      this.items.forEach(function (l) {
        l.kick.multiplyScalar(Math.exp(-1.15 * dt));
        l.mesh.position.set(
          ap.x + l.hx + Math.sin(t * l.sp + l.ph) * 0.4 * w + l.kick.x,
          ap.y + l.hy + Math.cos(t * l.sp * 0.83 + l.ph * 1.3) * 0.3 * w + l.kick.y,
          ap.z * 0.4 + l.hz + l.kick.z,
        );
        l.mesh.rotation.x += l.rv.x * dt * (0.3 + w);
        l.mesh.rotation.y += l.rv.y * dt * (0.3 + w);
        l.mesh.rotation.z += l.rv.z * dt * (0.3 + w);
        var s = l.s.update(dt);
        l.mesh.scale.setScalar(Math.max(s, 0.0001));
        if (l.s.t === 0 && s < 0.01) l.mesh.visible = false;
      });
    },
  };
  (function buildLeaves() {
    var shape = new THREE.Shape();
    shape.moveTo(0, -0.5);
    shape.bezierCurveTo(0.3, -0.28, 0.3, 0.22, 0, 0.55);
    shape.bezierCurveTo(-0.3, 0.22, -0.3, -0.28, 0, -0.5);
    var geo = new THREE.ShapeGeometry(shape, 10);
    var cols = [0x3e7c3f, 0x57944a, 0x2f6136, 0x6aa557];
    for (var i = 0; i < 16; i++) {
      var mat = std({ color: cols[i % 4], roughness: 0.55, envMapIntensity: 0.3, side: THREE.DoubleSide });
      var mesh = new THREE.Mesh(geo, mat);
      mesh.visible = false;
      bookRoot.add(mesh);
      var hx = (Math.random() - 0.5) * 4.6;
      if (i % 5 === 0) hx += 2.8 * Math.sign(hx || 1);
      leaves.items.push({
        mesh: mesh,
        hx: hx,
        hy: (Math.random() - 0.5) * 3.2,
        hz: -0.5 + Math.random() * 1.5,
        sp: 0.25 + Math.random() * 0.5,
        ph: Math.random() * 6.28,
        rv: new THREE.Vector3((Math.random() - 0.5) * 0.8, (Math.random() - 0.5) * 0.8, (Math.random() - 0.5) * 0.8),
        kick: new THREE.Vector3(),
        size: 0.14 + Math.random() * 0.16,
        s: new Spring(0, 60, 10),
      });
    }
  })();

  /* --------------------------------------------------------------
     Layout slots + state machine
     -------------------------------------------------------------- */
  var state = { mode: 'hero', selected: null, hovered: null, pillLock: null, kbIndex: -1 };
  var SLOTS = { hero: [], detail: null, portrait: false };

  function computeSlots() {
    var a = dims.w / Math.max(1, dims.h);
    var portrait = a < 0.85;
    var fit = portrait ? clamp(a / 1.08, 0.38, 0.74) : clamp(a / 1.62, 0.52, 1);
    bookRoot.scale.setScalar(fit);
    bookRoot.position.y = -(1 - fit) * 0.28;
    SLOTS.portrait = portrait;

    SLOTS.hero = portrait
      ? [
        { p: [-1.36, -0.58, -0.12], r: [-0.045, 0.4, 0.185], s: 1.25 },
        { p: [0.2, -0.22, 0.6], r: [-0.05, -0.1, -0.035], s: 1.35 },
        { p: [1.62, -0.62, -0.34], r: [-0.045, -0.42, -0.17], s: 1.25 },
      ]
      : [
        { p: [-2.05, -0.58, -0.12], r: [-0.045, 0.4, 0.185], s: 1.22 },
        { p: [0.25, -0.36, 0.6], r: [-0.05, -0.1, -0.035], s: 1.32 },
        { p: [2.35, -0.64, -0.34], r: [-0.045, -0.42, -0.17], s: 1.22 },
      ];

    if (SLOTS.portrait) {
      var panelH = dims.h * 0.42;
      var gap = dims.h * 0.035;
      var navB = dims.h * 0.1;
      var freeTop = navB;
      var freeBot = Math.max(dims.h - panelH - gap, freeTop + 140);
      var midPx = (freeTop + freeBot) / 2;
      var T13 = 0.23087;
      var camZp = 9.9;
      var zw = 0.8 * fit;
      var rootY = -(1 - fit) * 0.28;
      var yw = 0.1 + (1 - (2 * midPx) / dims.h) * T13 * (camZp - zw);
      var availW = (((freeBot - freeTop) * 0.92) / dims.h) * 2 * T13 * (camZp - zw);
      var s = clamp(availW / fit / 2.65, 0.42, 0.92);
      SLOTS.detail = { p: [0, (yw - rootY) / fit, 0.8], r: [-0.02, -0.4, 0.06], s: s };
    } else {
      SLOTS.detail = { p: [-1.68, 0.0, 0.85], r: [0.02, -0.44, 0.08], s: 1.06 };
    }
  }

  function setTargets(b, slot) {
    var s = b.springs;
    s.px.t = slot.p[0];
    s.py.t = slot.p[1];
    s.pz.t = slot.p[2];
    s.rx.t = slot.r[0];
    s.ry.t = slot.r[1];
    s.rz.t = slot.r[2];
    b.slotScale = slot.s;
  }

  var EASE = {
    hold: function () { return 1; },
    outQuad: function (t) { return 1 - (1 - t) * (1 - t); },
    outQuint: function (t) { return 1 - Math.pow(1 - t, 5); },
    inOutSine: function (t) { return -(Math.cos(Math.PI * t) - 1) / 2; },
  };
  var LIFT = 0.38;
  var CLEAR = 4.2;

  function playY(b, segs) {
    b.exit = { segs: segs, i: 0, t: 0 };
  }
  function stepY(b, dt) {
    var ex = b.exit;
    var s = b.springs;
    ex.t += dt;
    var seg = ex.segs[ex.i];
    while (seg && ex.t >= seg.d) {
      ex.t -= seg.d;
      s.py.v = seg.to;
      if (seg.end) seg.end();
      seg = ex.segs[++ex.i];
    }
    if (seg) s.py.v = seg.from + (seg.to - seg.from) * seg.ease(ex.t / seg.d);
    else b.exit = null;
    s.py.t = s.py.v;
    s.py.vel = 0;
  }
  function pinInPlace(b) {
    var s = b.springs;
    s.px.t = s.px.v;
    s.pz.t = s.pz.v;
    s.rx.t = s.rx.v;
    s.ry.t = s.ry.v;
    s.rz.t = s.rz.v;
  }
  function sendOut(b, i, delay) {
    var y0 = SLOTS.hero[i].p[1];
    var here = b.springs.py.v;
    var apex = y0 + LIFT;
    b.root.visible = true;
    pinInPlace(b);
    playY(b, [
      { d: delay, from: here, to: here, ease: EASE.hold },
      { d: 0.28, from: here, to: apex, ease: EASE.outQuad },
      { d: 0.9, from: apex, to: y0 - CLEAR, ease: EASE.inOutSine, end: function () { b.root.visible = false; } },
    ]);
  }
  function bringBack(b, i, delay) {
    var here = b.springs.py.v;
    b.root.visible = true;
    pinInPlace(b);
    playY(b, [
      { d: delay, from: here, to: here, ease: EASE.hold },
      { d: 1.0, from: here, to: SLOTS.hero[i].p[1], ease: EASE.outQuint },
    ]);
  }

  function applyMode() {
    if (state.mode === 'hero' || state.mode === 'closing') {
      bookInstances.forEach(function (b, i) {
        if (i < 3 && SLOTS.hero[i]) setTargets(b, SLOTS.hero[i]);
      });
    } else if (state.selected) {
      setTargets(state.selected, SLOTS.detail);
    }
  }

  var timeouts = [];
  function setT(fn, ms) {
    var id = setTimeout(fn, ms);
    timeouts.push(id);
    return id;
  }

  /* --------------------------------------------------------------
     Cameras + springs
     -------------------------------------------------------------- */
  var camX = new Spring(0, 13, 6.5);
  var camY = new Spring(0.1, 13, 6.5);
  var camZ = new Spring(9.6, 13, 6.5);
  var lookX = new Spring(0, 13, 6.5);
  var lookY = new Spring(0, 13, 6.5);
  var parX = new Spring(0, 60, 10);
  var parY = new Spring(0, 60, 10);

  function camTo(mode) {
    if (mode === 'detail') {
      camX.t = SLOTS.portrait ? 0 : -0.25;
      camZ.t = SLOTS.portrait ? 10.4 : 9.6;
      lookX.t = SLOTS.portrait ? 0 : -0.35;
      lookY.t = SLOTS.portrait ? 0 : 0.15;
    } else {
      camX.t = 0;
      camZ.t = 9.6;
      lookX.t = 0;
      lookY.t = 0;
    }
  }

  /* --------------------------------------------------------------
     Detail panel
     -------------------------------------------------------------- */
  function renderStars(n) {
    var s = '';
    for (var i = 0; i < 5; i++) {
      s += i < n
        ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.6l2.8 6 6.6.6-5 4.4 1.5 6.5L12 16.7 6.1 20.1l1.5-6.5-5-4.4 6.6-.6z"/></svg>'
        : '<svg viewBox="0 0 24 24" aria-hidden="true" class="off"><path d="M12 2.6l2.8 6 6.6.6-5 4.4 1.5 6.5L12 16.7 6.1 20.1l1.5-6.5-5-4.4 6.6-.6z"/></svg>';
    }
    return s;
  }

  function updateDetail(book) {
    var cfg = book.cfg;
    detailTitle.textContent = cfg.title;
    detailDesc.textContent = cfg.desc;
    detailStars.innerHTML = renderStars(cfg.stars || 0);
    detailYear.textContent = cfg.year || '—';
    detailActions.innerHTML = '';
    var act = document.createElement('div');
    act.className = 'bs-detail-actions-row';
    if (cfg.link) {
      var a = document.createElement('a');
      a.className = 'bs-btn bs-btn-primary';
      a.href = cfg.link;
      a.target = '_blank';
      a.rel = 'noopener';
      a.textContent = cfg.linkLabel || 'View';
      act.appendChild(a);
      var d = document.createElement('a');
      d.className = 'bs-btn';
      d.href = cfg.link;
      d.setAttribute('download', '');
      d.textContent = 'Download';
      act.appendChild(d);
    } else {
      var soon = document.createElement('span');
      soon.className = 'bs-btn bs-btn-disabled';
      soon.textContent = 'Coming soon';
      act.appendChild(soon);
    }
    detailActions.appendChild(act);
  }

  var pillX = new Spring(0, 190, 23);
  var pillY = new Spring(0, 190, 23);
  var pillOn = false;

  function showPill() {
    openBtn.classList.add('bs-open');
    pillOn = true;
  }
  function hidePill() {
    openBtn.classList.remove('bs-open');
    pillOn = false;
  }

  function open(book) {
    if (state.mode !== 'hero' || !book) return;
    state.mode = 'opening';
    state.selected = book;
    state.pillLock = null;
    state.kbIndex = -1;
    hidePill();
    book.exit = null;
    root.classList.add('bs-transit');
    updateDetail(book);

    var out = 0;
    bookInstances.forEach(function (b, i) {
      if (b !== book) sendOut(b, i, out++ * 0.08);
    });

    setT(function () {
      if (state.mode !== 'opening' && state.mode !== 'detail') return;
      book.orbY = RM ? 0 : -6.2832;
      book.orbYv = RM ? 0 : 3;
      book.orbPhase = 'return';
      book.orbTarget = 0;
      book.orbXs.set(0);
      applyMode();
      camTo('detail');
    }, 760);
    setT(function () { leaves.activate(book); }, 1000);
    setT(function () {
      if (state.mode === 'opening') {
        bookInstances.forEach(function (b) {
          if (b !== book) {
            b.exit = null;
            b.root.visible = false;
          }
        });
        root.classList.add('bs-detail-open');
        state.mode = 'detail';
      }
    }, 1400);
  }

  function close() {
    if (state.mode !== 'detail') return;
    state.mode = 'closing';
    root.classList.remove('bs-detail-open');
    leaves.deactivate();
    var b = state.selected;
    if (b) {
      b.orbTarget = Math.round(b.orbY / 6.2832) * 6.2832 + 6.2832;
      b.orbYv = Math.max(b.orbYv, 3);
      b.orbPhase = 'return';
      b.orbXs.t = 0;
    }
    setT(function () {
      root.classList.remove('bs-transit');
      applyMode();
      camTo('hero');
      var back = 0;
      bookInstances.forEach(function (bk, i) {
        if (bk !== b) bringBack(bk, i, 0.85 + back++ * 0.1);
      });
    }, 250);
    setT(function () {
      if (state.mode === 'closing') {
        state.mode = 'hero';
        state.selected = null;
      }
    }, 1600);
  }

  closeBtn.addEventListener('click', close);

  /* --------------------------------------------------------------
     Input
     -------------------------------------------------------------- */
  var ptr = {
    ndcX: 0, ndcY: 0, cx: 0, cy: 0, lastX: 0, lastY: 0,
    down: false, downX: 0, downY: 0, moved: 0, t0: 0,
    type: 'mouse', seen: false, id: null,
  };
  function isTouch() { return ptr.type === 'touch' || ptr.type === 'pen'; }
  var dragBook = null;
  var rayBook = null;
  var orbit = { drag: false, dxAcc: 0, dyAcc: 0 };
  var ray = new THREE.Raycaster();
  var tmpV = new THREE.Vector3();

  function localXY(e) {
    var r = root.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }

  function onContextMenu(e) { e.preventDefault(); }
  canvasEl.addEventListener('contextmenu', onContextMenu);

  function onPointerLeave() {
    rayBook = null;
    state.pillLock = null;
    state.kbIndex = -1;
  }
  canvasEl.addEventListener('pointerleave', onPointerLeave);

  function onPointerMove(e) {
    if (ptr.id !== null && e.pointerId !== ptr.id) return;
    var loc = localXY(e);
    var cx = loc.x;
    var cy = loc.y;
    var dxN = (cx - ptr.lastX) / dims.w;
    var dyN = (cy - ptr.lastY) / dims.h;
    ptr.lastX = cx;
    ptr.lastY = cy;
    ptr.cx = cx;
    ptr.cy = cy;
    ptr.ndcX = (cx / dims.w) * 2 - 1;
    ptr.ndcY = -(cy / dims.h) * 2 + 1;
    ptr.type = e.pointerType || 'mouse';
    ptr.seen = true;
    if (state.mode === 'detail') leaves.push(dxN, dyN);
    if (ptr.down && dragBook) {
      ptr.moved += Math.abs(dxN * dims.w) + Math.abs(dyN * dims.h);
      dragBook.springs.drag.t = clamp(((ptr.downX - cx) / dims.w) * 3.4, 0, 1.0);
    }
    if (ptr.down && orbit.drag) {
      orbit.dxAcc += dxN;
      orbit.dyAcc += dyN;
      ptr.moved += Math.abs(dxN * dims.w) + Math.abs(dyN * dims.h);
    }
  }
  canvasEl.addEventListener('pointermove', onPointerMove);

  function castRay() {
    ray.setFromCamera({ x: ptr.ndcX, y: ptr.ndcY }, camera);
    var hits = ray.intersectObjects(hitMeshes, false);
    if (hits.length) {
      rayBook = bookByHit(hits[0].object);
      var lp = rayBook.hit.worldToLocal(hits[0].point.clone());
      rayBook.hitEdge = clamp((lp.x / 0.9) * 0.5 + 0.5, 0, 1);
    } else {
      rayBook = null;
    }
  }

  function onPointerDown(e) {
    if (ptr.id !== null) return;
    root.focus({ preventScroll: true });
    ptr.id = e.pointerId;
    var loc = localXY(e);
    ptr.cx = loc.x;
    ptr.cy = loc.y;
    ptr.lastX = loc.x;
    ptr.lastY = loc.y;
    ptr.ndcX = (loc.x / dims.w) * 2 - 1;
    ptr.ndcY = -(loc.y / dims.h) * 2 + 1;
    ptr.type = e.pointerType || 'mouse';
    ptr.seen = true;
    castRay();
    if (state.mode === 'hero' && rayBook) {
      ptr.down = true;
      dragBook = rayBook;
      ptr.downX = loc.x;
      ptr.downY = loc.y;
      ptr.moved = 0;
      ptr.t0 = performance.now();
      canvasEl.setPointerCapture(e.pointerId);
    } else if (state.mode === 'detail' && rayBook === state.selected) {
      ptr.down = true;
      orbit.drag = true;
      orbit.dxAcc = 0;
      orbit.dyAcc = 0;
      ptr.moved = 0;
      ptr.t0 = performance.now();
      canvasEl.setPointerCapture(e.pointerId);
    } else {
      state.pillLock = null;
      state.kbIndex = -1;
    }
  }
  canvasEl.addEventListener('pointerdown', onPointerDown);

  function onPointerUp(e) {
    if (ptr.id !== null && e.pointerId !== ptr.id) return;
    ptr.id = null;
    orbit.drag = false;
    if (dragBook) {
      var slop = isTouch() ? 26 : 14;
      var limit = isTouch() ? 650 : 450;
      var wasDrag = ptr.moved > slop;
      dragBook.springs.drag.t = 0;
      if (!wasDrag && state.mode === 'hero' && performance.now() - ptr.t0 < limit) open(dragBook);
      dragBook = null;
    }
    ptr.down = false;
    if (isTouch()) rayBook = null;
  }
  window.addEventListener('pointerup', onPointerUp);

  function cancelPointer() {
    ptr.id = null;
    ptr.down = false;
    orbit.drag = false;
    if (dragBook) {
      dragBook.springs.drag.t = 0;
      dragBook = null;
    }
    if (isTouch()) rayBook = null;
  }
  window.addEventListener('pointercancel', cancelPointer);
  canvasEl.addEventListener('lostpointercapture', cancelPointer);

  function onKeydown(e) {
    if (e.key === 'Escape') close();
    if (state.mode !== 'hero') return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      var d = e.key === 'ArrowRight' ? 1 : -1;
      state.kbIndex = ((state.kbIndex < 0 ? (d > 0 ? -1 : 1) : state.kbIndex) + d + 3) % 3;
      state.pillLock = null;
      e.preventDefault();
    }
    if (e.key === 'Enter' && state.hovered) open(state.hovered);
  }
  root.addEventListener('keydown', onKeydown);

  /* --------------------------------------------------------------
     Frame loop
     -------------------------------------------------------------- */
  var DETAIL_OPEN_ANGLE = 0.88;
  var DETAIL_OPEN_SWAY = 0.035;
  var HERO_OPEN_ANGLE = 0.95;
  var idle = RM ? 0 : 1;

  function screenPos(b) {
    b.root.getWorldPosition(tmpV).project(camera);
    b.scr.x = (tmpV.x * 0.5 + 0.5) * dims.w;
    b.scr.y = (-tmpV.y * 0.5 + 0.5) * dims.h;
  }

  function tickBook(b, dt, t) {
    var s = b.springs;
    var isHov = state.hovered === b;
    var inDetail = state.mode === 'detail' && state.selected === b;
    var orbitActive = state.selected === b && state.mode !== 'hero';

    var activity = 0;
    if (orbitActive) {
      if (orbit.drag && inDetail) {
        var step = orbit.dxAcc * 6.5;
        orbit.dxAcc = 0;
        b.orbY += step;
        b.orbYv = clamp(b.orbYv * 0.5 + (step / Math.max(dt, 0.001)) * 0.5, -14, 14);
        b.orbXs.t = clamp(b.orbXs.t + orbit.dyAcc * 3.2, -0.55, 0.55);
        orbit.dyAcc = 0;
        b.orbPhase = 'drag';
      } else {
        b.orbXs.t = 0;
        if (b.orbPhase === 'drag') {
          if (Math.abs(b.orbYv) > 0.6) b.orbPhase = 'spin';
          else {
            b.orbPhase = 'return';
            b.orbTarget = Math.round((b.orbY + b.orbYv * 1.2) / Math.PI) * Math.PI;
          }
        }
        if (b.orbPhase === 'spin') {
          b.orbYv *= Math.exp(-0.9 * dt);
          b.orbY += b.orbYv * dt;
          if (Math.abs(b.orbYv) < 0.5) {
            b.orbPhase = 'return';
            b.orbTarget = Math.round((b.orbY + b.orbYv * 1.2) / Math.PI) * Math.PI;
          }
        } else if (b.orbPhase === 'return') {
          var acc = 16 * (b.orbTarget - b.orbY) - 8 * b.orbYv;
          b.orbYv += acc * dt;
          b.orbY += b.orbYv * dt;
          if (Math.abs(b.orbTarget - b.orbY) < 0.002 && Math.abs(b.orbYv) < 0.01) {
            b.orbY = b.orbTarget;
            b.orbYv = 0;
            b.orbPhase = 'idle';
          }
        }
      }
      var distRest = Math.abs(b.orbY - Math.round(b.orbY / 6.2832) * 6.2832);
      activity = clamp(Math.abs(b.orbYv) * 1.5 + (orbit.drag ? 1 : 0) + distRest * 2, 0, 1);
    }
    b.orbXs.update(dt);

    var coverBase = inDetail
      ? DETAIL_OPEN_ANGLE + Math.sin(t * 0.8 + b.phase) * DETAIL_OPEN_SWAY * idle
      : HERO_OPEN_ANGLE + Math.sin(t * 0.6 + b.phase) * 0.02 * idle;
    var fan = orbitActive ? clamp(b.orbYv * 0.16, 0, 0.75) : 0;
    var fanB = orbitActive ? clamp(-b.orbYv * 0.16, 0, 0.75) : 0;
    var coverBBase = 0;
    if (inDetail) coverBBase = 0.2 + Math.sin(t * 0.8 + b.phase + 1.7) * 0.02 * idle;

    if (isHov && ptr.seen && state.mode === 'hero') {
      var dxN = (ptr.cx - b.scr.x) / (dims.w * 0.25);
      var dyN = (b.scr.y - ptr.cy) / (dims.h * 0.3);
      s.tiltY.t = clamp(dxN * 0.28, -0.15, 0.15);
      s.tiltX.t = clamp(-dyN * 0.1, -0.09, 0.1);
      s.lift.t = 0.3;
    } else {
      s.tiltY.t = 0;
      s.tiltX.t = 0;
      s.lift.t = 0;
    }
    s.cover.t = coverBase + fan;
    s.coverB.t = coverBBase + fanB;
    s.sc.t = b.slotScale * (isHov && state.mode === 'hero' ? 1.09 : 1);

    s.px.update(dt);
    if (b.exit) stepY(b, dt);
    else s.py.update(dt);
    s.pz.update(dt);
    s.rx.update(dt);
    s.ry.update(dt);
    s.rz.update(dt);
    s.sc.update(dt);
    s.tiltX.update(dt);
    s.tiltY.update(dt);
    s.lift.update(dt);
    s.cover.update(dt);
    s.coverB.update(dt);
    s.drag.update(dt);

    b.float.position.y = Math.sin(t * 0.7 + b.phase) * 0.07 * idle;
    b.float.position.x = Math.sin(t * 0.5 + b.phase * 1.3) * 0.018 * idle;
    b.float.rotation.z = Math.sin(t * 0.9 + b.phase * 1.7) * 0.011 * idle;

    b.root.position.set(s.px.v, s.py.v, s.pz.v + s.lift.v);
    var sway = inDetail ? Math.sin(t * 0.45 + b.phase) * 0.035 * idle * (1 - activity) : 0;
    var swing = clamp(-s.px.vel * 0.12, -0.5, 0.5);
    b.root.rotation.set(s.rx.v + s.tiltX.v + b.orbXs.v, s.ry.v + s.tiltY.v + b.orbY + sway + swing, s.rz.v);
    b.root.scale.setScalar(Math.max(s.sc.v, 0.001));

    var ang = Math.max(0, s.cover.v + s.drag.v);
    var angB = Math.max(0, s.coverB.v);
    b.pivot.rotation.y = -ang;
    b.pivot.position.z = PIVOT_Z + ang * 0.022;
    b.backPivot.rotation.y = angB;
    b.backPivot.position.z = BPIVOT_Z - angB * 0.022;
    b.spine.rotation.y = -ang * 0.16 + angB * 0.16;
    b.block.scale.z = 1 - (ang + angB) * 0.05;
    b.block.position.z = BLOCK_Z - ang * 0.006 + angB * 0.006;
    for (var i = 0; i < PAGE_N; i++) {
      var fl = idle * Math.sin(t * 1.15 + b.phase + i * 0.6) * 0.006 * (1 - i / PAGE_N);
      b.pages[i].rotation.y = -(ang * b.pageF[i] + Math.max(0, fl));
    }
    for (var j = 0; j < 6; j++) b.pagesB[j].rotation.y = angB * b.pageFB[j];
  }

  var rafId = 0;
  var isInViewport = true;
  var _lastClock = 0;
  var _elapsed = 0;

  function tickTime() {
    var t = performance.now() / 1000;
    if (!_lastClock) _lastClock = t;
    var dt = Math.min(t - _lastClock, 0.05);
    _lastClock = t;
    _elapsed += dt;
    return { dt: dt, t: _elapsed };
  }

  function animate() {
    if (cancelled || !isInViewport || document.hidden) {
      rafId = 0;
      return;
    }
    rafId = requestAnimationFrame(animate);
    var tc = tickTime();
    var dt = tc.dt;
    var t = tc.t;

    if (ptr.seen && (ptr.type === 'mouse' || ptr.down)) castRay();
    var hov = null;
    if (state.mode === 'hero') {
      var kb = state.kbIndex >= 0 ? bookInstances[state.kbIndex] : null;
      hov = rayBook || state.pillLock || kb || null;
    } else if (state.mode === 'detail') {
      hov = rayBook === state.selected ? rayBook : null;
    }
    state.hovered = hov;
    var cur = 'default';
    if (state.mode === 'hero' && hov) cur = 'pointer';
    else if (state.mode === 'detail' && state.selected) {
      if (orbit.drag) cur = 'grabbing';
      else if (rayBook === state.selected) cur = 'grab';
    }
    canvasEl.style.cursor = cur;

    bookInstances.forEach(screenPos);
    bookInstances.forEach(function (b) { tickBook(b, dt, t); });
    leaves.update(dt, t);
    updateDust(t, dt);

    parX.t = RM ? 0 : ptr.ndcX * 0.02;
    parY.t = RM ? 0 : -ptr.ndcY * 0.012;
    bookRoot.rotation.y = parX.update(dt);
    bookRoot.rotation.x = parY.update(dt);

    camera.position.set(camX.update(dt), camY.update(dt), camZ.update(dt));
    camera.lookAt(lookX.update(dt), lookY.update(dt), 0);

    if (state.mode === 'hero' && state.hovered && ptr.seen && !isTouch() && !(ptr.down && ptr.moved > 14)) {
      var tx = ptr.cx;
      var ty = ptr.cy + 34;
      if (!pillOn) {
        pillX.set(tx);
        pillY.set(ty);
      }
      pillX.t = tx;
      pillY.t = ty;
      openBtn.style.left = pillX.update(dt) + 'px';
      openBtn.style.top = pillY.update(dt) + 'px';
      if (!pillOn) showPill();
    } else {
      hidePill();
    }

    renderer.render(scene, camera);
  }

  function resumeAnimation() {
    if (!rafId && !cancelled && isInViewport && !document.hidden) animate();
  }

  var cancelled = false;

  /* --------------------------------------------------------------
     Entrance + resize
     -------------------------------------------------------------- */
  function relayout() {
    var r = root.getBoundingClientRect();
    dims.w = Math.max(1, Math.round(r.width));
    dims.h = Math.max(1, Math.round(r.height));
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, dims.w < 800 ? 1.5 : 2));
    renderer.setSize(dims.w, dims.h);
    camera.aspect = dims.w / dims.h;
    camera.updateProjectionMatrix();
    computeSlots();
    applyMode();
    camTo(state.mode === 'detail' || state.mode === 'opening' ? 'detail' : 'hero');
  }

  relayout();
  bookInstances.forEach(function (b, i) {
    var slot = SLOTS.hero[i];
    var s = b.springs;
    if (!slot) return;
    s.px.set(slot.p[0]);
    s.py.set(slot.p[1] - 3.9);
    s.pz.set(slot.p[2]);
    s.rx.set(slot.r[0]);
    s.ry.set(slot.r[1]);
    s.rz.set(slot.r[2] + 0.35 * (i === 1 ? -1 : Math.sign(slot.p[0])));
    s.sc.set(slot.s);
    b.slotScale = slot.s;
    setT(function () { setTargets(b, slot); }, 240 + i * 150);
  });
  rebuildHitMeshes();
  camTo('hero');
  animate();

  function rebuildHitMeshes() {
    hitMeshes.length = 0;
    bookInstances.forEach(function (b) { hitMeshes.push(b.hit); });
  }

  var visibilityObserver = new IntersectionObserver(
    function (entries) {
      isInViewport = entries[0].isIntersecting;
      if (isInViewport) resumeAnimation();
      else if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      }
    },
    { rootMargin: '160px' },
  );
  visibilityObserver.observe(root);

  function onVisibilityChange() {
    if (document.hidden && rafId) {
      cancelAnimationFrame(rafId);
      rafId = 0;
    } else {
      resumeAnimation();
    }
  }
  document.addEventListener('visibilitychange', onVisibilityChange);

  var onWindowResize = relayout;
  window.addEventListener('resize', onWindowResize);
  var ro = new ResizeObserver(relayout);
  ro.observe(root);

  /* --------------------------------------------------------------
     Cleanup (module top-level never unloads, but keep it tidy)
     -------------------------------------------------------------- */
})();
