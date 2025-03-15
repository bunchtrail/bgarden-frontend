// Индексный файл модуля карты

// Экспорт контекстов
export { 
  MapProvider, 
  useMapContext, 
  MapMode 
} from './contexts/MapContext';
export { ModalProvider, useModalContext } from './contexts/ModalContext';

// Экспорт компонентов
export { default as MapActions } from './components/MapActions';
export { default as MapControlPanel } from './components/MapControlPanel';
export { default as MapLegend } from './components/MapLegend';

// Экспорт типов
export type { 
  Plant, 
  Area, 
  GeoPosition, 
  ClusteringSettings, 
  CreateAreaParams 
} from './contexts/MapContext';
export type { 
  MapCoordinates, 
  MapEvent, 
  RegionData 
} from './types/mapTypes';

// Экспорт сервисов
export { mapService, plantService, regionService } from './services'; 