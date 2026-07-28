// Custom cursor
var cur = document.getElementById('cur');
if (cur) {
  var curSpan = cur.querySelector('span');
  window.addEventListener('mousemove', function (e) {
    cur.style.left = e.clientX + 'px';
    cur.style.top = e.clientY + 'px';
  });
  document.querySelectorAll('[data-cur]').forEach(function (el) {
    el.addEventListener('mouseenter', function () {
      cur.classList.add('grow');
      curSpan.textContent = el.getAttribute('data-cur');
    });
    el.addEventListener('mouseleave', function () {
      cur.classList.remove('grow');
      curSpan.textContent = '';
    });
  });
}

// Typewriter cycle for "Open to Work" badge
function typeCycle(el, words) {
  var wIndex = 0, cIndex = 0, deleting = false;
  function tick() {
    var word = words[wIndex];
    if (!deleting) {
      cIndex++;
      el.textContent = word.slice(0, cIndex);
      if (cIndex === word.length) {
        deleting = false;
        return setTimeout(function () { deleting = true; tick(); }, 3000);
      }
      setTimeout(tick, 55);
    } else {
      cIndex--;
      el.textContent = word.slice(0, cIndex);
      if (cIndex === 0) {
        deleting = false;
        wIndex = (wIndex + 1) % words.length;
        return setTimeout(tick, 300);
      }
      setTimeout(tick, 28);
    }
  }
  tick();
}
document.querySelectorAll('.type-cycle').forEach(function (el) {
  typeCycle(el, ['Branding', 'Logo Design', 'Packaging', '3D Walkthrough', 'Motion Design']);
});
