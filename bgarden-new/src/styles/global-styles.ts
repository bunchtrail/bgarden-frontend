// Объекты для хранения переиспользуемых стилей Tailwind
// Это позволяет использовать единообразные стили во всем приложении

// Цвета приложения
export const COLORS = {
  primary: {
    main: '#0A84FF',
    dark: '#0071E3',
    light: '#E1F0FF',
  },
  secondary: {
    main: '#30D158',
    dark: '#25A93E',
    light: '#E2F9EB',
  },
  danger: {
    main: '#FF3B30',
    dark: '#D70015',
    light: '#FFE5E5',
  },
  warning: {
    main: '#FF9F0A',
    dark: '#C93400',
    light: '#FFF2E5',
  },
  neutral: {
    main: '#F5F5F7',
    dark: '#E5E5EA',
    light: '#FFFFFF',
  },
  text: {
    primary: '#1D1D1F',
    secondary: '#86868B',
    tertiary: '#AEAEB2',
  },
  SUCCESS: '#30D158',
};

// Стили для карточек
export const cardClasses = {
  base: 'bg-white/80 backdrop-blur-lg rounded-2xl border border-[#E5E5EA]/80 shadow-lg',
  interactive: 'transition-all duration-300 hover:shadow-xl cursor-pointer',
  flat: 'bg-white rounded-xl border border-[#E5E5EA] shadow-sm',
};

// Стили для текста
export const textClasses = {
  heading: 'font-bold text-[#1D1D1F]',
  subheading: 'font-semibold text-lg text-[#1D1D1F]',
  body: 'text-sm',
  small: 'text-xs',
  primary: 'text-[#1D1D1F]',
  secondary: 'text-[#86868B]',
  tertiary: 'text-[#AEAEB2]',
};

// Стили для кнопок
export const buttonClasses = {
  base: 'py-2 px-4 rounded-lg text-sm font-medium transition-all duration-300',
  primary: 'bg-gradient-to-r from-[#0A84FF] to-[#0071E3] text-white hover:shadow-lg',
  secondary: 'bg-white text-[#0A84FF] border border-[#0A84FF] hover:bg-[#F2F7FF]',
  danger: 'bg-gradient-to-r from-[#FF3B30] to-[#FF453A] text-white hover:shadow-lg',
  neutral: 'bg-[#F5F5F7] text-[#86868B] border border-[#E5E5EA] hover:bg-white',
};

// Стили для чипов/тегов
export const chipClasses = {
  base: 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
  primary: 'bg-[#E1F0FF] text-[#0A84FF]',
  secondary: 'bg-[#E2F9EB] text-[#30D158]',
  danger: 'bg-[#FFE5E5] text-[#FF3B30]',
  warning: 'bg-[#FFF2E5] text-[#FF9F0A]',
  neutral: 'bg-[#F5F5F7] text-[#86868B]',
};

// Стили для макетов
export const layoutClasses = {
  container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
  section: 'py-6 md:py-12',
  grid2: 'grid grid-cols-1 md:grid-cols-2 gap-6',
  grid3: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
  grid4: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6',
  flexBetween: 'flex justify-between items-center',
  flexCenter: 'flex justify-center items-center',
  gridSm2: 'grid grid-cols-1 sm:grid-cols-2',
};

// Стили для анимаций
export const animationClasses = {
  fadeIn: 'animate-fadeIn',
  transition: 'transition-all duration-300',
  hover: 'hover:scale-105',
  springHover: 'transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]',
  shake: 'animate-shake',
};

// Общий объект стилей приложения
export const appStyles = {
  COLORS,
  cardClasses,
  textClasses,
  buttonClasses,
  chipClasses,
  layoutClasses,
  animationClasses,
}; 