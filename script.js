// Глобальные переменные для хранения данных
let cities = [];
let categories = [];
let establishments = [];
let currentCityId = null;
let currentCategoryId = null;
let currentEstablishment = null;

// Загрузка данных из JSON файлов
async function loadData() {
    try {
        // Загружаем города
        const citiesResponse = await fetch('data/1-cities.json');
        cities = await citiesResponse.json();
        
        // Загружаем категории
        const categoriesResponse = await fetch('data/2-categories.json');
        categories = await categoriesResponse.json();
        
        // Отображаем города при загрузке
        displayCities();
        
        // Отображаем категории при загрузке
        displayCategories();
        
        // Настройка обработчиков событий
        setupEventListeners();
    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
    }
}

// Настройка обработчиков событий
function setupEventListeners() {
    document.getElementById('cities-link').addEventListener('click', (e) => {
        e.preventDefault();
        showSection('cities-section');
    });
    
    document.getElementById('categories-link').addEventListener('click', (e) => {
        e.preventDefault();
        showSection('categories-section');
    });
    
    // Обработчик для фильтрации поиска
    document.getElementById('search-input').addEventListener('input', filterEstablishments);
    
    // Обработчик для фильтрации по категории
    document.getElementById('category-filter').addEventListener('change', filterEstablishments);
    
    // Обработчик для кнопки "Назад к списку"
    document.getElementById('back-to-list').addEventListener('click', (e) => {
        e.preventDefault();
        showSection('establishments-section');
    });
}

// Показ определенной секции
function showSection(sectionId) {
    // Скрываем все секции
    document.querySelectorAll('section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Показываем выбранную секцию
    document.getElementById(sectionId).classList.add('active');
    
    // Если показываем секцию заведений, обновляем список
    if (sectionId === 'establishments-section') {
        if (currentCityId) {
            // Если установлен текущий город, загружаем заведения для этого города
            loadEstablishmentsForCity(currentCityId);
        } else if (currentCategoryId) {
            // Если установлен фильтр по категории, загружаем заведения по категории
            loadAllEstablishmentsByCategory(currentCategoryId);
        }
    }
    
    // Если показываем детальную страницу, отображаем текущее заведение
    if (sectionId === 'establishment-detail-section' && currentEstablishment) {
        displayEstablishmentDetail(currentEstablishment);
    }
}

// Отображение списка городов
function displayCities() {
    const citiesContainer = document.getElementById('cities-list');
    citiesContainer.innerHTML = '';
    
    cities.forEach(city => {
        const cityCard = document.createElement('div');
        cityCard.className = 'city-card';
        cityCard.innerHTML = `
            <h3>${city.name}</h3>
            <p>Заведений: ${city.weight}</p>
        `;
        cityCard.addEventListener('click', () => {
            currentCityId = city.id;
            loadEstablishmentsForCity(city.id);
            showSection('establishments-section');
            document.getElementById('establishments-title').textContent = `Заведения в ${city.name}`;
        });
        citiesContainer.appendChild(cityCard);
    });
}

// Отображение списка категорий
function displayCategories() {
    const categoriesContainer = document.getElementById('categories-list');
    categoriesContainer.innerHTML = '';
    
    categories.forEach(category => {
        const categoryCard = document.createElement('div');
        categoryCard.className = 'category-card';
        categoryCard.innerHTML = `
            <i class="material-icons">${category.icon}</i>
            <h3>${category.name}</h3>
            <p>${category.description}</p>
        `;
        categoryCard.addEventListener('click', () => {
            currentCategoryId = category.id;
            loadAllEstablishmentsByCategory(category.id);
            document.getElementById('establishments-title').textContent = `Заведения в категории "${category.name}"`;
        });
        categoriesContainer.appendChild(categoryCard);
    });
}

// Загрузка заведений по категории из всех городов
async function loadAllEstablishmentsByCategory(categoryId) {
    try {
        // Показываем секцию заведений
        showSection('establishments-section');
        
        // Сбрасываем текущий город, так как показываем заведения из всех городов
        currentCityId = null;
        
        // Собираем заведения из всех городов
        let allEstablishments = [];
        
        for (const city of cities) {
            try {
                const response = await fetch(`data/${city.slug}.json`);
                if (response.ok) {
                    const cityEstablishments = await response.json();
                    // Фильтруем заведения по выбранной категории
                    const categoryEstablishments = cityEstablishments.filter(est => est.category_id === categoryId);
                    allEstablishments = allEstablishments.concat(categoryEstablishments);
                }
            } catch (error) {
                console.warn(`Не удалось загрузить заведения для города ${city.name}:`, error);
                // Продолжаем с другими городами
            }
        }
        
        // Сохраняем все заведения по категории
        establishments = allEstablishments;
        
        // Обновляем фильтр категорий - учитываем, что мы уже фильтруем по категории
        updateCategoryFilter();
        
        // Отображаем заведения
        displayEstablishments(establishments);
    } catch (error) {
        console.error('Ошибка загрузки заведений по категории:', error);
        document.getElementById('establishments-list').innerHTML = '<p>Ошибка загрузки данных</p>';
    }
}

// Загрузка заведений для конкретного города
async function loadEstablishmentsForCity(cityId) {
    try {
        // Определяем имя файла по ID города
        const cityName = cities.find(city => city.id === cityId)?.slug;
        if (!cityName) return;
        
        // Загружаем заведения для выбранного города
        const response = await fetch(`data/${cityName}.json`);
        if (!response.ok) {
            throw new Error(`Не удалось загрузить данные для ${cityName}`);
        }
        
        establishments = await response.json();
        
        // Обновляем фильтр категорий
        updateCategoryFilter();
        
        // Отображаем заведения
        displayEstablishments(establishments);
    } catch (error) {
        console.error('Ошибка загрузки заведений:', error);
        document.getElementById('establishments-list').innerHTML = '<p>Ошибка загрузки данных</p>';
    }
}

// Обновление фильтра категорий
function updateCategoryFilter() {
    const categoryFilter = document.getElementById('category-filter');
    categoryFilter.innerHTML = '<option value="">Все категории</option>';
    
    // Создаем объект для отслеживания уникальных категорий
    const uniqueCategories = {};
    
    establishments.forEach(est => {
        if (est.category_id && !uniqueCategories[est.category_id]) {
            const category = categories.find(cat => cat.id === est.category_id);
            if (category) {
                uniqueCategories[est.category_id] = category;
                const option = document.createElement('option');
                option.value = est.category_id;
                option.textContent = category.name;
                categoryFilter.appendChild(option);
            }
        }
    });
    
    // Если есть текущая категория фильтра, восстанавливаем её
    if (currentCategoryId) {
        categoryFilter.value = currentCategoryId;
    }
}

// Отображение списка заведений
function displayEstablishments(establishmentsToDisplay) {
    const establishmentsContainer = document.getElementById('establishments-list');
    establishmentsContainer.innerHTML = '';
    
    if (!establishmentsToDisplay || establishmentsToDisplay.length === 0) {
        establishmentsContainer.innerHTML = '<p>Заведения не найдены</p>';
        return;
    }
    
    establishmentsToDisplay.forEach(est => {
        const establishmentCard = document.createElement('div');
        establishmentCard.className = 'establishment-card';
        
        // Получаем информацию о категории
        const category = categories.find(cat => cat.id === est.category_id);
        const categoryName = category ? category.name : 'Не указана';
        
        establishmentCard.innerHTML = `
            <h3>${est.name || 'Название не указано'}</h3>
            <p><strong>Адрес:</strong> ${est.address || 'Не указан'}</p>
            <p><strong>Телефон:</strong> ${est.phone || 'Не указан'}</p>
            <p><strong>Категория:</strong> ${categoryName}</p>
            <p><strong>Рейтинг:</strong> <span class="rating">${est.rating || 'Нет рейтинга'}</span></p>
            <p><strong>Отзывов:</strong> ${est.review_count || 0}</p>
        `;
        
        // Добавляем обработчик клика для перехода к детальной странице
        establishmentCard.addEventListener('click', () => {
            currentEstablishment = est;
            showSection('establishment-detail-section');
        });
        
        establishmentsContainer.appendChild(establishmentCard);
    });
}

// Фильтрация заведений
function filterEstablishments() {
    if (!establishments || establishments.length === 0) return;
    
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const selectedCategoryId = parseInt(document.getElementById('category-filter').value) || null;
    
    let filtered = establishments.filter(est => {
        // Поиск по названию
        const matchesSearch = !searchTerm || 
            (est.name && est.name.toLowerCase().includes(searchTerm)) ||
            (est.address && est.address.toLowerCase().includes(searchTerm));
        
        // Фильтрация по категории
        const matchesCategory = !selectedCategoryId || est.category_id === selectedCategoryId;
        
        return matchesSearch && matchesCategory;
    });
    
    displayEstablishments(filtered);
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    
    // Вызываем отображение категорий при загрузке данных
    // Это произойдет после загрузки данных в функции loadData
});

// Функция для отображения детальной информации о заведении
function displayEstablishmentDetail(establishment) {
    // Устанавливаем основную информацию
    document.getElementById('detail-name').textContent = establishment.name || 'Название не указано';
    document.getElementById('detail-rating').textContent = establishment.rating || 'Нет рейтинга';
    document.getElementById('detail-review-count').textContent = `(${establishment.review_count || 0} отзывов)`;
    
    // Устанавливаем категорию
    const category = categories.find(cat => cat.id === establishment.category_id);
    document.getElementById('detail-category').textContent = category ? category.name : 'Категория не указана';
    
    // Устанавливаем контактную информацию
    document.getElementById('detail-address').textContent = establishment.address || 'Адрес не указан';
    document.getElementById('detail-phone').textContent = establishment.phone || 'Телефон не указан';
    document.getElementById('detail-website').textContent = establishment.website || 'Сайт не указан';
    
    // Устанавливаем описание
    document.getElementById('detail-description').textContent = establishment.description || 'Описание отсутствует';
    
    // Устанавливаем часы работы
    const workingHoursList = document.getElementById('detail-working-hours');
    workingHoursList.innerHTML = '';
    if (establishment.working_hours) {
        try {
            const hoursArray = JSON.parse(establishment.working_hours);
            hoursArray.forEach(hour => {
                const hourItem = document.createElement('li');
                hourItem.textContent = hour;
                workingHoursList.appendChild(hourItem);
            });
        } catch (e) {
            console.error('Ошибка при разборе часов работы:', e);
        }
    }
    
    // Устанавливаем изображения
    const imageCarousel = document.getElementById('main-detail-image');
    const thumbnailsContainer = document.getElementById('detail-thumbnails');
    thumbnailsContainer.innerHTML = '';
    
    if (establishment.images) {
        try {
            const imagesArray = JSON.parse(establishment.images);
            if (imagesArray.length > 0) {
                imageCarousel.src = imagesArray[0].preview;
                
                imagesArray.forEach((img, index) => {
                    const thumbImg = document.createElement('img');
                    thumbImg.src = img.preview;
                    thumbImg.alt = `Изображение ${index + 1}`;
                    thumbImg.addEventListener('click', () => {
                        imageCarousel.src = img.original || img.preview;
                        // Обновляем активное изображение в миниатюрах
                        document.querySelectorAll('#detail-thumbnails img').forEach(thumb => {
                            thumb.classList.remove('active');
                        });
                        thumbImg.classList.add('active');
                    });
                    
                    if (index === 0) {
                        thumbImg.classList.add('active');
                    }
                    
                    thumbnailsContainer.appendChild(thumbImg);
                });
            }
        } catch (e) {
            console.error('Ошибка при разборе изображений:', e);
        }
    }
    
    // Устанавливаем меню
    const menuContainer = document.getElementById('detail-menu');
    menuContainer.innerHTML = '';
    
    if (establishment.menu) {
        try {
            const menuData = JSON.parse(establishment.menu);
            
            Object.keys(menuData).forEach(category => {
                const categoryDiv = document.createElement('div');
                categoryDiv.classList.add('menu-category');
                
                const categoryTitle = document.createElement('h4');
                categoryTitle.textContent = category;
                categoryDiv.appendChild(categoryTitle);
                
                const itemsList = document.createElement('ul');
                menuData[category].forEach(item => {
                    const itemLi = document.createElement('li');
                    itemLi.innerHTML = `<strong>${item.name}</strong> - ${item.price || 'Цена не указана'}`;
                    itemsList.appendChild(itemLi);
                });
                
                categoryDiv.appendChild(itemsList);
                menuContainer.appendChild(categoryDiv);
            });
        } catch (e) {
            console.error('Ошибка при разборе меню:', e);
        }
    }
    
    // Устанавливаем социальные ссылки
    const socialLinksContainer = document.getElementById('detail-social-links');
    socialLinksContainer.innerHTML = '';
    
    if (establishment.social_links) {
        try {
            const socialData = JSON.parse(establishment.social_links);
            
            Object.keys(socialData).forEach(platform => {
                const platformLinks = Array.isArray(socialData[platform]) ? socialData[platform] : [socialData[platform]];
                
                platformLinks.forEach(link => {
                    const socialLink = document.createElement('a');
                    socialLink.href = link;
                    socialLink.textContent = platform;
                    socialLink.target = '_blank';
                    socialLink.classList.add('social-link');
                    socialLinksContainer.appendChild(socialLink);
                });
            });
        } catch (e) {
            console.error('Ошибка при разборе социальных ссылок:', e);
        }
    }
    
    // Устанавливаем особенности
    const featuresContainer = document.getElementById('detail-features');
    featuresContainer.innerHTML = '';
    
    if (establishment.features) {
        try {
            const featuresArray = JSON.parse(establishment.features);
            
            const featuresGrid = document.createElement('div');
            featuresGrid.classList.add('features-grid');
            
            featuresArray.forEach(feature => {
                const featureItem = document.createElement('div');
                featureItem.textContent = feature;
                featureItem.classList.add('feature-item');
                featuresGrid.appendChild(featureItem);
            });
            
            featuresContainer.appendChild(featuresGrid);
        } catch (e) {
            console.error('Ошибка при разборе особенностей:', e);
        }
    }
    
    // Настройка кнопок действий
    const callButton = document.getElementById('call-establishment');
    const websiteButton = document.getElementById('visit-website');
    
    callButton.onclick = () => {
        if (establishment.phone) {
            window.location.href = `tel:${establishment.phone.replace(/\s+/g, '')}`;
        }
    };
    
    websiteButton.onclick = () => {
        if (establishment.website) {
            window.open(establishment.website, '_blank');
        }
    };
    
    // Проверяем, нужно ли отключить кнопки
    callButton.disabled = !establishment.phone;
    websiteButton.disabled = !establishment.website;
    
    if (!establishment.phone) {
        callButton.style.opacity = '0.5';
        callButton.style.cursor = 'not-allowed';
    }
    
    if (!establishment.website) {
        websiteButton.style.opacity = '0.5';
        websiteButton.style.cursor = 'not-allowed';
    }
}