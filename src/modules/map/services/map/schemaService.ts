import axios from 'axios';
import { CreateCustomMapSchemaDto, CustomMapSchema, UpdateCustomMapSchemaDto } from '../../types';

// Базовый URL API
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:7254/api';

// API для работы с картой
const MAP_API = `${API_URL}/map`;

// Получение всех пользовательских схем карты
export const getCustomMapSchemas = async (): Promise<CustomMapSchema[]> => {
  try {
    const response = await axios.get(`${MAP_API}/schemas`);
    return response.data;
  } catch (error) {
    console.error('Ошибка получения пользовательских схем карты:', error);
    return [];
  }
};

// Получение пользовательской схемы карты по ID
export const getCustomMapSchemaById = async (id: number): Promise<CustomMapSchema | null> => {
  try {
    const response = await axios.get(`${MAP_API}/schemas/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Ошибка получения пользовательской схемы карты ${id}:`, error);
    return null;
  }
};

// Получение активной пользовательской схемы карты
export const getActiveCustomMapSchema = async (): Promise<CustomMapSchema | null> => {
  try {
    const response = await axios.get(`${MAP_API}/schemas/active`);
    return response.data;
  } catch (error) {
    console.error('Ошибка получения активной пользовательской схемы карты:', error);
    return null;
  }
};

// Загрузка новой пользовательской схемы карты
export const uploadCustomMapSchema = async (schemaData: CreateCustomMapSchemaDto): Promise<CustomMapSchema | null> => {
  try {
    // Создаем FormData для отправки файла
    const formData = new FormData();
    formData.append('name', schemaData.name);
    if (schemaData.description) {
      formData.append('description', schemaData.description);
    }
    formData.append('image', schemaData.image);
    formData.append('southBound', schemaData.bounds[0][0].toString());
    formData.append('westBound', schemaData.bounds[0][1].toString());
    formData.append('northBound', schemaData.bounds[1][0].toString());
    formData.append('eastBound', schemaData.bounds[1][1].toString());

    const response = await axios.post(`${MAP_API}/schemas/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Ошибка загрузки пользовательской схемы карты:', error);
    return null;
  }
};

// Обновление пользовательской схемы карты
export const updateCustomMapSchema = async (schemaData: UpdateCustomMapSchemaDto): Promise<CustomMapSchema | null> => {
  try {
    const response = await axios.put(`${MAP_API}/schemas`, schemaData);
    return response.data;
  } catch (error) {
    console.error('Ошибка обновления пользовательской схемы карты:', error);
    return null;
  }
};

// Активация пользовательской схемы карты
export const activateCustomMapSchema = async (id: number): Promise<boolean> => {
  try {
    await axios.post(`${MAP_API}/schemas/${id}/activate`);
    return true;
  } catch (error) {
    console.error(`Ошибка активации пользовательской схемы карты ${id}:`, error);
    return false;
  }
};

// Деактивация пользовательской схемы карты
export const deactivateCustomMapSchema = async (): Promise<boolean> => {
  try {
    await axios.post(`${MAP_API}/schemas/deactivate`);
    return true;
  } catch (error) {
    console.error('Ошибка деактивации пользовательской схемы карты:', error);
    return false;
  }
};

// Удаление пользовательской схемы карты
export const deleteCustomMapSchema = async (id: number): Promise<boolean> => {
  try {
    await axios.delete(`${MAP_API}/schemas/${id}`);
    return true;
  } catch (error) {
    console.error(`Ошибка удаления пользовательской схемы карты ${id}:`, error);
    return false;
  }
}; 