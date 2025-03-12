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

// Стили контейнера карты
export const mapContainerClasses = {
  base: 'relative overflow-hidden rounded-2xl shadow-lg border border-[#E5E5EA]',
  fullHeight: 'h-[calc(100vh-220px)] min-h-[500px]',
  standardHeight: 'h-[600px]',
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
  },
  icon: 'h-5 w-5 mr-2',
  instructionsContainer: {
    base: 'p-4 rounded-lg mt-2 border',
    view: 'bg-[#E2F9EB] border-[#30D158]/30',
    add: 'bg-[#E1F0FF] border-[#0A84FF]/30',
    edit: 'bg-[#FFF2E3] border-[#FF9F0A]/30',
    delete: 'bg-[#FFE5E5] border-[#FF3B30]/30',
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
};

// Стили для всплывающих подсказок на карте
export const tooltipClasses = {
  base: 'bg-white rounded-xl p-3 shadow-md border border-[#E5E5EA]',
  title: 'text-[#1D1D1F] font-semibold text-center mb-1',
  subtitle: 'text-[#86868B] text-sm italic text-center',
  content: 'mt-2 text-[#1D1D1F]',
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
};

// Стили для модальных окон карты
export const mapModalClasses = {
  overlay: 'fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50',
  container: 'bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-xl',
  header: 'flex items-center justify-between mb-4',
  title: 'text-xl font-semibold text-[#1D1D1F]',
  closeButton: 'text-[#86868B] hover:text-[#1D1D1F] p-1',
  content: 'mb-4',
  footer: 'flex justify-end gap-3 mt-6',
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
`;

// Экспорт всех стилей в одном объекте
export const mapStyles = {
  constants: MAP_CONSTANTS,
  container: mapContainerClasses,
  controls: mapControlsClasses,
  marker: plantMarkerStyles,
  tooltip: tooltipClasses,
  list: mapListClasses,
  modal: mapModalClasses,
};

export default mapStyles; 