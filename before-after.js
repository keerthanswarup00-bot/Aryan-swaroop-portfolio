(function(){
  var wrapper = document.querySelector('.before-after-wrapper');
  if (!wrapper) return;
  var handle = wrapper.querySelector('.handle');
  var beforeWrap = wrapper.querySelector('.before-image-wrapper');
  var isTouch = window.matchMedia('(pointer: coarse)').matches;
  var pos1 = 0, pos3 = 0;

  function getX(e) {
    return isTouch ? e.touches[0].clientX : e.clientX;
  }

  function dragInit(e) {
    e.preventDefault();
    pos3 = getX(e);
    if (isTouch) {
      document.ontouchmove = elementDrag;
      document.ontouchend = closeDrag;
    } else {
      document.onmousemove = elementDrag;
      document.onmouseup = closeDrag;
    }
  }

  function elementDrag(e) {
    e.preventDefault();
    var x = getX(e);
    pos1 = pos3 - x;
    pos3 = x;
    var rect = wrapper.getBoundingClientRect();
    var left = handle.offsetLeft - pos1;
    var pct = ((left - rect.left) / rect.width) * 100;
    if (pct < 0) pct = 0;
    if (pct > 100) pct = 100;
    handle.style.left = pct + '%';
    beforeWrap.style.width = pct + '%';
    handle.setAttribute('aria-valuenow', Math.round(pct));
  }

  function closeDrag() {
    document.ontouchmove = null;
    document.ontouchend = null;
    document.onmousemove = null;
    document.onmouseup = null;
  }

  if (isTouch) {
    handle.ontouchstart = dragInit;
  } else {
    handle.onmousedown = dragInit;
  }
})();
