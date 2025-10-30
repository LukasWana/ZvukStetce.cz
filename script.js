onload = (event) => {
    let emails = Array.from(document.querySelectorAll(".email"));
    let emailIcons = Array.from(document.querySelectorAll(".email-icon"));
    const video = document.getElementById("bg-video");

    // Zajištění správného načtení videa
    if (video) {
        video.load();
        video.play().catch(function(error) {
            // silence autoplay errors in production
        });
    }

    emails.forEach(function(email) {
        create_email(email, "petra@zvukstetce.cz", "mailto:petra@zvukstetce.cz");
    })

    emailIcons.forEach(function(emailIcon) {
        emailIcon.setAttribute("href", "mailto:petra@zvukstetce.cz");
    })

    if (isMobileDevice) {
        document.body.classList.add("mobile")
        if (video) {
            addListener(video);
        }
    }
    if (!isMobileDevice) {

    }
    adjustGallery()
    initHamburgerMenu()
    initSocialHover()
    detectLanguageAndRedirect()

    // Inicializace gallery loaderu pokud existuje
    if (window.galleryLoader) {
        // Připojení k eventům pro aktualizaci jazyka
        const langFlags = document.querySelectorAll('.lang-flag');
        langFlags.forEach(function(flag) {
            flag.addEventListener('click', function() {
                const newLang = flag.dataset.lang || 'cs';
                window.galleryLoader.updateLanguage(newLang);
            });
        });
    }
};

function initHamburgerMenu() {
    const hamburger = document.getElementById('hamburger');
    const menuOverlay = document.getElementById('menuOverlay');

    if (hamburger && menuOverlay) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            menuOverlay.classList.toggle('active');
        });

        // Zavřít menu při kliknutí na navigační odkazy (ne na sociální ikony)
        const menuLinks = menuOverlay.querySelectorAll('a:not(.social):not(.email-text)');
        menuLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                // Pokud je to tlačítko zavřít, zabránit default akci
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

function initSocialHover() {
    // Najít všechny sociální odkazy
    const socialLinks = document.querySelectorAll('a.social');

    socialLinks.forEach(link => {
        const img = link.querySelector('img');
        if (img) {
            const originalSrc = img.getAttribute('src');
            let hoverSrc = '';

            // Určit hover obrázek podle původního zdroje
            if (originalSrc.includes('fb')) {
                hoverSrc = originalSrc
                    .replace('fb_black.svg', 'fb_hover.svg')
                    .replace('fb_white.svg', 'fb_hover.svg')
                    .replace('fb_black.png', 'fb_hover.svg')
                    .replace('fb.svg', 'fb_hover.svg');
            } else if (originalSrc.includes('ig')) {
                hoverSrc = originalSrc
                    .replace('ig_black.svg', 'ig_hover.svg')
                    .replace('ig_white.svg', 'ig_hover.svg')
                    .replace('ig_black.png', 'ig_hover.svg')
                    .replace('ig.svg', 'ig_hover.svg');
            } else if (originalSrc.includes('mail')) {
                hoverSrc = originalSrc
                    .replace('mail_black.svg', 'mail_hover.svg')
                    .replace('mail_white.svg', 'mail_hover.svg');
            }

            if (hoverSrc && hoverSrc !== originalSrc) {
                link.addEventListener('mouseenter', function() {
                    img.setAttribute('src', hoverSrc);
                });

                link.addEventListener('mouseleave', function() {
                    img.setAttribute('src', originalSrc);
                });
            }
        }
    });
}

function create_email(email, text, href) {
    email.innerText = text;
    email.setAttribute("href", href)
}

function addListener(element) {
    element.addEventListener("timeupdate", function () {
        slide_video(element)
    });
}

function slide_video(video) {
    // Animace odstraněny - video se nyní zobrazuje staticky
    //console.log(`Video Time: ${video.currentTime.toFixed(2)}s`);
}

function isMobileDevice() {
  return /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function adjustGallery() {
    const rowArray = Array.from(document.querySelectorAll('.gallery .row.resize'))
    rowArray.forEach(function(params) {
        let height = 0;
        let imgs = params.querySelectorAll("img");
        let img_width = 0
        let res_h = false

        imgs.forEach(function(img) {
            // Pouze pokud je obrázek načtený
            if (img.complete && img.naturalWidth > 0) {
                img_width += img.width
                if (height == 0)
                    height = img.height
                if (img.height < height) {
                    res_h = true
                    img.style.height = height+"px"
                }
            }
        })

        if (img_width > window.innerWidth) {
            let ratio = window.innerWidth / img_width
            imgs.forEach(function(img) {
                if (img.complete && img.naturalWidth > 0) {
                    let new_width = img.width * ratio
                    img.style.width = new_width+"px"
                    img.style.height = "auto"
                }
            });
        }
    })
}

// Optimalizované resize event s throttling
let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function() {
        adjustGallery();
    }, 250);
});

function detectLanguageAndRedirect() {
    // Kontrola, zda jsme na české verzi (ne v /en/ složce)
    var isEnglishVersion = window.location.pathname.includes('/en/');

    // Pokud uživatel už někdy klikl na přepínač jazyka, respektovat jeho volbu
    var userLanguageChoice = localStorage.getItem('userLanguageChoice');

    // Pokud už si uživatel vybral jazyk, neděláme nic
    if (userLanguageChoice) {
        return;
    }

    // Pouze pro první návštěvu - detekce jazyka prohlížeče
    var browserLanguage = navigator.language || navigator.userLanguage;
    var isCzech = browserLanguage.startsWith('cs');

    // Pokud jsme na české verzi a jazyk prohlížeče není čeština, přesměrovat na EN
    if (!isEnglishVersion && !isCzech) {
        var currentPage = window.location.pathname.split('/').pop() || 'index.html';
        window.location.href = 'en/' + currentPage;
    }

    // Pokud jsme na anglické verzi a jazyk prohlížeče je čeština, přesměrovat na CS
    if (isEnglishVersion && isCzech) {
        var currentPage = window.location.pathname.split('/').pop() || 'index.html';
        window.location.href = '../' + currentPage;
    }
}

// Při kliknutí na přepínač jazyka uložit volbu uživatele
document.addEventListener('DOMContentLoaded', function() {
    var langFlags = document.querySelectorAll('.lang-flag');
    langFlags.forEach(function(flag) {
        flag.addEventListener('click', function() {
            // Uložit, že uživatel si aktivně vybral jazyk
            localStorage.setItem('userLanguageChoice', 'true');
        });
    });
});