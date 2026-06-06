const fs = require('fs');
const path = require('path');

console.log('='.repeat(60));
console.log('АНАЛИЗ ДАННЫХ ПРОЕКТА');
console.log('='.repeat(60));

// Загружаем данные по Москве
const moscowData = JSON.parse(fs.readFileSync('data/moscow.json', 'utf-8'));

console.log(`\n📊 МОСКВА:`);
console.log(`   Всего заведений: ${moscowData.length.toLocaleString()}`);

// Анализируем структуру первого заведения
if (moscowData.length > 0) {
    const first = moscowData[0];
    console.log(`\n📋 Структура данных:`);
    console.log(`   Keys: ${Object.keys(first).join(', ')}`);
    console.log(`   Есть category_id? ${'category_id' in first ? '✅ ДА' : '❌ НЕТ'}`);
    
    if (!('category_id' in first)) {
        console.log(`\n   ❌ ПРОБЛЕМА: Нет поля category_id!`);
        console.log(`      Нужно добавить логику присваивания категорий`);
    }
    
    // Смотрим features
    if (first.features) {
        try {
            const features = JSON.parse(first.features);
            console.log(`\n   Features (первые 10):`);
            console.log(`   ${features.slice(0, 10).join(', ')}`);
        } catch(e) {}
    }
    
    console.log(`\n   Пример заведения:`);
    console.log(`   Название: ${first.name}`);
    console.log(`   Адрес: ${first.address}`);
}

// Загружаем города
const cities = JSON.parse(fs.readFileSync('data/1-cities.json', 'utf-8'));

console.log('\n' + '='.repeat(60));
console.log('СРАВНЕНИЕ ВЕСА И РЕАЛЬНОГО КОЛИЧЕСТВА ЗАВЕДЕНИЙ');
console.log('='.repeat(60));

// Получаем все JSON файлы городов
const dataFiles = fs.readdirSync('data')
    .filter(f => f.endsWith('.json'))
    .filter(f => !['1-cities.json', '2-categories.json', '3-tags.json', '4-company_categories.json'].includes(f));

console.log(`\n📁 Найдено файлов с городами: ${dataFiles.length}`);

// Проверяем несколько крупных городов
const testCities = ['moscow', 'spb', 'yekaterinburg', 'kazan'];

testCities.forEach(slug => {
    const filePath = path.join('data', `${slug}.json`);
    if (fs.existsSync(filePath)) {
        const cityData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        const cityInfo = cities.find(c => c.slug === slug);
        
        if (cityInfo) {
            const actualCount = cityData.length;
            const weight = cityInfo.weight || 0;
            const difference = Math.abs(weight - actualCount);
            
            console.log(`\n${cityInfo.name}:`);
            console.log(`   Вес города: ${weight.toLocaleString()}`);
            console.log(`   Реально заведений: ${actualCount.toLocaleString()}`);
            console.log(`   Разница: ${difference.toLocaleString()} (${((difference / weight) * 100).toFixed(1)}%)`);
        }
    }
});

// Загружаем категории
const categories = JSON.parse(fs.readFileSync('data/2-categories.json', 'utf-8'));
console.log('\n' + '='.repeat(60));
console.log('КАТЕГОРИИ ЗАВЕДЕНИЙ');
console.log('='.repeat(60));
console.log(`\nВсего категорий: ${categories.length}`);
categories.forEach(cat => {
    console.log(`   ${cat.id}. ${cat.name} (${cat.slug}) - ${cat.description}`);
});
