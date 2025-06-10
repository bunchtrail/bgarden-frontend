// Сервис CRUD растений на карте 
// Форма добавления растения 

import { Plant } from '@/services/regions/types';
import httpClient from '@/services/httpClient';
import { logError } from '@/utils/logger';
import { LocationType } from '@/modules/specimens/types';

// Тип данных растения, который приходит с сервера
export interface SpecimenData {
  id: number;
  inventoryNumber: string;
  sectorType: number;
  locationType?: number;
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
      // Определяем, какие координаты использовать в зависимости от типа локации
      if (specimen.locationType === LocationType.Geographic) {
        // Для географических координат
        return specimen.latitude !== undefined && specimen.latitude !== null && 
               specimen.longitude !== undefined && specimen.longitude !== null;
      } else if (specimen.locationType === LocationType.SchematicMap) {
        // Для координат на схеме
        return specimen.mapX !== undefined && specimen.mapX !== null && 
               specimen.mapY !== undefined && specimen.mapY !== null;
      } else {
        // Если тип локации не определен, проверяем оба типа координат
        const hasMapCoords = specimen.mapX !== undefined && specimen.mapX !== null &&
                            specimen.mapY !== undefined && specimen.mapY !== null;
        const hasLatLng = specimen.latitude !== undefined && specimen.latitude !== null &&
                          specimen.longitude !== undefined && specimen.longitude !== null;
        return hasMapCoords || hasLatLng;
      }
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
      
      // Сохраняем оба типа координат, если доступны
      let mapX: number | undefined = specimen.mapX;
      let mapY: number | undefined = specimen.mapY;
      let lat: number | undefined = specimen.latitude;
      let lng: number | undefined = specimen.longitude;

      // Выбор координат по умолчанию зависит от locationType
      let x: number;
      let y: number;

      if (specimen.locationType === LocationType.Geographic) {
        x = lat as number;
        y = lng as number;
      } else if (specimen.locationType === LocationType.SchematicMap) {
        x = mapX as number;
        y = mapY as number;
      } else {
        x = mapX ?? lat ?? 0;
        y = mapY ?? lng ?? 0;
      }
      
      return {
        id: plantId,
        name: specimen.russianName || specimen.latinName || 'Неизвестное растение',
        position: [x, y] as [number, number],
        mapCoordinates: mapX !== undefined && mapY !== undefined ? [mapX, mapY] as [number, number] : undefined,
        geoCoordinates: lat !== undefined && lng !== undefined ? [lat, lng] as [number, number] : undefined,
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


