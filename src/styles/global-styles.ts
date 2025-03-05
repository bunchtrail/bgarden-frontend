/**
 * Глобальные стили приложения Botanical Garden App
 * Основаны на стилях модуля specimens
 */

// Константы отступов
export const SPACING = {
  XS: 1,
  SM: 2,
  MD: 3,
  LG: 4,
  XL: 6,
  FIELD_GAP: 2,
  SECTION_GAP: 3,
};

// Константы цветов (hex-коды для удобства)
export const COLORS = {
  PRIMARY: '#2563EB', // blue-600
  PRIMARY_DARK: '#1D4ED8', // blue-700
  PRIMARY_LIGHT: '#EFF6FF', // blue-50
  SUCCESS: '#16A34A', // green-600
  SUCCESS_LIGHT: '#DCFCE7', // green-100
  SUCCESS_DARK: '#166534', // green-800
  WARNING: '#F59E0B', // amber-500
  WARNING_LIGHT: '#FEF3C7', // amber-100
  WARNING_DARK: '#92400E', // amber-800
  DANGER: '#DC2626', // red-600
  DANGER_DARK: '#B91C1C', // red-700
  DANGER_LIGHT: '#FEE2E2', // red-100
  TEXT_PRIMARY: '#111827', // gray-900
  TEXT_SECONDARY: '#4B5563', // gray-600
  BACKGROUND: '#F9FAFB', // gray-50
  CARD_BG: '#FFFFFF', // white
};

// Tailwind классы для контейнеров
export const containerClasses = {
  base: 'rounded-lg mb-3 p-4 sm:p-6 w-full max-w-full overflow-hidden bg-white shadow',
  withHover: 'transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md',
  withImage: 'relative',
};

// Классы для текстов
export const textClasses = {
  heading: 'text-xl sm:text-2xl font-bold leading-tight break-words',
  subheading: 'mt-3 mb-2 text-base sm:text-lg font-semibold',
  body: 'break-words mb-2 leading-relaxed',
  multiline: 'break-words whitespace-pre-line leading-relaxed',
  secondary: 'text-gray-600',
};

// Классы для кнопок
export const buttonClasses = {
  base: 'w-full sm:w-auto rounded-full m-0.5 normal-case px-4 py-2',
  primary: 'bg-blue-600 hover:bg-blue-700 text-white',
  secondary: 'border border-blue-600 text-blue-600 hover:bg-blue-50',
  warning: 'bg-amber-500 hover:bg-amber-600 text-white',
  danger: 'bg-red-600 hover:bg-red-700 text-white',
  success: 'bg-green-600 hover:bg-green-700 text-white',
  disabled: 'opacity-60 cursor-not-allowed',
};

// Классы для чипов и тегов
export const chipClasses = {
  base: 'max-w-full truncate m-0.5 h-auto rounded-full px-2 py-1 text-sm',
  primary: 'bg-blue-100 text-blue-800',
  success: 'bg-green-100 text-green-800',
  warning: 'bg-amber-100 text-amber-800',
  danger: 'bg-red-100 text-red-800',
  neutral: 'bg-gray-100 text-gray-800',
};

// Классы для форм
export const formClasses = {
  base: 'space-y-4 w-full',
  control: 'mb-4 w-full',
  label: 'block mb-1 font-medium',
  input: 'rounded-md w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500',
  select: 'rounded-md w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500',
  textarea: 'rounded-md w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500',
  checkbox: 'rounded text-blue-600 focus:ring-blue-500',
  error: 'text-red-600 text-sm mt-1',
};

// Классы для таблиц
export const tableClasses = {
  container: 'overflow-auto max-h-[calc(100vh-300px)] w-full scrollbar scrollbar-thumb-gray-300 scrollbar-track-gray-100 scrollbar-thin',
  table: 'w-full table-fixed',
  header: 'font-semibold bg-blue-50 p-2',
  cell: 'truncate overflow-hidden p-2',
  row: 'border-b border-gray-200 hover:bg-gray-50',
  actionCell: 'flex justify-center gap-1',
};

// Классы для сеток и компоновки
export const layoutClasses = {
  grid: 'grid grid-cols-1 gap-4',
  gridSm2: 'grid grid-cols-1 sm:grid-cols-2 gap-4',
  gridSm3: 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4',
  flex: 'flex',
  flexCenter: 'flex justify-center items-center',
  flexBetween: 'flex justify-between items-center',
  flexCol: 'flex flex-col',
  flexWrap: 'flex flex-wrap',
};

// Утилиты для анимаций
export const animationClasses = {
  fadeIn: 'animate-fadeIn',
  transition: 'transition-all duration-200',
  hover: 'hover:-translate-y-0.5 hover:shadow-md',
};

// Утилиты для текста
export const textUtilClasses = {
  truncate: 'truncate overflow-hidden overflow-ellipsis',
  break: 'break-words',
  capitalize: 'capitalize',
};

// Классы для хедера и футера
export const headerClasses = {
  header: 'bg-white shadow-sm py-3 px-4 sm:px-6',
  container: 'container mx-auto flex justify-between items-center',
  logoContainer: 'flex items-center',
  logo: 'h-10 w-auto',
  title: 'text-xl font-bold text-blue-600 ml-2',
  nav: 'hidden md:flex space-x-4',
  navLink: 'text-gray-700 hover:text-blue-600',
  menuButton: 'md:hidden',
};

export const footerClasses = {
  footer: 'bg-white border-t border-gray-200 py-4 px-4 sm:px-6 mt-auto',
  container: 'container mx-auto',
  content: 'text-center text-gray-600 text-sm',
};

// Экспорт всех классов в одном объекте для удобства
export const appStyles = {
  container: containerClasses,
  text: textClasses,
  button: buttonClasses,
  chip: chipClasses,
  form: formClasses,
  table: tableClasses,
  layout: layoutClasses,
  animation: animationClasses,
  textUtil: textUtilClasses,
  header: headerClasses,
  footer: footerClasses,
  spacing: SPACING,
  colors: COLORS,
}; 