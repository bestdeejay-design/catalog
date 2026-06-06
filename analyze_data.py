import json
import os

# Загружаем данные по Москве
with open('data/moscow.json', 'r', encoding='utf-8') as f:
    moscow_data = json.load(f)

print("=" * 60)
print("АНАЛИЗ ДАННЫХ ПО МОСКВЕ")
print("=" * 60)
print(f"Всего заведений: {len(moscow_data)}")
print()

# Анализируем структуру первого заведения
if moscow_data:
    first_establishment = moscow_data[0]
    print("Структура первого заведения:")
    print(f"Keys: {list(first_establishment.keys())}")
    print()
    
    # Проверяем наличие category_id
    has_category_id = 'category_id' in first_establishment
    print(f"Есть ли поле category_id? {has_category_id}")
    
    if not has_category_id:
        print("❌ ПРОБЛЕМА: Нет поля category_id!")
        print("   Нужно добавить логику для присваивания категорий")
    
    # Смотрим на features
    if 'features' in first_establishment:
        features = json.loads(first_establishment['features'])
        print(f"\nFeatures (первые 10): {features[:10] if len(features) > 10 else features}")
        
    # Смотрим на название и категорию
    print(f"\nНазвание: {first_establishment.get('name')}")
    print(f"Описание (первые 200 симв): {first_establishment.get('description', '')[:200]}")

print("\n" + "=" * 60)
print("СРАВНЕНИЕ ВЕСА И РЕАЛЬНОГО КОЛИЧЕСТВА")
print("=" * 60)

# Загружаем города
with open('data/1-cities.json', 'r', encoding='utf-8') as f:
    cities = json.load(f)

# Считаем количество заведений в каждом городе
city_files = [f for f in os.listdir('data') if f.endswith('.json') and f not in ['1-cities.json', '2-categories.json', '3-tags.json', '4-company_categories.json']]

print(f"Найдено файлов с городами: {len(city_files)}")
print()

# Проверяем несколько городов
for city_slug in ['moscow', 'spb', 'ekaterinburg']:
    try:
        with open(f'data/{city_slug}.json', 'r', encoding='utf-8') as f:
            city_data = json.load(f)
        
        city_info = next((c for c in cities if c['slug'] == city_slug), None)
        if city_info:
            actual_count = len(city_data)
            weight = city_info.get('weight', 0)
            print(f"{city_info['name']}:")
            print(f"  Вес города: {weight:,}")
            print(f"  Реально заведений: {actual_count:,}")
            print(f"  Разница: {abs(weight - actual_count):,}")
            print()
    except FileNotFoundError:
        print(f"Файл {city_slug}.json не найден")
