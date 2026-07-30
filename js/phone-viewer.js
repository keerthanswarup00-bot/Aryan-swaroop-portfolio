(function () {
  if (window.innerWidth >= 768) return;

  var CONTENT_PAGES = 42;
  var TOTAL_IMAGES = 44;

  function pad(n) {
    return n < 10 ? '0' + n : '' + n;
  }

  var container = document.getElementById('mobile-flipbook');
  if (!container) return;

  var pages = [];

  for (var i = 1; i <= TOTAL_IMAGES; i++) {
    var page = document.createElement('div');
    var img = document.createElement('img');
    img.src = '/images/brahmi/page-' + pad(i) + '.jpg';
    img.draggable = false;
    img.alt = '';
    img.style.cssText = 'width:100%;height:100%;display:block;object-fit:cover;pointer-events:none;-webkit-user-select:none;user-select:none;';
    page.appendChild(img);
    container.appendChild(page);
    pages.push(page);
  }

  function initFlipbook() {
    if (typeof St === 'undefined' || !St.PageFlip) {
      setTimeout(initFlipbook, 100);
      return;
    }

    requestAnimationFrame(function () {
      var book = new St.PageFlip(container, {
        width: 1600,
        height: 900,
        size: 'stretch',
        minWidth: 200,
        maxWidth: 1600,
        minHeight: 113,
        maxHeight: 900,
        showCover: true,
        autoSize: false,
        usePortrait: false,
        mobileScrollSupport: false,
        maxShadowOpacity: 0.3,
        drawShadow: true,
        flippingTime: 700,
        startPage: 0
      });

      book.loadFromHTML(pages);

      var indicator = document.querySelector('.mobile-page-indicator');
      var prevBtn = document.querySelector('.mobile-nav-prev');
      var nextBtn = document.querySelector('.mobile-nav-next');

      function updateDisplay() {
        if (!indicator) return;
        var idx = book.getCurrentPageIndex();
        var total = book.getPageCount();

        if (idx <= 0) {
          indicator.textContent = 'Cover';
        } else if (idx >= total - 1) {
          indicator.textContent = 'Back Cover';
        } else {
          indicator.textContent = idx + ' / ' + CONTENT_PAGES;
        }
      }

      book.on('flip', updateDisplay);

      if (prevBtn) {
        prevBtn.addEventListener('click', function () { book.flipPrev(); });
      }
      if (nextBtn) {
        nextBtn.addEventListener('click', function () { book.flipNext(); });
      }

      document.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowLeft') { e.preventDefault(); book.flipPrev(); }
        if (e.key === 'ArrowRight') { e.preventDefault(); book.flipNext(); }
      });

      setTimeout(updateDisplay, 300);
      window.__mobileFlipbook = book;
    });
  }

  var script = document.createElement('script');
  script.src = 'https://unpkg.com/page-flip@2.0.7/dist/js/page-flip.browser.js';
  script.onload = initFlipbook;
  script.onerror = function () {};
  document.head.appendChild(script);
})();
