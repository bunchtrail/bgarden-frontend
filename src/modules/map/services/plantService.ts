import { Plant } from '@/services/regions/types';
import httpClient from '@/services/httpClient';
import { logError } from '@/utils/logger';
import { LocationType } from '@/modules/specimens/types';
import L from 'leaflet';
// Импортируем типы карт для использования в функции
import { MAP_TYPES } from '../contexts/MapConfigContext';

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

export const getAllSpecimens = async (): Promise<SpecimenData[]> => {
  try {
    const data = await httpClient.get<SpecimenData[]>('/Specimen/all', {
      suppressErrorsForStatus: [404],
    });
    return data;
  } catch (error) {
    logError('Ошибка при получении растений:', error);
    return [];
  }
};

/**
 * Преобразует данные с сервера в формат Plant, фильтруя и выбирая
 * координаты в зависимости от заданного типа карты.
 * @param specimens - Массив данных о растениях с сервера.
 * @param mapType - Тип карты ('schematic' или 'geo').
 * @returns Массив объектов Plant, готовых для отображения на карте.
 */
export const convertSpecimensToPlants = (
  specimens: SpecimenData[],
  mapType: (typeof MAP_TYPES)[keyof typeof MAP_TYPES]
): Plant[] => {
  const usedIds = new Set<string>();

  return specimens
    .filter((specimen) => {
      // Фильтруем растения в зависимости от типа карты и наличия координат
      if (mapType === MAP_TYPES.GEO) {
        // Для гео-карты нужны георгафические координаты
        return (
          (specimen.locationType === LocationType.Geographic ||
            specimen.locationType === undefined) &&
          specimen.latitude != null &&
          specimen.longitude != null
        );
      }
      // Для схематической карты нужны координаты на схеме
      return (
        (specimen.locationType === LocationType.SchematicMap ||
          specimen.locationType === undefined) &&
        specimen.mapX != null &&
        specimen.mapY != null
      );
    })
    .map((specimen) => {
      let plantId = `specimen-${specimen.id}`;
      if (usedIds.has(plantId)) {
        plantId = `specimen-${specimen.id}-${Date.now()}-${Math.random()
          .toString(36)
          .substr(2, 5)}`;
      }
      usedIds.add(plantId);
      // Выбираем позицию в зависимости от типа карты
      let position: [number, number];
      if (mapType === MAP_TYPES.GEO) {
        position = [specimen.latitude, specimen.longitude];
      } else {
        // Для схематических карт преобразуем пиксели в lat/lng
        // Используем pointToLatLng, который правильно учитывает Transformation
        const ZOOM = 0; // CRS.Simple всегда z=0
        const ll = L.CRS.Simple.pointToLatLng(
          L.point(specimen.mapX, specimen.mapY),
          ZOOM
        );
        position = [ll.lat, ll.lng];
      }

      return {
        id: plantId,
        name:
          specimen.russianName || specimen.latinName || 'Неизвестное растение',
        position,
        description: `${specimen.genus || ''} ${specimen.species || ''}`.trim(),
        latinName: specimen.latinName,
      };
    });
};

export const deleteSpecimen = async (id: number): Promise<boolean> => {
  try {
    await httpClient.delete<void>(`/Specimen/${id}`);
    return true;
  } catch (error) {
    logError('Ошибка при удалении растения:', error);
    throw error;
  }
};

export const getSpecimenById = async (id: number): Promise<SpecimenData> => {
  try {
    return await httpClient.get<SpecimenData>(`/Specimen/${id}`);
  } catch (error) {
    logError('Ошибка при получении данных растения:', error);
    throw error;
  }
};

export {};
