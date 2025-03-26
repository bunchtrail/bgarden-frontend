/**
 * Унифицированный модуль для работы с регионами карты
 * Консолидирует все функции и компоненты для работы с регионами
 * 
 * Этап 2: Консолидация базовых утилит и создание единого API для работы с координатами
 * Этап 3: Унификация типов и интерфейсов
 * Этап 4: Переработка `PolygonFactory` (Q2 2025)
 *   - Используются единые утилиты из RegionUtils
 *   - Улучшена обработка ошибок
 *   - Оптимизировано создание полигонов
 *   - Добавлено кэширование для повышения производительности
 */

import RegionService, { 
  RegionDto, 
  createRegion, 
  updateRegion,
  deleteRegion,
  getAllRegions,
  getRegionById,
  getSpecimensInRegion,
  updateSpecimensCount,
  getDefaultRegions,
  getSectorRegionMapping,
  Specimen
} from './RegionService';
import RegionUtils, {
  parseCoordinates,
  getDefaultCoordinates,
  calculatePolygonCenter,
  calculatePolygonArea,
  calculatePolygonPerimeter,
  REGION_COLORS,
  isPointInPolygon,
  isValidPolygon,
  formatCoordinates,
  CoordinateFormat,
  simplifyPolygon,
  convertPointsToPolygonCoordinates,
  convertPointsToWKT,
  parseWKT,
  pointToObject,
  objectToPoint,
  pointsToObjects,
  objectsToPoints,
  tryParseCoordinateString,
  CoordinatePoint,
  CoordinateObject
} from './RegionUtils';

import { PolygonFactory, PolygonOptions, PolygonStyles } from './PolygonFactory';
import {
  RegionBase,
  Area,
  RegionData,
  RegionBridge,
  RegionFilterType,
  Plant
} from './types';

import regionBridge from './RegionBridge';

// Экспортируем все из модуля
export {
  // Сервисы
  RegionService,
  regionBridge,
  RegionUtils,
  PolygonFactory,
  
  // API-функции для работы с регионами на сервере
  createRegion,
  updateRegion,
  deleteRegion,
  getAllRegions,
  getRegionById,
  getSpecimensInRegion,
  updateSpecimensCount,
  getDefaultRegions,
  getSectorRegionMapping,
  
  // Константы и перечисления
  REGION_COLORS,
  CoordinateFormat,
  RegionFilterType,
  
  // Функции для работы с координатами
  parseCoordinates,
  getDefaultCoordinates,
  calculatePolygonCenter,
  calculatePolygonArea,
  calculatePolygonPerimeter,
  isPointInPolygon,
  isValidPolygon,
  formatCoordinates,
  
  // Функции преобразования форматов
  convertPointsToWKT,
  parseWKT,
  pointToObject,
  objectToPoint,
  pointsToObjects,
  objectsToPoints,
  tryParseCoordinateString,
  convertPointsToPolygonCoordinates,
  
  // Оптимизация полигонов
  simplifyPolygon
};

// Экспортируем типы отдельно с использованием 'export type'
export type {
  // Типы регионов
  RegionBase,
  Area, 
  RegionData,
  RegionBridge,
  Plant,
  
  // Типы координат и опций
  RegionDto,
  CoordinatePoint,
  CoordinateObject,
  PolygonOptions,
  PolygonStyles,
  Specimen
}; 