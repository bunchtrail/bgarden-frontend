import axios from 'axios';
import { AreaType, MapArea, MapLayer, MapMarker, MarkerType } from '../types';

// Базовый URL API
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

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

// Получение всех зон на карте
export const getMapAreas = async (): Promise<MapArea[]> => {
  try {
    const response = await axios.get(`${MAP_API}/areas`);
    return response.data;
  } catch (error) {
    console.error('Ошибка получения зон карты:', error);
    return [];
  }
};

// Получение зон определенного типа
export const getAreasByType = async (type: AreaType): Promise<MapArea[]> => {
  try {
    const response = await axios.get(`${MAP_API}/areas/type/${type}`);
    return response.data;
  } catch (error) {
    console.error(`Ошибка получения зон типа ${type}:`, error);
    return [];
  }
};

// Получение доступных слоев карты
export const getMapLayers = async (): Promise<MapLayer[]> => {
  try {
    const response = await axios.get(`${MAP_API}/layers`);
    return response.data;
  } catch (error) {
    console.error('Ошибка получения слоев карты:', error);
    
    // Возвращаем стандартный слой, если не удалось получить слои с сервера
    return [
      {
        id: 'default',
        name: 'OpenStreetMap',
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        isDefault: true,
      },
    ];
  }
};

// Получение данных о маркере по ID
export const getMarkerById = async (id: string): Promise<MapMarker | null> => {
  try {
    const response = await axios.get(`${MAP_API}/markers/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Ошибка получения маркера ${id}:`, error);
    return null;
  }
};

// Получение данных о зоне по ID
export const getAreaById = async (id: string): Promise<MapArea | null> => {
  try {
    const response = await axios.get(`${MAP_API}/areas/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Ошибка получения зоны ${id}:`, error);
    return null;
  }
}; 