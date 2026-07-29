(function () {
  const TOTAL_PAGES = 44;
  const FLIP_DURATION = 750;
  const PAGE_URL_BASE = '/images/brahmi/page-';
  const SWIPE_THRESHOLD = 40;
  const TAP_THRESHOLD = 8;

  const state = {
    leftPage: 2,
    isFlipping: false,
    bookOpen: false,
    zoomed: false,
    fullscreen: false,
    loaded: false,
    coverHidden: false,
    drag: {
      active: false,
      startX: 0,
      startY: 0,
      currentX: 0,
      currentY: 0,
      time: 0,
      moved: false,
    },
  };

  const root = document.querySelector('.premium-flipbook-wrapper');
  if (!root) return;

  const stage = root.querySelector('.premium-flipbook-stage');
  const book = root.querySelector('.premium-book');
  const bookBody = root.querySelector('.premium-book-body');
  const pageLeft = root.querySelector('.premium-page-left');
  const pageRight = root.querySelector('.premium-page-right');
  const coverFront = root.querySelector('.premium-cover-front');
  const coverBack = root.querySelector('.premium-cover-back');
  const prevBtn = root.querySelector('.premium-ui-btn-prev');
  const nextBtn = root.querySelector('.premium-ui-btn-next');
  const fullscreenBtn = root.querySelector('.premium-ui-btn-fullscreen');
  const fsCloseBtn = root.querySelector('.premium-fs-close-btn');
  const pageNumEl = root.querySelector('.premium-ui-pagenum');
  const progressFill = root.querySelector('.premium-ui-progress-fill');
  const skeleton = root.querySelector('.premium-skeleton');
  const zoomOverlay = root.querySelector('.premium-zoom-overlay');
  const zoomImg = zoomOverlay ? zoomOverlay.querySelector('img') : null;
  const stackLeft = root.querySelector('.premium-stack-left');
  const stackRight = root.querySelector('.premium-stack-right');

  // --- helpers ---
  function padPage(n) {
    return n < 10 ? '0' + n : '' + n;
  }

  function pageUrl(n) {
    if (n < 1 || n > TOTAL_PAGES) return '';
    return PAGE_URL_BASE + padPage(n) + '.jpg';
  }

  function setPage(el, n) {
    var url = pageUrl(n);
    if (url) {
      el.style.backgroundImage = 'url(' + url + ')';
      el.classList.remove('premium-page-hidden');
    } else {
      el.style.backgroundImage = 'none';
      el.classList.add('premium-page-hidden');
    }
  }

  // --- preload all images ---
  function preloadAll() {
    return new Promise(function (resolve) {
      var loaded = 0;
      for (var i = 1; i <= TOTAL_PAGES; i++) {
        var img = new Image();
        img.src = pageUrl(i);
        img.onload = img.onerror = function () {
          loaded++;
          if (loaded === TOTAL_PAGES) resolve();
        };
      }
    });
  }

  // --- stacks (page depth) ---
  function updateStacks() {
    if (!stackLeft || !stackRight) return;
    var turned = Math.max(0, state.leftPage - 2);
    var remaining = Math.max(0, TOTAL_PAGES - state.leftPage - 1);
    var maxVisible = 8;
    var leftCount = Math.min(turned, maxVisible);
    var rightCount = Math.min(remaining, maxVisible);

    stackLeft.innerHTML = '';
    stackRight.innerHTML = '';

    if (leftCount > 0) {
      stackLeft.style.width = Math.min(leftCount * 2.5 + 2, 20) + 'px';
      for (var i = 0; i < Math.min(leftCount, 4); i++) {
        var d = document.createElement('div');
        d.style.cssText =
          'position:absolute;inset:0;opacity:' +
          (0.3 + i * 0.2) +
          ';transform:translateZ(' +
          -i +
          'px);background:linear-gradient(to bottom,#EDE8DF 0%,#E0D9CC 100%);border-radius:1px';
        stackLeft.appendChild(d);
      }
    } else {
      stackLeft.style.width = '0';
    }

    if (rightCount > 0) {
      stackRight.style.width = Math.min(rightCount * 2.5 + 2, 20) + 'px';
      for (var i = 0; i < Math.min(rightCount, 4); i++) {
        var d = document.createElement('div');
        d.style.cssText =
          'position:absolute;inset:0;opacity:' +
          (0.3 + i * 0.2) +
          ';transform:translateZ(' +
          -i +
          'px);background:linear-gradient(to bottom,#EDE8DF 0%,#E0D9CC 100%);border-radius:1px';
        stackRight.appendChild(d);
      }
    } else {
      stackRight.style.width = '0';
    }
  }

  // --- UI update ---
  function updateUI() {
    var displayNum = Math.min(state.leftPage, TOTAL_PAGES);
    if (pageNumEl) pageNumEl.textContent = displayNum + ' / ' + TOTAL_PAGES;
    if (prevBtn) prevBtn.disabled = state.leftPage <= 2;
    if (nextBtn) nextBtn.disabled = state.leftPage + 2 >= TOTAL_PAGES;
    if (progressFill)
      progressFill.style.width = (state.leftPage / TOTAL_PAGES) * 100 + '%';
  }

  // --- render spread ---
  function renderSpread() {
    setPage(pageLeft, state.leftPage);
    setPage(pageRight, state.leftPage + 1);
    updateStacks();
    updateUI();
  }

  // --- create flip element ---
  function createFlipEl(dir, frontNum, backNum) {
    var el = document.createElement('div');
    el.className = 'premium-flip ' + dir;
    el.innerHTML =
      '<div class="premium-flip-face premium-flip-front" style="background-image:url(' +
      pageUrl(frontNum) +
      ')"></div>' +
      '<div class="premium-flip-face premium-flip-back" style="background-image:url(' +
      pageUrl(backNum) +
      ')"></div>' +
      '<div class="premium-flip-edge"></div>' +
      '<div class="premium-flip-shadow"></div>' +
      '<div class="premium-flip-highlight"></div>';
    return el;
  }

  // --- create reveal element ---
  function createRevealEl(side, pageNum) {
    var el = document.createElement('div');
    el.className = 'premium-page-reveal';
    el.style.backgroundImage = 'url(' + pageUrl(pageNum) + ')';
    el.style.left = side === 'left' ? '0' : '50%';
    if (pageNum < 1 || pageNum > TOTAL_PAGES) el.style.display = 'none';
    return el;
  }

  // --- forward flip ---
  function flipForward(animate) {
    if (state.isFlipping) return;
    if (state.leftPage + 3 > TOTAL_PAGES) return;
    if (!state.bookOpen) {
      openBook();
      return;
    }
    state.isFlipping = true;
    book.classList.remove('idle');

    var currentRight = state.leftPage + 1;
    var nextLeft = currentRight + 1;
    var nextRight = nextLeft + 1;

    var flip = createFlipEl('forward', currentRight, nextLeft);
    var reveal = createRevealEl('right', nextRight);

    pageRight.classList.add('premium-page-hidden');
    bookBody.appendChild(reveal);
    bookBody.appendChild(flip);

    if (animate !== false) {
      flip.classList.add('animating-forward');
      flip.addEventListener('animationend', function done() {
        flip.removeEventListener('animationend', done);
        finishForward(flip, reveal);
      });
    } else {
      flip.style.transform = 'rotateY(-180deg)';
      requestAnimationFrame(function () {
        finishForward(flip, reveal);
      });
    }
  }

  function finishForward(flip, reveal) {
    flip.remove();
    reveal.remove();
    pageRight.classList.remove('premium-page-hidden');
    state.leftPage += 2;
    renderSpread();
    state.isFlipping = false;
    if (!state.drag.active) book.classList.add('idle');
  }

  // --- backward flip ---
  function flipBackward(animate) {
    if (state.isFlipping) return;
    if (state.leftPage - 2 < 1) return;
    if (!state.bookOpen) {
      openBook();
      return;
    }
    state.isFlipping = true;
    book.classList.remove('idle');

    var currentLeft = state.leftPage;
    var prevRight = currentLeft - 1;
    var prevLeft = prevRight - 1;

    var flip = createFlipEl('backward', currentLeft, prevRight);
    var reveal = createRevealEl('left', prevLeft);

    pageLeft.classList.add('premium-page-hidden');
    bookBody.appendChild(reveal);
    bookBody.appendChild(flip);

    if (animate !== false) {
      flip.classList.add('animating-backward');
      flip.addEventListener('animationend', function done() {
        flip.removeEventListener('animationend', done);
        finishBackward(flip, reveal);
      });
    } else {
      flip.style.transform = 'rotateY(180deg)';
      requestAnimationFrame(function () {
        finishBackward(flip, reveal);
      });
    }
  }

  function finishBackward(flip, reveal) {
    flip.remove();
    reveal.remove();
    pageLeft.classList.remove('premium-page-hidden');
    state.leftPage -= 2;
    renderSpread();
    state.isFlipping = false;
    if (!state.drag.active) book.classList.add('idle');
  }

  // --- open / close book ---
  function openBook() {
    if (state.bookOpen) return;
    state.bookOpen = true;
    coverFront.classList.add('open');
    coverBack.classList.add('open');
    setTimeout(function () {
      coverFront.classList.add('hidden');
      coverBack.classList.add('hidden');
      state.coverHidden = true;
      state.leftPage = 2;
      renderSpread();
      pageLeft.classList.remove('premium-page-hidden');
      pageRight.classList.remove('premium-page-hidden');
      book.classList.add('idle');
    }, 1150);
  }

  function closeBook() {
    coverFront.classList.remove('hidden', 'open');
    coverBack.classList.remove('hidden', 'open');
    state.coverHidden = false;
    state.bookOpen = false;
    book.classList.remove('idle');
    pageLeft.classList.add('premium-page-hidden');
    pageRight.classList.add('premium-page-hidden');
    state.leftPage = 2;
    renderSpread();
  }

  // --- go to page (multi-step) ---
  function goToPage(n) {
    if (state.isFlipping) return;
    var target = Math.max(1, Math.min(TOTAL_PAGES - 1, n));
    if (target % 2 !== 0) target = target - 1;
    var diff = target - state.leftPage;
    if (diff === 0) return;
    if (!state.bookOpen) {
      openBook();
      return;
    }
    var steps = Math.abs(diff) / 2;
    var dir = diff > 0 ? 1 : -1;
    var done = 0;
    function doStep() {
      if (done >= steps) return;
      var check = setInterval(function () {
        if (!state.isFlipping) {
          clearInterval(check);
          if (dir > 0) {
            if (state.leftPage + 3 > TOTAL_PAGES) return;
            flipForward(true);
          } else {
            flipBackward(true);
          }
          done++;
          setTimeout(doStep, 50);
        }
      }, 80);
    }
    doStep();
  }

  // --- click handler ---
  function handleClick(clientX) {
    if (state.isFlipping || state.zoomed) return;
    var rect = bookBody.getBoundingClientRect();
    var x = clientX - rect.left;
    var relX = x / rect.width;
    if (!state.bookOpen) {
      openBook();
      return;
    }
    if (relX > 0.55) {
      if (state.leftPage + 3 > TOTAL_PAGES) closeBook();
      else flipForward(true);
    } else if (relX < 0.45) {
      flipBackward(true);
    }
  }

  // --- double-click zoom ---
  function handleDoubleClick(e) {
    if (!state.bookOpen || state.zoomed || !zoomOverlay || !zoomImg) return;
    var rect = bookBody.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var relX = x / rect.width;
    var page = relX < 0.5 ? state.leftPage : state.leftPage + 1;
    if (page < 1 || page > TOTAL_PAGES) return;
    zoomImg.src = pageUrl(page);
    zoomImg.alt = 'Brahmi Brand Book - Page ' + page;
    zoomOverlay.classList.add('active');
    state.zoomed = true;
  }

  function hideZoom() {
    state.zoomed = false;
    if (zoomOverlay) zoomOverlay.classList.remove('active');
  }

  // --- fullscreen ---
  function toggleFullscreen() {
    var parent = root.parentElement;
    if (state.fullscreen) {
      root.classList.remove('is-fullscreen');
      state.fullscreen = false;
      document.body.style.overflow = '';
      if (parent) parent.style.minHeight = '';
    } else {
      if (parent) parent.style.minHeight = root.getBoundingClientRect().height + 'px';
      root.classList.add('is-fullscreen');
      state.fullscreen = true;
      document.body.style.overflow = 'hidden';
    }
  }

  // ============================================================
  // EVENT BINDING
  // ============================================================

  // Cover click
  coverFront.addEventListener('click', openBook);

  // Book body click
  bookBody.addEventListener('click', function (e) {
    if (e.target.closest('.premium-cover')) return;
    if (state.drag.moved) {
      state.drag.moved = false;
      return;
    }
    handleClick(e.clientX);
  });

  // Double-click
  bookBody.addEventListener('dblclick', handleDoubleClick);

  // --- mouse drag / swipe ---
  bookBody.addEventListener('mousedown', function (e) {
    if (e.target.closest('.premium-cover') || state.isFlipping || state.zoomed)
      return;
    state.drag.active = true;
    state.drag.startX = e.clientX;
    state.drag.startY = e.clientY;
    state.drag.moved = false;
    state.drag.time = Date.now();
    book.classList.remove('idle');
  });

  document.addEventListener('mousemove', function (e) {
    if (!state.drag.active) return;
    state.drag.currentX = e.clientX;
    state.drag.currentY = e.clientY;
    var dx = e.clientX - state.drag.startX;
    var dy = e.clientY - state.drag.startY;
    if (Math.abs(dx) > TAP_THRESHOLD || Math.abs(dy) > TAP_THRESHOLD) {
      state.drag.moved = true;
    }
  });

  document.addEventListener('mouseup', function (e) {
    if (!state.drag.active) return;
    state.drag.active = false;
    var dx = e.clientX - state.drag.startX;
    if (state.drag.moved && Math.abs(dx) > SWIPE_THRESHOLD) {
      if (dx < 0) flipForward(true);
      else flipBackward(true);
    }
    if (!state.drag.active) book.classList.add('idle');
  });

  // --- touch ---
  bookBody.addEventListener(
    'touchstart',
    function (e) {
      if (e.target.closest('.premium-cover') || state.isFlipping || state.zoomed)
        return;
      var t = e.touches[0];
      state.drag.active = true;
      state.drag.startX = t.clientX;
      state.drag.startY = t.clientY;
      state.drag.moved = false;
      state.drag.time = Date.now();
      book.classList.remove('idle');
    },
    { passive: true }
  );

  bookBody.addEventListener(
    'touchmove',
    function (e) {
      if (!state.drag.active) return;
      var t = e.touches[0];
      state.drag.currentX = t.clientX;
      state.drag.currentY = t.clientY;
      var dx = t.clientX - state.drag.startX;
      var dy = t.clientY - state.drag.startY;
      if (Math.abs(dx) > TAP_THRESHOLD || Math.abs(dy) > TAP_THRESHOLD) {
        state.drag.moved = true;
      }
    },
    { passive: true }
  );

  bookBody.addEventListener(
    'touchend',
    function (e) {
      if (!state.drag.active) return;
      state.drag.active = false;
      var t = e.changedTouches[0];
      var dx = t.clientX - state.drag.startX;
      if (state.drag.moved && Math.abs(dx) > SWIPE_THRESHOLD) {
        if (dx < 0) flipForward(true);
        else flipBackward(true);
      } else if (!state.drag.moved) {
        handleClick(t.clientX);
      }
      book.classList.add('idle');
    },
    { passive: true }
  );

  bookBody.addEventListener(
    'touchcancel',
    function () {
      state.drag.active = false;
      book.classList.add('idle');
    },
    { passive: true }
  );

  // --- wheel / trackpad ---
  bookBody.addEventListener(
    'wheel',
    function (e) {
      if (state.isFlipping || !state.bookOpen || state.zoomed) return;
      if (Math.abs(e.deltaX) > 50) {
        e.preventDefault();
        if (e.deltaX > 0) flipForward(true);
        else flipBackward(true);
      }
    },
    { passive: false }
  );

  // --- nav buttons ---
  if (prevBtn)
    prevBtn.addEventListener('click', function () {
      flipBackward(true);
    });
  if (nextBtn)
    nextBtn.addEventListener('click', function () {
      flipForward(true);
    });

  // --- fullscreen ---
  if (fullscreenBtn)
    fullscreenBtn.addEventListener('click', toggleFullscreen);
  if (fsCloseBtn) fsCloseBtn.addEventListener('click', toggleFullscreen);

  // --- keyboard ---
  document.addEventListener('keydown', function (e) {
    if (state.zoomed) {
      if (e.key === 'Escape') hideZoom();
      return;
    }
    if (state.fullscreen) {
      if (e.key === 'Escape') toggleFullscreen();
      return;
    }
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault();
        flipForward(true);
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault();
        flipBackward(true);
        break;
      case 'Home':
        e.preventDefault();
        goToPage(1);
        break;
      case 'End':
        e.preventDefault();
        goToPage(TOTAL_PAGES);
        break;
      case 'f':
      case 'F':
        e.preventDefault();
        toggleFullscreen();
        break;
    }
  });

  // --- zoom close ---
  if (zoomOverlay) zoomOverlay.addEventListener('click', hideZoom);

  // --- scroll reveal ---
  var revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08 }
  );
  revealObserver.observe(root);

  // ============================================================
  // INIT
  // ============================================================
  function init() {
    // Show skeleton
    if (skeleton) skeleton.classList.remove('hidden');

    // Hide pages initially (behind cover)
    pageLeft.classList.add('premium-page-hidden');
    pageRight.classList.add('premium-page-hidden');
    renderSpread();

    // Preload all images, then boot
    preloadAll().then(function () {
      state.loaded = true;
      if (skeleton) skeleton.classList.add('hidden');
    });
  }

  init();
})();
