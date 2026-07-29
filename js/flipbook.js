(function(){
  var totalPages = 44;
  var curPage = 1;
  var flipping = false;

  var root = document.querySelector('.flipbook');
  if (!root) return;
  var viewport = root.querySelector('.flipbook-viewport');
  var prevBtn = root.querySelector('.flipbook-prev');
  var nextBtn = root.querySelector('.flipbook-next');
  var pageNum = root.querySelector('.flipbook-page-num');

  function pageUrl(n) {
    return '/images/brahmi/page-' + (n < 10 ? '0' : '') + n + '.jpg';
  }

  function setPage(el, n, side) {
    if (!el) return;
    if (n >= 1 && n <= totalPages) {
      el.style.backgroundImage = 'url(' + pageUrl(n) + ')';
      el.style.display = '';
    } else {
      el.style.backgroundImage = 'none';
      el.style.display = 'none';
    }
    var w = el.querySelector('.' + side) || el;
    w.style.backgroundImage = el.style.backgroundImage;
  }

  function getOrMake(layer) {
    var el = viewport.querySelector('.flipbook-sheet-' + layer);
    if (!el) {
      el = document.createElement('div');
      el.className = 'flipbook-sheet flipbook-sheet-' + layer;
      el.innerHTML = '<div class="flipbook-page flipbook-page-left"></div><div class="flipbook-page flipbook-page-right"></div>';
      viewport.appendChild(el);
    }
    return el;
  }

  function render() {
    var cur = getOrMake('current');
    var nxt = getOrMake('next');
    var leftCur = cur.children[0];
    var rightCur = cur.children[1];
    var leftNxt = nxt.children[0];
    var rightNxt = nxt.children[1];

    setPage(leftCur, curPage, 'flipbook-page-left');
    setPage(rightCur, curPage + 1, 'flipbook-page-right');
    setPage(leftNxt, curPage + 2, 'flipbook-page-left');
    setPage(rightNxt, curPage + 3, 'flipbook-page-right');

    pageNum.textContent = curPage + '\u2013' + Math.min(curPage + 1, totalPages) + ' / ' + totalPages;
    prevBtn.disabled = curPage <= 1;
    nextBtn.disabled = curPage + 2 >= totalPages;
  }

  function flipForward() {
    if (flipping || curPage + 2 >= totalPages) return;
    flipping = true;

    var cur = viewport.querySelector('.flipbook-sheet-current');
    var nxt = viewport.querySelector('.flipbook-sheet-next');

    var flipEl = document.createElement('div');
    flipEl.className = 'flipbook-flip flipbook-flip-forward';
    flipEl.style.backgroundImage = 'url(' + pageUrl(curPage + 1) + ')';
    viewport.appendChild(flipEl);

    curPage += 2;
    render();

    flipEl.addEventListener('animationend', function(){
      flipEl.remove();
      flipping = false;
    }, {once: true});
  }

  function flipBackward() {
    if (flipping || curPage <= 1) return;
    flipping = true;

    var flipEl = document.createElement('div');
    flipEl.className = 'flipbook-flip flipbook-flip-backward';
    flipEl.style.backgroundImage = 'url(' + pageUrl(curPage - 1) + ')';
    viewport.appendChild(flipEl);

    curPage -= 2;
    render();

    flipEl.addEventListener('animationend', function(){
      flipEl.remove();
      flipping = false;
    }, {once: true});
  }

  nextBtn.addEventListener('click', flipForward);
  prevBtn.addEventListener('click', flipBackward);
  viewport.addEventListener('click', function(e){
    if (flipping) return;
    var r = viewport.getBoundingClientRect();
    if ((e.clientX - r.left) > r.width / 2) flipForward();
    else flipBackward();
  });

  render();
})();
