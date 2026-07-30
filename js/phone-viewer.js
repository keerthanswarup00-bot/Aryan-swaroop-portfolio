(function () {
  var TOTAL_PAGES = 44;

  function pad(n) {
    return n < 10 ? '0' + n : '' + n;
  }

  var flipbookEl = document.getElementById('flipbook');
  if (!flipbookEl) return;

  for (var i = 1; i <= TOTAL_PAGES; i++) {
    var page = document.createElement('div');
    page.className = 'page';
    page.style.cssText = 'width:320px;height:180px;background-size:cover;background-position:center;background-repeat:no-repeat;background-image:url(/images/brahmi/page-' + pad(i) + '.jpg)';
    flipbookEl.appendChild(page);
  }

  var pageEls = flipbookEl.querySelectorAll('.page');

  function initFlipbook() {
    if (typeof St === 'undefined' || !St.PageFlip) {
      setTimeout(initFlipbook, 100);
      return;
    }

    requestAnimationFrame(function () {
    var book = new St.PageFlip(flipbookEl, {
      width: 1600,
      height: 900,
      size: 'stretch',
      minWidth: 280,
      maxWidth: 1600,
      minHeight: 158,
      maxHeight: 900,
      showCover: true,
      autoSize: false,
      usePortrait: false,
      mobileScrollSupport: false,
      maxShadowOpacity: 0.25,
      drawShadow: true,
      flippingTime: 700,
      startPage: 0
    });

    book.loadFromHTML(pageEls);

    var indicator = document.querySelector('.page-indicator');
    var prevBtn = document.querySelector('.nav.prev');
    var nextBtn = document.querySelector('.nav.next');
    var zoomIn = document.querySelector('.zoom-in');
    var zoomOut = document.querySelector('.zoom-out');

    function updateCounter() {
      if (!indicator) return;
      var idx = book.getCurrentPageIndex();
      var display = Math.min(Math.floor(idx / 2) + 1, TOTAL_PAGES);
      indicator.textContent = display + ' / ' + TOTAL_PAGES;
    }

    book.on('flip', updateCounter);

    if (prevBtn) prevBtn.addEventListener('click', function () { book.flipPrev(); });
    if (nextBtn) nextBtn.addEventListener('click', function () { book.flipNext(); });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { e.preventDefault(); book.flipPrev(); }
      if (e.key === 'ArrowRight') { e.preventDefault(); book.flipNext(); }
    });

    var zoomLevel = 1;
    if (zoomIn) {
      zoomIn.addEventListener('click', function () {
        zoomLevel = Math.min(zoomLevel + 0.1, 2);
        flipbookEl.style.transform = 'scale(' + zoomLevel + ')';
      });
    }
    if (zoomOut) {
      zoomOut.addEventListener('click', function () {
        zoomLevel = Math.max(zoomLevel - 0.1, 0.5);
        flipbookEl.style.transform = 'scale(' + zoomLevel + ')';
      });
    }

    setTimeout(updateCounter, 200);
    window.__phoneFlipbook = book;
    });
  }

  var script = document.createElement('script');
  script.src = 'https://unpkg.com/page-flip@2.0.7/dist/js/page-flip.browser.js';
  script.onload = initFlipbook;
  script.onerror = function () {
    console.warn('Failed to load page-flip from CDN');
  };
  document.head.appendChild(script);
})();
