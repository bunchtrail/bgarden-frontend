// Главный экспортный файл для модуля карты

// Экспорт только необходимых типов и компонентов
export * from './types/mapTypes';

// Экспорт основных компонентов
export { default as MapPage } from './components/MapPage';

// Экспорт контекстов
export { 
  MapProvider, 
  useMapContext,
  type Area,
  type Plant
} from './contexts/MapContext';

export { 
  MapConfigProvider,
  MAP_LAYERS,
  MAP_MODES,
  DEFAULT_MAP_CONFIG,
  useMapConfig
} from './contexts/MapConfigContext';

// Экспорт унифицированной панели управления
export { default as UnifiedControlPanel } from './components/control-panel/UnifiedControlPanel';
export { PanelSection } from './components/control-panel/types';
export type { ControlPanelSection, UnifiedPanelConfig, UNIFIED_PANEL_PRESETS } from './components/control-panel';

// Дополнительные типы
export type { MapData } from './services/mapService';

// Хуки
export { 
  useMap, 
  useMapData, 
  useMapLayers,
  useMapControlPanel
} from './hooks';

// Сервисы
export { 
  getMapImageUrl, 
  getActiveMap 
} from './services/mapService';

export { 
  getAllRegions, 
  convertRegionsToAreas, 
  parseCoordinates, 
  updateRegion 
} from './services/regionService';

// Стили
export { MAP_STYLES } from './styles';

// Map Components
export {
  MapRegionsLayer,
  MapImageLayer,
  MapBoundsHandler,
  ErrorView,
  EmptyMapView,
  LoadingView,
  MapReadyHandler,
  BaseMapContainer
} from './components/map-components';

// Компоненты панели управления (кроме UnifiedControlPanel, который уже экспортирован выше)
export {
  LayerSelector,
  PanelHeader,
  ModeToggle,
} from './components/control-panel';

// Компоненты для управления слоями
export { default as MapLayersManager } from './components/map-layers/MapLayersManager';

// Компоненты для отображения содержимого карты
export { default as MapContentStateRenderer } from './components/map-content/MapContentStateRenderer';

// Компоненты информации о растениях
export { EnhancedPlantMarkersLayer } from './components/plant-info'; 