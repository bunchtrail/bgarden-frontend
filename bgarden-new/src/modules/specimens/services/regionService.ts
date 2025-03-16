import httpClient from '@/services/httpClient';
import { logError, logWarning } from '@/utils/logger';
import { RegionData } from '@/modules/map/types/mapTypes';

// Интерфейс для образца растения
interface Specimen {
  id: number;
  name: string;
  latinName?: string;
  // другие поля добавляются по мере необходимости
}

// Интерфейс для объекта данных региона
export interface RegionDto {
  id: number;
  name: string;
  description?: string;
  climate?: string;
}

// Сервис для работы с регионами в контексте образцов
// Адаптирован на основе сервиса регионов из модуля карты

// Функция для получения всех регионов
export const getAllRegions = async (): Promise<RegionData[]> => {
  try {
    const regions = await httpClient.get<RegionData[]>('Region');
    
    // Если API вернул пустой список или произошла ошибка, используем временные данные
    if (!regions || regions.length === 0) {
      logWarning('API вернул пустой список регионов, используем временные данные');
      return getDefaultRegions();
    }
    
    return regions;
  } catch (error) {
    logError('Ошибка при получении списка регионов:', error);
    // В случае ошибки также возвращаем временные данные
    return getDefaultRegions();
  }
};

// Функция для получения дефолтных регионов (для обеспечения бесперебойной работы)
export const getDefaultRegions = (): RegionData[] => {
  const defaultRegions = [
    { id: 1, name: "Европа", description: "Европейская часть" },
    { id: 2, name: "Азия", description: "Азиатская часть" },
    { id: 3, name: "Северная Америка", description: "Североамериканская часть" },
    { id: 4, name: "Южная Америка", description: "Южноамериканская часть" },
    { id: 5, name: "Африка", description: "Африканская часть" },
    { id: 6, name: "Австралия", description: "Австралия и Океания" }
  ];
  
  logWarning('Возвращаю дефолтные регионы');
  return defaultRegions as RegionData[];
};

// Функция для получения региона по ID
export const getRegionById = async (id: number): Promise<RegionData> => {
  try {
    return await httpClient.get<RegionData>(`Region/${id}`);
  } catch (error) {
    logError(`Ошибка при получении региона с ID ${id}:`, error);
    throw error;
  }
};

// Функция для получения списка экземпляров растений в регионе
export const getSpecimensInRegion = async (regionId: number): Promise<Specimen[]> => {
  try {
    return await httpClient.get<Specimen[]>(`Region/${regionId}/specimens`);
  } catch (error) {
    logError(`Ошибка при получении образцов из региона ${regionId}:`, error);
    return [];
  }
};

// Функция для сопоставления секторов с регионами (временное решение)
export const getSectorRegionMapping = (sectorData: any[]): Record<number, RegionData> => {
  // Временное сопоставление секторов и регионов
  const sectorToRegion: Record<number, RegionData> = {};
  
  // Пример: сектор с ID 1 соответствует региону "Европа"
  sectorToRegion[1] = { id: 1, name: "Европа", description: "Европейская часть" } as RegionData;
  
  // Сектор с ID 2 соответствует региону "Азия"
  sectorToRegion[2] = { id: 2, name: "Азия", description: "Азиатская часть" } as RegionData;
  
  // Сектор с ID 3 соответствует региону "Северная Америка"
  sectorToRegion[3] = { id: 3, name: "Северная Америка", description: "Североамериканская часть" } as RegionData;
  
  return sectorToRegion;
};

// Функция для создания нового региона
export const createRegion = async (region: Omit<RegionData, 'id'>): Promise<RegionData> => {
  try {
    return await httpClient.post<RegionData>('Region', region);
  } catch (error) {
    logError('Ошибка при создании региона:', error);
    throw error;
  }
};

// Функция для обновления существующего региона
export const updateRegion = async (id: number, region: RegionData): Promise<RegionData> => {
  try {
    return await httpClient.put<RegionData>(`Region/${id}`, region);
  } catch (error) {
    logError(`Ошибка при обновлении региона ${id}:`, error);
    throw error;
  }
};

// Функция для удаления региона
export const deleteRegion = async (id: number): Promise<boolean> => {
  try {
    await httpClient.delete(`Region/${id}`);
    return true;
  } catch (error) {
    logError(`Ошибка при удалении региона ${id}:`, error);
    throw error;
  }
};

// Для обратной совместимости - объект с теми же методами
export const regionService = {
  getAllRegions,
  getRegionById,
  getSpecimensInRegion,
  getSectorRegionMapping,
  createRegion,
  updateRegion,
  deleteRegion,
  getDefaultRegions
}; 