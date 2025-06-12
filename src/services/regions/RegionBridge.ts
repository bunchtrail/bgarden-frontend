/**
 * Мост для преобразования между типами Area и RegionData
 * Реализация интерфейса RegionBridge
 * Создано в рамках Этапа 3: Унификация типов и интерфейсов
 */

import { RegionData, Area, RegionBridge } from './types';
import { SectorType } from '@/modules/map/types/mapTypes';
import { MAP_TYPES } from '@/modules/map/contexts/MapConfigContext';
import L from 'leaflet';
import {
  parseCoordinates,
  calculatePolygonCenter,
  convertPointsToPolygonCoordinates,
  convertPointsToWKT,
} from './RegionUtils';

/**
 * Преобразует координаты в зависимости от типа карты для сохранения в БД
 * @param points - массив координат [lat, lng]
 * @param mapType - тип карты
 * @returns преобразованные координаты
 */
export const convertPointsForStorage = (
  points: [number, number][],
  mapType: string
): [number, number][] => {
  if (mapType === MAP_TYPES.GEO) {
    // Для гео-карт сохраняем координаты как есть (lat/lng)
    return points;
  } else {
    // Для схематических карт преобразуем lat/lng в пиксели
    // Используем latLngToPoint, который правильно учитывает Transformation
    const ZOOM = 0; // CRS.Simple всегда z=0
    return points.map(([lat, lng]) => {
      const p = L.CRS.Simple.latLngToPoint(L.latLng(lat, lng), ZOOM);
      return [p.x, p.y]; // Y уже правильный, отрицательный знак не нужен
    });
  }
};

/**
 * Преобразует координаты из БД для отображения на карте
 * @param points - массив координат из БД
 * @param mapType - тип карты
 * @returns координаты для отображения на карте
 */
export const convertPointsForDisplay = (
  points: [number, number][],
  mapType: string
): [number, number][] => {
  if (mapType === MAP_TYPES.GEO) {
    // Для гео-карт координаты уже в правильном формате (lat/lng)
    return points;
  } else {
    // Для схематических карт преобразуем пиксели в lat/lng для отображения
    // Используем pointToLatLng, который правильно учитывает Transformation
    const ZOOM = 0; // CRS.Simple всегда z=0
    return points.map(([x, y]) => {
      const ll = L.CRS.Simple.pointToLatLng(L.point(x, y), ZOOM);
      return [ll.lat, ll.lng];
    });
  }
};

/**
 * Класс-мост для преобразования между типами Area и RegionData
 * Реализует общую логику преобразования для всех мест, где используются эти типы
 */
class RegionBridgeImpl implements RegionBridge {
  /**
   * Преобразует RegionData в Area
   * @param region - данные региона из БД
   * @param mapType - тип карты (опционально, для совместимости)
   */
  toArea(region: RegionData, mapType?: string): Area {
    // Парсим координаты из строки JSON
    const points = parseCoordinates(region.polygonCoordinates);

    // Определяем тип карты: из параметра, из данных региона или по умолчанию схематическая
    const currentMapType = mapType || region.mapType || MAP_TYPES.SCHEMATIC;

    // Преобразуем координаты для отображения на карте
    const displayPoints = convertPointsForDisplay(points, currentMapType);

    return {
      id: `region-${region.id}`,
      name: region.name || 'Неизвестная область',
      points: displayPoints,
      description: region.description || '',
      fillColor: region.fillColor,
      strokeColor: region.strokeColor,
      fillOpacity: region.fillOpacity,
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
      fillOpacity: area.fillOpacity,
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
    throw new Error(
      `Неверный формат ID области: ${areaId}. Ожидается формат "region-XXX"`
    );
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
   * @param regions - массив данных регионов
   * @param mapType - тип карты (опционально)
   */
  regionsToAreas(regions: RegionData[], mapType?: string): Area[] {
    return regions.map((region) => this.toArea(region, mapType));
  }

  /**
   * Преобразует массив Area в массив RegionData (без id и specimensCount)
   */
  areasToRegions(areas: Area[]): Omit<RegionData, 'id' | 'specimensCount'>[] {
    return areas.map((area) => this.toRegionData(area));
  }
}

// Экспортируем единственный экземпляр моста для использования в приложении
const regionBridge = new RegionBridgeImpl();
export default regionBridge;
