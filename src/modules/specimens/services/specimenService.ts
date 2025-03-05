import axios, { AxiosInstance } from 'axios';
import { SectorType, Specimen } from '../types';

// Используем тот же базовый URL, что и в authService
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

// Интерфейс для работы с API образцов растений
class SpecimenService {
    // Получить все образцы
    async getAllSpecimens(): Promise<Specimen[]> {
        const response = await api.get<Specimen[]>('/Specimen');
        return response.data;
    }

    // Получить образцы по типу сектора
    async getSpecimensBySectorType(sectorType: SectorType): Promise<Specimen[]> {
        const response = await api.get<Specimen[]>(`/Specimen/sector/${sectorType}`);
        return response.data;
    }

    // Получить образец по ID
    async getSpecimenById(id: number): Promise<Specimen> {
        const response = await api.get<Specimen>(`/Specimen/${id}`);
        return response.data;
    }

    // Создать новый образец
    async createSpecimen(specimen: Omit<Specimen, 'id'>): Promise<Specimen> {
        // Подготавливаем данные согласно требуемому формату API
        const specimenData = {
            id: 0, // API ожидает id=0 для новых записей
            ...specimen
        };
        
        console.log('Отправляем данные в API:', JSON.stringify(specimenData, null, 2));
        
        const response = await api.post<Specimen>('/Specimen', specimenData);
        return response.data;
    }

    // Обновить существующий образец
    async updateSpecimen(id: number, specimen: Specimen): Promise<Specimen> {
        // Проверяем, что ID в объекте соответствует ID в URL
        const specimenData = {
            ...specimen,
            id: id // Убедимся, что ID правильный
        };
        
        console.log('Обновляем данные в API:', JSON.stringify(specimenData, null, 2));
        
        const response = await api.put<Specimen>(`/Specimen/${id}`, specimenData);
        return response.data;
    }

    // Удалить образец
    async deleteSpecimen(id: number): Promise<boolean> {
        const response = await api.delete(`/Specimen/${id}`);
        return response.status === 204;
    }
}

// Экспортируем экземпляр сервиса для использования в приложении
export const specimenService = new SpecimenService(); 