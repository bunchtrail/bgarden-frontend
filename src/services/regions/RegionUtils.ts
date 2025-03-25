/**
 * Унифицированные утилитарные функции для работы с регионами, областями и координатами
 * Переносим из src/utils/regionUtils.ts в рамках рефакторинга для устранения дублирования
 */

import { logError, logWarning } from '@/utils/logger';
import { RegionData, SectorType } from '@/modules/map/types/mapTypes';
import { Area } from '@/modules/map/contexts/MapContext';

/**
 * Стандартизированные цвета для регионов
 */
export const REGION_COLORS = {
  DEFAULT: {
    STROKE: '#4B5563',
    FILL: '#9CA3AF',
    OPACITY: 0.3
  },
  SELECTED: {
    STROKE: '#2563EB',
    FILL: '#3B82F6',
    OPACITY: 0.4
  },
  HOVER: {
    STROKE: '#1E40AF',
    FILL: '#3B82F6',
    OPACITY: 0.5
  }
};

/**
 * Преобразование координат из строки в массив [lat, lng]
 */
export const parseCoordinates = (coordsString: string | null | undefined): [number, number][] => {
  if (!coordsString) {
    logWarning(`Координаты отсутствуют (${coordsString}). Используем координаты по умолчанию.`);
    return getDefaultCoordinates();
  }

  // Проверка, не пытаемся ли мы распарсить буквальную строку "string"
  if (coordsString === "string") {
    logWarning(`Получено буквальное значение "string" вместо координат. Используем координаты по умолчанию.`);
    return getDefaultCoordinates();
  }

  try {
    const coordsArray = JSON.parse(coordsString);
    
    // Проверка валидности массива координат - минимум 3 точки для полигона
    if (!coordsArray || !Array.isArray(coordsArray) || coordsArray.length < 3) {
      logWarning('Массив координат пуст или содержит менее 3 точек');
      return getDefaultCoordinates();
    }
    
    return coordsArray.map((coord: [number, number]) => [coord[0], coord[1]]);
  } catch (error) {
    // Если это не JSON, пробуем другие варианты парсинга
    if (typeof coordsString === 'string' && coordsString.includes(',')) {
      logWarning('Строка координат не в формате JSON: ' + coordsString);
      // Дополнительная логика для других форматов
    }
    
    logError('Ошибка при разборе координат', error);
    return getDefaultCoordinates();
  }
};

/**
 * Функция для получения координат по умолчанию
 */
export const getDefaultCoordinates = (): [number, number][] => {
  return [
    [100, 100],
    [100, 300],
    [300, 300],
    [300, 100]
  ];
};

/**
 * Преобразование точек области в строку JSON для API
 */
export const convertPointsToPolygonCoordinates = (points: [number, number][]): string => {
  return JSON.stringify(points);
};

/**
 * Вычисляет центр полигона по его точкам
 */
export const calculatePolygonCenter = (points: [number, number][]): [number, number] => {
  if (!points || points.length === 0) return [0, 0];
  
  const totalPoints = points.length;
  let sumLat = 0;
  let sumLng = 0;
  
  points.forEach(point => {
    sumLat += point[0];
    sumLng += point[1];
  });
  
  return [
    parseFloat((sumLat / totalPoints).toFixed(6)),
    parseFloat((sumLng / totalPoints).toFixed(6))
  ];
};

/**
 * Преобразует RegionData в объект Area для отображения на карте
 */
export const convertRegionToArea = (region: RegionData): Area => {
  // Парсим координаты из строки JSON
  const points = parseCoordinates(region.polygonCoordinates);
  
  return {
    id: `region-${region.id}`,
    name: region.name || 'Неизвестная область',
    points: points,
    description: region.description || '',
    fillColor: region.fillColor,
    strokeColor: region.strokeColor,
    fillOpacity: region.fillOpacity
  };
};

/**
 * Преобразует массив RegionData в массив Area
 */
export const convertRegionsToAreas = (regions: RegionData[]): Area[] => {
  return regions.map(convertRegionToArea);
};

/**
 * Проверяет, является ли координата внутри полигона
 */
export const isPointInPolygon = (point: [number, number], polygon: [number, number][]): boolean => {
  // Алгоритм "Ray casting" для определения точки внутри полигона
  const x = point[0];
  const y = point[1];
  
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0];
    const yi = polygon[i][1];
    const xj = polygon[j][0];
    const yj = polygon[j][1];
    
    const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  
  return inside;
};

/**
 * Форматирует координаты для отображения на UI
 */
export const formatCoordinates = (coords: [number, number]): string => {
  return `${coords[0].toFixed(6)}, ${coords[1].toFixed(6)}`;
};

export default {
  parseCoordinates,
  getDefaultCoordinates,
  convertPointsToPolygonCoordinates,
  calculatePolygonCenter,
  convertRegionToArea,
  convertRegionsToAreas,
  isPointInPolygon,
  formatCoordinates,
  REGION_COLORS
}; 