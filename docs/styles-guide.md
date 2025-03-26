# Руководство по стилям Botanical Garden App

## Основные принципы
- Проект использует **Tailwind CSS v3.3.0**
- Дизайн в минималистичном стиле Apple
- Mobile-first подход к адаптивности
- Используйте стили из `src/styles/global-styles.ts`

## Цветовая палитра
```jsx
export const COLORS = {
  primary: { main: '#0A84FF', dark: '#0071E3', light: '#E1F0FF' },
  secondary: { main: '#30D158', dark: '#25A93E', light: '#E2F9EB' },
  danger: { main: '#FF3B30', dark: '#D70015', light: '#FFE5E5' },
  warning: { main: '#FF9F0A', dark: '#C93400', light: '#FFF2E5' },
  neutral: { main: '#F5F5F7', dark: '#E5E5EA', light: '#FFFFFF' },
  text: {
    primary: '#1D1D1F',
    secondary: '#86868B',
    tertiary: '#AEAEB2'
  }
};
```

## UI компоненты

### Кнопки
```jsx
import { Button } from '../modules/ui';

<Button 
  variant="primary" // primary, secondary, danger, warning, neutral, success
  size="medium" // small, medium, large
  isFullWidth={false}
  isLoading={false}
  isDisabled={false}
  onClick={() => {}}
>
  Текст кнопки
</Button>
```

### Карточки
```jsx
import { Card } from '../modules/ui';

<Card 
  title="Заголовок"
  subtitle="Подзаголовок"
  variant="elevated" // elevated, outlined, filled
>
  Содержимое
</Card>
```

### Текст
```jsx
import { textClasses } from '../styles/global-styles';

<h1 className={textClasses.heading}>Заголовок</h1>
<p className={textClasses.body}>Основной текст</p>
<span className={textClasses.small}>Маленький текст</span>
```

### Чипы/Теги
```jsx
import { chipClasses } from '../styles/global-styles';

<span className={`${chipClasses.base} ${chipClasses.primary}`}>Тег</span>
```

## Макеты и сетки
```jsx
import { layoutClasses } from '../styles/global-styles';

<div className={layoutClasses.container}>
  <section className={layoutClasses.section}>
    <div className={layoutClasses.grid2}>...</div>
    <div className={layoutClasses.flexBetween}>...</div>
  </section>
</div>
```

## Формы
```jsx
import { TextField } from '../modules/ui/components/Form';

<TextField 
  label="Имя пользователя"
  placeholder="Введите имя"
  error="Ошибка валидации"
  value={value}
  onChange={setValue}
/>
```

## Адаптивность
Используйте брейкпоинты Tailwind:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

```jsx
<div className="w-full sm:w-3/4 md:w-1/2 lg:w-1/3">Контент</div>
```

## Рекомендации
1. Изучите существующие компоненты в модуле UI
2. Следуйте композиции компонентов
3. Используйте предопределенные классы из global-styles.ts
4. Проверяйте компоненты на всех размерах экрана
5. Для проверки стилей запустите `npm run build` 