import httpClient from '../../../services/httpClient';
import { SectorType, Specimen, SpecimenImage, BatchImageUploadResult } from '../types/index';
import { updateSpecimensCount } from '@/services/regions';



// Интерфейс для результатов массовой загрузки изображений
export interface BatchSpecimenImageResultDto {
    specimenId: number;
    successCount: number;
    errorCount: number;
    uploadedImageIds: number[];
    errorMessages: string[];
}

// Интерфейс для обновления местоположения
export interface LocationUpdateDto {
    locationType: number;
    latitude?: number | null;
    longitude?: number | null;
    mapId?: number | null;
    mapX?: number | null;
    mapY?: number | null;
}

// Новый интерфейс для объединенной загрузки изображений
export interface UploadImageOptions {
  isMain?: boolean;
  description?: string;
  onProgress?: (progress: number) => void;
}

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
            
            console.log('Отправка запроса на создание образца:', {
                url: 'Specimen',
                method: 'POST',
                data: JSON.stringify(specimenData, null, 2)
            });
            
            // Используем httpClient для отправки запроса
            const createdSpecimen = await httpClient.post<Specimen>('Specimen', specimenData);
            
            console.log('Ответ сервера после создания образца:', JSON.stringify(createdSpecimen, null, 2));
            
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

    async createSpecimenWithImages(specimen: Omit<Specimen, 'id'>, images: File[]): Promise<{ specimen: Specimen; imageIds: number[] }> {
        const specimenData = {
            id: 0,
            ...specimen,
            sectorType: Number(specimen.sectorType)
        } as Record<string, any>;
        const formData = new FormData();
        for (const [key, value] of Object.entries(specimenData)) {
            if (value !== undefined && value !== null) {
                formData.append(key, String(value));
            }
        }
        images.forEach(img => formData.append('images', img, img.name));
        const result = await httpClient.post<{ specimen: Specimen; imageIds: number[] }>('Specimen/with-images', formData);
        if (result.specimen.regionId) {
            await updateSpecimensCount(result.specimen.regionId, true);
        }
        return result;
    }
    // Обновить существующий образец
    async updateSpecimen(id: number, specimen: Specimen): Promise<Specimen> {
        return httpClient.put<Specimen>(`Specimen/${id}`, specimen);
    }

    // Получить основное изображение образца по ID
    async getSpecimenMainImage(specimenId: number): Promise<SpecimenImage | null> {
        try {
            return await httpClient.get<SpecimenImage>(
                `specimen-images/by-specimen/${specimenId}/main`,
                { suppressErrorsForStatus: [404] } // Подавляем ошибку 404
            );
        } catch (error) {
            // Для 404 не выводим ошибку в консоль
            if (error && typeof error === 'object' && 'status' in error && error.status === 404) {
                return null;
            }
            console.error(`Ошибка при получении изображения для образца с ID ${specimenId}:`, error);
            return null;
        }
    }

    // Получить все изображения образца
    async getSpecimenImages(specimenId: number, includeImageData: boolean = false): Promise<SpecimenImage[]> {
        try {
            return await httpClient.get<SpecimenImage[]>(
                `specimen-images/by-specimen/${specimenId}?includeImageData=${includeImageData}`,
                { suppressErrorsForStatus: [404] } // Подавляем ошибку 404
            );
        } catch (error) {
            // Для 404 не выводим ошибку в консоль
            if (error && typeof error === 'object' && 'status' in error && error.status === 404) {
                return [];
            }
            console.error(`Ошибка при получении изображений образца с ID ${specimenId}:`, error);
            return [];
        }
    }
    
    // Получить изображение по ID
    async getSpecimenImageById(imageId: number): Promise<SpecimenImage | null> {
        try {
            return await httpClient.get<SpecimenImage>(`specimen-images/${imageId}`);
        } catch (error) {
            console.error(`Ошибка при получении изображения с ID ${imageId}:`, error);
            return null;
        }
    }
    
    // Удалить изображение
    async deleteSpecimenImage(id: number): Promise<boolean> {
        try {
            await httpClient.delete(`specimen-images/${id}`);
            console.log(`Изображение с ID ${id} успешно удалено`);
            return true;
        } catch (error) {
            console.error(`Ошибка при удалении изображения с ID ${id}:`, error);
            return false;
        }
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

    // Обновить местоположение образца
    async updateSpecimenLocation(id: number, locationData: LocationUpdateDto): Promise<Specimen> {
        try {
            console.log('Отправка запроса на обновление местоположения образца:', {
                url: `Specimen/${id}/location`,
                method: 'PUT',
                data: JSON.stringify(locationData, null, 2)
            });
            
            const result = await httpClient.put<Specimen>(`Specimen/${id}/location`, locationData);
            
            console.log('Ответ сервера после обновления местоположения:', JSON.stringify(result, null, 2));
            
            return result;
        } catch (error) {
            console.error('Ошибка при обновлении местоположения образца:', error);
            throw error;
        }
    }
}

// Экспортируем экземпляр сервиса для использования в приложении
export const specimenService = new SpecimenService(); 