// src/modules/map/components/plant-info/services/PlantDataService.ts

import { Plant } from '@/services/regions/types';
import { getAllSpecimens, convertSpecimensToPlants } from '../../../services/plantService';
import { MAP_TYPES } from '../../../contexts/MapConfigContext';

// Предполагаемая логика кэширования
let cachedPlants: Plant[] | null = null;
let lastFetchTimestamp = 0;
let lastMapType: string | null = null;
const CACHE_DURATION_MS = 60000; // 1 минута

/**
 * Сервис для загрузки и кэширования данных о растениях.
 */
export class PlantDataService {
  /**
   * Загружает данные о растениях, принимая тип карты для корректной фильтрации.
   * @param mapType - Тип текущей карты ('schematic' или 'geo').
   */
  public static async loadPlants(
    mapType: typeof MAP_TYPES[keyof typeof MAP_TYPES]
  ): Promise<Plant[]> {
    const now = Date.now();

    // Проверяем кэш. Кэш считается невалидным, если истекло время или изменился тип карты.
    if (
      cachedPlants &&
      now - lastFetchTimestamp < CACHE_DURATION_MS &&
      lastMapType === mapType
    ) {
      return cachedPlants;
    }

    try {
      // Запрашиваем данные с сервера
      const specimens = await getAllSpecimens();

      // **ИСПРАВЛЕНИЕ:** Передаем `mapType` в функцию конвертации.
      const plants = convertSpecimensToPlants(specimens, mapType);

      // Обновляем кэш
      cachedPlants = plants;
      lastFetchTimestamp = now;
      lastMapType = mapType;

      return plants;
    } catch (error) {
      console.error('Ошибка в PlantDataService при загрузке растений:', error);
      // В случае ошибки сбрасываем кэш и возвращаем пустой массив
      cachedPlants = null;
      lastFetchTimestamp = 0;
      lastMapType = null;
      return [];
    }
  }
}