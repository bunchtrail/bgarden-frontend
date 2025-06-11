// Экспорт основных компонентов
export { Navbar } from './components';

// Экспорт типов
export type { NavConfig, NavItem } from './types';

// Экспорт хуков
export { useNavigation, useNavbarHeight } from './hooks';

// Экспорт контекстов
export {
  NavbarHeightProvider,
  useNavbarHeightContext,
} from './contexts/NavbarHeightContext';

// Экспорт конфигураций
export { defaultNavConfig } from './components/configs/defaultNavConfig';

// Экспорт иконок
export { CloseIcon, MenuIcon, HomeIcon } from './components/icons';
