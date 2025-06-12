// Экспорт стилей модуля карты с современным дизайном

// Импорт переопределений стилей Leaflet
import './leaflet-overrides.css';

// Импорт стилей компонентов карты
import './map-components.css';

// Импорт утилитарных классов
import './utilities.css';

// Импорт стилей для маркер-кластеров
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

// Экспорт готовых констант для часто используемых стилей
export const MAP_STYLES = {
  // Улучшенные Tailwind классы для карты
  mapContainer:
    'w-full h-full flex flex-col shadow-2xl rounded-2xl overflow-hidden bg-gradient-to-br from-white via-slate-50 to-slate-100 map-fullscreen border border-slate-200/60',
  mapContent:
    'w-full h-full flex-1 relative overflow-hidden backdrop-blur-xl map-content-fullscreen',

  // Улучшенные классы для панели управления
  controlPanel:
    'p-6 bg-white/90 backdrop-blur-2xl rounded-t-2xl border-b border-slate-200/80 shadow-lg',
  controlPanelHeader: 'flex items-center justify-between mb-4',
  controlPanelTitle:
    'text-xl font-bold text-slate-800 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent',
  controlPanelSection:
    'mt-4 pt-4 border-t border-slate-200/60 first:border-0 first:mt-0 first:pt-0',

  // Классы для элементов регионов
  regionTooltip: 'min-w-[200px] max-w-[300px] p-3',

  // Улучшенная инфографика для регионов
  regionInfo: 'mt-3 text-sm',
  regionCount: 'font-bold text-blue-600 text-lg',
  regionTitle:
    'text-slate-800 font-bold mb-2 text-lg bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent',
  regionDescription: 'text-slate-600 leading-relaxed font-medium',

  // Улучшенные кластеры и маркеры
  clusterBase:
    'flex items-center justify-center rounded-full shadow-xl bg-white/90 backdrop-blur-lg border-2 border-blue-200/60',
  clusterIcon: 'w-9 h-9 text-blue-600',
  markerIcon: 'w-8 h-8 drop-shadow-lg transition-all duration-300',

  // Улучшенные классы для легенды
  legendItem: 'flex items-center gap-3 py-2',
  legendColor: 'w-5 h-5 rounded-lg shadow-sm',
  legendText: 'text-sm text-slate-600 font-medium',

  // Улучшенные кнопки слоев
  layerButton:
    'flex items-center gap-3 py-2 px-4 rounded-xl hover:bg-slate-100/80 transition-all duration-300 backdrop-blur-sm',
  layerButtonActive:
    'bg-blue-50 text-blue-700 shadow-inner border border-blue-200/60',

  // Улучшенные анимации
  animation: {
    fadeIn: 'animate-fadeIn',
    slideInRight:
      'transition-all duration-500 ease-out translate-x-0 opacity-100',
    slideOutRight:
      'transition-all duration-500 ease-out translate-x-full opacity-0',
    springHover: 'hover:scale-110 transition-all duration-300 ease-out',
    gentleBounce: 'animate-bounce',
    pulse: 'animate-pulse',
  },

  // Стили карты Leaflet (переопределение стилей библиотеки)
  leafletTooltip:
    'bg-white/95 shadow-2xl rounded-2xl backdrop-filter backdrop-blur-2xl border border-white/30',
  lightMode: 'leaflet-light-mode filter brightness-115 saturate-70 contrast-98',
};

// Улучшенные цвета для карты с современными градиентами
export const MAP_COLORS = {
  primary: '#3b82f6', // Современный синий
  primaryDark: '#1e40af',
  primaryLight: '#93c5fd',
  secondary: '#8b5cf6', // Фиолетовый акцент
  secondaryLight: '#c4b5fd',
  warning: '#f59e0b',
  danger: '#ef4444',
  success: '#10b981',
  text: {
    primary: '#1f2937',
    secondary: '#6b7280',
    tertiary: '#9ca3af',
  },
  background: {
    light: '#f8fafc',
    gray: '#f1f5f9',
    dark: '#e2e8f0',
  },
  border: '#e2e8f0',

  // Современные цвета для регионов на карте
  regions: {
    default: 'rgba(59, 130, 246, 0.15)',
    hover: 'rgba(59, 130, 246, 0.35)',
    active: 'rgba(59, 130, 246, 0.55)',
    stroke: 'rgba(59, 130, 246, 0.8)',
    highlight: 'rgba(139, 92, 246, 0.4)',
  },
};

// Предустановленные карточки для разных типов данных
export const MAP_CARDS = {
  region: {
    // Улучшенный стиль для карточки региона на карте
    container:
      'bg-white/95 backdrop-blur-2xl rounded-2xl shadow-2xl p-6 border border-white/40',
    header: 'border-b border-slate-200/60 pb-3 mb-3',
    title:
      'text-xl font-bold text-slate-800 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent',
    description: 'text-sm text-slate-600 font-medium leading-relaxed',
    dataRow: 'flex justify-between items-center py-2',
    dataLabel: 'text-sm text-slate-500 font-medium',
    dataValue: 'font-bold text-slate-800',
    footer: 'mt-4 pt-3 border-t border-slate-200/60 flex justify-end',
  },
};

// Экспорт утилитарных классов для компонентов
export const MAP_UTILITIES = {
  // Глассморфизм эффекты
  glass: {
    light: 'glass-light',
    medium: 'glass-medium',
    dark: 'glass-dark',
  },

  // Градиентные фоны
  gradients: {
    blue: 'gradient-blue',
    purple: 'gradient-purple',
    ocean: 'gradient-ocean',
    sunset: 'gradient-sunset',
    forest: 'gradient-forest',
    aurora: 'aurora-effect',
  },

  // Неоморфизм
  neumorphism: {
    light: 'neumorphism-light',
    inset: 'neumorphism-inset',
  },

  // Анимации
  animations: {
    float: 'animate-float',
    glow: 'animate-glow',
    pulseFlow: 'animate-pulse-slow',
    bounceGentle: 'animate-bounce-gentle',
    fadeIn: 'fade-in',
    slideUp: 'slide-up',
  },

  // Интерактивные эффекты
  interactive: {
    scale: 'interactive-scale',
    lift: 'interactive-lift',
    glow: 'interactive-glow',
  },

  // Цветовые схемы
  colorSchemes: {
    blue: 'color-scheme-blue',
    green: 'color-scheme-green',
    purple: 'color-scheme-purple',
  },

  // Состояния
  states: {
    success: 'success-state',
    error: 'error-state',
    warning: 'warning-state',
    info: 'info-state',
    loading: 'skeleton',
  },

  // Позиционирование
  positioning: {
    centerAbsolute: 'center-absolute',
    centerFlex: 'center-flex',
  },

  // Типографика
  textGradients: {
    blue: 'text-gradient-blue',
    purple: 'text-gradient-purple',
    rainbow: 'text-gradient-rainbow',
  },

  // Специальные эффекты
  special: {
    sparkle: 'sparkle',
  },
};

// Экспорт готовых комбинаций классов для частых случаев использования
export const MAP_PRESETS = {
  // Современная панель управления
  modernPanel: `${MAP_STYLES.controlPanel} glass-medium interactive-lift fade-in`,

  // Стильная карточка региона
  regionCard: `${MAP_CARDS.region.container} interactive-lift animate-glow`,

  // Красивая кнопка действия
  actionButton: `map-action-button interactive-scale text-gradient-blue`,

  // Элегантная легенда
  elegantLegend: `map-legend glass-light interactive-lift`,

  // Привлекающий внимание маркер
  prominentMarker: `custom-plant-marker animate-float sparkle`,

  // Стильный индикатор загрузки
  loadingIndicator: `map-loading-indicator glass-medium skeleton`,

  // Уведомление с эффектом
  notification: `map-notification glass-light interactive-lift slide-up`,
};

// Современные стили для улучшения взаимодействия с картой
export const CUSTOM_STYLES = `
  /* Отключение перехвата событий в режиме рисования */
  .leaflet-draw-toolbar-enabled .leaflet-overlay-pane,
  .leaflet-draw-toolbar-enabled .leaflet-marker-pane,
  .leaflet-draw-toolbar-enabled .leaflet-shadow-pane {
    pointer-events: none !important;
    cursor: crosshair;
  }
  
  /* Глобальное переопределение курсора в режиме рисования */
  html.leaflet-draw-active, 
  html.leaflet-draw-active * { 
    cursor: crosshair !important; 
  }
  
  /* Улучшение взаимодействия с полигонами регионов */
  .region-polygon {
    cursor: pointer;
    pointer-events: auto !important;
    transition: all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1.0);
  }
  
  /* Современный стиль выделения при наведении на регион */
  .region-polygon.region-hover {
    stroke-width: 4px;
    stroke-opacity: 0.9;
    filter: brightness(1.1) saturate(1.2);
    transform: scale(1.002);
  }
  
  /* Указываем, что все элементы на карте должны быть интерактивными */
  .leaflet-interactive {
    pointer-events: auto !important;
  }
  
  /* Улучшенный стиль для маркера растения */
  .custom-plant-marker {
    z-index: 1000 !important;
    cursor: grab;
    transition: all 0.3s ease;
  }

  .custom-plant-marker:active {
    cursor: grabbing;
  }

  /* Исправляем порядок слоев, чтобы маркер был поверх регионов */
  .leaflet-marker-pane {
    z-index: 650 !important;
  }
  
  .leaflet-overlay-pane {
    z-index: 640 !important;
  }

  /* Плавные переходы для всех интерактивных элементов */
  .leaflet-interactive, .custom-plant-marker, .plant-cluster-icon {
    transition: all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1.0);
  }
  
  /* Улучшенные тени для контролов */
  .leaflet-control {
    filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.1));
  }
`;

// Добавляем CSS в документ при импорте этого файла
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = CUSTOM_STYLES;
  document.head.appendChild(style);
}

