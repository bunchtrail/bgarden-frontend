// Форма добавления растения 

import { SpecimenData } from '../services/plantService';

// Типы для карты

// Координаты на карте
export interface MapCoordinates {
  lat: number;
  lng: number;
}

// Тип для событий карты
export interface MapEvent {
  type: string;
  payload: any;
}

// Интерфейс для данных области с API
export interface RegionData {
  id: number;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  radius: number | null;
  boundaryWkt: string;
  polygonCoordinates: string;
  strokeColor: string;
  fillColor: string;
  fillOpacity: number;
  sectorType: number;
  specimensCount: number;
}

// Экспортируем также тип SpecimenData для использования в других модулях
export type { SpecimenData };

    export { }; // Типы данных карты и растений 

