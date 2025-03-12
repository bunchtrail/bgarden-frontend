import axios from 'axios';
import { SectorType, Specimen } from '../../specimens/types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:7254/api';

// Логируем значение API_URL
console.log('specimenService инициализирован с API_URL:', API_URL);

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
      console.log(`Вызов GET ${API_URL}/Map/${mapId}/specimens`);
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
      console.log(`Вызов GET ${API_URL}/Specimen/sector/${sectorType}`);
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
      const url = `${API_URL}/Specimen/all`;
      console.log(`🔍 specimenService.getAllSpecimens: Запускаю запрос GET ${url}`);
      
      // Используем правильные заголовки для API
      const response = await axios.get(url, {
        headers: {
          'Accept': 'text/plain'
        }
      });
      
      console.log(`✅ specimenService.getAllSpecimens: Получено ${response.data ? response.data.length : 0} образцов растений`);
      if (response.data && response.data.length > 0) {
        console.log('✅ specimenService.getAllSpecimens: Первые 2 образца:', 
          JSON.stringify(response.data.slice(0, 2), null, 2));
      } else {
        console.warn('⚠️ specimenService.getAllSpecimens: API вернул пустой массив образцов');
      }
      
      return response.data || [];
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        console.log('❌ specimenService.getAllSpecimens: API вернул 404 - образцы растений отсутствуют');
        return [];
      }
      
      console.error('❌ specimenService.getAllSpecimens: Ошибка при получении всех образцов растений:', error);
      if (error.response) {
        console.error(`❌ specimenService.getAllSpecimens: Код ошибки: ${error.response.status}, сообщение: ${error.response.statusText}`);
        console.error('❌ specimenService.getAllSpecimens: Данные ответа:', error.response.data);
      } else if (error.request) {
        console.error('❌ specimenService.getAllSpecimens: Запрос был отправлен, но ответ не получен', error.request);
      } else {
        console.error('❌ specimenService.getAllSpecimens: Ошибка настройки запроса:', error.message);
      }
      
      // Пробуем доступ к API через fetch
      try {
        console.log('🔄 specimenService.getAllSpecimens: Пробую альтернативный запрос через fetch');
        const response = await fetch(`${API_URL}/Specimen/all`, {
          headers: {
            'Accept': 'text/plain'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log(`✅ specimenService.getAllSpecimens: Через fetch получено ${data ? data.length : 0} образцов`);
          return data;
        } else {
          console.error(`❌ specimenService.getAllSpecimens: fetch тоже не удался. Статус: ${response.status}`);
        }
      } catch (fetchError) {
        console.error('❌ specimenService.getAllSpecimens: Ошибка и при использовании fetch:', fetchError);
      }
      
      // Для отладки попробуем прямой запрос через командную строку
      console.log(`⚙️ Для отладки выполните в командной строке: 
curl -X 'GET' '${API_URL}/Specimen/all' -H 'accept: text/plain'`);
      
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
