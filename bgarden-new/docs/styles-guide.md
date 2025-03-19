# Руководство по стилям для Botanical Garden App

## Общие принципы

- Приложение использует Tailwind CSS v3.3.0 для стилизации компонентов
- Дизайн соответствует минималистичному стилю Apple (iOS/macOS)
- Компоненты должны быть адаптивными (mobile-first подход)
- Для стилизации используются глобальные стили из `src/styles/global-styles.ts`
- Анимации определены в `src/styles/animations.css`

## Цветовая палитра

```jsx
// Основные цвета приложения
export const COLORS = {
  primary: {
    main: '#0A84FF', // Apple blue - основной цвет 
    dark: '#0071E3',
    light: '#E1F0FF',
  },
  secondary: {
    main: '#30D158', // Apple green
    dark: '#25A93E',
    light: '#E2F9EB',
  },
  danger: {
    main: '#FF3B30', // Apple red
    dark: '#D70015',
    light: '#FFE5E5',
  },
  warning: {
    main: '#FF9F0A', // Apple orange
    dark: '#C93400',
    light: '#FFF2E5',
  },
  neutral: {
    main: '#F5F5F7', // Apple light gray
    dark: '#E5E5EA',
    light: '#FFFFFF',
  },
  text: {
    primary: '#1D1D1F', // Apple dark gray
    secondary: '#86868B', // Apple medium gray
    tertiary: '#AEAEB2', // Apple light text
  },
};
```

## Компоненты UI

### Кнопки (Button)

Используйте компонент `Button` из модуля UI:

```jsx
import { Button } from '../modules/ui';

// Пример использования
<Button 
  variant="primary" // primary, secondary, danger, warning, neutral, success
  size="medium" // small, medium, large
  isFullWidth={false}
  isLoading={false}
  isDisabled={false}
  leftIcon={<Icon />}
  rightIcon={<Icon />}
  onClick={() => {}}
>
  Текст кнопки
</Button>
```

Доступные стили кнопок:
- `primary`: синяя кнопка с градиентом (основная)
- `secondary`: белая кнопка с синей рамкой и текстом
- `danger`: красная кнопка с градиентом
- `warning`: оранжевая кнопка с градиентом
- `neutral`: серая кнопка для вторичных действий
- `success`: зеленая кнопка с градиентом

### Карточки (Card)

Используйте компонент `Card` из модуля UI:

```jsx
import { Card } from '../modules/ui';

// Пример использования
<Card 
  title="Заголовок карточки"
  subtitle="Подзаголовок"
  headerAction={<Button>Действие</Button>}
  footer={<div>Футер карточки</div>}
  variant="elevated" // elevated, outlined, filled
  onClick={() => {}}
>
  Содержимое карточки
</Card>
```

Доступные варианты карточек:
- `elevated`: с легкой тенью и фоном (по умолчанию)
- `outlined`: с рамкой без тени
- `filled`: с серым фоном

### Текстовые стили

```jsx
import { textClasses } from '../styles/global-styles';

<h1 className={textClasses.heading}>Заголовок</h1>
<h2 className={textClasses.subheading}>Подзаголовок</h2>
<p className={textClasses.body}>Основной текст</p>
<span className={textClasses.small}>Маленький текст</span>
<p className={textClasses.secondary}>Вторичный текст</p>
<p className={textClasses.tertiary}>Третичный текст</p>
```

### Чипы/Теги (Chips)

```jsx
import { chipClasses } from '../styles/global-styles';

<span className={`${chipClasses.base} ${chipClasses.primary}`}>
  Тег
</span>
```

Доступные варианты чипов:
- `primary`: синий (#E1F0FF с #0A84FF текстом)
- `secondary`: зеленый 
- `danger`: красный
- `warning`: оранжевый
- `neutral`: серый

## Макеты и сетки

```jsx
import { layoutClasses } from '../styles/global-styles';

// Контейнер с ограниченной шириной и отступами
<div className={layoutClasses.container}>
  
  {/* Секция с вертикальными отступами */}
  <section className={layoutClasses.section}>
    
    {/* Сетка из 2 колонок */}
    <div className={layoutClasses.grid2}>
      <div>Элемент 1</div>
      <div>Элемент 2</div>
    </div>
    
    {/* Сетка из 3 колонок */}
    <div className={layoutClasses.grid3}>
      {/* контент */}
    </div>
    
    {/* Flex с выравниванием по краям */}
    <div className={layoutClasses.flexBetween}>
      <div>Слева</div>
      <div>Справа</div>
    </div>
    
    {/* Flex с центрированием */}
    <div className={layoutClasses.flexCenter}>
      <div>По центру</div>
    </div>
  </section>
</div>
```

## Формы и поля ввода

Используйте компоненты из модуля UI/Form:

```jsx
import { TextField } from '../modules/ui/components/Form';

// Пример текстового поля
<TextField 
  label="Имя пользователя"
  placeholder="Введите имя"
  error="Ошибка валидации"
  value={value}
  onChange={setValue}
/>
```

## Анимации

```jsx
import { animationClasses } from '../styles/global-styles';
import '../styles/animations.css';

// Плавное появление
<div className="animate-fadeIn">Появляющийся элемент</div>

// Слайд справа
<div className="animate-slideInRight">Элемент появляется справа</div>

// Пульсация
<div className="animate-pulse-slow">Пульсирующий элемент</div>

// Вращение (например для лоадеров)
<div className="animate-spin-slow">Вращающийся элемент</div>

// Эффект наведения
<div className={animationClasses.springHover}>
  Элемент с эффектом пружины при наведении
</div>
```

## Навигация

Для навигации используйте компоненты из модуля navigation:

```jsx
import { Navbar, NavbarItem } from '../modules/navigation';

<Navbar>
  <NavbarItem 
    to="/"
    icon={<HomeIcon />}
    activeIcon={<HomeIconFilled />}
    label="Главная"
    isActive={true}
  />
  {/* другие элементы */}
</Navbar>
```

## Модуль авторизации

Для компонентов авторизации следуйте следующим рекомендациям:

- Используйте стандартные формы с подсветкой активных полей
- Для кнопок авторизации используйте вариант primary
- Для ошибок авторизации используйте стили ошибок форм:

```jsx
{error && <p className="text-[#FF3B30] text-sm mt-1">{error}</p>}
```

## Адаптивный дизайн

Используйте встроенные классы Tailwind для адаптивного дизайна:

```jsx
<div className="w-full sm:w-3/4 md:w-1/2 lg:w-1/3 mx-auto">
  {/* Контент */}
</div>
```

Контрольные точки:
- `sm`: 640px (малые устройства)
- `md`: 768px (средние устройства)
- `lg`: 1024px (большие устройства) 
- `xl`: 1280px (очень большие устройства)

## Советы по разработке

1. При создании нового компонента изучите существующие компоненты в модуле UI
2. Следуйте подходу композиции компонентов
3. Используйте предопределенные классы из global-styles.ts
4. Для новых модулей создавайте отдельные style-guide.md файлы
5. Обеспечивайте доступность (accessibility) компонентов
6. Проверяйте компоненты на всех размерах экрана
7. При работе с анимациями учитывайте настройки системы (prefers-reduced-motion)
8. Используйте переменные COLORS для согласованного визуального стиля

## Проверка стилей

Для проверки стилей используйте команду:
```
npm run build
```

Убедитесь, что все компоненты корректно отображаются и соответствуют дизайну в стиле Apple. 