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
setTimeout(function(){text.style.opacity='1'},50);
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
setTimeout(function(){overlay.remove()},250);
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
if (navigator.vendor && navigator.vendor.indexOf('Apple') > -1) document.documentElement.classList.add('sf-safari');
var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if(document.body) document.body.classList.add('loaded');
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
var cur = document.getElementById('cur');
if (cur && !prefersReducedMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
var curSpan = cur.querySelector('span') || {};
var pageIsDark = document.body.classList.contains('page-dark');
var cursorTheme = pageIsDark ? 'dark' : 'light';
var dotSize = 18;
var curSize = window.innerWidth >= 1024 ? 132 : 108;
var size = dotSize, targetSize = dotSize;
var px = -100, py = -100, tx = -100, ty = -100;
var activeEl = null;
var rafId = null;
var scrollPending = false;
var TARGET_SEL = '[data-cur], [data-image-reveal], .sfp-media, .pg-item';
function sectionTheme(el) {
  if (!el) return null;
  if (el.classList && (el.classList.contains('theme-dark') || el.classList.contains('page-dark'))) return 'dark';
  if (el.classList && el.classList.contains('theme-light')) return 'light';
  var t = el.getAttribute ? el.getAttribute('data-theme') : null;
  if (t === 'dark' || t === 'light') return t;
  return null;
}
function applyTheme(theme) {
  if (theme === cursorTheme) return;
  cursorTheme = theme;
  cur.classList.toggle('cursor-dark', theme === 'light');
  cur.classList.toggle('cursor-light', theme === 'dark');
}
function themeAt(x, y) {
  var el = document.elementFromPoint(x, y);
  while (el) {
    var t = sectionTheme(el);
    if (t) return t;
    if (el === document.body) break;
    el = el.parentElement;
  }
  return pageIsDark ? 'dark' : 'light';
}
function setActive(el) {
  if (el === activeEl) return;
  if (activeEl && activeEl.classList) activeEl.classList.remove('cursor-img-active');
  activeEl = el;
  if (el) {
    var labelText = (el.getAttribute('data-cur') || el.getAttribute('data-image-reveal') || '').trim() || 'VIEW';
    curSpan.textContent = labelText;
    cur.classList.add('invert');
    cur.classList.add('show-label');
    targetSize = curSize;
    if (el.querySelector && el.querySelector('img, picture')) el.classList.add('cursor-img-active');
  } else {
    cur.classList.remove('show-label');
    targetSize = dotSize;
  }
}
document.addEventListener('mouseover', function (e) {
  var el = e.target && e.target.closest ? e.target.closest(TARGET_SEL) : null;
  if (el) setActive(el);
}, { passive: true });
document.addEventListener('mouseout', function (e) {
  if (!activeEl) return;
  var t = e.target;
  if (t !== activeEl && !activeEl.contains(t)) return;
  var to = e.relatedTarget;
  if (to && activeEl.contains(to)) return;
  setActive(null);
}, { passive: true });
window.addEventListener('mousemove', function (e) {
  tx = e.clientX;
  ty = e.clientY;
  applyTheme(themeAt(e.clientX, e.clientY));
}, { passive: true });
window.addEventListener('scroll', function () {
  if (scrollPending || !activeEl || tx < 0) return;
  scrollPending = true;
  requestAnimationFrame(function () {
    scrollPending = false;
    var el = document.elementFromPoint(tx, ty);
    if (!el) return;
    var hit = el.closest ? el.closest(TARGET_SEL) : null;
    setActive(hit);
  });
}, { passive: true });
window.addEventListener('resize', function () {
  curSize = window.innerWidth >= 1024 ? 132 : 108;
  if (activeEl) targetSize = curSize;
}, { passive: true });
function frame() {
  rafId = requestAnimationFrame(frame);
  size += (targetSize - size) * 0.22;
  if (Math.abs(size - targetSize) < 0.05) size = targetSize;
  if (!activeEl && size === dotSize && cur.classList.contains('invert')) {
    cur.classList.remove('invert');
    curSpan.textContent = '';
  }
  px = tx;
  py = ty;
  cur.style.transform = 'translate3d(' + (px - size / 2).toFixed(2) + 'px,' + (py - size / 2).toFixed(2) + 'px,0)';
  cur.style.width = size.toFixed(2) + 'px';
  cur.style.height = size.toFixed(2) + 'px';
}
rafId = requestAnimationFrame(frame);
applyTheme(pageIsDark ? 'dark' : 'light');
}
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
var root=document.documentElement;
var prev=root.style.scrollBehavior;
root.style.scrollBehavior='auto';
window.scrollTo(0,scrollY);
root.style.scrollBehavior=prev;
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
menu.addEventListener('touchstart',function(e){touchStartY=e.touches[0].clientY},{passive:true});
menu.addEventListener('touchend',function(e){
var diff=touchStartY-e.changedTouches[0].clientY;
if(diff>80&&menu.scrollTop<=0)closeMenu();
},{passive:true});
})();
(function(){
var bar=document.getElementById('scrollBar');
if(!bar)return;
var header=document.querySelector('.site-header');
var mProg=document.getElementById('mobileProgress');
var mBar=document.getElementById('mobileProgressBar');
var hero=document.querySelector('.hero-section');
var heroBottom=0;
function measureHero(){
heroBottom=hero?hero.offsetTop+hero.offsetHeight:0;
}
var ticking=false;
var lastPct=-1;
function update(){
ticking=false;
var doc=document.documentElement;
var max=doc.scrollHeight-doc.clientHeight;
var pct=max>0?(doc.scrollTop/max)*100:0;
if(pct===lastPct)return;
lastPct=pct;
bar.style.width=pct+'%';
if(header)header.classList.toggle('scrolling',pct>0.5&&pct<99.5);
if(header)header.classList.toggle('is-compact',doc.scrollTop>40);
if(mBar){
mBar.style.width=pct+'%';
var past=doc.scrollTop>heroBottom;
if(mProg)mProg.classList.toggle('visible',past);
document.body.classList.toggle('past-hero',past);
}
}
function requestUpdate(){
if(!ticking){ticking=true;requestAnimationFrame(update);}
}
measureHero();
window.addEventListener('scroll',requestUpdate,{passive:true});
window.addEventListener('resize',function(){measureHero();requestUpdate();},{passive:true});
update();
})();
(function(){
var dd=document.getElementById('designDropdown');
if(!dd)return;
var trigger=dd.querySelector('.nav-dropdown-trigger');
var menu=dd.querySelector('.mega-menu-root');
if(!trigger||!menu)return;
var closeTimer=null;
var reopenGuard=false;
function blockReveal(){window.dispatchEvent(new CustomEvent('revealblock'))}
function unblockReveal(){window.dispatchEvent(new CustomEvent('revealunblock'))}
function openMenu(){clearTimeout(closeTimer);dd.classList.add('open');trigger.setAttribute('aria-expanded','true');blockReveal()}
function closeNow(){clearTimeout(closeTimer);dd.classList.remove('open');trigger.setAttribute('aria-expanded','false');unblockReveal()}
function closeMenu(){closeTimer=setTimeout(closeNow,250)}
function cancelClose(){clearTimeout(closeTimer)}
trigger.addEventListener('mouseenter',function(){if(window.innerWidth>700)openMenu()});
trigger.addEventListener('mouseleave',function(){if(window.innerWidth>700)closeMenu()});
menu.addEventListener('mouseenter',function(){if(window.innerWidth>700)cancelClose()});
menu.addEventListener('mouseleave',function(){if(window.innerWidth>700)closeMenu()});
trigger.addEventListener('click',function(e){
if(window.innerWidth<=700){e.preventDefault();dd.classList.toggle('open');trigger.setAttribute('aria-expanded',dd.classList.contains('open'));if(dd.classList.contains('open'))blockReveal();else unblockReveal()}
else{if(dd.classList.contains('open'))closeMenu();else openMenu()}
});
trigger.addEventListener('focus',function(){if(window.innerWidth>700&&!reopenGuard)openMenu()});
document.addEventListener('keydown',function(e){
if(e.key==='Escape'&&dd.classList.contains('open')){closeNow();reopenGuard=true;trigger.focus();setTimeout(function(){reopenGuard=false},0)}
});
dd.addEventListener('focusout',function(e){if(window.innerWidth>700&&!dd.contains(e.relatedTarget))closeNow()});
document.addEventListener('click',function(e){if(!dd.contains(e.target) && dd.classList.contains('open'))closeNow()});
})();
(function(){
var header=document.querySelector('.site-header');
if(!header)return;
header.addEventListener('mouseenter',function(){window.dispatchEvent(new CustomEvent('revealblock'))});
header.addEventListener('mouseleave',function(){
var dd=document.getElementById('designDropdown');
if(!dd || !dd.classList.contains('open'))
window.dispatchEvent(new CustomEvent('revealunblock'));
});
})();
function typeCycle(el, words) {
var wIndex = 0, cIndex = 0, deleting = false;
function tick() {
var word = words[wIndex];
if (!deleting) {
cIndex++;
el.textContent = word.slice(0, cIndex);
if (cIndex === word.length) {
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
if(window.matchMedia('(min-width:1024px)').matches && document.querySelector('.hero-v3')){
var featureImg=document.querySelector('#brahmi .feature-visual');
if(featureImg && !featureImg.closest('a')){
featureImg.style.cursor='pointer';
featureImg.addEventListener('click',function(){window.location.href='/work/brahmi.html'});
}
var aboutImg=document.querySelector('#about .about-photo');
if(aboutImg && !aboutImg.closest('a')){
aboutImg.style.cursor='pointer';
aboutImg.addEventListener('click',function(){window.location.href='/about'});
}
}
(function(){
if(prefersReducedMotion) return;
var IMAGES = [
'/images/brahmi-pourshot.jpg',
'/images/brahmi-shelf.jpg',
'/images/brahmi-label.jpg',
'/images/brahmi-kolam.jpg',
'/images/brahmi-courtyard.jpg',
'/images/brahmi-tumbler.jpg',
'/images/brahmi-spices.jpg',
'/images/brahmi-doorway.jpg',
'/images/snehaloka-aerial.jpg'
];
var MAX_VISIBLE = 6;
var SPAWN_MIN = 60;
var SPAWN_MAX = 100;
var IMG_SIZE = 170;
var ROTATIONS = [-3, -1, 0, 1, 3];
var BEHIND = 15;
var DESKTOP = 1024;
var heroSection = document.querySelector('.hero-section');
if(heroSection) IMAGES.forEach(function(src){ var i=new Image(); i.src=src; });
var line1 = document.getElementById('hero-line-1');
var line2 = document.getElementById('hero-line-2');
var animFinished = false;
if(!line1 || !line2) return;
function splitIntoChars(el, text){
el.innerHTML = '';
var chars = [];
var words = text.split(/\s+/);
for(var wi = 0; wi < words.length; wi++){
if(wi > 0){
var sp = document.createElement('span');
sp.className = 'hero-char hero-space';
sp.textContent = ' ';
el.appendChild(sp);
chars.push(sp);
}
if(!words[wi]) continue;
var wrap = document.createElement('span');
wrap.className = 'hero-word';
wrap.style.whiteSpace = 'nowrap';
for(var ci = 0; ci < words[wi].length; ci++){
var c = document.createElement('span');
c.className = 'hero-char';
c.textContent = words[wi][ci];
wrap.appendChild(c);
chars.push(c);
}
el.appendChild(wrap);
}
return chars;
}
splitIntoChars(line1, line1.textContent.trim());
var line2Chars = splitIntoChars(line2, line2.textContent.trim());
var enabled = false;
var blocked = false;
var active = [];
var lastIdx = -1;
var lastX = 0, lastY = 0;
var accDist = 0;
var stopTimer = null;
var isDesktop = window.innerWidth >= DESKTOP;
function fadeInText(){
line1.classList.add('visible');
line2.classList.add('visible');
}
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
var trailLayer = document.getElementById('cursorTrailLayer');
if(!trailLayer) return;
var trailRect = trailLayer.getBoundingClientRect();
var idx = getImageIdx();
var size = IMG_SIZE;
var rot = ROTATIONS[Math.floor(Math.random()*ROTATIONS.length)];
var appearMs = rand(250, 350);
var dx = cx - mx, dy = cy - my;
var mDist = Math.sqrt(dx*dx + dy*dy);
var offX = 0, offY = 0;
if(mDist > 0){
offX = -(dx/mDist) * BEHIND;
offY = -(dy/mDist) * BEHIND;
}
offX += (rand(5, 15)) * (Math.random() > 0.5 ? 1 : -1);
offY += (rand(5, 15)) * (Math.random() > 0.5 ? 1 : -1);
var relX = cx - trailRect.left + offX;
var relY = cy - trailRect.top + offY;
var el = document.createElement('div');
el.className = 'hero-reveal-image';
el.style.left = (relX - size/2) + 'px';
el.style.top = (relY - size/2) + 'px';
el.style.width = size + 'px';
el.style.transform = 'translate3d(0,0,0) scale(0.6) rotate(' + rot + 'deg)';
var elImg = document.createElement('img');
elImg.src = IMAGES[idx];
elImg.draggable = false;
elImg.alt = '';
elImg.style.opacity = '0';
elImg.style.transition = 'opacity ' + appearMs + 'ms ease-out, transform ' + appearMs + 'ms cubic-bezier(.34,1.56,.64,1)';
el.appendChild(elImg);
trailLayer.appendChild(el);
requestAnimationFrame(function(){
requestAnimationFrame(function(){
elImg.style.opacity = '1';
elImg.style.transform = 'scale(1)';
});
});
active.push(el);
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
var overlapState = [];
var overlapRAF = null;
function checkOverlaps(){
var trailLayer = document.getElementById('cursorTrailLayer');
if(!trailLayer || !line2Chars.length){ overlapRAF = requestAnimationFrame(checkOverlaps); return; }
var images = trailLayer.querySelectorAll('.hero-reveal-image');
var trails = [];
for(var i = 0; i < images.length; i++){
if(images[i]._removing) continue;
trails.push(images[i].getBoundingClientRect());
}
for(var c = 0; c < line2Chars.length; c++){
var cr = line2Chars[c].getBoundingClientRect();
if(!cr || cr.width === 0) continue;
var overlapping = false;
for(var i = 0; i < trails.length; i++){
if(trails[i].right > cr.left && trails[i].left < cr.right && trails[i].bottom > cr.top && trails[i].top < cr.bottom){
overlapping = true;
break;
}
}
if(overlapping !== overlapState[c]){
overlapState[c] = overlapping;
line2Chars[c].classList.toggle('inverted', overlapping);
}
}
overlapRAF = requestAnimationFrame(checkOverlaps);
}
function startOverlapLoop(){
if(overlapRAF) cancelAnimationFrame(overlapRAF);
overlapRAF = requestAnimationFrame(checkOverlaps);
}
function stopOverlapLoop(){
if(overlapRAF){ cancelAnimationFrame(overlapRAF); overlapRAF = null; }
for(var c = 0; c < line2Chars.length; c++){
line2Chars[c].classList.remove('inverted');
overlapState[c] = false;
}
}
var hoverTimers = [];
function staggerHover(enter){
hoverTimers.forEach(function(t){ clearTimeout(t); });
hoverTimers = [];
var delay = enter ? 12 : 15;
line2Chars.forEach(function(ch, i){
var t = setTimeout(function(){ ch.classList.toggle('hovered', enter); }, i * delay);
hoverTimers.push(t);
});
}
line2.addEventListener('mouseenter', function(){ staggerHover(true); });
line2.addEventListener('mouseleave', function(){ staggerHover(false); });
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
startOverlapLoop();
}
function disableReveal(){
enabled = false;
window.removeEventListener('mousemove', onMove);
fadeOutAll();
clearTimeout(stopTimer);
stopOverlapLoop();
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
var started=false;
var obs = new MutationObserver(function(){
if(!document.getElementById('intro-overlay') && !started){
started=true;
obs.disconnect();
startAnimation();
}
});
obs.observe(document.body, { childList: true });
setTimeout(function(){if(!started){started=true; startAnimation()}}, 5200);
}
})();
(function(){
var counters = document.querySelectorAll('.stat-count');
if(!counters.length) return;
var started = false;
function easeOutCubic(t){return 1-Math.pow(1-t,3)}
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
if(started) return;
started = true;
counters.forEach(animateCount);
}
window.addEventListener('hero:ready', startRolling, { once: true });
if ('IntersectionObserver' in window) {
var io = new IntersectionObserver(function(entries){
entries.forEach(function(entry){
if(entry.isIntersecting){ startRolling(); io.disconnect(); }
});
}, { threshold: 0.4 });
counters.forEach(function(c){ io.observe(c); });
} else {
startRolling();
}
})();
(function(){
var header=document.querySelector('.site-header');
var hero=document.querySelector('.hero-section');
if(!header||!hero)return;
var mq=window.matchMedia('(max-width:640px)');
function updateNav(){
if(!mq.matches){header.classList.remove('nav-dark');return}
var rect=hero.getBoundingClientRect();
header.classList.toggle('nav-dark',rect.bottom>0);
}
updateNav();
mq.addEventListener('change',updateNav);
window.addEventListener('scroll',updateNav,{passive:true});
})();
document.addEventListener('contextmenu',function(e){if(e.target.tagName==='IMG')e.preventDefault()});
document.addEventListener('dragstart',function(e){if(e.target.tagName==='IMG')e.preventDefault()});
document.addEventListener("DOMContentLoaded", function(){
var section = document.getElementById("credibilityReveal");
var paragraphEl = document.getElementById("srtParagraph");
if(!section || !paragraphEl) return;
var fullText = "Identity, packaging, 3D, film, and the product itself — for real estate, F&B, and consumer brands. For Paavani Properties, that meant building the campaign system behind 302 qualified leads in 66 days at ₹82 per lead, and leading creative across 30+ launches spanning identity, print, video, and 3D.";
var words = fullText.split(" ");
paragraphEl.innerHTML = words.map(function(w){ return '<span class="srt-word">' + w + '</span>'; }).join(" ");
var wordEls = paragraphEl.querySelectorAll(".srt-word");
function updateReveal(){
var rect = section.getBoundingClientRect();
var vh = window.innerHeight;
var triggerPoint = vh * 0.7;
var startPoint = triggerPoint;
var endPoint = triggerPoint - rect.height;
var raw = (startPoint - rect.top) / (startPoint - endPoint);
var progress = Math.min(Math.max(raw, 0), 1);
var revealCount = Math.floor(progress * wordEls.length);
for(var i = 0; i < wordEls.length; i++){
wordEls[i].style.opacity = i < revealCount ? "1" : "0.25";
}
}
window.addEventListener("scroll", updateReveal, { passive: true });
window.addEventListener("resize", updateReveal);
updateReveal();
});