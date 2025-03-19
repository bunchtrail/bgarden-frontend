# Руководство по стилям для модуля навигации (navigation)

## Общие принципы
- Модуль навигации использует Tailwind CSS v3.3.0 для стилизации компонентов.
- Все стили должны соответствовать минималистичному дизайну в стиле Apple.
- Используйте глобальные стили из `src/styles/global-styles.ts`, особенно `headerClasses`.

## Основные компоненты и их стилизация

### Навигационная панель (Navbar)
- Навигационная панель должна использовать стили из глобальных стилей:
```jsx
import { headerClasses } from '../../../styles/global-styles';

<header className={headerClasses.header}>
  <div className={headerClasses.container}>
    <div className={headerClasses.logoContainer}>
      <img src="/images/logo.jpg" alt="Logo" className={headerClasses.logo} />
      <h1 className={headerClasses.title}>Botanical Garden</h1>
    </div>
    <nav className={headerClasses.nav}>
      {/* Навигационные ссылки */}
    </nav>
  </div>
</header>
```

### Навигационные элементы (NavbarItem)
- Для навигационных элементов используйте стили из глобальных констант:
```jsx
import { headerClasses } from '../../../styles/global-styles';

<a href="/route" className={headerClasses.navLink}>
  Название пункта
</a>
```

### Иконки навигации
- Для иконок используйте стандартные размеры и цвета:
```jsx
import { COLORS } from '../../../styles/global-styles';
import { HomeIcon } from '../components/icons';

<HomeIcon color={COLORS.TEXT_SECONDARY} size={20} />
```

## Мобильная навигация
- Для мобильных устройств используйте адаптивные стили:
```jsx
<button className={headerClasses.menuButton}>
  <MenuIcon />
</button>
<nav className="fixed top-0 left-0 w-screen h-screen bg-white p-5 z-50 transform transition-transform duration-300 ease-in-out">
  {/* Мобильная навигация */}
</nav>
```

## Конфигурация навигации
- При использовании конфигурации навигации из `defaultNavConfig.tsx` соблюдайте стилистическую консистентность:
```jsx
// Пример конфигурации с учетом стилей
const navConfig = [
  {
    path: '/',
    label: 'Главная',
    icon: <HomeIcon color={COLORS.TEXT_SECONDARY} />,
    activeIcon: <HomeIcon color={COLORS.PRIMARY} />,
  },
  // ...другие элементы
];
```

## Активные и неактивные состояния
- Для активных элементов навигации используйте первичный цвет:
```jsx
<NavbarItem 
  isActive={true}
  activeClassName="text-[#0A84FF] font-medium"
  inactiveClassName="text-[#86868B] hover:text-[#1D1D1F]"
  // ...остальные пропсы
/>
```

## Адаптивный дизайн
- Навигация должна быть полностью адаптивной:
```jsx
<nav className="hidden md:flex space-x-6">
  {/* Десктопная навигация */}
</nav>
<button className="md:hidden">
  {/* Кнопка мобильного меню */}
</button>
```

## Цветовая палитра для навигации
- Основной цвет (активные элементы): #0A84FF (Apple blue)
- Цвет неактивных элементов: #86868B (Apple medium gray)
- Цвет при наведении: #1D1D1F (Apple dark gray)
- Фон навигации: #FFFFFF или transparent с backdrop-blur

## Важные замечания
- При добавлении новых элементов навигации соблюдайте единообразие стилей.
- Проверяйте навигацию на разных устройствах для обеспечения корректного отображения.
- Следите за доступностью (accessibility) навигационных элементов. 