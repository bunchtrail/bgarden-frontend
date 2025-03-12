import axios, { AxiosInstance } from 'axios';
import { SectorType, Specimen } from '../types';

// Используем тот же базовый URL, что и в authService
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
        try {
            // Подготавливаем данные согласно требуемому формату API
            const specimenData = {
                id: 0, // API ожидает id=0 для новых записей
                ...specimen
            };
            
            console.log('Отправляем данные в API:', JSON.stringify(specimenData, null, 2));
            console.log('URL запроса:', `${API_URL}/Specimen`);
            console.log('Заголовки запроса:', {
                'Content-Type': 'application/json',
                'Accept': 'text/plain',
                'Authorization': localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : 'Токен отсутствует'
            });
            
            const response = await api.post<Specimen>('/Specimen', specimenData);
            console.log('Ответ сервера:', response.status, response.statusText);
            console.log('Данные ответа:', response.data);
            return response.data;
        } catch (error: any) {
            console.error('Ошибка при создании образца растения:', error);
            
            // Расширенное логирование ошибок
            if (error.response) {
                console.error('Детали ошибки от сервера:', {
                    status: error.response.status,
                    statusText: error.response.statusText,
                    data: error.response.data
                });
            } else if (error.request) {
                console.error('Запрос был отправлен, но ответ не получен:', error.request);
            } else {
                console.error('Ошибка запроса:', error.message);
            }
            
            // Пробуем другой метод отправки данных через fetch API
            try {
                console.log('Пробуем отправить через fetch API');
                const token = localStorage.getItem('token');
                const fetchResponse = await fetch(`${API_URL}/Specimen`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'text/plain',
                        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        id: 0,
                        ...specimen
                    })
                });
                
                if (fetchResponse.ok) {
                    const data = await fetchResponse.json();
                    console.log('Успешный ответ через fetch:', data);
                    return data;
                } else {
                    console.error('Fetch вернул ошибку:', fetchResponse.status, fetchResponse.statusText);
                    const errorText = await fetchResponse.text();
                    console.error('Текст ошибки:', errorText);
                }
            } catch (fetchError) {
                console.error('Ошибка при использовании fetch:', fetchError);
            }
            
            throw error;
        }
    }

    // Обновить существующий образец
    async updateSpecimen(id: number, specimen: Specimen): Promise<Specimen> {
        const response = await api.put<Specimen>(`/Specimen/${id}`, specimen);
        return response.data;
    }

    // Удалить образец
    async deleteSpecimen(id: number): Promise<boolean> {
        const response = await api.delete(`/Specimen/${id}`);
        return response.status === 200;
    }
}

// Экспортируем экземпляр сервиса для использования в приложении
export const specimenService = new SpecimenService(); 