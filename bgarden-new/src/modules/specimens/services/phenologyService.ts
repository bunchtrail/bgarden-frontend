import httpClient from '../../../services/httpClient';

// Интерфейс для объекта данных фенологии
export interface PhenologyDto {
  id: number;
  specimenId: number;
  specimenInfo?: string;
  year: number;
  floweringStart?: Date;
  floweringEnd?: Date;
  fruitingDate?: Date;
  notes?: string;
}

// Класс для работы с API фенологии растений
class PhenologyService {
    // Получить все фенологические данные
    async getAllPhenologyRecords(): Promise<PhenologyDto[]> {
        return httpClient.get<PhenologyDto[]>('Phenology');
    }

    // Получить фенологию по ID
    async getPhenologyById(id: number): Promise<PhenologyDto> {
        return httpClient.get<PhenologyDto>(`Phenology/${id}`);
    }

    // Получить фенологии для образца
    async getPhenologyForSpecimen(specimenId: number): Promise<PhenologyDto[]> {
        return httpClient.get<PhenologyDto[]>(`Phenology/specimen/${specimenId}`);
    }

    // Создать новую фенологическую запись
    async createPhenology(phenology: Omit<PhenologyDto, 'id'>): Promise<PhenologyDto> {
        return httpClient.post<PhenologyDto>('Phenology', phenology);
    }

    // Обновить фенологическую запись
    async updatePhenology(id: number, phenology: PhenologyDto): Promise<PhenologyDto> {
        return httpClient.put<PhenologyDto>(`Phenology/${id}`, phenology);
    }

    // Удалить фенологическую запись
    async deletePhenology(id: number): Promise<boolean> {
        await httpClient.delete(`Phenology/${id}`);
        return true;
    }
}

// Экспортируем экземпляр сервиса для использования в приложении
export const phenologyService = new PhenologyService(); 