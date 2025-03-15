# Руководство по стилям Botanical Garden App

## Введение
Данное руководство описывает унифицированную систему стилей для приложения Botanical Garden App. Мы используем Tailwind CSS v3.3.0 как основу для всех стилей с акцентом на минималистичный дизайн в стиле Apple.

## Общие принципы
1. **Использование глобальных стилей**: Все общие стили определены в `src/styles/global-styles.ts`
2. **Предпочтение Tailwind**: Используйте предопределенные Tailwind-классы вместо создания новых CSS-правил
3. **Минимализм**: Следуйте минималистичному подходу в дизайне с аккуратными переходами и четкой иерархией
4. **Консистентность**: Используйте одинаковые компоненты для сходных задач

## Структура стилей

### Глобальные константы
```typescript
// Импорт констант
import { COLORS, SPACING, HEIGHTS } from '../styles/global-styles';

// Пример использования
<div style={{ height: HEIGHTS.HEADER }}>Header</div>
<div className={SPACING.MD}>Content with padding</div>
```

### Классы компонентов
```typescript
// Импорт классов
import { 
  containerClasses, 
  textClasses, 
  buttonClasses, 
  formClasses 
} from '../styles/global-styles';

// Пример использования
<div className={containerClasses.base}>
  <h2 className={textClasses.heading}>Заголовок</h2>
  <p className={textClasses.body}>Основной текст</p>
  <button className={`${buttonClasses.base} ${buttonClasses.primary}`}>
    Кнопка
  </button>
</div>
```

## Основные компоненты

### Контейнеры
```tsx
// Базовый контейнер
<div className={containerClasses.base}>
  Содержимое
</div>

// Контейнер с наведением
<div className={`${containerClasses.base} ${containerClasses.withHover}`}>
  Содержимое с эффектом наведения
</div>

// Современный контейнер
<div className={containerClasses.modern}>
  Содержимое с современным дизайном
</div>

// Стеклянный контейнер
<div className={containerClasses.glass}>
  Содержимое с эффектом стекла
</div>
```

### Текст
```tsx
// Заголовки
<h1 className={textClasses.page}>Заголовок страницы</h1>
<h2 className={textClasses.heading}>Основной заголовок</h2>
<h3 className={textClasses.subheading}>Подзаголовок</h3>

// Тело текста
<p className={textClasses.body}>Обычный текст</p>
<p className={textClasses.multiline}>Многострочный
текст</p>
<p className={`${textClasses.body} ${textClasses.secondary}`}>
  Вторичный текст
</p>

// Современный текст
<p className={textClasses.modern}>Текст с градиентом</p>
```

### Кнопки
```tsx
// Основные кнопки
<button className={`${buttonClasses.base} ${buttonClasses.primary}`}>
  Основная кнопка
</button>
<button className={`${buttonClasses.base} ${buttonClasses.secondary}`}>
  Вторичная кнопка
</button>

// Кнопки состояния
<button className={`${buttonClasses.base} ${buttonClasses.success}`}>
  Успех
</button>
<button className={`${buttonClasses.base} ${buttonClasses.warning}`}>
  Предупреждение
</button>
<button className={`${buttonClasses.base} ${buttonClasses.danger}`}>
  Опасность
</button>

// Специальные кнопки
<button className={buttonClasses.link}>
  Ссылка
</button>
<button className={buttonClasses.icon}>
  <IconComponent />
</button>
<button className={buttonClasses.modern}>
  Современная кнопка
</button>
```

### Формы
```tsx
<form className={formClasses.base}>
  <div className={formClasses.control}>
    <label className={formClasses.label}>Поле ввода</label>
    <input className={formClasses.input} type="text" />
    <p className={formClasses.hint}>Подсказка</p>
  </div>
  
  <div className={formClasses.control}>
    <label className={formClasses.label}>Выбор</label>
    <select className={formClasses.select}>
      <option>Опция 1</option>
      <option>Опция 2</option>
    </select>
  </div>
  
  <div className={formClasses.actions}>
    <button className={`${buttonClasses.base} ${buttonClasses.secondary}`}>
      Отмена
    </button>
    <button className={`${buttonClasses.base} ${buttonClasses.primary}`}>
      Сохранить
    </button>
  </div>
</form>
```

### Таблицы
```tsx
<div className={tableClasses.container}>
  <table className={tableClasses.table}>
    <thead>
      <tr>
        <th className={tableClasses.header}>Название</th>
        <th className={tableClasses.header}>Значение</th>
      </tr>
    </thead>
    <tbody>
      <tr className={tableClasses.row}>
        <td className={tableClasses.cell}>Ячейка 1</td>
        <td className={tableClasses.cell}>Ячейка 2</td>
      </tr>
    </tbody>
  </table>
</div>

// Современный стиль таблицы
<div className={tableClasses.container}>
  <table className={tableClasses.modern}>
    <thead>
      <tr>
        <th className={tableClasses.modernHeader}>Название</th>
        <th className={tableClasses.modernHeader}>Значение</th>
      </tr>
    </thead>
    <tbody>
      <tr className={tableClasses.modernRow}>
        <td className={tableClasses.modernCell}>Ячейка 1</td>
        <td className={tableClasses.modernCell}>Ячейка 2</td>
      </tr>
    </tbody>
  </table>
</div>
```

### Карточки
```tsx
<div className={cardClasses.base}>
  <div className={cardClasses.body}>
    <h3 className={cardClasses.title}>Заголовок карточки</h3>
    <p className={cardClasses.subtitle}>Подзаголовок</p>
    <div className={cardClasses.content}>
      Содержимое карточки
    </div>
  </div>
  <div className={cardClasses.footer}>
    Футер карточки
  </div>
</div>

// Интерактивная карточка
<div className={`${cardClasses.base} ${cardClasses.interactive}`}>
  Интерактивная карточка
</div>

// Специальные карточки
<div className={cardClasses.specimenCard}>
  Карточка образца
</div>
<div className={cardClasses.sectorCard}>
  Карточка сектора
</div>
```

### Вкладки
```tsx
// Классические вкладки
<div className={tabClasses.base}>
  <button className={`${tabClasses.active}`}>Активная вкладка</button>
  <button className={`${tabClasses.inactive}`}>Неактивная вкладка</button>
</div>

// Современные вкладки
<div className={tabClasses.container}>
  <div className={tabClasses.modernTabs}>
    <button className={`${tabClasses.modernTab} ${tabClasses.modernActive}`}>
      Активная вкладка
    </button>
    <button className={`${tabClasses.modernTab} ${tabClasses.modernInactive}`}>
      Неактивная вкладка
    </button>
  </div>
  <div className="p-4">
    Содержимое активной вкладки
  </div>
</div>

// Вкладки-пилюли
<div className={tabClasses.pillContainer}>
  <button className={`${tabClasses.pillTab} ${tabClasses.pillActive}`}>
    Активная
  </button>
  <button className={`${tabClasses.pillTab} ${tabClasses.pillInactive}`}>
    Неактивная
  </button>
</div>
```

## Рекомендации по использованию

### Адаптивный дизайн
Используйте префиксы адаптивности Tailwind для создания отзывчивых интерфейсов:
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Содержимое сетки */}
</div>
```

### Анимации и переходы
```tsx
// Плавный переход
<div className={animationClasses.transition}>
  Элемент с плавным переходом
</div>

// Эффект наведения
<div className={animationClasses.hover}>
  Элемент с эффектом наведения
</div>

// Пружинный эффект при наведении
<div className={animationClasses.springHover}>
  Элемент с пружинным эффектом
</div>

// Добавление анимации
<div className={animationClasses.slideInRight}>
  Элемент с анимацией появления справа
</div>
```

## Импорт стилей в модулях
В каждом модуле рекомендуется создать файл ре-экспорта стилей для обратной совместимости:

```typescript
// src/modules/specimens/styles.ts
import {
  containerClasses,
  buttonClasses,
  textClasses,
  // другие импорты
} from '../../styles/global-styles';

// Экспорт под привычными именами для обратной совместимости
export const specimenContainerClasses = containerClasses;
export const specimenButtonClasses = buttonClasses;
// другие экспорты
```

## Цветовая палитра
Используйте предопределенные цвета из COLORS:
```typescript
import { COLORS } from '../styles/global-styles';

<div style={{ color: COLORS.PRIMARY }}>Синий текст</div>
<div style={{ backgroundColor: COLORS.SUCCESS_LIGHT }}>
  Блок с легким зеленым фоном
</div>
``` 