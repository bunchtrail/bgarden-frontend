/**
 * Унифицированный сервис для работы с регионами карты
 * Консолидированная версия, объединяющая функциональность из:
 * - src/services/regionService.ts
 * - src/services/regions/RegionService.ts
 * - src/modules/map/services/regionService.ts
 */

import httpClient from '@/services/httpClient';
import { logError, logWarning } from '@/utils/logger';
import { RegionData, SectorType } from '@/modules/map/types/mapTypes';
import { Area } from './types';
import { Specimen as FullSpecimen } from '@/modules/specimens/types';

// Упрощенный интерфейс для образца растения (для специализированных запросов)
export interface Specimen {
  id: number;
  name: string;
  latinName?: string;
  // другие поля добавляются по мере необходимости
}

// Интерфейс для объекта данных региона (используется для DTO)
export interface RegionDto {
  id: number;
  name: string;
  description?: string;
  climate?: string;
}

/**
 * Получение всех регионов
 */
export const getAllRegions = async (): Promise<RegionData[]> => {
  try {
    const regions = await httpClient.get<RegionData[]>('Region', {
      suppressErrorsForStatus: [404] // Подавляем ошибки 404 и получаем пустой массив
    });
    
    // Если API вернул пустой список, используем временные данные
    if (!regions || regions.length === 0) {
      logWarning('API вернул пустой список регионов, используем временные данные');
      return getDefaultRegions();
    }
    
    return regions;
  } catch (error) {
    logError('Ошибка при получении областей:', error);
    // В случае ошибки возвращаем временные данные
    return getDefaultRegions();
  }
};

/**
 * Получение региона по ID
 */
export const getRegionById = async (id: number): Promise<RegionData> => {
  try {
    return await httpClient.get<RegionData>(`Region/${id}`);
  } catch (error) {
    logError(`Ошибка при получении региона с ID ${id}:`, error);
    throw error;
  }
};

/**
 * Создание нового региона
 */
export const createRegion = async (regionData: Omit<RegionData, 'id' | 'specimensCount'>): Promise<RegionData> => {
  try {
    // Проверяем и обрабатываем координаты
    let processedData = { ...regionData };
    
    // Проверка, если polygonCoordinates передан как строка
    if (typeof processedData.polygonCoordinates !== 'string') {
      processedData.polygonCoordinates = JSON.stringify(processedData.polygonCoordinates);
    }
    
    // Формируем объект для отправки на сервер
    const newRegion = {
      id: 0, // API заменит на следующий доступный ID
      ...processedData,
      specimensCount: 0 // Начальное количество экземпляров
    };
    return await httpClient.post<RegionData>('/Region', newRegion);
  } catch (error) {
    logError('Ошибка при создании области:', error);
    throw error;
  }
};

/**
 * Обновление существующего региона
 */
export const updateRegion = async (regionId: string | number, regionData: Omit<RegionData, 'id' | 'specimensCount'>): Promise<RegionData> => {
  try {
    // Преобразуем ID в строку, если это необходимо
    const id = typeof regionId === 'string' ? regionId : String(regionId);
    const numericId = typeof regionId === 'string' ? parseInt(regionId) : regionId;
    
    // Проверяем и обрабатываем координаты
    let processedData = { ...regionData };
    
    // Проверка, если polygonCoordinates передан как строка
    if (typeof processedData.polygonCoordinates !== 'string') {
      processedData.polygonCoordinates = JSON.stringify(processedData.polygonCoordinates);
    }
    
    // Формируем объект для отправки на сервер (включаем ID для обновления)
    const updatedRegion = {
      id: numericId,
      ...processedData,
    };
    return await httpClient.put<RegionData>(`/Region/${id}`, updatedRegion);
  } catch (error) {
    logError('Ошибка при обновлении области:', error);
    throw error;
  }
};

/**
 * Удаление региона
 */
export const deleteRegion = async (id: number): Promise<boolean> => {
  try {
    await httpClient.delete(`Region/${id}`);
    return true;
  } catch (error) {
    logError(`Ошибка при удалении региона ${id}:`, error);
    throw error;
  }
};

/**
 * Получение списка экземпляров растений в регионе
 */
export const getSpecimensInRegion = async (regionId: number): Promise<Specimen[]> => {
  try {
    return await httpClient.get<Specimen[]>(`Region/${regionId}/specimens`);
  } catch (error) {
    logError(`Ошибка при получении образцов из региона ${regionId}:`, error);
    return [];
  }
};

/**
 * Обновление количества образцов в области
 */
export const updateSpecimensCount = async (regionId: number, increment: boolean = true): Promise<void> => {
  try {
    const endpoint = increment ? 
      `/Region/${regionId}/increment-specimens` : 
      `/Region/${regionId}/decrement-specimens`;
    
    await httpClient.put(endpoint);
  } catch (error) {
    logError('Ошибка при обновлении количества образцов в области:', error);
    throw error;
  }
};

/**
 * Преобразование точек области в строку JSON для API
 */
export const convertPointsToPolygonCoordinates = (points: [number, number][]): string => {
  return JSON.stringify(points);
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
 * Функция для получения дефолтных регионов
 */
export const getDefaultRegions = (): RegionData[] => {
  const defaultRegions = [
    { 
      id: 1, 
      name: "Европа", 
      description: "Европейская часть",
      polygonCoordinates: JSON.stringify(getDefaultCoordinates()),
      strokeColor: '#4B5563',
      fillColor: '#9CA3AF',
      fillOpacity: 0.3,
      latitude: 200,
      longitude: 200,
      radius: 0,
      boundaryWkt: '',
      sectorType: SectorType.UNDEFINED,
      specimensCount: 0
    },
    { 
      id: 2, 
      name: "Азия", 
      description: "Азиатская часть",
      polygonCoordinates: JSON.stringify(getDefaultCoordinates().map(coord => [coord[0] + 300, coord[1]])),
      strokeColor: '#4B5563',
      fillColor: '#9CA3AF',
      fillOpacity: 0.3,
      latitude: 200,
      longitude: 500,
      radius: 0,
      boundaryWkt: '',
      sectorType: SectorType.UNDEFINED,
      specimensCount: 0
    }
  ];
  
  logWarning('Возвращаю дефолтные регионы');
  return defaultRegions;
};

/**
 * Функция для сопоставления секторов с регионами
 */
export const getSectorRegionMapping = (sectorData: any[]): Record<number, RegionData> => {
  const mapping: Record<number, RegionData> = {};
  
  sectorData.forEach(sector => {
    if (sector.regionId) {
      // Для использования в качестве ключа в маппинге
      mapping[sector.id] = {
        id: sector.regionId,
        name: sector.name || 'Неизвестный сектор',
        description: sector.description || '',
        polygonCoordinates: sector.polygonCoordinates || JSON.stringify(getDefaultCoordinates()),
        strokeColor: sector.strokeColor || '#4B5563',
        fillColor: sector.fillColor || '#9CA3AF',
        fillOpacity: sector.fillOpacity || 0.3,
        latitude: sector.latitude || 0,
        longitude: sector.longitude || 0,
        radius: sector.radius || 0,
        boundaryWkt: sector.boundaryWkt || '',
        sectorType: sector.sectorType || SectorType.UNDEFINED,
        specimensCount: sector.specimensCount || 0
      };
    }
  });
  
  return mapping;
};

// Объект для обратной совместимости с импортами по умолчанию
const RegionService = {
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
  getSectorRegionMapping
};

export default RegionService; 