document.addEventListener('DOMContentLoaded',function(){
var grid=document.getElementById('pgGrid');
if(!grid)return;
var items=grid.querySelectorAll('.pg-item');
var lightbox=document.getElementById('pgLightbox');
var lightboxContent=document.getElementById('pgLightboxContent');
var closeBtn=document.getElementById('pgLightboxClose');
var videos=grid.querySelectorAll('video');
var visObs=new IntersectionObserver(function(entries){
entries.forEach(function(e){
var v=e.target;
if(e.isIntersecting)v.play().catch(function(){});
else v.pause();
});
},{threshold:0.25});
videos.forEach(function(v){visObs.observe(v)});
items.forEach(function(item){
item.addEventListener('click',function(){
var type=item.getAttribute('data-type');
var src=item.getAttribute('data-src');
lightboxContent.innerHTML='';
if(type==='video'){
var vid=document.createElement('video');
vid.src=src; vid.controls=true; vid.autoplay=true; vid.loop=true; vid.muted=false;
lightboxContent.appendChild(vid);
}else{
var img=document.createElement('img');
img.src=src; img.alt=item.querySelector('img')?item.querySelector('img').alt:'';
lightboxContent.appendChild(img);
}
lightbox.classList.add('open');
document.body.classList.add('pg-lightbox-open');
});
});
function closeLightbox(){
var vid=lightboxContent.querySelector('video');
if(vid){vid.pause();vid.src=''}
lightbox.classList.remove('open');
document.body.classList.remove('pg-lightbox-open');
lightboxContent.innerHTML = '';
}
closeBtn.addEventListener('click',closeLightbox);
lightbox.addEventListener('click',function(e){if(e.target===lightbox)closeLightbox()});
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&lightbox.classList.contains('open'))closeLightbox()});
});