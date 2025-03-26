/**
 * Мост для преобразования между типами Area и RegionData
 * Реализация интерфейса RegionBridge
 * Создано в рамках Этапа 3: Унификация типов и интерфейсов
 */

import { RegionData, Area, RegionBridge } from './types';
import { SectorType } from '@/modules/map/types/mapTypes';
import { 
  parseCoordinates, 
  calculatePolygonCenter, 
  convertPointsToPolygonCoordinates, 
  convertPointsToWKT 
} from './RegionUtils';

/**
 * Класс-мост для преобразования между типами Area и RegionData
 * Реализует общую логику преобразования для всех мест, где используются эти типы
 */
class RegionBridgeImpl implements RegionBridge {
  /**
   * Преобразует RegionData в Area
   */
  toArea(region: RegionData): Area {
    // Парсим координаты из строки JSON
    const points = parseCoordinates(region.polygonCoordinates);
    
    return {
      id: `region-${region.id}`,
      name: region.name || 'Неизвестная область',
      points,
      description: region.description || '',
      fillColor: region.fillColor,
      strokeColor: region.strokeColor,
      fillOpacity: region.fillOpacity
    };
  }

  /**
   * Преобразует Area в объект RegionData для API
   */
  toRegionData(area: Area): Omit<RegionData, 'id' | 'specimensCount'> {
    const [latitude, longitude] = calculatePolygonCenter(area.points);
    
    return {
      name: area.name,
      description: area.description || '',
      polygonCoordinates: convertPointsToPolygonCoordinates(area.points),
      latitude,
      longitude,
      radius: 0,
      boundaryWkt: convertPointsToWKT(area.points),
      sectorType: SectorType.UNDEFINED,
      fillColor: area.fillColor,
      strokeColor: area.strokeColor,
      fillOpacity: area.fillOpacity
    };
  }

  /**
   * Преобразует ID области в ID региона
   * @param areaId - ID области в формате "region-123"
   * @returns число, например 123
   */
  areaIdToRegionId(areaId: string): number {
    // Проверяем, что ID имеет формат "region-XXX"
    if (typeof areaId === 'string' && areaId.startsWith('region-')) {
      const regionId = parseInt(areaId.replace('region-', ''), 10);
      if (!isNaN(regionId)) {
        return regionId;
      }
    }
    throw new Error(`Неверный формат ID области: ${areaId}. Ожидается формат "region-XXX"`);
  }

  /**
   * Преобразует ID региона в ID области
   * @param regionId - ID региона (число или строка)
   * @returns строка в формате "region-XXX"
   */
  regionIdToAreaId(regionId: number | string): string {
    return `region-${regionId}`;
  }

  /**
   * Преобразует массив RegionData в массив Area
   */
  regionsToAreas(regions: RegionData[]): Area[] {
    return regions.map(region => this.toArea(region));
  }

  /**
   * Преобразует массив Area в массив RegionData (без id и specimensCount)
   */
  areasToRegions(areas: Area[]): Omit<RegionData, 'id' | 'specimensCount'>[] {
    return areas.map(area => this.toRegionData(area));
  }
}

// Экспортируем единственный экземпляр моста для использования в приложении
const regionBridge = new RegionBridgeImpl();
export default regionBridge; 