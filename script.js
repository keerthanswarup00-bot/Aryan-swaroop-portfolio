// Reduced motion check
var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Custom cursor
var cur = document.getElementById('cur');
if (cur && !prefersReducedMotion) {
  var curSpan = cur.querySelector('span');
  window.addEventListener('mousemove', function (e) {
    cur.style.left = e.clientX + 'px';
    cur.style.top = e.clientY + 'px';
  });
  document.querySelectorAll('[data-cur]').forEach(function (el) {
    el.addEventListener('mouseenter', function () {
      cur.classList.add('grow');
      curSpan.textContent = el.getAttribute('data-cur');
    });
    el.addEventListener('mouseleave', function () {
      cur.classList.remove('grow');
      curSpan.textContent = '';
    });
  });
}

// Hamburger menu
var hamburger = document.getElementById('hamburger');
var navOverlay = document.getElementById('navOverlay');
if (hamburger && navOverlay) {
  hamburger.addEventListener('click', function () {
    var open = hamburger.classList.toggle('open');
    navOverlay.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', open);
  });
  navOverlay.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      hamburger.classList.remove('open');
      navOverlay.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
}

// Typewriter cycle for "Open to Work" badge
function typeCycle(el, words) {
  var wIndex = 0, cIndex = 0, deleting = false;
  function tick() {
    var word = words[wIndex];
    if (!deleting) {
      cIndex++;
      el.textContent = word.slice(0, cIndex);
      if (cIndex === word.length) {
        deleting = false;
        return setTimeout(function () { deleting = true; tick(); }, 3000);
      }
      setTimeout(tick, 55);
    } else {
      cIndex--;
      el.textContent = word.slice(0, cIndex);
      if (cIndex === 0) {
        deleting = false;
        wIndex = (wIndex + 1) % words.length;
        return setTimeout(tick, 300);
      }
      setTimeout(tick, 28);
    }
  }
  tick();
}
if (!prefersReducedMotion) {
  document.querySelectorAll('.type-cycle').forEach(function (el) {
    typeCycle(el, ['Branding', 'Logo Design', 'Packaging', '3D Walkthrough', 'Motion Design']);
  });
} else {
  document.querySelectorAll('.type-cycle').forEach(function (el) {
    el.textContent = 'Design';
  });
}

// Rolling number animation for stats
document.querySelectorAll('.stat-num').forEach(function (el) {
  var target = parseInt(el.getAttribute('data-target'), 10);
  var suffix = el.getAttribute('data-suffix') || '';
  if (prefersReducedMotion) {
    el.textContent = target + suffix;
    return;
  }
  var duration = 2000;
  var startTime = null;
  function animate(ts) {
    if (!startTime) startTime = ts;
    var progress = Math.min((ts - startTime) / duration, 1);
    var eased = 1 - Math.pow(1 - progress, 3);
    var current = Math.round(eased * target);
    el.textContent = current + suffix;
    if (progress < 1) requestAnimationFrame(animate);
    else el.textContent = target + suffix;
  }
  var obs = new IntersectionObserver(function (entries) {
    if (entries[0].isIntersecting) { startTime = null; requestAnimationFrame(animate); obs.disconnect(); }
  }, { threshold: 0.3 });
  obs.observe(el);
});

// Blob manifest — remap images uploaded via admin
fetch('/api/manifest').then(function(r){return r.json();}).then(function(manifest){
  if(!manifest || typeof manifest!=='object') return;
  document.querySelectorAll('img').forEach(function(img){
    var src=img.getAttribute('src');
    if(!src) return;
    var name=src.replace(/^.*[\\/]/,'').split('?')[0];
    if(manifest[name]) img.src=manifest[name];
  });
}).catch(function(){});

