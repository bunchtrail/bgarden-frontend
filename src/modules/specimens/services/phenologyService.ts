import axios, { AxiosInstance } from 'axios';

// Интерфейс для объекта данных фенологии
export interface PhenologyDto {
  id: number;
  specimenId: number;
  specimenInfo?: string;
  year: number;
  floweringStart?: Date;
  floweringEnd?: Date;
  fruitingDate?: Date;
  notes?: string;
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

// Класс для работы с API фенологии растений
class PhenologyService {
    // Получить все фенологические данные
    async getAllPhenologyRecords(): Promise<PhenologyDto[]> {
        const response = await api.get<PhenologyDto[]>('/Phenology');
        return response.data;
    }

    // Получить фенологию по ID
    async getPhenologyById(id: number): Promise<PhenologyDto> {
        const response = await api.get<PhenologyDto>(`/Phenology/${id}`);
        return response.data;
    }

    // Получить фенологии для образца
    async getPhenologyForSpecimen(specimenId: number): Promise<PhenologyDto[]> {
        const response = await api.get<PhenologyDto[]>(`/Phenology/specimen/${specimenId}`);
        return response.data;
    }

    // Создать новую фенологическую запись
    async createPhenology(phenology: Omit<PhenologyDto, 'id'>): Promise<PhenologyDto> {
        const response = await api.post<PhenologyDto>('/Phenology', phenology);
        return response.data;
    }

    // Обновить фенологическую запись
    async updatePhenology(id: number, phenology: PhenologyDto): Promise<PhenologyDto> {
        const response = await api.put<PhenologyDto>(`/Phenology/${id}`, phenology);
        return response.data;
    }

    // Удалить фенологическую запись
    async deletePhenology(id: number): Promise<boolean> {
        const response = await api.delete(`/Phenology/${id}`);
        return response.status === 200;
    }
}

// Экспортируем экземпляр сервиса для использования в приложении
export const phenologyService = new PhenologyService(); 