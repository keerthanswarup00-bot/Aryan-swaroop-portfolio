/* Scroll Dissolve Reveal — vanilla three.js port of the R3F ScrollDissolveReveal
   component. GLSL shaders, uniforms and progress mapping are kept identical;
   framer-motion useScroll is replaced by GSAP ScrollTrigger (per instance).
   Usage: <div data-scroll-dissolve data-front="..." data-back="..." data-alt="...">
   Multiple instances per page are supported. Reduced-motion / no-WebGL / no-JS
   fall back to a static front image. Phones (<=768px) skip WebGL entirely and
   use a scroll-scrubbed crossfade instead; three.js is imported lazily only for
   the desktop WebGL path. */

var coverVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;


var coverFragmentShader = `
  uniform sampler2D uTexture;
  uniform vec2 uResolution;
  uniform vec2 uImageResolution;
  uniform float uDissolve;
  uniform vec2 uCenter;
  uniform float uTime;
  uniform float uGrayscale;
  uniform float uEdgeIntensity;
  uniform float uEdgeBrightness;
  varying vec2 vUv;


  mat3 sobelX = mat3(
    -1.0, 0.0, 1.0,
    -2.0, 0.0, 2.0,
    -1.0, 0.0, 1.0
  );


  mat3 sobelY = mat3(
    -1.0, -2.0, -1.0,
     0.0,  0.0,  0.0,
     1.0,  2.0,  1.0
  );


  float getLuminance(vec3 color) {
    return dot(color, vec3(0.299, 0.587, 0.114));
  }


  float sobel(sampler2D tex, vec2 uv, vec2 texelSize) {
    float gx = 0.0;
    float gy = 0.0;


    for (int i = -1; i <= 1; i++) {
      for (int j = -1; j <= 1; j++) {
        vec2 offset = vec2(float(i), float(j)) * texelSize;
        float lum = getLuminance(texture2D(tex, uv + offset).rgb);
        gx += lum * sobelX[i + 1][j + 1];
        gy += lum * sobelY[i + 1][j + 1];
      }
    }


    return sqrt(gx * gx + gy * gy);
  }


  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }


  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }


  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    
    for (int i = 0; i < 5; i++) {
      value += amplitude * noise(p * frequency);
      amplitude *= 0.5;
      frequency *= 2.0;
    }
    
    return value;
  }


  void main() {
    vec2 ratio = vec2(
      min((uResolution.x / uResolution.y) / (uImageResolution.x / uImageResolution.y), 1.0),
      min((uResolution.y / uResolution.x) / (uImageResolution.y / uImageResolution.x), 1.0)
    );


    vec2 uv = vec2(
      vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
      vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
    );


    vec4 texColor = texture2D(uTexture, uv);
    
    float gray = getLuminance(texColor.rgb);
    vec3 grayscaleColor = vec3(gray);
    texColor.rgb = mix(texColor.rgb, grayscaleColor, uGrayscale);
    
    vec2 centeredUv = vUv - uCenter;
    float aspect = uResolution.x / uResolution.y;
    centeredUv.x *= aspect;
    float dist = length(centeredUv);
    
    float angle = atan(centeredUv.y, centeredUv.x);
    
    float noiseScale = 6.0;
    vec2 pixelatedUv = floor(vUv * uResolution / noiseScale) * noiseScale / uResolution;
    float blockNoise = fbm(pixelatedUv * 100.0) * 0.15;
    
    float angularNoise = fbm(vec2(angle * 5.0, 0.0)) * 0.15;
    
    float totalNoise = blockNoise + angularNoise;
    float noisyDist = dist + totalNoise;
    
    float maxDist = length(vec2(aspect * 0.5, 0.5));
    float normalizedDist = noisyDist / maxDist;
    
    float dissolveThreshold = uDissolve * 1.5; 
    
    vec2 texelSize = 1.0 / uResolution;
    float edge = sobel(uTexture, uv, texelSize);
    
    edge = pow(edge, 0.7) * 2.0;
    edge = clamp(edge, 0.0, 1.0);
    
    float dissolveMask = smoothstep(dissolveThreshold - 0.03, dissolveThreshold, normalizedDist);
    
    vec3 edgeColor = vec3(1.0, 1.0, 1.0);
    
    vec3 baseColor = mix(texColor.rgb, vec3(0.0), uGrayscale);
    vec3 finalColor = baseColor;
    
    float edgeGlowIntensity = uEdgeIntensity * 2.0;
    float edgeGlow = edge * edgeGlowIntensity * (1.0 + uGrayscale * 3.0);
    finalColor += edgeColor * edgeGlow * uEdgeBrightness;
    
    float edgeZoneWidth = 0.15 * (1.0 - uDissolve) + 0.02;
    float edgeZone = smoothstep(dissolveThreshold - edgeZoneWidth, dissolveThreshold - edgeZoneWidth + 0.04, normalizedDist) * 
                     smoothstep(dissolveThreshold + 0.02, dissolveThreshold - 0.02, normalizedDist);
    float sparkle = hash(floor(vUv * uResolution / 4.0)) * edgeZone;
    
    float edgeBrightness = (1.0 - uDissolve) * uEdgeBrightness * (1.0 + uGrayscale * 2.0);
    finalColor += vec3(sparkle * 3.0 * edgeBrightness);
    
    float alpha = dissolveMask * texColor.a;


    gl_FragColor = vec4(finalColor, alpha);
  }
`;


var coverFragmentShaderReverse = `
  uniform sampler2D uTexture;
  uniform vec2 uResolution;
  uniform vec2 uImageResolution;
  uniform float uDissolve;
  uniform vec2 uCenter;
  uniform float uTime;
  uniform float uBrightness;
  uniform float uEdgeIntensity;
  uniform float uDarkness;
  uniform float uGrayscale;
  varying vec2 vUv;


  mat3 sobelX = mat3(
    -1.0, 0.0, 1.0,
    -2.0, 0.0, 2.0,
    -1.0, 0.0, 1.0
  );


  mat3 sobelY = mat3(
    -1.0, -2.0, -1.0,
     0.0,  0.0,  0.0,
     1.0,  2.0,  1.0
  );


  float getLuminance(vec3 color) {
    return dot(color, vec3(0.299, 0.587, 0.114));
  }


  float sobel(sampler2D tex, vec2 uv, vec2 texelSize) {
    float gx = 0.0;
    float gy = 0.0;


    for (int i = -1; i <= 1; i++) {
      for (int j = -1; j <= 1; j++) {
        vec2 offset = vec2(float(i), float(j)) * texelSize;
        float lum = getLuminance(texture2D(tex, uv + offset).rgb);
        gx += lum * sobelX[i + 1][j + 1];
        gy += lum * sobelY[i + 1][j + 1];
      }
    }


    return sqrt(gx * gx + gy * gy);
  }


  void main() {
    vec2 ratio = vec2(
      min((uResolution.x / uResolution.y) / (uImageResolution.x / uImageResolution.y), 1.0),
      min((uResolution.y / uResolution.x) / (uImageResolution.y / uImageResolution.x), 1.0)
    );


    vec2 uv = vec2(
      vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
      vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
    );


    vec4 texColor = texture2D(uTexture, uv);
    
    float gray = getLuminance(texColor.rgb);
    vec3 grayscaleColor = vec3(gray);
    texColor.rgb = mix(texColor.rgb, grayscaleColor, uGrayscale);
    
    vec2 texelSize = 1.0 / uResolution;
    float edge = sobel(uTexture, uv, texelSize);
    
    edge = pow(edge, 0.7) * 2.0;
    edge = clamp(edge, 0.0, 1.0);
    
    vec3 edgeColor = vec3(1.0, 1.0, 1.0);
    
    vec3 darkBase = vec3(0.0);
    vec3 baseColor = mix(texColor.rgb, darkBase, uDarkness);
    
    float edgeGlow = edge * uEdgeIntensity * 2.0;
    baseColor += edgeColor * edgeGlow;
    
    vec3 finalColor = clamp(baseColor, 0.0, 1.0);


    gl_FragColor = vec4(finalColor, texColor.a);
  }
`;


(function () {
  'use strict';

  var els = document.querySelectorAll('[data-scroll-dissolve]');
  if (!els.length || !window.gsap || !window.ScrollTrigger) return;

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var webgl2 = !!document.createElement('canvas').getContext('webgl2');
  var isMobile = window.matchMedia('(max-width: 768px)').matches;

  ScrollTrigger.config({ ignoreMobileResize: true });

  /* Phone path — no WebGL. Phones keep the sticky viewport but swap the shader
     dissolve for a scroll-scrubbed crossfade (opacity + subtle scale only,
     compositor-friendly, guaranteed smooth). Reduced-motion stays a static
     front image via the fallback above. */
  function setupMobileCrossfade(el, img, frontSrc, backSrc, alt) {
    el.classList.add('sd-mobile');

    var viewport = document.createElement('div');
    viewport.className = 'sd-viewport';

    var back = document.createElement('img');
    back.className = 'sd-back-img';
    back.src = backSrc;
    back.alt = '';
    back.loading = 'lazy';
    back.decoding = 'async';

    var front = document.createElement('img');
    front.className = 'sd-front-img';
    front.src = frontSrc;
    front.alt = alt;
    front.loading = 'eager';
    front.decoding = 'async';

    viewport.appendChild(back);
    viewport.appendChild(front);
    el.insertBefore(viewport, el.firstChild);

    if (img) {
      img.hidden = true;
      img.classList.remove('sd-nojs');
      img.classList.add('sd-fallback-img');
    }

    gsap.registerPlugin(ScrollTrigger);
    gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: 'top top',
        end: function () { return '+=' + Math.round(window.innerHeight * 2); },
        scrub: 0.5,
        invalidateOnRefresh: true
      }
    })
      .fromTo(back, { scale: 1.08 }, { scale: 1, ease: 'none' }, 0)
      .fromTo(front, { opacity: 1, scale: 1 }, { opacity: 0, scale: 1.05, ease: 'none' }, 0);
  }

  var webglEls = [];

  els.forEach(function (el) {
    var frontSrc = el.getAttribute('data-front');
    var backSrc = el.getAttribute('data-back');
    var alt = el.getAttribute('data-alt') || 'Scroll dissolve reveal';
    var img = el.querySelector('img');

    el.classList.add('sd-wrap');

    if (reduced || !webgl2) {
      if (img) {
        img.setAttribute('alt', alt);
        img.classList.add('sd-nojs');
      }
      return;
    }

    if (!frontSrc || !backSrc) return;

    if (isMobile) {
      setupMobileCrossfade(el, img, frontSrc, backSrc, alt);
      return;
    }

    webglEls.push({ el: el, img: img, frontSrc: frontSrc, backSrc: backSrc });
  });

  if (webglEls.length) {
    /* three.js is ~365 KB — only pull it in on desktop, and only when an
       element actually needs the WebGL dissolve. */
    import('./vendor/three.module.min.js').then(function (THREE) {
      webglEls.forEach(function (entry) {
        setupWebGL(entry.el, entry.img, entry.frontSrc, entry.backSrc, THREE);
      });
    });
  }

  function setupWebGL(el, img, frontSrc, backSrc, THREE) {
    var viewport = document.createElement('div');
    viewport.className = 'sd-viewport';
    var canvas = document.createElement('canvas');
    canvas.className = 'sd-canvas';
    viewport.appendChild(canvas);
    el.insertBefore(viewport, el.firstChild);

    if (img) {
      img.hidden = true;
      img.classList.remove('sd-nojs');
      img.classList.add('sd-fallback-img');
    }

    var renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true
    });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));

    var scene = new THREE.Scene();
    var camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.set(0, 0, 1);
    camera.lookAt(0, 0, 0);

    function baseUniforms() {
      return {
        uTexture: { value: null },
        uResolution: { value: new THREE.Vector2() },
        uImageResolution: { value: new THREE.Vector2() },
        uDissolve: { value: 0.0 },
        uCenter: { value: new THREE.Vector2(0.5, 0.5) },
        uTime: { value: 0.0 }
      };
    }

    var materialFront = new THREE.ShaderMaterial({
      vertexShader: coverVertexShader,
      fragmentShader: coverFragmentShader,
      transparent: true,
      uniforms: Object.assign(baseUniforms(), {
        uGrayscale: { value: 0.0 },
        uEdgeIntensity: { value: 0.0 },
        uEdgeBrightness: { value: 1.0 }
      })
    });

    var materialBack = new THREE.ShaderMaterial({
      vertexShader: coverVertexShader,
      fragmentShader: coverFragmentShaderReverse,
      transparent: true,
      uniforms: Object.assign(baseUniforms(), {
        uBrightness: { value: 0.0 },
        uEdgeIntensity: { value: 0.6 },
        uDarkness: { value: 1.0 },
        uGrayscale: { value: 1.0 }
      })
    });

    var backMesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), materialBack);
    backMesh.position.z = -0.1;
    scene.add(backMesh);

    var frontMesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), materialFront);
    scene.add(frontMesh);

    var loader = new THREE.TextureLoader();
    var textures = { front: null, back: null };

    function resize() {
      var w = viewport.clientWidth || 1;
      var h = viewport.clientHeight || 1;
      renderer.setSize(w, h, false);
      materialFront.uniforms.uResolution.value.set(w, h);
      materialBack.uniforms.uResolution.value.set(w, h);
    }

    function render() {
      if (!textures.front || !textures.back) return;
      materialFront.uniforms.uTime.value = performance.now() / 1000;
      materialBack.uniforms.uTime.value = performance.now() / 1000;
      renderer.render(scene, camera);
    }

    function applyProgress(progress) {
      var front = materialFront.uniforms;
      front.uDissolve.value = progress;
      front.uGrayscale.value = Math.min(1.0, progress / 0.4);
      front.uEdgeIntensity.value = progress * 0.5;
      front.uEdgeBrightness.value = 1.0 - progress;

      var accelerated = Math.min(1.0, progress * 1.1);
      var back = materialBack.uniforms;
      back.uEdgeIntensity.value = 0.6 * (1.0 - accelerated);
      back.uDarkness.value = 1.0 - accelerated;
      back.uGrayscale.value = 1.0 - accelerated;
    }

    var ready = { front: false, back: false };
    function onLoad(side, texture) {
      texture.colorSpace = THREE.NoColorSpace;
      texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
      textures[side] = texture;
      var m = side === 'front' ? materialFront : materialBack;
      m.uniforms.uTexture.value = texture;
      m.uniforms.uImageResolution.value.set(texture.image.width, texture.image.height);
      ready[side] = true;
      if (ready.front && ready.back) {
        if (img) img.hidden = false; /* keep until first frame renders */
        resize();
        render();
        if (img) img.hidden = true;
        el.classList.add('sd-active');
      }
    }

    loader.load(frontSrc, onLoad.bind(null, 'front'));
    loader.load(backSrc, onLoad.bind(null, 'back'));

    var ro = new ResizeObserver(function () {
      resize();
      render();
    });
    ro.observe(viewport);

    ScrollTrigger.create({
      trigger: el,
      start: 'top top',
      end: function () { return '+=' + Math.round(window.innerHeight * 2); },
      scrub: 0.5,
      invalidateOnRefresh: true,
      onUpdate: function (self) {
        applyProgress(self.progress);
        render();
      }
    });
  }
})();
