# Руководство по стилям для модуля карты (map)

## Общие принципы

- Модуль карты использует Tailwind CSS v3.3.0 для базовой стилизации компонентов.
- Для специфических стилей компонентов карты используется CSS-модуль `map.module.css`.
- По возможности используйте глобальные стили из `src/styles/global-styles.ts`.

## Специфические стили модуля карты

### CSS-модули

- Модуль карты использует собственный CSS-модуль для стилизации:

```jsx
import styles from '../map.module.css';

<div className={styles.mapContainer}>{/* Компоненты карты */}</div>;
```

### Глобальные стили для общих элементов

- Для кнопок, форм и других общих элементов используйте глобальные стили:

```jsx
import { buttonClasses, formClasses } from '../../../styles/global-styles';

<button className={`${buttonClasses.base} ${buttonClasses.primary}`}>
  Добавить растение
</button>;
```

## Компоненты карты

### Контейнер карты

- Для контейнера карты используйте стили из CSS-модуля:

```jsx
import styles from '../map.module.css';

<div className={styles.mapWrapper}>
  <div className={styles.mapContainer}>{/* Компоненты карты */}</div>
</div>;
```

### Элементы управления картой

- Для элементов управления используйте стили из `styles.ts` модуля:

```jsx
import { controlStyles } from '../styles';

<div className={controlStyles.controlPanel}>{/* Элементы управления */}</div>;
```

### Маркеры растений

- Для маркеров используйте стили из CSS-модуля и глобальные стили для подсказок:

```jsx
import styles from '../map.module.css';
import { chipClasses } from '../../../styles/global-styles';

<div className={styles.marker}>
  <div className={styles.markerIcon}></div>
  <div className={`${chipClasses.base} ${chipClasses.primary}`}>
    Название растения
  </div>
</div>;
```

### Формы добавления/редактирования растений

- Для форм используйте глобальные стили в сочетании с CSS-модулем:

```jsx
import styles from '../map.module.css';
import { formClasses } from '../../../styles/global-styles';

<form className={`${formClasses.base} ${styles.plantForm}`}>
  {/* Поля формы */}
</form>;
```

## Модальные окна в модуле карты

- Для модальных окон используйте стили из `styles.ts`:

```jsx
import { modalStyles } from '../styles';

<div className={modalStyles.modalOverlay}>
  <div className={modalStyles.modalContent}>
    {/* Содержимое модального окна */}
  </div>
</div>;
```

## Цветовая палитра для маркеров и слоев

- Используйте константы цветов из `src/styles/global-styles.ts` или специфические цвета из `styles.ts` модуля карты:

```jsx
import { COLORS } from '../../../styles/global-styles';
import { MAP_COLORS } from '../styles';

// Стиль для маркера с использованием цветов
const markerStyle = {
  backgroundColor: MAP_COLORS.MARKER_PRIMARY,
  border: `2px solid ${COLORS.PRIMARY}`,
};
```

## Респонсивный дизайн карты

- Используйте медиа-запросы в CSS-модуле и Tailwind-классы для адаптивности:

```jsx
// В CSS-модуле
@media (max-width: 768px) {
  .mapControls {
    flex-direction: column;
  }
}

// В JSX с Tailwind
<div className="flex flex-col md:flex-row">
  {/* Элементы управления */}
</div>
```

## Важные замечания

- Перед внесением изменений в стили карты ознакомьтесь с архитектурой модуля в `README.md`.
- При добавлении новых CSS-классов в `map.module.css` обновите также типы в `map.module.css.d.ts`.
- Проверяйте, что карта корректно отображается на мобильных устройствах.
