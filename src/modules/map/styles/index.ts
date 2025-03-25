// Экспорт стилей модуля карты
import { COLORS } from '@/styles/global-styles';

// Импорт переопределений стилей Leaflet
import './leaflet-overrides.css';

// Импорт стилей для маркер-кластеров
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

// Экспорт готовых констант для часто используемых стилей
export const MAP_STYLES = {
  // Tailwind классы для карты
  mapContainer: 'w-full h-full flex flex-col shadow-lg rounded-lg overflow-hidden bg-white',
  mapContent: 'w-full h-[650px]  relative rounded-b-lg overflow-hidden backdrop-blur-md',
  
  // Классы для панели управления
  controlPanel: 'p-4 bg-white/95 backdrop-blur rounded-t-lg border-b border-neutral-dark/20 shadow-sm',
  controlPanelHeader: 'flex items-center justify-between mb-3',
  controlPanelTitle: 'text-lg font-medium text-text-primary',
  controlPanelSection: 'mt-3 pt-3 border-t border-neutral-dark/20 first:border-0 first:mt-0 first:pt-0',
  
  // Классы для элементов регионов
  regionTooltip: 'min-w-[180px] max-w-[280px] p-2',
  
  // Инфографика для регионов
  regionInfo: 'mt-2 text-sm',
  regionCount: 'font-medium text-primary-main',
  regionTitle: 'text-text-primary font-medium mb-1 text-base',
  regionDescription: 'text-text-secondary leading-snug',
  
  // Кластеры и маркеры
  clusterBase: 'flex items-center justify-center rounded-full shadow-md bg-white/80 backdrop-blur-sm border border-neutral-dark/20',
  clusterIcon: 'w-8 h-8 text-primary-main',
  markerIcon: 'w-7 h-7 drop-shadow-md transition-transform',
  
  // Классы для легенды
  legendItem: 'flex items-center gap-2 py-1.5',
  legendColor: 'w-4 h-4 rounded',
  legendText: 'text-sm text-text-secondary',
  
  // Кнопки слоев
  layerButton: 'flex items-center gap-2 py-1.5 px-3 rounded-md hover:bg-neutral-main transition-all duration-200',
  layerButtonActive: 'bg-primary-light text-primary-main',
  
  // Анимации
  animation: {
    fadeIn: 'animate-fadeIn',
    slideInRight: 'transition-all duration-300 ease-in-out translate-x-0 opacity-100',
    slideOutRight: 'transition-all duration-300 ease-in-out translate-x-full opacity-0',
    springHover: 'hover:scale-105 transition-transform duration-200',
  },
  
  // Стили карты Leaflet (переопределение стилей библиотеки)
  leafletTooltip: 'bg-white/95 shadow-lg rounded-xl backdrop-filter backdrop-blur-lg',
  lightMode: 'leaflet-light-mode filter brightness-110 saturate-60 contrast-95',
};

// Цвета для карты - теперь используем глобальные цвета из COLORS
export const MAP_COLORS = {
  primary: COLORS.primary.main,
  primaryDark: COLORS.primary.dark,
  primaryLight: COLORS.primary.light,
  secondary: COLORS.secondary.main,
  secondaryLight: COLORS.secondary.light,
  warning: COLORS.warning.main,
  danger: COLORS.danger.main,
  success: COLORS.SUCCESS,
  text: {
    primary: COLORS.text.primary,
    secondary: COLORS.text.secondary,
    tertiary: COLORS.text.tertiary,
  },
  background: {
    light: COLORS.neutral.light,
    gray: COLORS.neutral.main,
    dark: COLORS.neutral.dark,
  },
  border: COLORS.neutral.dark,
  
  // Цвета для регионов на карте
  regions: {
    default: 'rgba(10, 132, 255, 0.2)',
    hover: 'rgba(10, 132, 255, 0.4)',
    active: 'rgba(10, 132, 255, 0.6)',
    stroke: 'rgba(10, 132, 255, 0.8)',
    highlight: 'rgba(255, 159, 10, 0.4)',
  }
};

// Предустановленные карточки для разных типов данных
export const MAP_CARDS = {
  region: {
    // Стиль для карточки региона на карте
    container: 'bg-white/95 backdrop-blur-lg rounded-xl shadow-lg p-4 border border-neutral-dark/20',
    header: 'border-b border-neutral-dark/20 pb-2 mb-2',
    title: 'text-lg font-medium text-text-primary',
    description: 'text-sm text-text-secondary',
    dataRow: 'flex justify-between items-center py-1',
    dataLabel: 'text-sm text-text-secondary',
    dataValue: 'font-medium text-text-primary',
    footer: 'mt-3 pt-2 border-t border-neutral-dark/20 flex justify-end',
  }
}; 