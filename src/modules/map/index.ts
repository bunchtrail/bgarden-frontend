// Главный экспортный файл для модуля карты

// Экспорт только необходимых типов и компонентов
export * from './types/mapTypes';

// Экспорт основных компонентов
export { default as MapPage } from './components/MapPage';
export { default as MapTypeSelector } from './components/MapTypeSelector';

// Экспорт контекстов
export { MapProvider, useMapContext } from './contexts/MapContext';

export {
  MapConfigProvider,
  MAP_LAYERS,
  MAP_MODES,
  MAP_TYPES,
  DEFAULT_MAP_CONFIG,
  DEFAULT_DGIS_CONFIG,
  useMapConfig,
} from './contexts/MapConfigContext';

// Экспорт унифицированной панели управления
export { default as UnifiedControlPanel } from './components/control-panel/UnifiedControlPanel';
export { default as PositionedControlPanel } from './components/control-panel/PositionedControlPanel';
export { PanelSection } from './components/control-panel/types';
export type {
  ControlPanelSection,
  UnifiedPanelConfig,
  UNIFIED_PANEL_PRESETS,
} from './components/control-panel';

// Дополнительные типы
export type { MapData } from './services/mapService';

// Хуки
export { useMap, useMapData, useMapLayers, useDgisMap } from './hooks';

// Сервисы
export { getMapImageUrl, getActiveMap } from './services/mapService';
export { 
  dgisMapProvider, 
  createDgisMapProvider,
  DEFAULT_DGIS_SETTINGS 
} from './services/dgisMapProvider';

export {
  getAllRegions,
  getRegionById,
  createRegion,
  updateRegion,
  deleteRegion,
  getSpecimensInRegion,
  updateSpecimensCount,
  convertPointsToPolygonCoordinates,
  parseCoordinates,
  getDefaultCoordinates,
  getDefaultRegions,
  getSectorRegionMapping,
} from '@/services/regions';

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
  BaseMapContainer,
  DgisTileLayer,
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
