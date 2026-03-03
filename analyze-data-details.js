const fs = require('fs');

console.log('='.repeat(70));
console.log('АНАЛИЗ ДАННЫХ: Особенности, Время работы, Изображения');
console.log('='.repeat(70));

// Загружаем Москву для примера
const moscow = JSON.parse(fs.readFileSync('data-generated/moscow.json', 'utf-8'));

console.log(`\n📊 Всего заведений в Москве: ${moscow.length}`);

// ============================================
// 1. АНАЛИЗ ОСОБЕННОСТЕЙ (features)
// ============================================
console.log('\n' + '='.repeat(70));
console.log('1️⃣  ОСОБЕННОСТИ ЗАВЕДЕНИЙ (features)');
console.log('='.repeat(70));

let withFeatures = 0;
let featureExamples = [];
let allFeatures = new Set();

moscow.forEach(est => {
    if (est.features) {
        withFeatures++;
        try {
            const featuresArray = JSON.parse(est.features);
            if (featuresArray.length > 0) {
                featureExamples.push({
                    name: est.name,
                    features: featuresArray.slice(0, 5) // первые 5
                });
                
                // Собираем все уникальные особенности
                featuresArray.forEach(f => allFeatures.add(f));
            }
        } catch(e) {}
    }
});

console.log(`\n✅ Заведений с особенностями: ${withFeatures} (${((withFeatures / moscow.length) * 100).toFixed(1)}%)`);
console.log(`📋 Всего уникальных особенностей: ${allFeatures.size}`);

console.log('\n🔝 Топ-20 самых частых особенностей:');
const featureCount = {};
moscow.forEach(est => {
    if (est.features) {
        try {
            const featuresArray = JSON.parse(est.features);
            featuresArray.forEach(f => {
                featureCount[f] = (featureCount[f] || 0) + 1;
            });
        } catch(e) {}
    }
});

const sortedFeatures = Object.entries(featureCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20);

sortedFeatures.forEach(([feature, count], i) => {
    console.log(`   ${i+1}. ${feature}: ${count} заведений`);
});

console.log('\n📋 Примеры особенностей из разных заведений:');
featureExamples.slice(0, 3).forEach((ex, i) => {
    console.log(`\n   ${i+1}. ${ex.name}:`);
    ex.features.forEach(f => console.log(`      - ${f}`));
});

// ============================================
// 2. АНАЛИЗ ВРЕМЕНИ РАБОТЫ (working_hours)
// ============================================
console.log('\n' + '='.repeat(70));
console.log('2️⃣  ВРЕМЯ РАБОТЫ (working_hours)');
console.log('='.repeat(70));

let withWorkingHours = 0;
let workingHoursExamples = [];

moscow.forEach(est => {
    if (est.working_hours) {
        withWorkingHours++;
        try {
            const hoursArray = JSON.parse(est.working_hours);
            if (hoursArray.length > 0) {
                workingHoursExamples.push({
                    name: est.name,
                    hours: hoursArray
                });
            }
        } catch(e) {}
    }
});

console.log(`\n✅ Заведений с часами работы: ${withWorkingHours} (${((withWorkingHours / moscow.length) * 100).toFixed(1)}%)`);

console.log('\n📋 Примеры времени работы:');
workingHoursExamples.slice(0, 5).forEach((ex, i) => {
    console.log(`\n   ${i+1}. ${ex.name}:`);
    ex.hours.forEach(h => console.log(`      ${h}`));
});

// ============================================
// 3. АНАЛИЗ ИЗОБРАЖЕНИЙ (images)
// ============================================
console.log('\n' + '='.repeat(70));
console.log('3️⃣  ИЗОБРАЖЕНИЯ (images)');
console.log('='.repeat(70));

let withImages = 0;
let totalImages = 0;
let imageExamples = [];
let imageSizes = new Set();

moscow.forEach(est => {
    if (est.images) {
        withImages++;
        try {
            const imagesArray = JSON.parse(est.images);
            totalImages += imagesArray.length;
            
            if (imagesArray.length > 0) {
                imageExamples.push({
                    name: est.name,
                    images: imagesArray.map(img => ({
                        preview: img.preview,
                        size: img.preview_size || 'N/A'
                    }))
                });
                
                imagesArray.forEach(img => {
                    if (img.preview_size) {
                        imageSizes.add(img.preview_size);
                    }
                });
            }
        } catch(e) {}
    }
});

console.log(`\n✅ Заведений с изображениями: ${withImages} (${((withImages / moscow.length) * 100).toFixed(1)}%)`);
console.log(`📸 Всего изображений: ${totalImages.toLocaleString()}`);
console.log(`📐 Размеры изображений: ${Array.from(imageSizes).join(', ') || 'разные'}`);

console.log('\n📋 Примеры изображений:');
imageExamples.slice(0, 3).forEach((ex, i) => {
    console.log(`\n   ${i+1}. ${ex.name}:`);
    console.log(`      Количество: ${ex.images.length}`);
    ex.images.slice(0, 2).forEach(img => {
        console.log(`      - Preview: ${img.preview.substring(0, 60)}... (${img.size})`);
    });
});

// ============================================
// 4. АНАЛИЗ МЕНЮ (menu)
// ============================================
console.log('\n' + '='.repeat(70));
console.log('4️⃣  МЕНЮ (menu)');
console.log('='.repeat(70));

let withMenu = 0;
let menuExamples = [];

moscow.forEach(est => {
    if (est.menu) {
        withMenu++;
        try {
            const menuData = JSON.parse(est.menu);
            const categories = Object.keys(menuData);
            if (categories.length > 0) {
                menuExamples.push({
                    name: est.name,
                    categories: categories,
                    itemsCount: categories.reduce((sum, cat) => sum + menuData[cat].length, 0)
                });
            }
        } catch(e) {}
    }
});

console.log(`\n✅ Заведений с меню: ${withMenu} (${((withMenu / moscow.length) * 100).toFixed(1)}%)`);

console.log('\n📋 Примеры меню:');
menuExamples.slice(0, 3).forEach((ex, i) => {
    console.log(`\n   ${i+1}. ${ex.name}:`);
    console.log(`      Категории: ${ex.categories.join(', ')}`);
    console.log(`      Всего позиций: ${ex.itemsCount}`);
});

// ============================================
// 5. АНАЛИЗ СОЦСЕТЕЙ (social_links)
// ============================================
console.log('\n' + '='.repeat(70));
console.log('5️⃣  СОЦИАЛЬНЫЕ СЕТИ (social_links)');
console.log('='.repeat(70));

let withSocial = 0;
let socialPlatforms = new Set();

moscow.forEach(est => {
    if (est.social_links) {
        withSocial++;
        try {
            const socialData = JSON.parse(est.social_links);
            Object.keys(socialData).forEach(platform => {
                socialPlatforms.add(platform);
            });
        } catch(e) {}
    }
});

console.log(`\n✅ Заведений с соцсетями: ${withSocial} (${((withSocial / moscow.length) * 100).toFixed(1)}%)`);
console.log(`🌐 Платформы: ${Array.from(socialPlatforms).join(', ')}`);

// ============================================
// ИТОГИ
// ============================================
console.log('\n' + '='.repeat(70));
console.log('📊 ИТОГОВАЯ СТАТИСТИКА');
console.log('='.repeat(70));

console.log(`
Наполненность данных (Москва):
├─ Особенности: ${withFeatures} (${((withFeatures / moscow.length) * 100).toFixed(1)}%)
├─ Время работы: ${withWorkingHours} (${((withWorkingHours / moscow.length) * 100).toFixed(1)}%)
├─ Изображения: ${withImages} (${((withImages / moscow.length) * 100).toFixed(1)}%)
├─ Меню: ${withMenu} (${((withMenu / moscow.length) * 100).toFixed(1)}%)
└─ Соцсети: ${withSocial} (${((withSocial / moscow.length) * 100).toFixed(1)}%)
`);

console.log('\n💡 РЕКОМЕНДАЦИИ:');
console.log('1. Особенности: сделать раскрывающимся списком с группировкой по категориям');
console.log('2. Время работы: отображать компактно с индикатором "открыто/закрыто"');
console.log('3. Изображения: скачать локально, сделать галерею с миниатюрами');
console.log('4. Меню: сделать аккордеон по категориям');
console.log('5. Соцсети: показать иконками');
