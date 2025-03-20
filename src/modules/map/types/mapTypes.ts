// Типы данных для работы с картой
import { ReactNode } from 'react';
import L from 'leaflet';
import { MapData } from '../services/mapService';

// Тип для SectorType (соответствует бэкенду)
export enum SectorType {
  UNDEFINED = 0,
  GREENHOUSE = 1,
  GARDEN = 2,
  ROCKERY = 3,
  AQUATIC = 4,
  OTHER = 5
}

// Тип данных для региона (области) карты
export interface RegionData {
  id: number;
  name: string;
  description?: string;
  latitude: number; // Координаты центра области (широта)
  longitude: number; // Координаты центра области (долгота)
  radius?: number; // Радиус области в метрах (если область приблизительно круглая)
  boundaryWkt?: string; // Многоугольник, описывающий границы области (в формате Well-known text)
  polygonCoordinates: string; // Координаты в формате JSON строки
  strokeColor?: string; // Цвет границы области
  fillColor?: string; // Цвет заливки области
  fillOpacity?: number; // Прозрачность заливки (0-1)
  sectorType: SectorType; // Тип сектора, к которому относится область
  specimensCount: number; // Количество экземпляров растений в регионе
}

// Тип данных для точки на карте
export interface MapPoint {
  x: number;
  y: number;
}

// Типы для фильтров областей
export enum RegionFilterType {
  ALL = 'all',
  WITH_SPECIMENS = 'withSpecimens',
  WITHOUT_SPECIMENS = 'withoutSpecimens',
  CUSTOM = 'custom'
}

// Интерфейс для пользовательских слоёв
export interface CustomMapLayerProps {
  isVisible: boolean;
  config?: Record<string, any>;
}

export interface MapLayerProps extends CustomMapLayerProps {
  layerId: string;
  order: number;
  component: React.ComponentType<CustomMapLayerProps>;
}

// Интерфейс для свойств компонента содержимого карты
export interface MapPageContentProps {
  extraControls?: ReactNode;
  customLayers?: MapLayerProps[];
  plugins?: ReactNode;
  onRegionClick?: (regionId: string) => void;
  controlPanelPosition?: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
  showControls?: boolean;
  onDataLoaded?: (data: { mapData: MapData | null, regions: RegionData[] }) => void;
  onError?: (error: Error) => void;
  onMapReady?: (map: L.Map) => void;
}

// Интерфейс для публичного компонента карты
export interface MapPageProps extends Omit<MapPageContentProps, 'onDataLoaded' | 'onError'> {
  initialConfig?: Record<string, any>;
  onMapReady?: (map: L.Map) => void;
}

// Интерфейс для компонента карточки карты
export interface MapCardProps {
  title: string;
  loading?: boolean;
  children: ReactNode;
}

// Интерфейс для компонента расчета границ изображения
export interface ImageBoundsCalculatorProps {
  mapImageUrl: string | null;
  onBoundsCalculated: (bounds: L.LatLngBoundsExpression) => void;
  isCalculated: boolean;
}

// Интерфейс для контейнера вида карты
export interface MapViewContainerProps {
  mapImageUrl: string | null;
  imageBounds: L.LatLngBoundsExpression;
  regions: RegionData[];
  customLayers?: MapLayerProps[];
  onRegionClick?: (regionId: string) => void;
  onMapReady?: (map: L.Map) => void;
  plugins?: ReactNode;
}

// Интерфейс для контроллера содержимого карты
export interface MapContentControllerProps {
  loading: boolean;
  error: Error | null;
  mapImageUrl: string | null;
  regions: RegionData[];
  imageBounds: L.LatLngBoundsExpression;
  imageBoundsCalculated: boolean;
  setImageBounds: (bounds: L.LatLngBoundsExpression) => void;
  setImageBoundsCalculated: (calculated: boolean) => void;
  refreshMapData: () => void;
  showControls: boolean;
  controlPanelStyles: Record<string, string>;
  toggleControlPanel: () => void;
  showControlPanel: boolean;
  extraControls?: ReactNode;
  customLayers?: MapLayerProps[];
  onRegionClick?: (regionId: string) => void;
  onMapReady?: (map: L.Map) => void;
  plugins?: ReactNode;
} 