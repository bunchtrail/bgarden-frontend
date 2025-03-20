// Главный экспортный файл для модуля карты

// Основной компонент карты
export { default as MapPage } from './components/MapPage';
export { default as LightMapView } from './components/LightMapView';

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

// Компонент панели управления
export { default as MapControlPanel } from './components/control-panel/MapControlPanel';

// Контексты
export { MapProvider, useMapContext } from './contexts/MapContext';
export type { Area, Plant } from './contexts/MapContext';

// Хуки
export { useMapConfig } from './contexts/MapConfigContext';
export { useMap, useMapData, useMapLayers } from './hooks';

// Сервисы
export { getMapImageUrl, getActiveMap } from './services/mapService';
export { getAllRegions, convertRegionsToAreas, parseCoordinates, updateRegion } from './services/regionService';

// Типы
export type { MapData } from './services/mapService';
export type { RegionData } from './types/mapTypes';

// Стили
export { MAP_STYLES } from './styles';

// Контекст и хуки
export { 
  MapConfigProvider,
  MAP_LAYERS,
  MAP_MODES,
  DEFAULT_MAP_CONFIG
} from './contexts/MapConfigContext';

// Компоненты панели управления
export {
  LayerSelector,
  PanelHeader,
  ModeToggle
} from './components/control-panel';
export type { ControlPanelSection } from './components/control-panel';

// Компоненты для управления слоями
export { default as MapLayersManager } from './components/map-layers/MapLayersManager';

// Компоненты для отображения содержимого карты
export { default as MapContentStateRenderer } from './components/map-content/MapContentStateRenderer';
export { default as MapControlsRenderer } from './components/map-controls/MapControlsRenderer';

// Компоненты информации о растениях
export { EnhancedPlantMarkersLayer } from './components/plant-info'; 