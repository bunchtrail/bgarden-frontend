/**
 * Файл ре-экспорта глобальных стилей для модуля map
 * Обеспечивает обратную совместимость с использованием стилей в компонентах модуля
 */

import {
  SPACING as GLOBAL_SPACING,
  COLORS as GLOBAL_COLORS,
  animationClasses as globalAnimationClasses,
  buttonClasses as globalButtonClasses,
  chipClasses as globalChipClasses,
  containerClasses,
  dividerClasses as globalDividerClasses,
  formClasses as globalFormClasses,
  layoutClasses as globalLayoutClasses,
  tableClasses,
  tabClasses as globalTabClasses,
  textClasses
} from '../../styles/global-styles';

// Экспортируем константы для обратной совместимости
export const mapSpacing = {
  ...Object.entries(GLOBAL_SPACING).reduce((acc, [key, value]) => {
    if (typeof value === 'string') {
      // Оставляем только числовые значения
      return acc;
    }
    return { ...acc, [key.toLowerCase()]: value };
  }, {}),
  xs: 2,
  sm: 4,
  md: 8,
  lg: 16,
  xl: 24,
  xxl: 32,
};

// Экспортируем цвета для обратной совместимости
export const mapColors = {
  primary: GLOBAL_COLORS.PRIMARY,
  success: GLOBAL_COLORS.SUCCESS,
  warning: GLOBAL_COLORS.WARNING,
  danger: GLOBAL_COLORS.DANGER,
  text: GLOBAL_COLORS.TEXT_PRIMARY,
  secondaryText: GLOBAL_COLORS.TEXT_SECONDARY,
  tertiaryText: GLOBAL_COLORS.TEXT_TERTIARY,
  background: GLOBAL_COLORS.BACKGROUND,
  cardBackground: GLOBAL_COLORS.CARD_BG,
  border: GLOBAL_COLORS.SEPARATOR,
};

// Экспортируем радиусы для карты
export const mapRadius = {
  none: '0',
  sm: '0.25rem',
  md: '0.5rem',
  lg: '1rem',
  xl: '1.5rem',
  full: '9999px',
};

// Экспортируем тени для карты
export const mapShadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.02)',
  xxl: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
  mapContainer: '0 8px 20px rgba(15, 23, 42, 0.06), 0 0 0 1px rgba(148, 163, 184, 0.1)',
  control: '0 2px 8px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.03)',
  marker: '0 3px 8px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.02)',
  popup: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.03)',
};

// Экспортируем анимации
export const mapAnimations = globalAnimationClasses;

// Контейнеры для карты
export const mapContainerClasses = {
  base: containerClasses.base,
  withHover: containerClasses.withHover,
  card: `${containerClasses.base} ${containerClasses.withHover}`,
  detail: `${containerClasses.base}`,
  modern: containerClasses.modern,
  glass: containerClasses.glass,
  map: 'w-full h-[500px] rounded-lg overflow-hidden shadow-lg',
  miniMap: 'w-full h-[250px] rounded-lg overflow-hidden shadow-md',
};

// Кнопки для модуля карты
export const mapButtonClasses = {
  ...globalButtonClasses,
  map: `${globalButtonClasses.base} bg-white text-gray-700 hover:bg-gray-50 shadow-md`,
  icon: `${globalButtonClasses.icon} bg-white text-gray-700 hover:bg-gray-50 shadow-md`,
  control: 'px-3 py-2 bg-white text-gray-700 shadow-sm rounded hover:bg-gray-50 border border-gray-200',
};

// Формы для модуля карты
export const mapFormClasses = {
  ...globalFormClasses,
  mapControl: 'bg-white shadow-md rounded-lg p-4 border border-gray-200',
  searchInput: 'px-4 py-2 w-full bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
};

// Экспортируем все стили для использования в компонентах
export default {
  mapSpacing,
  mapColors,
  mapRadius,
  mapShadows,
  mapAnimations,
  mapContainerClasses,
  mapButtonClasses,
  mapFormClasses
}; 