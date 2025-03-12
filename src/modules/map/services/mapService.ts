// Сервис взаимодействия с API карты 
// Форма добавления растения 

import { getApiUrl, getResourceUrl } from '../../../config/apiConfig';

export interface MapData {
  id: number;
  name: string;
  description: string;
  filePath: string; // Путь к файлу изображения карты (относительный путь от backend API)
  contentType: string;
  fileSize: number;
  uploadDate: string;
  lastUpdated: string;
  isActive: boolean;
  specimensCount: number;
}

// Функция для получения активной карты
export const getActiveMap = async (): Promise<MapData[]> => {
  try {
    const response = await fetch(getApiUrl('/api/Map/active'));
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Ошибка при получении активной карты:', error);
    throw error;
  }
};

// Функция для получения полного URL изображения карты
export const getMapImageUrl = (mapData: MapData | null): string | null => {
  if (!mapData || !mapData.filePath) return null;
  return getResourceUrl(mapData.filePath);
};
