/**
 * Optimalizovaný loader pro galerii s lazy loading a lokalizací
 * Podporuje češtinu a angličtinu
 */

class GalleryLoader {
    constructor() {
        this.language = this.detectLanguage();
        this.loadingMessages = {
            cs: {
                loading: "Načítání fotek...",
                loaded: "Fotky načteny",
                error: "Chyba při načítání fotek",
                progress: "Načteno {loaded} z {total} fotek"
            },
            en: {
                loading: "Loading photos...",
                loaded: "Photos loaded",
                error: "Error loading photos",
                progress: "Loaded {loaded} of {total} photos"
            }
        };
        this.loadedImages = 0;
        this.totalImages = 0;
        this.loadingIndicator = null;
        this.init();
    }

    detectLanguage() {
        const isEnglishVersion = window.location.pathname.includes('/en/');
        return isEnglishVersion ? 'en' : 'cs';
    }

    init() {
        this.createLoadingIndicator();
        this.setupLazyLoading();
        this.optimizeExistingImages();
    }

    createLoadingIndicator() {
        // Vytvoření loading indikátoru
        this.loadingIndicator = document.createElement('div');
        this.loadingIndicator.className = 'gallery-loading-indicator';
        this.loadingIndicator.innerHTML = `
            <div class="loading-content">
                <div class="loading-spinner"></div>
                <div class="loading-text">${this.loadingMessages[this.language].loading}</div>
                <div class="loading-progress">
                    <div class="progress-bar"></div>
                </div>
                <div class="loading-stats"></div>
            </div>
        `;

        // CSS styly pro loading indikátor
        const style = document.createElement('style');
        style.textContent = `
            .gallery-loading-indicator {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10000;
                transition: opacity 0.3s ease;
            }

            .gallery-loading-indicator.hidden {
                opacity: 0;
                pointer-events: none;
            }

            .loading-content {
                text-align: center;
                color: white;
                font-family: Arial, sans-serif;
            }

            .loading-spinner {
                width: 50px;
                height: 50px;
                border: 4px solid rgba(255, 255, 255, 0.3);
                border-top: 4px solid white;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 0 auto 20px;
            }

            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }

            .loading-text {
                font-size: 18px;
                margin-bottom: 20px;
                font-weight: bold;
            }

            .loading-progress {
                width: 300px;
                height: 6px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 3px;
                overflow: hidden;
                margin: 0 auto 10px;
            }

            .progress-bar {
                height: 100%;
                background: linear-gradient(90deg, #4CAF50, #8BC34A);
                width: 0%;
                transition: width 0.3s ease;
                border-radius: 3px;
            }

            .loading-stats {
                font-size: 14px;
                opacity: 0.8;
            }

            /* Lazy loading styly */
            .lazy-image {
                opacity: 0;
                transition: opacity 0.3s ease;
            }

            .lazy-image.loaded {
                opacity: 1;
            }

            .lazy-image.loading {
                background: #f0f0f0;
                background-image: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                background-size: 200% 100%;
                animation: loading-shimmer 1.5s infinite;
            }

            @keyframes loading-shimmer {
                0% { background-position: -200% 0; }
                100% { background-position: 200% 0; }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(this.loadingIndicator);
    }

    setupLazyLoading() {
        // Intersection Observer pro lazy loading
        if ('IntersectionObserver' in window) {
            this.imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.loadImage(entry.target);
                        this.imageObserver.unobserve(entry.target);
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.1
            });
        }
    }

    optimizeExistingImages() {
        const galleryImages = document.querySelectorAll('.m-p-g__thumbs-img');
        this.totalImages = galleryImages.length;

        if (this.totalImages === 0) {
            this.hideLoadingIndicator();
            return;
        }

        // Přidání lazy loading atributů
        galleryImages.forEach((img, index) => {
            // Okamžitě načíst první 6 obrázků pro rychlý start
            if (index < 6) {
                this.loadImage(img);
            } else {
                // Ostatní obrázky načítat lazy
                img.classList.add('lazy-image');
                img.classList.add('loading');

                if (this.imageObserver) {
                    this.imageObserver.observe(img);
                } else {
                    // Fallback pro starší prohlížeče
                    setTimeout(() => this.loadImage(img), index * 100);
                }
            }
        });

        // Pokud jsou všechny obrázky už načtené
        if (this.loadedImages === this.totalImages) {
            this.hideLoadingIndicator();
        }
    }

    loadImage(img) {
        if (img.dataset.loaded) return;

        img.dataset.loaded = 'true';
        img.classList.remove('loading');

        const originalSrc = img.src;
        const fullSrc = img.dataset.full || originalSrc;

        // Pokud je obrázek už načtený, jen aktualizovat progress
        if (img.complete && img.naturalWidth > 0) {
            this.updateProgress();
            return;
        }

        // Načíst full-size obrázek
        const fullImage = new Image();
        fullImage.onload = () => {
            img.src = fullSrc;
            img.classList.add('loaded');
            this.updateProgress();
        };

        fullImage.onerror = () => {
            console.warn('Failed to load image:', fullSrc);
            img.classList.add('loaded');
            this.updateProgress();
        };

        fullImage.src = fullSrc;
    }

    updateProgress() {
        this.loadedImages++;
        const percentage = (this.loadedImages / this.totalImages) * 100;

        const progressBar = this.loadingIndicator.querySelector('.progress-bar');
        const stats = this.loadingIndicator.querySelector('.loading-stats');

        if (progressBar) {
            progressBar.style.width = percentage + '%';
        }

        if (stats) {
            const message = this.loadingMessages[this.language].progress
                .replace('{loaded}', this.loadedImages)
                .replace('{total}', this.totalImages);
            stats.textContent = message;
        }

        // Skrýt loading indikátor když jsou všechny obrázky načtené
        if (this.loadedImages >= this.totalImages) {
            setTimeout(() => this.hideLoadingIndicator(), 500);
        }
    }

    hideLoadingIndicator() {
        if (this.loadingIndicator) {
            this.loadingIndicator.classList.add('hidden');
            setTimeout(() => {
                if (this.loadingIndicator && this.loadingIndicator.parentNode) {
                    this.loadingIndicator.parentNode.removeChild(this.loadingIndicator);
                }
            }, 300);
        }
    }

    // Metoda pro přidání nových obrázků dynamicky
    addImages(images) {
        images.forEach(img => {
            img.classList.add('lazy-image', 'loading');
            this.totalImages++;

            if (this.imageObserver) {
                this.imageObserver.observe(img);
            } else {
                this.loadImage(img);
            }
        });
    }

    // Metoda pro aktualizaci jazyka
    updateLanguage(newLanguage) {
        this.language = newLanguage;
        if (this.loadingIndicator) {
            const loadingText = this.loadingIndicator.querySelector('.loading-text');
            if (loadingText) {
                loadingText.textContent = this.loadingMessages[this.language].loading;
            }
        }
    }
}

// Inicializace při načtení DOM
document.addEventListener('DOMContentLoaded', function() {
    console.log('GalleryLoader: DOM loaded, checking for gallery...');
    // Inicializovat loader pouze na stránkách s galerií
    if (document.querySelector('.m-p-g')) {
        console.log('GalleryLoader: Gallery found, initializing...');
        window.galleryLoader = new GalleryLoader();
    } else {
        console.log('GalleryLoader: No gallery found on this page');
    }
});

// Export pro použití v jiných modulech
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GalleryLoader;
}
