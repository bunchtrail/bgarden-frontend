# Руководство по стилям для модуля образцов (specimens)

## Общие принципы

- Модуль образцов использует Tailwind CSS v3.3.0 для стилизации компонентов.
- Все стили должны соответствовать общему дизайну приложения Botanical Garden.
- Используйте глобальные стили из `src/styles/global-styles.ts` вместо прямого применения классов Tailwind.
- Все UI компоненты должны импортироваться из модуля `ui`.

## Цветовая схема

При работе с образцами растений используйте цветовую схему, соответствующую типу сектора растения:

```jsx
import { sectorTypeColors } from '../../specimens/styles';

// Пример использования цветов в зависимости от типа сектора:
<div className={`${sectorTypeColors[specimen.sectorType].bg} p-4 rounded-lg`}>
  <span className={sectorTypeColors[specimen.sectorType].text}>
    {specimen.russianName}
  </span>
</div>
```

## Подробное руководство по стилизации компонентов

### Карточки образцов (SpecimenCard)

- Используйте компонент `Card` из модуля `ui` для отображения карточек образцов:

```jsx
import { Card } from '@/modules/ui';
import { sectorTypeColors } from '../../specimens/styles';

<Card 
  title={specimen.russianName}
  subtitle={specimen.latinName}
  className={sectorTypeColors[specimen.sectorType].bg}
>
  <p className="text-sm">{specimen.familyName}</p>
  <p className="text-xs text-gray-600">{specimen.inventoryNumber}</p>
</Card>
```

### Формы для образцов

- Используйте компоненты формы из модуля `ui`:

```jsx
import { TextField, Select, CheckboxField, Textarea, Button } from '@/modules/ui';
import { formStyles } from '../../specimens/styles';

// Пример поля формы:
<div className="mb-4">
  <TextField
    label="Русское название"
    name="russianName"
    value={formData.russianName}
    onChange={handleChange}
    required
  />
</div>

// Пример выпадающего списка:
<div className="mb-4">
  <Select
    label="Семейство"
    name="familyId"
    value={formData.familyId}
    onChange={handleChange}
    options={familiesList}
    required
  />
</div>
```

### Кнопки действий

- Используйте кнопки из модуля `ui` с соответствующими стилями:

```jsx
import { Button } from '@/modules/ui';
import { buttonStyles } from '../../specimens/styles';

// Основная кнопка сохранения
<Button variant="primary" onClick={handleSave}>
  Сохранить образец
</Button>

// Кнопка удаления
<Button variant="danger" onClick={handleDelete}>
  Удалить образец
</Button>

// Кнопка отмены
<Button variant="secondary" onClick={handleCancel}>
  Отмена
</Button>
```

### Списки образцов

Для отображения списков образцов используйте следующие стили:

```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {specimens.map(specimen => (
    <SpecimenCard key={specimen.id} specimen={specimen} />
  ))}
</div>
```

## Адаптивный дизайн

- Используйте классы Tailwind для адаптивного дизайна:
  - `sm:` - для экранов шириной от 640px
  - `md:` - для экранов шириной от 768px
  - `lg:` - для экранов шириной от 1024px
  - `xl:` - для экранов шириной от 1280px

Пример адаптивного отображения:

```jsx
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
  {/* Карточки образцов */}
</div>
```

## Анимации и переходы

Для улучшения пользовательского опыта используйте анимации и переходы:

```jsx
<div className="transition-all duration-300 hover:shadow-lg">
  {/* Содержимое с анимацией при наведении */}
</div>
```

## Состояния интерактивных элементов

Используйте различные состояния для интерактивных элементов:

- Обычное состояние: стандартные стили
- При наведении (`hover:`): изменение цвета или тени
- При активации (`active:`): изменение масштаба или прозрачности
- При фокусе (`focus:`): добавление обводки 