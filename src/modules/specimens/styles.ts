/**
 * Файл ре-экспорта глобальных стилей для модуля specimens
 * Обеспечивает обратную совместимость с использованием стилей в компонентах модуля
 */

import {
  SPACING as GLOBAL_SPACING,
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
export const SPECIMEN_SPACING = GLOBAL_SPACING;

// Экспортируем layoutClasses из глобальных стилей
export const layoutClasses = globalLayoutClasses;

// Экспортируем анимации
export const animationClasses = globalAnimationClasses;

// Контейнеры для образцов
export const specimenContainerClasses = {
  base: containerClasses.base,
  withHover: containerClasses.withHover,
  card: `${containerClasses.base} ${containerClasses.withHover}`,
  detail: `${containerClasses.base}`,
  modern: containerClasses.modern,
  glass: containerClasses.glass
};

// Заголовки
export const headingClasses = {
  base: textClasses.body,
  heading: textClasses.heading,
  subheading: textClasses.subheading,
  body: textClasses.body,
  multiline: textClasses.multiline,
  secondary: textClasses.secondary,
  page: textClasses.page,
  h2: textClasses.heading,
  modern: textClasses.modern,
  withIcon: textClasses.withIcon
};

// Текст для образцов
export const specimenTextClasses = {
  base: textClasses.body,
  secondary: `${textClasses.body} ${textClasses.secondary}`,
  label: 'font-medium',
};

// Многострочные поля
export const multilineFieldClasses = {
  base: textClasses.multiline,
};

// Ячейки таблицы
export const tableCellClasses = (extraClasses = '') => 
  `${tableClasses.cell} ${extraClasses}`;

// Чипы
export const chipClasses = {
  ...globalChipClasses,
  herbarium: `${globalChipClasses.base} ${globalChipClasses.success}`,
  conservation: `${globalChipClasses.base} ${globalChipClasses.warning}`,
};

// Контейнеры для сеток
export const gridContainerClasses = {
  base: 'w-full mb-3 gap-4',
  responsive: layoutClasses.gridSm2,
  threeColumns: layoutClasses.gridSm3,
  autoFit: layoutClasses.autoFit,
  masonry: layoutClasses.masonry
};

// Кнопки
export const buttonClasses = globalButtonClasses;

// Формы
export const formClasses = globalFormClasses;

// Подсказки
export const tooltipClasses = {
  base: 'bg-gray-800 text-white text-xs rounded px-2 py-1 absolute',
  arrow: 'absolute w-2 h-2 bg-gray-800 transform rotate-45',
  top: 'bottom-full mb-2',
  bottom: 'top-full mt-2',
  left: 'right-full mr-2',
  right: 'left-full ml-2',
};

// Разделители
export const dividerClasses = globalDividerClasses;

// Вкладки
export const tabClasses = globalTabClasses;

// Экспортируем все стили для использования в компонентах
export default {
  SPECIMEN_SPACING,
  animationClasses,
  buttonClasses,
  chipClasses,
  dividerClasses,
  formClasses,
  gridContainerClasses,
  headingClasses,
  layoutClasses,
  multilineFieldClasses,
  specimenContainerClasses,
  specimenTextClasses,
  tableCellClasses,
  tabClasses,
  tooltipClasses
}; 