import httpClient from '../../../services/httpClient';
import { SectorType, Specimen } from '../types';

// Интерфейс для работы с API образцов растений
class SpecimenService {
    // Получить все образцы
    async getAllSpecimens(): Promise<Specimen[]> {
        return httpClient.get<Specimen[]>('Specimen');
    }

    // Получить образцы по типу сектора
    async getSpecimensBySectorType(sectorType: SectorType): Promise<Specimen[]> {
        return httpClient.get<Specimen[]>(`Specimen/sector/${sectorType}`);
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