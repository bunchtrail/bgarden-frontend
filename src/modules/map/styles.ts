/**
 * Стили для модуля карты Botanical Garden
 * Использует глобальные стили и Tailwind CSS v3.3.0
 */

import { LatLngTuple } from 'leaflet';
import { COLORS } from '../../styles/global-styles';

// Константы для карты
export const MAP_CONSTANTS = {
  DEFAULT_ZOOM: 16,
  MIN_ZOOM: 14,
  MAX_ZOOM: 20,
  DEFAULT_CENTER: [55.75, 37.61] as LatLngTuple, // Координаты по умолчанию
  ANIMATION_DURATION: 0.5, // в секундах
};

// Константы для темы карты
export const MAP_THEME = {
  LIGHT: {
    BG: '#FFFFFF',
    BG_SECONDARY: '#F5F5F7',
    BORDER: '#E5E5EA',
    TEXT_PRIMARY: '#1D1D1F',
    TEXT_SECONDARY: '#86868B',
  },
  DARK: {
    BG: '#1C1C1E',
    BG_SECONDARY: '#2C2C2E',
    BORDER: '#3A3A3C',
    TEXT_PRIMARY: '#FFFFFF',
    TEXT_SECONDARY: '#98989D',
  },
  ACCENT: {
    PRIMARY: '#0A84FF',
    PRIMARY_DARK: '#0071E3',
    SUCCESS: '#30D158',
    SUCCESS_DARK: '#28B14C',
    WARNING: '#FF9F0A',
    WARNING_DARK: '#E08600',
    DANGER: '#FF3B30',
    DANGER_DARK: '#D70015',
  }
};

// Стили контейнера карты
export const mapContainerClasses = {
  base: 'relative overflow-hidden rounded-2xl shadow-lg border border-[#E5E5EA]',
  fullHeight: 'h-[calc(100vh-220px)] min-h-[500px]',
  standardHeight: 'h-[600px]',
  dark: 'border-[#3A3A3C]',
};

// Стили для элементов управления картой
export const mapControlsClasses = {
  container: 'mt-4',
  buttonsContainer: 'flex flex-wrap gap-2 mb-4',
  button: {
    base: 'px-4 py-2 rounded-full font-medium transition-all duration-300 flex items-center shadow-sm',
    view: 'bg-[#30D158] hover:bg-[#28B14C] text-white',
    add: 'bg-[#0A84FF] hover:bg-[#0071E3] text-white',
    edit: 'bg-[#FF9F0A] hover:bg-[#E08600] text-white',
    delete: 'bg-[#FF3B30] hover:bg-[#D70015] text-white',
    inactive: 'bg-[#F5F5F7] hover:bg-[#EBEBF0] text-[#1D1D1F] border border-[#E5E5EA]',
    dark: {
      inactive: 'bg-[#2C2C2E] hover:bg-[#3A3A3C] text-white border-[#3A3A3C]'
    }
  },
  icon: 'h-5 w-5 mr-2',
  instructionsContainer: {
    base: 'p-4 rounded-lg mt-2 border',
    view: 'bg-[#E2F9EB] border-[#30D158]/30',
    add: 'bg-[#E1F0FF] border-[#0A84FF]/30',
    edit: 'bg-[#FFF2E3] border-[#FF9F0A]/30',
    delete: 'bg-[#FFE5E5] border-[#FF3B30]/30',
    dark: {
      view: 'bg-[#28B14C]/20 border-[#30D158]/30 text-white',
      add: 'bg-[#0071E3]/20 border-[#0A84FF]/30 text-white',
      edit: 'bg-[#E08600]/20 border-[#FF9F0A]/30 text-white',
      delete: 'bg-[#D70015]/20 border-[#FF3B30]/30 text-white',
    }
  },
  instructionsTitle: {
    base: 'mb-2 font-medium flex items-center',
    view: 'text-[#28B14C]',
    add: 'text-[#0071E3]',
    edit: 'text-[#E08600]',
    delete: 'text-[#D70015]',
  },
  instructionsList: 'list-decimal pl-5 space-y-1 text-sm',
  formsContainer: 'mt-3',
};

// Стили для маркеров растений
export const plantMarkerStyles = {
  createMarkerStyle: (color: string, isSelected: boolean = false) => {
    const size = isSelected ? 2.4 : 2;
    const borderWidth = isSelected ? 2 : 1;
    
    return `
      background-color: ${color};
      width: ${size}rem;
      height: ${size}rem;
      display: block;
      left: -${size / 2}rem;
      top: -${size / 2}rem;
      position: relative;
      border-radius: ${size}rem ${size}rem 0;
      transform: rotate(45deg);
      border: ${borderWidth}px solid #FFFFFF;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
      ${isSelected ? 'z-index: 1000; animation: pulse-marker 1.5s infinite;' : ''}
      transition: all 0.3s ease;
    `;
  },
  getIconColor: (sectorType: number) => {
    // По типу сектора
    if (sectorType === 1) {
      // Дендрологический
      return COLORS.SUCCESS;
    } else if (sectorType === 2) {
      // Флора
      return COLORS.PRIMARY;
    } else if (sectorType === 3) {
      // Цветущие
      return COLORS.WARNING;
    }
    return COLORS.PRIMARY;
  },
  // Новые стили для категорий растений
  getPlantCategoryColor: (categoryId: number) => {
    const categoryColors: Record<number, string> = {
      1: '#30D158', // Деревья
      2: '#0A84FF', // Кустарники
      3: '#FF9F0A', // Цветы
      4: '#FF375F', // Редкие растения
      5: '#5E5CE6', // Травы
      6: '#AC8E68', // Грибы
      0: '#86868B', // Другие (по умолчанию)
    };
    
    return categoryColors[categoryId] || categoryColors[0];
  }
};

// Стили для всплывающих подсказок на карте
export const tooltipClasses = {
  base: 'bg-white rounded-xl p-3 shadow-md border border-[#E5E5EA]',
  title: 'text-[#1D1D1F] font-semibold text-center mb-1',
  subtitle: 'text-[#86868B] text-sm italic text-center',
  content: 'mt-2 text-[#1D1D1F]',
  dark: {
    base: 'bg-[#2C2C2E] border-[#3A3A3C] text-white',
    title: 'text-white',
    subtitle: 'text-[#98989D]',
    content: 'text-white',
  }
};

// Стили для списка карт
export const mapListClasses = {
  container: 'bg-white rounded-2xl p-5 shadow-sm border border-[#E5E5EA]',
  title: 'text-xl font-semibold mb-4 text-[#1D1D1F]',
  list: 'space-y-3 max-h-[400px] overflow-y-auto scrollbar scrollbar-thumb-[#E5E5EA] scrollbar-track-[#F5F5F7] scrollbar-thin pr-2',
  item: {
    base: 'p-3 rounded-xl border transition-all duration-300 flex items-center',
    active: 'bg-[#E1F0FF] border-[#0A84FF]',
    inactive: 'bg-white border-[#E5E5EA] hover:bg-[#F5F5F7]',
  },
  icon: 'h-8 w-8 mr-3 text-[#0A84FF]',
  inactiveIcon: 'h-8 w-8 mr-3 text-[#86868B]',
  name: 'font-medium text-[#1D1D1F]',
  details: 'text-xs text-[#86868B] mt-1',
  dark: {
    container: 'bg-[#2C2C2E] border-[#3A3A3C] text-white',
    title: 'text-white',
    list: 'scrollbar-thumb-[#3A3A3C] scrollbar-track-[#2C2C2E]',
    item: {
      active: 'bg-[#0A84FF]/20 border-[#0A84FF]',
      inactive: 'bg-[#2C2C2E] border-[#3A3A3C] hover:bg-[#3A3A3C]',
    },
    name: 'text-white',
    details: 'text-[#98989D]',
  }
};

// Стили для модальных окон карты
export const mapModalClasses = {
  overlay: 'fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50',
  container: 'bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-xl',
  header: 'flex items-center justify-between mb-4',
  title: 'text-xl font-semibold text-[#1D1D1F]',
  closeButton: 'text-[#86868B] hover:text-[#1D1D1F] p-1',
  content: 'mb-4',
  footer: 'flex justify-end gap-3 mt-6',
  dark: {
    overlay: 'bg-black/70',
    container: 'bg-[#2C2C2E] text-white',
    title: 'text-white',
    closeButton: 'text-[#98989D] hover:text-white',
  }
};

// Стили для карточек растений на карте
export const plantCardClasses = {
  container: 'bg-white rounded-xl p-4 shadow-md border border-[#E5E5EA] transition-all duration-300 max-w-[300px]',
  header: 'flex items-center justify-between mb-2',
  title: 'font-semibold text-[#1D1D1F]',
  subtitle: 'text-sm text-[#86868B] mt-1',
  content: 'text-sm text-[#1D1D1F] mt-2',
  infoItem: 'flex items-center gap-2 text-sm text-[#1D1D1F] mb-1',
  infoIcon: 'w-4 h-4 text-[#86868B]',
  footer: 'flex justify-end gap-2 mt-3 pt-2 border-t border-[#E5E5EA]',
  button: {
    base: 'px-3 py-1.5 rounded-full text-sm font-medium',
    primary: 'bg-[#0A84FF] hover:bg-[#0071E3] text-white',
    secondary: 'bg-[#F5F5F7] hover:bg-[#EBEBF0] text-[#1D1D1F] border border-[#E5E5EA]'
  },
  image: 'w-full h-32 object-cover rounded-lg mt-2 mb-3',
  badge: {
    base: 'px-2 py-0.5 rounded-full text-xs font-medium',
    green: 'bg-[#E2F9EB] text-[#28B14C]',
    blue: 'bg-[#E1F0FF] text-[#0071E3]',
    orange: 'bg-[#FFF2E3] text-[#E08600]',
    red: 'bg-[#FFE5E5] text-[#D70015]',
  },
  dark: {
    container: 'bg-[#2C2C2E] border-[#3A3A3C] text-white',
    title: 'text-white',
    subtitle: 'text-[#98989D]',
    content: 'text-white',
    infoItem: 'text-white',
    infoIcon: 'text-[#98989D]',
    footer: 'border-[#3A3A3C]',
    button: {
      secondary: 'bg-[#3A3A3C] hover:bg-[#48484A] text-white border-[#48484A]'
    },
    badge: {
      green: 'bg-[#28B14C]/20 text-[#30D158]',
      blue: 'bg-[#0071E3]/20 text-[#0A84FF]',
      orange: 'bg-[#E08600]/20 text-[#FF9F0A]',
      red: 'bg-[#D70015]/20 text-[#FF3B30]',
    }
  }
};

// Стили для компонентов поиска на карте
export const mapSearchClasses = {
  container: 'absolute z-10 top-3 left-3 right-3 md:left-auto md:right-3 md:w-64',
  inputWrapper: 'relative',
  input: 'w-full bg-white rounded-full py-2 px-4 shadow-md border border-[#E5E5EA] pr-10',
  icon: 'absolute right-3 top-1/2 transform -translate-y-1/2 text-[#86868B]',
  results: 'absolute w-full mt-2 bg-white rounded-xl shadow-md border border-[#E5E5EA] max-h-60 overflow-y-auto',
  resultItem: 'p-3 border-b border-[#E5E5EA] last:border-b-0 hover:bg-[#F5F5F7] cursor-pointer',
  resultTitle: 'font-medium text-[#1D1D1F]',
  resultSubtitle: 'text-xs text-[#86868B] mt-1',
  dark: {
    input: 'bg-[#2C2C2E] border-[#3A3A3C] text-white',
    icon: 'text-[#98989D]',
    results: 'bg-[#2C2C2E] border-[#3A3A3C]',
    resultItem: 'border-[#3A3A3C] hover:bg-[#3A3A3C]',
    resultTitle: 'text-white',
    resultSubtitle: 'text-[#98989D]',
  }
};

// Стили для легенды карты
export const mapLegendClasses = {
  container: 'absolute z-10 bottom-6 left-6 bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-md border border-[#E5E5EA]',
  title: 'font-semibold mb-2 text-[#1D1D1F]',
  item: 'flex items-center mb-1.5 last:mb-0',
  color: 'w-4 h-4 rounded-full mr-2 border border-white',
  label: 'text-sm text-[#1D1D1F]',
  dark: {
    container: 'bg-[#2C2C2E]/90 border-[#3A3A3C]',
    title: 'text-white',
    label: 'text-white'
  }
};

// CSS для анимаций
export const mapAnimations = `
@keyframes pulse-marker {
  0% {
    box-shadow: 0 0 0 0 rgba(10, 132, 255, 0.6);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(10, 132, 255, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(10, 132, 255, 0);
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slide-up {
  from {
    transform: translateY(10px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes slide-down {
  from {
    transform: translateY(-10px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes scale-in {
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
`;

// Экспорт всех стилей в одном объекте
export const mapStyles = {
  constants: MAP_CONSTANTS,
  theme: MAP_THEME,
  container: mapContainerClasses,
  controls: mapControlsClasses,
  marker: plantMarkerStyles,
  tooltip: tooltipClasses,
  list: mapListClasses,
  modal: mapModalClasses,
  plantCard: plantCardClasses,
  search: mapSearchClasses,
  legend: mapLegendClasses,
};

export default mapStyles; 