# 🎯 ПЛАН УЛУЧШЕНИЙ ВИЗУАЛЬНОГО ОФОРМЛЕНИЯ

**Дата:** 3 марта 2026  
**Статус:** Планирование

---

## 📊 АНАЛИЗ ТЕКУЩИХ ДАННЫХ

### Наполненность (на примере Москвы):
- ✅ **Особенности:** 294 (100%) - 4540 уникальных тегов
- ✅ **Время работы:** 294 (100%)
- ✅ **Изображения:** 294 (100%) - 848 всего, размер 360x360
- ✅ **Меню:** 264 (89.8%)
- ✅ **Соцсети:** 206 (70.1%) - VK, YouTube, Telegram

---

## 🎨 ПРОБЛЕМЫ ТЕКУЩЕГО ДИЗАЙНА

### 1. ❌ Особенности перегружены
**Проблема:** Все 4540 особенностей показываются сплошным списком  
**Решение:** 
- Аккордеон с группировкой по категориям
- Скрывать по умолчанию, показывать по клику
- Топ-5 популярных показывать сразу

### 2. ❌ Время работы неинформативно
**Проблема:** Просто список дней недели  
**Решение:**
- Компактный формат "Пн-Пт: 10:00-22:00"
- Индикатор "Открыто сейчас" / "Закрыто"
- Выделение текущего дня цветом

### 3. ❌ Изображения внешние
**Проблема:** Ссылки на image2.yell.ru (медленно, нестабильно)  
**Решение:**
- Скачать все изображения локально
- Оптимизировать размеры
- Сделать красивую галерею с миниатюрами
- Lazy loading для производительности

### 4. ❌ Меню неструктурировано
**Проблема:** Все категории меню сливаются  
**Решение:**
- Аккордеон по разделам меню
- Цены выделить цветом
- Возможность быстрого поиска по меню

### 5. ❌ Соцсети текстом
**Проблема:** Ссылки текстом "vk", "telegram"  
**Решение:**
- Иконки социальных сетей
- Цветовая кодировка брендов
- Tooltip с названием при наведении

### 6. ❌ Адаптив недостаточно удобен
**Проблема:** На мобильных сложно ориентироваться  
**Решение:**
- Улучшить навигацию на мобильных
- Свайпы для галереи
- Больше touch-friendly элементов

---

## 🚀 ПЛАН РЕАЛИЗАЦИИ

### Этап 1: Подготовка данных ⏳

#### 1.1 Скачать изображения локально
```bash
node scripts/download-images.js
```

**Структура:**
```
assets/
└── images/
    ├── moscow/
    │   ├── 4157_1.jpg  (ID заведения_номер)
    │   ├── 4157_2.jpg
    │   └── ...
    ├── spb/
    └── ...
```

**Что сделать:**
- Пройтись по всем городам (78 файлов)
- Скачать все изображения (848 для Москвы × 78 ≈ 66,000)
- Переименовать по формату `{establishment_id}_{index}.jpg`
- Обновить JSON файлы с новыми путями
- Оптимизировать размеры (оставить 360x360 или сделать responsive)

**⚠️ Внимание:** Большой объем данных! Нужно решить:
- Качать ли все 66k изображений (~20GB)?
- Или только для топ-10 городов?
- Или сделать по требованию?

#### 1.2 Группировка особенностей
Создать справочник категорий особенностей:

```javascript
const featureCategories = {
  'payment': ['Наличные', 'Карты', 'Безналичный расчет', 'Веб-кошельки'],
  'cuisine': ['Европейская', 'Японская', 'Китайская', 'Итальянская'],
  'services': ['Доставка еды', 'Бронирование столиков', 'Парковка'],
  'entertainment': ['Бар', 'Танцпол', 'DJ', 'Караоке'],
  'beauty': ['Массаж', 'Пилинг', 'Чистка лица', 'Маникюр'],
  // ... остальные 4540 особенностей
};
```

---

### Этап 2: Улучшение UI компонентов 🎨

#### 2.1 Особенности - аккордеон
```html
<div class="features-section">
  <h3 onclick="toggleFeatures()">
    Особенности <span class="toggle-icon">▼</span>
  </h3>
  
  <div class="features-content" id="features-content">
    <!-- Топ-5 популярных -->
    <div class="features-top">
      <span class="feature-tag">Наличные</span>
      <span class="feature-tag">Карты</span>
      <span class="feature-tag">Безналичный расчет</span>
      <span class="feature-tag">Бар</span>
      <span class="feature-tag">Wi-Fi</span>
    </div>
    
    <!-- Все остальные по категориям -->
    <details class="feature-category">
      <summary>Оплата (3)</summary>
      <span class="feature-tag">Веб-кошельки</span>
      <!-- ... -->
    </details>
    
    <details class="feature-category">
      <summary>Кухня (5)</summary>
      <!-- ... -->
    </details>
  </div>
</div>
```

**JavaScript:**
- Группировка по категориям
- Подсчет количества в каждой категории
- Сохранение состояния (развернуто/свернуто)

#### 2.2 Время работы с индикатором
```html
<div class="working-hours">
  <h3>
    Часы работы
    <span class="status-badge open">Открыто</span>
  </h3>
  
  <ul class="hours-list">
    <li class="today">
      <span>Сегодня</span>
      <span>10:00-22:00</span>
    </li>
    <li><span>Пн</span><span>10:00-22:00</span></li>
    <li><span>Вт</span><span>10:00-22:00</span></li>
    <!-- ... -->
  </ul>
</div>
```

**JavaScript:**
```javascript
function checkOpenNow(hoursString) {
  const now = new Date();
  const dayIndex = now.getDay(); // 0-6
  const hours = JSON.parse(hoursString);
  const todayHours = hours[dayIndex];
  
  // Парсим время и сравниваем
  // Возвращаем true/false + оставшееся время
}
```

#### 2.3 Галерея изобраений
```html
<div class="image-gallery">
  <!-- Основное изображение -->
  <div class="main-image">
    <img src="assets/images/moscow/4157_1.jpg" alt="Фото">
    <button class="nav-btn prev">‹</button>
    <button class="nav-btn next">›</button>
  </div>
  
  <!-- Миниатюры -->
  <div class="thumbnails">
    <img src="assets/images/moscow/4157_1.jpg" class="active" onclick="showImage(0)">
    <img src="assets/images/moscow/4157_2.jpg" onclick="showImage(1)">
    <img src="assets/images/moscow/4157_3.jpg" onclick="showImage(2)">
  </div>
  
  <!-- Счетчик -->
  <div class="image-counter">1 / 3</div>
</div>
```

**CSS:**
- Lazy loading
- Плавные переходы
- Swipe support для мобильных
- Lightbox режим по клику

#### 2.4 Меню - аккордеон
```html
<div class="menu-section">
  <h3>Меню</h3>
  
  <div class="menu-categories">
    <details class="menu-category" open>
      <summary>
        Супы <span class="count">(3)</span>
      </summary>
      <ul class="menu-items">
        <li>
          <span class="item-name">Борщ с говядиной</span>
          <span class="item-price">250 ₽</span>
        </li>
        <!-- ... -->
      </ul>
    </details>
    
    <details class="menu-category">
      <summary>
        Салаты <span class="count">(15)</span>
      </summary>
      <!-- ... -->
    </details>
  </div>
</div>
```

#### 2.5 Соцсети - иконки
```html
<div class="social-links">
  <a href="https://vk.com/..." class="social-icon vk" target="_blank" title="VK">
    <svg><!-- VK icon --></svg>
  </a>
  <a href="https://telegram.org/..." class="social-icon telegram" target="_blank" title="Telegram">
    <svg><!-- Telegram icon --></svg>
  </a>
  <a href="https://youtube.com/..." class="social-icon youtube" target="_blank" title="YouTube">
    <svg><!-- YouTube icon --></svg>
  </a>
</div>
```

---

### Этап 3: Улучшение адаптивности 📱

#### 3.1 Мобильная навигация
```css
@media (max-width: 768px) {
  /* Бургер-меню */
  .mobile-nav-toggle { display: block; }
  
  /* Скрытие меню по умолчанию */
  .nav-menu {
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }
  
  /* Карточки в одну колонку */
  .grid-container {
    grid-template-columns: 1fr;
  }
  
  /* Большие touch-friendly кнопки */
  .action-button {
    min-height: 48px;
    padding: 16px 24px;
  }
}
```

#### 3.2 Свайпы для галереи
```javascript
// Touch events для галереи
let touchStartX = 0;
let touchEndX = 0;

gallery.addEventListener('touchstart', e => {
  touchStartX = e.changedTouches[0].screenX;
});

gallery.addEventListener('touchend', e => {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
});

function handleSwipe() {
  if (touchStartX - touchEndX > 50) nextImage();
  if (touchEndX - touchStartX > 50) prevImage();
}
```

#### 3.3 Оптимизация контента
- Скрывать длинные описания под кат
- Приоритет важной информации
- Ленивая загрузка изображений
- Кэширование данных

---

## 📅 ПРИОРИТЕТЫ РЕАЛИЗАЦИИ

### 🔴 Высокий приоритет (необходимо):
1. ✅ Скачать изображения локально (хотя бы для Москвы)
2. ✅ Особенности - аккордеон
3. ✅ Время работы с индикатором
4. ✅ Галерея изображений

### 🟡 Средний приоритет (желательно):
5. ✅ Меню - аккордеон
6. ✅ Соцсети - иконки
7. ✅ Улучшить мобильную навигацию

### 🟢 Низкий приоритет (опционально):
8. Свайпы для галереи
9. Поиск по меню
10. Расширенная группировка особенностей

---

## ⏱ ОЦЕНКА ВРЕМЕНИ

| Задача | Время | Сложность |
|--------|-------|-----------|
| Скачать изображения (Москва) | 2-3 часа | Средняя |
| Особенности - аккордеон | 1-2 часа | Низкая |
| Время работы + индикатор | 1 час | Низкая |
| Галерея изобраений | 2-3 часа | Средняя |
| Меню - аккордеон | 1 час | Низкая |
| Соцсети - иконки | 30 мин | Низкая |
| Улучшение адаптива | 3-4 часа | Высокая |
| **Итого:** | **10-15 часов** | |

---

## 🛠 ТЕХНИЧЕСКАЯ РЕАЛИЗАЦИЯ

### Необходимые файлы:
```
scripts/
├── download-images.js      # Скрипт скачивания изображений
├── group-features.js       # Группировка особенностей

styles/
├── components/
│   ├── features.css        # Стили особенностей
│   ├── gallery.css         # Галерея
│   ├── menu.css            # Меню
│   ├── working-hours.css   # Время работы
│   └── social-icons.css    # Соцсети
└── responsive.css          # Адаптив

assets/
└── images/                 # Локальные изображения
```

### Зависимости:
```json
{
  "dependencies": {
    "axios": "^1.6.0",      // Для скачивания изображений
    "sharp": "^0.33.0"      // Оптимизация изображений
  }
}
```

---

## ✅ КРИТЕРИИ ГОТОВНОСТИ

- [ ] Все изображения загружены локально
- [ ] Особенности скрываются под кат
- [ ] Время работы показывает статус
- [ ] Галерея работает с миниатюрами
- [ ] Меню сгруппировано по категориям
- [ ] Соцсети показаны иконками
- [ ] Мобильная версия удобна
- [ ] Производительность не упала

---

## 📝 СЛЕДУЮЩИЕ ШАГИ

1. Обсудить план
2. Выбрать приоритеты
3. Начать с этапа 1.1 (скачивание изображений)
4. Постепенно реализовывать каждый пункт

---

**Готов приступить к реализации!** 🚀
