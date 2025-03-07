/**
 * Типы для модуля карты ботанического сада
 */

// Тип для маркера на карте
export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  title: string;
  type: MarkerType;
  description?: string;
  popupContent?: string;
  specimenId?: string;
}

// Типы маркеров
export enum MarkerType {
  PLANT = 'plant',
  EXPOSITION = 'exposition',
  FACILITY = 'facility',
  ENTRANCE = 'entrance',
  OTHER = 'other',
}

// Опции карты
export interface MapOptions {
  center: [number, number]; // Координаты центра [широта, долгота]
  zoom: number;
  minZoom?: number;
  maxZoom?: number;
  maxBounds?: [[number, number], [number, number]]; // [[южная, западная], [северная, восточная]]
}

// Слой карты
export interface MapLayer {
  id: string;
  name: string;
  description?: string;
  url: string; // URL тайлового слоя
  attribution: string;
  isDefault?: boolean;
}

// Область на карте (зона, сектор, экспозиция)
export interface MapArea {
  id: string;
  name: string;
  description?: string;
  coordinates: [number, number][]; // Массив координат для полигона
  color?: string; // Цвет границы
  fillColor?: string; // Цвет заливки
  type: AreaType;
}

// Типы областей
export enum AreaType {
  SECTOR = 'sector',
  EXPOSITION = 'exposition',
  GREENHOUSE = 'greenhouse',
  RESTRICTED = 'restricted',
} 