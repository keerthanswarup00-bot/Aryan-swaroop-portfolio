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
  requestAnimationFrame(function(){text.style.opacity='1';});
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
  function openMenu(){clearTimeout(closeTimer);dd.classList.add('open');trigger.setAttribute('aria-expanded','true');}
  function closeMenu(){closeTimer=setTimeout(function(){dd.classList.remove('open');trigger.setAttribute('aria-expanded','false');},200);}
  function cancelClose(){clearTimeout(closeTimer);}
  trigger.addEventListener('mouseenter',function(){if(window.innerWidth>700)openMenu();});
  dd.addEventListener('mouseenter',function(){if(window.innerWidth>700)cancelClose();});
  trigger.addEventListener('mouseleave',function(){if(window.innerWidth>700)closeMenu();});
  menu.addEventListener('mouseenter',function(){if(window.innerWidth>700)cancelClose();});
  menu.addEventListener('mouseleave',function(){if(window.innerWidth>700)closeMenu();});
  trigger.addEventListener('click',function(e){
    if(window.innerWidth<=700){e.preventDefault();dd.classList.toggle('open');trigger.setAttribute('aria-expanded',dd.classList.contains('open'));}
    else{if(dd.classList.contains('open'))closeMenu();else openMenu();}
  });
  document.addEventListener('keydown',function(e){if(e.key==='Escape')dd.classList.remove('open');});
  document.addEventListener('click',function(e){if(!dd.contains(e.target))dd.classList.remove('open');});
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

// Disable right-click on images + prevent drag
document.addEventListener('contextmenu',function(e){if(e.target.tagName==='IMG')e.preventDefault();});
document.addEventListener('dragstart',function(e){if(e.target.tagName==='IMG')e.preventDefault();});

