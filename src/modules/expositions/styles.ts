/**
 * Файл ре-экспорта глобальных стилей для модуля expositions
 * Обеспечивает обратную совместимость с использованием стилей в компонентах модуля
 */

import {
  SPACING as GLOBAL_SPACING,
  animationClasses as globalAnimationClasses,
  buttonClasses as globalButtonClasses,
  cardClasses as globalCardClasses,
  chipClasses as globalChipClasses,
  containerClasses,
  formClasses as globalFormClasses,
  layoutClasses as globalLayoutClasses,
  tableClasses,
  textClasses as globalTextClasses
} from '../../styles/global-styles';

// Экспортируем константы для обратной совместимости
export const EXPOSITION_SPACING = GLOBAL_SPACING;

// Экспортируем стили для карточек экспозиций
export const expositionCardClasses = {
  container: globalCardClasses.base,
  interactive: globalCardClasses.interactive,
  image: 'h-40 w-full object-cover mb-3',
  title: globalCardClasses.title,
  description: 'text-gray-600 mb-3',
  footer: globalCardClasses.footer,
  badge: `${globalChipClasses.base} ${globalChipClasses.neutral}`,
};

// Экспортируем стили для формы экспозиций
export const expositionFormClasses = {
  ...globalFormClasses,
  container: 'max-w-2xl mx-auto',
  group: 'grid grid-cols-1 md:grid-cols-2 gap-4',
  imagePreview: 'w-full h-40 object-cover rounded-md mb-2',
  uploadButton: `${globalButtonClasses.base} ${globalButtonClasses.secondary} mb-4`,
  actions: 'flex justify-end space-x-3 mt-6',
};

// Экспортируем стили для списка экспозиций
export const expositionListClasses = {
  container: 'mb-6',
  header: 'flex justify-between items-center mb-4',
  grid: globalLayoutClasses.gridSm3,
  empty: 'text-center py-8 text-gray-500',
  searchContainer: 'mb-6',
  searchInput: `${globalFormClasses.input} max-w-md mb-0`,
};

// Экспортируем анимации
export const animationClasses = globalAnimationClasses;

// Экспортируем кнопки
export const buttonClasses = globalButtonClasses;

// Экспортируем текстовые стили
export const textClasses = globalTextClasses;

// Экспортируем все стили для использования в компонентах
export default {
  EXPOSITION_SPACING,
  animationClasses,
  buttonClasses,
  expositionCardClasses,
  expositionFormClasses,
  expositionListClasses,
  textClasses
}; 