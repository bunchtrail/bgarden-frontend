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
  base: 'rounded-xl overflow-hidden',
  
  elevated: 'bg-white/80 border border-[#E5E5EA]/80 shadow-md',
  outlined: 'bg-white border border-[#E5E5EA]',
  filled: 'bg-[#F5F5F7]',
  
  interactive: 'transition-all duration-300 hover:shadow-xl cursor-pointer',
  flat: 'bg-white border border-[#E5E5EA] shadow-sm',
  
  header: 'flex items-center justify-between px-5 pt-4 pb-2',
  content: 'px-5 py-4',
  footer: 'px-5 py-3 border-t border-[#E5E5EA]',
  
  title: 'text-lg font-medium text-[#1D1D1F]',
  subtitle: 'text-sm text-[#86868B]',
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
  warning: 'bg-gradient-to-r from-[#FF9F0A] to-[#FF8A00] text-white hover:shadow-lg',
  success: 'bg-gradient-to-r from-[#30D158] to-[#28BD4C] text-white hover:shadow-lg',
  disabled: 'opacity-60 cursor-not-allowed bg-gray-200 text-gray-500 hover:shadow-none',
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

// Стили для контейнеров
export const containerClasses = {
  base: 'flex flex-col items-center justify-center min-h-[50vh] p-4'
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
  springHover: 'transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.99]',
  shake: 'animate-shake',
};

// Стили для компонента приветствия TimeBasedGreeting
export const greetingStyles = {
  animations: `
    @keyframes float-animation {
      0% { transform: translateY(0) rotate(0deg); }
      100% { transform: translateY(120vh) rotate(360deg); }
    }
    
    @keyframes twinkle {
      0% { opacity: 0.2; }
      50% { opacity: 0.7; }
      100% { opacity: 0.2; }
    }
    
    @keyframes wave-text {
      0% { transform: translateY(0); }
      25% { transform: translateY(-2px); }
      50% { transform: translateY(0); }
      75% { transform: translateY(2px); }
      100% { transform: translateY(0); }
    }
    
    @keyframes pulse-animation {
      0% { transform: scale(1); filter: brightness(1); }
      50% { transform: scale(1.05); filter: brightness(1.1); }
      100% { transform: scale(1); filter: brightness(1); }
    }
  `,
  
  classes: {
    iconBase: 'w-8 h-8 transition-all',
    iconMorning: `text-[${COLORS.warning.main}]`,
    iconDay: `text-[${COLORS.primary.main}]`,
    iconEvening: `text-[${COLORS.warning.main}]`,
    iconNight: `text-[${COLORS.secondary.main}]`,
    
    particle: 'animation: float-animation linear infinite paused',
    particleActive: 'animation-play-state: running',
    
    hoverEffects: 'hover-effect hover-wave-text',
    hoverPulse: 'hover-pulse-effect'
  }
};

// Общий объект стилей приложения
export const appStyles = {
  COLORS,
  cardClasses,
  textClasses,
  buttonClasses,
  containerClasses,
  chipClasses,
  layoutClasses,
  animationClasses,
  greetingStyles,
}; 