/**
 * Глобальные стили приложения Botanical Garden App
 * Обновлены с учетом легкого минималистичного дизайна в стиле Apple
 */

// Глобальные константы и стили для всего приложения
// Дизайн основан на минималистичном стиле Apple с плавными переходами и чистыми формами

// Константы для высот элементов
export const HEIGHTS = {
  NAVBAR: 64, // 16px * 4 (16 единиц или h-16) для навбара
  FOOTER: 60, // уменьшенная высота футера
  TOTAL_OFFSET: 124, // сумма высот навбара и футера
  HEADER: 'h-16',
  CONTENT: 'min-h-[calc(100vh-64px)]',
  MODAL_SM: 'max-h-[300px]',
  MODAL_MD: 'max-h-[500px]',
  MODAL_LG: 'max-h-[700px]',
};

// Константы для отступов
export const SPACING = {
  XS: 2,
  SM: 3,
  MD: 4,
  LG: 6,
  XL: 8,
  XXL: 'p-12',
  NONE: 'p-0',
  FIELD_GAP: 3,
  SECTION_GAP: 5,
};

// Константы для цветов (обновленные для более современного дизайна)
export const COLORS = {
  PRIMARY: '#0A84FF', // Apple blue
  PRIMARY_DARK: '#0071E3', // Darker Apple blue
  PRIMARY_LIGHT: '#F2F7FF', // Very light blue
  SUCCESS: '#30D158', // Apple green
  SUCCESS_LIGHT: '#F0FFF7', // Very light green
  SUCCESS_DARK: '#28B14C', // Darker green
  WARNING: '#FF9F0A', // Apple orange
  WARNING_LIGHT: '#FFF8F0', // Very light orange
  WARNING_DARK: '#C77A05', // Darker orange
  DANGER: '#FF3B30', // Apple red
  DANGER_DARK: '#D70015', // Darker red
  DANGER_LIGHT: '#FFF5F5', // Very light red
  TEXT_PRIMARY: '#1D1D1F', // Apple dark gray (almost black)
  TEXT_SECONDARY: '#86868B', // Apple medium gray
  TEXT_TERTIARY: '#AEAEB2', // Apple light gray text
  BACKGROUND: '#F5F5F7', // Apple light gray background
  CARD_BG: '#FFFFFF', // White
  SEPARATOR: '#E5E5EA', // Apple separator color
};

// Tailwind классы для контейнеров
export const containerClasses = {
  base: 'rounded-lg mb-3 p-4 sm:p-6 bg-white',
  withHover: 'shadow transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md',
  withImage: 'relative overflow-hidden bg-cover bg-center',
  panel: 'rounded-lg shadow-sm p-4 sm:p-6 bg-white',
  section: 'mb-8',
  raised: 'rounded-lg mb-3 p-4 sm:p-6 bg-white shadow-md',
  // Новые варианты контейнеров
  modern: 'border-none rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300',
  glass: 'backdrop-blur-md bg-white/80 border border-white/20 rounded-2xl',
};

// Tailwind классы для текста
export const textClasses = {
  heading: 'text-xl sm:text-2xl font-bold leading-tight text-gray-900 mb-4',
  subheading: 'text-lg sm:text-xl font-semibold text-gray-800 mb-3',
  body: 'text-base text-gray-600',
  multiline: 'text-base text-gray-600 whitespace-pre-line',
  secondary: 'text-sm text-gray-500',
  tertiary: 'text-xs text-gray-400',
  label: 'text-sm font-medium text-gray-700 mb-1',
  success: 'text-green-600',
  error: 'text-red-600',
  warning: 'text-yellow-600',
  // Новые стили текста
  modern: 'text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent',
  withIcon: 'flex items-center gap-2',
  page: 'text-2xl sm:text-3xl md:text-4xl font-semibold mb-4 text-gray-800',
};

// Tailwind классы для кнопок
export const buttonClasses = {
  base: 'w-full sm:w-auto rounded-full m-0.5 transition-colors duration-200 flex items-center justify-center font-medium shadow-sm text-sm',
  primary: 'bg-blue-600 hover:bg-blue-700 text-white py-2 px-4',
  secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4',
  success: 'bg-green-600 hover:bg-green-700 text-white py-2 px-4',
  warning: 'bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4',
  danger: 'bg-red-600 hover:bg-red-700 text-white py-2 px-4',
  link: 'text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200 shadow-none',
  icon: 'p-2 rounded-full flex items-center justify-center',
  disabled: 'opacity-50 cursor-not-allowed',
  // Новые стили кнопок
  outline: 'border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 py-2 px-3 rounded-md flex items-center justify-center transition-colors duration-200',
  modern: 'px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-500 text-white rounded-full hover:from-blue-700 hover:to-indigo-600 transition-all duration-300 flex items-center',
  subtle: 'px-4 py-2 bg-gray-50 text-gray-700 rounded-md hover:bg-gray-100 transition-all duration-200',
  iconText: 'flex items-center gap-2 transition-all duration-200',
};

// Tailwind классы для чипов
export const chipClasses = {
  base: 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
  success: 'bg-green-100 text-green-800',
  warning: 'bg-yellow-100 text-yellow-800',
  danger: 'bg-red-100 text-red-800',
  neutral: 'bg-gray-100 text-gray-800',
  // Новые стили для чипов
  outlined: 'border rounded-full px-3 py-1 text-sm font-medium',
  outlinedSuccess: 'border border-green-300 text-green-700 bg-green-50',
  outlinedWarning: 'border border-yellow-300 text-yellow-700 bg-yellow-50',
  outlinedDanger: 'border border-red-300 text-red-700 bg-red-50',
  pill: 'rounded-full px-3 py-1 text-xs font-semibold',
};

// Tailwind классы для форм
export const formClasses = {
  base: 'space-y-4',
  control: 'w-full mb-3',
  label: 'block text-sm font-medium text-gray-700 mb-1',
  input: 'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500',
  select: 'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500',
  textarea: 'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500',
  checkbox: 'h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500',
  radio: 'h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500',
  error: 'mt-1 text-sm text-red-600',
  hint: 'mt-1 text-sm text-gray-500',
  // Группировка элементов формы
  group: 'flex flex-col md:flex-row md:space-x-4',
  actions: 'flex justify-end space-x-3 mt-6',
};

// Tailwind классы для таблиц
export const tableClasses = {
  container: 'w-full overflow-x-auto rounded-lg shadow-sm',
  table: 'min-w-full divide-y divide-gray-200 bg-white',
  header: 'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap',
  cell: 'px-6 py-4 text-sm text-gray-500 whitespace-nowrap',
  row: 'hover:bg-gray-50 transition-colors duration-150',
  rowBordered: 'hover:bg-gray-50 transition-colors duration-150 border-b border-gray-200',
  actionCell: 'px-6 py-4 whitespace-nowrap text-right text-sm font-medium',
  // Новые стили таблиц
  modern: 'min-w-full divide-y divide-gray-200 bg-white rounded-xl overflow-hidden',
  modernHeader: 'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap bg-gray-50',
  modernCell: 'px-6 py-4 text-sm text-gray-700 whitespace-nowrap',
  modernRow: 'hover:bg-blue-50/30 transition-colors duration-150',
};

// Tailwind классы для layout
export const layoutClasses = {
  // Базовая сетка
  grid: 'grid grid-cols-1 gap-4',
  gridSm2: 'grid grid-cols-1 sm:grid-cols-2 gap-4',
  gridSm3: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4',
  gridSm4: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4',
  // Flex layouts
  flex: 'flex',
  flexCenter: 'flex items-center justify-center',
  flexBetween: 'flex items-center justify-between',
  flexCol: 'flex flex-col',
  flexWrap: 'flex flex-wrap',
  // Containers
  page: 'container mx-auto p-6 max-w-7xl',
  fullWidth: 'w-full',
  // Новые макеты
  autoFit: 'grid grid-cols-1 sm:grid-cols-auto-fit-300 gap-6',
  masonry: 'columns-1 sm:columns-2 md:columns-3 gap-4',
};

// Tailwind классы для анимаций
export const animationClasses = {
  fadeIn: 'animate-fadeIn',
  transition: 'transition-all duration-300 ease-in-out',
  hover: 'hover:shadow-md hover:-translate-y-1',
  springHover: 'transition-all duration-200 hover:scale-[1.03] hover:shadow-md',
  // Новые анимации
  slideInRight: 'animate-slideInRight',
  slideInLeft: 'animate-slideInLeft',
  slideInUp: 'animate-slideInUp',
  pulse: 'animate-pulse',
  bounceIn: 'animate-bounceIn',
  smoothTransition: 'transition-all duration-300 ease-in-out',
  smoothScale: 'transition-transform duration-300 hover:scale-[1.01] focus:scale-[1.01]',
  elevate: 'transition-all duration-300 ease-in-out hover:shadow-md',
};

// Tailwind классы для вспомогательных текстовых утилит
export const textUtilClasses = {
  truncate: 'truncate',
  break: 'break-words',
  capitalize: 'capitalize',
  lowercase: 'lowercase',
  uppercase: 'uppercase',
  lineClamp1: 'line-clamp-1',
  lineClamp2: 'line-clamp-2',
  lineClamp3: 'line-clamp-3',
};

// Tailwind классы для хедера и футера
export const headerClasses = {
  base: 'bg-white shadow',
  container: 'container mx-auto px-4 sm:px-6 lg:px-8',
  content: 'flex justify-between items-center',
  logo: 'flex items-center flex-shrink-0',
  logoText: 'ml-2 text-xl font-bold text-gray-900',
  nav: 'hidden md:flex items-center space-x-4',
  navLink: 'text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium',
  activeNavLink: 'text-blue-600 font-medium px-3 py-2 text-sm',
  mobileNav: 'md:hidden',
  mobileMenu: 'px-2 pt-2 pb-3 space-y-1',
  mobileNavLink: 'block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50',
  activeMobileNavLink: 'block px-3 py-2 rounded-md text-base font-medium text-blue-600 bg-blue-50',
};

export const footerClasses = {
  base: 'bg-white shadow border-t border-gray-200',
  container: 'container mx-auto px-4 py-8 sm:py-12',
  content: 'flex flex-col md:flex-row md:justify-between md:items-center',
  logo: 'flex items-center flex-shrink-0 mb-6 md:mb-0',
  logoText: 'ml-2 text-xl font-bold text-gray-900',
  nav: 'flex flex-wrap space-x-6',
  navLink: 'text-gray-600 hover:text-blue-600 text-sm',
  copyright: 'mt-8 text-center text-gray-500 text-sm',
};

// Tailwind классы для карточек
export const cardClasses = {
  base: 'bg-white rounded-lg overflow-hidden shadow-sm',
  body: 'p-4 sm:p-6',
  title: 'text-lg font-semibold text-gray-900 mb-1',
  subtitle: 'text-sm text-gray-600 mb-4',
  content: 'text-gray-600',
  footer: 'p-4 bg-gray-50 border-t border-gray-200',
  interactive: 'transition-all duration-200 hover:-translate-y-1 hover:shadow-md cursor-pointer',
  // Специальные карточки для образцов
  specimenCard: 'bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-md',
  sectorCard: 'bg-green-50 rounded-xl shadow-sm overflow-hidden border border-green-100',
};

// Tailwind классы для инструментов сотрудников
export const toolClasses = {
  base: 'block p-6 bg-white border rounded-lg shadow-sm hover:bg-gray-50 transition-colors',
  icon: 'mb-3 text-gray-500',
  title: 'text-xl font-bold text-gray-900 mb-1',
  description: 'text-gray-600',
};

// Tailwind классы для разделителей
export const dividerClasses = {
  base: 'my-4 border-t border-gray-200',
  // Новые стили для разделителей
  subtle: 'my-4 border-t border-gray-100',
  dashed: 'my-4 border-t-2 border-dashed border-gray-200',
  gradient: 'my-6 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent',
};

// Tailwind классы для вкладок
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
  pillInactive: 'text-gray-600 hover:text-gray-800',
};

// Экспортируем все стили для удобного импорта
export const appStyles = {
  HEIGHTS,
  SPACING,
  COLORS,
  containerClasses,
  textClasses,
  buttonClasses,
  chipClasses,
  formClasses,
  tableClasses,
  layoutClasses,
  animationClasses,
  textUtilClasses,
  headerClasses,
  footerClasses,
  cardClasses,
  toolClasses,
  dividerClasses,
  tabClasses,
};