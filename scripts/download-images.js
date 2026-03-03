const fs = require('fs');
const path = require('path');
const https = require('https');
const axios = require('axios');

// ============================================
// КОНФИГУРАЦИЯ
// ============================================
const OUTPUT_DIR = 'assets/images';

// Запускаем загрузку ВСЕХ городов по очереди из топ-20
const citiesData = JSON.parse(fs.readFileSync('data-generated/cities.json', 'utf-8'));
const topCities = citiesData
    .sort((a, b) => (b.establishments_count || 0) - (a.establishments_count || 0))
    .slice(0, 20);

console.log('🚀 ЗАГРУЗКА ТОП-20 ГОРОДОВ ПО ОЧЕРЕДИ');
console.log('='.repeat(70));
console.log(`Всего городов: ${topCities.length}`);
topCities.forEach((city, i) => {
    console.log(`${i+1}. ${city.name} (${city.establishments_count || 0} зав.)`);
});
console.log('='.repeat(70));

// Сохраняем текущий индекс города
let currentCityIndex = parseInt(process.argv[2]) || 0;

if (currentCityIndex >= topCities.length) {
    console.log('✅ Все города загружены!');
    process.exit(0);
}

const citySlug = topCities[currentCityIndex].slug;
console.log(`\n📍 Текущий город: ${citySlug} (#${currentCityIndex + 1}/${topCities.length})`);

const CITIES_TO_PROCESS = [citySlug];
const DELAY_MS = 100; // Задержка между запросами чтобы не блокировали

// ============================================
// УТИЛИТЫ
// ============================================

/**
 * Скачать файл по URL
 */
async function downloadFile(url, destPath) {
    try {
        const response = await axios({
            url,
            method: 'GET',
            responseType: 'stream',
            timeout: 10000
        });
        
        const writer = fs.createWriteStream(destPath);
        response.data.pipe(writer);
        
        return new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });
    } catch (error) {
        console.error(`Ошибка загрузки ${url}:`, error.message);
        throw error;
    }
}

/**
 * Получить расширение из URL
 */
function getExtension(url) {
    const ext = path.extname(new URL(url).pathname);
    return ext || '.jpg';
}

/**
 * Очистить URL от лишних параметров
 */
function cleanUrl(url) {
    try {
        const parsed = new URL(url);
        // Убираем параметры размера и качества если есть
        return parsed.origin + parsed.pathname;
    } catch(e) {
        return url;
    }
}

// ============================================
// ОСНОВНАЯ ФУНКЦИЯ
// ============================================

async function downloadImagesForCity(citySlug) {
    console.log(`\n${'='.repeat(70)}`);
    console.log(`Обработка города: ${citySlug}`);
    console.log('='.repeat(70));
    
    // Загружаем данные города
    const dataPath = path.join('data-generated', `${citySlug}.json`);
    if (!fs.existsSync(dataPath)) {
        console.error(`❌ Файл ${dataPath} не найден!`);
        return;
    }
    
    const establishments = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    console.log(`Всего заведений: ${establishments.length}`);
    
    // Создаем папку для города
    const cityDir = path.join(OUTPUT_DIR, citySlug);
    if (!fs.existsSync(cityDir)) {
        fs.mkdirSync(cityDir, { recursive: true });
    }
    
    let totalImages = 0;
    let downloadedImages = 0;
    let failedImages = 0;
    
    // Проходим по всем заведениям
    for (const est of establishments) {
        if (!est.images) continue;
        
        try {
            const images = JSON.parse(est.images);
            if (!images || images.length === 0) continue;
            
            totalImages += images.length;
            
            // Создаем папку для заведения
            const estDir = path.join(cityDir, est.id.toString());
            if (!fs.existsSync(estDir)) {
                fs.mkdirSync(estDir, { recursive: true });
            }
            
            // Скачиваем каждое изображение
            for (let i = 0; i < images.length; i++) {
                const img = images[i];
                const imageUrl = cleanUrl(img.preview || img.original);
                const ext = getExtension(imageUrl);
                const fileName = `${i + 1}${ext}`;
                const destPath = path.join(estDir, fileName);
                
                // Если файл уже существует, пропускаем
                if (fs.existsSync(destPath)) {
                    console.log(`  ⏭ Заведение #${est.id}, фото ${i + 1}/${images.length} (уже существует)`);
                    continue;
                }
                
                console.log(`  ⬇ Заведение #${est.id}, фото ${i + 1}/${images.length}`);
                
                try {
                    await downloadFile(imageUrl, destPath);
                    downloadedImages++;
                    
                    // Обновляем путь в данных
                    img.local_path = `assets/images/${citySlug}/${est.id}/${fileName}`;
                    
                    // Небольшая задержка
                    await new Promise(resolve => setTimeout(resolve, DELAY_MS));
                    
                } catch (error) {
                    failedImages++;
                    console.error(`  ❌ Не удалось скачать: ${imageUrl}`);
                }
            }
            
        } catch (error) {
            console.error(`Ошибка обработки заведения #${est.id}:`, error.message);
        }
    }
    
    // Сохраняем обновленные данные с локальными путями
    console.log('\n💾 Сохранение данных с локальными путями...');
    
    const updatedEstablishments = establishments.map(est => {
        if (est.images) {
            try {
                const images = JSON.parse(est.images);
                images.forEach((img, i) => {
                    const localPath = `assets/images/${citySlug}/${est.id}/${i + 1}${getExtension(img.preview || img.original)}`;
                    if (fs.existsSync(path.join(OUTPUT_DIR, citySlug, est.id.toString(), `${i + 1}${getExtension(img.preview || img.original)}`))) {
                        img.local_path = localPath;
                    }
                });
                est.images_local = images;
            } catch(e) {}
        }
        return est;
    });
    
    // Сохраняем в отдельный файл чтобы не ломать оригинал
    const outputPath = path.join('data-generated', `${citySlug}_with_local_images.json`);
    fs.writeFileSync(outputPath, JSON.stringify(updatedEstablishments, null, 2), 'utf-8');
    
    console.log(`\n${'='.repeat(70)}`);
    console.log('СТАТИСТИКА:');
    console.log('='.repeat(70));
    console.log(`Всего изображений найдено: ${totalImages}`);
    console.log(`Скачано успешно: ${downloadedImages}`);
    console.log(`Не удалось скачать: ${failedImages}`);
    console.log(`Сохранено в файл: ${outputPath}`);
    console.log('='.repeat(70));
}

// ============================================
// ЗАПУСК
// ============================================

async function main() {
    console.log('🚀 СКАЧИВАНИЕ ИЗОБРАЖЕНИЙ');
    console.log('='.repeat(70));
    
    // Проверка зависимостей
    try {
        require.resolve('axios');
    } catch(e) {
        console.error('❌ Требуется axios! Установите: npm install axios');
        process.exit(1);
    }
    
    // Скачиваем для каждого города
    for (const citySlug of CITIES_TO_PROCESS) {
        await downloadImagesForCity(citySlug);
    }
    
    console.log('\n✅ Обработка завершена!');
    console.log('\n📂 Структура папок:');
    console.log('assets/images/');
    console.log('└── moscow/');
    console.log('    ├── 4157/');
    console.log('    │   ├── 1.jpg');
    console.log('    │   ├── 2.jpg');
    console.log('    │   └── 3.jpg');
    console.log('    └── ...');
}

main().catch(console.error);
