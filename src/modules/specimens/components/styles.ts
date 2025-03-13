// Файл был переименован из styles.ts в tailwind-styles.ts для совместимости
// Константы для модуля specimens
// Используем глобальные константы из global-styles.ts
import {
    SPACING as GLOBAL_SPACING,
    animationClasses as globalAnimationClasses,
    buttonClasses as globalButtonClasses,
    chipClasses as globalChipClasses,
    containerClasses as globalContainerClasses,
    formClasses as globalFormClasses,
    layoutClasses as globalLayoutClasses,
    tableClasses,
    textClasses,
    textUtilClasses
} from '../../../styles/global-styles';

// Экспортируем константы для обратной совместимости
export const SPECIMEN_SPACING = GLOBAL_SPACING;

// Экспортируем layoutClasses из глобальных стилей
export const layoutClasses = globalLayoutClasses;

// Экспортируем и расширяем animationClasses из глобальных стилей
export const animationClasses = {
  ...globalAnimationClasses,
  slideInRight: 'animate-slideInRight',
  slideInLeft: 'animate-slideInLeft',
  slideInUp: 'animate-slideInUp',
  pulse: 'animate-pulse',
  bounceIn: 'animate-bounceIn',
  // Новые плавные анимации для переходов
  smoothTransition: 'transition-all duration-300 ease-in-out',
  smoothScale: 'transition-transform duration-300 hover:scale-[1.01] focus:scale-[1.01]',
  elevate: 'transition-all duration-300 ease-in-out hover:shadow-md'
};

// Улучшенные Tailwind классы с использованием глобальных стилей
export const specimenContainerClasses = {
  base: `${globalContainerClasses.base}`,
  withHover: `${globalContainerClasses.withHover}`,
  card: `${globalContainerClasses.base} ${globalContainerClasses.withHover} bg-white`,
  detail: `${globalContainerClasses.base} bg-white`,
  // Добавляем новые стили для карточек
  modern: `${globalContainerClasses.base} border-none rounded-2xl overflow-hidden`,
  glass: 'backdrop-blur-md bg-white/80 border border-white/20 rounded-2xl'
};

export const headingClasses = {
  base: 'text-lg font-semibold text-gray-800 mb-2',
  heading: 'text-xl font-semibold text-gray-800 mb-3',
  subheading: 'text-base font-medium text-gray-700 mb-2',
  body: 'text-base text-gray-600',
  multiline: 'text-base text-gray-600 whitespace-pre-line',
  secondary: 'text-sm text-gray-500',
  page: 'text-2xl sm:text-3xl md:text-4xl font-semibold mb-4 text-gray-800',
  h2: 'text-2xl font-bold text-gray-800 mb-2',
  // Добавляем стильные заголовки
  modern: 'text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent',
  withIcon: 'flex items-center gap-2'
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
  // Добавляем новые стили для чипов
  outlined: 'border rounded-full px-3 py-1 text-sm font-medium',
  outlinedSuccess: 'border border-green-300 text-green-700 bg-green-50',
  outlinedWarning: 'border border-yellow-300 text-yellow-700 bg-yellow-50',
  outlinedDanger: 'border border-red-300 text-red-700 bg-red-50',
  pill: 'rounded-full px-3 py-1 text-xs font-semibold'
};

export const gridContainerClasses = {
  base: 'w-full mb-3 gap-4',
  responsive: layoutClasses.gridSm2,
  // Добавляем новые сетки
  threeColumns: layoutClasses.gridSm3,
  autoFit: 'grid grid-cols-1 sm:grid-cols-auto-fit-300 gap-6',
  masonry: 'columns-1 sm:columns-2 md:columns-3 gap-4'
};

export const formClasses = {
  ...globalFormClasses,
  control: 'mb-6 w-full flex flex-col sm:flex-row sm:items-start',
  label: 'font-medium text-gray-700 sm:py-2',
  // Обновленные стили ввода без эффекта наведения
  input: 'rounded-lg w-full border border-gray-300 px-4 py-2.5 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200',
  select: 'rounded-lg w-full border border-gray-300 px-4 py-2.5 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200',
  textarea: 'rounded-lg w-full border border-gray-300 px-4 py-2.5 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200',
  checkbox: 'rounded h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 transition-colors duration-200',
  error: 'text-red-600 text-sm mt-1',
  section: 'bg-white p-5 rounded-lg border border-gray-200 mb-6 transition-all duration-300',
  sectionTitle: 'text-xl font-semibold mb-4 pb-2 border-b border-gray-200',
  form: 'w-full max-w-4xl mx-auto',
  // Обновленные стили для группы полей
  fieldGroup: 'mb-5 transition-all duration-300 rounded-lg p-3 focus-within:bg-gray-50/80',
  hintText: 'text-sm text-gray-500 mt-1',
  requiredMark: 'text-red-500 ml-1 font-bold',
  validIcon: 'text-green-500 ml-2',
  errorIcon: 'text-red-500 ml-2',
  labelIcon: 'w-4 h-4 inline-block mr-1 align-text-bottom'
};

export const actionsContainerClasses = {
  base: `${layoutClasses.flexWrap} sm:flex-nowrap ${layoutClasses.flexBetween} gap-2 mt-4 w-full`,
  container: 'flex justify-end gap-4 mt-6 pt-4 border-t border-gray-200',
  // Обновляем стили кнопок
  primaryButton: 'px-5 py-2.5 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg hover:from-green-700 hover:to-green-600 transition-all duration-300 flex items-center',
  secondaryButton: 'px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-300 flex items-center',
  iconButton: 'p-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-200',
  floatingActionButton: 'fixed bottom-5 right-5 p-4 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300'
};

export const buttonClasses = {
  ...globalButtonClasses,
  outline: 'border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 py-2 px-3 rounded-md flex items-center justify-center transition-colors duration-200',
  // Добавляем новые стили кнопок
  modern: 'px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-500 text-white rounded-full hover:from-blue-700 hover:to-indigo-600 transition-all duration-300 flex items-center',
  subtle: 'px-4 py-2 bg-gray-50 text-gray-700 rounded-md hover:bg-gray-100 transition-all duration-200',
  link: 'text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200',
  iconText: 'flex items-center gap-2 transition-all duration-200'
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
  // Новые стили для вкладок
  modern: 'border-none rounded-t-lg overflow-hidden',
  modernActiveTab: 'text-white bg-blue-600 font-medium',
  modernInactiveTab: 'text-gray-700 hover:bg-gray-100',
  pill: 'rounded-full overflow-hidden border border-gray-200',
  pillActiveTab: 'bg-blue-100 text-blue-700 font-medium',
  pillInactiveTab: 'text-gray-600 hover:bg-gray-50'
};

export const subheadingClasses = {
  base: textClasses.subheading,
};

export const dividerClasses = {
  base: 'my-4 border-t border-gray-200',
  // Новые стили для разделителей
  subtle: 'my-4 border-t border-gray-100',
  dashed: 'my-4 border-t-2 border-dashed border-gray-200',
  gradient: 'my-6 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent'
};

export const containerClasses = {
  base: 'w-full flex flex-col',
  withHover: 'w-full flex flex-col transition-all duration-300',
  card: 'w-full p-4 rounded-lg bg-white',
  detail: 'w-full p-4 bg-white rounded-lg',
  page: 'container mx-auto px-4 sm:px-6 mt-4 sm:mt-8 mb-8 max-w-7xl',
  // Новые стили для контейнеров
  glassCard: 'backdrop-blur-sm bg-white/80 border border-white/20 rounded-xl',
  neomorphic: 'bg-gray-100 rounded-xl',
  coloredBorder: 'border-l-4 border-blue-500 bg-white rounded-lg p-4'
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
  // Новые стили для карточек образцов
  modernCard: 'bg-white rounded-xl overflow-hidden transition-all duration-300',
  cardBadge: 'absolute top-3 right-3 rounded-full px-2.5 py-0.5 text-xs font-semibold',
  cardOverlay: 'absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent',
  cardContent: 'relative z-10 p-4 text-white',
  cardFooter: 'px-4 py-3 bg-gray-50 border-t border-gray-100 flex justify-between items-center'
};

// экспортируем для обратной совместимости
export const SPACING = SPECIMEN_SPACING;
export const wordBreakStyles = { class: wordBreakClasses.base };
export const ellipsisTextStyles = { class: ellipsisClasses.base };

// Классы для вкладок
export const tabClasses = {
  base: 'bg-white border-b border-gray-200',
  active: 'text-blue-600 font-medium',
  inactive: 'text-gray-500 hover:text-gray-700 hover:border-gray-300',
  // Модернизированные вкладки
  container: 'bg-white rounded-lg overflow-hidden border border-gray-200 mb-6',
  modernTabs: 'flex border-b border-gray-200 bg-gray-50',
  modernTab: 'flex-1 py-3 px-4 text-center font-medium transition-colors duration-200 relative',
  modernActive: 'bg-white text-blue-600 border-t-2 border-blue-500 shadow-[0_2px_0_white]',
  modernInactive: 'text-gray-600 hover:bg-gray-100/50',
  pillContainer: 'flex p-1 mb-6 bg-gray-100 rounded-full',
  pillTab: 'flex-1 py-2 px-4 text-center rounded-full transition-colors duration-200',
  pillActive: 'bg-white text-blue-600 font-medium',
  pillInactive: 'text-gray-600 hover:text-gray-800'
};

