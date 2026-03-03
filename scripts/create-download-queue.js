const fs = require('fs');
const path = require('path');

// ============================================
// АВТОМАТИЧЕСКАЯ ЗАГРУЗКА ВСЕХ ГОРОДОВ
// ============================================

const OUTPUT_DIR = 'assets/images';
const DELAY_MS = 100;

// Список всех городов из data-generated/
const citiesData = JSON.parse(fs.readFileSync('data-generated/cities.json', 'utf-8'));

// Берем топ-20 городов по количеству заведений
const topCities = citiesData
    .sort((a, b) => (b.establishments_count || 0) - (a.establishments_count || 0))
    .slice(0, 20);

console.log('🚀 АВТОМАТИЧЕСКАЯ ЗАГРУЗКА ТОП-20 ГОРОДОВ');
console.log('='.repeat(70));
console.log(`Всего городов: ${topCities.length}`);
console.log(topCities.map((c, i) => `${i+1}. ${c.name} (${c.establishments_count || 0})`).join('\n'));
console.log('='.repeat(70));

// Сохраняем список для последовательной обработки
fs.writeFileSync(
    'scripts/download-queue.json',
    JSON.stringify(topCities.map(c => c.slug), null, 2)
);

console.log('✅ Очередь сохранена в scripts/download-queue.json');
console.log('Запустите download-all.js для начала загрузки');
