(function(){
if(!window.matchMedia('(min-width:1024px)').matches) return;
var overlay=document.createElement('div');
overlay.className='lb-overlay';
overlay.innerHTML='<button class="lb-close" aria-label="Close">&times;</button><button class="lb-prev" aria-label="Previous image">&#8249;</button><button class="lb-next" aria-label="Next image">&#8250;</button><div class="lb-stage"><img class="lb-img" alt=""></div>';
document.body.appendChild(overlay);
var img=overlay.querySelector('.lb-img');
var closeBtn=overlay.querySelector('.lb-close');
var prevBtn=overlay.querySelector('.lb-prev');
var nextBtn=overlay.querySelector('.lb-next');
var stage=overlay.querySelector('.lb-stage');
var sources=[];
var alts=[];
var idx=0;
var scrollY=0;
function collectWithin(scope){
sources=[]; alts=[];
var tiles=scope.querySelectorAll('.feature-visual, .gallery-tile, .work-visual, .idea-tile, .devaiah-row img');
tiles.forEach(function(tile){
if(tile.tagName==='IMG'){
sources.push(tile.src);
alts.push(tile.alt||'');
}else{
var im=tile.querySelector('img');
if(im){sources.push(im.src); alts.push(im.alt||'')}
}
});
}
function open(i){
idx=i;
img.src=sources[idx];
img.alt=alts[idx];
overlay.classList.add('open');
document.body.classList.add('lb-open');
scrollY=window.scrollY;
prevBtn.style.display=sources.length>1?'':'none';
nextBtn.style.display=sources.length>1?'':'none';
}
function close(){
overlay.classList.remove('open');
document.body.classList.remove('lb-open');
img.src='';
window.scrollTo(0,scrollY);
}
function go(d){
idx=(idx+d+sources.length)%sources.length;
img.style.opacity='0';
setTimeout(function(){
img.src=sources[idx];
img.alt=alts[idx];
img.style.opacity='1';
},150);
}
closeBtn.addEventListener('click',close);
overlay.addEventListener('click',function(e){if(e.target===overlay||e.target===stage)close()});
prevBtn.addEventListener('click',function(e){e.stopPropagation();go(-1)});
nextBtn.addEventListener('click',function(e){e.stopPropagation();go(1)});
document.addEventListener('keydown',function(e){
if(!overlay.classList.contains('open'))return;
if(e.key==='Escape')close();
if(e.key==='ArrowLeft')go(-1);
if(e.key==='ArrowRight')go(1);
});
img.addEventListener('load',function(){
if(sources.length<=1) return;
var n=new Image(); n.src=sources[(idx+1)%sources.length];
var p=new Image(); p.src=sources[(idx-1+sources.length)%sources.length];
});
document.addEventListener('click',function(e){
if(overlay.classList.contains('open')) return;
var tile=e.target.closest('.feature-visual, .gallery-tile, .work-visual, .idea-tile');
if(!tile) {
if(e.target.tagName==='IMG' && e.target.closest('.devaiah-row')){
tile=e.target;
} else return;
}
if(e.target.closest('a')) return;
var scope=tile.closest('section') || document;
collectWithin(scope);
var im=tile.tagName==='IMG'?tile:tile.querySelector('img');
var src=im?im.src:'';
var i=sources.indexOf(src);
if(i>=0) open(i);
});
})();