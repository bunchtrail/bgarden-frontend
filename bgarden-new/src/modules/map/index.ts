// Главный экспортный файл для модуля карты

// Компоненты карты
export { default as MapPage } from './components/MapPage';
export { default as LightMapView } from './components/LightMapView';

// Контексты
export { MapProvider, useMapContext } from './contexts/MapContext';
export type { Area, Plant } from './contexts/MapContext';

// Хуки
export * from './hooks';

// Сервисы
export { getMapImageUrl, getActiveMap } from './services/mapService';
export { getAllRegions, convertRegionsToAreas, parseCoordinates } from './services/regionService';

// Типы
export type { MapData } from './services/mapService';
export type { RegionData } from './types/mapTypes';

// Стили
export { MAP_STYLES } from './styles';

// Контекст и хуки
export { useMapConfig, MapConfigProvider } from './context/MapConfigContext';
export type { MapConfig } from './context/MapConfigContext';
export { useMap } from './hooks'; 