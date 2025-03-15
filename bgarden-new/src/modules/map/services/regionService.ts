// Сервис для работы с областями (регионами) на карте

import { Area } from '../contexts/MapContext';
import { RegionData } from '../types/mapTypes';
import httpClient from '../../../services/httpClient';

// Функция для получения всех областей (регионов) с сервера
export const getAllRegions = async (): Promise<RegionData[]> => {
  try {
    return await httpClient.get<RegionData[]>('/Region');
  } catch (error) {
    console.error('Ошибка при получении областей:', error);
    throw error;
  }
};

// Функция для создания новой области (региона) на сервере
export const createRegion = async (regionData: Omit<RegionData, 'id' | 'specimensCount'>): Promise<RegionData> => {
  try {
    const newRegion = {
      id: 0, // API заменит на следующий доступный ID
      ...regionData,
      specimensCount: 0 // Начальное количество экземпляров
    };
    
    return await httpClient.post<RegionData>('/Region', newRegion);
  } catch (error) {
    console.error('Ошибка при создании области:', error);
    throw error;
  }
};

// Функция для преобразования координат из строки в массив точек
const parsePolygonCoordinates = (coordsString: string): [number, number][] => {
  try {
    // Добавляем проверку на null или undefined
    if (!coordsString) {
      console.warn(`Координаты отсутствуют (${coordsString}). Используем координаты по умолчанию.`);
      return getDefaultCoordinates();
    }
    
    // Если coordsString уже является массивом, просто используем его
    if (Array.isArray(coordsString)) {
      return coordsString.map((coord: [number, number]) => [coord[0], coord[1]]);
    }
    
    // Проверяем, что строка имеет значение 'string' (ошибка тестовых данных)
    if (coordsString === 'string') {
      console.warn(`Получено буквальное значение "string" вместо координат. Используем координаты по умолчанию.`);
      return getDefaultCoordinates();
    }
    
    // Проверяем, что строка начинается с '[' для JSON
    if (typeof coordsString === 'string' && coordsString.trim().startsWith('[')) {
      // Преобразуем строку в объект JavaScript
      const coordsArray = JSON.parse(coordsString);
      // Проверяем, что массив не пуст
      if (!coordsArray || coordsArray.length < 3) {
        console.warn('Массив координат пуст или содержит менее 3 точек');
        return getDefaultCoordinates();
      }
      // Преобразуем координаты в формат [x, y]
      return coordsArray.map((coord: [number, number]) => [coord[0], coord[1]]);
    } else {
      // Если формат не JSON, возможно, это строка в другом формате
      console.warn('Строка координат не в формате JSON:', coordsString);
      return getDefaultCoordinates();
    }
  } catch (error) {
    console.error('Ошибка при разборе координат:', error);
    return getDefaultCoordinates();
  }
};

// Функция для получения координат по умолчанию (выделена для повторного использования)
const getDefaultCoordinates = (): [number, number][] => {
  return [
    [100, 100],
    [100, 300],
    [300, 300],
    [300, 100]
  ];
};

// Функция для преобразования данных с сервера в формат Area
export const convertRegionsToAreas = (regions: RegionData[]): Area[] => {
  return regions.map(region => {
    // Парсим координаты из строки JSON
    const points = parsePolygonCoordinates(region.polygonCoordinates);
    
    return {
      id: `region-${region.id}`,
      name: region.name || 'Неизвестная область',
      points: points,
      description: region.description || '',
      fillColor: region.fillColor,
      strokeColor: region.strokeColor,
      fillOpacity: region.fillOpacity
    };
  });
};

// Функция для преобразования точек области в строку JSON для API
export const convertPointsToPolygonCoordinates = (points: [number, number][]): string => {
  return JSON.stringify(points);
};