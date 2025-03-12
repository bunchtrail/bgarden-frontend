import axios, { AxiosInstance } from 'axios';

// Интерфейс для объекта данных биометрии
export interface BiometryDto {
  id: number;
  specimenId: number;
  specimenInfo?: string;
  measurementDate: Date;
  height?: number;
  flowerDiameter?: number;
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

// Класс для работы с API биометрии растений
class BiometryService {
    // Получить все записи биометрии
    async getAllBiometries(): Promise<BiometryDto[]> {
        const response = await api.get<BiometryDto[]>('/api/Biometry');
        return response.data;
    }

    // Получить запись биометрии по ID
    async getBiometryById(id: number): Promise<BiometryDto> {
        const response = await api.get<BiometryDto>(`/api/Biometry/${id}`);
        return response.data;
    }

    // Получить записи биометрии для конкретного образца
    async getBiometriesBySpecimenId(specimenId: number): Promise<BiometryDto[]> {
        const response = await api.get<BiometryDto[]>(`/api/Biometry/specimen/${specimenId}`);
        return response.data;
    }

    // Создать новую запись биометрии
    async createBiometry(biometry: Omit<BiometryDto, 'id'>): Promise<BiometryDto> {
        const response = await api.post<BiometryDto>('/api/Biometry', biometry);
        return response.data;
    }

    // Обновить существующую запись биометрии
    async updateBiometry(id: number, biometry: BiometryDto): Promise<BiometryDto> {
        const response = await api.put<BiometryDto>(`/api/Biometry/${id}`, biometry);
        return response.data;
    }

    // Удалить запись биометрии
    async deleteBiometry(id: number): Promise<boolean> {
        const response = await api.delete(`/api/Biometry/${id}`);
        return response.status === 204;
    }
}

// Экспортируем экземпляр сервиса для использования в приложении
export const biometryService = new BiometryService(); 