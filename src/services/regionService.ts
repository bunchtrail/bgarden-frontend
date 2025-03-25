/**
 * @deprecated Этот файл устарел и будет удален в следующих обновлениях.
 * Используйте вместо него унифицированный сервис из src/services/regions
 * import { ... } from '@/services/regions';
 */

import * as RegionService from './regions/RegionService';

// Реэкспортируем все функции для обратной совместимости
export const {
  getAllRegions,
  getRegionById,
  createRegion,
  updateRegion,
  deleteRegion,
  getSpecimensInRegion,
  updateSpecimensCount,
  convertPointsToPolygonCoordinates,
  parseCoordinates,
  getDefaultCoordinates,
  getDefaultRegions,
  convertRegionsToAreas,
  getSectorRegionMapping
} = RegionService;

export default RegionService.default; 