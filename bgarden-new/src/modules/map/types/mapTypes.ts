// Типы данных для работы с картой

// Тип данных для региона (области) карты
export interface RegionData {
  id: number;
  name: string;
  description?: string;
  polygonCoordinates: string; // Координаты в формате JSON строки
  fillColor?: string; // Цвет заливки области
  strokeColor?: string; // Цвет границы области
  fillOpacity?: number; // Прозрачность заливки (0-1)
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