import { Plant } from '../../../contexts/MapContext';
import { getAllSpecimens, convertSpecimensToPlants } from '../../../services/plantService';

/**
 * Сервис для загрузки данных о растениях с сервера
 */
export const PlantDataService = {
  /**
   * Загружает данные о растениях с сервера
   * @returns Промис с массивом растений
   */
  async loadPlants(): Promise<Plant[]> {
    try {
      const specimens = await getAllSpecimens();
      return convertSpecimensToPlants(specimens);
    } catch (error) {
      console.error('Ошибка при загрузке данных растений:', error);
      return [];
    }
  }
}; 