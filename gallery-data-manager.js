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
            console.error('Chyba při načítání dat galerie:', error);
        }
    }

    async loadGalleryData() {
        try {
            // Inline data místo fetch kvůli CORS problému
            this.galleryData = this.getInlineGalleryData();
            console.log('GalleryDataManager: Data loaded inline, count:', this.galleryData.images.length);
            console.log('GalleryDataManager: Total images to load:', this.galleryData.images.length);
            console.log('GalleryDataManager: Images from newImages folder:', this.galleryData.images.filter(img => img.src.startsWith('newImages/')).length);
            console.log('GalleryDataManager: Images from gallery folder:', this.galleryData.images.filter(img => img.src.startsWith('gallery/')).length);
            return this.galleryData;
        } catch (error) {
            console.error('Nepodařilo se načíst data galerie:', error);
            return null;
        }
    }

    // Inline gallery data - řešení CORS problému
    getInlineGalleryData() {
        return {
            "images": [
                // Obrázky ze složky newImages
                {
                    "src": "newImages/IMG-20190710-WA0016.jpg",
                    "title": "Kaligrafické dílo",
                    "description": "Tradiční japonská kaligrafie.",
                    "year": "2019",
                    "technique": "Šodó"
                },
                {
                    "src": "newImages/IMG-20200610-WA0013.jpg",
                    "title": "Umělecká kaligrafie",
                    "description": "Umělecká kaligrafie jako forma výrazu.",
                    "year": "2020",
                    "technique": "Umělecká"
                },
                {
                    "src": "newImages/IMG-20200618-WA0003.jpg",
                    "title": "Kaligrafické cvičení",
                    "description": "Cvičení pro zlepšení techniky.",
                    "year": "2020",
                    "technique": "Cvičení"
                },
                {
                    "src": "newImages/IMG-20200618-WA0020.jpg",
                    "title": "Detailní práce",
                    "description": "Detailní pohled na kaligrafickou práci.",
                    "year": "2020",
                    "technique": "Detail"
                },
                {
                    "src": "newImages/IMG-20200629-WA0005.jpg",
                    "title": "Experimentální přístup",
                    "description": "Experimentální přístup k kaligrafii.",
                    "year": "2020",
                    "technique": "Experimentální"
                },
                {
                    "src": "newImages/IMG-20200629-WA0007.jpg",
                    "title": "Výstavní dílo",
                    "description": "Dílo připravené pro výstavu.",
                    "year": "2020",
                    "technique": "Výstavní"
                },
                {
                    "src": "newImages/IMG-20200629-WA0008.jpg",
                    "title": "Kaligrafické techniky",
                    "description": "Různé kaligrafické techniky.",
                    "year": "2020",
                    "technique": "Techniky"
                },
                {
                    "src": "newImages/IMG-20200629-WA0009.jpg",
                    "title": "Japonská kaligrafie",
                    "description": "Tradiční japonská kaligrafie.",
                    "year": "2020",
                    "technique": "Šodó"
                },
                {
                    "src": "newImages/IMG-20200629-WA0010.jpg",
                    "title": "Výstavní práce",
                    "description": "Práce připravené pro výstavu.",
                    "year": "2020",
                    "technique": "Výstavní"
                },
                {
                    "src": "newImages/IMG-20200629-WA0011.jpg",
                    "title": "Kaligrafické techniky",
                    "description": "Ukázka různých kaligrafických technik.",
                    "year": "2020",
                    "technique": "Techniky"
                },
                {
                    "src": "newImages/IMG-20200703-WA0019.jpg",
                    "title": "Japonská kaligrafie",
                    "description": "Tradiční japonská kaligrafie.",
                    "year": "2020",
                    "technique": "Šodó"
                },
                {
                    "src": "newImages/IMG-20200703-WA0021.jpg",
                    "title": "Moderní interpretace",
                    "description": "Moderní interpretace tradičních znaků.",
                    "year": "2020",
                    "technique": "Moderní"
                },
                {
                    "src": "newImages/IMG-20210623-WA0007.jpg",
                    "title": "Kaligrafické dílo",
                    "description": "Kaligrafické dílo z roku 2021.",
                    "year": "2021",
                    "technique": "Kaligrafie"
                },
                {
                    "src": "newImages/IMG-20210623-WA0017.jpg",
                    "title": "Tradiční styl",
                    "description": "Tradiční styl japonské kaligrafie.",
                    "year": "2021",
                    "technique": "Tradiční"
                },
                {
                    "src": "newImages/IMG-20210623-WA0019.jpg",
                    "title": "Umělecká kaligrafie",
                    "description": "Umělecká kaligrafie jako forma výrazu.",
                    "year": "2021",
                    "technique": "Umělecká"
                },
                {
                    "src": "newImages/IMG-20210623-WA0033.jpg",
                    "title": "Kaligrafické cvičení",
                    "description": "Cvičení pro zlepšení techniky.",
                    "year": "2021",
                    "technique": "Cvičení"
                },
                {
                    "src": "newImages/IMG-20210623-WA0034.jpg",
                    "title": "Detailní práce",
                    "description": "Detailní pohled na kaligrafickou práci.",
                    "year": "2021",
                    "technique": "Detail"
                },
                {
                    "src": "newImages/IMG-20210623-WA0035.jpg",
                    "title": "Experimentální přístup",
                    "description": "Experimentální přístup k kaligrafii.",
                    "year": "2021",
                    "technique": "Experimentální"
                },
                {
                    "src": "newImages/IMG-20210623-WA0036.jpg",
                    "title": "Výstavní dílo",
                    "description": "Dílo připravené pro výstavu.",
                    "year": "2021",
                    "technique": "Výstavní"
                },
                {
                    "src": "newImages/IMG-20210623-WA0037.jpg",
                    "title": "Kaligrafické techniky",
                    "description": "Různé kaligrafické techniky.",
                    "year": "2021",
                    "technique": "Techniky"
                },
                {
                    "src": "newImages/IMG-20210623-WA0038.jpg",
                    "title": "Japonská kaligrafie",
                    "description": "Tradiční japonská kaligrafie.",
                    "year": "2021",
                    "technique": "Šodó"
                },
                {
                    "src": "newImages/IMG-20220630-WA0001.jpg",
                    "title": "Moderní kaligrafie",
                    "description": "Moderní přístup k kaligrafii.",
                    "year": "2022",
                    "technique": "Moderní"
                },
                {
                    "src": "newImages/IMG-20220630-WA0004.jpg",
                    "title": "Tradiční znaky",
                    "description": "Klasické japonské znaky.",
                    "year": "2022",
                    "technique": "Tradiční"
                },
                {
                    "src": "newImages/IMG-20220630-WA0005.jpg",
                    "title": "Kaligrafické umění",
                    "description": "Umělecké dílo vytvořené kaligrafií.",
                    "year": "2022",
                    "technique": "Umělecké"
                },
                {
                    "src": "newImages/IMG-20220630-WA0006.jpg",
                    "title": "Detailní práce",
                    "description": "Detailní pohled na kaligrafickou práci.",
                    "year": "2022",
                    "technique": "Detail"
                },
                {
                    "src": "newImages/IMG-20220701-WA0001.jpg",
                    "title": "Experimentální kaligrafie",
                    "description": "Experimentální přístup k kaligrafii.",
                    "year": "2022",
                    "technique": "Experimentální"
                },
                {
                    "src": "newImages/IMG-20220701-WA0002.jpg",
                    "title": "Výstavní práce",
                    "description": "Práce připravené pro výstavu.",
                    "year": "2022",
                    "technique": "Výstavní"
                },
                {
                    "src": "newImages/IMG-20220701-WA0012.jpg",
                    "title": "Kaligrafické techniky",
                    "description": "Různé kaligrafické techniky.",
                    "year": "2022",
                    "technique": "Techniky"
                },
                {
                    "src": "newImages/IMG-20220821-WA0019.jpg",
                    "title": "Japonská kaligrafie",
                    "description": "Tradiční japonská kaligrafie.",
                    "year": "2022",
                    "technique": "Šodó"
                },
                {
                    "src": "newImages/IMG-20221201-WA0022.jpg",
                    "title": "Moderní interpretace",
                    "description": "Moderní interpretace tradičních znaků.",
                    "year": "2022",
                    "technique": "Moderní"
                },
                {
                    "src": "newImages/IMG-20221221-WA0003.jpg",
                    "title": "Tradiční styl",
                    "description": "Tradiční styl japonské kaligrafie.",
                    "year": "2022",
                    "technique": "Tradiční"
                },
                {
                    "src": "newImages/IMG-20221221-WA0005.jpg",
                    "title": "Umělecká kaligrafie",
                    "description": "Umělecká kaligrafie jako forma výrazu.",
                    "year": "2022",
                    "technique": "Umělecká"
                },
                {
                    "src": "newImages/IMG-20230107-WA0016.jpg",
                    "title": "Kaligrafické cvičení",
                    "description": "Cvičení pro zlepšení techniky.",
                    "year": "2023",
                    "technique": "Cvičení"
                },
                {
                    "src": "newImages/IMG-20230114-WA0009.jpg",
                    "title": "Detailní práce",
                    "description": "Detailní pohled na kaligrafickou práci.",
                    "year": "2023",
                    "technique": "Detail"
                },
                {
                    "src": "newImages/IMG-20230322-WA0003.jpg",
                    "title": "Experimentální přístup",
                    "description": "Experimentální přístup k kaligrafii.",
                    "year": "2023",
                    "technique": "Experimentální"
                },
                {
                    "src": "newImages/IMG-20230331-WA0025.jpg",
                    "title": "Výstavní dílo",
                    "description": "Dílo připravené pro výstavu.",
                    "year": "2023",
                    "technique": "Výstavní"
                },
                {
                    "src": "newImages/IMG-20230331-WA0026.jpg",
                    "title": "Kaligrafické techniky",
                    "description": "Různé kaligrafické techniky.",
                    "year": "2023",
                    "technique": "Techniky"
                },
                {
                    "src": "newImages/IMG-20230425-WA0014.jpg",
                    "title": "Japonská kaligrafie",
                    "description": "Tradiční japonská kaligrafie.",
                    "year": "2023",
                    "technique": "Šodó"
                },
                {
                    "src": "newImages/IMG-20230425-WA0019.jpg",
                    "title": "Moderní kaligrafie",
                    "description": "Moderní přístup k kaligrafii.",
                    "year": "2023",
                    "technique": "Moderní"
                },
                {
                    "src": "newImages/IMG-20230425-WA0020.jpg",
                    "title": "Tradiční znaky",
                    "description": "Klasické japonské znaky.",
                    "year": "2023",
                    "technique": "Tradiční"
                },
                {
                    "src": "newImages/IMG-20230425-WA0025.jpg",
                    "title": "Kaligrafické umění",
                    "description": "Umělecké dílo vytvořené kaligrafií.",
                    "year": "2023",
                    "technique": "Umělecké"
                },
                {
                    "src": "newImages/IMG-20230425-WA0046.jpg",
                    "title": "Detailní práce",
                    "description": "Detailní pohled na kaligrafickou práci.",
                    "year": "2023",
                    "technique": "Detail"
                },
                {
                    "src": "newImages/IMG-20230425-WA0048.jpg",
                    "title": "Experimentální kaligrafie",
                    "description": "Experimentální přístup k kaligrafii.",
                    "year": "2023",
                    "technique": "Experimentální"
                },
                {
                    "src": "newImages/IMG-20230425-WA0066.jpg",
                    "title": "Výstavní práce",
                    "description": "Práce připravené pro výstavu.",
                    "year": "2023",
                    "technique": "Výstavní"
                },
                {
                    "src": "newImages/IMG-20230425-WA0068.jpg",
                    "title": "Kaligrafické techniky",
                    "description": "Různé kaligrafické techniky.",
                    "year": "2023",
                    "technique": "Techniky"
                },
                {
                    "src": "newImages/IMG-20230427-WA0008.jpg",
                    "title": "Japonská kaligrafie",
                    "description": "Tradiční japonská kaligrafie.",
                    "year": "2023",
                    "technique": "Šodó"
                },
                {
                    "src": "newImages/IMG-20230427-WA0023.jpg",
                    "title": "Moderní interpretace",
                    "description": "Moderní interpretace tradičních znaků.",
                    "year": "2023",
                    "technique": "Moderní"
                },
                {
                    "src": "newImages/IMG-20230427-WA0027.jpg",
                    "title": "Tradiční styl",
                    "description": "Tradiční styl japonské kaligrafie.",
                    "year": "2023",
                    "technique": "Tradiční"
                },
                {
                    "src": "newImages/IMG-20230427-WA0028.jpg",
                    "title": "Umělecká kaligrafie",
                    "description": "Umělecká kaligrafie jako forma výrazu.",
                    "year": "2023",
                    "technique": "Umělecká"
                },
                {
                    "src": "newImages/IMG-20230428-WA0011.jpg",
                    "title": "Kaligrafické cvičení",
                    "description": "Cvičení pro zlepšení techniky.",
                    "year": "2023",
                    "technique": "Cvičení"
                },
                {
                    "src": "newImages/IMG-20230428-WA0015.jpg",
                    "title": "Detailní práce",
                    "description": "Detailní pohled na kaligrafickou práci.",
                    "year": "2023",
                    "technique": "Detail"
                },
                {
                    "src": "newImages/IMG-20230428-WA0017.jpg",
                    "title": "Experimentální přístup",
                    "description": "Experimentální přístup k kaligrafii.",
                    "year": "2023",
                    "technique": "Experimentální"
                },
                {
                    "src": "newImages/IMG-20230513-WA0014.jpg",
                    "title": "Výstavní dílo",
                    "description": "Dílo připravené pro výstavu.",
                    "year": "2023",
                    "technique": "Výstavní"
                },
                {
                    "src": "newImages/IMG-20230513-WA0019.jpg",
                    "title": "Kaligrafické techniky",
                    "description": "Různé kaligrafické techniky.",
                    "year": "2023",
                    "technique": "Techniky"
                },
                {
                    "src": "newImages/IMG-20231006-WA0018.jpg",
                    "title": "Japonská kaligrafie",
                    "description": "Tradiční japonská kaligrafie.",
                    "year": "2023",
                    "technique": "Šodó"
                },
                {
                    "src": "newImages/IMG-20231007-WA0032.jpg",
                    "title": "Moderní kaligrafie",
                    "description": "Moderní přístup k kaligrafii.",
                    "year": "2023",
                    "technique": "Moderní"
                },
                {
                    "src": "newImages/IMG-20231007-WA0054.jpg",
                    "title": "Tradiční znaky",
                    "description": "Klasické japonské znaky.",
                    "year": "2023",
                    "technique": "Tradiční"
                },
                {
                    "src": "newImages/IMG-20231007-WA0058.jpg",
                    "title": "Kaligrafické umění",
                    "description": "Umělecké dílo vytvořené kaligrafií.",
                    "year": "2023",
                    "technique": "Umělecké"
                },
                {
                    "src": "newImages/IMG-20231008-WA0033.jpg",
                    "title": "Detailní práce",
                    "description": "Detailní pohled na kaligrafickou práci.",
                    "year": "2023",
                    "technique": "Detail"
                },
                {
                    "src": "newImages/IMG-20231008-WA0034.jpg",
                    "title": "Experimentální kaligrafie",
                    "description": "Experimentální přístup k kaligrafii.",
                    "year": "2023",
                    "technique": "Experimentální"
                },
                {
                    "src": "newImages/IMG-20231008-WA0036.jpg",
                    "title": "Výstavní práce",
                    "description": "Práce připravené pro výstavu.",
                    "year": "2023",
                    "technique": "Výstavní"
                },

                // Obrázky ze složky gallery
                {
                    "src": "gallery/101A0096a.png",
                    "title": "Kaligrafické dílo",
                    "description": "Tradiční japonská kaligrafie.",
                    "year": "2024",
                    "technique": "Šodó"
                },
                {
                    "src": "gallery/20231014_161450.png",
                    "title": "Umělecká kaligrafie",
                    "description": "Umělecká kaligrafie jako forma výrazu.",
                    "year": "2023",
                    "technique": "Umělecká"
                },
                {
                    "src": "gallery/67071542_2223611747758593_3295359420732538880_n.png",
                    "title": "Kaligrafické cvičení",
                    "description": "Cvičení pro zlepšení techniky.",
                    "year": "2024",
                    "technique": "Cvičení"
                },
                {
                    "src": "gallery/FB_IMG_1742308140423.png",
                    "title": "Detailní práce",
                    "description": "Detailní pohled na kaligrafickou práci.",
                    "year": "2024",
                    "technique": "Detail"
                },
                {
                    "src": "gallery/FB_IMG_1742308152536.png",
                    "title": "Experimentální přístup",
                    "description": "Experimentální přístup k kaligrafii.",
                    "year": "2024",
                    "technique": "Experimentální"
                },
                {
                    "src": "gallery/holky.png",
                    "title": "Výstavní dílo",
                    "description": "Dílo připravené pro výstavu.",
                    "year": "2024",
                    "technique": "Výstavní"
                },
                {
                    "src": "gallery/IMG_9641.png",
                    "title": "Kaligrafické techniky",
                    "description": "Různé kaligrafické techniky.",
                    "year": "2024",
                    "technique": "Techniky"
                },
                {
                    "src": "gallery/IMG-20241109-WA0024.png",
                    "title": "Japonská kaligrafie",
                    "description": "Tradiční japonská kaligrafie.",
                    "year": "2024",
                    "technique": "Šodó"
                },
                {
                    "src": "gallery/Lucerna2.png",
                    "title": "Moderní kaligrafie",
                    "description": "Moderní přístup k kaligrafii.",
                    "year": "2024",
                    "technique": "Moderní"
                },
                {
                    "src": "gallery/petra.png",
                    "title": "Portrétní kaligrafie",
                    "description": "Portrétní kaligrafické dílo.",
                    "year": "2024",
                    "technique": "Portrét"
                },
                {
                    "src": "gallery/PHOTO-2025-03-15-12-11-39.png",
                    "title": "Nejnovější dílo",
                    "description": "Nejnovější kaligrafické dílo.",
                    "year": "2025",
                    "technique": "Nejnovější"
                }

            ]
        };
    }

    setupProgressiveLoading() {
        if (!this.galleryData || !this.galleryData.images) return;

        const galleryContainer = document.querySelector('.m-p-g__thumbs');
        if (!galleryContainer) return;

        console.log('GalleryDataManager: Setting up progressive loading for', this.galleryData.images.length, 'images');

        // Načíst první batch okamžitě
        this.loadNextBatch().then(() => {
            console.log('GalleryDataManager: First batch loaded, setting up scroll loading');
            this.setupScrollLoading();
        }).catch(error => {
            console.warn('GalleryDataManager: Error loading first batch:', error);
        });
    }

    loadNextBatch() {
        return new Promise((resolve, reject) => {
            if (!this.galleryData || !this.galleryData.images) {
                console.log('GalleryDataManager: No gallery data available');
                resolve();
                return;
            }

            const startIndex = this.currentBatch * this.batchSize;
            const endIndex = Math.min(startIndex + this.batchSize, this.galleryData.images.length);

            if (startIndex >= this.galleryData.images.length) {
                console.log('GalleryDataManager: All batches loaded');
                resolve();
                return;
            }

            console.log(`GalleryDataManager: Loading batch ${this.currentBatch + 1}, images ${startIndex + 1}-${endIndex}`);

            const batch = this.galleryData.images.slice(startIndex, endIndex);

            try {
                this.renderImageBatch(batch);
                this.currentBatch++;
                console.log(`GalleryDataManager: Batch ${this.currentBatch} loaded successfully`);
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

        console.log(`GalleryDataManager: Rendering batch ${this.currentBatch}, ${images.length} images, inEnFolder: ${isInEnFolder}`);

        images.forEach(imageData => {
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
            imgElement.src = imageSrc;
            imgElement.dataset.full = imageSrc;
            imgElement.className = 'm-p-g__thumbs-img lazy-image';
            imgElement.alt = imageData.title || 'Japonská kaligrafie';

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

            galleryContainer.appendChild(imgElement);
            this.loadedImages.add(imageSrc);

            console.log(`GalleryDataManager: Loaded image ${this.loadedImages.size}/${this.galleryData.images.length}: ${imageSrc}`);
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
            setTimeout(() => {
                if (infoPanel) {
                    infoPanel.style.opacity = '0';
                    setTimeout(() => {
                        if (infoPanel && infoPanel.parentNode) {
                            infoPanel.parentNode.removeChild(infoPanel);
                        }
                    }, 1000);
                }
            }, 2000);
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
                console.log('GalleryDataManager: All images loaded, stopping scroll loading');
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
                    console.log(`GalleryDataManager: Loading more images. Loaded: ${loadedImages}/${totalImages}`);
                    isLoading = true;
                    this.loadNextBatch().then(() => {
                        isLoading = false;
                        // Zkusit načíst další batch okamžitě
                        setTimeout(loadMoreImages, 100);
                    }).catch(error => {
                        console.warn('GalleryDataManager: Error loading batch:', error);
                        isLoading = false;
                    });
                }
            } catch (error) {
                console.warn('GalleryDataManager: Error getting container rect:', error);
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
                console.log(`GalleryDataManager: Scroll loading seems stuck at ${loadedImages}/${totalImages}, loading all images progressively`);
                this.loadAllImagesProgressively();
            }
        }, 5000);

        // Agresivnější načítání - pokud je načteno méně než polovina, načti vše postupně
        setTimeout(() => {
            const totalImages = this.galleryData.images.length;
            const loadedImages = this.loadedImages.size;

            if (loadedImages < totalImages / 2) {
                console.log(`GalleryDataManager: Only ${loadedImages}/${totalImages} loaded, forcing progressive loading`);
                this.loadAllImagesProgressively();
            }
        }, 10000);
    }

    loadAllImagesProgressively() {
        console.log('GalleryDataManager: Starting progressive loading of all images');

        // Zajistit, že se neinicializuje vícekrát současně
        if (this.progressiveLoadingActive) {
            console.log('GalleryDataManager: Progressive loading already active');
            return;
        }
        this.progressiveLoadingActive = true;

        const loadNext = () => {
            const totalImages = this.galleryData.images.length;
            const loadedImages = this.loadedImages.size;

            if (loadedImages >= totalImages) {
                console.log('GalleryDataManager: All images loaded progressively');
                this.progressiveLoadingActive = false;
                return;
            }

            console.log(`GalleryDataManager: Progressive loading ${loadedImages + 1}-${Math.min(loadedImages + this.batchSize, totalImages)} of ${totalImages}`);

            this.loadNextBatch().then(() => {
                // Načíst další batch za 200ms
                setTimeout(loadNext, 200);
            }).catch(error => {
                console.error('GalleryDataManager: Error in progressive loading:', error);
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
                            console.log('Re-initializing MaterialPhotoGallery with', validImages.length, 'valid images');
                            // Počkat ještě déle, aby se obrázky správně vykreslily
                            setTimeout(() => {
                                try {
                                    if (gallery && gallery.parentNode && !gallery.dataset.initialized) {
                                        new MaterialPhotoGallery(gallery);
                                        gallery.dataset.initialized = 'true';
                                        console.log('MaterialPhotoGallery re-initialized successfully');
                                    }
                                } catch (initError) {
                                    console.error('Chyba při re-inicializaci galerie:', initError);
                                }
                            }, 1000); // Zvýšeno na 1 sekundu
                        } else {
                            console.log('Not enough valid images found for re-initialization (' + validImages.length + '), skipping...');
                        }
                    } catch (error) {
                        console.warn('Chyba při re-inicializaci galerie:', error);
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
    console.log('GalleryDataManager: DOM loaded, checking for gallery...');
    // Inicializovat data manager pouze na stránkách s galerií
    if (document.querySelector('.m-p-g')) {
        console.log('GalleryDataManager: Gallery found, initializing...');
        window.galleryDataManager = new GalleryDataManager();
    } else {
        console.log('GalleryDataManager: No gallery found on this page');
    }
});

// Export pro použití v jiných modulech
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GalleryDataManager;
}
