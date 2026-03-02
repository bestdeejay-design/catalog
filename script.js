// Глобальные переменные для хранения данных
let cities = [];
let categories = [];
let establishments = [];
let currentCityId = null;
let currentCategoryId = null;

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
    if (sectionId === 'establishments-section' && currentCityId) {
        loadEstablishmentsForCity(currentCityId);
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
            filterEstablishments();
        });
        categoriesContainer.appendChild(categoryCard);
    });
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
document.addEventListener('DOMContentLoaded', loadData);