# Руководство по стилям для модуля утилит (utils)

## Общие принципы

- Модуль utils использует Tailwind CSS v3.3.0 для стилизации компонентов.
- Этот модуль содержит вспомогательные функции и утилиты для работы с UI.
- При разработке вспомогательных функций для стилизации следуйте принципам из этого руководства.

## Основные стили проекта

Ниже представлен полный набор предустановленных стилей, который вы можете использовать в своих компонентах:

### Цветовая палитра

```jsx
// Можно импортировать эти константы в любом компоненте:
import { COLORS } from '../../../styles/global-styles';

// Основные цвета
const colors = {
  PRIMARY: '#0A84FF', // Apple blue
  PRIMARY_DARK: '#0071E3', // Darker Apple blue
  PRIMARY_LIGHT: '#F2F7FF', // Very light blue
  SUCCESS: '#30D158', // Apple green
  SUCCESS_LIGHT: '#F0FFF7', // Very light green
  SUCCESS_DARK: '#28B14C', // Darker green
  WARNING: '#FF9F0A', // Apple orange
  WARNING_LIGHT: '#FFF8F0', // Very light orange
  WARNING_DARK: '#C77A05', // Darker orange
  DANGER: '#FF3B30', // Apple red
  DANGER_DARK: '#D70015', // Darker red
  DANGER_LIGHT: '#FFF5F5', // Very light red
  TEXT_PRIMARY: '#1D1D1F', // Apple dark gray (almost black)
  TEXT_SECONDARY: '#86868B', // Apple medium gray
  TEXT_TERTIARY: '#AEAEB2', // Apple light gray text
  BACKGROUND: '#F5F5F7', // Apple light gray background
  CARD_BG: '#FFFFFF', // White
  SEPARATOR: '#E5E5EA', // Apple separator color
};
```

### Классы для компонентов

Для всех основных компонентов существуют предопределенные классы:

#### Контейнеры

```jsx
import { containerClasses } from '../../../styles/global-styles';

<div className={containerClasses.base}>{/* Содержимое контейнера */}</div>;

// Доступные классы для контейнеров:
// containerClasses.base - базовый контейнер
// containerClasses.withHover - контейнер с эффектом при наведении
// containerClasses.withImage - контейнер с фоновым изображением
```

#### Текст

```jsx
import { textClasses } from '../../../styles/global-styles';

<h2 className={textClasses.heading}>Заголовок</h2>
<p className={textClasses.body}>Обычный текст</p>
<p className={`${textClasses.body} ${textClasses.secondary}`}>Вторичный текст</p>

// Доступные классы для текста:
// textClasses.heading - заголовок
// textClasses.subheading - подзаголовок
// textClasses.body - основной текст
// textClasses.multiline - многострочный текст
// textClasses.secondary - вторичный текст (серый)
// textClasses.tertiary - третичный текст (светло-серый)
```

#### Кнопки

```jsx
import { buttonClasses } from '../../../styles/global-styles';

<button className={`${buttonClasses.base} ${buttonClasses.primary}`}>
  Кнопка
</button>;

// Доступные классы для кнопок:
// buttonClasses.base - базовый стиль кнопки
// buttonClasses.primary - основная кнопка (синяя)
// buttonClasses.secondary - вторичная кнопка (серая)
// buttonClasses.warning - кнопка предупреждения (оранжевая)
// buttonClasses.danger - кнопка опасности (красная)
// buttonClasses.success - кнопка успеха (зеленая)
// buttonClasses.disabled - стиль для отключенной кнопки
```

#### Чипы и теги

```jsx
import { chipClasses } from '../../../styles/global-styles';

<span className={`${chipClasses.base} ${chipClasses.primary}`}>Чип</span>;

// Доступные классы для чипов:
// chipClasses.base - базовый стиль чипа
// chipClasses.primary - основной чип (синий)
// chipClasses.success - чип успеха (зеленый)
// chipClasses.warning - чип предупреждения (оранжевый)
// chipClasses.danger - чип опасности (красный)
// chipClasses.neutral - нейтральный чип (серый)
```

#### Формы

```jsx
import { formClasses } from '../../../styles/global-styles';

<div className={formClasses.control}>
  <label className={formClasses.label}>Метка</label>
  <input className={formClasses.input} type='text' />
  <p className={formClasses.error}>Сообщение об ошибке</p>
</div>;

// Доступные классы для форм:
// formClasses.base - базовый стиль формы
// formClasses.control - контейнер для элемента управления
// formClasses.label - метка поля
// formClasses.input - текстовое поле
// formClasses.select - поле выбора
// formClasses.textarea - многострочное текстовое поле
// formClasses.checkbox - флажок
// formClasses.error - сообщение об ошибке
```

#### Таблицы

```jsx
import { tableClasses } from '../../../styles/global-styles';

<div className={tableClasses.container}>
  <table className={tableClasses.table}>
    <thead>
      <tr>
        <th className={tableClasses.header}>Заголовок</th>
      </tr>
    </thead>
    <tbody>
      <tr className={tableClasses.row}>
        <td className={tableClasses.cell}>Ячейка</td>
      </tr>
    </tbody>
  </table>
</div>;

// Доступные классы для таблиц:
// tableClasses.container - контейнер таблицы с прокруткой
// tableClasses.table - сама таблица
// tableClasses.header - заголовок таблицы
// tableClasses.cell - ячейка таблицы
// tableClasses.row - строка таблицы
// tableClasses.actionCell - ячейка с действиями
```

#### Сетки и макеты

```jsx
import { layoutClasses } from '../../../styles/global-styles';

<div className={layoutClasses.grid}>{/* Элементы сетки */}</div>;

// Доступные классы для макетов:
// layoutClasses.grid - базовая сетка (1 колонка)
// layoutClasses.gridSm2 - сетка (1 колонка, 2 на маленьких экранах)
// layoutClasses.gridSm3 - сетка (1 колонка, до 3 на больших экранах)
// layoutClasses.flex - flex-контейнер
// layoutClasses.flexCenter - центрированный flex-контейнер
// layoutClasses.flexBetween - flex с распределением по краям
// layoutClasses.flexCol - вертикальный flex-контейнер
// layoutClasses.flexWrap - flex с переносом
```

#### Анимации

```jsx
import { animationClasses } from '../../../styles/global-styles';

<div className={animationClasses.transition}>
  {/* Содержимое с анимацией */}
</div>;

// Доступные классы для анимаций:
// animationClasses.fadeIn - появление с анимацией
// animationClasses.transition - плавный переход
// animationClasses.hover - эффект при наведении
// animationClasses.springHover - эффект пружины при наведении
```

### Создание вспомогательных функций для стилизации

Если вы создаете служебные функции для работы со стилями, следуйте этим рекомендациям:

```jsx
// Пример вспомогательной функции для работы с цветами
export const getStatusColor = (status) => {
  const { COLORS } = require('../../../styles/global-styles');

  switch (status) {
    case 'active':
      return COLORS.SUCCESS;
    case 'pending':
      return COLORS.WARNING;
    case 'error':
      return COLORS.DANGER;
    default:
      return COLORS.TEXT_SECONDARY;
  }
};

// Пример вспомогательной функции для генерации классов
export const getButtonClass = (variant) => {
  const { buttonClasses } = require('../../../styles/global-styles');

  let variantClass = buttonClasses.primary; // По умолчанию

  if (buttonClasses[variant]) {
    variantClass = buttonClasses[variant];
  }

  return `${buttonClasses.base} ${variantClass}`;
};
```

## Пример использования утилиты для стилизации

```jsx
// Импортируйте вспомогательные функции из модуля utils
import { getStatusColor, getButtonClass } from '../../utils/styleHelpers';

// Использование в компоненте
const MyComponent = ({ status }) => {
  const statusColor = getStatusColor(status);
  const buttonClass = getButtonClass('success');

  return (
    <div>
      <span style={{ color: statusColor }}>{status}</span>
      <button className={buttonClass}>Кнопка</button>
    </div>
  );
};
```

## Адаптивный дизайн

Вспомогательные функции для адаптивного дизайна должны учитывать следующие контрольные точки:

- sm: 640px - малые устройства
- md: 768px - средние устройства
- lg: 1024px - большие устройства
- xl: 1280px - очень большие устройства

## Важные замечания

- Вспомогательные функции должны быть чистыми и не вызывать побочных эффектов.
- Все вспомогательные функции должны иметь четкую документацию.
- Для сложных стилизаций создавайте отдельные файлы в директории utils.
- Всегда проверяйте корректность стилей на всех размерах экрана.
