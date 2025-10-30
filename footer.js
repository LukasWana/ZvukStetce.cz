(function() {
  function isEnglish() {
    return window.location.pathname.includes('/en/');
  }

  function getFooterHtml() {
    if (isEnglish()) {
      // EN footer with centered image at 360px height
      return (
        '<footer class="contact">\n' +
        '  <div style="width:100%;text-align:left;margin:0 0 12px 12px;">\n' +
        '    <img src="../img/petra.jpg" alt="Petra" style="display:block;margin:0;height:200px;width:auto;" />\n' +
        '  </div>\n' +
        '  <a class="social email-icon" href="">\n' +
        '    <img src="../img/mail_white.svg" height="40" alt="Email" />\n' +
        '  </a>\n' +
        '  <a target="_blank" class="social" href="https://facebook.com/KurzyJaponskeKaligrafie">\n' +
        '    <img src="../img/fb_white.svg" height="40" alt="Facebook" />\n' +
        '  </a>\n' +
        '  <a target="_blank" class="social" href="https://instagram.com/petra.vitaskova">\n' +
        '    <img src="../img/ig_white.svg" height="40" alt="Instagram" />\n' +
        '  </a>\n' +
        '</footer>'
      );
    }
    return (
      '<footer class="contact">\n' +
      '  <div style="width:100%;text-align:left;margin:0 0 12px 12px;">\n' +
      '    <img src="img/petra.jpg" alt="Petra" style="display:block;margin:0;height:200px;width:auto;" />\n' +
      '  </div>\n' +
      '  <a class="social email-icon" href="">\n' +
      '    <img src="img/mail_white.svg" height="40" alt="Email" />\n' +
      '  </a>\n' +
      '  <a target="_blank" class="social" href="https://facebook.com/KurzyJaponskeKaligrafie">\n' +
      '    <img src="img/fb_white.svg" height="40" alt="Facebook" />\n' +
      '  </a>\n' +
      '  <a target="_blank" class="social" href="https://instagram.com/petra.vitaskova">\n' +
      '    <img src="img/ig_white.svg" height="40" alt="Instagram" />\n' +
      '  </a>\n' +
      '</footer>'
    );
  }

  function injectFooter() {
    var root = document.getElementById('footer-root');
    if (!root) {
      root = document.createElement('div');
      root.id = 'footer-root';
      document.body.appendChild(root);
    }
    root.innerHTML = getFooterHtml();
    // nastav email link
    var emailIcon = root.querySelector('.email-icon');
    if (emailIcon) {
      emailIcon.setAttribute('href', 'mailto:petra@zvukstetce.cz');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectFooter, { once: true });
  } else {
    injectFooter();
  }
})();


