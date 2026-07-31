(function () {
  if (window.innerWidth >= 768) return;

  var PAGE_W = 1280;
  var PAGE_H = 720;
  var PAGE_ASPECT = PAGE_W / PAGE_H;
  var CONTENT_PAGES = 42;
  var TOTAL_IMAGES = 44;
  var MAX_PAGE_W = 360;
  var RESIZE_DEBOUNCE = 200;

  function pad(n) {
    return n < 10 ? '0' + n : '' + n;
  }

  var container = document.getElementById('mobile-flipbook');
  if (!container) return;

  var pageEls = [];
  for (var i = 1; i <= TOTAL_IMAGES; i++) {
    var page = document.createElement('div');
    var img = document.createElement('img');
    img.src = '/images/brahmi/page-' + pad(i) + '.jpg';
    img.loading = 'lazy';
    img.draggable = false;
    img.alt = '';
    img.style.cssText = 'width:100%;height:100%;display:block;pointer-events:none;user-select:none;-webkit-user-select:none;';
    page.appendChild(img);
    container.appendChild(page);
    pageEls.push(page);
  }

  var book = null;
  var wrapper = container.parentElement;
  var indicator = document.querySelector('.fb-mobile-indicator');
  var prevBtn = document.querySelector('.fb-mobile-prev');
  var nextBtn = document.querySelector('.fb-mobile-next');
  var resizeTimer = null;
  var lastPageW = 0;
  var loading = false;

  function getPageDimensions() {
    var wrapperW = wrapper.getBoundingClientRect().width;
    if (wrapperW < 1) return null;
    var innerW = wrapperW - 32;
    var pageW = Math.min(Math.floor(innerW / 2), MAX_PAGE_W);
    pageW = Math.max(pageW, 100);
    var pageH = Math.round(pageW / PAGE_ASPECT);
    return { w: pageW, h: pageH };
  }

  function updateDisplay() {
    if (!indicator || !book) return;
    var idx = book.getCurrentPageIndex();
    if (idx <= 0) {
      indicator.textContent = 'Cover';
    } else if (idx >= TOTAL_IMAGES - 1) {
      indicator.textContent = 'Back Cover';
    } else {
      indicator.textContent = Math.min(idx, CONTENT_PAGES) + ' / ' + CONTENT_PAGES;
    }
  }

  function initBook() {
    if (typeof St === 'undefined' || !St.PageFlip) return;
    var dim = getPageDimensions();
    if (!dim) return;

    if (book) {
      if (Math.abs(dim.w - lastPageW) < 10) return;
      book.destroy();
      book = null;
    }

    lastPageW = dim.w;

    book = new St.PageFlip(container, {
      width: dim.w,
      height: dim.h,
      size: 'fixed',
      showCover: true,
      autoSize: false,
      usePortrait: false,
      mobileScrollSupport: false,
      maxShadowOpacity: 0.5,
      drawShadow: true,
      flippingTime: 700,
      startPage: 0
    });

    book.loadFromHTML(pageEls);
    book.on('flip', updateDisplay);
    window.__mobileFlipbook = book;
    updateDisplay();
  }

  function loadLibAndInit() {
    if (loading) return;
    if (typeof St !== 'undefined' && St.PageFlip) {
      initBook();
      return;
    }
    loading = true;
    var script = document.createElement('script');
    script.src = 'https://unpkg.com/page-flip@2.0.7/dist/js/page-flip.browser.js';
    script.onload = initBook;
    script.onerror = function () {};
    document.head.appendChild(script);
  }

  function handleResize() {
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      if (typeof St !== 'undefined' && St.PageFlip) initBook();
    }, RESIZE_DEBOUNCE);
  }

  var ro = new ResizeObserver(function () {
    var dim = getPageDimensions();
    if (dim && !book) {
      loadLibAndInit();
    } else if (dim && book) {
      handleResize();
    }
  });
  ro.observe(wrapper);

  var initialDim = getPageDimensions();
  if (initialDim) loadLibAndInit();

  if (prevBtn) prevBtn.addEventListener('click', function () { if (book) book.flipPrev(); });
  if (nextBtn) nextBtn.addEventListener('click', function () { if (book) book.flipNext(); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') { e.preventDefault(); if (book) book.flipPrev(); }
    if (e.key === 'ArrowRight') { e.preventDefault(); if (book) book.flipNext(); }
  });
})();
