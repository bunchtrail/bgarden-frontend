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
    // Получить все записи фенологии
    async getAllPhenologies(): Promise<PhenologyDto[]> {
        const response = await api.get<PhenologyDto[]>('/api/Phenology');
        return response.data;
    }

    // Получить запись фенологии по ID
    async getPhenologyById(id: number): Promise<PhenologyDto> {
        const response = await api.get<PhenologyDto>(`/api/Phenology/${id}`);
        return response.data;
    }

    // Получить записи фенологии для конкретного образца
    async getPhenologiesBySpecimenId(specimenId: number): Promise<PhenologyDto[]> {
        const response = await api.get<PhenologyDto[]>(`/api/Phenology/specimen/${specimenId}`);
        return response.data;
    }

    // Получить записи фенологии за определенный год
    async getPhenologiesByYear(year: number): Promise<PhenologyDto[]> {
        const response = await api.get<PhenologyDto[]>(`/api/Phenology/year/${year}`);
        return response.data;
    }

    // Создать новую запись фенологии
    async createPhenology(phenology: Omit<PhenologyDto, 'id'>): Promise<PhenologyDto> {
        const response = await api.post<PhenologyDto>('/api/Phenology', phenology);
        return response.data;
    }

    // Обновить существующую запись фенологии
    async updatePhenology(id: number, phenology: PhenologyDto): Promise<PhenologyDto> {
        const response = await api.put<PhenologyDto>(`/api/Phenology/${id}`, phenology);
        return response.data;
    }

    // Удалить запись фенологии
    async deletePhenology(id: number): Promise<boolean> {
        const response = await api.delete(`/api/Phenology/${id}`);
        return response.status === 204;
    }
}

// Экспортируем экземпляр сервиса для использования в приложении
export const phenologyService = new PhenologyService(); 