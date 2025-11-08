/**
 * Systém pro správu galerie s JSON daty pro W3Schools lightbox.
 * Podporuje lazy loading a progresivní načítání
 */

class GalleryDataManager {
  constructor() {
    this.galleryData = null;
    this.loadedImages = new Set();
    this.totalImages = 0;
    this.imageCounter = 0; // Counter for assigning slide numbers
    this.currentBatch = 0;
    this.progressiveLoadingActive = false; // Flag pro progresivní načítání
    this.init();
  }

  async init() {
    try {
      await this.loadGalleryData();
      this.setupGallery();
    } catch (error) {}
  }

  async loadGalleryData() {
    try {
      // Inline data místo fetch kvůli CORS problému
      this.galleryData = this.getInlineGalleryData();
      return this.galleryData;
    } catch (error) {
      return null;
    }
  }

  // Inline gallery data - řešení CORS problému
  getInlineGalleryData() {
    return {
      images: [
        // Obrázky ze složky Gallery
        {
          src: "gallery/teachers.jpg",
          title: "Akiko Suzuki & Petra Vitaskova",
          description: "",
          year: "2020",
          technique: "..",
        },
        {
          src: "gallery/Lucerna2.jpg",
          title: "Exhibited work in Lucerna Gallery",
          description: "",
          year: "2019",
          technique: "",
        },
        {
          src: "gallery/psani.jpg",
          title:
            "The process of writing in a traditional Japanese school. Each stroke is created in silence, with full attention and respect for the character.",
          description: "",
          year: "",
          technique: "",
        },
        {
          src: "gallery/FB_IMG_1742308140423.jpg",
          title: "Japanese school",
          description: "Japan",
          year: "",
          technique: "",
        },
        {
          src: "gallery/IMG_9641.jpg",
          title: "Exhibition in Prague, Church of the Infant Jesus of Prague",
          description: "..",
          year: "2025",
          technique: "..",
        },
        {
          src: "gallery/holky.jpg",
          title: "Exhibition in Veselí nad Moravou, Panský dvůr City Gallery",
          description: ".",
          year: "2025",
          technique: "..",
        },
        {
          src: "gallery/velvyslanecJPN.jpg",
          title:
            "Petra Vitaskova & the Ambassador of Japan, Mr. Nagaoka Kansuke",
          description: "",
          year: "2024",
          technique: "..",
        },
        {
          src: "gallery/20231014_161450.jpg",
          title: "Akiko Suzuki & Petra Vitaskova",
          description: "",
          year: "2023",
          technique: "",
        },
        {
          src: "gallery/FB_IMG_1742308152536.jpg",
          title: "Three generations of calligraphy teachers",
          description: "",
          year: "2019",
          technique: "",
        },
        {
          src: "gallery/101A0096a.jpg",
          title:
            "Writing demonstration with school students, Prague Budó Matsuri",
          description: "",
          year: "2024",
          technique: "",
        },
        {
          src: "gallery/petra.jpg",
          title:
            "Work prepared for the exhibition SONGS ABOUT THE END OF WANDERING",
          description: "",
          year: "2025",
          technique: "",
        },
      ],
    };
  }

  setupGallery() {
    if (!this.galleryData || !this.galleryData.images) return;

    const galleryContainer = document.getElementById("gallery-container");
    if (!galleryContainer) return;

    // Create columns for the gallery
    for (let i = 0; i < 4; i++) {
      const column = document.createElement("div");
      column.className = "gallery-column";
      galleryContainer.appendChild(column);
    }

    this.renderImages(this.galleryData.images);
  }

  renderImages(images) {
    const columns = document.querySelectorAll(".gallery-column");
    const modalContent = document.getElementById("modal-content");
    const thumbnailRow = document.getElementById("thumbnail-row");
    if (!columns.length || !modalContent) return;

    const isInEnFolder = Array.from(
      document.querySelectorAll("script[src], link[href]")
    ).some((el) => {
      const src = el.getAttribute("src") || el.getAttribute("href");
      return src && src.startsWith("../");
    });

    const getRelativeImagePath = (imagePath) =>
      isInEnFolder ? "../" + imagePath : imagePath;

    images.forEach((imageData) => {
      this.imageCounter++;
      const imageIndex = this.imageCounter;
      const imageSrc = getRelativeImagePath(imageData.src);

      // 1. Create thumbnail image and add to a column
      const thumbImg = document.createElement("img");
      thumbImg.src = imageSrc;
      thumbImg.alt = imageData.title || "Japanese Calligraphy";
      thumbImg.setAttribute(
        "onclick",
        `openModal();currentSlide(${imageIndex})`
      );

      // Distribute images into columns
      columns[(imageIndex - 1) % columns.length].appendChild(thumbImg);

      // 2. Create the slide for the modal
      const slideDiv = document.createElement("div");
      slideDiv.className = "mySlides";

      const fullImg = document.createElement("img");
      fullImg.src = imageSrc;
      fullImg.alt = imageData.title || "Japanese Calligraphy";
      // The image is inside a div to match the CSS selector
      const imgContainer = document.createElement("div");
      imgContainer.className = "modal-lightbox-content";
      imgContainer.appendChild(fullImg);

      slideDiv.appendChild(imgContainer);
      modalContent.appendChild(slideDiv);

      // 3. Create thumbnail 'demo' image for the modal
      if (thumbnailRow) {
        const demoImg = document.createElement("img");
        demoImg.className = "demo cursor";
        demoImg.src = imageSrc;
        demoImg.alt = `${imageData.title || ""}\n${imageData.year || ""}`;
        demoImg.setAttribute("onclick", `currentSlide(${imageIndex})`);
        thumbnailRow.appendChild(demoImg);
      }
    });
  }

  // Metoda pro získání informací o obrázku
  getImageInfo(src) {
    if (!this.galleryData || !this.galleryData.images) return null;

    return this.galleryData.images.find((img) => img.src === src);
  }

  // Metoda pro filtrování obrázků podle kritérií
  filterImages(criteria) {
    if (!this.galleryData || !this.galleryData.images) return [];

    return this.galleryData.images.filter((image) => {
      if (criteria.year && image.year !== criteria.year) return false;
      if (
        criteria.technique &&
        !image.technique
          .toLowerCase()
          .includes(criteria.technique.toLowerCase())
      )
        return false;
      if (
        criteria.title &&
        !image.title.toLowerCase().includes(criteria.title.toLowerCase())
      )
        return false;
      return true;
    });
  }

  // Metoda pro získání statistik
  getStats() {
    if (!this.galleryData || !this.galleryData.images) return null;

    const images = this.galleryData.images;
    const years = [...new Set(images.map((img) => img.year))].sort();
    const techniques = [...new Set(images.map((img) => img.technique))];

    return {
      totalImages: images.length,
      loadedImages: this.loadedImages.size,
      years: years,
      techniques: techniques,
      loadProgress: (this.loadedImages.size / images.length) * 100,
    };
  }
}

// Inicializace při načtení DOM
document.addEventListener("DOMContentLoaded", function () {
  // Inicializovat data manager pouze na stránkách s galerií
  if (document.getElementById("gallery-container")) {
    window.galleryDataManager = new GalleryDataManager();
  } else {
  }
});

// Export pro použití v jiných modulech
if (typeof module !== "undefined" && module.exports) {
  module.exports = GalleryDataManager;
}
