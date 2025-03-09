/**
 * Типы для модуля карты ботанического сада
 */

// Тип для маркера на карте
export interface MapMarker {
  id: number;
  lat: number;
  lng: number;
  title: string;
  type: MarkerType;
  description?: string;
  popupContent?: string;
  specimenId?: number;
  coordinates?: any; // GeoJSON Point
}

// DTO для создания маркера
export interface CreateMapMarkerDto {
  latitude: number;
  longitude: number;
  title: string;
  type: MarkerType;
  description?: string;
  popupContent?: string;
  specimenId?: number;
}

// DTO для обновления маркера
export interface UpdateMapMarkerDto {
  id: number;
  latitude: number;
  longitude: number;
  title: string;
  type: MarkerType;
  description?: string;
  popupContent?: string;
  specimenId?: number;
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
  id?: number;
  center: [number, number]; // Координаты центра [широта, долгота]
  zoom: number;
  minZoom?: number;
  maxZoom?: number;
  maxBounds?: [[number, number], [number, number]]; // [[южная, западная], [северная, восточная]]
  defaultLayerId?: number;
  isDefault?: boolean;
}

// DTO для создания опций карты
export interface CreateMapOptionsDto {
  centerLatitude: number;
  centerLongitude: number;
  zoom: number;
  minZoom?: number;
  maxZoom?: number;
  southBound?: number;
  westBound?: number;
  northBound?: number;
  eastBound?: number;
  defaultLayerId?: number;
  isDefault?: boolean;
}

// DTO для обновления опций карты
export interface UpdateMapOptionsDto {
  id: number;
  centerLatitude: number;
  centerLongitude: number;
  zoom: number;
  minZoom?: number;
  maxZoom?: number;
  southBound?: number;
  westBound?: number;
  northBound?: number;
  eastBound?: number;
  defaultLayerId?: number;
  isDefault?: boolean;
}

// Слой карты
export interface MapLayer {
  id: number;
  name: string;
  description?: string;
  url: string; // URL тайлового слоя
  attribution: string;
  isDefault?: boolean;
}

// DTO для создания слоя карты
export interface CreateMapLayerDto {
  name: string;
  description?: string;
  url: string;
  attribution: string;
  isDefault?: boolean;
}

// DTO для обновления слоя карты
export interface UpdateMapLayerDto {
  id: number;
  name: string;
  description?: string;
  url: string;
  attribution: string;
  isDefault?: boolean;
}

// Область на карте (зона, сектор, экспозиция)
export interface MapArea {
  id: number;
  name: string;
  description?: string;
  coordinates: any; // GeoJSON Polygon
  color?: string; // Цвет границы
  fillColor?: string; // Цвет заливки
  type: AreaType;
}

// DTO для создания области
export interface CreateMapAreaDto {
  name: string;
  description?: string;
  coordinatesGeoJson: string; // строка GeoJSON
  color?: string;
  fillColor?: string;
  type: AreaType;
}

// DTO для обновления области
export interface UpdateMapAreaDto {
  id: number;
  name: string;
  description?: string;
  coordinatesGeoJson: string; // строка GeoJSON
  color?: string;
  fillColor?: string;
  type: AreaType;
}

// Типы областей
export enum AreaType {
  SECTOR = 'sector',
  EXPOSITION = 'exposition',
  GREENHOUSE = 'greenhouse',
  RESTRICTED = 'restricted',
}

// Интерфейс для пользовательской схемы карты
export interface CustomMapSchema {
  id: number;
  name: string;
  description?: string;
  imageUrl: string; // URL изображения схемы
  width: number; // Ширина изображения в пикселях
  height: number; // Высота изображения в пикселях
  bounds: [[number, number], [number, number]]; // Географические границы [[южная, западная], [северная, восточная]]
  isActive: boolean; // Является ли схема активной
  createdAt: string; // Дата создания
}

// DTO для создания пользовательской схемы карты
export interface CreateCustomMapSchemaDto {
  name: string;
  description?: string;
  image: File; // Файл изображения схемы
  bounds: [[number, number], [number, number]]; // Географические границы
}

// DTO для обновления пользовательской схемы карты
export interface UpdateCustomMapSchemaDto {
  id: number;
  name: string;
  description?: string;
  image?: File; // Опциональное обновление изображения
  bounds?: [[number, number], [number, number]]; // Опциональное обновление границ
  isActive?: boolean; // Опциональное обновление активности
} 