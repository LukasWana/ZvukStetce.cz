/* ========================================
   MENU LOADER - NAČÍTÁNÍ MENU DO STRÁNEK
   ======================================== */

// Funkce pro načtení menu
function loadMenu() {
  console.log('MenuLoader: Starting to load menu...');

  // Detekce jazyka z URL
  const isEnglish = window.location.pathname.includes('/en/');

  console.log('MenuLoader: Language detected:', isEnglish ? 'English' : 'Czech');

  // Inline menu HTML místo fetch
  const menuHTML = isEnglish ? getEnglishMenuHTML() : getCzechMenuHTML();

  console.log('MenuLoader: Menu HTML generated, length:', menuHTML.length);

  // Vložení menu do body
  document.body.insertAdjacentHTML('afterbegin', menuHTML);
  console.log('MenuLoader: Menu inserted into DOM');

  // Inicializace hamburger menu - počkat až bude funkce dostupná
  if (typeof initHamburgerMenu === 'function') {
    console.log('MenuLoader: initHamburgerMenu found, calling...');
    initHamburgerMenu();
  } else {
    console.log('MenuLoader: initHamburgerMenu not found, waiting...');
    // Počkat až se script.js načte
    const checkInit = setInterval(() => {
      if (typeof initHamburgerMenu === 'function') {
        console.log('MenuLoader: initHamburgerMenu found after waiting, calling...');
        initHamburgerMenu();
        clearInterval(checkInit);
      }
    }, 50);

    // Timeout po 5 sekundách
    setTimeout(() => {
      clearInterval(checkInit);
      console.log('MenuLoader: Timeout waiting for initHamburgerMenu');
    }, 5000);
  }
}

// České menu HTML
function getCzechMenuHTML() {
  return `
<div class="hamburger-menu">
  <div class="language-switcher">
    <a
      href="en/index.html"
      class="lang-flag"
      data-lang="en"
      title="Switch to English"
    >
      <img src="img/001-united-kingdom.svg" height="24" alt="English" />
    </a>
  </div>
  <button class="hamburger" id="hamburger">
    <span></span>
    <span></span>
    <span></span>
  </button>
  <nav class="menu-overlay" id="menuOverlay">
    <ul>
      <li><a href="index.html">O mě</a></li>
      <li><a href="obchod.html">Obchod</a></li>
      <li><a href="galerie.html">Galerie</a></li>
      <li><a href="skola.html">Škola Iroha</a></li>
      <li><a href="kontakt.html">Kontakt</a></li>
      <li class="menu-social">
        <a class="social email-icon" href="">
          <img src="img/mail_black.svg" height="30" alt="Email" />
        </a>
        <a
          target="_blank"
          class="social"
          href="https://facebook.com/KurzyJaponskeKaligrafie"
        >
          <img src="img/fb_black.svg" height="30" alt="Facebook" />
        </a>
        <a
          target="_blank"
          class="social"
          href="https://instagram.com/petra.vitaskova"
        >
          <img src="img/ig_black.svg" height="30" alt="Instagram" />
        </a>
      </li>
      <li><a href="#" class="menu-close">×</a></li>
    </ul>
  </nav>
</div>`;
}

// Anglické menu HTML
function getEnglishMenuHTML() {
  return `
<div class="hamburger-menu">
  <div class="language-switcher">
    <a
      href="../index.html"
      class="lang-flag"
      data-lang="cs"
      title="Switch to Czech"
    >
      <img src="../img/002-czech-republic.svg" height="24" alt="Czech" />
    </a>
  </div>
  <button class="hamburger" id="hamburger">
    <span></span>
    <span></span>
    <span></span>
  </button>
  <nav class="menu-overlay" id="menuOverlay">
    <ul>
      <li><a href="../index.html">About Me</a></li>
      <li><a href="../obchod.html">Shop</a></li>
      <li><a href="../galerie.html">Gallery</a></li>
      <li><a href="../skola.html">Iroha School</a></li>
      <li><a href="../kontakt.html">Contact</a></li>
      <li class="menu-social">
        <a class="social email-icon" href="">
          <img src="../img/mail_black.svg" height="30" alt="Email" />
        </a>
        <a
          target="_blank"
          class="social"
          href="https://facebook.com/KurzyJaponskeKaligrafie"
        >
          <img src="../img/fb_black.svg" height="30" alt="Facebook" />
        </a>
        <a
          target="_blank"
          class="social"
          href="https://instagram.com/petra.vitaskova"
        >
          <img src="../img/ig_black.svg" height="30" alt="Instagram" />
        </a>
      </li>
      <li><a href="#" class="menu-close">×</a></li>
    </ul>
  </nav>
</div>`;
}

// Inicializace hamburger menu
function initHamburgerMenu() {
  const hamburger = document.getElementById('hamburger');
  const menuOverlay = document.getElementById('menuOverlay');

  if (hamburger && menuOverlay) {
    hamburger.addEventListener('click', function() {
      hamburger.classList.toggle('active');
      menuOverlay.classList.toggle('active');
    });

    // Zavřít menu při kliknutí na navigační odkazy
    const menuLinks = menuOverlay.querySelectorAll('a:not(.social):not(.email-text)');
    menuLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        if (link.classList.contains('menu-close')) {
          e.preventDefault();
        }
        hamburger.classList.remove('active');
        menuOverlay.classList.remove('active');
      });
    });

    // Zavřít menu při kliknutí mimo menu
    document.addEventListener('click', function(event) {
      // Zkontrolovat, jestli je menu otevřené
      if (menuOverlay.classList.contains('active')) {
        // Zkontrolovat, jestli kliknutí bylo mimo menu a hamburger tlačítko
        const clickedInsideMenu = menuOverlay.contains(event.target);
        const clickedOnHamburger = hamburger.contains(event.target) || event.target === hamburger;

        // Pokud kliknutí bylo mimo menu a mimo hamburger, zavřít menu
        if (!clickedInsideMenu && !clickedOnHamburger) {
          hamburger.classList.remove('active');
          menuOverlay.classList.remove('active');
        }
      }
    });

    // Zavřít menu pomocí Escape klávesy
    document.addEventListener('keydown', function(event) {
      if (event.key === 'Escape' && menuOverlay.classList.contains('active')) {
        hamburger.classList.remove('active');
        menuOverlay.classList.remove('active');
      }
    });
  }
}

// Načtení menu při načtení stránky
document.addEventListener('DOMContentLoaded', function() {
  console.log('MenuLoader: DOM loaded, starting menu load...');

  // Počkat déle, aby se ostatní skripty mohly inicializovat
  setTimeout(function() {
    console.log('MenuLoader: Timeout reached, loading menu...');
    loadMenu();
  }, 300);
});
