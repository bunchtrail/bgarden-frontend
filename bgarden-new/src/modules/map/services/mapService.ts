// Сервис взаимодействия с API карты 
// Форма добавления растения 

import httpClient from '../../../services/httpClient';

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
    return await httpClient.get<MapData[]>('/Map/active');
  } catch (error) {
    console.error('Ошибка при получении активной карты:', error);
    throw error;
  }
};

// Функция для получения полного URL изображения карты
export const getMapImageUrl = (mapData: MapData | null): string | null => {
  if (!mapData || !mapData.filePath) return null;
  
  // Используем константу API из httpClient
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:7254/api';
  return `${apiUrl}/${mapData.filePath.replace(/^\//, '')}`;
};
