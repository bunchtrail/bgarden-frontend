import httpClient from '../../../services/httpClient';
import { SectorType, Specimen } from '../types/index';

// Интерфейс для работы с API образцов растений
class SpecimenService {
    // Получить образцы по типу сектора
    async getSpecimensBySectorType(sectorType: SectorType): Promise<Specimen[]> {
        try {
            console.log(`Запрос образцов для сектора типа: ${sectorType}`);
            
            // Используем прямой fetch вместо httpClient для предотвращения логирования 404 ошибок
            const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:7254/api';
            const url = `${API_BASE_URL}/Specimen/sector/${sectorType}`;
            
            // Получаем токен авторизации, если есть
            const token = localStorage.getItem('token');
            const headers: Record<string, string> = {
                'Content-Type': 'application/json',
                'Accept': 'application/json, text/plain'
            };
            
            if (token) {
                headers.Authorization = `Bearer ${token}`;
            }
            
            // Тихо обрабатываем ошибки, не логируя их в консоль
            const response = await fetch(url, {
                method: 'GET',
                headers,
                credentials: 'include'
            });
            
            // Если получили 404, просто возвращаем пустой массив
            if (response.status === 404) {
                console.log(`В секторе типа ${sectorType} нет растений.`);
                return [];
            }
            
            // Для других ошибок
            if (!response.ok) {
                throw new Error(`Ошибка запроса: ${response.status} ${response.statusText}`);
            }
            
            // Обработка успешного ответа
            const data = await response.json();
            
            // Преобразуем единичный объект в массив, если API вернуло один объект
            if (!Array.isArray(data)) {
                console.log('API вернуло один объект, преобразуем в массив');
                return [data as Specimen];
            }
            
            return data;
        } catch (error) {
            console.error('Ошибка при получении образцов для сектора:', error);
            // Скрываем ошибку от внешнего кода, чтобы не выводить ее на страницу
            return [];
        }
    }

    // Получить образец по ID
    async getSpecimenById(id: number): Promise<Specimen> {
        return httpClient.get<Specimen>(`Specimen/${id}`);
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
            
            // Используем httpClient для отправки запроса
            return httpClient.post<Specimen>('Specimen', specimenData);
        } catch (error: any) {
            console.error('Ошибка при создании образца растения:', error);
            
            // Расширенное логирование ошибок
            if (error.status) {
                console.error('Детали ошибки от сервера:', {
                    status: error.status,
                    message: error.message,
                    data: error.data
                });
            } else {
                console.error('Ошибка запроса:', error.message || 'Неизвестная ошибка');
            }
            
            throw error;
        }
    }

    // Обновить существующий образец
    async updateSpecimen(id: number, specimen: Specimen): Promise<Specimen> {
        return httpClient.put<Specimen>(`Specimen/${id}`, specimen);
    }

    // Удалить образец
    async deleteSpecimen(id: number): Promise<boolean> {
        await httpClient.delete(`Specimen/${id}`);
        return true;
    }
}

// Экспортируем экземпляр сервиса для использования в приложении
export const specimenService = new SpecimenService(); 