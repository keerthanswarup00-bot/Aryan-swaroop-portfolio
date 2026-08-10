/* ============================================================
   Site Search — inline panel + ⌘K modal (index.html only).
   Vanilla port of the React "SearchModal" command palette.
   Zero deps, CSP-clean (no inline handlers — addEventListener only).
   ============================================================ */
(function () {
  if (window.__siteSearchLoaded) return;
  window.__siteSearchLoaded = true;

  document.documentElement.classList.add('js');

  /* ------------------------------------------------------------
     Data — every searchable thing on the site.
     section = category used by the "I'm looking for…" chips.
     icon    = name of the inline SVG below.
     ext     = if true, link opens in a new tab.
     ============================================================ */
  var ITEMS = [
    /* Pages */
    { name: 'Home', meta: 'Overview & selected work', href: '/', section: 'Pages', icon: 'home' },
    { name: 'About', meta: 'Bio, experience & roles', href: '/about', section: 'Pages', icon: 'user' },
    { name: 'Real Estate', meta: '4 launches — identity, 3D, film, campaign', href: '/real-estate', section: 'Pages', icon: 'building' },
    { name: 'Lifestyle', meta: 'Identity, packaging & campaign work', href: '/lifestyle', section: 'Pages', icon: 'cup' },
    { name: 'Builds', meta: 'Web design, products & experiments', href: '/builds', section: 'Pages', icon: 'code' },
    { name: 'Tools', meta: 'Capabilities & utilities', href: '/tools', section: 'Pages', icon: 'tool' },
    { name: 'Playground', meta: 'Motion, renders & experiments', href: '/playground', section: 'Pages', icon: 'spark' },
    { name: 'Changelog', meta: 'Site updates & release notes', href: '/changelog', section: 'Pages', icon: 'list' },
    /* Game */
    { name: 'Catch the BMTC', meta: 'Endless runner game', href: '/#game', section: 'Game', icon: 'game' },
    /* Case studies */
    { name: 'Brahmi Coffee Roasters', meta: 'Identity, packaging & brand system', href: '/work/brahmi.html', section: 'Case Studies', icon: 'cup' },
    { name: 'Paavani Properties', meta: 'Real estate branding & marketing', href: '/work/paavani-properties.html', section: 'Case Studies', icon: 'building' },
    { name: 'Isha V', meta: 'Security & facility management', href: '/lifestyle#ishav', section: 'Case Studies', icon: 'shield' },
    { name: 'Arvi Hospital', meta: 'Collateral redesign & social system', href: '/lifestyle#arvi', section: 'Case Studies', icon: 'plus' },
    { name: 'Snehaloka Cricket Academy', meta: 'Sports complex 3D visualization', href: '/lifestyle#snehaloka', section: 'Case Studies', icon: 'trophy' },
    { name: 'VR Devaiah Enclave', meta: 'Plot-finder web app', href: '/real-estate#vr-devaiah', section: 'Case Studies', icon: 'map' },
    { name: 'Sidvin Serenity', meta: 'Go-to-market print & campaign', href: '/real-estate#sidvin-serenity', section: 'Case Studies', icon: 'megaphone' },
    { name: 'Royal Farm', meta: 'Mascot-led brand identity', href: '/real-estate#royal-farm', section: 'Case Studies', icon: 'tree' },
    /* Builds */
    { name: 'IronLog', meta: 'AI workout platform', href: 'https://workout-tracker-virid-kappa.vercel.app', section: 'Builds', icon: 'code', ext: true },
    { name: 'AlbumFlow', meta: 'Photographer SaaS', href: 'https://albumflow-seven.vercel.app', section: 'Builds', icon: 'code', ext: true },
    { name: 'Selixo', meta: 'Wedding photography SaaS', href: '/builds', section: 'Builds', icon: 'code' },
    { name: 'Fitness Guide', meta: 'Fitness & wellness guide', href: 'https://aryan-guide.vercel.app', section: 'Builds', icon: 'code', ext: true },
    { name: 'Property Image Optimizer', meta: 'Real estate image tool', href: 'https://property-image-optimizer.vercel.app', section: 'Builds', icon: 'code', ext: true },
    { name: 'Weekend Planner', meta: 'Bangalore spot finder', href: 'https://bangalore-gamma.vercel.app', section: 'Builds', icon: 'code', ext: true }
  ];

  var SECTIONS = ['Pages', 'Case Studies', 'Builds', 'Game'];

  var ACTIONS = [
    { label: 'Play Catch the BMTC', icon: 'game', href: '/#game' },
    { label: 'Download Resume', icon: 'download', href: '/Aryan_Swaroop_Resume.pdf' },
    { label: 'Realtor\u2019s Edge Playbook', icon: 'book', href: '/Realtors_Edge_Playbook.pdf' }
  ];

  var FILES = [
    { name: 'Resume', ext: '.pdf', href: '/Aryan_Swaroop_Resume.pdf' },
    { name: 'Realtor\u2019s Edge Playbook', ext: '.pdf', href: '/Realtors_Edge_Playbook.pdf' }
  ];

  /* ------------------------------------------------------------
     Icons — small stroke SVGs inlined via JS (no icon lib).
     ============================================================ */
  var ICONS = {
    home: '<path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.5V21h14V9.5" />',
    user: '<circle cx="12" cy="8" r="4" /><path d="M4 21c1.2-4.2 4.3-6 8-6s6.8 1.8 8 6" />',
    building: '<path d="M4 21V5l8-2v18" /><path d="M12 9l8-2v14" /><path d="M7 8h.01M7 12h.01M7 16h.01M16 11h.01M16 15h.01M16 19h.01" />',
    cup: '<path d="M6 8h12l-1 10H7L6 8Z" /><path d="M8 8a4 4 0 0 1 8 0" /><path d="M6 8H4a2 2 0 0 0 0 4h2" />',
    code: '<path d="m8 7-5 5 5 5" /><path d="m16 7 5 5-5 5" /><path d="m13 4-2 16" />',
    tool: '<path d="M14.5 6.5a3.5 3.5 0 0 0-4.7 4.4L4 16.7V20h3.3l5.8-5.8a3.5 3.5 0 0 0 4.4-4.7l-2.6 2.6-2.8-.7-.7-2.8 2.6-2.6Z" />',
    spark: '<path d="M12 3c.6 3.9 1.5 4.8 5.4 5.4-3.9.6-4.8 1.5-5.4 5.4-.6-3.9-1.5-4.8-5.4-5.4C9.9 7.8 10.8 6.9 12 3Z" /><path d="M19 15c.3 2 1 2.7 3 3-2 .3-2.7 1-3 3-.3-2-1-2.7-3-3 2-.3 2.7-1 3-3Z" />',
    list: '<path d="M8 6h13M8 12h13M8 18h13" /><path d="M3 6h.01M3 12h.01M3 18h.01" />',
    game: '<path d="M7 7h10a5 5 0 0 1 4.9 5.8l-.8 4.5a2 2 0 0 1-3.6.9L15.5 16h-7l-2 2.2a2 2 0 0 1-3.6-.9l-.8-4.5A5 5 0 0 1 7 7Z" /><circle cx="10" cy="11" r="1" /><circle cx="14" cy="11" r="1" />',
    shield: '<path d="M12 3 5 5.5V11c0 4.5 3 8 7 9 4-1 7-4.5 7-9V5.5L12 3Z" /><path d="m9 11 2 2 4-4" />',
    plus: '<path d="M12 5v14M5 12h14" />',
    trophy: '<path d="M8 4h8v4a4 4 0 0 1-8 0V4Z" /><path d="M8 6H5a2 2 0 0 0 2 4h3M16 6h3a2 2 0 0 1-2 4h-3" /><path d="M12 12v5M9 21h6M10 17h4" />',
    map: '<path d="M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11Z" /><circle cx="12" cy="10" r="2.5" />',
    megaphone: '<path d="M3 10v4M4 9l13-4v14L4 15" /><path d="M17 9a3 3 0 0 1 0 6" /><path d="M7 15v3h3l-.5-3" />',
    tree: '<path d="M12 3 6 12h3l-4 7h14l-4-7h3L12 3Z" /><path d="M12 12v9" />',
    search: '<circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />',
    download: '<path d="M12 3v12" /><path d="m7 10 5 5 5-5" /><path d="M4 21h16" />',
    book: '<path d="M4 4h6a3 3 0 0 1 3 3v13a3 3 0 0 0-3-3H4V4Z" /><path d="M20 4h-6a3 3 0 0 0-3 3v13a3 3 0 0 1 3-3h6V4Z" />',
    x: '<path d="M6 6l12 12M18 6 6 18" />',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6" />',
    share: '<path d="M12 4v10" /><path d="m8 7 4-4 4 4" /><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7" />'
  };

  function svg(name, cls) {
    return (
      '<svg class="' + cls + '" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' +
      (ICONS[name] || ICONS.arrow) +
      '</svg>'
    );
  }

  function esc(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  /* ------------------------------------------------------------
     Panel builder — returns the full search panel DOM.
     ============================================================ */
  function buildPanel() {
    var panel = document.createElement('div');
    panel.className = 'search-panel';
    panel.setAttribute('role', 'search');
    panel.setAttribute('aria-label', 'Search the portfolio');

    panel.innerHTML =
      '<div class="search-bar">' +
        svg('search', 'search-bar-icon') +
        '<input type="text" class="search-input" placeholder="Search pages, case studies, builds\u2026" aria-label="Search" autocomplete="off" spellcheck="false">' +
        '<span class="search-bar-hint" aria-hidden="true"><span>\u2318</span>K</span>' +
      '</div>' +
      '<div class="search-body">' +
        '<div class="search-chips">' +
          '<span class="search-chips-label">I&apos;m looking for\u2026</span>' +
          '<div class="search-chips-row"></div>' +
        '</div>' +
        '<div class="search-results">' +
          '<div class="search-results-head">Last search&nbsp;&nbsp;<span class="search-results-count">0</span></div>' +
          '<ul class="search-results-list"></ul>' +
        '</div>' +
        '<div class="search-actions">' +
          '<span class="search-section-label">Quick actions</span>' +
        '</div>' +
        '<div class="search-files">' +
          '<span class="search-section-label">Files&nbsp;&nbsp;<span class="search-results-count">' + FILES.length + '</span></span>' +
        '</div>' +
      '</div>';

    /* Chips */
    var chipsRow = panel.querySelector('.search-chips-row');
    SECTIONS.forEach(function (sec, i) {
      var chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'search-chip';
      chip.setAttribute('aria-pressed', 'false');
      chip.textContent = sec;
      chip.addEventListener('click', function () {
        var active = chip.getAttribute('aria-pressed') === 'true';
        Array.prototype.forEach.call(chipsRow.children, function (c) {
          c.setAttribute('aria-pressed', 'false');
        });
        if (!active) chip.setAttribute('aria-pressed', 'true');
        filter();
        input.focus();
      });
      chipsRow.appendChild(chip);
    });

    /* Quick actions */
    var actionsBox = panel.querySelector('.search-actions');
    ACTIONS.forEach(function (act) {
      var a = document.createElement('a');
      a.className = 'search-action';
      a.href = act.href;
      a.innerHTML = '<span class="search-action-icon">' + svg(act.icon, '') + '</span><span class="search-action-label">' + esc(act.label) + '</span>';
      a.addEventListener('click', function () {
        if (modalOpen) closeModal();
      });
      actionsBox.appendChild(a);
    });

    /* Files */
    var filesBox = panel.querySelector('.search-files');
    FILES.forEach(function (file) {
      var row = document.createElement('div');
      row.className = 'search-file';
      row.innerHTML =
        '<span class="search-file-icon">' + svg('download', '') + '</span>' +
        '<span class="search-file-name">' + esc(file.name) + '<span class="search-file-ext">' + esc(file.ext) + '</span></span>';
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'search-file-share';
      btn.setAttribute('aria-label', 'Download ' + file.name);
      btn.innerHTML = svg('share', '') + '<span>Download</span>';
      btn.addEventListener('click', function () {
        var a = document.createElement('a');
        a.href = file.href;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        if (modalOpen) closeModal();
      });
      row.appendChild(btn);
      filesBox.appendChild(row);
    });

    /* Results render + keyboard nav live on this panel */
    var input = panel.querySelector('.search-input');
    var listEl = panel.querySelector('.search-results-list');
    var countEl = panel.querySelector('.search-results-count');
    var activeSection = null;
    var selectedIndex = -1;

    function activeChip() {
      var chips = chipsRow.querySelectorAll('.search-chip[aria-pressed="true"]');
      return chips.length ? chips[0].textContent : null;
    }

    function currentItems() {
      var q = input.value.trim().toLowerCase();
      activeSection = activeChip();
      return ITEMS.filter(function (item) {
        var hay = (item.name + ' ' + item.meta + ' ' + item.section).toLowerCase();
        if (activeSection && item.section !== activeSection) return false;
        if (q && hay.indexOf(q) === -1) return false;
        return true;
      });
    }

    function render() {
      var items = currentItems();
      countEl.textContent = items.length;
      listEl.innerHTML = '';
      selectedIndex = -1;

      if (!items.length) {
        var empty = document.createElement('li');
        empty.className = 'search-empty';
        empty.textContent = activeSection
          ? 'Nothing found under ' + activeSection + ' \u2014 try a different search.'
          : 'Nothing found \u2014 try a different search.';
        listEl.appendChild(empty);
        return;
      }

      items.forEach(function (item, i) {
        var li = document.createElement('li');
        li.className = 'search-result';
        var a = document.createElement('a');
        a.className = 'search-result-link';
        a.href = item.href;
        if (item.ext) a.target = '_blank';
        if (item.ext) a.rel = 'noopener noreferrer';
        a.setAttribute('data-index', String(i));
        a.innerHTML =
          '<span class="search-result-icon">' + svg(item.icon, '') + '</span>' +
          '<span class="search-result-name">' + esc(item.name) + '</span>' +
          (item.meta ? '<span class="search-result-meta">' + esc(item.meta) + '</span>' : '') +
          '<span class="search-result-arrow" aria-hidden="true">&rarr;</span>';
        a.addEventListener('click', function () {
          if (modalOpen) closeModal();
        });
        li.appendChild(a);
        listEl.appendChild(li);
      });
    }

    function selectIndex(n) {
      var links = listEl.querySelectorAll('.search-result-link');
      if (!links.length) return;
      if (n < 0) n = links.length - 1;
      if (n >= links.length) n = 0;
      selectedIndex = n;
      Array.prototype.forEach.call(links, function (l, i) {
        if (i === n) l.setAttribute('aria-selected', 'true');
        else l.removeAttribute('aria-selected');
      });
      links[n].scrollIntoView({ block: 'nearest' });
    }

    input.addEventListener('input', function () {
      setActive(true);
      render();
    });

    function setActive(active) {
      panel.classList.toggle('is-active', active);
    }

    input.addEventListener('focus', function () {
      setActive(true);
    });

    document.addEventListener('mousedown', function (e) {
      if (panel.classList.contains('is-active') && !panel.contains(e.target)) {
        setActive(false);
      }
    });

    panel.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        if (modalOpen) {
          e.preventDefault();
          closeModal();
        } else {
          setActive(false);
          input.blur();
        }
      }
    });

    input.addEventListener('keydown', function (e) {
      var links = listEl.querySelectorAll('.search-result-link');
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        selectIndex(selectedIndex + 1);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        selectIndex(selectedIndex - 1);
      } else if (e.key === 'Enter') {
        if (selectedIndex >= 0 && selectedIndex < links.length) {
          e.preventDefault();
          links[selectedIndex].click();
        }
      }
    });

    function filter() {
      render();
    }

    render();
    return { panel: panel, input: input, filter: filter };
  }

  /* ------------------------------------------------------------
     Modal (⌘K / Ctrl+K)
     ============================================================ */
  var overlay = null;
  var modalOpen = false;
  var lastFocused = null;
  var modal = null;

  function closeModal() {
    if (!modalOpen) return;
    modalOpen = false;
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }

  function openModal() {
    if (modalOpen) return;
    if (!modal) {
      overlay = document.createElement('div');
      overlay.className = 'search-overlay';
      overlay.setAttribute('aria-hidden', 'true');
      var backdrop = document.createElement('div');
      backdrop.className = 'search-overlay-backdrop';
      modal = buildPanel();
      overlay.appendChild(backdrop);
      overlay.appendChild(modal.panel);
      document.body.appendChild(overlay);

      backdrop.addEventListener('click', closeModal);
      overlay.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeModal();
      });
    }
    lastFocused = document.activeElement;
    modalOpen = true;
    overlay.classList.add('open');
    overlay.removeAttribute('aria-hidden');
    modal.input.focus();
    modal.input.select();
  }

  document.addEventListener('keydown', function (e) {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (modalOpen) closeModal();
      else openModal();
    }
  });

  /* ------------------------------------------------------------
     Inline panel — replaces the static list when JS runs.
     ============================================================ */
  var mount = document.querySelector('#site-search');
  if (mount) {
    var staticList = mount.querySelector('.search-static-list');
    if (staticList) staticList.remove();
    var inline = buildPanel();
    mount.querySelector('.wrap').appendChild(inline.panel);

    animateSection(mount, inline.panel);
  }
})();

function animateSection(section, panel) {
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var head = section.querySelector('.site-search-head');
  if (reduced || !head || !window.gsap || !window.ScrollTrigger) return;

  gsap.registerPlugin(ScrollTrigger);

  gsap.timeline({
    scrollTrigger: { trigger: section, start: 'top 72%', once: true }
  })
    .fromTo(head, { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power2.out' })
    .fromTo(panel, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power2.out' }, '-=0.4')
    .fromTo(panel, { y: 0 }, { y: -6, duration: 2.6, ease: 'sine.inOut', yoyo: true, repeat: -1 });
}
