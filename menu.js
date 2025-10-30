// Vloží menu bez fetch (funguje i při otevření přes file://)
(function() {
  function getClosedRightValue(overlay) {
    try {
      var cs = getComputedStyle(overlay);
      if (cs.width && cs.width.indexOf('%') !== -1) return '-100%';
      var px = overlay.getBoundingClientRect().width || 300;
      return '-' + Math.ceil(px) + 'px';
    } catch(_) {
      return '-300px';
    }
  }

  function defineGlobalToggle() {
    window.__toggleMenu = function() {
      var btn = document.getElementById('hamburger');
      var overlay = document.getElementById('menuOverlay');
      if (!btn || !overlay) return;
      btn.classList.toggle('active');
      overlay.classList.toggle('active');
      overlay.style.right = overlay.classList.contains('active') ? '0' : getClosedRightValue(overlay);
    };
  }
  function isEnglish() {
    return window.location.pathname.includes('/en/');
  }

  function getCurrentPage() {
    var path = window.location.pathname;
    var file = path.split('/').pop();
    return file && file.length ? file : 'index.html';
  }

  function getMenuHtml() {
    var currentPage = getCurrentPage();
    if (isEnglish()) {
      return (
        '<div class="hamburger-menu">\n' +
        '  <div class="language-switcher">\n' +
        '    <a\n' +
        '      href="../' + currentPage + '"\n' +
        '      class="lang-flag"\n' +
        '      data-lang="cs"\n' +
        '      title="Přepnout do češtiny"\n' +
        '    >\n' +
        '      <img src="../img/002-czech-republic.svg" height="24" alt="Čeština" />\n' +
        '    </a>\n' +
        '  </div>\n' +
        '  <button class="hamburger" id="hamburger">\n' +
        '    <span></span>\n' +
        '    <span></span>\n' +
        '    <span></span>\n' +
        '  </button>\n' +
        '  <nav class="menu-overlay" id="menuOverlay">\n' +
        '    <a href="#" class="menu-close">×</a>\n' +
        '    <ul>\n' +
        '      <li><a href="index.html">About Me</a></li>\n' +
        '      <li><a href="obchod.html">Shop</a></li>\n' +
        '      <li><a href="vystavy.html">Exhibitions</a></li>\n' +
        '      <li><a href="galerie.html">Gallery</a></li>\n' +
        '      <li><a href="skola.html">Iroha school</a></li>\n' +
        '      <li><a href="kontakt.html">Contact</a></li>\n' +
        '      <li class="menu-social">\n' +
        '        <a class="social email-icon" href="">\n' +
        '          <img src="../img/mail_black.svg" height="30" alt="Email" />\n' +
        '        </a>\n' +
        '        <a\n' +
        '          target="_blank"\n' +
        '          class="social"\n' +
        '          href="https://facebook.com/KurzyJaponskeKaligrafie"\n' +
        '        >\n' +
        '          <img src="../img/fb_black.svg" height="30" alt="Facebook" />\n' +
        '        </a>\n' +
        '        <a\n' +
        '          target="_blank"\n' +
        '          class="social"\n' +
        '          href="https://instagram.com/petra.vitaskova"\n' +
        '        >\n' +
        '          <img src="../img/ig_black.svg" height="30" alt="Instagram" />\n' +
        '        </a>\n' +
        '      </li>\n' +
        '    </ul>\n' +
        '  </nav>\n' +
        '</div>'
      );
    }

    // Czech menu
    return (
      '<div class="hamburger-menu">\n' +
      '  <div class="language-switcher">\n' +
      '    <a\n' +
      '      href="en/' + currentPage + '"\n' +
      '      class="lang-flag"\n' +
      '      data-lang="en"\n' +
      '      title="Switch to English"\n' +
      '    >\n' +
      '      <img src="img/001-united-kingdom.svg" height="24" alt="English" />\n' +
      '    </a>\n' +
      '  </div>\n' +
      '  <button class="hamburger" id="hamburger">\n' +
      '    <span></span>\n' +
      '    <span></span>\n' +
      '    <span></span>\n' +
      '  </button>\n' +
      '  <nav class="menu-overlay" id="menuOverlay">\n' +
      '    <a href="#" class="menu-close">×</a>\n' +
      '    <ul>\n' +
      '      <li><a href="index.html">O mě</a></li>\n' +
      '      <li><a href="obchod.html">Obchod</a></li>\n' +
      '      <li><a href="vystavy.html">Výstavy</a></li>\n' +
      '      <li><a href="galerie.html">Galerie</a></li>\n' +
      '      <li><a href="skola.html">Škola Iroha</a></li>\n' +
      '      <li><a href="kontakt.html">Kontakt</a></li>\n' +
      '      <li class="menu-social">\n' +
      '        <a class="social email-icon" href="">\n' +
      '          <img src="img/mail_black.svg" height="30" alt="Email" />\n' +
      '        </a>\n' +
      '        <a\n' +
      '          target="_blank"\n' +
      '          class="social"\n' +
      '          href="https://facebook.com/KurzyJaponskeKaligrafie"\n' +
      '        >\n' +
      '          <img src="img/fb_black.svg" height="30" alt="Facebook" />\n' +
      '        </a>\n' +
      '        <a\n' +
      '          target="_blank"\n' +
      '          class="social"\n' +
      '          href="https://instagram.com/petra.vitaskova"\n' +
      '        >\n' +
      '          <img src="img/ig_black.svg" height="30" alt="Instagram" />\n' +
      '        </a>\n' +
      '      </li>\n' +
      '    </ul>\n' +
      '  </nav>\n' +
      '</div>'
    );
  }

  function injectMenu() {
    var root = document.getElementById('menu-root');
    if (!root) {
      root = document.createElement('div');
      root.id = 'menu-root';
      document.body.appendChild(root);
    }
    root.innerHTML = getMenuHtml();
    defineGlobalToggle();
    var hb = document.getElementById('hamburger');
    if (hb) {
      hb.addEventListener('click', window.__toggleMenu, { once: false });
    }
    // Vždy navázat zavírání na křížek i odkazy (resetuje i inline right)
    var overlay = document.getElementById('menuOverlay');
    if (overlay) {
      var closeBtn = overlay.querySelector('a.menu-close');
      if (closeBtn) {
        closeBtn.addEventListener('click', function(e) {
          e.preventDefault();
          overlay.classList.remove('active');
          var hb2 = document.getElementById('hamburger');
          if (hb2) hb2.classList.remove('active');
          overlay.style.right = getClosedRightValue(overlay);
          overlay.style.opacity = '1';
          overlay.style.visibility = 'visible';
        });
      }
      var links = overlay.querySelectorAll('a:not(.social):not(.email-text)');
      links.forEach(function(link) {
        link.addEventListener('click', function() {
          overlay.classList.remove('active');
          var hb3 = document.getElementById('hamburger');
          if (hb3) hb3.classList.remove('active');
          overlay.style.right = getClosedRightValue(overlay);
        });
      });
    }
    // Inicializace hamburgeru (přes hlavní funkci, případně lokální fallback)
    if (typeof initHamburgerMenu === 'function') {
      initHamburgerMenu();
    } else {
      setupLocalMenuHandlers();
      // Pro jistotu zkusit znovu po načtení window, kdyby se script.js teprve načetl
      window.addEventListener('load', function() {
        if (typeof initHamburgerMenu === 'function') {
          initHamburgerMenu();
        }
      });
      // A ještě jednou po krátkém zpoždění pro případ pozdějšího renderu
      setTimeout(setupLocalMenuHandlers, 100);
    }
  }

  function setupLocalMenuHandlers() {
    var hamburger = document.getElementById('hamburger');
    var menuOverlay = document.getElementById('menuOverlay');
    if (!hamburger || !menuOverlay) return;

    // Zabránit duplicitám
    if (hamburger.dataset.bound === 'true') return;
    hamburger.dataset.bound = 'true';

    var toggle = function() {
      hamburger.classList.toggle('active');
      menuOverlay.classList.toggle('active');
      // Hard fallback i kdyby CSS selektor selhal
      var isActive = menuOverlay.classList.contains('active');
      menuOverlay.style.right = isActive ? '0' : getClosedRightValue(menuOverlay);
      menuOverlay.style.zIndex = '10000';
      menuOverlay.style.visibility = 'visible';
      menuOverlay.style.opacity = '1';
    };

    // Přímý onclick raději nepoužívat, aby nedocházelo k dvojkliku
    hamburger.onclick = null;
    hamburger.addEventListener('click', toggle);

    // Globální fallback (využitý i z inline onclick)
    defineGlobalToggle();

    // Zavření po kliknutí na odkazy (kromě social/email)
    var menuLinks = menuOverlay.querySelectorAll('a:not(.social):not(.email-text)');
    menuLinks.forEach(function(link) {
      link.addEventListener('click', function(e) {
        if (link.classList.contains('menu-close')) {
          e.preventDefault();
        }
        hamburger.classList.remove('active');
        menuOverlay.classList.remove('active');
      });
    });

    // Klik mimo menu
    document.addEventListener('click', function(event) {
      if (!menuOverlay.classList.contains('active')) return;
      var clickedInsideMenu = menuOverlay.contains(event.target);
      var clickedOnHamburger = hamburger.contains(event.target) || event.target === hamburger;
      if (!clickedInsideMenu && !clickedOnHamburger) {
        hamburger.classList.remove('active');
        menuOverlay.classList.remove('active');
      }
    });

    // Escape zavření
    document.addEventListener('keydown', function(event) {
      if (event.key === 'Escape' && menuOverlay.classList.contains('active')) {
        hamburger.classList.remove('active');
        menuOverlay.classList.remove('active');
      }
    });

    // Delegovaný handler odstraněn, aby nedocházelo k dvojímu přepnutí
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectMenu);
  } else {
    injectMenu();
  }
})();


