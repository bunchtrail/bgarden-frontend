// Главный экспортный файл для модуля карты

// Основной компонент карты
export { default as MapPage } from './components/MapPage';
export { default as LightMapView } from './components/LightMapView';

// Map Components
export {
  MapControlPanel,
  MapRegionsLayer,
  MapImageLayer,
  MapBoundsHandler,
  ErrorView,
  EmptyMapView,
  LoadingView,
  MapReadyHandler
} from './components/map-components';

// Контексты
export { MapProvider, useMapContext } from './contexts/MapContext';
export type { Area, Plant } from './contexts/MapContext';

// Хуки
export { useMapConfig } from './contexts/MapConfigContext';
export { useMap, useMapData, useMapLayers } from './hooks';

// Сервисы
export { getMapImageUrl, getActiveMap } from './services/mapService';
export { getAllRegions, convertRegionsToAreas, parseCoordinates } from './services/regionService';

// Типы
export type { MapData } from './services/mapService';
export type { RegionData } from './types/mapTypes';

// Стили
export { MAP_STYLES } from './styles';

// Контекст и хуки
export { MapConfigProvider } from './contexts/MapConfigContext';

// Компоненты панели управления
export {
  LayerSelector,
  ModeToggle,
  ConfigCheckbox,
  PanelHeader
} from './components/control-panel';
export type { MapLayerConfig, ControlPanelSection } from './components/control-panel'; 