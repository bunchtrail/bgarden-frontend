/**
 * Унифицированный модуль для работы с регионами карты
 * Консолидирует все функции и компоненты для работы с регионами
 * в рамках этапа 3 рефакторинга.
 */

// Сначала экспортируем основные сервисы, чтобы их функции переопределили функции из утилит
export * from './RegionService';
export * from './PolygonFactory';

// Теперь экспортируем только уникальные функции из RegionUtils
// для предотвращения конфликтов с уже экспортированными функциями 
export { 
  REGION_COLORS,
  calculatePolygonCenter,
  isPointInPolygon,
  formatCoordinates,
  convertRegionToArea
} from './RegionUtils';

// Экспортируем классы для удобного импорта
export { default as RegionService } from './RegionService';
export { PolygonFactory } from './PolygonFactory';
export { default as RegionUtils } from './RegionUtils';

// Экспортируем основные типы для работы с регионами
// (в будущем можно создать отдельный types.ts файл для всех типов)
export type { RegionDto } from './RegionService';
export type { PolygonOptions, PolygonStyles } from './PolygonFactory'; 