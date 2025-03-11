/**
 * Вспомогательные функции для валидации данных карты
 */

import { MapData, PlantLocation } from '../../types';

/**
 * Проверяет корректность координат растения на карте
 * @param location координаты растения
 * @returns true если координаты валидны
 */
export const isValidPlantLocation = (location: PlantLocation): boolean => {
  if (!location) return false;
  
  const { latitude, longitude } = location;
  
  // Проверка, что координаты числовые и в допустимых пределах
  return (
    typeof latitude === 'number' && 
    typeof longitude === 'number' &&
    isFinite(latitude) &&
    isFinite(longitude) &&
    latitude >= -90 && latitude <= 90 &&
    longitude >= -180 && longitude <= 180
  );
};

/**
 * Проверяет валидность данных карты
 * @param mapData данные карты
 * @returns объект с результатом валидации
 */
export const validateMapData = (mapData: Partial<MapData>): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!mapData.name || mapData.name.trim() === '') {
    errors.push('Название карты не может быть пустым');
  }
  
  if (!mapData.filePath || mapData.filePath.trim() === '') {
    errors.push('Путь к файлу карты не может быть пустым');
  }
  
  if (mapData.fileSize && mapData.fileSize <= 0) {
    errors.push('Размер файла должен быть положительным числом');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}; 