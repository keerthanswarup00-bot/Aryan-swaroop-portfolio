/* Real Estate hero gallery — vanilla three.js port of the R3F `3d-gallery-photography`
   InfiniteGallery component. Same cloth shader, wrap/advance logic, fade/blur
   uniforms, hover flag wave, wheel + arrow-key input and 3s-idle auto-play.
   Renders into #reGallery on real-estate.html via js/vendor/three.module.min.js
   over a CSS starfield (re-hero-stars).

   Scroll lock: on fine-pointer devices the wheel/arrow keys drive the gallery
   while the hero is in view; after `unlockDelta` px of scrolling the lock
   releases and the page advances to the next section. Re-locks at the top.

   Fallbacks, in priority order:
     1. No JS -> starfield + hero copy (no canvas).
     2. prefers-reduced-motion -> starfield + hero copy (no canvas).
     3. No WebGL -> starfield + hero copy (no canvas).

   Options live in DEFAULT_OPTIONS below; the container may override them with a
   `data-re-gallery-options` JSON attribute (same shape as the React props). */
import * as THREE from './vendor/three.module.min.js';

const DEFAULT_OPTIONS = {
  images: [
    '/images/paavani-cards.jpg',
    '/images/paavani-main-gate.jpg',
    '/images/paavani-topview.jpg',
    '/images/paavani-family-1.jpg',
    '/images/paavani-family-2.jpg',
    '/images/paavani-plots.jpg',
    '/images/sidvin-billboard.jpg',
    '/images/sidvin-brochure.jpg',
    '/images/devaiah-row2-left.jpg',
    '/images/devaiah-row2-right.jpg',
    '/images/royalfarm-1.jpg',
    '/images/royalfarm-direction.jpg'
  ],
  speed: 1,
  zSpacing: 3,
  visibleCount: 8,
  falloff: { near: 0.8, far: 14 },
  depthRange: 50,
  fadeSettings: {
    fadeIn: { start: 0.08, end: 0.25 },
    fadeOut: { start: 0.72, end: 0.88 }
  },
  blurSettings: {
    blurIn: { start: 0.0, end: 0.1 },
    blurOut: { start: 0.72, end: 0.88 },
    maxBlur: 4.0
  },
  unlockDelta: 1500,
  advanceToNext: true
};

const MAX_HORIZONTAL_OFFSET = 8;
const MAX_VERTICAL_OFFSET = 8;

const VERTEX_SHADER = `
  uniform float scrollForce;
  uniform float time;
  uniform float isHovered;
  varying vec2 vUv;
  varying vec3 vNormal;

  void main() {
    vUv = uv;
    vNormal = normal;

    vec3 pos = position;

    float curveIntensity = scrollForce * 0.3;

    float distanceFromCenter = length(pos.xy);
    float curve = distanceFromCenter * distanceFromCenter * curveIntensity;

    float ripple1 = sin(pos.x * 2.0 + scrollForce * 3.0) * 0.02;
    float ripple2 = sin(pos.y * 2.5 + scrollForce * 2.0) * 0.015;
    float clothEffect = (ripple1 + ripple2) * abs(curveIntensity) * 2.0;

    float flagWave = 0.0;
    if (isHovered > 0.5) {
      float wavePhase = pos.x * 3.0 + time * 8.0;
      float waveAmplitude = sin(wavePhase) * 0.1;
      float dampening = smoothstep(-0.5, 0.5, pos.x);
      flagWave = waveAmplitude * dampening;

      float secondaryWave = sin(pos.x * 5.0 + time * 12.0) * 0.03 * dampening;
      flagWave += secondaryWave;
    }

    pos.z -= (curve + clothEffect + flagWave);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  uniform sampler2D map;
  uniform float opacity;
  uniform float blurAmount;
  uniform float scrollForce;
  varying vec2 vUv;

  void main() {
    vec4 color = texture2D(map, vUv);

    if (blurAmount > 0.0) {
      vec2 texelSize = 1.0 / vec2(textureSize(map, 0));
      vec4 blurred = vec4(0.0);
      float total = 0.0;

      for (float x = -2.0; x <= 2.0; x += 1.0) {
        for (float y = -2.0; y <= 2.0; y += 1.0) {
          vec2 offset = vec2(x, y) * texelSize * blurAmount;
          float weight = 1.0 / (1.0 + length(vec2(x, y)));
          blurred += texture2D(map, vUv + offset) * weight;
          total += weight;
        }
      }
      color = blurred / total;
    }

    color.rgb = pow(max(color.rgb, vec3(0.0)), vec3(2.2));

    float curveHighlight = abs(scrollForce) * 0.05;
    color.rgb += vec3(curveHighlight * 0.1);

    gl_FragColor = vec4(color.rgb, color.a * opacity);
  }
`;

function createClothMaterial() {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: {
      map: { value: null },
      opacity: { value: 1.0 },
      blurAmount: { value: 0.0 },
      scrollForce: { value: 0.0 },
      time: { value: 0.0 },
      isHovered: { value: 0.0 }
    },
    vertexShader: VERTEX_SHADER,
    fragmentShader: FRAGMENT_SHADER
  });
}

function webglAvailable() {
  try {
    const canvas = document.createElement('canvas');
    return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
  } catch (e) {
    return false;
  }
}

function loadTexture(loader, src) {
  return new Promise((resolve) => {
    loader.load(
      src,
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        resolve(texture);
      },
      undefined,
      () => resolve(null)
    );
  });
}

function setPlaneTexture(plane, mesh, material, textures) {
  const texture = textures[plane.imageIndex];
  if (!texture) return;
  material.uniforms.map.value = texture;
  const aspect = texture.image.width / texture.image.height;
  mesh.scale.set(aspect > 1 ? 2 * aspect : 2, aspect > 1 ? 2 : 2 / aspect, 1);
}

function initGallery(container, options) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(Math.max(1, container.clientWidth), Math.max(1, container.clientHeight), false);
  renderer.domElement.setAttribute('aria-hidden', 'true');
  container.appendChild(renderer.domElement);
  container.classList.add('re-gallery-active');

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 200);
  camera.position.set(0, 0, 0);

  const loader = new THREE.TextureLoader();
  Promise.all(options.images.map((src) => loadTexture(loader, src))).then((textures) => {
    const loaded = textures.filter(Boolean);
    if (loaded.length === 0) {
      renderer.dispose();
      renderer.domElement.remove();
      container.classList.remove('re-gallery-active');
      return;
    }

    const totalRange = options.depthRange;
    const spatialPositions = Array.from({ length: options.visibleCount }, (_, i) => {
      const horizontalAngle = (i * 2.618) % (Math.PI * 2);
      const verticalAngle = (i * 1.618 + Math.PI / 3) % (Math.PI * 2);
      const horizontalRadius = (i % 3) * 1.2;
      const verticalRadius = ((i + 1) % 4) * 0.8;
      return {
        x: (Math.sin(horizontalAngle) * horizontalRadius * MAX_HORIZONTAL_OFFSET) / 3,
        y: (Math.cos(verticalAngle) * verticalRadius * MAX_VERTICAL_OFFSET) / 4
      };
    });

    const materials = Array.from({ length: options.visibleCount }, () => createClothMaterial());
    const planesData = Array.from({ length: options.visibleCount }, (_, i) => ({
      index: i,
      z: ((totalRange / options.visibleCount) * i) % totalRange,
      imageIndex: i % loaded.length,
      x: spatialPositions[i].x,
      y: spatialPositions[i].y
    }));

    const geometry = new THREE.PlaneGeometry(1, 1, 32, 32);
    const meshes = planesData.map((plane, i) => {
      const mesh = new THREE.Mesh(geometry, materials[i]);
      setPlaneTexture(plane, mesh, materials[i], loaded);
      scene.add(mesh);
      return mesh;
    });

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const canvas = renderer.domElement;
    let hoveredMesh = null;

    const onPointerMove = (event) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(meshes, false);
      const hit = hits.length > 0 ? hits[0].object : null;
      if (hit !== hoveredMesh) {
        if (hoveredMesh) hoveredMesh.material.uniforms.isHovered.value = 0;
        hoveredMesh = hit;
        if (hoveredMesh) hoveredMesh.material.uniforms.isHovered.value = 1;
      }
    };
    const clearHover = () => {
      if (hoveredMesh) {
        hoveredMesh.material.uniforms.isHovered.value = 0;
        hoveredMesh = null;
      }
    };
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerleave', clearHover);

    const isOnScreen = () => {
      const rect = container.getBoundingClientRect();
      return rect.top < window.innerHeight && rect.bottom > 0;
    };

    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    let velocity = 0;
    let autoPlay = true;
    let lastInteraction = Date.now();
    let locked = finePointer.matches;
    let accumulated = 0;

    const heroSection = container.closest('section');
    const nextSection = heroSection ? heroSection.nextElementSibling : null;
    const hasNextSection = nextSection && nextSection.tagName === 'SECTION';

    const unlockGallery = () => {
      locked = false;
      if (options.advanceToNext && hasNextSection) {
        nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    const onWheel = (event) => {
      if (!isOnScreen() || !locked) return;
      event.preventDefault();
      velocity += event.deltaY * 0.01 * options.speed;
      autoPlay = false;
      lastInteraction = Date.now();
      accumulated += event.deltaY;
      if (accumulated > options.unlockDelta) unlockGallery();
    };
    const onKeyDown = (event) => {
      if (!isOnScreen()) return;
      const down = event.key === 'ArrowDown' || event.key === 'ArrowRight';
      const up = event.key === 'ArrowUp' || event.key === 'ArrowLeft';
      if (!down && !up) return;
      if (locked) event.preventDefault();
      if (down) velocity += 2 * options.speed;
      else velocity -= 2 * options.speed;
      autoPlay = false;
      lastInteraction = Date.now();
      if (locked && down) {
        accumulated += 60;
        if (accumulated > options.unlockDelta) unlockGallery();
      }
    };
    const onScroll = () => {
      if (window.scrollY <= 0) {
        locked = true;
        accumulated = 0;
      } else if (locked) {
        locked = false;
      }
    };
    const wheelTarget = heroSection || container;
    wheelTarget.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('scroll', onScroll, { passive: true });
    const onResize = () => {
      const width = Math.max(1, container.clientWidth);
      const height = Math.max(1, container.clientHeight);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', onResize);
    const resizeObserver = window.ResizeObserver ? new ResizeObserver(onResize) : null;
    if (resizeObserver) resizeObserver.observe(container);

    const timer = new THREE.Timer();
    const elapsed = { time: 0 };
    const fade = options.fadeSettings;
    const blur = options.blurSettings;
    const totalImages = loaded.length;
    const imageAdvance = totalImages > 0 ? (options.visibleCount % totalImages) || totalImages : 0;
    const halfRange = totalRange / 2;

    const tick = () => {
      timer.update();
      const delta = Math.min(timer.getDelta(), 0.05);
      elapsed.time += delta;

      if (Date.now() - lastInteraction > 3000) autoPlay = true;
      if (autoPlay) velocity += 0.3 * delta;
      velocity *= 0.95;
      if (Math.abs(velocity) < 0.0005) velocity = 0;

      materials.forEach((material) => {
        material.uniforms.time.value = elapsed.time;
        material.uniforms.scrollForce.value = velocity;
      });

      planesData.forEach((plane, i) => {
        let newZ = plane.z + velocity * delta * 10;
        let wrapsForward = 0;
        let wrapsBackward = 0;

        if (newZ >= totalRange) {
          wrapsForward = Math.floor(newZ / totalRange);
          newZ -= totalRange * wrapsForward;
        } else if (newZ < 0) {
          wrapsBackward = Math.ceil(-newZ / totalRange);
          newZ += totalRange * wrapsBackward;
        }

        if (wrapsForward > 0 && imageAdvance > 0) {
          plane.imageIndex = (plane.imageIndex + wrapsForward * imageAdvance) % totalImages;
          setPlaneTexture(plane, meshes[i], materials[i], loaded);
        }
        if (wrapsBackward > 0 && imageAdvance > 0) {
          const step = plane.imageIndex - wrapsBackward * imageAdvance;
          plane.imageIndex = ((step % totalImages) + totalImages) % totalImages;
          setPlaneTexture(plane, meshes[i], materials[i], loaded);
        }

        plane.z = ((newZ % totalRange) + totalRange) % totalRange;
        plane.x = spatialPositions[i].x;
        plane.y = spatialPositions[i].y;

        meshes[i].position.set(plane.x, plane.y, plane.z - halfRange);

        const normalizedPosition = plane.z / totalRange;
        let opacity = 1;

        if (normalizedPosition >= fade.fadeIn.start && normalizedPosition <= fade.fadeIn.end) {
          opacity = (normalizedPosition - fade.fadeIn.start) / (fade.fadeIn.end - fade.fadeIn.start);
        } else if (normalizedPosition < fade.fadeIn.start) {
          opacity = 0;
        } else if (normalizedPosition >= fade.fadeOut.start && normalizedPosition <= fade.fadeOut.end) {
          opacity = 1 - (normalizedPosition - fade.fadeOut.start) / (fade.fadeOut.end - fade.fadeOut.start);
        } else if (normalizedPosition > fade.fadeOut.end) {
          opacity = 0;
        }
        opacity = Math.max(0, Math.min(1, opacity));

        let blurAmount = 0;
        if (normalizedPosition >= blur.blurIn.start && normalizedPosition <= blur.blurIn.end) {
          blurAmount = blur.maxBlur * (1 - (normalizedPosition - blur.blurIn.start) / (blur.blurIn.end - blur.blurIn.start));
        } else if (normalizedPosition < blur.blurIn.start) {
          blurAmount = blur.maxBlur;
        } else if (normalizedPosition >= blur.blurOut.start && normalizedPosition <= blur.blurOut.end) {
          blurAmount = blur.maxBlur * ((normalizedPosition - blur.blurOut.start) / (blur.blurOut.end - blur.blurOut.start));
        } else if (normalizedPosition > blur.blurOut.end) {
          blurAmount = blur.maxBlur;
        }
        blurAmount = Math.max(0, Math.min(blur.maxBlur, blurAmount));

        materials[i].uniforms.opacity.value = opacity;
        materials[i].uniforms.blurAmount.value = blurAmount;
      });

      renderer.render(scene, camera);
      requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  });
}

(function start() {
  const el = document.getElementById('reGallery');
  if (!el || window.__reGalleryStarted) return;
  window.__reGalleryStarted = true;

  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!webglAvailable()) return;

  let options = DEFAULT_OPTIONS;
  try {
    if (el.dataset.reGalleryOptions) {
      options = { ...DEFAULT_OPTIONS, ...JSON.parse(el.dataset.reGalleryOptions) };
    }
  } catch (e) {
    options = DEFAULT_OPTIONS;
  }

  initGallery(el, options);
})();
