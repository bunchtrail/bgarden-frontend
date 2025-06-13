import httpClient from '@/services/httpClient';
import { logError } from '@/utils/logger';
import { updateSpecimensCount } from '@/services/regions';
import { Plant } from '@/services/regions/types';
import L from 'leaflet';
// Импортируем типы карт для использования в функции
import { MAP_TYPES } from '@/modules/map/contexts/MapConfigContext';

// ===== ТИПЫ И ИНТЕРФЕЙСЫ =====

export interface SpecimenData {
  id: number;
  inventoryNumber: string;
  sectorType: number;
  locationType?: number;
  latitude: number;
  longitude: number;
  locationWkt: string;
  regionId: number | null;
  regionName: string | null;
  familyId: number;
  familyName: string | null;
  russianName: string;
  latinName: string;
  genus: string;
  species: string;
  cultivar: string | null;
  form: string | null;
  synonyms: string | null;
  determinedBy: string | null;
  plantingYear: number | null;
  sampleOrigin: string | null;
  naturalRange: string | null;
  ecologyAndBiology: string | null;
  economicUse: string | null;
  conservationStatus: string | null;
  expositionId: number | null;
  expositionName: string | null;
  hasHerbarium: boolean;
  duplicatesInfo: string | null;
  originalBreeder: string | null;
  originalYear: number | null;
  country: string | null;
  illustration: string | null;
  notes: string | null;
  filledBy: string | null;
  mapX: number;
  mapY: number;
}

// Совместимость с типами specimens модуля
export interface Specimen extends SpecimenData {
  imageUrl?: string | null;
  mapId?: number | null;
}

export enum SectorType {
  Dendrology = 0,
  Flora = 1,
  Flowering = 2
}

export enum LocationType {
  None = 0,
  Geographic = 1,
  SchematicMap = 2
}

// Интерфейс для постраничного результата
export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// Интерфейс для данных изображения образца
export interface SpecimenImage {
  id: number;
  specimenId: number;
  imageUrl: string;
  description: string;
  isMain: boolean;
  uploadedAt: string;
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

// Интерфейс для объединенной загрузки изображений
export interface UploadImageOptions {
  isMain?: boolean;
  description?: string;
  onProgress?: (progress: number) => void;
}

export interface BatchImageUploadResult {
  specimenId: number;
  successCount: number;
  errorCount: number;
  uploadedImageIds: number[];
  errorMessages: string[];
}

// ===== ОСНОВНОЙ СЕРВИС =====

class UnifiedSpecimenService {
    // ===== МЕТОДЫ ДЛЯ ПОЛУЧЕНИЯ ДАННЫХ =====
    
    // Получить образцы постранично
    async getPagedSpecimens(
        limit = 50, 
        offset = 0, 
        filters: Record<string, any> = {}
    ): Promise<PagedResult<SpecimenData>> {
        try {
            return await httpClient.get<PagedResult<SpecimenData>>('Specimen/paged', { 
                params: { 
                    limit: limit.toString(), 
                    offset: offset.toString(), 
                    ...filters 
                },
                suppressErrorsForStatus: [404]
            });
        } catch (error: any) {
            // Если получили 404, возвращаем пустой результат
            if (error && typeof error === 'object' && 'status' in error && error.status === 404) {
                return {
                    items: [],
                    totalCount: 0,
                    pageSize: limit,
                    currentPage: Math.floor(offset / limit) + 1,
                    totalPages: 0,
                    hasNextPage: false,
                    hasPreviousPage: false
                };
            }
            
            logError('Ошибка при получении образцов постранично:', error);
            throw error;
        }
    }

    // Получить все образцы
    async getAllSpecimens(): Promise<SpecimenData[]> {
        try {
            const data = await httpClient.get<SpecimenData[]>('Specimen/all', {
                suppressErrorsForStatus: [404],
            });
            
            // Преобразуем единичный объект в массив, если API вернуло один объект
            if (!Array.isArray(data)) {
                return [data as SpecimenData];
            }
            
            return data;
        } catch (error: any) {
            // Если получили 404, просто возвращаем пустой массив без логирования ошибки
            if (error && typeof error === 'object' && 'status' in error && error.status === 404) {
                return [];
            }
            
            logError('Ошибка при получении всех образцов:', error);
            return [];
        }
    }

    // Получить образцы по типу сектора
    async getSpecimensBySectorType(sectorType: SectorType): Promise<SpecimenData[]> {
        try {
            const data = await httpClient.get<SpecimenData[]>(`Specimen/sector/${sectorType}`, {
                timeout: 5000,
                suppressErrorsForStatus: [404]
            });
            
            // Преобразуем единичный объект в массив, если API вернуло один объект
            if (!Array.isArray(data)) {
                return [data as SpecimenData];
            }
            
            return data;
        } catch (error: any) {
            // Если получили 404, просто возвращаем пустой массив без логирования ошибки
            if (error && typeof error === 'object' && 'status' in error && error.status === 404) {
                return [];
            }
            
            logError('Ошибка при получении образцов для сектора:', error);
            return [];
        }
    }

    // Получить образец по ID
    async getSpecimenById(id: number): Promise<SpecimenData> {
        try {
            return await httpClient.get<SpecimenData>(`Specimen/${id}`);
        } catch (error) {
            logError('Ошибка при получении данных растения:', error);
            throw error;
        }
    }

    // ===== МЕТОДЫ ДЛЯ СОЗДАНИЯ И ОБНОВЛЕНИЯ =====

    // Создать новый образец
    async createSpecimen(specimen: Omit<Specimen, 'id'>): Promise<Specimen> {
        try {
            const specimenData = {
                id: 0, // API ожидает id=0 для новых записей
                ...specimen,
                sectorType: Number(specimen.sectorType)
            };
            
            const createdSpecimen = await httpClient.post<Specimen>('Specimen', specimenData, { requiresAuth: true });
            
            // Обновляем счетчик образцов в области
            if (createdSpecimen.regionId) {
                await updateSpecimensCount(createdSpecimen.regionId, true);
            }
            
            return createdSpecimen;
        } catch (error: any) {
            logError('Ошибка при создании образца растения:', error);
            throw error;
        }
    }

    // Создать образец с изображениями
    async createSpecimenWithImages(specimen: Omit<Specimen, 'id'>, images: File[]): Promise<{ specimen: Specimen; imageIds: number[] }> {
        const form = new FormData();
        
        // Добавляем Id = 0 для нового экземпляра
        form.append('Specimen.Id', '0');
        
        // Добавляем каждое поле specimen с правильной обработкой типов
        Object.entries(specimen).forEach(([key, value]) => {
            let val: string = '';
            
            if (value !== null && value !== undefined) {
                if (typeof value === 'boolean') {
                    val = value.toString();
                } else if (typeof value === 'number') {
                    val = value.toString();
                } else {
                    val = String(value);
                }
            }

            // Специальные случаи для полей, которые должны иметь значения по умолчанию
            if ((key === 'mapId' || key === 'mapX' || key === 'mapY') && (val === '' || value === null || value === undefined)) {
                val = '0';
            }
            
            // Для числовых полей, которые могут быть null, но не должны отправляться пустыми
            if ((key === 'originalYear' || key === 'plantingYear') && (val === '' || value === null || value === undefined)) {
                val = '0';
            }

            const fieldName = `Specimen.${key.charAt(0).toUpperCase() + key.slice(1)}`;
            form.append(fieldName, val);
        });

        // Добавляем поле SpecimenImages как JSON (согласно curl примеру)
        const specimenImages = {
            isMain: true,
            specimenId: 0,
            relativeFilePath: "string",
            uploadedAt: new Date().toISOString(),
            contentType: "string",
            imageUrl: "string",
            originalFileName: "string",
            id: 0,
            description: "string",
            fileSize: 0
        };
        form.append('Specimen.SpecimenImages', JSON.stringify(specimenImages));

        // Добавляем изображения
        images.forEach(img => form.append('Images', img, img.name));

        const result = await httpClient.post<{ specimen: Specimen; imageIds: number[] }>(
            'Specimen/with-images',
            form,
            { requiresAuth: true } // Добавляем авторизацию
        );
        
        if (result.specimen.regionId) {
            await updateSpecimensCount(result.specimen.regionId, true);
        }
        return result;
    }

    // Обновить существующий образец
    async updateSpecimen(id: number, specimen: Specimen): Promise<Specimen> {
        return httpClient.put<Specimen>(`Specimen/${id}`, specimen, { requiresAuth: true });
    }

    // Обновить местоположение образца
    async updateSpecimenLocation(id: number, locationData: LocationUpdateDto): Promise<Specimen> {
        try {
            const result = await httpClient.put<Specimen>(`Specimen/${id}/location`, locationData, { requiresAuth: true });
            return result;
        } catch (error) {
            logError('Ошибка при обновлении местоположения образца:', error);
            throw error;
        }
    }

    // ===== МЕТОДЫ ДЛЯ УДАЛЕНИЯ =====

    // Удалить образец
    async deleteSpecimen(id: number): Promise<boolean> {
        try {
            // Получаем информацию об образце перед удалением
            const specimen = await this.getSpecimenById(id);
            
            // Удаляем образец
            await httpClient.delete<void>(`Specimen/${id}`, { requiresAuth: true });
            
            // Обновляем счетчик образцов в области
            if (specimen.regionId) {
                await updateSpecimensCount(specimen.regionId, false);
            }
            
            return true;
        } catch (error) {
            logError('Ошибка при удалении образца:', error);
            throw error;
        }
    }

    // ===== МЕТОДЫ ДЛЯ РАБОТЫ С ИЗОБРАЖЕНИЯМИ =====

    // Получить основное изображение образца по ID
    async getSpecimenMainImage(specimenId: number): Promise<SpecimenImage | null> {
        try {
            return await httpClient.get<SpecimenImage>(
                `specimen-images/by-specimen/${specimenId}/main`,
                { suppressErrorsForStatus: [404] }
            );
        } catch (error) {
            if (error && typeof error === 'object' && 'status' in error && error.status === 404) {
                return null;
            }
            logError(`Ошибка при получении изображения для образца с ID ${specimenId}:`, error);
            return null;
        }
    }

    // Получить все изображения образца
    async getSpecimenImages(specimenId: number, includeImageData: boolean = false): Promise<SpecimenImage[]> {
        try {
            return await httpClient.get<SpecimenImage[]>(
                `specimen-images/by-specimen/${specimenId}?includeImageData=${includeImageData}`,
                { suppressErrorsForStatus: [404] }
            );
        } catch (error) {
            if (error && typeof error === 'object' && 'status' in error && error.status === 404) {
                return [];
            }
            logError(`Ошибка при получении изображений образца с ID ${specimenId}:`, error);
            return [];
        }
    }
    
    // Получить изображение по ID
    async getSpecimenImageById(imageId: number): Promise<SpecimenImage | null> {
        try {
            return await httpClient.get<SpecimenImage>(`specimen-images/${imageId}`);
        } catch (error) {
            logError(`Ошибка при получении изображения с ID ${imageId}:`, error);
            return null;
        }
    }
    
    // Удалить изображение
    async deleteSpecimenImage(id: number): Promise<boolean> {
        try {
            await httpClient.delete(`specimen-images/${id}`, { requiresAuth: true });
            return true;
        } catch (error) {
            logError(`Ошибка при удалении изображения с ID ${id}:`, error);
            return false;
        }
    }

    // ===== МЕТОДЫ ДЛЯ КАРТЫ =====

    /**
     * Преобразует данные с сервера в формат Plant, фильтруя и выбирая
     * координаты в зависимости от заданного типа карты.
     */
    convertSpecimensToPlants(
        specimens: SpecimenData[],
        mapType: (typeof MAP_TYPES)[keyof typeof MAP_TYPES]
    ): Plant[] {

        const usedIds = new Set<string>();

        // Оптимизация: создаём функцию преобразования координат один раз
        const ZOOM = 0; // CRS.Simple всегда z=0
        const toLatLng = (p: [number, number]) =>
            L.CRS.Simple.pointToLatLng(L.point(p[0], p[1]), ZOOM);

        // Функция для нормализации locationType (может прийти как строка или число)
        const normalizeLocationType = (locationType: any): LocationType | undefined => {
            if (typeof locationType === 'number') {
                return locationType as LocationType;
            }
            if (typeof locationType === 'string') {
                switch (locationType.toLowerCase()) {
                    case 'geographic':
                        return LocationType.Geographic;
                    case 'schematicmap':
                        return LocationType.SchematicMap;
                    case 'none':
                        return LocationType.None;
                    default:
                        return undefined;
                }
            }
            return undefined;
        };

        // Показываем статистику типов локаций для отладки
        const locationTypeStats = specimens.reduce((acc, specimen) => {
            const normalized = normalizeLocationType(specimen.locationType);
            const key = `${specimen.locationType} (${normalized})`;
            acc[key] = (acc[key] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const filteredSpecimens = specimens.filter((specimen) => {
            // Нормализуем locationType для корректного сравнения
            const normalizedLocationType = normalizeLocationType(specimen.locationType);

            // Фильтруем растения в зависимости от типа карты и наличия координат
            if (mapType === MAP_TYPES.GEO) {
                // Для гео-карты нужны географические координаты
                return (
                    (normalizedLocationType === LocationType.Geographic ||
                        normalizedLocationType === undefined) &&
                    specimen.latitude != null &&
                    specimen.longitude != null
                );
            }
            // Для схематической карты нужны координаты на схеме
            return (
                (normalizedLocationType === LocationType.SchematicMap ||
                    normalizedLocationType === undefined) &&
                specimen.mapX != null &&
                specimen.mapY != null
            );
        });

        const plants = filteredSpecimens.map((specimen) => {
                let plantId = `specimen-${specimen.id}`;
                if (usedIds.has(plantId)) {
                    plantId = `specimen-${specimen.id}-${Date.now()}-${Math.random()
                        .toString(36)
                        .substr(2, 5)}`;
                }
                usedIds.add(plantId);
                
                // Выбираем позицию в зависимости от типа карты
                let position: [number, number];
                if (mapType === MAP_TYPES.GEO) {
                    position = [specimen.latitude, specimen.longitude];
                } else {
                    // Для схематических карт преобразуем пиксели в lat/lng
                    const { lat, lng } = toLatLng([specimen.mapX, specimen.mapY]);
                    position = [lat, lng];
                }

                return {
                    id: plantId,
                    name: specimen.russianName || specimen.latinName || 'Неизвестное растение',
                    position,
                    description: `${specimen.genus || ''} ${specimen.species || ''}`.trim(),
                    latinName: specimen.latinName,
                };
            });

        return plants;
    }
}

// ===== ЭКСПОРТ =====

// Создаем единственный экземпляр сервиса
export const specimenService = new UnifiedSpecimenService();

// Экспортируем как функции для совместимости с plantService
export const getPagedSpecimens = specimenService.getPagedSpecimens.bind(specimenService);
export const getAllSpecimens = specimenService.getAllSpecimens.bind(specimenService);
export const getSpecimenById = specimenService.getSpecimenById.bind(specimenService);
export const deleteSpecimen = specimenService.deleteSpecimen.bind(specimenService);
export const convertSpecimensToPlants = specimenService.convertSpecimensToPlants.bind(specimenService);

// Экспортируем весь класс как default для расширенного использования
export default specimenService; 