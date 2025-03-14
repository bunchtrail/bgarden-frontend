import { SelectedArea } from './SimpleMap';
import { MapPlant } from '../types';

// В начале файла добавим константу для контроля логирования
export const ENABLE_DEBUG_LOGS = true;
export const ENABLE_EXTRA_DOM_SYNC = true; // Включение дополнительной синхронизации с DOM

// Функция для логирования с контролем дебага
export const debugLog = (...args: any[]) => {
  if (ENABLE_DEBUG_LOGS) {
    console.log(...args);
  }
};

// Обновляем функцию преобразования данных о растениях
export const mapPlantToPlantMarker = (plant: MapPlant) => ({
  id: plant.id || `plant-${Math.random().toString(36).substr(2, 9)}`,
  name: plant.name || 'Неизвестное растение',
  position: plant.position || [0, 0],
  description: plant.description || '',
});

// Утилитарная функция для обеспечения выбора региона
export const ensureRegionSelected = (
  regionId: string | number, 
  onRegionSelect: (regionId: number) => void
) => {
  // Вместо манипуляции DOM просто вызываем переданный callback с regionId
  try {
    const numericRegionId = typeof regionId === 'string' ? 
      parseInt(regionId as string, 10) : 
      regionId as number;
    
    if (!isNaN(numericRegionId)) {
      debugLog(`Обновление regionId через состояние React: ${numericRegionId}`);
      onRegionSelect(numericRegionId);
    } else {
      debugLog(`Невозможно преобразовать regionId в число: ${regionId}`);
    }
  } catch (error) {
    console.error(`Ошибка при обновлении regionId=${regionId}:`, error);
  }
}; 