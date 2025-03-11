import axios from 'axios';
import { SectorType, Specimen } from '../../specimens/types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:7254/api';

/**
 * Сервис для работы с экземплярами растений на карте
 */
export const specimenService = {
  /**
   * Получает список экземпляров растений по ID карты
   * @param mapId ID карты
   */
  getSpecimensByMapId: async (mapId: number): Promise<Specimen[]> => {
    try {
      const response = await axios.get(`${API_URL}/Map/${mapId}/specimens`);
      return response.data || [];
    } catch (error) {
      console.error('Ошибка при загрузке экземпляров растений:', error);
      return [];
    }
  },
  
  /**
   * Получает список экземпляров растений по типу сектора
   * @param sectorType Тип сектора
   */
  getSpecimensBySectorType: async (sectorType: SectorType): Promise<Specimen[]> => {
    try {
      const response = await axios.get(`${API_URL}/Specimen/sector/${sectorType}`);
      return response.data || [];
    } catch (error: any) {
      // Если API вернул 404, значит в секторе нет образцов - это нормально
      if (error.response && error.response.status === 404) {
        console.log(`В секторе ${sectorType} нет образцов растений`);
        return [];
      }

      // Если API вернул ошибку, логируем и возвращаем пустой массив
      console.error(`Ошибка при получении образцов для сектора ${sectorType}:`, error);
      return [];
    }
  },
  
  /**
   * Получает все экземпляры растений
   */
  getAllSpecimens: async (): Promise<Specimen[]> => {
    try {
      const response = await axios.get(`${API_URL}/Specimen/all`);
      return response.data || [];
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        console.log('Образцы растений отсутствуют');
        return [];
      }
      console.error('Ошибка при получении всех образцов растений:', error);
      return [];
    }
  },
  
  /**
   * Создает новый экземпляр растения
   */
  createSpecimen: async (specimen: Omit<Specimen, 'id'>): Promise<Specimen> => {
    try {
      const specimenData = {
        id: 0, // API ожидает id=0 для новых записей
        ...specimen
      };
      
      const response = await axios.post(`${API_URL}/Specimen`, specimenData);
      return response.data;
    } catch (error) {
      console.error('Ошибка при добавлении образца:', error);
      throw error;
    }
  },
  
  /**
   * Обновляет существующий экземпляр растения
   */
  updateSpecimen: async (id: number, specimen: Specimen): Promise<Specimen> => {
    try {
      const response = await axios.put(`${API_URL}/Specimen/${id}`, {
        ...specimen,
        id
      });
      return response.data;
    } catch (error) {
      console.error(`Ошибка при обновлении образца с ID ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Удаляет экземпляр растения
   */
  deleteSpecimen: async (id: number): Promise<boolean> => {
    try {
      const response = await axios.delete(`${API_URL}/Specimen/${id}`);
      return response.status === 204;
    } catch (error) {
      console.error(`Ошибка при удалении образца с ID ${id}:`, error);
      throw error;
    }
  }
};

export default specimenService;
