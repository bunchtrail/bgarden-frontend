# Модуль Specimens - Образцы растений

Модуль для управления коллекцией образцов растений в Ботаническом саду. Адаптирован под использование Tailwind CSS.

## Компоненты

### SpecimenCard

Компонент для отображения карточки образца растения с основной информацией.

### SpecimenForm

Форма для добавления и редактирования образцов растений.

### SpecimensList

Компонент списка образцов с возможностью поиска, фильтрации и пагинации.

### SpecimenActions

Панель с действиями для управления образцами (навигация, добавление, печать, экспорт).

## Иконки

Модуль включает собственные SVG иконки, расположенные в директории `icons`.

## Структура

```
specimens/
├── components/
│   ├── icons/
│   │   └── index.tsx        # SVG-иконки для замены MUI Icons
│   ├── index.ts             # Экспорт компонентов
│   ├── SpecimenActions.tsx  # Панель действий
│   ├── SpecimenCard.tsx     # Карточка образца
│   ├── SpecimenForm.tsx     # Форма образца
│   ├── specimens.module.css # CSS модуль с Tailwind классами
│   ├── SpecimensList.tsx    # Список образцов
│   └── styles.ts            # Общие стили Tailwind
├── contexts/                # Контексты React (будущее расширение)
├── hooks/                   # Хуки для работы с образцами
├── services/                # Сервисы API
├── types/
│   └── index.ts             # Типы и интерфейсы
├── index.ts                 # Экспорт модуля
└── README.md                # Документация
```

## Использование

```tsx
import { SpecimenCard, SpecimenForm, SpecimensList, SpecimenActions } from 'modules/specimens';

// Пример использования компонента списка образцов
const SpecimensPage = () => {
  const specimens = [...]; // Данные образцов

  return (
    <SpecimensList
      specimens={specimens}
      onViewSpecimen={(id) => console.log(`View specimen ${id}`)}
      onEditSpecimen={(id) => console.log(`Edit specimen ${id}`)}
      onSearch={(params) => console.log('Search with params', params)}
    />
  );
};
```
