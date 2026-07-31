(function () {
  'use strict';

  if (window.innerWidth >= 768) return;

  var SLIVER_RATIO = 0.14;
  var MIN_SLIVER_PX = 22;
  var FLIP_MS = 680;
  var MAX_BOOK_WIDTH = 360;
  var BOOK_WIDTH_RATIO = 0.88;
  var SWIPE_THRESHOLD_PX = 40;

  var mount = document.getElementById('flipbook-compare');
  if (!mount) return;

  var pages = (function () {
    var out = [];
    for (var i = 1; i <= 44; i++) {
      out.push('/images/brahmi/page-' + (i < 10 ? '0' + i : '' + i) + '.jpg');
    }
    return out;
  })();

  var styleEl = document.createElement('style');
  styleEl.textContent =
    '.mfb-wrapper{position:relative;width:100%;display:flex;flex-direction:column;align-items:center;padding:0 16px}' +
    '.mfb-book{position:relative;display:flex;perspective:1600px;box-shadow:0 12px 32px rgba(0,0,0,0.35);border-radius:4px;overflow:visible}' +
    '.mfb-stack{background:linear-gradient(to right,rgba(0,0,0,0.55),rgba(0,0,0,0.15));border-radius:4px 0 0 4px;transition:width ' + FLIP_MS + 'ms cubic-bezier(0.4,0.0,0.2,1);flex-shrink:0}' +
    '.mfb-right{position:relative;overflow:hidden;border-radius:0 4px 4px 0;transition:width ' + FLIP_MS + 'ms cubic-bezier(0.4,0.0,0.2,1);flex-shrink:0}' +
    '.mfb-right img{width:100%;height:100%;object-fit:cover;display:block}' +
    '.mfb-flip-overlay{position:absolute;top:0;transform-style:preserve-3d;transform-origin:left center;animation:mfb-flip ' + FLIP_MS + 'ms cubic-bezier(0.45,0.05,0.35,1) forwards}' +
    '@keyframes mfb-flip{from{transform:rotateY(var(--start-rot))}to{transform:rotateY(var(--end-rot))}}' +
    '.mfb-flip-face{position:absolute;inset:0;backface-visibility:hidden;border-radius:0 4px 4px 0;overflow:hidden}' +
    '.mfb-flip-front img{width:100%;height:100%;object-fit:cover;display:block}' +
    '.mfb-flip-back{background:linear-gradient(to left,rgba(20,20,20,0.9),rgba(20,20,20,0.5));transform:rotateY(180deg)}' +
    '.mfb-controls{position:absolute;left:50%;top:0;transform:translateX(-50%);pointer-events:none}' +
    '.mfb-arrow{pointer-events:auto;position:absolute;top:50%;transform:translateY(-50%);width:40px;height:40px;border-radius:50%;border:none;background:rgba(255,255,255,0.92);color:#111;font-size:18px;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,0.25)}' +
    '.mfb-arrow:disabled{opacity:0.35}' +
    '.mfb-arrow-prev{left:-16px}' +
    '.mfb-arrow-next{right:-16px}';
  document.head.appendChild(styleEl);

  var wrapper = document.createElement('div');
  wrapper.className = 'mfb-wrapper';

  var book = document.createElement('div');
  book.className = 'mfb-book';

  var stack = document.createElement('div');
  stack.className = 'mfb-stack';

  var right = document.createElement('div');
  right.className = 'mfb-right';
  var rightImg = document.createElement('img');
  rightImg.draggable = false;
  right.appendChild(rightImg);

  book.appendChild(stack);
  book.appendChild(right);

  var controls = document.createElement('div');
  controls.className = 'mfb-controls';
  var prevBtn = document.createElement('button');
  prevBtn.type = 'button';
  prevBtn.className = 'mfb-arrow mfb-arrow-prev';
  prevBtn.setAttribute('aria-label', 'Previous page');
  prevBtn.textContent = '\u2190';
  var nextBtn = document.createElement('button');
  nextBtn.type = 'button';
  nextBtn.className = 'mfb-arrow mfb-arrow-next';
  nextBtn.setAttribute('aria-label', 'Next page');
  nextBtn.textContent = '\u2192';
  controls.appendChild(prevBtn);
  controls.appendChild(nextBtn);

  wrapper.appendChild(book);
  wrapper.appendChild(controls);
  mount.appendChild(wrapper);

  var containerWidth = 0;
  var naturalAspect = null;
  var currentIndex = 0;
  var isAnimating = false;
  var flipDirection = null;
  var touchStartX = null;
  var animTimer = null;
  var overlay = null;

  function isCover(i) { return i === 0; }
  function isBackCover(i) { return i === pages.length - 1; }

  function aspect() { return naturalAspect || 16 / 9; }

  function sliverOf(i, bookWidth) {
    return isCover(i) || isBackCover(i)
      ? 0
      : Math.max(bookWidth * SLIVER_RATIO, MIN_SLIVER_PX);
  }

  function targetIndex() {
    if (flipDirection === 'next') return currentIndex + 1;
    if (flipDirection === 'prev') return currentIndex - 1;
    return currentIndex;
  }

  function removeOverlay() {
    if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
    overlay = null;
  }

  function renderOverlay() {
    removeOverlay();
    var src = flipDirection ? pages[currentIndex] : null;
    if (!isAnimating || !src) return;
    var bookWidth = Math.min(containerWidth * BOOK_WIDTH_RATIO, MAX_BOOK_WIDTH);
    var bookHeight = bookWidth / aspect();
    var sliver = sliverOf(currentIndex, bookWidth);
    var rightW = bookWidth - sliver;
    var startRot = 0;
    var endRot = -162;
    var ov = document.createElement('div');
    ov.className = 'mfb-flip-overlay';
    ov.style.width = rightW + 'px';
    ov.style.height = bookHeight + 'px';
    ov.style.left = sliver + 'px';
    ov.style.setProperty('--start-rot', startRot + 'deg');
    ov.style.setProperty('--end-rot', endRot + 'deg');
    var front = document.createElement('div');
    front.className = 'mfb-flip-face mfb-flip-front';
    var img = document.createElement('img');
    img.src = src;
    img.draggable = false;
    front.appendChild(img);
    var back = document.createElement('div');
    back.className = 'mfb-flip-face mfb-flip-back';
    ov.appendChild(front);
    ov.appendChild(back);
    overlay = ov;
    book.appendChild(ov);
  }

  function update() {
    if (containerWidth <= 0) return;
    var bookWidth = Math.min(containerWidth * BOOK_WIDTH_RATIO, MAX_BOOK_WIDTH);
    var bookHeight = bookWidth / aspect();
    var tIndex = targetIndex();
    var sliver = sliverOf(currentIndex, bookWidth);
    var rightW = bookWidth - sliver;
    var tSliver = sliverOf(tIndex, bookWidth);
    var tRightW = bookWidth - tSliver;

    book.style.width = bookWidth + 'px';
    book.style.height = bookHeight + 'px';
    controls.style.width = bookWidth + 'px';
    controls.style.height = bookHeight + 'px';

    stack.style.width = (isAnimating ? tSliver : sliver) + 'px';
    stack.style.height = bookHeight + 'px';
    right.style.width = (isAnimating ? tRightW : rightW) + 'px';
    right.style.height = bookHeight + 'px';
    rightImg.src = isAnimating ? pages[tIndex] : pages[currentIndex];
    rightImg.alt = 'Page ' + (tIndex + 1);

    prevBtn.disabled = isAnimating || currentIndex === 0;
    nextBtn.disabled = isAnimating || currentIndex === pages.length - 1;
  }

  function goTo(direction) {
    if (isAnimating) return;
    var next = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    if (next < 0 || next >= pages.length) return;

    flipDirection = direction;
    isAnimating = true;
    renderOverlay();
    update();

    if (animTimer) clearTimeout(animTimer);
    animTimer = setTimeout(function () {
      currentIndex = next;
      isAnimating = false;
      flipDirection = null;
      removeOverlay();
      update();
    }, FLIP_MS);
  }

  book.addEventListener('touchstart', function (e) {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  book.addEventListener('touchend', function (e) {
    if (touchStartX === null) return;
    var deltaX = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(deltaX) > SWIPE_THRESHOLD_PX) {
      goTo(deltaX < 0 ? 'next' : 'prev');
    }
    touchStartX = null;
  });

  prevBtn.addEventListener('click', function () { goTo('prev'); });
  nextBtn.addEventListener('click', function () { goTo('next'); });

  var probe = new Image();
  probe.onload = function () {
    if (probe.naturalWidth && probe.naturalHeight) {
      naturalAspect = probe.naturalWidth / probe.naturalHeight;
      update();
    }
  };
  probe.src = pages[0];

  if (typeof ResizeObserver !== 'undefined') {
    var ro = new ResizeObserver(function (entries) {
      var w = entries[0].contentRect.width;
      if (w > 0) {
        containerWidth = w;
        update();
      }
    });
    ro.observe(wrapper);
  } else {
    var mw = wrapper.getBoundingClientRect().width;
    if (mw > 0) {
      containerWidth = mw;
      update();
    }
  }
})();
