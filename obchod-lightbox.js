document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("obchod-modal");
  if (!modal) return;

  const modalImg = document.getElementById("obchod-modal-img");
  const captionText = document.getElementById("obchod-caption");
  const thumbnailRow = document.getElementById("obchod-thumbnail-row");
  const closeBtn = document.querySelector(".obchod-close");

  let productImages = [];
  let currentImageIndex;

  // Find all product images that should be in the lightbox
  // This selector specifically targets product images and excludes the basket icon.
  const imageElements = document.querySelectorAll(".obraz .obraz-nahled > img");

  imageElements.forEach((img, index) => {
    const obrazContainer = img.closest(".obraz");
    const orderBtn = obrazContainer.querySelector(".order-btn");
    const productTitle = orderBtn ? orderBtn.dataset.product : "";
    const productVs = orderBtn ? orderBtn.dataset.vs : "";
    const productPrice = orderBtn ? orderBtn.dataset.price : "";
    const kanjiEl = obrazContainer.querySelector(".popis .kanji");
    const romajiEl = obrazContainer.querySelector(".popis .romaji");

    productImages.push({
      src: img.src,
      productTitle: productTitle,
      productVs: productVs,
      productPrice: productPrice,
      kanji: kanjiEl ? kanjiEl.textContent.trim() : "",
      romaji: romajiEl ? romajiEl.textContent.trim() : "",
    });

    // Create thumbnail 'demo' image for the modal
    if (thumbnailRow) {
      const demoImg = document.createElement("img");
      demoImg.className = "obchod-demo";
      demoImg.src = img.src;
      demoImg.alt = productTitle;
      demoImg.onclick = () => openShopModal(index);
      thumbnailRow.appendChild(demoImg);
    }

    // Add onclick attribute to open the modal
    const obrazNahled = img.parentElement;
    obrazNahled.style.cursor = "pointer";
    obrazNahled.onclick = (event) => {
      // Prevent order button from triggering lightbox
      if (event.target.closest(".order-btn")) {
        return;
      }
      openShopModal(index);
    };
  });

  function openShopModal(index) {
    modal.style.display = "block";
    currentImageIndex = index;
    showImage(currentImageIndex);
  }

  function closeShopModal() {
    modal.style.display = "none";
  }

  function plusSlides(n) {
    currentImageIndex =
      (currentImageIndex + n + productImages.length) % productImages.length;
    showImage(currentImageIndex);
  }

  function showImage(index) {
    if (index >= 0 && index < productImages.length) {
      const imageData = productImages[index];
      modalImg.src = imageData.src;

      // Update the order button in the modal
      const modalOrderBtn = document.getElementById("obchod-modal-order-btn");
      if (modalOrderBtn) {
        modalOrderBtn.dataset.product = imageData.productTitle;
        modalOrderBtn.dataset.vs = imageData.productVs;
        modalOrderBtn.dataset.price = imageData.productPrice;
      }

      // Set caption width after image loads to get its rendered width
      modalImg.onload = function () {
        const imageWidth = modalImg.offsetWidth;
        const modalOrderBtnContainer = document.getElementById(
          "obchod-modal-order-btn"
        );
        captionText.style.width = `${imageWidth}px`;
        if (modalOrderBtnContainer)
          modalOrderBtnContainer.style.width = `${imageWidth}px`;

        // Highlight the active thumbnail
        const thumbnails = document.querySelectorAll(".obchod-demo");
        thumbnails.forEach((thumb) => {
          thumb.classList.remove("obchod-active");
        });
        if (thumbnails[index]) {
          thumbnails[index].classList.add("obchod-active");
          thumbnails[index].scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "center",
          });
        }

        // Build the multi-line caption
        let captionHTML = `<span class="caption-latin">${imageData.productTitle}</span>`;
        if (imageData.kanji || imageData.romaji) {
          captionHTML += `<span class="caption-japanese">${imageData.kanji} ${imageData.romaji}</span>`;
        }
        captionText.innerHTML = captionHTML;
      };

      // If image is cached, onload might not fire, so trigger it manually
      if (modalImg.complete) modalImg.onload();
    }
  }

  // --- Event Listeners ---

  // Close button
  closeBtn.onclick = closeShopModal;

  // Next/Prev buttons
  document.querySelector(".obchod-prev").onclick = () => plusSlides(-1);
  document.querySelector(".obchod-next").onclick = () => plusSlides(1);

  // Close modal on outside click
  modal.addEventListener("click", function (event) {
    if (event.target === modal) {
      closeShopModal();
    }
  });

  // Keyboard navigation
  document.addEventListener("keydown", function (e) {
    if (modal.style.display === "block") {
      if (e.key === "ArrowLeft") {
        plusSlides(-1);
      } else if (e.key === "ArrowRight") {
        plusSlides(1);
      } else if (e.key === "Escape") {
        closeShopModal();
      }
    }
  });

  // Swipe navigation for touch devices
  let touchstartX = 0;
  let touchendX = 0;

  modal.addEventListener(
    "touchstart",
    function (event) {
      touchstartX = event.changedTouches[0].screenX;
    },
    false
  );

  modal.addEventListener(
    "touchend",
    function (event) {
      touchendX = event.changedTouches[0].screenX;
      handleSwipe();
    },
    false
  );

  function handleSwipe() {
    if (touchendX < touchstartX) {
      plusSlides(1); // Swiped left
    }
    if (touchendX > touchstartX) {
      plusSlides(-1); // Swiped right
    }
  }

  // --- Custom logic for order button inside the modal ---
  const modalOrderBtn = document.getElementById("obchod-modal-order-btn");
  if (modalOrderBtn) {
    modalOrderBtn.addEventListener("click", function () {
      // 1. Close the lightbox modal
      closeShopModal();

      // 2. After a short delay, find and click the original button on the page
      //    to trigger the order modal.
      setTimeout(() => {
        const originalButton = Array.from(
          document.querySelectorAll(".obraz .order-btn")
        )[currentImageIndex];

        if (originalButton) originalButton.click();
      }, 300); // 300ms delay to allow lightbox to close smoothly
    });
  }
});
