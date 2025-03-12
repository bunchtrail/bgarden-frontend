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
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:7254';

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
        try {
            const response = await api.get<RegionDto[]>('/api/Region');
            
            // Если API вернул пустой список или произошла ошибка, используем временные данные
            if (!response.data || response.data.length === 0) {
                console.log('API вернул пустой список регионов, используем временные данные');
                return this.getDefaultRegions();
            }
            
            return response.data;
        } catch (error) {
            console.error('Ошибка при получении списка регионов:', error);
            // В случае ошибки также возвращаем временные данные
            return this.getDefaultRegions();
        }
    }
    
    // Метод для получения стандартных регионов, если API не работает
    private getDefaultRegions(): RegionDto[] {
        const defaultRegions = [
            { id: 1, name: "Европа", description: "Европейская часть" },
            { id: 2, name: "Азия", description: "Азиатская часть" },
            { id: 3, name: "Северная Америка", description: "Североамериканская часть" },
            { id: 4, name: "Южная Америка", description: "Южноамериканская часть" },
            { id: 5, name: "Африка", description: "Африканская часть" },
            { id: 6, name: "Австралия", description: "Австралия и Океания" }
        ];
        console.log('Возвращаю дефолтные регионы:', defaultRegions);
        return defaultRegions;
    }

    // Получить регион по ID
    async getRegionById(id: number): Promise<RegionDto> {
        const response = await api.get<RegionDto>(`/api/Region/${id}`);
        return response.data;
    }

    // Получить список экземпляров растений в регионе
    async getSpecimensInRegion(regionId: number): Promise<Specimen[]> {
        const response = await api.get<Specimen[]>(`/api/Region/${regionId}/specimens`);
        return response.data;
    }

    // Сопоставить секторы с регионами (временное решение, пока API не возвращает правильные данные)
    getSectorRegionMapping(sectorData: any[]): Record<number, RegionDto> {
        // Временное сопоставление секторов и регионов
        const sectorToRegion: Record<number, RegionDto> = {};
        
        // Пример: сектор с ID 1 соответствует региону "Европа"
        sectorToRegion[1] = { id: 1, name: "Европа", description: "Европейская часть" };
        
        // Сектор с ID 2 соответствует региону "Азия"
        sectorToRegion[2] = { id: 2, name: "Азия", description: "Азиатская часть" };
        
        // Сектор с ID 3 соответствует региону "Северная Америка"
        sectorToRegion[3] = { id: 3, name: "Северная Америка", description: "Североамериканская часть" };
        
        return sectorToRegion;
    }

    // Создать новый регион
    async createRegion(region: Omit<RegionDto, 'id'>): Promise<RegionDto> {
        const response = await api.post<RegionDto>('/api/Region', region);
        return response.data;
    }

    // Обновить существующий регион
    async updateRegion(id: number, region: RegionDto): Promise<RegionDto> {
        const response = await api.put<RegionDto>(`/api/Region/${id}`, region);
        return response.data;
    }

    // Удалить регион
    async deleteRegion(id: number): Promise<boolean> {
        const response = await api.delete(`/api/Region/${id}`);
        return response.status === 204;
    }
}

// Экспортируем экземпляр сервиса для использования в приложении
export const regionService = new RegionService(); 