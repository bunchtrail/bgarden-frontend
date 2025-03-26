import httpClient from '../../../services/httpClient';
import { SectorType, Specimen } from '../types/index';
import { updateSpecimensCount } from '@/services/regions';

// Интерфейс для данных изображения образца
interface SpecimenImage {
    id: number;
    specimenId: number;
    imageDataBase64: string;
    contentType: string;
    description: string;
    isMain: boolean;
    uploadedAt: string;
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
    // Создаем FormData для отправки в multipart/form-data формате
    const formData = new FormData();
    
    // Используем корректный путь API
    // Вначале без префикса api/, т.к. httpClient уже добавляет базовый URL с префиксом
    const apiEndpoint = 'Specimen/with-images';
    console.log(`Используем API эндпоинт: ${apiEndpoint}`);
    
    // Список обязательных полей, которые должны быть в запросе
    const requiredFields = [
      'Id', 'InventoryNumber', 'SectorType', 'MapX', 'MapY',
      'FamilyId', 'RussianName', 'LatinName', 'Genus', 'Species',
      'PlantingYear', 'ExpositionId', 'HasHerbarium'
    ];
    
    // Подготавливаем данные образца в соответствии с форматом ожидаемым сервером
    // ID должен быть 0 для новых записей
    const preparedData = {
      id: 0,
      ...specimenData,
      // Подготовка числовых полей
      sectorType: typeof specimenData.sectorType === 'string' ? 
        Number(specimenData.sectorType) : specimenData.sectorType,
      familyId: typeof specimenData.familyId === 'string' ? 
        Number(specimenData.familyId) : specimenData.familyId,
      expositionId: typeof specimenData.expositionId === 'string' ? 
        Number(specimenData.expositionId) : specimenData.expositionId,
      // Преобразуем координаты карты в числа
      mapX: typeof specimenData.mapX === 'string' ? 
        Number(specimenData.mapX) : specimenData.mapX,
      mapY: typeof specimenData.mapY === 'string' ? 
        Number(specimenData.mapY) : specimenData.mapY,
      // Убедимся, что regionId тоже числовой
      regionId: typeof specimenData.regionId === 'string' ? 
        Number(specimenData.regionId) : specimenData.regionId,
      // Убедимся, что sampleOrigin всегда строка
      sampleOrigin: specimenData.sampleOrigin ? String(specimenData.sampleOrigin) : specimenData.sampleOrigin,
      // Убедимся, что hasHerbarium всегда определено
      hasHerbarium: specimenData.hasHerbarium !== undefined ? specimenData.hasHerbarium : false
    };
    
    // Проверяем наличие всех обязательных полей
    let missingFields: string[] = [];
    requiredFields.forEach(field => {
      const lowerField = field.charAt(0).toLowerCase() + field.slice(1);
      if (preparedData[lowerField as keyof typeof preparedData] === undefined) {
        missingFields.push(field);
      }
    });
    
    if (missingFields.length > 0) {
      console.warn(`Отсутствуют обязательные поля: ${missingFields.join(', ')}`);
    }
    
    // Добавляем данные образца как отдельные поля, а не как JSON-объект
    // Сервер ожидает именно такой формат для multipart/form-data
    Object.entries(preparedData).forEach(([key, value]) => {
      // Пропускаем пустые значения, но добавляем нулевые значения
      if (value !== undefined && value !== null && value !== '') {
        // Преобразуем первую букву ключа в заглавную для соответствия API
        const pascalCaseKey = key.charAt(0).toUpperCase() + key.slice(1);
        formData.append(pascalCaseKey, value.toString());
      }
    });
    
    // Обязательно добавляем LocationWkt если есть, или пустую строку
    formData.append('LocationWkt', preparedData.locationWkt || '');
    
    // Обязательно добавляем HasHerbarium даже если это false
    formData.append('HasHerbarium', preparedData.hasHerbarium.toString());
    
    console.log('Добавлены данные образца:', JSON.stringify(preparedData));
    
    // Добавляем изображения
    images.forEach((image) => {
      formData.append('Images', image, image.name);
      console.log(`Добавлено изображение: ${image.name}, ${image.type}, ${image.size} байт`);
    });
    
    // Отображаем данные формы для детальной отладки
    console.log('FormData содержит следующие поля:');
    formData.forEach((value, key) => {
      if (value instanceof File) {
        console.log(`${key}: File (${value.name}, ${value.type}, ${value.size} байт)`);
      } else {
        console.log(`${key}: ${value} (тип: ${typeof value})`);
      }
    });
    
    // Отправляем запрос
    const response = await httpClient.post<{ specimen: Specimen, imageIds: number[] }>(
      apiEndpoint,
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
    
    // Обновляем счетчик образцов в области после успешного создания
    if (response.specimen.regionId) {
      await updateSpecimensCount(response.specimen.regionId, true);
    }
    
    return response;
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