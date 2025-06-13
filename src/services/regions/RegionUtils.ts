/**
 * Унифицированные утилитарные функции для работы с регионами, областями и координатами
 * Переносим из src/utils/regionUtils.ts в рамках рефакторинга для устранения дублирования
 * 
 * Этап 2: Консолидация базовых утилит (Q2 2025)
 * - Все утилитарные функции перенесены в RegionUtils.ts
 * - Стандартизированы форматы и обработка координат
 * - Создано единое API для работы с координатами
 */

import { logError, logWarning } from '@/utils/logger';
import { RegionData, SectorType } from '@/modules/map/types/mapTypes';
import { Area } from './types';

/**
 * Типы координат, поддерживаемые в системе
 */
export enum CoordinateFormat {
  /** Массив [lat, lng] */
  ARRAY = 'array',
  /** Объект {lat, lng} */
  OBJECT = 'object',
  /** Строка "lat,lng" */
  STRING = 'string',
  /** JSON-строка массива точек */
  JSON = 'json',
  /** WKT (Well-Known Text) формат */
  WKT = 'wkt'
}

/**
 * Тип координаты как массив [lat, lng]
 */
export type CoordinatePoint = [number, number];

/**
 * Тип координаты как объект {lat, lng}
 */
export interface CoordinateObject {
  lat: number;
  lng: number;
}

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
export const parseCoordinates = (coordsString: string | null | undefined): CoordinatePoint[] => {
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
    
    return coordsArray.map((coord: CoordinatePoint) => [coord[0], coord[1]]);
  } catch (error) {
    // Если это не JSON, пробуем другие варианты парсинга
    if (typeof coordsString === 'string' && coordsString.includes(',')) {
      logWarning('Строка координат не в формате JSON: ' + coordsString);
      return tryParseCoordinateString(coordsString);
    }
    
    logError('Ошибка при разборе координат', 'regions', undefined, error);
    return getDefaultCoordinates();
  }
};

/**
 * Пытается разобрать строку с координатами в различных форматах
 * @param coordString Строка с координатами
 * @returns Массив точек координат
 */
export const tryParseCoordinateString = (coordString: string): CoordinatePoint[] => {
  // Попытка разбора WKT формата (POLYGON, LINESTRING и т.д.)
  if (coordString.toUpperCase().includes('POLYGON')) {
    return parseWKT(coordString);
  }
  
  // Попытка разбора строки вида "lat1,lng1;lat2,lng2;..."
  if (coordString.includes(';')) {
    return coordString
      .split(';')
      .map(pair => pair.split(',').map(Number))
      .filter(point => point.length === 2 && !isNaN(point[0]) && !isNaN(point[1])) as CoordinatePoint[];
  }
  
  // Попытка разбора строки для одной точки "lat,lng"
  if (coordString.includes(',')) {
    const parts = coordString.split(',').map(Number);
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      return [parts as CoordinatePoint];
    }
  }
  
  // Если ничего не подошло, возвращаем координаты по умолчанию
  logWarning(`Не удалось распознать формат координат: ${coordString}`);
  return getDefaultCoordinates();
};

/**
 * Преобразует WKT формат в массив координат
 * @param wktString Строка в формате WKT
 * @returns Массив точек координат
 */
export const parseWKT = (wktString: string): CoordinatePoint[] => {
  try {
    // Простой парсер для POLYGON формата
    // Пример: "POLYGON((30 10, 40 40, 20 40, 10 20, 30 10))"
    const coordinatesMatch = wktString.match(/\(\((.*?)\)\)/);
    if (coordinatesMatch && coordinatesMatch[1]) {
      return coordinatesMatch[1]
        .split(',')
        .map(pair => {
          const [lng, lat] = pair.trim().split(' ').map(Number);
          return [lat, lng] as CoordinatePoint;
        });
    }
    
    logWarning(`Не удалось распознать WKT формат: ${wktString}`);
    return getDefaultCoordinates();
  } catch (error) {
    logError('Ошибка при разборе WKT', 'regions', undefined, error);
    return getDefaultCoordinates();
  }
};

/**
 * Функция для получения координат по умолчанию
 */
export const getDefaultCoordinates = (): CoordinatePoint[] => {
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
export const convertPointsToPolygonCoordinates = (points: CoordinatePoint[]): string => {
  return JSON.stringify(points);
};

/**
 * Преобразует массив координат в WKT формат
 * @param points Массив точек координат [lat, lng]
 * @returns Строка в формате WKT
 */
export const convertPointsToWKT = (points: CoordinatePoint[]): string => {
  if (!points || points.length < 3) {
    return 'POLYGON EMPTY';
  }
  
  // Добавляем первую точку в конец для замыкания полигона
  const closedPoints = [...points];
  if (points[0][0] !== points[points.length - 1][0] || 
      points[0][1] !== points[points.length - 1][1]) {
    closedPoints.push(points[0]);
  }
  
  const wktCoordinates = closedPoints
    .map(point => `${point[1]} ${point[0]}`)
    .join(',');
    
  return `POLYGON((${wktCoordinates}))`;
};

/**
 * Вычисляет центр полигона по его точкам
 */
export const calculatePolygonCenter = (points: CoordinatePoint[]): CoordinatePoint => {
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
 * Преобразует CoordinatePoint в CoordinateObject
 */
export const pointToObject = (point: CoordinatePoint): CoordinateObject => {
  return { lat: point[0], lng: point[1] };
};

/**
 * Преобразует CoordinateObject в CoordinatePoint
 */
export const objectToPoint = (object: CoordinateObject): CoordinatePoint => {
  return [object.lat, object.lng];
};

/**
 * Преобразует массив точек в массив объектов {lat, lng}
 */
export const pointsToObjects = (points: CoordinatePoint[]): CoordinateObject[] => {
  return points.map(pointToObject);
};

/**
 * Преобразует массив объектов {lat, lng} в массив точек
 */
export const objectsToPoints = (objects: CoordinateObject[]): CoordinatePoint[] => {
  return objects.map(objectToPoint);
};

/**
 * Преобразует RegionData в объект Area для отображения на карте
 * @deprecated Используйте regionBridge.toArea из RegionBridge вместо этой функции
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
 * Преобразует Area в объект RegionData для API
 * @deprecated Используйте regionBridge.toRegionData из RegionBridge вместо этой функции
 */
export const convertAreaToRegion = (area: Area): Omit<RegionData, 'id' | 'specimensCount'> => {
  const [latitude, longitude] = calculatePolygonCenter(area.points);
  const id = typeof area.id === 'string' && area.id.startsWith('region-')
    ? parseInt(area.id.replace('region-', ''), 10)
    : undefined;
    
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
};

/**
 * Преобразует массив RegionData в массив Area
 * @deprecated Используйте regionBridge.regionsToAreas из RegionBridge вместо этой функции
 */
export const convertRegionsToAreas = (regions: RegionData[]): Area[] => {
  return regions.map(convertRegionToArea);
};

/**
 * Проверяет, является ли координата внутри полигона
 */
export const isPointInPolygon = (point: CoordinatePoint, polygon: CoordinatePoint[]): boolean => {
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
export const formatCoordinates = (coords: CoordinatePoint): string => {
  return `${coords[0].toFixed(6)}, ${coords[1].toFixed(6)}`;
};

/**
 * Вычисляет площадь полигона в условных единицах
 */
export const calculatePolygonArea = (points: CoordinatePoint[]): number => {
  if (points.length < 3) return 0;
  
  let area = 0;
  for (let i = 0; i < points.length; i++) {
    const j = (i + 1) % points.length;
    area += points[i][0] * points[j][1];
    area -= points[j][0] * points[i][1];
  }
  
  return Math.abs(area / 2);
};

/**
 * Вычисляет периметр полигона
 */
export const calculatePolygonPerimeter = (points: CoordinatePoint[]): number => {
  if (points.length < 2) return 0;
  
  let perimeter = 0;
  for (let i = 0; i < points.length; i++) {
    const j = (i + 1) % points.length;
    const dx = points[j][0] - points[i][0];
    const dy = points[j][1] - points[i][1];
    perimeter += Math.sqrt(dx * dx + dy * dy);
  }
  
  return perimeter;
};

/**
 * Проверяет валидность полигона (минимум 3 точки)
 */
export const isValidPolygon = (points: CoordinatePoint[]): boolean => {
  return Array.isArray(points) && points.length >= 3;
};

/**
 * Упрощает полигон, удаляя лишние точки
 * @param points Массив точек координат
 * @param tolerance Допустимое отклонение (чем меньше, тем точнее аппроксимация)
 * @returns Упрощенный массив точек
 */
export const simplifyPolygon = (points: CoordinatePoint[], tolerance: number = 0.00001): CoordinatePoint[] => {
  if (points.length <= 3) return [...points];
  
  // Простая реализация алгоритма Дугласа-Пекера
  const findFurthestPoint = (start: CoordinatePoint, end: CoordinatePoint, points: CoordinatePoint[]): { index: number, distance: number } => {
    let maxDistance = 0;
    let index = 0;
    
    for (let i = 1; i < points.length - 1; i++) {
      const distance = perpendicularDistance(start, end, points[i]);
      if (distance > maxDistance) {
        maxDistance = distance;
        index = i;
      }
    }
    
    return { index, distance: maxDistance };
  };
  
  // Вычисление перпендикулярного расстояния от точки до линии
  const perpendicularDistance = (start: CoordinatePoint, end: CoordinatePoint, point: CoordinatePoint): number => {
    // Базовая формула расстояния от точки до прямой
    const [x, y] = point;
    const [x1, y1] = start;
    const [x2, y2] = end;
    
    const numerator = Math.abs((y2-y1)*x - (x2-x1)*y + x2*y1 - y2*x1);
    const denominator = Math.sqrt(Math.pow(y2-y1, 2) + Math.pow(x2-x1, 2));
    
    return numerator / denominator;
  };
  
  // Рекурсивная функция упрощения
  const simplifyRecursive = (points: CoordinatePoint[], tolerance: number): CoordinatePoint[] => {
    if (points.length <= 2) return points;
    
    const start = points[0];
    const end = points[points.length - 1];
    const { index, distance } = findFurthestPoint(start, end, points);
    
    if (distance > tolerance) {
      // Разделяем на два сегмента и упрощаем каждый
      const firstPart = simplifyRecursive(points.slice(0, index + 1), tolerance);
      const secondPart = simplifyRecursive(points.slice(index), tolerance);
      
      // Объединяем результаты, исключая дублирование точки соединения
      return [...firstPart.slice(0, -1), ...secondPart];
    } else {
      // Если все точки достаточно близки к прямой, возвращаем только начало и конец
      return [start, end];
    }
  };
  
  // Гарантируем, что первая и последняя точки сохранятся
  return simplifyRecursive(points, tolerance);
};

export default {
  parseCoordinates,
  getDefaultCoordinates,
  convertPointsToPolygonCoordinates,
  convertPointsToWKT,
  calculatePolygonCenter,
  calculatePolygonArea,
  calculatePolygonPerimeter,
  isPointInPolygon,
  isValidPolygon,
  formatCoordinates,
  pointToObject,
  objectToPoint,
  pointsToObjects,
  objectsToPoints,
  parseWKT,
  tryParseCoordinateString,
  simplifyPolygon,
  REGION_COLORS
}; 