(function(){
  var totalPages = 44;
  var currentPage = 1;
  var isFlipping = false;
  var perPage = 2;

  var el = document.querySelector('.flipbook');
  if (!el) return;

  var viewport = el.querySelector('.flipbook-viewport');
  var leftPage = el.querySelector('.flipbook-page-left');
  var rightPage = el.querySelector('.flipbook-page-right');
  var prevBtn = el.querySelector('.flipbook-prev');
  var nextBtn = el.querySelector('.flipbook-next');
  var pageNum = el.querySelector('.flipbook-page-num');

  function pageUrl(num) {
    var n = num < 10 ? '0' + num : '' + num;
    return '/images/brahmi/page-' + n + '.jpg';
  }

  function render() {
    var leftNum = currentPage;
    var rightNum = currentPage + 1;
    leftPage.style.backgroundImage = 'url(' + pageUrl(leftNum) + ')';
    if (rightNum <= totalPages) {
      rightPage.style.backgroundImage = 'url(' + pageUrl(rightNum) + ')';
      rightPage.style.display = '';
    } else {
      rightPage.style.backgroundImage = 'none';
      rightPage.style.display = 'none';
    }
    if (pageNum) {
      pageNum.textContent = leftNum + '–' + Math.min(rightNum, totalPages) + ' / ' + totalPages;
    }
    if (prevBtn) prevBtn.disabled = currentPage <= 1;
    if (nextBtn) nextBtn.disabled = currentPage + perPage >= totalPages;
  }

  function flipForward() {
    if (isFlipping) return;
    if (currentPage + perPage >= totalPages) return;
    isFlipping = true;
    var nextPage = currentPage + 2;
    var flipEl = rightPage;
    flipEl.style.backgroundImage = 'url(' + pageUrl(currentPage + 1) + ')';
    flipEl.style.zIndex = 10;
    flipEl.classList.add('flipped');
    currentPage = nextPage;
    setTimeout(function(){
      flipEl.classList.remove('flipped');
      flipEl.style.zIndex = '';
      render();
      isFlipping = false;
    }, 600);
  }

  function flipBackward() {
    if (isFlipping) return;
    if (currentPage <= 1) return;
    isFlipping = true;
    var prevPage = currentPage - 2;
    var flipEl = leftPage;
    var leftNum = prevPage;
    var rightNum = prevPage + 1;
    leftPage.style.backgroundImage = 'url(' + pageUrl(leftNum) + ')';
    rightPage.style.backgroundImage = 'url(' + pageUrl(rightNum) + ')';
    flipEl.style.zIndex = 10;
    flipEl.classList.add('flipped');
    currentPage = prevPage;
    setTimeout(function(){
      flipEl.classList.remove('flipped');
      flipEl.style.zIndex = '';
      render();
      isFlipping = false;
    }, 600);
  }

  if (nextBtn) nextBtn.addEventListener('click', flipForward);
  if (prevBtn) prevBtn.addEventListener('click', flipBackward);
  viewport.addEventListener('click', function(e){
    if (isFlipping) return;
    var rect = viewport.getBoundingClientRect();
    var x = e.clientX - rect.left;
    if (x > rect.width / 2) {
      flipForward();
    } else {
      flipBackward();
    }
  });

  render();
})();
