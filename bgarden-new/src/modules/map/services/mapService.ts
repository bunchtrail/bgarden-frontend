// Сервис взаимодействия с API карты 
// Форма добавления растения 

import httpClient from '@/services/httpClient';
import { logError } from '@/utils/logger';

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
    logError('Ошибка при получении активной карты:', error);
    throw error;
  }
};

// Функция для получения полного URL изображения карты
export const getMapImageUrl = (mapData: MapData | null): string | null => {
  if (!mapData || !mapData.filePath) return null;
  
  // Используем константу API из httpClient, но без /api в конце пути
  const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:7254';
  
  // Если путь начинается с /, то просто добавляем baseUrl
  // В противном случае добавляем / между baseUrl и filePath
  return `${baseUrl}${mapData.filePath.startsWith('/') ? '' : '/'}${mapData.filePath}`;
};
