let slideIndex = 1;

function openModal() {
  const modal = document.getElementById("myModal");
  modal.style.display = "flex";
  modal.style.flexDirection = "column";
  modal.style.alignItems = "center";
  modal.style.justifyContent = "center";
  modal.style.padding = "2vh 0";
}

function closeModal() {
  document.getElementById("myModal").style.display = "none";
}

function plusSlides(n) {
  showSlides((slideIndex += n));
}

function currentSlide(n) {
  showSlides((slideIndex = n));
}

function showSlides(n) {
  let i;
  const slides = document.getElementsByClassName("mySlides");
  const dots = document.getElementsByClassName("demo");
  const captionText = document.getElementById("caption");
  if (!slides || slides.length === 0) return;

  if (n > slides.length) {
    slideIndex = 1;
  }
  if (n < 1) {
    slideIndex = slides.length;
  }

  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }

  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }

  slides[slideIndex - 1].style.display = "block";
  if (dots && dots.length > 0) {
    dots[slideIndex - 1].className += " active";
    // Replace newline characters from alt text with <br> for HTML display
    if (captionText) {
      captionText.innerHTML = dots[slideIndex - 1].alt.replace(/\n/g, "<br>");
    }
  }
}

// Add keyboard navigation
document.addEventListener("keydown", function (e) {
  const modal = document.getElementById("myModal");
  // Check for 'flex' display style, as set in openModal()
  if (modal && modal.style.display === "flex") {
    if (e.key === "Escape") {
      closeModal();
    } else if (e.key === "ArrowLeft") {
      plusSlides(-1);
    } else if (e.key === "ArrowRight") {
      plusSlides(1);
    }
  }
});

// Add touch event listeners for better mobile experience on arrows
document.addEventListener("DOMContentLoaded", function () {
  const arrows = document.querySelectorAll(".prev, .next");

  arrows.forEach((arrow) => {
    arrow.addEventListener(
      "touchstart",
      function (e) {
        // Prevent the browser from trying to scroll when interacting with arrows
        e.preventDefault();
        arrow.classList.add("touch-active");
      },
      { passive: false }
    );

    arrow.addEventListener("touchend", function () {
      arrow.classList.remove("touch-active");
      // Manually trigger the slide change on touchend for mobile
      // This is needed because preventDefault() on touchstart can stop click events.
      if (arrow.classList.contains("next")) {
        plusSlides(1);
      } else if (arrow.classList.contains("prev")) {
        plusSlides(-1);
      }
    });
  });
});
