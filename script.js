// Intro flash sequence
(function(){
  var overlay=document.getElementById('intro-overlay');
  var text=document.getElementById('intro-text');
  if(!overlay||!text||sessionStorage.getItem('introSeen')||window.matchMedia('(prefers-reduced-motion:reduce)').matches){
    if(overlay)overlay.remove();
    return;
  }
  var words=['Branding','Designer','3D Walkthrough','Developer','Marketing','Motion Design'];
  var wi=0;
  text.textContent='Aryan Swaroop';
  text.style.opacity='1';
  setTimeout(function(){
    text.style.opacity='0';
    setTimeout(function(){
      text.classList.add('flash');
      flashNext();
    },200);
  },1000);
  function flashNext(){
    if(wi>=words.length){
      sessionStorage.setItem('introSeen','1');
      overlay.classList.add('done');
      setTimeout(function(){overlay.remove();},250);
      return;
    }
    text.textContent=words[wi];
    text.style.opacity='1';
    setTimeout(function(){
      text.style.opacity='0';
      wi++;
      setTimeout(flashNext,20);
    },140);
  }
})();

// Reduced motion check
var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Page transition — fade in on load, fade out on nav
document.body.classList.add('loaded');
if (!prefersReducedMotion) {
  document.querySelectorAll('a[href^="/"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      var href = a.getAttribute('href');
      document.body.classList.remove('loaded');
      document.body.classList.add('fade-out');
      setTimeout(function () { window.location.href = href; }, 180);
    });
  });
}

// Custom cursor
var cur = document.getElementById('cur');
if (cur && !prefersReducedMotion) {
  var curSpan = cur.querySelector('span');
  window.addEventListener('mousemove', function (e) {
    cur.style.left = e.clientX + 'px';
    cur.style.top = e.clientY + 'px';
  }, { passive: true });
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

// Hamburger menu + overlay close
var hamburger = document.getElementById('hamburger');
var navOverlay = document.getElementById('navOverlay');
var overlayClose = document.getElementById('overlayClose');
if (hamburger && navOverlay) {
  hamburger.addEventListener('click', function () {
    var open = hamburger.classList.toggle('open');
    navOverlay.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', open);
  });
  function closeNav() {
    hamburger.classList.remove('open');
    navOverlay.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  }
  if (overlayClose) overlayClose.addEventListener('click', closeNav);
  navOverlay.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', closeNav);
  });
}

// Scroll progress bar
(function(){
  var bar=document.getElementById('scrollBar');
  if(!bar)return;
  function update(){
    var doc=document.documentElement;
    var pct=doc.scrollHeight>doc.clientHeight?(doc.scrollTop/(doc.scrollHeight-doc.clientHeight))*100:0;
    bar.style.width=pct+'%';
  }
  window.addEventListener('scroll',update,{passive:true});
  update();
})();

// Typewriter cycle for "Open to Work" badge (desktop header)
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

// Scroll reveal — section headers (skip hero elements)
(function(){
  if (prefersReducedMotion) return;
  var targets = document.querySelectorAll('section .kicker, section h2, .page-header .kicker, .page-header h1');
  targets.forEach(function(el){ el.classList.add('reveal'); });
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  targets.forEach(function(el) { observer.observe(el); });
})();

// Copy email
document.querySelectorAll('.copy-email').forEach(function(btn) {
  var original = btn.innerHTML;
  btn.addEventListener('click', async function() {
    try {
      await navigator.clipboard.writeText(btn.dataset.email);
      btn.innerHTML = 'Copied \u2713';
      btn.classList.add('copied');
      setTimeout(function() { btn.innerHTML = original; btn.classList.remove('copied'); }, 1800);
    } catch(e) {}
  });
});

