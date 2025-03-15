# Руководство по миграции на новую систему стилей

Это руководство описывает шаги, необходимые для перехода компонентов на новую унифицированную систему стилей Botanical Garden App.

## Шаг 1: Импорт глобальных стилей вместо модульных

**Было:**
```tsx
// Импорт стилей из модуля
import { specimenContainerClasses } from '../specimens/components/styles';
```

**Стало:**
```tsx
// Вариант 1: Прямой импорт из глобальных стилей
import { containerClasses } from '../../styles/global-styles';

// Вариант 2: Импорт через файл ре-экспорта модуля (рекомендуется)
import { specimenContainerClasses } from '../specimens/styles';
```

## Шаг 2: Замена инлайн Tailwind-классов на классы из global-styles

**Было:**
```tsx
<div className="p-4 bg-white shadow rounded-lg">
  <h2 className="text-xl font-semibold mb-2">Заголовок</h2>
  <p className="text-gray-600">Описание</p>
  <button className="bg-blue-600 text-white px-4 py-2 rounded-md mt-4">Кнопка</button>
</div>
```

**Стало:**
```tsx
<div className={containerClasses.base}>
  <h2 className={textClasses.heading}>Заголовок</h2>
  <p className={textClasses.body}>Описание</p>
  <button className={`${buttonClasses.base} ${buttonClasses.primary}`}>Кнопка</button>
</div>
```

## Шаг 3: Использование новых компонентов вместо CSS-модулей

**Было:**
```tsx
import styles from './specimens.module.css';

<div className={styles.specimenCard}>
  <img className={styles.specimenImage} src={imageUrl} alt={name} />
  <div className={styles.specimenContent}>
    <h3 className={styles.specimenTitle}>{name}</h3>
    <p className={styles.specimenDescription}>{description}</p>
  </div>
</div>
```

**Стало:**
```tsx
import { cardClasses, textClasses } from '../../styles/global-styles';

<div className={cardClasses.specimenCard}>
  <img className="w-full h-40 object-cover" src={imageUrl} alt={name} />
  <div className={cardClasses.body}>
    <h3 className={cardClasses.title}>{name}</h3>
    <p className={textClasses.body}>{description}</p>
  </div>
</div>
```

## Шаг 4: Добавление новых классов для таблиц

**Было:**
```tsx
<div className="overflow-x-auto">
  <table className="min-w-full bg-white">
    <thead>
      <tr>
        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Имя</th>
        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Значение</th>
      </tr>
    </thead>
    <tbody>
      <tr className="border-b hover:bg-gray-50">
        <td className="px-4 py-2">Значение 1</td>
        <td className="px-4 py-2">Значение 2</td>
      </tr>
    </tbody>
  </table>
</div>
```

**Стало:**
```tsx
import { tableClasses } from '../../styles/global-styles';

<div className={tableClasses.container}>
  <table className={tableClasses.table}>
    <thead>
      <tr>
        <th className={tableClasses.header}>Имя</th>
        <th className={tableClasses.header}>Значение</th>
      </tr>
    </thead>
    <tbody>
      <tr className={tableClasses.row}>
        <td className={tableClasses.cell}>Значение 1</td>
        <td className={tableClasses.cell}>Значение 2</td>
      </tr>
    </tbody>
  </table>
</div>
```

## Шаг 5: Использование новых классов для форм

**Было:**
```tsx
<form className="space-y-4">
  <div>
    <label className="block text-sm font-medium text-gray-700">Поле ввода</label>
    <input 
      type="text" 
      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
    />
  </div>
  <div className="flex justify-end gap-2">
    <button 
      type="button" 
      className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md"
    >
      Отмена
    </button>
    <button 
      type="submit" 
      className="bg-blue-600 text-white px-4 py-2 rounded-md"
    >
      Сохранить
    </button>
  </div>
</form>
```

**Стало:**
```tsx
import { formClasses, buttonClasses } from '../../styles/global-styles';

<form className={formClasses.base}>
  <div className={formClasses.control}>
    <label className={formClasses.label}>Поле ввода</label>
    <input 
      type="text" 
      className={formClasses.input}
    />
  </div>
  <div className={formClasses.actions}>
    <button 
      type="button" 
      className={`${buttonClasses.base} ${buttonClasses.secondary}`}
    >
      Отмена
    </button>
    <button 
      type="submit" 
      className={`${buttonClasses.base} ${buttonClasses.primary}`}
    >
      Сохранить
    </button>
  </div>
</form>
```

## Шаг 6: Использование анимаций

**Было:**
```tsx
<div className="transition-all duration-300 hover:shadow-md hover:-translate-y-1">
  Элемент с анимацией
</div>
```

**Стало:**
```tsx
import { animationClasses } from '../../styles/global-styles';

<div className={animationClasses.hover}>
  Элемент с анимацией
</div>
```

## Шаг 7: Использование новых компонентов

**Новые компоненты вкладок:**
```tsx
import { tabClasses } from '../../styles/global-styles';

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
```

**Новые контейнеры:**
```tsx
import { containerClasses } from '../../styles/global-styles';

// Стеклянный контейнер
<div className={containerClasses.glass}>
  Содержимое с эффектом стекла
</div>

// Современный контейнер
<div className={containerClasses.modern}>
  Содержимое с современным дизайном
</div>
```

## Отладка и проверка

1. Проверьте, что все компоненты правильно отображаются после миграции
2. Убедитесь, что адаптивный дизайн работает корректно
3. Проверьте все интерактивные эффекты (наведение, анимации)

## Обратная совместимость

Для обеспечения обратной совместимости используйте файлы ре-экспорта в модулях:
- `src/modules/specimens/styles.ts`
- `src/modules/map/styles.ts`
- `src/modules/expositions/styles.ts`

Эти файлы переопределяют глобальные стили для конкретных модулей, сохраняя прежние имена классов и констант. 