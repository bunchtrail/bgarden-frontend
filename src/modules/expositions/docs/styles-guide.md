# Руководство по стилям для модуля экспозиций (expositions)

## Общие принципы

- Модуль экспозиций использует Tailwind CSS v3.3.0 для стилизации компонентов.
- Все компоненты должны соответствовать минималистичному дизайну в стиле Apple.
- Используйте глобальные стили из `src/styles/global-styles.ts`.

## Основные компоненты и их стилизация

### Карточки экспозиций

- Используйте компонент `Card` из `src/components/Card.tsx`.
- Или применяйте классы карточек из глобальных стилей:

```jsx
import { cardClasses } from '../../../styles/global-styles';

<div className={`${cardClasses.base} ${cardClasses.interactive}`}>
  <div className={cardClasses.body}>
    <h3 className={cardClasses.title}>Название экспозиции</h3>
    <p className={cardClasses.subtitle}>Описание экспозиции</p>
  </div>
</div>;
```

### Формы для создания/редактирования экспозиций

- Для форм используйте глобальные стили:

```jsx
import { formClasses, buttonClasses } from '../../../styles/global-styles';

<form className={formClasses.base}>
  <div className={formClasses.control}>
    <label className={formClasses.label}>Название</label>
    <input className={formClasses.input} type='text' />
  </div>
  <button
    type='submit'
    className={`${buttonClasses.base} ${buttonClasses.primary}`}
  >
    Сохранить
  </button>
</form>;
```

### Списки экспозиций

- Используйте таблицы или сетки из глобальных стилей:

```jsx
import { tableClasses, layoutClasses } from '../../../styles/global-styles';

// Для таблиц
<div className={tableClasses.container}>
  <table className={tableClasses.table}>
    {/* Содержимое таблицы */}
  </table>
</div>

// Или для сеток
<div className={layoutClasses.gridSm3}>
  {/* Карточки экспозиций */}
</div>
```

### Чипы и теги для категорий

- Используйте компонент `Chip` из `src/components/ui/Chip.tsx` или классы из глобальных стилей:

```jsx
import { chipClasses } from '../../../styles/global-styles';

<span className={`${chipClasses.base} ${chipClasses.primary}`}>
  Тропические
</span>;
```

## Цветовая палитра

- Основной цвет: #0A84FF (Apple blue)
- Дополнительные цвета:
  - Успех: #30D158 (Apple green)
  - Предупреждение: #FF9F0A (Apple orange)
  - Опасность: #FF3B30 (Apple red)
- Используйте константы цветов из `COLORS` в `global-styles.ts`

## Адаптивный дизайн

- Для списков экспозиций используйте responsive grid:

```jsx
<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
  {/* Карточки экспозиций */}
</div>
```

## Анимации и интерактивность

- Используйте анимации из глобальных стилей:

```jsx
import { animationClasses } from '../../../styles/global-styles';

<div className={animationClasses.transition}>
  {/* Содержимое с анимацией */}
</div>;
```

## Важные замечания

- При добавлении новых компонентов сохраняйте консистентность с существующими стилями.
- Тестируйте адаптивность компонентов на разных разрешениях экрана.
