// Файл был переименован из styles.ts в tailwind-styles.ts для совместимости
// Константы для модуля specimens
// Используем глобальные константы из global-styles.ts
import {
    SPACING as GLOBAL_SPACING,
    buttonClasses as globalButtonClasses,
    chipClasses as globalChipClasses,
    containerClasses as globalContainerClasses,
    formClasses as globalFormClasses,
    layoutClasses,
    tableClasses,
    textClasses,
    textUtilClasses
} from '../../../styles/global-styles';

// Экспортируем константы для обратной совместимости
export const SPECIMEN_SPACING = GLOBAL_SPACING;

// Улучшенные Tailwind классы с использованием глобальных стилей
export const specimenContainerClasses = {
  base: `${globalContainerClasses.base}`,
  withHover: `${globalContainerClasses.withHover}`,
  card: `${globalContainerClasses.base} ${globalContainerClasses.withHover} bg-white`,
  detail: `${globalContainerClasses.base} bg-white`,
};

export const headingClasses = {
  base: 'text-lg font-semibold text-gray-800 mb-2',
  heading: 'text-xl font-semibold text-gray-800 mb-3',
  subheading: 'text-base font-medium text-gray-700 mb-2',
  body: 'text-base text-gray-600',
  multiline: 'text-base text-gray-600 whitespace-pre-line',
  secondary: 'text-sm text-gray-500',
  page: 'text-2xl sm:text-3xl md:text-4xl font-semibold mb-4 text-gray-800'
};

export const specimenTextClasses = {
  base: textClasses.body,
  secondary: `${textClasses.body} ${textClasses.secondary}`,
  label: 'font-medium',
};

export const multilineFieldClasses = {
  base: textClasses.multiline,
};

export const tableCellClasses = (extraClasses = '') => 
  `${tableClasses.cell} ${extraClasses}`;

export const chipClasses = {
  ...globalChipClasses,
  base: globalChipClasses.base,
  success: globalChipClasses.success,
  warning: globalChipClasses.warning,
  danger: globalChipClasses.danger,
  neutral: globalChipClasses.neutral,
  herbarium: `${globalChipClasses.base} ${globalChipClasses.success}`,
  conservation: `${globalChipClasses.base} ${globalChipClasses.warning}`,
};

export const gridContainerClasses = {
  base: 'w-full mb-3 gap-4',
  responsive: layoutClasses.gridSm2,
};

export const formClasses = {
  ...globalFormClasses,
  control: 'mb-6 w-full flex flex-col sm:flex-row sm:items-start',
  label: 'font-medium text-gray-700 sm:py-2',
  input: 'rounded-md w-full border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500 shadow-sm',
  select: 'rounded-md w-full border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500 shadow-sm',
  textarea: 'rounded-md w-full border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500 shadow-sm',
  checkbox: 'rounded h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 shadow-sm',
  error: 'text-red-600 text-sm mt-1',
  section: 'bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6',
  sectionTitle: 'text-xl font-semibold mb-4 pb-2 border-b border-gray-300',
};

export const actionsContainerClasses = {
  base: `${layoutClasses.flexWrap} sm:flex-nowrap ${layoutClasses.flexBetween} gap-2 mt-4 w-full`,
};

export const buttonClasses = {
  ...globalButtonClasses,
  outline: 'border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 py-2 px-3 rounded-md flex items-center justify-center transition-colors duration-200',
};

export const tableContainerClasses = {
  base: tableClasses.container,
  table: tableClasses.table,
  header: tableClasses.header,
  row: tableClasses.row,
};

export const tabsContainerClasses = {
  base: 'border-b border-gray-200 mb-4',
  tab: 'mx-1 py-2 px-4 text-center cursor-pointer relative',
  activeTab: 'text-blue-600 font-medium',
  inactiveTab: 'text-gray-500 hover:text-gray-700',
  tabIndicator: 'absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 transform',
};

export const subheadingClasses = {
  base: textClasses.subheading,
};

export const dividerClasses = {
  base: 'my-4 border-t border-gray-200',
};

export const containerClasses = {
  base: 'w-full flex flex-col',
  withHover: 'w-full flex flex-col transition-all duration-300 hover:shadow-md',
  card: 'w-full p-4 rounded-lg shadow-sm bg-white',
  detail: 'w-full p-4 bg-white rounded-lg shadow-sm',
  page: 'container mx-auto px-4 sm:px-6 mt-4 sm:mt-8 mb-8 max-w-7xl'
};

export const buttonGroupClasses = {
  base: `${layoutClasses.flexWrap} sm:flex-nowrap mb-2 sm:mb-0`,
  button: 'flex-grow sm:flex-grow-0 min-w-[45%] sm:min-w-min mb-1 sm:mb-0 hover:bg-blue-50 hover:border-blue-600',
};

export const wordBreakClasses = {
  base: textUtilClasses.break,
};

export const ellipsisClasses = {
  base: textUtilClasses.truncate,
};

// Добавляем новые современные стили для карточек образцов
export const specimenCardStyles = {
  imageContainer: 'relative overflow-hidden rounded-t-lg h-32 sm:h-40',
  image: 'absolute inset-0 w-full h-full object-cover',
  infoContainer: 'p-4',
  title: `${textClasses.heading} text-blue-700`,
  latinName: `${textClasses.secondary} italic`,
  statusPill: `${globalChipClasses.base} ${globalChipClasses.warning} absolute top-2 right-2`,
};

// экспортируем для обратной совместимости
export const SPACING = SPECIMEN_SPACING;
export const wordBreakStyles = { class: wordBreakClasses.base };
export const ellipsisTextStyles = { class: ellipsisClasses.base };

// Классы для вкладок
export const tabClasses = {
  base: 'bg-white border-b border-gray-200',
  active: 'text-blue-600 font-medium',
  inactive: 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
};

