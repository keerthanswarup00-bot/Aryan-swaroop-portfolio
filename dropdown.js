(function() {
  var dd = document.getElementById('designDropdown');
  if (!dd || dd.querySelector('.mega-menu-root')) return;

  dd.insertAdjacentHTML('beforeend',
    '<div class="mega-menu-root" data-theme="dark">' +
      '<div class="mega-menu">' +
        '<div class="mega-row">' +
        '<div class="mega-left">' +
          '<h4 class="mega-heading">Featured Work</h4>' +
          '<a href="/real-estate" class="mega-project" data-project="real-estate">' +
            '<div class="mega-thumb">' +
              '<picture>' +
                '<source srcset="/images/mega-re-2.avif" type="image/avif">' +
                '<source srcset="/images/mega-re-2.webp" type="image/webp">' +
                '<img src="/images/mega-re-2.png" alt="Real estate brand identity thumbnail" width="800" height="800" loading="lazy" decoding="async">' +
              '</picture>' +
            '</div>' +
            '<div class="mega-info"><span class="mega-title">Real Estate</span><span class="mega-duration">5 min</span></div>' +
          '</a>' +
          '<a href="/lifestyle" class="mega-project" data-project="lifestyle">' +
            '<div class="mega-thumb">' +
              '<picture>' +
                '<source srcset="/images/mega-lifestyle-2.avif" type="image/avif">' +
                '<source srcset="/images/mega-lifestyle-2.webp" type="image/webp">' +
                '<img src="/images/mega-lifestyle-2.png" alt="Lifestyle brand identity thumbnail" width="800" height="800" loading="lazy" decoding="async">' +
              '</picture>' +
            '</div>' +
            '<div class="mega-info"><span class="mega-title">Lifestyle</span><span class="mega-duration">5 min</span></div>' +
          '</a>' +
          '<a href="/tools" class="mega-project" data-project="tools">' +
            '<div class="mega-thumb">' +
              '<picture>' +
                '<source srcset="/images/mega-builds-2.avif" type="image/avif">' +
                '<source srcset="/images/mega-builds-2.webp" type="image/webp">' +
                '<img src="/images/mega-builds-2.png" alt="Web product builds thumbnail" width="800" height="800" loading="lazy" decoding="async">' +
              '</picture>' +
            '</div>' +
            '<div class="mega-info"><span class="mega-title">Tools</span><span class="mega-duration">2 min</span></div>' +
          '</a>' +
        '</div>' +
        '<div class="mega-right">' +
          '<a href="/playground" class="mega-preview-card">' +
            '<picture>' +
              '<source srcset="/images/playground-preview.avif" type="image/avif">' +
              '<source srcset="/images/playground-preview.webp" type="image/webp">' +
              '<img src="/images/playground-preview.png" alt="Playground \u2014 motion and renders preview" width="600" height="251" loading="lazy" decoding="async">' +
            '</picture>' +
            '<span class="mega-preview-text">Playground \u2192</span>' +
          '</a>' +
          '<a href="/builds" class="mega-preview-card">' +
            '<picture>' +
              '<source srcset="/images/build-preview.avif" type="image/avif">' +
              '<source srcset="/images/build-preview.webp" type="image/webp">' +
              '<img src="/images/build-preview.png" alt="Build \u2014 web products preview" width="600" height="251" loading="lazy" decoding="async">' +
            '</picture>' +
            '<span class="mega-preview-text">Build \u2192</span>' +
          '</a>' +
        '</div>' +
      '</div>' +
      '</div>' +
      '<div class="mega-menu-case-studies">' +
        '<h4 class="mega-cs-heading">Case Studies</h4>' +
        '<div class="mega-cs-grid">' +
          '<a href="/work/brahmi" class="mega-cs-card">' +
            '<div class="mega-cs-card-img">' +
              '<picture>' +
                '<source srcset="/images/brahmi-pourshot.avif" type="image/avif">' +
                '<source srcset="/images/brahmi-pourshot.webp" type="image/webp">' +
                '<img src="/images/brahmi-pourshot.jpg" alt="Brahmi" width="800" height="1000" loading="lazy" decoding="async">' +
              '</picture>' +
            '</div>' +
            '<div class="mega-cs-card-info">' +
              '<span class="mega-cs-card-title">Brahmi</span>' +
              '<span class="mega-cs-card-sub">Brand Identity &amp; Packaging</span>' +
            '</div>' +
          '</a>' +
          '<a href="/work/paavani-properties" class="mega-cs-card">' +
            '<div class="mega-cs-card-img">' +
              '<picture>' +
                '<source srcset="/images/mega-paavani.avif" type="image/avif">' +
                '<source srcset="/images/mega-paavani.webp" type="image/webp">' +
                '<img src="/images/mega-paavani.png" alt="Paavani Properties" width="144" height="160" loading="lazy" decoding="async">' +
              '</picture>' +
            '</div>' +
            '<div class="mega-cs-card-info">' +
              '<span class="mega-cs-card-title">Paavani Properties</span>' +
              '<span class="mega-cs-card-sub">End-to-End Brand System</span>' +
            '</div>' +
          '</a>' +
          '<a href="/playground" class="mega-cs-card">' +
            '<div class="mega-cs-card-img">' +
              '<picture>' +
                '<source srcset="/images/playground-preview.avif" type="image/avif">' +
                '<source srcset="/images/playground-preview.webp" type="image/webp">' +
                '<img src="/images/playground-preview.png" alt="Playground" width="600" height="251" loading="lazy" decoding="async">' +
              '</picture>' +
            '</div>' +
            '<div class="mega-cs-card-info">' +
              '<span class="mega-cs-card-title">Playground</span>' +
              '<span class="mega-cs-card-sub">Creative Experiments</span>' +
            '</div>' +
          '</a>' +
        '</div>' +
      '</div>' +
    '</div>'
  );
})();
