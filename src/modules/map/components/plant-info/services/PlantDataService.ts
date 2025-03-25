import { Plant } from '../../../contexts/MapContext';
import { getAllSpecimens, convertSpecimensToPlants } from '../../../services/plantService';

// Кэширование данных
let cachedPlants: Plant[] | null = null;
let lastFetchTime = 0;
let hasError = false;
const CACHE_TIME = 60000; // 1 минута кэширования
const ERROR_CACHE_TIME = 300000; // 5 минут кэширования при ошибке

/**
 * Сервис для загрузки данных о растениях с сервера
 */
export const PlantDataService = {
  /**
   * Загружает данные о растениях с сервера
   * @returns Промис с массивом растений
   */
  async loadPlants(): Promise<Plant[]> {
    // Проверка кэша
    const now = Date.now();
    const cacheExpired = now - lastFetchTime > (hasError ? ERROR_CACHE_TIME : CACHE_TIME);
    
    // Возвращаем кэшированные данные, если они актуальны
    if (cachedPlants !== null && !cacheExpired) {
      return cachedPlants;
    }
    
    try {
      // Запрашиваем данные с сервера
      const specimens = await getAllSpecimens();
      const plants = convertSpecimensToPlants(specimens);
      
      // Обновляем кэш
      cachedPlants = plants;
      lastFetchTime = now;
      hasError = false;
      
      return plants;
    } catch (error) {
      // Устанавливаем флаг ошибки для более долгого кэширования
      hasError = true;
      lastFetchTime = now;
      
      // Возвращаем кэшированные данные или пустой массив
      return cachedPlants || [];
    }
  },
  
  /**
   * Очищает кэш данных растений
   */
  clearCache(): void {
    cachedPlants = null;
    lastFetchTime = 0;
    hasError = false;
  }
};