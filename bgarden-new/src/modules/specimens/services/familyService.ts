import httpClient from '../../../services/httpClient';

// Интерфейс для объекта данных семейства
export interface FamilyDto {
  id: number;
  name: string;
  latinName?: string;
  description?: string;
}

// Класс для работы с API семейств растений
class FamilyService {
    // Получить все семейства
    async getAllFamilies(): Promise<FamilyDto[]> {
        return httpClient.get<FamilyDto[]>('Family');
    }

    // Получить семейство по ID
    async getFamilyById(id: number): Promise<FamilyDto> {
        return httpClient.get<FamilyDto>(`Family/${id}`);
    }

    // Получить семейство по названию
    async getFamilyByName(name: string): Promise<FamilyDto> {
        return httpClient.get<FamilyDto>(`Family/name/${encodeURIComponent(name)}`);
    }

    // Создать новое семейство
    async createFamily(family: Omit<FamilyDto, 'id'>): Promise<FamilyDto> {
        return httpClient.post<FamilyDto>('Family', family);
    }

    // Обновить существующее семейство
    async updateFamily(id: number, family: FamilyDto): Promise<FamilyDto> {
        return httpClient.put<FamilyDto>(`Family/${id}`, family);
    }

    // Удалить семейство
    async deleteFamily(id: number): Promise<boolean> {
        await httpClient.delete(`Family/${id}`);
        return true;
    }
}

// Экспортируем экземпляр сервиса для использования в приложении
export const familyService = new FamilyService(); 