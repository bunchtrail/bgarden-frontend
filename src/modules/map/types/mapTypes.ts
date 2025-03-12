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

// Экспортируем также тип SpecimenData для использования в других модулях
export type { SpecimenData };

export { }; // Типы данных карты и растений 

