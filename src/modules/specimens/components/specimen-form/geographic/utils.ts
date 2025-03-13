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
export const ensureRegionSelected = (regionId: string | number) => {
  // Создаем и хранимся несколько попыток с увеличивающимися задержками
  const delays = [10, 50, 100, 200, 500];
  
  // Использование разных методов для максимальной надежности
  delays.forEach(delay => {
    setTimeout(() => {
      try {
        // 1. Прямая манипуляция с DOM
        const selectElement = document.getElementById('regionId') as HTMLSelectElement;
        if (selectElement) {
          debugLog(`Попытка #${delay} установить regionId=${regionId}`);
          
          // Устанавливаем значение
          selectElement.value = String(regionId);
          
          // Создаем и диспатчим событие change
          const changeEvent = new Event('change', { bubbles: true });
          selectElement.dispatchEvent(changeEvent);
          
          // Имитируем взаимодействие пользователя для надежности
          if (delay > 100) { // Только для более поздних попыток
            selectElement.focus();
            setTimeout(() => selectElement.blur(), 10);
          }
          
          // Проверка успешности
          setTimeout(() => {
            if (selectElement.value !== String(regionId)) {
              debugLog(`Проверка неудачна, текущее значение: ${selectElement.value}, ожидалось: ${regionId}`);
            } else {
              debugLog(`Успешно установлен регион ${regionId} за ${delay}мс`);
            }
          }, 20);
        }
      } catch (error) {
        console.error(`Ошибка при установке regionId=${regionId} на задержке ${delay}мс:`, error);
      }
    }, delay);
  });
}; 