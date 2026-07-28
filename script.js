// Intro flash sequence
(function(){
  var overlay=document.getElementById('intro-overlay');
  var text=document.getElementById('intro-text');
  if(!overlay||!text||window.matchMedia('(prefers-reduced-motion:reduce)').matches){
    if(overlay)overlay.remove();
    return;
  }
  var words=['.Branding','.Designer','.3D Walkthrough','.Developer','.Marketing','.Motion Design'];
  var wi=0;
  text.textContent='Aryan Swaroop';
  text.style.opacity='1';
  text.style.transition='opacity 1.2s ease-in';
  setTimeout(function(){text.style.opacity='1';},50);
  setTimeout(function(){
    text.style.transition='opacity 0.6s ease-out';
    text.style.opacity='0';
    setTimeout(function(){
      text.classList.add('flash');
      text.style.transition='none';
      flashNext();
    },600);
  },1800);
  function flashNext(){
    if(wi>=words.length){
      overlay.classList.add('done');
      setTimeout(function(){overlay.remove();},250);
      return;
    }
    text.textContent=words[wi];
    text.style.opacity='1';
    setTimeout(function(){
      text.style.opacity='0';
      wi++;
      setTimeout(flashNext,40);
    },350);
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
  function isDarkBg(el) {
    while (el && el !== document.body) {
      var bg = getComputedStyle(el).backgroundColor;
      if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
        var m = bg.match(/\d+/g);
        if (m && ((parseInt(m[0]) + parseInt(m[1]) + parseInt(m[2])) / 3) < 80) return true;
        return false;
      }
      el = el.parentElement;
    }
    return false;
  }
  window.addEventListener('mousemove', function (e) {
    cur.style.left = e.clientX + 'px';
    cur.style.top = e.clientY + 'px';
    cur.style.display = 'none';
    var under = document.elementFromPoint(e.clientX, e.clientY);
    cur.style.display = '';
    if (under && isDarkBg(under)) cur.classList.add('dark');
    else cur.classList.remove('dark');
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
// Mobile menu — premium
(function(){
  var hamburger=document.getElementById('hamburger');
  var menu=document.getElementById('mobileMenu');
  var closeBtn=document.getElementById('mobileClose');
  if(!hamburger||!menu)return;
  var scrollY=0;
  function openMenu(){
    scrollY=window.scrollY;
    document.body.style.position='fixed';
    document.body.style.top='-'+scrollY+'px';
    document.body.style.width='100%';
    menu.classList.add('open');
    menu.setAttribute('aria-hidden','false');
    hamburger.setAttribute('aria-expanded','true');
    hamburger.classList.add('open');
    menu.scrollTop=0;
    var items=menu.querySelectorAll('.mobile-nav-link, .mobile-project-row, .mobile-explore-link, .mobile-section-heading');
    items.forEach(function(el,i){
      el.style.opacity='0';
      el.style.transform='translateY(12px)';
      setTimeout(function(){
        el.style.transition='opacity .3s cubic-bezier(.22,1,.36,1), transform .3s cubic-bezier(.22,1,.36,1)';
        el.style.opacity='1';
        el.style.transform='translateY(0)';
      },60+i*40);
    });
  }
  function closeMenu(){
    document.body.style.position='';
    document.body.style.top='';
    document.body.style.width='';
    menu.classList.remove('open');
    menu.setAttribute('aria-hidden','true');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded','false');
    window.scrollTo(0,scrollY);
  }
  hamburger.addEventListener('click',function(){
    if(menu.classList.contains('open'))closeMenu();else openMenu();
  });
  if(closeBtn)closeBtn.addEventListener('click',closeMenu);
  menu.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click',function(){
      setTimeout(closeMenu,100);
    });
  });
  document.addEventListener('keydown',function(e){
    if(e.key==='Escape'&&menu.classList.contains('open'))closeMenu();
  });
  var touchStartY=0;
  menu.addEventListener('touchstart',function(e){touchStartY=e.touches[0].clientY;},{passive:true});
  menu.addEventListener('touchend',function(e){
    var diff=touchStartY-e.changedTouches[0].clientY;
    if(diff>80&&menu.scrollTop<=0)closeMenu();
  },{passive:true});
})();

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

// Mega dropdown — hover delay + mobile toggle
(function(){
  var dd=document.getElementById('designDropdown');
  if(!dd)return;
  var trigger=dd.querySelector('.nav-dropdown-trigger');
  var menu=dd.querySelector('.mega-menu');
  var closeTimer=null;
  function blockReveal(){window.dispatchEvent(new CustomEvent('revealblock'));}
  function unblockReveal(){window.dispatchEvent(new CustomEvent('revealunblock'));}
  function openMenu(){clearTimeout(closeTimer);dd.classList.add('open');trigger.setAttribute('aria-expanded','true');blockReveal();}
  function closeMenu(){closeTimer=setTimeout(function(){dd.classList.remove('open');trigger.setAttribute('aria-expanded','false');unblockReveal();},250);}
  function cancelClose(){clearTimeout(closeTimer);}
  trigger.addEventListener('mouseenter',function(){if(window.innerWidth>700)openMenu();});
  trigger.addEventListener('mouseleave',function(){if(window.innerWidth>700)closeMenu();});
  menu.addEventListener('mouseenter',function(){if(window.innerWidth>700)cancelClose();});
  menu.addEventListener('mouseleave',function(){if(window.innerWidth>700)closeMenu();});
  trigger.addEventListener('click',function(e){
    if(window.innerWidth<=700){e.preventDefault();dd.classList.toggle('open');trigger.setAttribute('aria-expanded',dd.classList.contains('open'));if(dd.classList.contains('open'))blockReveal();else unblockReveal();}
    else{if(dd.classList.contains('open'))closeMenu();else openMenu();}
  });
  document.addEventListener('keydown',function(e){if(e.key==='Escape')dd.classList.remove('open');});
  document.addEventListener('click',function(e){if(!dd.contains(e.target) && dd.classList.contains('open')){dd.classList.remove('open');trigger.setAttribute('aria-expanded','false');unblockReveal();}});
})();

// Block cursor reveal on nav hover
(function(){
  var header=document.querySelector('.site-header');
  if(!header)return;
  header.addEventListener('mouseenter',function(){window.dispatchEvent(new CustomEvent('revealblock'));});
  header.addEventListener('mouseleave',function(){
    var dd=document.getElementById('designDropdown');
    if(!dd || !dd.classList.contains('open'))
      window.dispatchEvent(new CustomEvent('revealunblock'));
  });
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
  var aboutReveals = document.querySelectorAll('.about-story .reveal');
  aboutReveals.forEach(function(el) { observer.observe(el); });
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

// Desktop-only home page image click navigation
if(window.matchMedia('(min-width:1024px)').matches && document.querySelector('.hero-v3')){
  var featureImg=document.querySelector('#brahmi .feature-visual');
  if(featureImg && !featureImg.closest('a')){
    featureImg.style.cursor='pointer';
    featureImg.addEventListener('click',function(){window.location.href='/lifestyle';});
  }
  var aboutImg=document.querySelector('#about .about-photo');
  if(aboutImg && !aboutImg.closest('a')){
    aboutImg.style.cursor='pointer';
    aboutImg.addEventListener('click',function(){window.location.href='/about';});
  }
}

// ── Hero text + cursor reveal ──
(function(){
  if(prefersReducedMotion) return;

  var TEXT_1 = 'Not another portfolio.';
  var TEXT_2 = 'Just my best work.';

  var IMAGES = [
    'images/brahmi-pourshot.jpg',
    'images/brahmi-shelf.jpg',
    'images/brahmi-label.jpg',
    'images/brahmi-kolam.jpg',
    'images/brahmi-courtyard.jpg',
    'images/brahmi-tumbler.jpg',
    'images/brahmi-spices.jpg',
    'images/brahmi-doorway.jpg',
    'images/snehaloka-aerial.jpg'
  ];

  var MAX_VISIBLE = 6;
  var SPAWN_MIN = 60;
  var SPAWN_MAX = 100;
  var IMG_SIZE = 170;
  var ROTATIONS = [-3, -1, 0, 1, 3];
  var BEHIND = 15;
  var DESKTOP = 1024;

  // Preload
  IMAGES.forEach(function(src){ var i=new Image(); i.src=src; });

  // State
  var heroSection = document.querySelector('.hero-section');
  var line1 = document.getElementById('hero-line-1');
  var line2 = document.getElementById('hero-line-2');
  var animFinished = false;
  if(!line1 || !line2) return;

  line1.textContent = TEXT_1;
  line2.textContent = TEXT_2;

  var enabled = false;
  var blocked = false;
  var active = [];
  var lastIdx = -1;
  var lastX = 0, lastY = 0;
  var accDist = 0;
  var stopTimer = null;
  var isDesktop = window.innerWidth >= DESKTOP;

  // ── Text fade-in ──
  function fadeInText(){
    line1.classList.add('visible');
    line2.classList.add('visible');
  }

  // ── Image lifecycle ──
  function rand(min, max){ return Math.random()*(max-min)+min; }

  function getImageIdx(){
    var idx;
    do { idx = Math.floor(Math.random()*IMAGES.length); }
    while(idx === lastIdx && IMAGES.length > 1);
    lastIdx = idx;
    return idx;
  }

  function spawnAt(cx, cy, mx, my){
    if(active.length >= MAX_VISIBLE){
      removeOldest();
    }

    var idx = getImageIdx();
    var size = IMG_SIZE;
    var rot = ROTATIONS[Math.floor(Math.random()*ROTATIONS.length)];
    var appearMs = rand(250, 350);

    // Behind the movement direction + slight jitter
    var dx = cx - mx, dy = cy - my;
    var mDist = Math.sqrt(dx*dx + dy*dy);
    var offX = 0, offY = 0;
    if(mDist > 0){
      offX = -(dx/mDist) * BEHIND;
      offY = -(dy/mDist) * BEHIND;
    }
    offX += (rand(5, 15)) * (Math.random() > 0.5 ? 1 : -1);
    offY += (rand(5, 15)) * (Math.random() > 0.5 ? 1 : -1);

    var el = document.createElement('div');
    el.className = 'hero-reveal-image';
    el.style.left = (cx + offX - size/2) + 'px';
    el.style.top = (cy + offY - size/2) + 'px';
    el.style.width = size + 'px';
    el.style.zIndex = 9990 + active.length;
    el.style.transform = 'translate3d(0,0,0) scale(0.6) rotate(' + rot + 'deg)';

    var elImg = document.createElement('img');
    elImg.src = IMAGES[idx];
    elImg.draggable = false;
    elImg.alt = '';
    elImg.style.opacity = '0';
    elImg.style.transition = 'opacity ' + appearMs + 'ms ease-out, transform ' + appearMs + 'ms cubic-bezier(.34,1.56,.64,1)';

    el.appendChild(elImg);
    document.body.appendChild(el);

    requestAnimationFrame(function(){
      requestAnimationFrame(function(){
        elImg.style.opacity = '1';
        elImg.style.transform = 'scale(1)';
      });
    });

    active.push(el);

    // Auto-fade after a short life
    var lifeMs = rand(800, 1200);
    el._fadeTimer = setTimeout(function(){
      removeImage(el);
    }, lifeMs);
  }

  function removeImage(el){
    if(el._removing) return;
    el._removing = true;
    clearTimeout(el._fadeTimer);

    var removeMs = rand(600, 800);
    var img = el.querySelector('img');
    if(img){
      img.style.transition = 'opacity ' + removeMs + 'ms ease-out, transform ' + removeMs + 'ms cubic-bezier(.5,0,.5,1)';
      img.style.opacity = '0';
      img.style.transform = 'scale(0.2)';
    }
    el.style.transition = 'opacity ' + removeMs + 'ms ease-out';
    el.style.opacity = '0';
    setTimeout(function(){
      if(el.parentNode) el.parentNode.removeChild(el);
    }, removeMs + 50);
  }

  function removeOldest(){
    if(!active.length) return;
    removeImage(active.shift());
  }

  function fadeOutAll(){
    var copy = active.splice(0, active.length);
    copy.forEach(removeImage);
  }

  function fadeOutTrail(){
    if(!active.length) return;
    accDist = 0;
    var items = active.splice(0, active.length);
    items.forEach(function(el, i){
      setTimeout(function(){
        removeImage(el);
      }, i * 150);
    });
  }

  // ── Mouse (accumulated distance tracking) ──
  function onMove(e){
    if(!enabled || !isDesktop || blocked) return;
    if(heroSection){
      var rect = heroSection.getBoundingClientRect();
      if(e.clientY < rect.top || e.clientY > rect.bottom || e.clientX < rect.left || e.clientX > rect.right) return;
    }
    var x = e.clientX, y = e.clientY;

    clearTimeout(stopTimer);
    stopTimer = setTimeout(function(){
      fadeOutTrail();
    }, 500);

    var prevX = lastX, prevY = lastY;
    var dist = Math.sqrt(Math.pow(x-prevX,2)+Math.pow(y-prevY,2));
    lastX = x;
    lastY = y;
    accDist += dist;
    var threshold = rand(SPAWN_MIN, SPAWN_MAX);
    if(accDist < threshold) return;

    spawnAt(x, y, prevX, prevY);
    accDist = 0;
  }

  function enableReveal(){
    if(enabled) return;
    enabled = true;
    window.addEventListener('mousemove', onMove, { passive: true });
  }

  function disableReveal(){
    enabled = false;
    window.removeEventListener('mousemove', onMove);
    fadeOutAll();
    clearTimeout(stopTimer);
  }

  function checkHeroActive(){
    if(!animFinished || !heroSection) return;
    var rect = heroSection.getBoundingClientRect();
    var isHeroVisible = rect.bottom > 0;
    if(isHeroVisible && !enabled && isDesktop){
      enableReveal();
    } else if(!isHeroVisible && enabled){
      disableReveal();
    }
  }

  window.addEventListener('revealblock', function(){
    blocked = true;
    fadeOutAll();
    clearTimeout(stopTimer);
  });
  window.addEventListener('revealunblock', function(){
    blocked = false;
    checkHeroActive();
  });

  window.addEventListener('scroll', checkHeroActive, { passive: true });

  window.addEventListener('resize', function(){
    var was = isDesktop;
    isDesktop = window.innerWidth >= DESKTOP;
    if(was && !isDesktop){
      disableReveal();
    } else if(!was && isDesktop){
      checkHeroActive();
    }
  });

  // ── Wait for intro to finish ──
  function startAnimation(){
    fadeInText();
    window.dispatchEvent(new CustomEvent('hero:ready'));
    setTimeout(function(){
      animFinished = true;
      checkHeroActive();
    }, 1000);
  }

  if(!document.getElementById('intro-overlay')){
    startAnimation();
  } else {
    var obs = new MutationObserver(function(){
      if(!document.getElementById('intro-overlay')){
        obs.disconnect();
        startAnimation();
      }
    });
    obs.observe(document.body, { childList: true });
    setTimeout(startAnimation, 5200);
  }
})();

// ── Number rolling for hero stats ──
(function(){
  var counters = document.querySelectorAll('.stat-count');
  if(!counters.length) return;
  function easeOutCubic(t){return 1-Math.pow(1-t,3);}
  function animateCount(el){
    var target = parseInt(el.getAttribute('data-target'), 10);
    var duration = 1500;
    var start = performance.now();
    function tick(now){
      var t = Math.min((now - start) / duration, 1);
      var val = Math.round(easeOutCubic(t) * target);
      el.textContent = val;
      if(t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  function startRolling(){
    counters.forEach(animateCount);
  }
  window.addEventListener('hero:ready', startRolling, { once: true });
})();

// Disable right-click on images + prevent drag
// ── Dark nav when hero in view (mobile) ──
(function(){
  var header=document.querySelector('.site-header');
  var hero=document.querySelector('.hero-section');
  if(!header||!hero)return;
  var mq=window.matchMedia('(max-width:640px)');
  function updateNav(){
    if(!mq.matches){header.classList.remove('nav-dark');return;}
    var rect=hero.getBoundingClientRect();
    header.classList.toggle('nav-dark',rect.bottom>0);
  }
  updateNav();
  mq.addEventListener('change',updateNav);
  window.addEventListener('scroll',updateNav,{passive:true});
})();

document.addEventListener('contextmenu',function(e){if(e.target.tagName==='IMG')e.preventDefault();});
document.addEventListener('dragstart',function(e){if(e.target.tagName==='IMG')e.preventDefault();});
