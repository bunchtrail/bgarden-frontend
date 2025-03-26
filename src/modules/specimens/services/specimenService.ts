import httpClient from '../../../services/httpClient';
import { SectorType, Specimen, SpecimenImage, BatchImageUploadResult } from '../types/index';
import { updateSpecimensCount } from '@/services/regions';

// Интерфейс для создания изображения (JSON запрос)
export interface CreateSpecimenImageDto {
    specimenId: number;
    imageDataBase64: string;
    contentType: string;
    description?: string;
    isMain?: boolean;
}

// Интерфейс для создания изображения с бинарными данными
export interface CreateSpecimenImageBinaryDto {
    specimenId: number;
    imageData: Uint8Array;
    contentType: string;
    description?: string;
    isMain?: boolean;
}

// Интерфейс для обновления изображения
export interface UpdateSpecimenImageDto {
    description?: string;
    isMain?: boolean;
}

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

    // Обновить существующий образец
    async updateSpecimen(id: number, specimen: Specimen): Promise<Specimen> {
        return httpClient.put<Specimen>(`Specimen/${id}`, specimen);
    }

    // Получить основное изображение образца по ID
    async getSpecimenMainImage(specimenId: number): Promise<SpecimenImage | null> {
        try {
            return await httpClient.get<SpecimenImage>(`v1/specimen-images/by-specimen/${specimenId}/main`);
        } catch (error) {
            console.error(`Ошибка при получении изображения для образца с ID ${specimenId}:`, error);
            return null;
        }
    }

    // Получить все изображения образца
    async getSpecimenImages(specimenId: number, includeImageData: boolean = false): Promise<SpecimenImage[]> {
        try {
            return await httpClient.get<SpecimenImage[]>(
                `v1/specimen-images/by-specimen/${specimenId}?includeImageData=${includeImageData}`
            );
        } catch (error) {
            console.error(`Ошибка при получении изображений образца с ID ${specimenId}:`, error);
            return [];
        }
    }
    
    // Получить изображение по ID
    async getSpecimenImageById(imageId: number): Promise<SpecimenImage | null> {
        try {
            return await httpClient.get<SpecimenImage>(`v1/specimen-images/${imageId}`);
        } catch (error) {
            console.error(`Ошибка при получении изображения с ID ${imageId}:`, error);
            return null;
        }
    }
    
    // Загрузить новое изображение для образца
    async uploadSpecimenImage(imageData: CreateSpecimenImageDto): Promise<SpecimenImage> {
        try {
            console.log('Отправка запроса на создание изображения:', {
                url: 'v1/specimen-images',
                method: 'POST',
                data: { ...imageData, imageDataBase64: 'Base64 content (truncated for log)' }
            });
            
            const result = await httpClient.post<SpecimenImage>('v1/specimen-images', imageData);
            
            console.log('Ответ сервера после создания изображения:', {
                id: result.id,
                specimenId: result.specimenId,
                contentType: result.contentType,
                isMain: result.isMain
            });
            
            return result;
        } catch (error) {
            console.error('Ошибка при загрузке изображения образца:', error);
            throw error;
        }
    }
    
    // Обновить существующее изображение
    async updateSpecimenImage(id: number, updateData: UpdateSpecimenImageDto): Promise<SpecimenImage> {
        try {
            console.log('Отправка запроса на обновление изображения:', {
                url: `v1/specimen-images/${id}`,
                method: 'PUT',
                data: updateData
            });
            
            const result = await httpClient.put<SpecimenImage>(`v1/specimen-images/${id}`, updateData);
            
            console.log('Ответ сервера после обновления изображения:', {
                id: result.id,
                specimenId: result.specimenId,
                contentType: result.contentType,
                isMain: result.isMain
            });
            
            return result;
        } catch (error) {
            console.error(`Ошибка при обновлении изображения с ID ${id}:`, error);
            throw error;
        }
    }
    
    // Удалить изображение
    async deleteSpecimenImage(id: number): Promise<boolean> {
        try {
            await httpClient.delete(`v1/specimen-images/${id}`);
            console.log(`Изображение с ID ${id} успешно удалено`);
            return true;
        } catch (error) {
            console.error(`Ошибка при удалении изображения с ID ${id}:`, error);
            return false;
        }
    }
    
    // Установить изображение как основное
    async setSpecimenImageAsMain(id: number): Promise<boolean> {
        try {
            await httpClient.patch(`v1/specimen-images/${id}/set-as-main`);
            console.log(`Изображение с ID ${id} установлено как основное`);
            return true;
        } catch (error) {
            console.error(`Ошибка при установке изображения с ID ${id} как основного:`, error);
            return false;
        }
    }
    
    // Массовая загрузка изображений для образца
    async uploadMultipleImages(
        specimenId: number, 
        files: File[], 
        isMain: boolean = false,
        onProgress?: (progress: number) => void
    ): Promise<BatchImageUploadResult> {
        try {
            const formData = new FormData();
            formData.append('SpecimenId', specimenId.toString());
            formData.append('IsMain', isMain.toString());
            
            // Добавляем файлы в FormData
            files.forEach(file => {
                formData.append('Files', file, file.name);
                console.log(`Добавлено изображение для загрузки: ${file.name}, ${file.type}, ${file.size} байт`);
            });
            
            // Отправляем запрос
            const result = await httpClient.post<BatchImageUploadResult>(
                'v1/specimen-images/batch-upload',
                formData,
                {
                    onUploadProgress: (progressEvent) => {
                        if (onProgress && progressEvent.total) {
                            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                            onProgress(percentCompleted);
                        }
                    }
                }
            );
            
            console.log('Результат массовой загрузки изображений:', {
                specimenId: result.specimenId,
                successCount: result.successCount,
                errorCount: result.errorCount,
                uploadedImageIds: result.uploadedImageIds
            });
            
            return result;
        } catch (error) {
            console.error(`Ошибка при массовой загрузке изображений для образца с ID ${specimenId}:`, error);
            throw error;
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

// Метод для создания образца с изображениями (multipart/form-data)
export const createSpecimenWithImages = async (
  specimenData: Omit<Specimen, 'id'>, 
  images: File[],
  onProgress?: (progress: number) => void
): Promise<{ specimen: Specimen, imageIds: number[] }> => {
  try {
    // Сначала создаем образец без изображений
    const specimen = await specimenService.createSpecimen(specimenData);
    console.log('Образец успешно создан:', specimen);
    
    // Если есть изображения, загружаем их через метод массовой загрузки
    if (images && images.length > 0) {
      console.log(`Начинаем загрузку ${images.length} изображений для образца ID=${specimen.id}`);
      
      // Первое изображение будет основным
      const uploadResult = await specimenService.uploadMultipleImages(
        specimen.id,
        images,
        true, // isMain = true
        onProgress
      );
      
      console.log('Результат загрузки изображений:', uploadResult);
      
      return {
        specimen,
        imageIds: uploadResult.uploadedImageIds
      };
    }
    
    // Если изображений нет, возвращаем пустой массив imageIds
    return {
      specimen,
      imageIds: []
    };
  } catch (error: any) {
    console.error('Ошибка при создании образца с изображениями:', error);
    
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
}; 