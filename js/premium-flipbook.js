(function(){
  var TOTAL_PAGES = 44;
  var FLIP_DURATION = 750;
  var PAGE_URL = '/images/brahmi/page-';

  var state = {
    leftPage: 2,
    isFlipping: false,
    bookOpen: false,
    zoomed: false,
    drag: { active: false, startX: 0, startTime: 0 }
  };

  var root = document.querySelector('.premium-flipbook-wrapper');
  if (!root) return;

  var book = root.querySelector('.premium-book');
  var bookBody = root.querySelector('.premium-book-body');
  var pageLeft = root.querySelector('.premium-page-left');
  var pageRight = root.querySelector('.premium-page-right');
  var coverFront = root.querySelector('.premium-cover-front');
  var coverBack = root.querySelector('.premium-cover-back');
  var prevBtn = root.querySelector('.premium-ui-prev');
  var nextBtn = root.querySelector('.premium-ui-next');
  var pageNumEl = root.querySelector('.premium-ui-pagenum');
  var progressBar = root.querySelector('.premium-ui-progress-bar');
  var fullscreenBtn = root.querySelector('.premium-ui-fullscreen');
  var zoomOverlay = root.querySelector('.premium-zoom-overlay');
  var zoomImg = zoomOverlay ? zoomOverlay.querySelector('img') : null;
  var stackLeft = root.querySelector('.premium-stack-left');
  var stackRight = root.querySelector('.premium-stack-right');

  function pageUrl(n) {
    if (n < 1 || n > TOTAL_PAGES) return '';
    var num = n < 10 ? '0' + n : '' + n;
    return PAGE_URL + num + '.jpg';
  }

  function setPage(el, n) {
    var url = pageUrl(n);
    if (url && n >= 1 && n <= TOTAL_PAGES) {
      el.style.backgroundImage = 'url(' + url + ')';
      el.style.display = '';
    } else {
      el.style.backgroundImage = 'none';
      el.style.display = 'none';
    }
  }

  function updateStacks() {
    var turned = Math.max(0, state.leftPage - 2);
    var remaining = Math.max(0, TOTAL_PAGES - state.leftPage - 1);
    if (!stackLeft || !stackRight) return;

    var maxVisible = 8;
    var leftCount = Math.min(turned, maxVisible);
    var rightCount = Math.min(remaining, maxVisible);

    stackLeft.innerHTML = '';
    stackRight.innerHTML = '';

    if (leftCount > 0) {
      var lw = leftCount * 2.5 + 2;
      stackLeft.style.width = Math.min(lw, 20) + 'px';
      for (var i = 0; i < Math.min(leftCount, 4); i++) {
        var d = document.createElement('div');
        d.className = 'premium-stack-left-inner';
        d.style.cssText = 'position:absolute;inset:0;opacity:' + (0.3 + i * 0.2) + ';transform:translateZ(' + (-i) + 'px)';
        stackLeft.appendChild(d);
      }
    } else {
      stackLeft.style.width = '0';
    }

    if (rightCount > 0) {
      var rw = rightCount * 2.5 + 2;
      stackRight.style.width = Math.min(rw, 20) + 'px';
      for (var i = 0; i < Math.min(rightCount, 4); i++) {
        var d = document.createElement('div');
        d.className = 'premium-stack-right-inner';
        d.style.cssText = 'position:absolute;inset:0;opacity:' + (0.3 + i * 0.2) + ';transform:translateZ(' + (-i) + 'px)';
        stackRight.appendChild(d);
      }
    } else {
      stackRight.style.width = '0';
    }
  }

  function updateUI() {
    var displayNum = Math.min(state.leftPage, TOTAL_PAGES);
    if (pageNumEl) pageNumEl.textContent = displayNum + ' / ' + TOTAL_PAGES;
    if (prevBtn) prevBtn.disabled = state.leftPage <= 2;
    if (nextBtn) nextBtn.disabled = state.leftPage + 2 >= TOTAL_PAGES;
    if (progressBar) progressBar.style.width = ((state.leftPage) / TOTAL_PAGES * 100) + '%';
  }

  function renderSpread() {
    setPage(pageLeft, state.leftPage);
    setPage(pageRight, state.leftPage + 1);
    updateStacks();
    updateUI();
  }

  function createFlipEl(dir, frontNum, backNum) {
    var el = document.createElement('div');
    el.className = 'premium-flip ' + dir;
    el.innerHTML =
      '<div class="premium-flip-face premium-flip-front" style="background-image:url(' + pageUrl(frontNum) + ')"></div>' +
      '<div class="premium-flip-face premium-flip-back" style="background-image:url(' + pageUrl(backNum) + ')"></div>' +
      '<div class="premium-flip-shadow"></div>' +
      '<div class="premium-flip-highlight"></div>';
    return el;
  }

  function createRevealEl(side, pageNum) {
    var el = document.createElement('div');
    el.className = 'premium-page-reveal';
    el.style.cssText = 'position:absolute;top:0;width:50%;height:100%;z-index:4;background-size:cover;background-position:center;background-color:#F7F5EF';
    el.style.backgroundImage = 'url(' + pageUrl(pageNum) + ')';
    if (side === 'left') {
      el.style.left = '0';
    } else {
      el.style.left = '50%';
    }
    if (pageNum < 1 || pageNum > TOTAL_PAGES) {
      el.style.display = 'none';
    }
    return el;
  }

  function flipForward(animate) {
    if (state.isFlipping) return;
    if (state.leftPage + 3 > TOTAL_PAGES) return;
    if (!state.bookOpen) { openBook(); return; }
    state.isFlipping = true;
    book.classList.remove('idle');

    var currentRight = state.leftPage + 1;
    var nextLeft = currentRight + 1;
    var nextRight = nextLeft + 1;

    var flip = createFlipEl('forward', currentRight, nextLeft);
    var reveal = createRevealEl('right', nextRight);

    pageRight.style.display = 'none';
    bookBody.appendChild(reveal);
    bookBody.appendChild(flip);

    if (animate) {
      flip.classList.add('animating-forward');
      flip.addEventListener('animationend', function done(){
        flip.removeEventListener('animationend', done);
        finishForward(flip, reveal);
      });
    } else {
      flip.style.transform = 'rotateY(-180deg)';
      flip.style.transition = 'none';
      setTimeout(function(){ finishForward(flip, reveal); }, 30);
    }
  }

  function finishForward(flip, reveal) {
    flip.remove();
    reveal.remove();
    pageRight.style.display = '';
    state.leftPage += 2;
    renderSpread();
    state.isFlipping = false;
    if (!state.drag.active) book.classList.add('idle');
  }

  function flipBackward(animate) {
    if (state.isFlipping) return;
    if (state.leftPage - 2 < 1) return;
    if (!state.bookOpen) { openBook(); return; }
    state.isFlipping = true;
    book.classList.remove('idle');

    var currentLeft = state.leftPage;
    var prevRight = currentLeft - 1;
    var prevLeft = prevRight - 1;

    var flip = createFlipEl('backward', currentLeft, prevRight);
    var reveal = createRevealEl('left', prevLeft);

    pageLeft.style.display = 'none';
    bookBody.appendChild(reveal);
    bookBody.appendChild(flip);

    if (animate) {
      flip.classList.add('animating-backward');
      flip.addEventListener('animationend', function done(){
        flip.removeEventListener('animationend', done);
        finishBackward(flip, reveal);
      });
    } else {
      flip.style.transform = 'rotateY(180deg)';
      flip.style.transition = 'none';
      setTimeout(function(){ finishBackward(flip, reveal); }, 30);
    }
  }

  function finishBackward(flip, reveal) {
    flip.remove();
    reveal.remove();
    pageLeft.style.display = '';
    state.leftPage -= 2;
    renderSpread();
    state.isFlipping = false;
    if (!state.drag.active) book.classList.add('idle');
  }

  function openBook() {
    if (state.bookOpen) return;
    state.bookOpen = true;
    coverFront.classList.add('open');
    coverBack.classList.add('open');
    setTimeout(function(){
      coverFront.style.display = 'none';
      coverBack.style.display = 'none';
      state.leftPage = 2;
      renderSpread();
      book.classList.add('idle');
    }, 1100);
  }

  function closeBook() {
    coverFront.style.display = '';
    coverBack.style.display = '';
    coverFront.classList.remove('open');
    coverBack.classList.remove('open');
    state.bookOpen = false;
    book.classList.remove('idle');
    state.leftPage = 2;
    renderSpread();
  }

  function goToPage(n) {
    if (state.isFlipping) return;
    var target = Math.max(1, Math.min(TOTAL_PAGES - 1, n));
    target = target % 2 === 0 ? target : target - 1;
    var diff = target - state.leftPage;
    if (diff === 0) return;
    if (!state.bookOpen) { openBook(); return; }
    var dir = diff > 0 ? 1 : -1;
    flipSequence(dir, Math.abs(diff) / 2);
  }

  function flipSequence(dir, count) {
    if (count <= 0 || state.isFlipping) return;
    if (dir > 0) flipForward(true);
    else flipBackward(true);
  }

  function handleDragStart(x) {
    if (state.isFlipping || state.zoomed) return;
    state.drag.active = true;
    state.drag.startX = x;
    state.drag.startTime = Date.now();
    book.classList.remove('idle');
  }

  function handleDragEnd() {
    if (!state.drag.active) return;
    state.drag.active = false;
    book.classList.add('idle');
  }

  function handleClick(e) {
    if (state.isFlipping || state.zoomed) return;
    if (!state.bookOpen) { openBook(); return; }
    var rect = bookBody.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var relX = x / rect.width;
    if (relX > 0.55) {
      if (state.leftPage + 3 > TOTAL_PAGES) {
        closeBook();
      } else {
        flipForward(true);
      }
    } else if (relX < 0.45) {
      flipBackward(true);
    }
  }

  function handleDoubleClick(e) {
    if (!state.bookOpen) return;
    var rect = bookBody.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var relX = x / rect.width;
    var page = relX < 0.5 ? state.leftPage : state.leftPage + 1;
    if (page < 1 || page > TOTAL_PAGES) return;
    showZoom(page);
  }

  function showZoom(page) {
    if (state.zoomed) return;
    state.zoomed = true;
    if (zoomImg) {
      zoomImg.src = pageUrl(page);
      zoomImg.alt = 'Brahmi Brand Book - Page ' + page;
    }
    zoomOverlay.classList.add('active');
  }

  function hideZoom() {
    state.zoomed = false;
    zoomOverlay.classList.remove('active');
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement && !document.webkitFullscreenElement) {
      var el = document.documentElement;
      if (el.requestFullscreen) el.requestFullscreen();
      else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
      else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
    }
  }

  pageLeft.style.display = 'none';
  pageRight.style.display = 'none';

  coverFront.addEventListener('click', openBook);

  bookBody.addEventListener('mousedown', function(e){
    if (e.target.closest('.premium-cover')) return;
    state.drag.startX = e.clientX;
    state.drag.active = true;
  });

  document.addEventListener('mousemove', function(e){
    if (!state.drag.active || state.isFlipping) return;
    state.drag.currentX = e.clientX;
  });

  document.addEventListener('mouseup', function(e){
    if (!state.drag.active) return;
    state.drag.active = false;
    var dx = e.clientX - state.drag.startX;
    if (Math.abs(dx) > 40) {
      state.drag.didSwipe = true;
      if (dx < 0) flipForward(true);
      else flipBackward(true);
    } else {
      state.drag.didSwipe = false;
    }
  });

  bookBody.addEventListener('click', function(e){
    if (e.target.closest('.premium-cover')) return;
    if (state.drag.didSwipe) { state.drag.didSwipe = false; return; }
    handleClick(e);
  });

  bookBody.addEventListener('dblclick', handleDoubleClick);

  bookBody.addEventListener('touchstart', function(e){
    if (e.target.closest('.premium-cover')) return;
    var t = e.touches[0];
    state.drag.startX = t.clientX;
    state.drag.active = true;
  }, {passive: true});

  bookBody.addEventListener('touchmove', function(e){
    if (!state.drag.active || state.isFlipping) return;
    state.drag.currentX = e.touches[0].clientX;
  }, {passive: true});

  bookBody.addEventListener('touchend', function(e){
    if (!state.drag.active) return;
    state.drag.active = false;
    var t = e.changedTouches[0];
    var dx = t.clientX - state.drag.startX;
    if (Math.abs(dx) > 30) {
      state.drag.didSwipe = true;
      if (dx < 0) flipForward(true);
      else flipBackward(true);
    } else {
      state.drag.didSwipe = false;
    }
    if (!state.drag.didSwipe) {
      handleClick({ clientX: t.clientX });
    } else {
      state.drag.didSwipe = false;
    }
  }, {passive: true});

  bookBody.addEventListener('touchcancel', function(){
    state.drag.active = false;
  }, {passive: true});

  if (prevBtn) prevBtn.addEventListener('click', function(){ flipBackward(true); });
  if (nextBtn) nextBtn.addEventListener('click', function(){ flipForward(true); });

  document.addEventListener('keydown', function(e){
    if (state.zoomed) {
      if (e.key === 'Escape') hideZoom();
      return;
    }
    switch (e.key) {
      case 'ArrowRight': case 'ArrowDown': e.preventDefault(); flipForward(true); break;
      case 'ArrowLeft': case 'ArrowUp': e.preventDefault(); flipBackward(true); break;
      case 'Home': e.preventDefault(); goToPage(1); break;
      case 'End': e.preventDefault(); goToPage(TOTAL_PAGES); break;
      case 'f': case 'F': e.preventDefault(); toggleFullscreen(); break;
    }
  });

  if (fullscreenBtn) fullscreenBtn.addEventListener('click', toggleFullscreen);

  if (zoomOverlay) zoomOverlay.addEventListener('click', hideZoom);

  document.addEventListener('fullscreenchange', updateFullscreenBtn);
  document.addEventListener('webkitfullscreenchange', updateFullscreenBtn);

  function updateFullscreenBtn() {
    if (!fullscreenBtn) return;
    fullscreenBtn.textContent =
      document.fullscreenElement || document.webkitFullscreenElement ? 'Exit' : 'Fullscreen';
  }

  renderSpread();

  setTimeout(function(){
    pageLeft.style.display = '';
    pageRight.style.display = '';
  }, 100);
})();
