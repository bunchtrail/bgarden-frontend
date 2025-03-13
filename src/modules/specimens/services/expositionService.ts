import axios, { AxiosInstance } from 'axios';

// Интерфейс для объекта данных экспозиции
export interface ExpositionDto {
  id: number;
  name: string;
  description?: string;
  location?: string;
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

// Класс для работы с API экспозиций
class ExpositionService {
    // Получить все экспозиции
    async getAllExpositions(): Promise<ExpositionDto[]> {
        const response = await api.get<ExpositionDto[]>('/api/Exposition');
        return response.data;
    }

    // Получить экспозицию по ID
    async getExpositionById(id: number): Promise<ExpositionDto> {
        const response = await api.get<ExpositionDto>(`/api/Exposition/${id}`);
        return response.data;
    }

    // Получить экспозицию по имени
    async getExpositionByName(name: string): Promise<ExpositionDto> {
        const response = await api.get<ExpositionDto>(`/api/Exposition/name/${name}`);
        return response.data;
    }

    // Создать новую экспозицию
    async createExposition(exposition: Omit<ExpositionDto, 'id'>): Promise<ExpositionDto> {
        const response = await api.post<ExpositionDto>('/api/Exposition', exposition);
        return response.data;
    }

    // Обновить существующую экспозицию
    async updateExposition(id: number, exposition: ExpositionDto): Promise<ExpositionDto> {
        const response = await api.put<ExpositionDto>(`/api/Exposition/${id}`, exposition);
        return response.data;
    }

    // Удалить экспозицию
    async deleteExposition(id: number): Promise<boolean> {
        const response = await api.delete(`/api/Exposition/${id}`);
        return response.status === 200;
    }
}

// Экспортируем экземпляр сервиса для использования в приложении
export const expositionService = new ExpositionService(); 