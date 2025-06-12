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

/**
 * ВАЖНО: CSS стили в этом файле решают проблему конфликта слоев карты
 *
 * Проблема: В режиме удаления (delete) Leaflet-Draw не может удалять области,
 * потому что служебные полигоны MapRegionsLayer перехватывают клики
 *
 * Решение: При включении режимов редактирования/удаления отключаем
 * pointer-events для всех служебных полигонов (.region-polygon)
 *
 * Это позволяет Leaflet-Draw корректно обрабатывать клики по нужным слоям
 */

// Логгер для отслеживания состояний карты и стилей
export const MapStylesLogger = {
  // Префикс для всех логов
  PREFIX: '[MapStyles]',

  // Включение/выключение подробного логгирования
  DEBUG_ENABLED: process.env.NODE_ENV === 'development',

  log(message: string, data?: any) {
    if (this.DEBUG_ENABLED) {
      console.log(`${this.PREFIX} ${message}`, data || '');
    }
  },

  warn(message: string, data?: any) {
    console.warn(`${this.PREFIX} WARNING: ${message}`, data || '');
  },

  error(message: string, data?: any) {
    console.error(`${this.PREFIX} ERROR: ${message}`, data || '');
  },

  // Специальные методы для отслеживания состояний карты
  logDrawModeChange(mode: string, enabled: boolean) {
    this.log(`Draw mode ${mode} ${enabled ? 'ENABLED' : 'DISABLED'}`);
    this.logCurrentMapState();
  },

  logStyleApplication(styleName: string, applied: boolean) {
    this.log(`Style "${styleName}" ${applied ? 'APPLIED' : 'REMOVED'}`);
  },

  logRegionInteraction(action: string, regionId?: string) {
    this.log(
      `Region interaction: ${action}`,
      regionId ? `Region: ${regionId}` : ''
    );
  },

  logCurrentMapState() {
    if (!this.DEBUG_ENABLED) return;

    const container = document.querySelector('.leaflet-container');
    if (!container) {
      this.warn('Leaflet container not found');
      return;
    }

    const state = {
      drawToolbarEnabled: container.classList.contains(
        'leaflet-draw-toolbar-enabled'
      ),
      drawActive: document.documentElement.classList.contains(
        'leaflet-draw-active'
      ),
      regionPolygons: container.querySelectorAll('.region-polygon').length,
      interactiveElements: container.querySelectorAll('.leaflet-interactive')
        .length,
      timestamp: new Date().toISOString(),
    };

    this.log('Current map state:', state);
  },

  logPointerEventsStatus() {
    if (!this.DEBUG_ENABLED) return;

    const regionPolygons = document.querySelectorAll('.region-polygon');
    const statusReport = Array.from(regionPolygons).map((polygon, index) => {
      const computedStyle = window.getComputedStyle(polygon);
      return {
        index,
        pointerEvents: computedStyle.pointerEvents,
        cursor: computedStyle.cursor,
        zIndex: computedStyle.zIndex,
        classes: polygon.className,
      };
    });

    this.log('Pointer events status for region polygons:', statusReport);
  },
};

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

  // Отладочные утилиты
  debug: {
    enabled: 'data-debug="enabled"',
    regionOutline: 'debug-region-outline',
    pointerEventsNone: 'debug-pointer-events-none',
    interactionBlocked: 'debug-interaction-blocked',
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
  
  /* Дополнительная защита: отключение событий для всех служебных элементов регионов */
  .leaflet-draw-toolbar-enabled .region-polygon,
  .leaflet-draw-toolbar-enabled .leaflet-interactive.region-polygon {
    pointer-events: none !important;
    cursor: crosshair !important;
    z-index: auto !important;
    /* Добавляем визуальный индикатор отключенного состояния для отладки */
    opacity: 0.7 !important;
    filter: grayscale(0.3) !important;
  }
  
  /* Глобальное переопределение курсора в режиме рисования */
  html.leaflet-draw-active, 
  html.leaflet-draw-active * { 
    cursor: crosshair !important; 
  }
  
  /* Специальные стили для режима удаления */
  .leaflet-draw-toolbar .leaflet-draw-edit-remove.leaflet-draw-toolbar-button-enabled ~ .leaflet-container .region-polygon,
  .leaflet-draw-edit-remove.leaflet-draw-toolbar-button-enabled ~ .leaflet-container .region-polygon {
    pointer-events: none !important;
    cursor: not-allowed !important;
    /* Визуальная индикация режима удаления */
    opacity: 0.5 !important;
    filter: grayscale(0.5) sepia(0.2) hue-rotate(320deg) !important;
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
  
  /* Отключение интерактивности служебных полигонов во время режимов редактирования/удаления */
  .leaflet-draw-toolbar-enabled .region-polygon {
    pointer-events: none !important;
    cursor: crosshair !important;
  }
  
  /* Дебаг-стили для визуального контроля применения правил */
  .region-polygon[data-debug="enabled"] {
    outline: 2px dashed #ff0000 !important;
    outline-offset: 2px !important;
  }
  
  .leaflet-draw-toolbar-enabled .region-polygon[data-debug="enabled"] {
    outline: 2px dashed #00ff00 !important;
    outline-offset: 2px !important;
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

  // Инициализация логгирования
  MapStylesLogger.log('Custom styles loaded and applied to document');

  // Мониторинг изменений классов на body/html для отслеживания режимов карты
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (
        mutation.type === 'attributes' &&
        mutation.attributeName === 'class'
      ) {
        const target = mutation.target as HTMLElement;

        if (target.tagName === 'HTML') {
          const hasDrawActive = target.classList.contains(
            'leaflet-draw-active'
          );
          MapStylesLogger.logDrawModeChange('draw-active', hasDrawActive);
        }
      }
    });
  });

  // Мониторинг изменений в контейнере карты
  const mapObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (
        mutation.type === 'attributes' &&
        mutation.attributeName === 'class'
      ) {
        const target = mutation.target as HTMLElement;

        if (target.classList.contains('leaflet-container')) {
          const hasDrawToolbar = target.classList.contains(
            'leaflet-draw-toolbar-enabled'
          );
          MapStylesLogger.logDrawModeChange('draw-toolbar', hasDrawToolbar);

          // Логгируем статус pointer-events после изменения
          setTimeout(() => {
            MapStylesLogger.logPointerEventsStatus();
          }, 100);
        }
      }

      // Отслеживание добавления/удаления полигонов регионов
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node) => {
          if (
            node instanceof HTMLElement &&
            node.classList.contains('region-polygon')
          ) {
            MapStylesLogger.logRegionInteraction(
              'Region polygon added',
              node.id || 'unknown'
            );
          }
        });

        mutation.removedNodes.forEach((node) => {
          if (
            node instanceof HTMLElement &&
            node.classList.contains('region-polygon')
          ) {
            MapStylesLogger.logRegionInteraction(
              'Region polygon removed',
              node.id || 'unknown'
            );
          }
        });
      }
    });
  });

  // Запуск наблюдателей
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  });

  // Ждем загрузки DOM для запуска наблюдателя карты
  document.addEventListener('DOMContentLoaded', () => {
    const mapContainer = document.querySelector('.leaflet-container');
    if (mapContainer) {
      mapObserver.observe(mapContainer, {
        attributes: true,
        childList: true,
        subtree: true,
        attributeFilter: ['class'],
      });
      MapStylesLogger.log('Map container observer started');
    } else {
      // Если карта еще не загружена, ждем ее появления
      const containerWatcher = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (
              node instanceof HTMLElement &&
              node.classList.contains('leaflet-container')
            ) {
              mapObserver.observe(node, {
                attributes: true,
                childList: true,
                subtree: true,
                attributeFilter: ['class'],
              });
              MapStylesLogger.log('Map container found and observer started');
              containerWatcher.disconnect();
            }
          });
        });
      });

      containerWatcher.observe(document.body, {
        childList: true,
        subtree: true,
      });
    }
  });

  // Добавляем глобальные функции для ручного логгирования (доступны в консоли браузера)
  (window as any).mapStylesDebug = {
    logCurrentState: () => MapStylesLogger.logCurrentMapState(),
    logPointerEvents: () => MapStylesLogger.logPointerEventsStatus(),
    enableDebug: () => {
      MapStylesLogger.DEBUG_ENABLED = true;
    },
    disableDebug: () => {
      MapStylesLogger.DEBUG_ENABLED = false;
    },
    getLogger: () => MapStylesLogger,
  };

  MapStylesLogger.log('Debug functions added to window.mapStylesDebug');
}

// Дополнительные утилиты для интеграции с компонентами карты
export const MapInteractionUtils = {
  /**
   * Включает визуальную отладку для всех полигонов регионов
   */
  enableVisualDebug() {
    const polygons = document.querySelectorAll('.region-polygon');
    polygons.forEach((polygon) => {
      polygon.setAttribute('data-debug', 'enabled');
    });
    MapStylesLogger.log('Visual debug enabled for all region polygons');
  },

  /**
   * Отключает визуальную отладку
   */
  disableVisualDebug() {
    const polygons = document.querySelectorAll('.region-polygon[data-debug]');
    polygons.forEach((polygon) => {
      polygon.removeAttribute('data-debug');
    });
    MapStylesLogger.log('Visual debug disabled');
  },

  /**
   * Проверяет, применяются ли стили блокировки интерактивности
   */
  checkInteractionBlocking(): boolean {
    const container = document.querySelector('.leaflet-container');
    if (!container) {
      MapStylesLogger.warn('Leaflet container not found');
      return false;
    }

    const hasDrawToolbar = container.classList.contains(
      'leaflet-draw-toolbar-enabled'
    );
    const polygons = container.querySelectorAll('.region-polygon');

    let blockingApplied = true;
    polygons.forEach((polygon, index) => {
      const computedStyle = window.getComputedStyle(polygon);
      const isBlocked = computedStyle.pointerEvents === 'none';

      if (hasDrawToolbar && !isBlocked) {
        MapStylesLogger.warn(
          `Region polygon ${index} is not blocked when it should be`
        );
        blockingApplied = false;
      } else if (!hasDrawToolbar && isBlocked) {
        MapStylesLogger.warn(
          `Region polygon ${index} is blocked when it shouldn't be`
        );
        blockingApplied = false;
      }
    });

    MapStylesLogger.log(
      `Interaction blocking check: ${blockingApplied ? 'PASSED' : 'FAILED'}`,
      {
        drawToolbarEnabled: hasDrawToolbar,
        polygonCount: polygons.length,
      }
    );

    return blockingApplied;
  },

  /**
   * Логгирует детальную информацию о состоянии всех элементов карты
   */
  generateDetailedReport() {
    const report = {
      timestamp: new Date().toISOString(),
      environment: {
        userAgent: navigator.userAgent,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight,
        },
      },
      mapContainer: null as any,
      regionPolygons: [] as any[],
      leafletLayers: [] as any[],
      appliedStyles: [] as any[],
    };

    // Информация о контейнере карты
    const container = document.querySelector('.leaflet-container');
    if (container) {
      report.mapContainer = {
        classes: container.className,
        drawToolbarEnabled: container.classList.contains(
          'leaflet-draw-toolbar-enabled'
        ),
        dimensions: {
          width: container.clientWidth,
          height: container.clientHeight,
        },
      };
    }

    // Информация о полигонах регионов
    const polygons = document.querySelectorAll('.region-polygon');
    polygons.forEach((polygon, index) => {
      const computedStyle = window.getComputedStyle(polygon);
      report.regionPolygons.push({
        index,
        id: (polygon as HTMLElement).id || null,
        classes: polygon.className,
        pointerEvents: computedStyle.pointerEvents,
        cursor: computedStyle.cursor,
        opacity: computedStyle.opacity,
        zIndex: computedStyle.zIndex,
        isVisible: computedStyle.display !== 'none',
        hasDebugAttribute: polygon.hasAttribute('data-debug'),
      });
    });

    // Информация о слоях Leaflet
    const leafletLayers = document.querySelectorAll('.leaflet-layer');
    leafletLayers.forEach((layer, index) => {
      const computedStyle = window.getComputedStyle(layer);
      report.leafletLayers.push({
        index,
        classes: layer.className,
        zIndex: computedStyle.zIndex,
        pointerEvents: computedStyle.pointerEvents,
      });
    });

    // Проверка применения стилей
    const styleElement = document.querySelector('style');
    if (styleElement && styleElement.innerHTML.includes('region-polygon')) {
      report.appliedStyles.push('Custom region polygon styles detected');
    }

    MapStylesLogger.log('Detailed map state report generated:', report);
    return report;
  },
};

