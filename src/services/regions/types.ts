/**
 * Унифицированные типы для работы с областями карты 
 * Создано в рамках Этапа 3: Унификация типов и интерфейсов
 */

import { SectorType } from '@/modules/map/types/mapTypes';

/**
 * Базовый интерфейс для областей карты
 * Содержит общие поля для всех типов областей
 */
export interface RegionBase {
  id: string | number;
  name: string;
  description?: string;
  // визуальные характеристики
  strokeColor?: string;
  fillColor?: string;
  fillOpacity?: number;
}

/**
 * Тип координатной точки в формате [lat, lng]
 */
export type CoordinatePoint = [number, number];

/**
 * Расширенный интерфейс для внутреннего использования (в компонентах)
 */
export interface Area extends RegionBase {
  id: string; // формат "region-123"
  points: CoordinatePoint[]; // массив координат полигона
  selected?: boolean; // флаг выбора области на карте
}

/**
 * Интерфейс для взаимодействия с API
 */
export interface RegionData extends RegionBase {
  id: number;
  polygonCoordinates: string; // JSON строка с координатами
  latitude: number; // широта центра области
  longitude: number; // долгота центра области
  radius: number; // радиус области (для круговых областей)
  boundaryWkt: string; // координаты в формате WKT
  sectorType: SectorType; // тип сектора области
  specimensCount: number; // количество образцов в области
}

/**
 * Интерфейс для моста между Area и RegionData
 * Используется для преобразования между типами
 */
export interface RegionBridge {
  /**
   * Преобразует RegionData в Area
   */
  toArea(region: RegionData): Area;

  /**
   * Преобразует Area в RegionData (с опциональным опущением некоторых полей)
   */
  toRegionData(area: Area): Omit<RegionData, 'id' | 'specimensCount'>;

  /**
   * Преобразует ID области в ID региона и наоборот
   */
  areaIdToRegionId(areaId: string): number;
  regionIdToAreaId(regionId: number | string): string;
}

/**
 * Тип для фильтрации областей карты
 */
export enum RegionFilterType {
  ALL = 'all',
  WITH_SPECIMENS = 'withSpecimens',
  WITHOUT_SPECIMENS = 'withoutSpecimens',
  CUSTOM = 'custom'
}

/**
 * Тип для растения на карте
 */
export interface Plant {
  id: string;
  name: string;
  latinName?: string;
  description?: string;
  /**
   * Текущие координаты, используемые слоем маркеров
   * В зависимости от выбранного типа карты это либо map, либо гео координаты
   */
  position: CoordinatePoint;
  /** Координаты на схематической карте, если доступны */
  mapCoordinates?: CoordinatePoint;
  /** Географические координаты в формате [lat, lng], если доступны */
  geoCoordinates?: CoordinatePoint;
}
