(function () {
  var TOTAL_PAGES = 44;
  var PAGE_URL_BASE = '/images/brahmi/page-';

  var root = document.querySelector('.premium-flipbook-wrapper');
  if (!root) return;

  var coverFront = root.querySelector('.premium-cover-front');
  var coverBack = root.querySelector('.premium-cover-back');
  var prevBtn = root.querySelector('.premium-ui-btn-prev');
  var nextBtn = root.querySelector('.premium-ui-btn-next');
  var pageNumEl = root.querySelector('.premium-ui-pagenum');
  var progressFill = root.querySelector('.premium-ui-progress-fill');
  var skeleton = root.querySelector('.premium-skeleton');
  var turnContainer = root.querySelector('.premium-turn-container');
  var $flipbook = $('#flipbook');

  var bookOpen = false;

  function padPage(n) {
    return n < 10 ? '0' + n : '' + n;
  }

  function pageUrl(n) {
    if (n < 1 || n > TOTAL_PAGES) return '';
    return PAGE_URL_BASE + padPage(n) + '.jpg';
  }

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

  function sizeBook() {
    var w = turnContainer.clientWidth;
    var h = w * (173 / 307);
    turnContainer.style.height = Math.round(h) + 'px';
  }

  function updateUI(page) {
    var displayNum = Math.min(page, TOTAL_PAGES);
    if (pageNumEl) pageNumEl.textContent = displayNum + ' / ' + TOTAL_PAGES;
    if (prevBtn) prevBtn.disabled = page <= 2;
    if (nextBtn) nextBtn.disabled = page >= TOTAL_PAGES;
    if (progressFill)
      progressFill.style.width = (page / TOTAL_PAGES) * 100 + '%';
  }

  function openBook() {
    if (bookOpen) return;
    bookOpen = true;
    coverFront.classList.add('open');
    if (coverBack) coverBack.classList.add('open');
    setTimeout(function () {
      coverFront.classList.add('hidden');
      if (coverBack) coverBack.classList.add('hidden');
    }, 1400);
  }

  function init() {
    for (var i = 1; i <= TOTAL_PAGES; i++) {
      var $page = $('<div></div>');
      if (i === 1 || i === TOTAL_PAGES) $page.addClass('hard');
      $page.css({
        backgroundImage: 'url(' + pageUrl(i) + ')',
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundColor: '#F7F5EF'
      });
      $flipbook.append($page);
    }

    sizeBook();

    $flipbook.turn({
      width: turnContainer.clientWidth,
      height: turnContainer.clientHeight,
      page: 2,
      display: 'double',
      acceleration: true,
      duration: 750,
      gradients: true,
      when: {
        turned: function (event, page) {
          updateUI(page);
        }
      }
    });

    updateUI(2);

    preloadAll().then(function () {
      if (skeleton) skeleton.classList.add('hidden');
      turnContainer.classList.add('idle');
    });
  }

  init();

  if (coverFront) coverFront.addEventListener('click', openBook);
  if (coverBack) coverBack.addEventListener('click', openBook);

  if (prevBtn)
    prevBtn.addEventListener('click', function () {
      if (bookOpen) $flipbook.turn('previous');
      else openBook();
    });

  if (nextBtn)
    nextBtn.addEventListener('click', function () {
      if (bookOpen) $flipbook.turn('next');
      else openBook();
    });

  document.addEventListener('keydown', function (e) {
    if (!bookOpen) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openBook();
      }
      return;
    }
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault();
        $flipbook.turn('next');
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault();
        $flipbook.turn('previous');
        break;
      case 'Home':
        e.preventDefault();
        $flipbook.turn('page', 1);
        break;
      case 'End':
        e.preventDefault();
        $flipbook.turn('page', TOTAL_PAGES);
        break;
    }
  });

  var resizeTimer;
  $(window).resize(function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      sizeBook();
      try { $flipbook.turn('resize'); } catch (e) {}
    }, 150);
  });

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
})();
