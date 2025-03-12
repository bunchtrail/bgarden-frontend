import axios, { AxiosInstance } from 'axios';
import { SectorType, Specimen } from '../../specimens/types';
import { MapData } from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:7254/api';

// Создаем экземпляр axios с базовыми настройками
const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'text/plain'
  },
  withCredentials: true,
});

// Добавляем перехватчик запросов для токена авторизации
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Создаем простую систему кеширования для запросов
const requestCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 60 * 1000; // Время жизни кеша в миллисекундах (1 минута)
const DEBOUNCE_TIME = 300; // Время дебаунса в миллисекундах

// Функция для дебаунса запросов
function debounce<T extends (...args: any[]) => Promise<any>>(func: T, wait: number) {
  let timeout: ReturnType<typeof setTimeout>;
  let lastResult: any;

  return function(...args: Parameters<T>): ReturnType<T> {
    return new Promise((resolve, reject) => {
      const later = () => {
        timeout = null as any;
        func(...args)
          .then(resolve)
          .catch(reject);
      };

      if (lastResult) {
        resolve(lastResult);
        return;
      }

      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    }) as ReturnType<T>;
  };
}

// Класс сервиса для работы с API карт
class MapService {
  // Получение карты по ID
  async getMapById(id: number): Promise<MapData> {
    const cacheKey = `map_${id}`;
    const cached = requestCache.get(cacheKey);
    
    // Используем кеш, если он существует и не устарел
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      console.log(`Использую кешированные данные для карты с ID ${id}`);
      return cached.data;
    }
    
    try {
      const response = await api.get<MapData>(`/Map/${id}`);
      
      // Сохраняем результат в кеш
      requestCache.set(cacheKey, {
        data: response.data,
        timestamp: Date.now()
      });
      
      return response.data;
    } catch (error) {
      console.error(`Ошибка при получении карты с ID ${id}:`, error);
      throw error;
    }
  }
  
  // Получение карты со всеми образцами растений
  async getMapWithSpecimens(id: number): Promise<MapData> {
    const cacheKey = `map_specimens_${id}`;
    const cached = requestCache.get(cacheKey);
    
    // Используем кеш, если он существует и не устарел
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      console.log(`Использую кешированные данные для карты с образцами с ID ${id}`);
      return cached.data;
    }
    
    try {
      const response = await api.get<MapData>(`/Map/${id}/specimens`);
      
      // Сохраняем результат в кеш
      requestCache.set(cacheKey, {
        data: response.data,
        timestamp: Date.now()
      });
      
      return response.data;
    } catch (error) {
      console.error(`Ошибка при получении карты с образцами с ID ${id}:`, error);
      throw error;
    }
  }
  
  // Получение списка всех карт
  async getAllMaps(): Promise<MapData[]> {
    const cacheKey = 'all_maps';
    const cached = requestCache.get(cacheKey);
    
    // Используем кеш, если он существует и не устарел
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      console.log('Использую кешированные данные для списка всех карт');
      return cached.data;
    }
    
    try {
      const response = await api.get<MapData[]>('/Map');
      
      // Сохраняем результат в кеш
      requestCache.set(cacheKey, {
        data: response.data,
        timestamp: Date.now()
      });
      
      return response.data;
    } catch (error) {
      console.error('Ошибка при получении списка карт:', error);
      throw error;
    }
  }
  
  // Получение активной карты
  async getActiveMap(): Promise<MapData | null> {
    const cacheKey = 'active_map';
    const cached = requestCache.get(cacheKey);
    
    // Используем кеш, если он существует и не устарел
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      console.log('Использую кешированные данные для активной карты');
      return cached.data;
    }
    
    try {
      const response = await api.get<MapData[]>('/Map/active');
      
      // Сохраняем результат в кеш
      requestCache.set(cacheKey, {
        data: response.data.length > 0 ? response.data[0] : null,
        timestamp: Date.now()
      });
      
      return response.data.length > 0 ? response.data[0] : null;
    } catch (error) {
      console.error('Ошибка при получении активной карты:', error);
      throw error;
    }
  }
  
  // Получение образцов растений по типу сектора
  async getSpecimensBySector(sectorType: SectorType): Promise<Specimen[]> {
    try {
      const response = await api.get<Specimen[]>(`/Specimen/sector/${sectorType}`);
      return response.data || [];
    } catch (error: any) {
      // Если API вернул 404, значит в секторе нет образцов - это нормально
      if (error.response && error.response.status === 404) {
        console.log(`В секторе ${sectorType} нет образцов растений`);
        return [];
      }
      console.error(`Ошибка при получении образцов для сектора ${sectorType}:`, error);
      throw error;
    }
  }
  
  // Получение всех образцов растений
  async getAllSpecimens(): Promise<Specimen[]> {
    try {
      console.log(`MapService: Вызов GET ${API_URL}/Specimen/all с Accept: text/plain`);
      const response = await api.get<Specimen[]>('/Specimen/all', {
        headers: {
          'Accept': 'text/plain'
        }
      });
      console.log(`MapService: Получено ${response.data ? response.data.length : 0} образцов растений`);
      return response.data || [];
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        console.log('Образцы растений отсутствуют');
        return [];
      }
      console.error('Ошибка при получении всех образцов растений:', error);
      if (error.response) {
        console.error(`Код ошибки: ${error.response.status}, сообщение: ${error.response.statusText}`);
      }
      return [];
    }
  }
  
  // Получение отфильтрованных образцов растений
  async getFilteredSpecimens(
    name?: string, 
    familyId?: number, 
    regionId?: number
  ): Promise<Specimen[]> {
    try {
      // Формируем параметры запроса
      const params: Record<string, string | number> = {};
      if (name) params.name = name;
      if (familyId) params.familyId = familyId;
      if (regionId) params.regionId = regionId;
      
      const response = await api.get<Specimen[]>('/Specimen/filter', { params });
      return response.data || [];
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        console.log('Не найдено образцов, соответствующих фильтрам');
        return [];
      }
      console.error('Ошибка при получении отфильтрованных образцов:', error);
      throw error;
    }
  }
  
  // Получение образца растения по ID
  async getSpecimenById(id: number): Promise<Specimen | null> {
    try {
      const response = await api.get<Specimen>(`/Specimen/${id}`);
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        console.log(`Образец с ID ${id} не найден`);
        return null;
      }
      console.error(`Ошибка при получении образца с ID ${id}:`, error);
      throw error;
    }
  }
  
  // Добавление нового образца растения
  async addSpecimen(specimen: Omit<Specimen, 'id'>): Promise<Specimen> {
    // API ожидает id=0 для новых записей
    const specimenData = {
      id: 0,
      ...specimen
    };
    
    console.log('Отправляем данные в API:', JSON.stringify(specimenData, null, 2));
    
    try {
      const response = await api.post<Specimen>('/Specimen', specimenData);
      return response.data;
    } catch (error) {
      console.error('Ошибка при добавлении образца:', error);
      throw error;
    }
  }
  
  // Обновление существующего образца растения
  async updateSpecimen(id: number, specimen: Specimen): Promise<Specimen> {
    // Проверяем, что ID в объекте соответствует ID в URL
    const specimenData = {
      ...specimen,
      id
    };
    
    console.log('Обновляем данные в API:', JSON.stringify(specimenData, null, 2));
    
    try {
      const response = await api.put<Specimen>(`/Specimen/${id}`, specimenData);
      return response.data;
    } catch (error) {
      console.error(`Ошибка при обновлении образца с ID ${id}:`, error);
      throw error;
    }
  }
  
  // Удаление образца растения
  async deleteSpecimen(id: number): Promise<boolean> {
    try {
      const response = await api.delete(`/Specimen/${id}`);
      return response.status === 204;
    } catch (error) {
      console.error(`Ошибка при удалении образца с ID ${id}:`, error);
      throw error;
    }
  }
  
  // Загрузка пользовательского изображения карты
  async uploadMapImage(mapId: number, file: File): Promise<MapData> {
    try {
      // Создаем FormData для отправки файла
      const formData = new FormData();
      formData.append('file', file);
      
      console.log(`Загрузка изображения карты для ID ${mapId}`);
      
      // Изменяем заголовки для multipart/form-data
      const response = await api.post<MapData>(`/Map/${mapId}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      console.error(`Ошибка при загрузке изображения карты для ID ${mapId}:`, error);
      throw error;
    }
  }
  
  // Получение полного URL для изображения карты
  getMapImageUrl(filePath: string): string {
    if (!filePath) {
      return '';
    }
    
    // Если путь уже полный URL, возвращаем его
    if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
      return filePath;
    }
    
    // Убеждаемся, что путь начинается с /
    const normalizedPath = filePath.startsWith('/') ? filePath : `/${filePath}`;
    
    // Формируем полный URL
    return `${API_URL.replace('/api', '')}${normalizedPath}`;
  }
  
  // Переключение активного статуса карты
  async toggleMapActive(mapId: number, isActive: boolean): Promise<MapData> {
    try {
      const response = await api.put<MapData>(`/Map/${mapId}/active`, { isActive });
      return response.data;
    } catch (error) {
      console.error(`Ошибка при изменении статуса карты с ID ${mapId}:`, error);
      throw error;
    }
  }
  
  // Создание новой карты
  async createMap(mapData: Omit<MapData, 'id' | 'filePath' | 'contentType' | 'fileSize' | 'uploadDate' | 'lastUpdated' | 'specimensCount'>): Promise<MapData> {
    try {
      const response = await api.post<MapData>('/Map', {
        ...mapData,
        id: 0, // API ожидает id=0 для новых записей
      });
      return response.data;
    } catch (error) {
      console.error('Ошибка при создании новой карты:', error);
      throw error;
    }
  }
  
  // Обновление информации о карте
  async updateMap(id: number, mapData: Partial<MapData>): Promise<MapData> {
    try {
      const response = await api.put<MapData>(`/Map/${id}`, {
        ...mapData,
        id,
      });
      return response.data;
    } catch (error) {
      console.error(`Ошибка при обновлении информации о карте с ID ${id}:`, error);
      throw error;
    }
  }
  
  // Удаление карты
  async deleteMap(id: number): Promise<boolean> {
    try {
      const response = await api.delete(`/Map/${id}`);
      return response.status === 204;
    } catch (error) {
      console.error(`Ошибка при удалении карты с ID ${id}:`, error);
      throw error;
    }
  }
}

// Экспортируем экземпляр сервиса для использования в приложении
export const mapService = new MapService();
// Экспортируем дебаунсированные версии методов для использования в UI
export const debouncedMapService = {
  getMapById: debounce(mapService.getMapById.bind(mapService), DEBOUNCE_TIME),
  getMapWithSpecimens: debounce(mapService.getMapWithSpecimens.bind(mapService), DEBOUNCE_TIME),
  getAllMaps: debounce(mapService.getAllMaps.bind(mapService), DEBOUNCE_TIME),
  getActiveMap: debounce(mapService.getActiveMap.bind(mapService), DEBOUNCE_TIME)
}; 