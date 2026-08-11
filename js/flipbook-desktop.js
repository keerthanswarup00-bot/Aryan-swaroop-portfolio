(function () {
  init();

  function init() {
    var PAGE_W = 1280;
    var PAGE_H = 720;
    var TOTAL_IMAGES = 44;
    var RESIZE_DEBOUNCE = 200;

    function pad(n) {
      return n < 10 ? '0' + n : '' + n;
    }

    var wrapper = document.querySelector('.premium-flipbook-wrapper');
    var container = document.getElementById('flipbook_brahmi');
    if (!wrapper || !container) return;

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
      pageEls.push(page);
    }

    var book = null;
    var prevBtn = document.querySelector('.fb-desktop__prev');
    var nextBtn = document.querySelector('.fb-desktop__next');
    var counter = document.querySelector('.fb-desktop__counter');
    var frame = document.querySelector('.fb-desktop');

    function getPageHalfWidth() {
      if (!book) return 0;
      var rect = book.getBoundsRect();
      return rect && rect.pageWidth ? rect.pageWidth / 2 : 0;
    }

    function syncShift(pageIndex) {
      if (!frame) return;
      var half = getPageHalfWidth();
      if (pageIndex <= 0) {
        frame.style.setProperty('--flipbook-shift', (-half) + 'px');
        frame.setAttribute('data-flip-state', 'closed');
      } else if (pageIndex >= TOTAL_IMAGES - 1) {
        frame.style.setProperty('--flipbook-shift', half + 'px');
        frame.setAttribute('data-flip-state', 'closed');
      } else {
        frame.setAttribute('data-flip-state', 'opened');
      }
    }

    function handleFlipStart() {
      if (!book) return;
      var dir = -1;
      try {
        var calc = book.getFlipController() && book.getFlipController().getCalculation();
        if (calc && typeof calc.getDirection === 'function') dir = calc.getDirection();
      } catch (e) {}
      if (dir < 0) return;
      syncShift(book.getCurrentPageIndex() + (dir === 0 ? 1 : -1));
    }

    function updateDisplay() {
      if (!book || !counter) return;
      var idx = book.getCurrentPageIndex();
      if (idx <= 0) {
        counter.textContent = 'Cover';
      } else if (idx >= TOTAL_IMAGES - 1) {
        counter.textContent = 'Back cover';
      } else {
        counter.textContent = (idx + 1) + ' \u2013 ' + (idx + 2) + ' / ' + TOTAL_IMAGES;
      }
    }

    function initBook() {
      if (typeof St === 'undefined' || !St.PageFlip || book) return;

      for (var p = 0; p < pageEls.length; p++) {
        container.appendChild(pageEls[p]);
      }

      book = new St.PageFlip(container, {
        width: PAGE_W,
        height: PAGE_H,
        size: 'stretch',
        minWidth: 240,
        maxWidth: 1440,
        minHeight: 135,
        maxHeight: 810,
        usePortrait: false,
        showCover: true,
        autoSize: true,
        drawShadow: true,
        maxShadowOpacity: 0.4,
        flippingTime: 700,
        startPage: 0,
        mobileScrollSupport: false,
      });

      book.loadFromHTML(pageEls);
      window.__brahmiFlipbook = book;

      book.on('flip', function () {
        updateDisplay();
        syncShift(book.getCurrentPageIndex());
      });
      book.on('init', function () {
        updateDisplay();
        syncShift(book.getCurrentPageIndex());
      });
      book.on('changeState', function (e) {
        var state = e && e.data;
        if (state === 'flipping' || state === 'fold_corner') handleFlipStart();
        if (state === 'read') syncShift(book.getCurrentPageIndex());
      });
      updateDisplay();
    }

    function loadLibAndInit() {
      if (typeof St !== 'undefined' && St.PageFlip) {
        initBook();
        return;
      }
      var script = document.createElement('script');
      script.src = 'https://unpkg.com/page-flip@2.0.7/dist/js/page-flip.browser.js';
      script.onload = initBook;
      script.onerror = function () {};
      document.head.appendChild(script);
    }

    var resizeTimer = null;
    function handleResize() {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        if (book) {
          updateDisplay();
          syncShift(book.getCurrentPageIndex());
        } else {
          loadLibAndInit();
        }
      }, RESIZE_DEBOUNCE);
    }

    if (typeof ResizeObserver !== 'undefined') {
      var ro = new ResizeObserver(function () {
        handleResize();
      });
      ro.observe(wrapper);
    }
    window.addEventListener('resize', handleResize);

    loadLibAndInit();

    function revealWrapper() {
      wrapper.classList.add('visible');
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      revealWrapper();
    } else if ('IntersectionObserver' in window) {
      var revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.08 });
      revealObserver.observe(wrapper);
    } else {
      revealWrapper();
    }

    if (prevBtn) prevBtn.addEventListener('click', function () { if (book) book.flipPrev(); });
    if (nextBtn) nextBtn.addEventListener('click', function () { if (book) book.flipNext(); });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); if (book) book.flipNext(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); if (book) book.flipPrev(); }
      if (e.key === 'Home') { e.preventDefault(); if (book) book.turnToPage(0); }
      if (e.key === 'End') { e.preventDefault(); if (book) book.turnToPage(TOTAL_IMAGES - 1); }
    });
  }
})();
