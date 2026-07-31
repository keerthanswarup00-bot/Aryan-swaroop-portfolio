(function () {
  if (window.innerWidth >= 768) return;

  var PAGE_W = 1280;
  var PAGE_H = 720;
  var PAGE_ASPECT = PAGE_W / PAGE_H;
  var CONTENT_PAGES = 42;
  var TOTAL_IMAGES = 44;
  var MAX_BOOK_W = 360;
  var RESIZE_DEBOUNCE = 200;

  function pad(n) {
    return n < 10 ? '0' + n : '' + n;
  }

  var container = document.getElementById('mobile-flipbook');
  if (!container) return;

  var pageEls = [];
  for (var i = 1; i <= TOTAL_IMAGES; i++) {
    var page = document.createElement('div');
    page.style.cssText = 'width:100%;height:100%;overflow:hidden;';
    var img = document.createElement('img');
    img.src = '/images/brahmi/page-' + pad(i) + '.jpg';
    img.draggable = false;
    img.alt = '';
    img.style.cssText = 'width:100%;height:100%;display:block;object-fit:contain;pointer-events:none;user-select:none;-webkit-user-select:none;';
    page.appendChild(img);
    container.appendChild(page);
    pageEls.push(page);
  }

  var book = null;
  var wrapper = container.parentElement;
  var prevBtn = document.querySelector('.fb-mobile-prev');
  var nextBtn = document.querySelector('.fb-mobile-next');
  var resizeTimer = null;
  var lastBookW = 0;
  var loading = false;

  function getBookDimensions() {
    var wrapperW = wrapper.getBoundingClientRect().width;
    if (wrapperW < 1) return null;
    var w = Math.round(Math.min(wrapperW * 0.88, MAX_BOOK_W));
    w = Math.max(w, 180);
    var h = Math.round(w / PAGE_ASPECT);
    return { w: w, h: h };
  }

  function initBook() {
    if (typeof St === 'undefined' || !St.PageFlip) return;
    var dim = getBookDimensions();
    if (!dim) return;

    if (book) {
      if (Math.abs(dim.w - lastBookW) < 10) return;
      book.destroy();
      book = null;
    }

    lastBookW = dim.w;

    container.style.width = dim.w + 'px';
    container.style.height = dim.h + 'px';

    book = new St.PageFlip(container, {
      width: dim.w,
      height: dim.h,
      size: 'stretch',
      showCover: true,
      autoSize: false,
      usePortrait: false,
      mobileScrollSupport: true,
      maxShadowOpacity: 0.5,
      drawShadow: true,
      flippingTime: 700,
      startPage: 0,
    });

    book.loadFromHTML(pageEls);
    window.__mobileFlipbook = book;
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
    var dim = getBookDimensions();
    if (dim && !book) {
      loadLibAndInit();
    } else if (dim && book) {
      handleResize();
    }
  });
  ro.observe(wrapper);

  var initialDim = getBookDimensions();
  if (initialDim) loadLibAndInit();

  if (prevBtn) prevBtn.addEventListener('click', function () { if (book) book.flipPrev(); });
  if (nextBtn) nextBtn.addEventListener('click', function () { if (book) book.flipNext(); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') { e.preventDefault(); if (book) book.flipPrev(); }
    if (e.key === 'ArrowRight') { e.preventDefault(); if (book) book.flipNext(); }
  });
})();
