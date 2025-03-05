import axios, { AxiosInstance } from 'axios';
import { Specimen } from '../types';

// Интерфейс для объекта данных региона
export interface RegionDto {
  id: number;
  name: string;
  description?: string;
  climate?: string;
}

// Используем тот же базовый URL, что и в других сервисах
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

// Добавляем перехватчик запросов для добавления токена авторизации
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Класс для работы с API регионов
class RegionService {
    // Получить все регионы
    async getAllRegions(): Promise<RegionDto[]> {
        const response = await api.get<RegionDto[]>('/Region');
        return response.data;
    }

    // Получить регион по ID
    async getRegionById(id: number): Promise<RegionDto> {
        const response = await api.get<RegionDto>(`/Region/${id}`);
        return response.data;
    }

    // Получить список экземпляров растений в регионе
    async getSpecimensInRegion(regionId: number): Promise<Specimen[]> {
        const response = await api.get<Specimen[]>(`/Region/${regionId}/specimens`);
        return response.data;
    }

    // Создать новый регион
    async createRegion(region: Omit<RegionDto, 'id'>): Promise<RegionDto> {
        const response = await api.post<RegionDto>('/Region', region);
        return response.data;
    }

    // Обновить существующий регион
    async updateRegion(id: number, region: RegionDto): Promise<RegionDto> {
        const response = await api.put<RegionDto>(`/Region/${id}`, region);
        return response.data;
    }

    // Удалить регион
    async deleteRegion(id: number): Promise<boolean> {
        const response = await api.delete(`/Region/${id}`);
        return response.status === 204;
    }
}

// Экспортируем экземпляр сервиса для использования в приложении
export const regionService = new RegionService(); 