(function(){
  var TOTAL_PAGES = 44;
  var FLIP_DURATION = 800;
  var PAGE_URL = '/images/brahmi/page-';

  var state = {
    spreadIndex: 0,
    isFlipping: false,
    bookOpen: false,
    zoomed: false
  };

  var root = document.querySelector('.premium-flipbook-wrapper');
  if (!root) return;

  var stage = root.querySelector('.premium-flipbook-stage');
  var book = root.querySelector('.premium-book');
  var bookBody = root.querySelector('.premium-book-body');
  var coverFront = root.querySelector('.premium-cover-front');
  var coverBack = root.querySelector('.premium-cover-back');
  var spreadEl = root.querySelector('.premium-spread');
  var leftPage = spreadEl.querySelector('.premium-page-left');
  var rightPage = spreadEl.querySelector('.premium-page-right');
  var stackLeft = root.querySelector('.premium-stack-left');
  var stackRight = root.querySelector('.premium-stack-right');
  var prevBtn = root.querySelector('.premium-ui-prev');
  var nextBtn = root.querySelector('.premium-ui-next');
  var pageNumEl = root.querySelector('.premium-ui-pagenum');
  var progressBar = root.querySelector('.premium-ui-progress-bar');
  var fullscreenBtn = root.querySelector('.premium-ui-fullscreen');
  var zoomOverlay = root.querySelector('.premium-zoom-overlay');
  var zoomImg = zoomOverlay ? zoomOverlay.querySelector('img') : null;

  var dragState = { active: false, startX: 0, currentX: 0 };

  function pageUrl(n) {
    var num = n < 10 ? '0' + n : '' + n;
    return PAGE_URL + num + '.jpg';
  }

  function setBackground(el, n) {
    if (n >= 1 && n <= TOTAL_PAGES) {
      el.style.backgroundImage = 'url(' + pageUrl(n) + ')';
      el.style.display = '';
    } else {
      el.style.backgroundImage = 'none';
      el.style.display = 'none';
    }
  }

  function updateStacks() {
    var turned = state.spreadIndex;
    var remaining = TOTAL_PAGES - state.spreadIndex - 2;
    stackLeft.innerHTML = '';
    stackRight.innerHTML = '';

    var maxVisible = 6;
    var showLeft = Math.min(turned, maxVisible);
    var showRight = Math.min(remaining, maxVisible);

    for (var i = 0; i < showLeft; i++) {
      var pg = document.createElement('div');
      pg.className = 'premium-stack-page';
      pg.style.transform = 'translateZ(' + (-i - 1) + 'px)';
      pg.style.background = i === showLeft - 1 && turned > maxVisible ? 'rgba(70,60,45,0.15)' : '#F7F5EF';
      stackLeft.appendChild(pg);
    }
    stackLeft.style.width = Math.min(turned, maxVisible) * 3 + 'px';

    for (var i = 0; i < showRight; i++) {
      var pg = document.createElement('div');
      pg.className = 'premium-stack-page';
      pg.style.transform = 'translateZ(' + (-i - 1) + 'px)';
      pg.style.background = i === showRight - 1 && remaining > maxVisible ? 'rgba(70,60,45,0.15)' : '#F7F5EF';
      stackRight.appendChild(pg);
    }
    stackRight.style.width = Math.min(remaining, maxVisible) * 3 + 'px';
  }

  function updateUI() {
    var pageNum = state.spreadIndex + 1;
    if (pageNumEl) pageNumEl.textContent = pageNum + ' / ' + TOTAL_PAGES;
    if (prevBtn) prevBtn.disabled = state.spreadIndex <= 0;
    if (nextBtn) nextBtn.disabled = state.spreadIndex + 2 >= TOTAL_PAGES;
    if (progressBar) progressBar.style.width = (pageNum / TOTAL_PAGES * 100) + '%';
  }

  function renderSpread() {
    var leftNum = state.spreadIndex + 1;
    var rightNum = state.spreadIndex + 2;
    setBackground(leftPage, leftNum);
    setBackground(rightPage, rightNum);
    updateStacks();
    updateUI();
  }

  function flipForward(animate) {
    if (state.isFlipping || state.spreadIndex + 2 >= TOTAL_PAGES) return;
    if (animate === undefined) animate = true;
    if (!state.bookOpen) { openBook(); return; }
    state.isFlipping = true;

    var flipEl = document.createElement('div');
    flipEl.className = 'premium-flip premium-flip-forward';
    flipEl.innerHTML =
      '<div class="premium-flip-face premium-flip-front" style="background-image:url(' + pageUrl(state.spreadIndex + 2) + ')"></div>' +
      '<div class="premium-flip-face premium-flip-back" style="background-image:url(' + pageUrl(state.spreadIndex + 3) + ')"></div>' +
      '<div class="premium-flip-shadow premium-flip-shadow-forward"></div>' +
      '<div class="premium-flip-highlight"></div>';
    bookBody.appendChild(flipEl);

    if (animate) {
      flipEl.classList.add('animating-forward');
      flipEl.addEventListener('animationend', function done(){
        flipEl.removeEventListener('animationend', done);
        finishFlipForward();
      });
    } else {
      flipEl.style.transform = 'rotateY(-180deg)';
      setTimeout(finishFlipForward, 50);
    }
  }

  function finishFlipForward() {
    var flipEl = bookBody.querySelector('.premium-flip-forward');
    if (flipEl) flipEl.remove();
    state.spreadIndex += 2;
    renderSpread();
    state.isFlipping = false;
  }

  function flipBackward(animate) {
    if (state.isFlipping || state.spreadIndex <= 0) return;
    if (animate === undefined) animate = true;
    if (!state.bookOpen) { openBook(); return; }
    state.isFlipping = true;

    var flipEl = document.createElement('div');
    flipEl.className = 'premium-flip premium-flip-backward';
    flipEl.innerHTML =
      '<div class="premium-flip-face premium-flip-front" style="background-image:url(' + pageUrl(state.spreadIndex + 1) + ')"></div>' +
      '<div class="premium-flip-face premium-flip-back" style="background-image:url(' + pageUrl(state.spreadIndex) + ')"></div>' +
      '<div class="premium-flip-shadow premium-flip-shadow-backward"></div>' +
      '<div class="premium-flip-highlight"></div>';
    bookBody.appendChild(flipEl);

    if (animate) {
      flipEl.classList.add('animating-backward');
      flipEl.addEventListener('animationend', function done(){
        flipEl.removeEventListener('animationend', done);
        finishFlipBackward();
      });
    } else {
      flipEl.style.transform = 'rotateY(180deg)';
      setTimeout(finishFlipBackward, 50);
    }
  }

  function finishFlipBackward() {
    var flipEl = bookBody.querySelector('.premium-flip-backward');
    if (flipEl) flipEl.remove();
    state.spreadIndex -= 2;
    renderSpread();
    state.isFlipping = false;
  }

  function openBook() {
    if (state.bookOpen) return;
    state.bookOpen = true;
    coverFront.classList.add('open');
    coverBack.classList.add('open');
    setTimeout(function(){
      coverFront.style.display = 'none';
      coverBack.style.display = 'none';
      book.classList.add('idle');
    }, 1200);
  }

  function closeBook() {
    coverFront.style.display = '';
    coverBack.style.display = '';
    coverFront.classList.remove('open');
    coverBack.classList.remove('open');
    state.bookOpen = false;
    book.classList.remove('idle');
    state.spreadIndex = 0;
    renderSpread();
  }

  function goToPage(n) {
    if (state.isFlipping) return;
    var target = Math.max(0, Math.min(TOTAL_PAGES - 2, Math.floor((n - 1) / 2) * 2));
    var diff = target - state.spreadIndex;
    if (diff === 0) return;
    if (!state.bookOpen) { openBook(); return; }

    var absDiff = Math.abs(diff);
    var dir = diff > 0 ? 1 : -1;
    flipSequence(dir, absDiff);
  }

  function flipSequence(dir, count) {
    if (count <= 0 || state.isFlipping) return;
    if (dir > 0) flipForward(true);
    else flipBackward(true);
  }

  function handleDragStart(x) {
    if (state.isFlipping || state.zoomed) return;
    dragState.active = true;
    dragState.startX = x;
    dragState.currentX = x;
    book.classList.remove('idle');
  }

  function handleDragMove(x) {
    if (!dragState.active) return;
    dragState.currentX = x;
  }

  function handleDragEnd() {
    if (!dragState.active) return;
    dragState.active = false;
    var dx = dragState.currentX - dragState.startX;
    if (Math.abs(dx) > 40) {
      if (dx < 0) flipForward(true);
      else flipBackward(true);
    }
    if (!state.isFlipping) book.classList.add('idle');
  }

  function handleClick(e) {
    if (state.isFlipping || state.zoomed) return;
    if (!state.bookOpen) { openBook(); return; }
    var rect = bookBody.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var relX = x / rect.width;
    if (relX > 0.55) flipForward(true);
    else if (relX < 0.45) flipBackward(true);
  }

  function handleDoubleClick(e) {
    if (!state.bookOpen) return;
    var rect = bookBody.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var relX = x / rect.width;
    var page = relX < 0.5 ? state.spreadIndex + 1 : state.spreadIndex + 2;
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
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }

  // Mouse events
  bookBody.addEventListener('mousedown', function(e){
    if (e.target.closest('.premium-cover')) return;
    handleDragStart(e.clientX);
  });
  document.addEventListener('mousemove', function(e){
    if (dragState.active) handleDragMove(e.clientX);
  });
  document.addEventListener('mouseup', function(){
    if (dragState.active) handleDragEnd();
  });
  bookBody.addEventListener('click', function(e){
    if (dragState.active) { dragState.active = false; return; }
    handleClick(e);
  });
  bookBody.addEventListener('dblclick', handleDoubleClick);

  // Touch events
  bookBody.addEventListener('touchstart', function(e){
    if (e.target.closest('.premium-cover')) return;
    var t = e.touches[0];
    handleDragStart(t.clientX);
  }, {passive: true});
  bookBody.addEventListener('touchmove', function(e){
    var t = e.touches[0];
    handleDragMove(t.clientX);
  }, {passive: true});
  bookBody.addEventListener('touchend', function(){
    handleDragEnd();
  }, {passive: true});

  // Cover clicks
  coverFront.addEventListener('click', openBook);
  coverBack.addEventListener('click', function(){
    if (state.bookOpen && state.spreadIndex + 2 >= TOTAL_PAGES) closeBook();
  });

  // Navigation buttons
  if (prevBtn) prevBtn.addEventListener('click', function(){ flipBackward(true); });
  if (nextBtn) nextBtn.addEventListener('click', function(){ flipForward(true); });

  // Keyboard
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
      case 'f': case 'F': toggleFullscreen(); break;
    }
  });

  // Fullscreen button
  if (fullscreenBtn) fullscreenBtn.addEventListener('click', toggleFullscreen);

  // Zoom overlay close
  if (zoomOverlay) zoomOverlay.addEventListener('click', hideZoom);

  // Handle fullscreen change
  document.addEventListener('fullscreenchange', function(){
    if (fullscreenBtn) fullscreenBtn.textContent = document.fullscreenElement ? 'Exit' : 'Fullscreen';
  });

  document.addEventListener('webkitfullscreenchange', function(){
    if (fullscreenBtn) fullscreenBtn.textContent = document.webkitFullscreenElement ? 'Exit' : 'Fullscreen';
  });

  // Resize
  window.addEventListener('resize', function(){
    if (state.zoomed) {
      // zoom overlay handles this naturally
    }
  });

  renderSpread();
})();
