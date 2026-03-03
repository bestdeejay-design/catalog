const fs = require('fs');
const path = require('path');
const https = require('https');
const axios = require('axios');

// ============================================
// АВТОМАТИЧЕСКАЯ ЗАГРУЗКА ВСЕХ ГОРОДОВ ПО ОЧЕРЕДИ
// ============================================

const OUTPUT_DIR = 'assets/images';
const DELAY_MS = 100;

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
        return parsed.origin + parsed.pathname;
    } catch(e) {
        return url;
    }
}

/**
 * Загрузить изображения для одного города
 */
async function downloadImagesForCity(citySlug) {
    console.log(`\n${'='.repeat(70)}`);
    console.log(`Обработка города: ${citySlug}`);
    console.log('='.repeat(70));
    
    const dataPath = path.join('data-generated', `${citySlug}.json`);
    if (!fs.existsSync(dataPath)) {
        console.error(`❌ Файл ${dataPath} не найден!`);
        return { success: false, total: 0, downloaded: 0 };
    }
    
    const establishments = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    console.log(`Всего заведений: ${establishments.length}`);
    
    const cityDir = path.join(OUTPUT_DIR, citySlug);
    if (!fs.existsSync(cityDir)) {
        fs.mkdirSync(cityDir, { recursive: true });
    }
    
    let totalImages = 0;
    let downloadedImages = 0;
    let failedImages = 0;
    
    for (const est of establishments) {
        if (!est.images) continue;
        
        try {
            const images = JSON.parse(est.images);
            if (!images || images.length === 0) continue;
            
            totalImages += images.length;
            
            const estDir = path.join(cityDir, est.id.toString());
            if (!fs.existsSync(estDir)) {
                fs.mkdirSync(estDir, { recursive: true });
            }
            
            for (let i = 0; i < images.length; i++) {
                const img = images[i];
                const imageUrl = cleanUrl(img.preview || img.original);
                const ext = getExtension(imageUrl);
                const fileName = `${i + 1}${ext}`;
                const destPath = path.join(estDir, fileName);
                
                if (fs.existsSync(destPath)) {
                    continue;
                }
                
                try {
                    await downloadFile(imageUrl, destPath);
                    downloadedImages++;
                    await new Promise(resolve => setTimeout(resolve, DELAY_MS));
                    
                } catch (error) {
                    failedImages++;
                }
            }
            
        } catch (error) {
            // Продолжаем работу
        }
    }
    
    console.log(`\n✅ ${citySlug}: Скачано ${downloadedImages}/${totalImages} изображений`);
    
    return { success: true, total: totalImages, downloaded: downloadedImages };
}

/**
 * Главная функция - загрузка всех городов по очереди
 */
async function downloadAllCities() {
    console.log('🚀 АВТОМАТИЧЕСКАЯ ЗАГРУЗКА ВСЕХ ГОРОДОВ');
    console.log('='.repeat(70));
    
    // Получаем список всех городов
    const citiesData = JSON.parse(fs.readFileSync('data-generated/cities.json', 'utf-8'));
    
    // Сортируем по количеству заведений и берем топ-20
    const topCities = citiesData
        .sort((a, b) => (b.establishments_count || 0) - (a.establishments_count || 0))
        .slice(0, 20);
    
    console.log(`Загрузка ТОП-${topCities.length} городов:`);
    topCities.forEach((city, i) => {
        console.log(`  ${i+1}. ${city.name} (${city.establishments_count || 0} зав.)`);
    });
    console.log('='.repeat(70));
    
    let grandTotal = 0;
    let grandDownloaded = 0;
    
    // Загружаем каждый город по очереди
    for (const city of topCities) {
        const result = await downloadImagesForCity(city.slug);
        
        if (result.success) {
            grandTotal += result.total;
            grandDownloaded += result.downloaded;
        }
        
        // Небольшая пауза между городами
        await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    console.log('\n' + '='.repeat(70));
    console.log('🎉 ОБЩАЯ СТАТИСТИКА:');
    console.log('='.repeat(70));
    console.log(`Всего изображений: ${grandTotal.toLocaleString()}`);
    console.log(`Скачано успешно: ${grandDownloaded.toLocaleString()}`);
    console.log(`Процент успеха: ${((grandDownloaded / grandTotal) * 100).toFixed(1)}%`);
    console.log('='.repeat(70));
}

// Запуск
downloadAllCities().catch(console.error);
