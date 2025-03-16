import httpClient from '../../../services/httpClient';

// Интерфейс для образца растения
interface Specimen {
  id: number;
  name: string;
  latinName?: string;
  // другие поля добавляются по мере необходимости
}

// Интерфейс для объекта данных региона
export interface RegionDto {
  id: number;
  name: string;
  description?: string;
  climate?: string;
}

// Класс для работы с API регионов
class RegionService {
    // Получить все регионы
    async getAllRegions(): Promise<RegionDto[]> {
        try {
            const regions = await httpClient.get<RegionDto[]>('Region');
            
            // Если API вернул пустой список или произошла ошибка, используем временные данные
            if (!regions || regions.length === 0) {
                console.log('API вернул пустой список регионов, используем временные данные');
                return this.getDefaultRegions();
            }
            
            return regions;
        } catch (error) {
            console.error('Ошибка при получении списка регионов:', error);
            // В случае ошибки также возвращаем временные данные
            return this.getDefaultRegions();
        }
    }
    
    // Метод для получения стандартных регионов, если API не работает
    private getDefaultRegions(): RegionDto[] {
        const defaultRegions = [
            { id: 1, name: "Европа", description: "Европейская часть" },
            { id: 2, name: "Азия", description: "Азиатская часть" },
            { id: 3, name: "Северная Америка", description: "Североамериканская часть" },
            { id: 4, name: "Южная Америка", description: "Южноамериканская часть" },
            { id: 5, name: "Африка", description: "Африканская часть" },
            { id: 6, name: "Австралия", description: "Австралия и Океания" }
        ];
        console.log('Возвращаю дефолтные регионы:', defaultRegions);
        return defaultRegions;
    }

    // Получить регион по ID
    async getRegionById(id: number): Promise<RegionDto> {
        return httpClient.get<RegionDto>(`Region/${id}`);
    }

    // Получить список экземпляров растений в регионе
    async getSpecimensInRegion(regionId: number): Promise<Specimen[]> {
        return httpClient.get<Specimen[]>(`Region/${regionId}/specimens`);
    }

    // Сопоставить секторы с регионами (временное решение, пока API не возвращает правильные данные)
    getSectorRegionMapping(sectorData: any[]): Record<number, RegionDto> {
        // Временное сопоставление секторов и регионов
        const sectorToRegion: Record<number, RegionDto> = {};
        
        // Пример: сектор с ID 1 соответствует региону "Европа"
        sectorToRegion[1] = { id: 1, name: "Европа", description: "Европейская часть" };
        
        // Сектор с ID 2 соответствует региону "Азия"
        sectorToRegion[2] = { id: 2, name: "Азия", description: "Азиатская часть" };
        
        // Сектор с ID 3 соответствует региону "Северная Америка"
        sectorToRegion[3] = { id: 3, name: "Северная Америка", description: "Североамериканская часть" };
        
        return sectorToRegion;
    }

    // Создать новый регион
    async createRegion(region: Omit<RegionDto, 'id'>): Promise<RegionDto> {
        return httpClient.post<RegionDto>('Region', region);
    }

    // Обновить существующий регион
    async updateRegion(id: number, region: RegionDto): Promise<RegionDto> {
        return httpClient.put<RegionDto>(`Region/${id}`, region);
    }

    // Удалить регион
    async deleteRegion(id: number): Promise<boolean> {
        await httpClient.delete(`Region/${id}`);
        return true;
    }
}

// Экспортируем экземпляр сервиса для использования в приложении
export const regionService = new RegionService(); 