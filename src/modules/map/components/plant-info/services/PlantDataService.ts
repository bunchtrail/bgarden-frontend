// src/modules/map/components/plant-info/services/PlantDataService.ts

import { Plant } from '@/services/regions/types';
import {
  getAllSpecimens,
  convertSpecimensToPlants,
} from '../../../services/plantService';
import { MAP_TYPES } from '../../../contexts/MapConfigContext';

// Simple in-memory cache so that we don't flood the backend each time карта перерисовывается.
let cachedPlants: Plant[] | null = null;
let lastFetchTimestamp = 0;
let lastMapType: string | null = null;

// Время жизни кэша (60 секунд достаточно, чтобы предотвратить «всплеск» запросов при зуме/панорамировании,
// но данные остаются относительно свежими).
const CACHE_DURATION_MS = 60_000; // 1 минута

/**
 * Сервис для загрузки и кэширования данных о растениях.
 */
export class PlantDataService {
  /**
   * Загружает данные о растениях, принимая тип карты для корректной фильтрации.
   * @param mapType - Тип текущей карты ('schematic' или 'geo').
   */
  public static async loadPlants(
    mapType: (typeof MAP_TYPES)[keyof typeof MAP_TYPES]
  ): Promise<Plant[]> {
    const now = Date.now();

    // Если в кэше есть данные для того же типа карты и кэш ещё не устарел, возвращаем его
    if (
      cachedPlants &&
      lastMapType === mapType &&
      now - lastFetchTimestamp < CACHE_DURATION_MS
    ) {
      return cachedPlants;
    }

    try {
      // Запрашиваем данные с сервера только если кэш отсутствует или устарел
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
