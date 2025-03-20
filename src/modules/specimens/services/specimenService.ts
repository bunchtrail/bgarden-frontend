import httpClient from '../../../services/httpClient';
import { SectorType, Specimen } from '../types/index';
import { updateSpecimensCount } from '../../map/services/regionService';

// Интерфейс для работы с API образцов растений
class SpecimenService {
    // Получить все образцы
    async getAllSpecimens(): Promise<Specimen[]> {
        try {
            // Используем httpClient вместо прямого fetch
            const data = await httpClient.get<Specimen[]>('Specimen/all', {
                // Подавляем логирование ошибки 404 (Not Found)
                suppressErrorsForStatus: [404]
            });
            
            // Преобразуем единичный объект в массив, если API вернуло один объект
            if (!Array.isArray(data)) {
                return [data as Specimen];
            }
            
            return data;
        } catch (error: any) {
            // Если получили 404, просто возвращаем пустой массив без логирования ошибки
            if (error && typeof error === 'object' && 'status' in error && error.status === 404) {
                return [];
            }
            
            console.error('Ошибка при получении всех образцов:', error);
            return [];
        }
    }

    // Получить образцы по типу сектора
    async getSpecimensBySectorType(sectorType: SectorType): Promise<Specimen[]> {
        try {
            // Используем httpClient вместо прямого fetch
            const data = await httpClient.get<Specimen[]>(`Specimen/sector/${sectorType}`, {
                // Устанавливаем необязательный timeout, чтобы запрос не висел слишком долго
                timeout: 5000,
                // Подавляем логирование ошибки 404 (Not Found)
                suppressErrorsForStatus: [404]
            });
            
            // Преобразуем единичный объект в массив, если API вернуло один объект
            if (!Array.isArray(data)) {
                return [data as Specimen];
            }
            
            return data;
        } catch (error: any) {
            // Если получили 404, просто возвращаем пустой массив без логирования ошибки
            if (error && typeof error === 'object' && 'status' in error && error.status === 404) {
                return [];
            }
            
            // Для других ошибок логируем и возвращаем пустой массив
            console.error('Ошибка при получении образцов для сектора:', error);
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
                ...specimen,
                // Убеждаемся, что sectorType передается как число
                sectorType: Number(specimen.sectorType)
            };
            
            // Используем httpClient для отправки запроса
            const createdSpecimen = await httpClient.post<Specimen>('Specimen', specimenData);
            
            // Обновляем счетчик образцов в области
            if (createdSpecimen.regionId) {
                await updateSpecimensCount(createdSpecimen.regionId, true);
            }
            
            return createdSpecimen;
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
        try {
            // Получаем информацию об образце перед удалением
            const specimen = await this.getSpecimenById(id);
            
            // Удаляем образец
            await httpClient.delete(`Specimen/${id}`);
            
            // Обновляем счетчик образцов в области
            if (specimen.regionId) {
                await updateSpecimensCount(specimen.regionId, false);
            }
            
            return true;
        } catch (error) {
            console.error('Ошибка при удалении образца:', error);
            throw error;
        }
    }
}

// Экспортируем экземпляр сервиса для использования в приложении
export const specimenService = new SpecimenService(); 