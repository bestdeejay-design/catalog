const fs = require('fs');
const path = require('path');

// ============================================
// КОНФИГУРАЦИЯ
// ============================================
const DATA_DIR = 'data';              // Оригиналы (не трогать!)
const OUTPUT_DIR = 'data-generated';  // Рабочая папка

// ============================================
// МАППИНГ КАТЕГОРИЙ
// ============================================
// Ключевые слова для определения категории заведения
const CATEGORY_KEYWORDS = {
    1: { // Рестораны
        keywords: ['ресторан', 'кафе', 'столовая', 'кулинария', 'фастфуд', 'пиццерия', 
                   'суши', 'бургер', 'шаурма', 'кофейня', 'чайная', 'бистро'],
        features: ['Рестораны', 'Кафе', 'Фастфуд', 'Европейская', 'Итальянская', 'Японская', 'Китайская']
    },
    2: { // Бары
        keywords: ['бар', 'паб', 'клуб', 'лаунж', 'коктейль', 'винный', 'пивной',
                   'рестобар', 'спорт-бар', 'караоке'],
        features: ['Бар', 'Паб', 'Ночной клуб', 'Коктейли', 'Винный бар', 'Пивной ресторан']
    },
    3: { // Красота и здоровье
        keywords: ['салон', 'парикмахер', 'спа', 'маникюр', 'педикюр', 'косметолог',
                   'солярий', 'эстетика', 'красота', 'стиль', 'имидж', 'визаж'],
        features: ['Салон красоты', 'Парикмахер', 'Маникюр', 'Педикюр', 'СПА', 'Косметология']
    },
    4: { // Медицина
        keywords: ['клиника', 'больница', 'поликлиника', 'медцентр', 'стоматолог',
                   'врач', 'зубной', 'лаборатория', 'диагностика', 'узи', 'рентген'],
        features: ['Медицинский центр', 'Клиника', 'Стоматология', 'Диагностика']
    },
    5: { // Образование
        keywords: ['школа', 'университет', 'детский сад', 'лицей', 'гимназия', 'колледж',
                   'академия', 'институт', 'курсы', 'тренинг', 'репетитор', 'обучение'],
        features: ['Школа', 'Университет', 'Детский сад', 'Образовательный центр', 'Курсы']
    },
    6: { // Транспорт
        keywords: ['такси', 'автосервис', 'шиномонтаж', 'мойка', 'заправки', 'стоянка',
                   'прокат', 'аренда авто', 'грузоперевозки', 'эвакуатор'],
        features: ['Автосервис', 'Шиномонтаж', 'Автомойка', 'Такси', 'Прокат автомобилей']
    },
    7: { // Услуги
        keywords: ['химчистка', 'прачечная', 'ателье', 'ремонт', 'сервис', 'мастерская',
                   'клининг', 'фото', 'видео', 'перевод', 'юрист', 'нотариус'],
        features: ['Химчистка', 'Ателье', 'Ремонт', 'Сервисный центр', 'Мастерская']
    },
    8: { // Магазины
        keywords: ['магазин', 'торговый центр', 'рынок', 'супермаркет', 'бутик',
                   'лавка', 'шоу-рум', 'дискаунтер'],
        features: ['Магазин', 'Торговый центр', 'Супермаркет', 'Булочная', 'Продукты']
    },
    9: { // Развлечения
        keywords: ['кинотеатр', 'театр', 'музей', 'галерея', 'цирк', 'зоопарк',
                   'аквапарк', 'боулинг', 'бильярд', 'квест', 'лофт', 'площадка'],
        features: ['Кинотеатр', 'Театр', 'Музей', 'Развлекательный центр', 'Боулинг']
    },
    10: { // Спорт и отдых
        keywords: ['фитнес', 'спортзал', 'тренажер', 'бассейн', 'йога', 'танцы',
                   'секция', 'стадион', 'корт', 'скалодром', 'каток', 'лыжи'],
        features: ['Фитнес-клуб', 'Спортзал', 'Бассейн', 'Йога', 'Танцы', 'Секция']
    },
    11: { // Финансы
        keywords: ['банк', 'банкомат', 'обмен валют', 'кредит', 'страхование',
                   'финансы', 'инвестиции', 'ломбард'],
        features: ['Банк', 'Банкомат', 'Страховая компания', 'Финансовый центр']
    },
    12: { // Недвижимость
        keywords: ['недвижимость', 'риелтор', 'агентство', 'аренда жилья',
                   'продажа квартир', 'ипотека', 'застройщик'],
        features: ['Агентство недвижимости', 'Риелтор', 'Застройщик']
    }
};

// ============================================
// ФУНКЦИИ
// ============================================

/**
 * Определить категорию по названию, описанию и features
 */
function determineCategoryId(establishment) {
    const name = (establishment.name || '').toLowerCase();
    const description = (establishment.description || '').toLowerCase();
    let features = [];
    
    try {
        if (establishment.features) {
            features = JSON.parse(establishment.features).map(f => f.toLowerCase());
        }
    } catch(e) {}
    
    const searchText = `${name} ${description}`;
    
    // Считаем баллы для каждой категории
    const scores = {};
    
    for (const [categoryId, config] of Object.entries(CATEGORY_KEYWORDS)) {
        let score = 0;
        
        // Проверяем ключевые слова в названии и описании
        for (const keyword of config.keywords) {
            if (searchText.includes(keyword)) {
                score += 2; // Более весомое совпадение
            }
        }
        
        // Проверяем features
        for (const feature of config.features || []) {
            if (features.some(f => f.includes(feature.toLowerCase()))) {
                score += 1;
            }
        }
        
        // Особая логика для некоторых категорий
        if (categoryId === '1') { // Рестораны
            if (name.includes('ресторан') || name.includes('кафе')) score += 5;
            if (features.some(f => ['Европейская', 'Итальянская', 'Японская', 'Китайская', 'Рестораны'].some(k => f.includes(k)))) {
                score += 3;
            }
        }
        
        if (categoryId === '2') { // Бары
            if (name.includes('бар') || name.includes('паб') || name.includes('клуб')) score += 5;
            if (features.some(f => ['Бар', 'Паб', 'Ночной клуб', 'Коктейли'].some(k => f.includes(k)))) {
                score += 3;
            }
        }
        
        if (categoryId === '7') { // Услуги (ремонт техники)
            if (name.includes('сервис') || name.includes('ремонт')) score += 3;
            if (features.some(f => f.includes('ремонт') || f.includes('сервис'))) score += 2;
        }
        
        scores[categoryId] = score;
    }
    
    // Находим категорию с максимальным баллом
    let maxScore = 0;
    let bestCategory = null;
    
    for (const [categoryId, score] of Object.entries(scores)) {
        if (score > maxScore) {
            maxScore = score;
            bestCategory = categoryId;
        }
    }
    
    // Если минимальный порог не пройден - возвращаем null
    return maxScore >= 3 ? parseInt(bestCategory) : null;
}

/**
 * Обработать все города и добавить category_id
 */
function processAllCities() {
    console.log('🚀 Начало обработки данных...\n');
    
    // Загружаем справочники
    const cities = JSON.parse(fs.readFileSync(path.join(DATA_DIR, '1-cities.json'), 'utf-8'));
    const categories = JSON.parse(fs.readFileSync(path.join(DATA_DIR, '2-categories.json'), 'utf-8'));
    
    // Получаем список всех файлов городов
    const cityFiles = fs.readdirSync(DATA_DIR)
        .filter(f => f.endsWith('.json'))
        .filter(f => !['1-cities.json', '2-categories.json', '3-tags.json', '4-company_categories.json'].includes(f));
    
    console.log(`📁 Найдено файлов городов: ${cityFiles.length}\n`);
    
    // Обрабатываем каждый город
    const stats = {
        totalEstablishments: 0,
        categorized: 0,
        uncategorized: 0,
        byCategory: {}
    };
    
    cityFiles.forEach((filename, index) => {
        const citySlug = filename.replace('.json', '');
        const cityInfo = cities.find(c => c.slug === citySlug);
        
        console.log(`[${index + 1}/${cityFiles.length}] Обработка: ${cityInfo ? cityInfo.name : citySlug}`);
        
        try {
            // Загружаем данные города
            const cityData = JSON.parse(fs.readFileSync(path.join(DATA_DIR, filename), 'utf-8'));
            
            // Добавляем category_id к каждому заведению
            const processedData = cityData.map(establishment => {
                const categoryId = determineCategoryId(establishment);
                
                // Считаем статистику
                stats.totalEstablishments++;
                if (categoryId) {
                    stats.categorized++;
                    stats.byCategory[categoryId] = (stats.byCategory[categoryId] || 0) + 1;
                } else {
                    stats.uncategorized++;
                }
                
                return {
                    ...establishment,
                    category_id: categoryId
                };
            });
            
            // Сохраняем обработанные данные
            const outputPath = path.join(OUTPUT_DIR, filename);
            fs.writeFileSync(outputPath, JSON.stringify(processedData, null, 2), 'utf-8');
            
            console.log(`   ✅ Обработано: ${processedData.length} заведений\n`);
            
        } catch (error) {
            console.error(`   ❌ Ошибка обработки ${filename}:`, error.message);
        }
    });
    
    // Сохраняем обновленные справочники
    console.log('💾 Сохранение справочников...');
    
    // Города с реальным количеством заведений
    const citiesWithCount = cities.map(city => {
        const cityFile = path.join(OUTPUT_DIR, `${city.slug}.json`);
        let actualCount = 0;
        
        if (fs.existsSync(cityFile)) {
            const cityData = JSON.parse(fs.readFileSync(cityFile, 'utf-8'));
            actualCount = cityData.length;
        }
        
        return {
            ...city,
            establishments_count: actualCount
        };
    });
    
    fs.writeFileSync(
        path.join(OUTPUT_DIR, 'cities.json'),
        JSON.stringify(citiesWithCount, null, 2),
        'utf-8'
    );
    
    // Категории
    fs.writeFileSync(
        path.join(OUTPUT_DIR, 'categories.json'),
        JSON.stringify(categories, null, 2),
        'utf-8'
    );
    
    // Вывод статистики
    console.log('\n' + '='.repeat(60));
    console.log('📊 СТАТИСТИКА ОБРАБОТКИ');
    console.log('='.repeat(60));
    console.log(`Всего заведений: ${stats.totalEstablishments.toLocaleString()}`);
    console.log(`Распределено по категориям: ${stats.categorized.toLocaleString()} (${((stats.categorized / stats.totalEstablishments) * 100).toFixed(1)}%)`);
    console.log(`Не распределено: ${stats.uncategorized.toLocaleString()} (${((stats.uncategorized / stats.totalEstablishments) * 100).toFixed(1)}%)`);
    
    console.log('\n📋 По категориям:');
    for (const [catId, count] of Object.entries(stats.byCategory)) {
        const category = categories.find(c => c.id === parseInt(catId));
        console.log(`   ${category ? category.name : catId}: ${count.toLocaleString()}`);
    }
    
    console.log('\n✅ Обработка завершена!');
    console.log(`📂 Результаты сохранены в: ${path.resolve(OUTPUT_DIR)}`);
}

// ============================================
// ЗАПУСК
// ============================================
processAllCities();
