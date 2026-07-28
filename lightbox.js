// lightbox.js — desktop-only case study image viewer (reuses playground patterns)
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

  function collect(){
    sources=[]; alts=[];
    var tiles=document.querySelectorAll('.feature-visual, .gallery-tile, .work-visual, .idea-tile, .devaiah-row img');
    tiles.forEach(function(tile){
      if(tile.tagName==='IMG'){
        sources.push(tile.src);
        alts.push(tile.alt||'');
      }else{
        var im=tile.querySelector('img');
        if(im){sources.push(im.src); alts.push(im.alt||'');}
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
  overlay.addEventListener('click',function(e){if(e.target===overlay||e.target===stage)close();});
  prevBtn.addEventListener('click',function(e){e.stopPropagation();go(-1);});
  nextBtn.addEventListener('click',function(e){e.stopPropagation();go(1);});

  document.addEventListener('keydown',function(e){
    if(!overlay.classList.contains('open'))return;
    if(e.key==='Escape')close();
    if(e.key==='ArrowLeft')go(-1);
    if(e.key==='ArrowRight')go(1);
  });

  // Preload adjacent
  img.addEventListener('load',function(){
    if(sources.length<=1) return;
    var next=new Image(); next.src=sources[(idx+1)%sources.length];
    var prev=new Image(); prev.src=sources[(idx-1+sources.length)%sources.length];
  });

  // Observe new tiles added after DOMContentLoaded
  collect();

  // Re-collect and bind click on every tile
  document.addEventListener('click',function(e){
    var tile=e.target.closest('.feature-visual, .gallery-tile, .work-visual, .idea-tile');
    if(!tile) return;
    // Ignore clicks on links inside tiles
    if(e.target.closest('a')) return;
    collect();
    var im=tile.querySelector('img');
    var src=im?im.src:'';
    var i=sources.indexOf(src);
    if(i>=0) open(i);
  });

  // Devaiah images are direct children — handle separately
  document.addEventListener('click',function(e){
    if(e.target.tagName!=='IMG') return;
    var row=e.target.closest('.devaiah-row');
    if(!row) return;
    collect();
    var i=sources.indexOf(e.target.src);
    if(i>=0) open(i);
  });
})();
