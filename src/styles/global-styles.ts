/**
 * Глобальные стили приложения Botanical Garden App
 * Обновлены с учетом легкого минималистичного дизайна в стиле Apple
 */

// Константы высот для фиксированных элементов
export const HEIGHTS = {
  NAVBAR: 64, // 16px * 4 (16 единиц или h-16) для навбара
  FOOTER: 60, // уменьшенная высота футера
  TOTAL_OFFSET: 124, // сумма высот навбара и футера
};

// Константы отступов - сделаны более консистентными и аккуратными
export const SPACING = {
  XS: 2,
  SM: 3,
  MD: 4,
  LG: 6,
  XL: 8,
  FIELD_GAP: 3,
  SECTION_GAP: 5,
};

// Константы цветов - обновлены до более нейтральных и минималистичных тонов Apple
export const COLORS = {
  PRIMARY: '#0A84FF', // Apple blue
  PRIMARY_DARK: '#0071E3', // Darker Apple blue
  PRIMARY_LIGHT: '#F2F7FF', // Very light blue
  SUCCESS: '#30D158', // Apple green (SF Symbols)
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

// Tailwind классы для контейнеров - более тонкие тени и скругления в стиле Apple
export const containerClasses = {
  base: 'rounded-2xl mb-4 p-5 sm:p-6 w-full max-w-full overflow-hidden bg-white shadow-sm',
  withHover: 'transition-all duration-300 hover:shadow',
  withImage: 'relative',
};

// Классы для текстов - обновлены шрифты и межстрочные интервалы в стиле Apple
export const textClasses = {
  heading: 'text-xl sm:text-2xl font-semibold leading-tight tracking-tight break-words text-[#1D1D1F]',
  subheading: 'mt-3 mb-2 text-base sm:text-lg font-medium tracking-tight text-[#1D1D1F]',
  body: 'break-words mb-2 leading-relaxed text-[#1D1D1F]',
  multiline: 'break-words whitespace-pre-line leading-relaxed text-[#1D1D1F]',
  secondary: 'text-[#86868B]',
  tertiary: 'text-[#AEAEB2]',
};

// Классы для кнопок - более плавные переходы и закругления как у Apple
export const buttonClasses = {
  base: 'w-full sm:w-auto rounded-full m-0.5 font-medium px-5 py-2.5 transition-all duration-300 text-sm',
  primary: 'bg-[#0A84FF] hover:bg-[#0071E3] text-white',
  secondary: 'bg-[#F5F5F7] border border-[#E5E5EA] text-[#1D1D1F] hover:bg-[#EBEBF0]',
  warning: 'bg-[#FF9F0A] hover:bg-[#E08600] text-white',
  danger: 'bg-[#FF3B30] hover:bg-[#D70015] text-white',
  success: 'bg-[#30D158] hover:bg-[#28B14C] text-white',
  disabled: 'opacity-30 cursor-not-allowed',
};

// Классы для чипов и тегов - более минималистичные как у Apple
export const chipClasses = {
  base: 'max-w-full truncate m-0.5 h-auto rounded-full px-3 py-1 text-sm font-medium',
  primary: 'bg-[#E1F0FF] text-[#0A84FF]',
  success: 'bg-[#E2F9EB] text-[#30D158]',
  warning: 'bg-[#FFF2E3] text-[#FF9F0A]',
  danger: 'bg-[#FFE5E5] text-[#FF3B30]',
  neutral: 'bg-[#F2F2F7] text-[#86868B]',
};

// Классы для форм - обновлены для большей элегантности и стиля Apple
export const formClasses = {
  base: 'space-y-5 w-full',
  control: 'mb-4 w-full',
  label: 'block mb-1.5 font-medium text-[#1D1D1F] text-sm',
  input: 'rounded-lg w-full border border-[#E5E5EA] bg-white focus:border-[#0A84FF] focus:ring-1 focus:ring-[#0A84FF] transition-all duration-200 text-[#1D1D1F]',
  select: 'rounded-lg w-full border border-[#E5E5EA] bg-white focus:border-[#0A84FF] focus:ring-1 focus:ring-[#0A84FF] transition-all duration-200 text-[#1D1D1F]',
  textarea: 'rounded-lg w-full border border-[#E5E5EA] bg-white focus:border-[#0A84FF] focus:ring-1 focus:ring-[#0A84FF] transition-all duration-200 text-[#1D1D1F]',
  checkbox: 'rounded text-[#0A84FF] focus:ring-1 focus:ring-[#0A84FF] focus:ring-offset-1',
  error: 'text-[#FF3B30] text-xs mt-1.5',
};

// Классы для таблиц - обновлены для большей воздушности и стиля Apple
export const tableClasses = {
  container: `overflow-auto max-h-[calc(100vh-${HEIGHTS.TOTAL_OFFSET}px)] w-full scrollbar scrollbar-thumb-[#E5E5EA] scrollbar-track-[#F5F5F7] scrollbar-thin rounded-xl border border-[#E5E5EA]`,
  table: 'w-full table-fixed',
  header: 'font-medium bg-[#F5F5F7] p-3 text-sm text-[#86868B] border-b border-[#E5E5EA]',
  cell: 'truncate overflow-hidden p-3 text-[#1D1D1F]',
  row: 'border-b border-[#E5E5EA] hover:bg-[#F2F2F7] transition-colors duration-150',
  actionCell: 'flex justify-center gap-2',
};

// Классы для сеток и компоновки - больше воздуха и стиль Apple
export const layoutClasses = {
  container: 'max-h-[calc(100vh-124px)] overflow-y-auto',
  page: 'py-6 min-h-[calc(100vh-124px)] pb-6',
  grid: 'grid grid-cols-1 gap-6',
  gridSm2: 'grid grid-cols-1 sm:grid-cols-2 gap-6',
  gridSm3: 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6',
  flex: 'flex',
  flexCenter: 'flex justify-center items-center',
  flexBetween: 'flex justify-between items-center',
  flexCol: 'flex flex-col',
  flexWrap: 'flex flex-wrap',
};

// Утилиты для анимаций - более плавные как в стиле Apple
export const animationClasses = {
  fadeIn: 'animate-fadeIn',
  transition: 'transition-all duration-300',
  hover: 'hover:shadow',
  springHover: 'transition-transform duration-300 ease-out hover:scale-[1.02]',
};

// Утилиты для текста - стиль Apple
export const textUtilClasses = {
  truncate: 'truncate overflow-hidden overflow-ellipsis',
  break: 'break-words',
  capitalize: 'capitalize',
};

// Классы для хедера и футера - обновлены под стиль Apple
export const headerClasses = {
  header: 'bg-white/90 backdrop-blur-md border-b border-[#E5E5EA] sticky top-0 z-50',
  container: 'container mx-auto flex justify-between items-center py-3 px-5',
  logoContainer: 'flex items-center',
  logo: 'h-8 w-auto',
  title: 'text-lg font-medium tracking-tight text-[#1D1D1F] ml-3',
  nav: 'hidden md:flex space-x-6',
  navLink: 'text-[#86868B] hover:text-[#1D1D1F] transition-colors duration-200 font-medium text-sm',
  menuButton: 'md:hidden text-[#86868B] hover:text-[#1D1D1F] p-1 rounded-md transition-colors',
};

export const footerClasses = {
  footer: 'bg-white border-t border-[#E5E5EA] py-3 px-5 mt-auto',
  container: 'container mx-auto',
  content: 'text-center text-[#86868B] text-xs',
};

// Новые классы для карточек в стиле Apple
export const cardClasses = {
  base: 'bg-white rounded-2xl shadow-sm overflow-hidden border border-[#E5E5EA]',
  interactive: 'transition-all duration-300 hover:shadow-md',
  header: 'p-4 border-b border-[#E5E5EA]',
  body: 'p-5',
  footer: 'p-4 bg-[#F5F5F7] border-t border-[#E5E5EA]',
  title: 'font-medium text-lg text-[#1D1D1F]',
  subtitle: 'text-[#86868B] text-sm mt-1',
  // Новые стили для карточек секторов
  sectorCard: 'bg-white rounded-2xl overflow-hidden shadow-sm border border-[#E5E5EA] h-full flex flex-col transition-all duration-300 hover:shadow-md hover:shadow',
  sectorImage: 'h-40 overflow-hidden',
  sectorImageInner: 'w-full h-full object-cover transition-all duration-500 group-hover:scale-105',
  sectorContent: 'p-5 flex-1 flex flex-col',
  sectorTitle: 'text-lg font-medium text-[#1D1D1F] mb-2',
  sectorDescription: 'text-[#86868B] text-sm flex-1 mb-3',
  sectorButton: 'mt-auto bg-[#30D158] text-white text-xs font-medium px-4 py-1.5 rounded-full inline-flex items-center justify-center transition-colors duration-200 hover:bg-[#28B14C]',
};

// Новые классы для инструментов сотрудников в стиле Apple
export const toolClasses = {
  base: 'bg-white px-4 py-3 rounded-xl shadow-sm border border-[#E5E5EA] hover:shadow-md transition-all duration-200 flex items-center group w-full sm:w-auto',
  icon: 'mr-2 p-2 rounded-full bg-[#E1F0FF] text-[#0A84FF] group-hover:bg-[#0A84FF] group-hover:text-white transition-colors duration-200',
  adminIcon: 'mr-2 p-2 rounded-full bg-[#E2F9EB] text-[#30D158] group-hover:bg-[#30D158] group-hover:text-white transition-colors duration-200',
  title: 'text-[#1D1D1F] font-medium text-sm group-hover:text-[#1D1D1F]',
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
  card: cardClasses,
  tool: toolClasses,
  spacing: SPACING,
  colors: COLORS,
  heights: HEIGHTS,
};