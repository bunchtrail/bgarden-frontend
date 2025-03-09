/**
 * Модуль карты для Botanical Garden App
 * Содержит компоненты и сервисы для работы с интерактивной картой сада
 */

// Экспорт компонентов
export { GardenMap } from './components/GardenMap';
export { MapAreas } from './components/MapAreas';
export { MapControls } from './components/MapControls';
export { MapSchemaUploadModal } from './components/MapSchemaUploadModal';
export { MarkerCluster } from './components/MarkerCluster';

// Экспорт хуков
export { useMap } from './hooks/useMap';

// Экспорт всех типов
export * from './types';

// Экспорт сервисов
export * as mapService from './services/mapService';

