const fs = require('fs');

console.log('='.repeat(60));
console.log('ПРОВЕРКА ДАННЫХ В data-generated/moscow.json');
console.log('='.repeat(60));

const moscow = JSON.parse(fs.readFileSync('data-generated/moscow.json', 'utf-8'));

console.log(`\nВсего заведений: ${moscow.length}`);

const withCategory = moscow.filter(e => e.category_id);
const withoutCategory = moscow.filter(e => !e.category_id);

console.log(`С категорией: ${withCategory.length} (${((withCategory.length / moscow.length) * 100).toFixed(1)}%)`);
console.log(`Без категории: ${withoutCategory.length} (${((withoutCategory.length / moscow.length) * 100).toFixed(1)}%)`);

console.log('\n' + '='.repeat(60));
console.log('ПЕРВЫЕ 10 ЗАВЕДЕНИЙ:');
console.log('='.repeat(60));

moscow.slice(0, 10).forEach((est, i) => {
    console.log(`\n${i+1}. ${est.name}`);
    console.log(`   category_id: ${est.category_id || '❌ NULL'}`);
    console.log(`   address: ${est.address}`);
});

console.log('\n' + '='.repeat(60));
console.log('ПРОВЕРКА КАТЕГОРИЙ:');
console.log('='.repeat(60));

const categories = JSON.parse(fs.readFileSync('data-generated/categories.json', 'utf-8'));
console.log(`Всего категорий: ${categories.length}`);
categories.forEach(cat => {
    const count = moscow.filter(e => e.category_id === cat.id).length;
    console.log(`${cat.id}. ${cat.name}: ${count} заведений`);
});
