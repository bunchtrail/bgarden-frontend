// Сервис CRUD растений на карте 
// Форма добавления растения 

import { Plant } from '@/services/regions/types';
import httpClient from '@/services/httpClient';
import { logError } from '@/utils/logger';

// Тип данных растения, который приходит с сервера
export interface SpecimenData {
  id: number;
  inventoryNumber: string;
  sectorType: number;
  latitude: number;
  longitude: number;
  locationWkt: string;
  regionId: number;
  regionName: string | null;
  familyId: number;
  familyName: string | null;
  russianName: string;
  latinName: string;
  genus: string;
  species: string;
  cultivar: string | null;
  form: string | null;
  synonyms: string | null;
  determinedBy: string | null;
  plantingYear: number | null;
  sampleOrigin: string | null;
  naturalRange: string | null;
  ecologyAndBiology: string | null;
  economicUse: string | null;
  conservationStatus: string | null;
  expositionId: number | null;
  expositionName: string | null;
  hasHerbarium: boolean;
  duplicatesInfo: string | null;
  originalBreeder: string | null;
  originalYear: number | null;
  country: string | null;
  illustration: string | null;
  notes: string | null;
  filledBy: string | null;
  mapX: number;
  mapY: number;
}

// Функция для получения всех растений с сервера
export const getAllSpecimens = async (): Promise<SpecimenData[]> => {
  try {
    // Используем httpClient вместо прямого fetch
    // Добавляем suppressErrorsForStatus: [404] чтобы подавить ошибки 404
    const data = await httpClient.get<SpecimenData[]>('/Specimen/all', {
      suppressErrorsForStatus: [404]
    });
    return data;
  } catch (error) {
    logError('Ошибка при получении растений:', error);
    // Возвращаем пустой массив вместо выброса исключения
    return [];
  }
};

// Функция для преобразования данных с сервера в формат Plant
export const convertSpecimensToPlants = (specimens: SpecimenData[]): Plant[] => {
  // Создаем Set для отслеживания уже использованных ID, чтобы избежать дублирования
  const usedIds = new Set<string>();
  
  return specimens
    .filter(specimen => {
      // Отфильтровываем образцы без координат
      const hasMapCoords = specimen.mapX !== undefined && specimen.mapY !== undefined;
      const hasLatLng = specimen.latitude !== undefined && specimen.longitude !== undefined;
      return hasMapCoords || hasLatLng;
    })
    .map(specimen => {
      // Создаем базовый ID
      let plantId = `specimen-${specimen.id}`;
      
      // Если ID уже используется, добавляем уникальный суффикс
      if (usedIds.has(plantId)) {
        plantId = `specimen-${specimen.id}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
      }
      
      // Добавляем ID в набор использованных
      usedIds.add(plantId);
      
      // Определяем координаты: предпочитаем mapX/mapY, но если их нет, используем latitude/longitude
      const x = specimen.mapX !== undefined ? specimen.mapX : specimen.latitude;
      const y = specimen.mapY !== undefined ? specimen.mapY : specimen.longitude;
      
      // Проверяем, что координаты действительно существуют и не null
      if (x === undefined || y === undefined || x === null || y === null) {
        console.warn(`Отсутствуют координаты для растения с ID ${specimen.id}`);
      }
      
      return {
        id: plantId,
        name: specimen.russianName || specimen.latinName || 'Неизвестное растение',
        position: [x, y] as [number, number],
        description: `${specimen.genus || ''} ${specimen.species || ''}`.trim(),
        latinName: specimen.latinName
      };
    });
};

// Функция для удаления растения с сервера по ID
export const deleteSpecimen = async (id: number): Promise<boolean> => {
  try {
    await httpClient.delete<void>(`/Specimen/${id}`);
    return true;
  } catch (error) {
    logError('Ошибка при удалении растения:', error);
    throw error;
  }
};

// Функция для получения подробной информации о растении по ID
export const getSpecimenById = async (id: number): Promise<SpecimenData> => {
  try {
    return await httpClient.get<SpecimenData>(`/Specimen/${id}`);
  } catch (error) {
    logError('Ошибка при получении данных растения:', error);
    throw error;
  }
};

export { };


