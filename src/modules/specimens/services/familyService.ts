import axios, { AxiosInstance } from 'axios';

// Интерфейс для объекта данных семейства
export interface FamilyDto {
  id: number;
  name: string;
  latinName?: string;
  description?: string;
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

// Класс для работы с API семейств растений
class FamilyService {
    // Получить все семейства
    async getAllFamilies(): Promise<FamilyDto[]> {
        const response = await api.get<FamilyDto[]>('/Family');
        return response.data;
    }

    // Получить семейство по ID
    async getFamilyById(id: number): Promise<FamilyDto> {
        const response = await api.get<FamilyDto>(`/Family/${id}`);
        return response.data;
    }

    // Получить семейство по названию
    async getFamilyByName(name: string): Promise<FamilyDto> {
        const response = await api.get<FamilyDto>(`/Family/name/${encodeURIComponent(name)}`);
        return response.data;
    }

    // Создать новое семейство
    async createFamily(family: Omit<FamilyDto, 'id'>): Promise<FamilyDto> {
        const response = await api.post<FamilyDto>('/Family', family);
        return response.data;
    }

    // Обновить существующее семейство
    async updateFamily(id: number, family: FamilyDto): Promise<FamilyDto> {
        const response = await api.put<FamilyDto>(`/Family/${id}`, family);
        return response.data;
    }

    // Удалить семейство
    async deleteFamily(id: number): Promise<boolean> {
        const response = await api.delete(`/Family/${id}`);
        return response.status === 204;
    }
}

// Экспортируем экземпляр сервиса для использования в приложении
export const familyService = new FamilyService(); 