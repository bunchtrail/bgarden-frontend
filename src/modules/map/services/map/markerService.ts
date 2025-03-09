import axios from 'axios';
import { CreateMapMarkerDto, MapMarker, MarkerType, UpdateMapMarkerDto } from '../../types';

// Базовый URL API
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:7254/api';

// API для работы с картой
const MAP_API = `${API_URL}/map`;

// Получение всех маркеров на карте
export const getMapMarkers = async (): Promise<MapMarker[]> => {
  try {
    const response = await axios.get(`${MAP_API}/markers`);
    return response.data;
  } catch (error) {
    console.error('Ошибка получения маркеров карты:', error);
    return [];
  }
};

// Получение маркера по ID
export const getMarkerById = async (id: number): Promise<MapMarker | null> => {
  try {
    const response = await axios.get(`${MAP_API}/markers/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Ошибка получения маркера ${id}:`, error);
    return null;
  }
};

// Получение маркеров определенного типа
export const getMarkersByType = async (type: MarkerType): Promise<MapMarker[]> => {
  try {
    const response = await axios.get(`${MAP_API}/markers/type/${type}`);
    return response.data;
  } catch (error) {
    console.error(`Ошибка получения маркеров типа ${type}:`, error);
    return [];
  }
};

// Получение маркеров для конкретного экземпляра
export const getMarkersBySpecimenId = async (specimenId: number): Promise<MapMarker[]> => {
  try {
    const response = await axios.get(`${MAP_API}/markers/specimen/${specimenId}`);
    return response.data;
  } catch (error) {
    console.error(`Ошибка получения маркеров для экземпляра ${specimenId}:`, error);
    return [];
  }
};

// Создание маркера
export const createMarker = async (markerData: CreateMapMarkerDto): Promise<MapMarker | null> => {
  try {
    const response = await axios.post(`${MAP_API}/markers`, markerData);
    return response.data;
  } catch (error) {
    console.error('Ошибка создания маркера:', error);
    return null;
  }
};

// Обновление маркера
export const updateMarker = async (markerData: UpdateMapMarkerDto): Promise<MapMarker | null> => {
  try {
    const response = await axios.put(`${MAP_API}/markers`, markerData);
    return response.data;
  } catch (error) {
    console.error('Ошибка обновления маркера:', error);
    return null;
  }
};

// Удаление маркера
export const deleteMarker = async (id: number): Promise<boolean> => {
  try {
    await axios.delete(`${MAP_API}/markers/${id}`);
    return true;
  } catch (error) {
    console.error(`Ошибка удаления маркера ${id}:`, error);
    return false;
  }
};

// Получение ближайших маркеров в указанном радиусе
export const getNearbyMarkers = async (
  latitude: number,
  longitude: number,
  radiusInMeters: number = 100
): Promise<MapMarker[]> => {
  try {
    const response = await axios.get(`${MAP_API}/markers/nearby`, {
      params: { latitude, longitude, radiusInMeters },
    });
    return response.data;
  } catch (error) {
    console.error(`Ошибка получения ближайших маркеров:`, error);
    return [];
  }
}; 