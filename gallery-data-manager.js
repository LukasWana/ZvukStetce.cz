/**
 * Optimalizovaný systém pro správu galerie s JSON daty
 * Podporuje lazy loading a progresivní načítání
 */

class GalleryDataManager {
    constructor() {
        this.galleryData = null;
        this.loadedImages = new Set();
        this.batchSize = 10; // Počet obrázků načítaných najednou
        this.currentBatch = 0;
        this.progressiveLoadingActive = false; // Flag pro progresivní načítání
        this.init();
    }

    async init() {
        try {
            await this.loadGalleryData();
            this.setupProgressiveLoading();
        } catch (error) {
        }
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
              description: "Ucitelky japonske kaligrafie.",
              year: "..",
              technique: "..",
            },
            {
              src: "gallery/Lucerna2.jpg",
              title: "Výstavene dílo -Lucerna",
              description: "..",
              year: "..",
              technique: "Výstavní",
            },
            {
              src: "gallery/psani.jpg",
              title: "Japonská kaligrafie",
              description: "Tradiční japonská kaligrafie.",
              year: "..",
              technique: "..",
            },
            {
              src: "gallery/FB_IMG_1742308140423.jpg",
              title: "Japonska skola",
              description: "Japonsko",
              year: "...",
              technique: "..",
            },
            {
              src: "gallery/IMG_9641.jpg",
              title: "Vystava kaligrafie",
              description: "..",
              year: "2025",
              technique: "..",
            },
            {
              src: "gallery/holky.jpg",
              title: "Morava",
              description: ".",
              year: "2025",
              technique: "..",
            },
            {
              src: "gallery/velvyslanecJPN.jpg",
              title: "..",
              description: ".",
              year: "..",
              technique: "..",
            },
            {
              src: "gallery/20231014_161450.jpg",
              title: "..",
              description: ".",
              year: "..",
              technique: "..",
            },
            {
              src: "gallery/FB_IMG_1742308152536.jpg",
              title: "..",
              description: ".",
              year: "..",
              technique: "..",
            },
            {
              src: "gallery/101A0096a.jpg",
              title: "..",
              description: ".",
              year: "..",
              technique: "..",
            },
            {
              src: "gallery/petra.jpg",
              title: "Petra Vitaskova",
              description: "Dílo připravené pro výstavu.",
              year: "..",
              technique: "Výstavní",
            },
          ],
        };
    }

    setupProgressiveLoading() {
        if (!this.galleryData || !this.galleryData.images) return;

        const galleryContainer = document.querySelector('.m-p-g__thumbs');
        if (!galleryContainer) return;



        // Načíst první batch okamžitě, pak postupně všechny ostatní
        this.loadNextBatch().then(() => {
            // Spustit progresivní načítání všech obrázků po krátkém delay (aby první batch stihl vykreslit)
            setTimeout(() => {
                this.loadAllImagesProgressively();
            }, 500);
        }).catch(error => {
            // I při chybě zkusit načíst postupně
            setTimeout(() => {
                this.loadAllImagesProgressively();
            }, 1000);
        });
    }

    loadNextBatch() {
        return new Promise((resolve, reject) => {
            if (!this.galleryData || !this.galleryData.images) {
                resolve();
                return;
            }

            const startIndex = this.currentBatch * this.batchSize;
            const endIndex = Math.min(startIndex + this.batchSize, this.galleryData.images.length);

            if (startIndex >= this.galleryData.images.length) {
                resolve();
                return;
            }



            const batch = this.galleryData.images.slice(startIndex, endIndex);

            try {
                this.renderImageBatch(batch);
                this.currentBatch++;
                resolve();
            } catch (error) {
                console.error('GalleryDataManager: Error rendering batch:', error);
                reject(error);
            }
        });
    }

    renderImageBatch(images) {
        const galleryContainer = document.querySelector('.m-p-g__thumbs');
        if (!galleryContainer) return;

        // Detekovat, jestli jsme v en/ složce podle relativních cest v HTML
        // Pokud jsou scripty nebo linky s ../ prefixem, jsme v en/ složce
        const isInEnFolder = Array.from(document.querySelectorAll('script[src], link[href]')).some(el => {
            const src = el.getAttribute('src') || el.getAttribute('href');
            return src && src.startsWith('../');
        });

        // Použít relativní cestu - pokud jsme v en/, přidat ../ prefix
        const getRelativeImagePath = (imagePath) => isInEnFolder ? '../' + imagePath : imagePath;



        // Přidat obrázky postupně s malým delay pro lepší UX
        images.forEach((imageData, index) => {
            // Malý delay mezi jednotlivými obrázky (50ms) pro postupné zobrazení
            setTimeout(() => {
            // Použít relativní cestu vůči aktuálnímu HTML souboru
            const imageSrc = getRelativeImagePath(imageData.src);

            // Zkontrolovat, jestli už obrázek existuje v DOM (např. při přepnutí jazyka)
            const existingImg = galleryContainer.querySelector(`img[src="${imageSrc}"], img[data-full="${imageSrc}"]`);
            if (existingImg) {
                // Obrázek už existuje, pouze aktualizovat loadedImages Set
                if (!this.loadedImages.has(imageSrc)) {
                    this.loadedImages.add(imageSrc);
                }
                return; // Přeskočit vytváření nového elementu
            }

            if (this.loadedImages.has(imageSrc)) return;

            const imgElement = document.createElement('img');
            imgElement.dataset.full = imageSrc;
            imgElement.className = 'm-p-g__thumbs-img lazy-image';
            imgElement.alt = imageData.title || 'Japonská kaligrafie';

            // Zobrazit obrázek hned, jak se načte
            imgElement.onload = () => {
                imgElement.classList.add('layout-completed');
                imgElement.style.opacity = '1';
            };

            // Při chybě také zobrazit (aby se nezobrazovalo nic)
            imgElement.onerror = () => {
                imgElement.style.opacity = '0.5'; // Poloprůhledný při chybě
            };

            // Přidání metadata
            if (imageData.title) {
                imgElement.title = imageData.title;
            }
            if (imageData.description) {
                imgElement.dataset.description = imageData.description;
            }
            if (imageData.year) {
                imgElement.dataset.year = imageData.year;
            }
            if (imageData.technique) {
                imgElement.dataset.technique = imageData.technique;
            }

            // Přidat do DOM hned - obrázek se začne načítat
            galleryContainer.appendChild(imgElement);

            // Nastavit src až poté, co je element v DOM - zajistí postupné načítání
            imgElement.src = imageSrc;

            // Pokud je obrázek už načtený (cached), zobrazit hned
            if (imgElement.complete && imgElement.naturalWidth > 0) {
                imgElement.classList.add('layout-completed');
                imgElement.style.opacity = '1';
            }

            this.loadedImages.add(imageSrc);
            }, index * 50); // 50ms delay mezi jednotlivými obrázky
        });

        // Zobrazit informace o načítání
        this.showLoadingInfo();

        // Re-inicializovat Material Photo Gallery pouze po načtení všech obrázků
        if (this.currentBatch * this.batchSize >= this.galleryData.images.length) {
            // Počkat déle, aby se obrázky správně vykreslily
            setTimeout(() => {
                this.reinitializeGallery();
            }, 2000);
        }
    }

    showLoadingInfo() {
        // Vytvořit nebo aktualizovat informační panel
        let infoPanel = document.getElementById('gallery-loading-info');
        if (!infoPanel) {
            infoPanel = document.createElement('div');
            infoPanel.id = 'gallery-loading-info';
            infoPanel.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 10px;
                background: #333;
                z-index: 10000;
            `;
            document.body.appendChild(infoPanel);
        }

        const totalImages = this.galleryData.images.length;
        const loadedImages = this.loadedImages.size;
        const progress = Math.round((loadedImages / totalImages) * 100);

        // Vytvořit progress bar
        let progressBar = infoPanel.querySelector('.progress-bar');
        if (!progressBar) {
            progressBar = document.createElement('div');
            progressBar.className = 'progress-bar';
            progressBar.style.cssText = `
                height: 100%;
                background: #4CAF50;
                width: 0%;
                transition: width 0.3s ease;
            `;
            infoPanel.appendChild(progressBar);
        }

        progressBar.style.width = progress + '%';

        // Skrýt panel po dokončení načítání
        if (loadedImages >= totalImages) {
            // Nastavit progress na 100%
            progressBar.style.width = '100%';

            setTimeout(() => {
                if (infoPanel) {
                    infoPanel.style.opacity = '0';
                    infoPanel.style.transition = 'opacity 0.5s ease-out';
                    setTimeout(() => {
                        if (infoPanel && infoPanel.parentNode) {
                            infoPanel.parentNode.removeChild(infoPanel);
                        }
                    }, 500);
                }
            }, 500); // Zkrátit delay na 500ms
        }
    }

    setupScrollLoading() {
        let isLoading = false;

        const loadMoreImages = () => {
            if (isLoading) return;

            // Zkontrolovat, zda jsou ještě nějaké obrázky k načtení
            const totalImages = this.galleryData.images.length;
            const loadedImages = this.loadedImages.size;

            if (loadedImages >= totalImages) {
                return;
            }

            const galleryContainer = document.querySelector('.m-p-g__thumbs');
            if (!galleryContainer) return;

            // Dodatečná kontrola před voláním getBoundingClientRect
            try {
                const containerRect = galleryContainer.getBoundingClientRect();
                const viewportHeight = window.innerHeight;

                // Načíst další batch pokud je galerie blízko konce viewportu nebo pokud je málo obrázků
                const shouldLoadMore = containerRect.bottom < viewportHeight + 500 || loadedImages < 100;

                if (shouldLoadMore) {
                    isLoading = true;
                    this.loadNextBatch().then(() => {
                        isLoading = false;
                        // Zkusit načíst další batch okamžitě
                        setTimeout(loadMoreImages, 100);
                    }).catch(error => {
                        isLoading = false;
                    });
                }
            } catch (error) {
                return;
            }
        };

        // Spustit načítání okamžitě
        setTimeout(loadMoreImages, 500);

        // Throttled scroll listener
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(loadMoreImages, 100);
        });

        // Alternativní způsob - načíst všechny obrázky postupně pokud scroll loading nefunguje
        setTimeout(() => {
            const totalImages = this.galleryData.images.length;
            const loadedImages = this.loadedImages.size;

            if (loadedImages < totalImages) {
                this.loadAllImagesProgressively();
            }
        }, 5000);

        // Agresivnější načítání - pokud je načteno méně než polovina, načti vše postupně
        setTimeout(() => {
            const totalImages = this.galleryData.images.length;
            const loadedImages = this.loadedImages.size;

            if (loadedImages < totalImages / 2) {
                this.loadAllImagesProgressively();
            }
        }, 10000);
    }

    loadAllImagesProgressively() {


        // Zajistit, že se neinicializuje vícekrát současně
        if (this.progressiveLoadingActive) {
            return;
        }
        this.progressiveLoadingActive = true;

        // Spustit interval pro aktualizaci progress baru každých 300ms
        const progressInterval = setInterval(() => {
            this.showLoadingInfo();
        }, 300);

        const loadNext = () => {
            const totalImages = this.galleryData.images.length;
            const loadedImages = this.loadedImages.size;

            if (loadedImages >= totalImages) {
                this.progressiveLoadingActive = false;
                clearInterval(progressInterval);
                // Aktualizovat progress bar naposledy a pak ho skrýt
                this.showLoadingInfo();
                return;
            }



            this.loadNextBatch().then(() => {
                // Aktualizovat progress bar po každém batchi
                this.showLoadingInfo();
                // Načíst další batch za 200ms
                setTimeout(loadNext, 200);
            }).catch(error => {
                // Zkusit znovu za 1 sekundu
                setTimeout(loadNext, 1000);
            });
        };

        loadNext();
    }

    reinitializeGallery() {
        // Re-inicializovat Material Photo Gallery pouze pokud není aktivní
        const activeGallery = document.querySelector('.m-p-g__fullscreen.active');
        if (!activeGallery) {
            const galleries = document.querySelectorAll('.m-p-g');
            galleries.forEach(gallery => {
                // Znovu inicializovat pouze pokud není již inicializovaná
                if (!gallery.dataset.initialized) {
                    try {
                        // Zkontrolovat, zda jsou obrázky skutečně načtené s validními rozměry
                        const thumbsBox = gallery.querySelector('.m-p-g__thumbs');
                        const images = thumbsBox ? thumbsBox.querySelectorAll('img') : [];

                        // Filtrovat pouze obrázky s načtenými rozměry a viditelné
                        const validImages = Array.from(images).filter(img =>
                            img.complete &&
                            img.naturalWidth > 0 &&
                            img.naturalHeight > 0 &&
                            img.offsetWidth > 0 &&
                            img.offsetHeight > 0
                        );

                        if (validImages.length > 5) { // Počkat na více obrázků

                            // Počkat ještě déle, aby se obrázky správně vykreslily
                            setTimeout(() => {
                                try {
                                    if (gallery && gallery.parentNode && !gallery.dataset.initialized) {
                                        new MaterialPhotoGallery(gallery);
                                        gallery.dataset.initialized = 'true';

                                    }
                                } catch (initError) {
                                }
                            }, 1000); // Zvýšeno na 1 sekundu
                        } else {

                        }
                    } catch (error) {
                    }
                }
            });
        }
    }

    // Metoda pro získání informací o obrázku
    getImageInfo(src) {
        if (!this.galleryData || !this.galleryData.images) return null;

        return this.galleryData.images.find(img => img.src === src);
    }

    // Metoda pro filtrování obrázků podle kritérií
    filterImages(criteria) {
        if (!this.galleryData || !this.galleryData.images) return [];

        return this.galleryData.images.filter(image => {
            if (criteria.year && image.year !== criteria.year) return false;
            if (criteria.technique && !image.technique.toLowerCase().includes(criteria.technique.toLowerCase())) return false;
            if (criteria.title && !image.title.toLowerCase().includes(criteria.title.toLowerCase())) return false;
            return true;
        });
    }

    // Metoda pro získání statistik
    getStats() {
        if (!this.galleryData || !this.galleryData.images) return null;

        const images = this.galleryData.images;
        const years = [...new Set(images.map(img => img.year))].sort();
        const techniques = [...new Set(images.map(img => img.technique))];

        return {
            totalImages: images.length,
            loadedImages: this.loadedImages.size,
            years: years,
            techniques: techniques,
            loadProgress: (this.loadedImages.size / images.length) * 100
        };
    }
}

// Inicializace při načtení DOM
document.addEventListener('DOMContentLoaded', function() {
    // Inicializovat data manager pouze na stránkách s galerií
    if (document.querySelector('.m-p-g')) {
        window.galleryDataManager = new GalleryDataManager();
    } else {

    }
});

// Export pro použití v jiných modulech
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GalleryDataManager;
}
