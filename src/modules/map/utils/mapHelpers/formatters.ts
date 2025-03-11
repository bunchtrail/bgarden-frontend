/**
 * Вспомогательные функции для форматирования данных карты
 */

import { MapData } from '../../types';

/**
 * Форматирует дату для отображения
 * @param dateString строка с датой
 * @returns отформатированная дата
 */
export const formatMapDate = (dateString: string): string => {
  if (!dateString) return 'Нет данных';
  
  const date = new Date(dateString);
  return date.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Форматирует размер файла в читаемый формат
 * @param bytes размер в байтах
 * @returns форматированный размер (кБ, МБ)
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Б';
  
  const sizes = ['Б', 'КБ', 'МБ', 'ГБ'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
};

/**
 * Создает краткое описание карты
 * @param map объект карты
 * @returns краткое описание для списка
 */
export const createMapSummary = (map: MapData): string => {
  const uploadDate = formatMapDate(map.uploadDate);
  const size = formatFileSize(map.fileSize);
  
  return `${map.name} (${size}) - добавлена ${uploadDate}`;
}; 