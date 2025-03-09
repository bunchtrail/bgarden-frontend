import axios from 'axios';
import { AreaType, CreateMapAreaDto, MapArea, UpdateMapAreaDto } from '../../types';

// Базовый URL API
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:7254/api';

// API для работы с картой
const MAP_API = `${API_URL}/map`;

// Получение всех областей на карте
export const getMapAreas = async (): Promise<MapArea[]> => {
  try {
    const response = await axios.get(`${MAP_API}/areas`);
    return response.data;
  } catch (error) {
    console.error('Ошибка получения областей карты:', error);
    return [];
  }
};

// Получение области по ID
export const getAreaById = async (id: number): Promise<MapArea | null> => {
  try {
    const response = await axios.get(`${MAP_API}/areas/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Ошибка получения области ${id}:`, error);
    return null;
  }
};

// Получение областей определенного типа
export const getAreasByType = async (type: AreaType): Promise<MapArea[]> => {
  try {
    const response = await axios.get(`${MAP_API}/areas/type/${type}`);
    return response.data;
  } catch (error) {
    console.error(`Ошибка получения областей типа ${type}:`, error);
    return [];
  }
};

// Создание новой области
export const createArea = async (areaData: CreateMapAreaDto): Promise<MapArea | null> => {
  try {
    const response = await axios.post(`${MAP_API}/areas`, areaData);
    return response.data;
  } catch (error) {
    console.error('Ошибка создания области:', error);
    return null;
  }
};

// Обновление области
export const updateArea = async (areaData: UpdateMapAreaDto): Promise<MapArea | null> => {
  try {
    const response = await axios.put(`${MAP_API}/areas`, areaData);
    return response.data;
  } catch (error) {
    console.error('Ошибка обновления области:', error);
    return null;
  }
};

// Удаление области
export const deleteArea = async (id: number): Promise<boolean> => {
  try {
    await axios.delete(`${MAP_API}/areas/${id}`);
    return true;
  } catch (error) {
    console.error(`Ошибка удаления области ${id}:`, error);
    return false;
  }
}; 