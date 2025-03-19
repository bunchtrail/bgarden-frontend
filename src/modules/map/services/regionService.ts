// Сервис для работы с областями (регионами) на карте

import { Area } from '../contexts/MapContext';
import { RegionData } from '../types/mapTypes';
import httpClient from '@/services/httpClient';
import { logError, logWarning } from '@/utils/logger';

// Функция для получения всех областей (регионов) с сервера
export const getAllRegions = async (): Promise<RegionData[]> => {
  try {
    return await httpClient.get<RegionData[]>('/Region');
  } catch (error) {
    logError('Ошибка при получении областей:', error);
    throw error;
  }
};

// Функция для создания новой области (региона) на сервере
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
    
    console.log('Отправляем на сервер данные:', newRegion);
    
    return await httpClient.post<RegionData>('/Region', newRegion);
  } catch (error) {
    logError('Ошибка при создании области:', error);
    throw error;
  }
};

// Преобразование координат из строки в массив [lat, lng]
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
  });
};

// Функция для обновления существующей области (региона) на сервере
export const updateRegion = async (regionId: string, regionData: Omit<RegionData, 'id' | 'specimensCount'>): Promise<RegionData> => {
  try {
    // Проверяем и обрабатываем координаты
    let processedData = { ...regionData };
    
    // Проверка, если polygonCoordinates передан как строка
    if (typeof processedData.polygonCoordinates !== 'string') {
      processedData.polygonCoordinates = JSON.stringify(processedData.polygonCoordinates);
    }
    
    // Формируем объект для отправки на сервер (включаем ID для обновления)
    const updatedRegion = {
      id: parseInt(regionId), // Преобразуем строковый ID в число
      ...processedData,
    };
    
    console.log('Отправляем на сервер обновленные данные:', updatedRegion);
    
    return await httpClient.put<RegionData>(`/Region/${regionId}`, updatedRegion);
  } catch (error) {
    logError('Ошибка при обновлении области:', error);
    throw error;
  }
};

// Функция для преобразования точек области в строку JSON для API
export const convertPointsToPolygonCoordinates = (points: [number, number][]): string => {
  // В нашем проекте используется нестандартная система координат, 
  // поэтому сохраняем формат как есть
  return JSON.stringify(points);
};