import axios from 'axios';
import {
    CreateMapLayerDto,
    CreateMapOptionsDto,
    MapLayer,
    MapOptions,
    UpdateMapLayerDto,
    UpdateMapOptionsDto
} from '../../types';

// Базовый URL API
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:7254/api';

// API для работы с картой
const MAP_API = `${API_URL}/map`;

// --------------- Опции карты ---------------

// Получение всех опций карты
export const getMapOptions = async (): Promise<MapOptions[]> => {
  try {
    const response = await axios.get(`${MAP_API}/options`);
    return response.data;
  } catch (error) {
    console.error('Ошибка получения опций карты:', error);
    return [];
  }
};

// Получение опций карты по ID
export const getMapOptionsById = async (id: number): Promise<MapOptions | null> => {
  try {
    const response = await axios.get(`${MAP_API}/options/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Ошибка получения опций карты ${id}:`, error);
    return null;
  }
};

// Получение опций карты по умолчанию
export const getDefaultMapOptions = async (): Promise<MapOptions | null> => {
  try {
    const response = await axios.get(`${MAP_API}/options/default`);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      console.warn('Настройки карты по умолчанию не найдены. Будут использованы стандартные настройки.');
      // Возвращаем стандартные настройки при ошибке 404
      return {
        id: 0,
        name: 'Default',
        center: [55.75, 37.61],
        zoom: 14,
        minZoom: 12,
        maxZoom: 19,
        bounds: [
          [55.70, 37.55], // SW
          [55.80, 37.65]  // NE
        ]
      } as MapOptions;
    }
    console.error('Ошибка получения опций карты по умолчанию:', error);
    return null;
  }
};

// Создание опций карты
export const createMapOptions = async (optionsData: CreateMapOptionsDto): Promise<MapOptions | null> => {
  try {
    const response = await axios.post(`${MAP_API}/options`, optionsData);
    return response.data;
  } catch (error) {
    console.error('Ошибка создания опций карты:', error);
    return null;
  }
};

// Обновление опций карты
export const updateMapOptions = async (optionsData: UpdateMapOptionsDto): Promise<MapOptions | null> => {
  try {
    const response = await axios.put(`${MAP_API}/options`, optionsData);
    return response.data;
  } catch (error) {
    console.error('Ошибка обновления опций карты:', error);
    return null;
  }
};

// Удаление опций карты
export const deleteMapOptions = async (id: number): Promise<boolean> => {
  try {
    await axios.delete(`${MAP_API}/options/${id}`);
    return true;
  } catch (error) {
    console.error(`Ошибка удаления опций карты ${id}:`, error);
    return false;
  }
};

// --------------- Слои карты ---------------

// Получение всех слоев карты
export const getMapLayers = async (): Promise<MapLayer[]> => {
  try {
    const response = await axios.get(`${MAP_API}/layers`);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      console.warn('Слои карты не найдены. Будет использован стандартный слой.');
      // Возвращаем пустой массив при ошибке 404
      return [];
    }
    console.error('Ошибка получения слоев карты:', error);
    return [];
  }
};

// Получение слоя карты по ID
export const getMapLayerById = async (id: number): Promise<MapLayer | null> => {
  try {
    const response = await axios.get(`${MAP_API}/layers/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Ошибка получения слоя карты ${id}:`, error);
    return null;
  }
};

// Создание нового слоя карты
export const createMapLayer = async (layerData: CreateMapLayerDto): Promise<MapLayer | null> => {
  try {
    const response = await axios.post(`${MAP_API}/layers`, layerData);
    return response.data;
  } catch (error) {
    console.error('Ошибка создания слоя карты:', error);
    return null;
  }
};

// Обновление слоя карты
export const updateMapLayer = async (layerData: UpdateMapLayerDto): Promise<MapLayer | null> => {
  try {
    const response = await axios.put(`${MAP_API}/layers`, layerData);
    return response.data;
  } catch (error) {
    console.error('Ошибка обновления слоя карты:', error);
    return null;
  }
};

// Удаление слоя карты
export const deleteMapLayer = async (id: number): Promise<boolean> => {
  try {
    await axios.delete(`${MAP_API}/layers/${id}`);
    return true;
  } catch (error) {
    console.error(`Ошибка удаления слоя карты ${id}:`, error);
    return false;
  }
}; 