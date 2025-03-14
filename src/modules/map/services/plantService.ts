// Сервис CRUD растений на карте 
// Форма добавления растения 

import { Plant } from '../contexts/MapContext';

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
}

// Функция для получения всех растений с сервера
export const getAllSpecimens = async (): Promise<SpecimenData[]> => {
  try {
    const response = await fetch('http://localhost:7254/api/Specimen/all', {
      method: 'GET',
      headers: {
        'accept': 'text/plain'
      }
    });

    if (!response.ok) {
      throw new Error(`Ошибка при получении растений: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Ошибка при получении растений:', error);
    throw error;
  }
};

// Функция для преобразования данных с сервера в формат Plant
export const convertSpecimensToPlants = (specimens: SpecimenData[]): Plant[] => {
  return specimens.map(specimen => ({
    id: `specimen-${specimen.id}`,
    name: specimen.russianName || specimen.latinName || 'Неизвестное растение',
    position: [specimen.latitude, specimen.longitude] as [number, number],
    description: `${specimen.genus || ''} ${specimen.species || ''}`.trim(),
    latinName: specimen.latinName
  }));
};

// Функция для удаления растения с сервера по ID
export const deleteSpecimen = async (id: number): Promise<boolean> => {
  try {
    const response = await fetch(`http://localhost:7254/api/Specimen/${id}`, {
      method: 'DELETE',
      headers: {
        'accept': '*/*'
      }
    });

    if (!response.ok) {
      throw new Error(`Ошибка при удалении растения: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error('Ошибка при удалении растения:', error);
    throw error;
  }
};

// Функция для получения подробной информации о растении по ID
export const getSpecimenById = async (id: number): Promise<SpecimenData> => {
  try {
    const response = await fetch(`http://localhost:7254/api/Specimen/${id}`, {
      method: 'GET',
      headers: {
        'accept': 'text/plain'
      }
    });

    if (!response.ok) {
      throw new Error(`Ошибка при получении данных растения: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Ошибка при получении данных растения:', error);
    throw error;
  }
};

export { };

