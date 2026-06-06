// ============================================
// УЛУЧШЕНИЯ ИНТЕРФЕЙСА - МОДУЛЬ
// ============================================

/**
 * Инициализация всех улучшений
 */
function initUIEnhancements() {
    console.log('🎨 Инициализация UI улучшений...');
    
    // Находим все карточки заведений и улучшаем их
    enhanceAllEstablishmentCards();
}

/**
 * Улучшение карточки заведения
 */
function enhanceEstablishmentCard(establishment, container) {
    // 1. Галерея изобраений
    if (establishment.images_local || establishment.images) {
        const galleryContainer = document.createElement('div');
        galleryContainer.className = 'image-gallery-container';
        container.appendChild(galleryContainer);
        
        initImageGallery(galleryContainer, establishment);
    }
    
    // 2. Особенности - аккордеон
    if (establishment.features) {
        const featuresContainer = document.createElement('div');
        featuresContainer.className = 'features-section';
        container.appendChild(featuresContainer);
        
        initFeaturesAccordion(featuresContainer, establishment.features);
    }
    
    // 3. Время работы + индикатор
    if (establishment.working_hours) {
        const hoursContainer = document.createElement('div');
        hoursContainer.className = 'working-hours-section';
        container.appendChild(hoursContainer);
        
        initWorkingHours(hoursContainer, establishment.working_hours);
    }
    
    // 4. Меню - аккордеон
    if (establishment.menu) {
        const menuContainer = document.createElement('div');
        menuContainer.className = 'menu-section';
        container.appendChild(menuContainer);
        
        initMenuAccordion(menuContainer, establishment.menu);
    }
    
    // 5. Соцсети - иконки
    if (establishment.social_links) {
        const socialContainer = document.createElement('div');
        socialContainer.className = 'social-links-container';
        container.appendChild(socialContainer);
        
        initSocialIcons(socialContainer, establishment.social_links);
    }
}

/**
 * 1. ГАЛЕРЕЯ ИЗОБРАЖЕНИЙ
 */
function initImageGallery(container, establishment) {
    const images = establishment.images_local || JSON.parse(establishment.images || '[]');
    
    if (!images || images.length === 0) return;
    
    let currentIndex = 0;
    
    const galleryHTML = `
        <div class="image-gallery">
            <div class="gallery-main" onclick="toggleLightbox(${currentIndex})">
                <img src="${getLocalImagePath(images[0])}" alt="Фото ${currentIndex + 1}" id="main-image">
                <button class="gallery-nav-btn prev" onclick="event.stopPropagation(); prevImage()">‹</button>
                <button class="gallery-nav-btn next" onclick="event.stopPropagation(); nextImage()">›</button>
                <div class="gallery-counter">1 / ${images.length}</div>
            </div>
            <div class="gallery-thumbnails">
                ${images.map((img, i) => `
                    <div class="gallery-thumbnail ${i === 0 ? 'active' : ''}" onclick="showImage(${i})">
                        <img src="${getLocalImagePath(img)}" alt="Миниатюра ${i + 1}">
                    </div>
                `).join('')}
            </div>
        </div>
        
        <!-- Lightbox -->
        <div class="gallery-lightbox" id="lightbox" onclick="closeLightbox()">
            <button class="gallery-close" onclick="event.stopPropagation(); closeLightbox()">×</button>
            <img src="" alt="Полноразмерное" id="lightbox-image">
        </div>
    `;
    
    container.innerHTML = galleryHTML;
    
    // Сохраняем данные для функций
    container.dataset.images = JSON.stringify(images);
    container.dataset.currentIndex = '0';
    
    // Добавляем touch события для свайпов
    initTouchSwipe(container);
}

function getLocalImagePath(imageObj) {
    // Если есть локальный путь, используем его
    if (imageObj.local_path) {
        return imageObj.local_path;
    }
    // Иначе используем preview
    return imageObj.preview || '';
}

function showImage(index) {
    const galleries = document.querySelectorAll('.image-gallery');
    galleries.forEach(gallery => {
        const images = JSON.parse(gallery.dataset.images || '[]');
        const thumbnails = gallery.querySelectorAll('.gallery-thumbnail');
        const mainImage = gallery.querySelector('#main-image');
        const counter = gallery.querySelector('.gallery-counter');
        
        if (index >= 0 && index < images.length) {
            gallery.dataset.currentIndex = index;
            
            // Обновляем основное изображение
            mainImage.src = getLocalImagePath(images[index]);
            mainImage.alt = `Фото ${index + 1}`;
            
            // Обновляем счетчик
            counter.textContent = `${index + 1} / ${images.length}`;
            
            // Обновляем активные миниатюры
            thumbnails.forEach((thumb, i) => {
                thumb.classList.toggle('active', i === index);
            });
        }
    });
}

function prevImage() {
    const galleries = document.querySelectorAll('.image-gallery');
    galleries.forEach(gallery => {
        const images = JSON.parse(gallery.dataset.images || '[]');
        const currentIndex = parseInt(gallery.dataset.currentIndex || '0');
        const newIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1;
        showImage(newIndex);
    });
}

function nextImage() {
    const galleries = document.querySelectorAll('.image-gallery');
    galleries.forEach(gallery => {
        const images = JSON.parse(gallery.dataset.images || '[]');
        const currentIndex = parseInt(gallery.dataset.currentIndex || '0');
        const newIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0;
        showImage(newIndex);
    });
}

function toggleLightbox(index) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-image');
    const galleries = document.querySelectorAll('.image-gallery');
    
    galleries.forEach(gallery => {
        const images = JSON.parse(gallery.dataset.images || '[]');
        const currentIndex = parseInt(gallery.dataset.currentIndex || index);
        
        if (images[currentIndex]) {
            lightboxImg.src = getLocalImagePath(images[currentIndex]);
            lightbox.classList.add('active');
        }
    });
}

function closeLightbox() {
    document.getElementById('lightbox').classList.remove('active');
}

// Touch события для свайпов
function initTouchSwipe(container) {
    let touchStartX = 0;
    let touchEndX = 0;
    
    const gallery = container.querySelector('.gallery-main');
    
    gallery.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    gallery.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        
        if (touchStartX - touchEndX > swipeThreshold) {
            nextImage(); // Свайп влево
        }
        if (touchEndX - touchStartX > swipeThreshold) {
            prevImage(); // Свайп вправо
        }
    }
}

/**
 * 2. ОСОБЕННОСТИ - АККОРДЕОН
 */
function initFeaturesAccordion(container, featuresString) {
    try {
        const featuresArray = JSON.parse(featuresString);
        
        if (!featuresArray || featuresArray.length === 0) return;
        
        // Группируем особенности по категориям
        const grouped = groupFeaturesByCategory(featuresArray);
        
        // Топ-5 популярных
        const topFeatures = featuresArray.slice(0, 5);
        
        let html = `
            <div class="features-header" onclick="toggleFeatures(this)">
                <h3>Особенности</h3>
                <span class="toggle-icon">▼</span>
            </div>
            <div class="features-content">
                <div class="features-top">
                    ${topFeatures.map(f => `<span class="feature-tag">${f}</span>`).join('')}
                </div>
        `;
        
        // Категории
        Object.entries(grouped).forEach(([category, features]) => {
            html += `
                <details class="feature-category">
                    <summary>
                        ${category}
                        <span class="feature-count">${features.length}</span>
                    </summary>
                    <div class="feature-category-content">
                        ${features.map(f => `<span class="feature-tag-small">${f}</span>`).join('')}
                    </div>
                </details>
            `;
        });
        
        html += '</div>';
        container.innerHTML = html;
        
    } catch(e) {
        console.error('Ошибка обработки особенностей:', e);
    }
}

function groupFeaturesByCategory(features) {
    // Простая группировка по первым буквам
    // В будущем можно сделать умную категоризацию
    const groups = {};
    
    features.forEach(feature => {
        const firstLetter = feature.charAt(0).toUpperCase();
        if (!groups[firstLetter]) {
            groups[firstLetter] = [];
        }
        groups[firstLetter].push(feature);
    });
    
    return groups;
}

function toggleFeatures(header) {
    const content = header.nextElementSibling;
    const icon = header.querySelector('.toggle-icon');
    
    if (content.style.maxHeight) {
        content.style.maxHeight = null;
        icon.classList.remove('rotated');
    } else {
        content.style.maxHeight = content.scrollHeight + "px";
        icon.classList.add('rotated');
    }
}

/**
 * 3. ВРЕМЯ РАБОТЫ С ИНДИКАТОРОМ
 */
function initWorkingHours(container, hoursString) {
    try {
        const hoursArray = JSON.parse(hoursString);
        
        if (!hoursArray || hoursArray.length === 0) return;
        
        const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
        const today = new Date().getDay();
        const todayIndex = today === 0 ? 6 : today - 1;
        
        // Проверяем, открыто ли сейчас
        const isOpenNow = checkIfOpenNow(hoursArray[todayIndex]);
        
        let html = `
            <div class="working-hours-header">
                <h3>Часы работы</h3>
                <span class="status-badge ${isOpenNow ? 'open' : 'closed'}">
                    ${isOpenNow ? '✓ Открыто сейчас' : '✗ Закрыто'}
                </span>
            </div>
            <ul class="hours-list">
        `;
        
        hoursArray.forEach((hours, index) => {
            const isToday = index === todayIndex;
            html += `
                <li class="${isToday ? 'today' : ''}">
                    <span class="hours-day">${isToday ? 'Сегодня' : days[index]}</span>
                    <span class="hours-time">${hours}</span>
                </li>
            `;
        });
        
        html += '</ul>';
        container.innerHTML = html;
        
    } catch(e) {
        console.error('Ошибка обработки времени работы:', e);
    }
}

function checkIfOpenNow(hoursString) {
    if (!hoursString) return false;
    
    try {
        const [openTime, closeTime] = hoursString.split('-');
        const now = new Date();
        const currentTime = now.getHours() * 60 + now.getMinutes();
        
        const [openHour, openMin] = openTime.split(':').map(Number);
        const [closeHour, closeMin] = closeTime.split(':').map(Number);
        
        const openMinutes = openHour * 60 + openMin;
        let closeMinutes = closeHour * 60 + closeMin;
        
        // Если заведение работает после полуночи
        if (closeMinutes < openMinutes) {
            closeMinutes += 24 * 60;
            if (currentTime < openMinutes) {
                return currentTime <= closeMinutes - 24 * 60;
            }
        }
        
        return currentTime >= openMinutes && currentTime <= closeMinutes;
    } catch(e) {
        return false;
    }
}

/**
 * 4. МЕНЮ - АККОРДЕОН
 */
function initMenuAccordion(container, menuString) {
    try {
        const menuData = JSON.parse(menuString);
        
        if (!menuData || Object.keys(menuData).length === 0) return;
        
        let html = '<h3>Меню</h3><div class="menu-categories">';
        
        Object.entries(menuData).forEach(([category, items]) => {
            html += `
                <details class="menu-category" open>
                    <summary>
                        ${category}
                        <span class="menu-count">${items.length}</span>
                    </summary>
                    <ul class="menu-items">
                        ${items.map(item => `
                            <li class="menu-item">
                                <span class="menu-item-name">${item.name || item}</span>
                                <span class="menu-item-price">${formatPrice(item.price || item.cost)}</span>
                            </li>
                        `).join('')}
                    </ul>
                </details>
            `;
        });
        
        html += '</div>';
        container.innerHTML = html;
        
    } catch(e) {
        console.error('Ошибка обработки меню:', e);
    }
}

function formatPrice(price) {
    if (!price) return '';
    return `${price} ₽`;
}

/**
 * 5. СОЦСЕТИ - ИКОНКИ
 */
function initSocialIcons(container, socialString) {
    try {
        const socialData = JSON.parse(socialString);
        
        if (!socialData || Object.keys(socialData).length === 0) return;
        
        const icons = {
            'vk': '<svg viewBox="0 0 24 24"><path d="M15.073 2H8.937C5.001 2 2 5.001 2 8.937v6.125C2 18.999 5.001 22 8.937 22h6.125C18.999 22 22 18.999 22 15.062V8.937C22 5.001 18.999 2 15.073 2zM17.9 13.2c.6.6.6.6 1.2.6h.6v1.6c0 .6-.6.6-1.2.6h-1.2c-.6 0-1.2-.6-1.8-.6-.6-.6-1.2-.6-1.8 0s-1.2.6-1.8.6h-.6c-.6 0-1.2-.6-1.2-1.2v-3c0-.6.6-1.2 1.2-1.2h.6c.6 0 1.2.6 1.2 1.2v1.2c0 .6.6.6.6.6.6 0 1.2-.6 1.2-1.2V9.8c0-1.2-.6-1.8-1.8-1.8h-1.2c-1.2 0-1.8.6-1.8 1.8v1.2c0 .6-.6 1.2-1.2 1.2H8.3c-.6 0-1.2-.6-1.2-1.2V9.8c0-1.2.6-1.8 1.8-1.8h1.2c1.2 0 1.8.6 1.8 1.8v1.2c0 .6.6 1.2 1.2 1.2.6 0 1.2-.6 1.2-1.2V9.8c0-1.2.6-1.8 1.8-1.8h1.2c1.2 0 1.8.6 1.8 1.8v2.4c0 .6 0 1.2.6 1.2z"/></svg>',
            'telegram': '<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.11.02-1.91 1.21-5.4 3.56-.51.35-.98.52-1.4.51-.46-.01-1.35-.26-2.01-.48-.81-.27-1.46-.42-1.4-.88.03-.24.37-.49 1.03-.74 4.04-1.76 6.74-2.92 8.09-3.48 3.85-1.6 4.64-1.88 5.17-1.88.11 0 .37.03.54.17.14.12.18.28.2.45-.01.07-.01.13-.02.2z"/></svg>',
            'youtube': '<svg viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>'
        };
        
        let html = '<div class="social-links">';
        
        Object.entries(socialData).forEach(([platform, url]) => {
            const iconSvg = icons[platform.toLowerCase()] || icons['vk'];
            html += `
                <a href="${url}" class="social-icon ${platform.toLowerCase()}" target="_blank" title="${platform}">
                    ${iconSvg}
                </a>
            `;
        });
        
        html += '</div>';
        container.innerHTML = html;
        
    } catch(e) {
        console.error('Ошибка обработки соцсетей:', e);
    }
}

// Автозапуск при загрузке страницы
document.addEventListener('DOMContentLoaded', initUIEnhancements);
