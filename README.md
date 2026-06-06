# Категории заведений - JSON данные

Этот проект содержит JSON-файл со списком всех категорий заведений.

## Структура данных

### categories.json
Каждая категория содержит следующие поля:

- `id` (integer) - уникальный идентификатор категории
- `name` (string) - название категории на русском языке
- `slug` (string) - URL-идентификатор категории (латиница)
- `description` (string) - краткое описание категории
- `icon` (string) - имя иконки для отображения (Material Design Icons)
- `parent_id` (integer|null) - идентификатор родительской категории (для иерархии)
- `sort_order` (integer) - порядок сортировки
- `is_active` (boolean) - активна ли категория

## Список категорий

1. **Рестораны** (`restaurants`) - Рестораны и кафе
2. **Бары** (`bars`) - Бары и пабы
3. **Красота и здоровье** (`beauty`) - Салоны красоты, спа-салоны, парикмахерские
4. **Медицина** (`medicine`) - Медицинские учреждения и клиники
5. **Образование** (`education`) - Школы, университеты, курсы
6. **Транспорт** (`transport`) - Транспортные услуги
7. **Услуги** (`services`) - Различные услуги
8. **Магазины** (`shops`) - Розничные магазины
9. **Развлечения** (`entertainment`) - Развлекательные заведения
10. **Спорт и отдых** (`sports`) - Спортивные клубы и центры
11. **Финансы** (`finance`) - Банки и финансовые организации
12. **Недвижимость** (`real-estate`) - Агентства недвижимости

## Пример использования

```javascript
// Загрузка категорий
fetch('categories.json')
  .then(response => response.json())
  .then(categories => {
    console.log('Все категории:', categories);
    
    // Фильтрация активных категорий
    const activeCategories = categories.filter(cat => cat.is_active);
    
    // Сортировка по порядку
    const sorted = activeCategories.sort((a, b) => a.sort_order - b.sort_order);
    
    // Получение категории по slug
    const restaurantCategory = categories.find(cat => cat.slug === 'restaurants');
  });
```

## Иконки

Для отображения категорий используются иконки из набора Material Design Icons:
- restaurant
- local_bar
- spa
- local_hospital
- school
- directions_bus
- build
- shopping_cart
- theaters
- fitness_center
- account_balance
- business

## Лицензия

MIT
