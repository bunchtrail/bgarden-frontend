// Типы данных для работы с картой

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