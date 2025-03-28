# Модуль образцов растений (Specimens Module)

## Описание
Модуль предназначен для работы с образцами растений в ботаническом саду. Он позволяет добавлять, просматривать, редактировать и удалять информацию о растениях в базе данных.

## Документация

- [Руководство по стилям](./styles-guide.md) - правила стилизации компонентов модуля
- [Руководство по разработке](./development-guide.md) - принципы и практики разработки
- [Интеграция с API](./api-integration.md) - работа с API сервера
- [Библиотека компонентов](./component-library.md) - описание и примеры использования компонентов

## Структура модуля

```
specimens/
├── components/            # Компоненты для работы с образцами
│   ├── specimen-actions/  # Компоненты для действий с образцами (добавление, удаление, и т.д.)
│   ├── specimen-card/     # Карточка образца для отображения
│   ├── specimen-form/     # Формы для добавления/редактирования образцов
│   │   └── geographic/    # Компоненты для географических данных образца
│   ├── specimen-gallery/  # Галерея изображений образца
│   ├── specimen-taxonomy/ # Компоненты для таксономической информации
│   └── specimens-list/    # Список образцов
├── contexts/              # React контексты для управления состоянием
├── docs/                  # Документация
├── hooks/                 # React хуки для логики образцов
├── services/              # Сервисы для работы с API
├── styles/                # Стили, специфичные для модуля
└── types/                 # TypeScript типы и интерфейсы
```

## Основные компоненты

### Страница образца (SpecimenPage)
Основная страница для работы с конкретным образцом. Включает:
- Информацию о растении
- Возможность редактирования данных
- Галерею изображений
- Географическую информацию
- Таксономическую информацию

### Форма добавления/редактирования (SpecimenForm)
Форма для работы с данными образца, содержит следующие группы полей:
- Основная информация (инвентарный номер, названия и т.д.)
- Таксономическая информация (семейство, род, вид и т.д.)
- Географическая информация (координаты, регион, экспозиция)
- Биологическая информация (экология, использование и т.д.)
- Дополнительная информация (примечания, иллюстрации и т.д.)

### Список образцов (SpecimensList)
Компонент для отображения списка образцов с возможностью:
- Фильтрации
- Сортировки
- Поиска
- Выбора режима отображения (таблица/карточки)

## Типы данных

Основные типы:
- `Specimen` - основной тип данных образца
- `SpecimenFormData` - тип для форм добавления/редактирования
- `SpecimenFilterParams` - параметры фильтрации списка

## Правила работы с модулем

1. **Модульность**: Все компоненты, связанные с образцами, должны находиться в данном модуле
2. **Единый стиль**: Использовать UI компоненты из модуля `ui`
3. **Разделение ответственности**: Логика работы с API в сервисах, UI логика в компонентах
4. **Типизация**: Все компоненты и функции должны быть типизированы
5. **Документирование**: Сложная логика должна сопровождаться комментариями
6. **Состояние**: Для управления сложным состоянием использовать React Context

## Последние изменения

### Миграция UI компонентов (16.03.2025)
- ✅ Завершена миграция на централизованную UI библиотеку
- ✅ Удалена директория specimens/components/ui
- ✅ Все компоненты используют импорты из базового модуля `ui`

### Создание документации (16.03.2025)
- ✅ Добавлено руководство по стилям
- ✅ Добавлено руководство по разработке
- ✅ Добавлена документация по интеграции с API
- ✅ Создана библиотека компонентов с примерами использования

## План реализации

1. ✅ Создать базовые компоненты для работы с образцами
2. ✅ Разработать форму для добавления/редактирования образцов
3. ⚠️ Реализовать страницу просмотра конкретного образца
4. ⚠️ Разработать компонент для отображения списка образцов
5. ⚠️ Интегрировать компоненты с сервисами для работы с API 