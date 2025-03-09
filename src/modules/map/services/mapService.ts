import axios from 'axios';
import { AreaType, CreateMapAreaDto, CreateMapLayerDto, CreateMapMarkerDto, CreateMapOptionsDto, MapArea, MapLayer, MapMarker, MapOptions, MarkerType, UpdateMapAreaDto, UpdateMapLayerDto, UpdateMapMarkerDto, UpdateMapOptionsDto, CustomMapSchema, CreateCustomMapSchemaDto, UpdateCustomMapSchemaDto } from '../types';

// Базовый URL API
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:7254/api';

// API для работы с картой
const MAP_API = `${API_URL}/map`;

// --------------- Маркеры ---------------

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

// Создание нового маркера
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

// Поиск маркеров поблизости
export const findNearbyMarkers = async (
  latitude: number, 
  longitude: number,
  radiusInMeters: number = 100
): Promise<MapMarker[]> => {
  try {
    const response = await axios.get(`${MAP_API}/markers/nearby`, {
      params: { latitude, longitude, radiusInMeters }
    });
    return response.data;
  } catch (error) {
    console.error('Ошибка поиска ближайших маркеров:', error);
    return [];
  }
};

// --------------- Области (зоны) ---------------

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

// Получение зоны по ID
export const getAreaById = async (id: number): Promise<MapArea | null> => {
  try {
    const response = await axios.get(`${MAP_API}/areas/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Ошибка получения зоны ${id}:`, error);
    return null;
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

// Создание новой зоны
export const createArea = async (areaData: CreateMapAreaDto): Promise<MapArea | null> => {
  try {
    const response = await axios.post(`${MAP_API}/areas`, areaData);
    return response.data;
  } catch (error) {
    console.error('Ошибка создания зоны:', error);
    return null;
  }
};

// Обновление зоны
export const updateArea = async (areaData: UpdateMapAreaDto): Promise<MapArea | null> => {
  try {
    const response = await axios.put(`${MAP_API}/areas`, areaData);
    return response.data;
  } catch (error) {
    console.error('Ошибка обновления зоны:', error);
    return null;
  }
};

// Удаление зоны
export const deleteArea = async (id: number): Promise<boolean> => {
  try {
    await axios.delete(`${MAP_API}/areas/${id}`);
    return true;
  } catch (error) {
    console.error(`Ошибка удаления зоны ${id}:`, error);
    return false;
  }
};

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
  } catch (error) {
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
  } catch (error) {
    console.error('Ошибка получения слоев карты:', error);
    return [];
  }
};

// Получение слоя по ID
export const getLayerById = async (id: number): Promise<MapLayer | null> => {
  try {
    const response = await axios.get(`${MAP_API}/layers/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Ошибка получения слоя карты ${id}:`, error);
    return null;
  }
};

// Получение слоя по умолчанию
export const getDefaultLayer = async (): Promise<MapLayer | null> => {
  try {
    const response = await axios.get(`${MAP_API}/layers/default`);
    return response.data;
  } catch (error) {
    console.error('Ошибка получения слоя карты по умолчанию:', error);
    return null;
  }
};

// Создание слоя карты
export const createLayer = async (layerData: CreateMapLayerDto): Promise<MapLayer | null> => {
  try {
    const response = await axios.post(`${MAP_API}/layers`, layerData);
    return response.data;
  } catch (error) {
    console.error('Ошибка создания слоя карты:', error);
    return null;
  }
};

// Обновление слоя карты
export const updateLayer = async (layerData: UpdateMapLayerDto): Promise<MapLayer | null> => {
  try {
    const response = await axios.put(`${MAP_API}/layers`, layerData);
    return response.data;
  } catch (error) {
    console.error('Ошибка обновления слоя карты:', error);
    return null;
  }
};

// Удаление слоя карты
export const deleteLayer = async (id: number): Promise<boolean> => {
  try {
    await axios.delete(`${MAP_API}/layers/${id}`);
    return true;
  } catch (error) {
    console.error(`Ошибка удаления слоя карты ${id}:`, error);
    return false;
  }
};

// --------------- Регионы ---------------

// Получение всех регионов
export const getRegions = async (): Promise<any[]> => {
  try {
    const response = await axios.get(`${API_URL}/region`);
    return response.data;
  } catch (error) {
    console.error('Ошибка получения регионов:', error);
    return [];
  }
};

// Получение региона по ID
export const getRegionById = async (id: number): Promise<any | null> => {
  try {
    const response = await axios.get(`${API_URL}/region/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Ошибка получения региона ${id}:`, error);
    return null;
  }
};

// Получение экземпляров в регионе
export const getSpecimensInRegion = async (regionId: number): Promise<any[]> => {
  try {
    const response = await axios.get(`${API_URL}/region/${regionId}/specimens`);
    return response.data;
  } catch (error) {
    console.error(`Ошибка получения экземпляров в регионе ${regionId}:`, error);
    return [];
  }
};

// --------------- Пользовательские схемы карты ---------------

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
    // Создаем FormData для отправки файла (если он есть)
    const formData = new FormData();
    formData.append('id', schemaData.id.toString());
    formData.append('name', schemaData.name);
    if (schemaData.description) {
      formData.append('description', schemaData.description);
    }
    if (schemaData.image) {
      formData.append('image', schemaData.image);
    }
    if (schemaData.bounds) {
      formData.append('southBound', schemaData.bounds[0][0].toString());
      formData.append('westBound', schemaData.bounds[0][1].toString());
      formData.append('northBound', schemaData.bounds[1][0].toString());
      formData.append('eastBound', schemaData.bounds[1][1].toString());
    }
    if (schemaData.isActive !== undefined) {
      formData.append('isActive', schemaData.isActive.toString());
    }

    const response = await axios.put(`${MAP_API}/schemas`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Ошибка обновления пользовательской схемы карты:', error);
    return null;
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