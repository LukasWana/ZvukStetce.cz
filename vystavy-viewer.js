// Lightweight, non-destructive viewer for .vystavy posters
// - Does NOT change page DOM structure
// - Opens modal on click and allows prev/next within the same .vystavy container
// - Supports keyboard (Esc, ArrowLeft, ArrowRight) and touch swipe
(function () {
  function createEl(tag, props = {}, css = {}) {
    const el = document.createElement(tag);
    Object.keys(props).forEach((k) => el.setAttribute(k, props[k]));
    Object.assign(el.style, css);
    return el;
  }

  function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
  }

  class VystavyViewer {
    constructor() {
      this.containers = Array.from(document.querySelectorAll(".vystavy"));
      if (!this.containers.length) return;
      this.bind();
    }

    bind() {
      this.containers.forEach((container) => {
        const imgs = Array.from(container.querySelectorAll("img"));
        // store reference on container
        container._vystavyImgs = imgs;
        container.addEventListener("click", (e) => {
          const t = e.target;
          if (t && t.tagName === "IMG") {
            const index = container._vystavyImgs.indexOf(t);
            if (index >= 0) this.open(container, index);
          }
        });
      });
    }

    open(container, startIndex) {
      this.container = container;
      this.currentIndex = startIndex;
      this.imgs = container._vystavyImgs || [];

      // overlay
      this.overlay = createEl(
        "div",
        {},
        {
          position: "fixed",
          inset: "0",
          background: "rgba(0,0,0,0.92)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 100000,
          cursor: "zoom-out",
        }
      );
      this.overlay.addEventListener("click", (e) => {
        if (e.target === this.overlay) this.close();
      });

      // image wrapper
      this.wrap = createEl(
        "div",
        {},
        { position: "relative", maxWidth: "95%", maxHeight: "95%" }
      );

      // img element
      this.largeImg = createEl(
        "img",
        {},
        {
          display: "block",
          maxWidth: "100%",
          maxHeight: "100%",
          margin: "0 auto",
        }
      );
      this.wrap.appendChild(this.largeImg);

      // caption / counter
      this.caption = createEl(
        "div",
        {},
        {
          color: "#fff",
          textAlign: "center",
          marginTop: "10px",
          fontSize: "14px",
          opacity: 0.9,
        }
      );
      // controls
      const btnStyle = {
        position: "absolute",
        top: "50%",
        transform: "translateY(-50%)",
        background: "rgba(0,0,0,0.4)",
        border: "none",
        color: "#fff",
        padding: "12px",
        cursor: "pointer",
        borderRadius: "4px",
      };
      this.prevBtn = createEl(
        "button",
        { "aria-label": "Previous" },
        Object.assign({}, btnStyle, { left: "-60px" })
      );
      this.prevBtn.innerHTML = "&#10094;";
      this.nextBtn = createEl(
        "button",
        { "aria-label": "Next" },
        Object.assign({}, btnStyle, { right: "-60px" })
      );
      this.nextBtn.innerHTML = "&#10095;";

      // close button
      this.closeBtn = createEl(
        "button",
        { "aria-label": "Close" },
        {
          position: "absolute",
          top: "-48px",
          right: "0",
          background: "transparent",
          color: "#fff",
          border: "none",
          fontSize: "28px",
          cursor: "pointer",
        }
      );
      this.closeBtn.innerHTML = "&times;";

      // assemble
      this.wrap.appendChild(this.prevBtn);
      this.wrap.appendChild(this.nextBtn);
      this.wrap.appendChild(this.closeBtn);
      const containerBox = createEl(
        "div",
        {},
        { display: "flex", flexDirection: "column", alignItems: "center" }
      );
      containerBox.appendChild(this.wrap);
      containerBox.appendChild(this.caption);
      this.overlay.appendChild(containerBox);
      document.body.appendChild(this.overlay);

      // lock scroll
      this._prevBodyOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      // events
      this.onKey = this.onKey.bind(this);
      this.onPrev = this.onPrev.bind(this);
      this.onNext = this.onNext.bind(this);
      this.onClose = this.onClose.bind(this);
      this.onTouchStart = this.onTouchStart.bind(this);
      this.onTouchEnd = this.onTouchEnd.bind(this);

      document.addEventListener("keydown", this.onKey);
      this.prevBtn.addEventListener("click", this.onPrev);
      this.nextBtn.addEventListener("click", this.onNext);
      this.closeBtn.addEventListener("click", this.onClose);

      // touch
      this.overlay.addEventListener("touchstart", this.onTouchStart, {
        passive: true,
      });
      this.overlay.addEventListener("touchend", this.onTouchEnd, {
        passive: true,
      });

      // initial show
      this.show(this.currentIndex);
    }

    show(i) {
      if (!this.imgs || this.imgs.length === 0) return;
      this.currentIndex =
        ((i % this.imgs.length) + this.imgs.length) % this.imgs.length; // wrap
      const src =
        this.imgs[this.currentIndex].currentSrc ||
        this.imgs[this.currentIndex].src ||
        "";
      const alt = this.imgs[this.currentIndex].alt || "";

      // use fade transition
      this.largeImg.style.opacity = "0";
      // set src after a tiny delay to show transition
      setTimeout(() => {
        this.largeImg.src = src;
        this.largeImg.alt = alt;
        this.caption.textContent =
          alt +
          (this.imgs.length > 1
            ? ` — ${this.currentIndex + 1}/${this.imgs.length}`
            : "");
        // ensure image is fully loaded before fading in
        if (!this.largeImg.complete) {
          this.largeImg.onload = () => {
            this.largeImg.style.transition = "opacity 220ms ease";
            this.largeImg.style.opacity = "1";
          };
        } else {
          this.largeImg.style.transition = "opacity 220ms ease";
          this.largeImg.style.opacity = "1";
        }
      }, 30);
    }

    onPrev(e) {
      e.stopPropagation();
      this.show(this.currentIndex - 1);
    }
    onNext(e) {
      e.stopPropagation();
      this.show(this.currentIndex + 1);
    }
    onClose(e) {
      e && e.stopPropagation();
      this.close();
    }

    onKey(e) {
      if (e.key === "Escape" || e.keyCode === 27) this.close();
      if (e.key === "ArrowLeft" || e.keyCode === 37)
        this.show(this.currentIndex - 1);
      if (e.key === "ArrowRight" || e.keyCode === 39)
        this.show(this.currentIndex + 1);
    }

    onTouchStart(e) {
      const t = e.touches && e.touches[0];
      if (!t) return;
      this._touchStartX = t.clientX;
      this._touchStartY = t.clientY;
    }
    onTouchEnd(e) {
      const t = e.changedTouches && e.changedTouches[0];
      if (!t || this._touchStartX === undefined) return;
      const dx = t.clientX - this._touchStartX;
      const dy = t.clientY - this._touchStartY;
      const absX = Math.abs(dx),
        absY = Math.abs(dy);
      const minDist = 40; // px
      if (absX > absY && absX > minDist) {
        if (dx > 0) this.show(this.currentIndex - 1);
        else this.show(this.currentIndex + 1);
      }
      this._touchStartX = undefined;
      this._touchStartY = undefined;
    }

    close() {
      // cleanup
      document.removeEventListener("keydown", this.onKey);
      this.prevBtn.removeEventListener("click", this.onPrev);
      this.nextBtn.removeEventListener("click", this.onNext);
      this.closeBtn.removeEventListener("click", this.onClose);
      this.overlay &&
        this.overlay.parentNode &&
        this.overlay.parentNode.removeChild(this.overlay);
      document.body.style.overflow = this._prevBodyOverflow || "";
      this.overlay = null;
      this.largeImg = null;
      this.caption = null;
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    try {
      new VystavyViewer();
    } catch (err) {
      console.error("VystavyViewer init error", err);
    }
  });
})();
