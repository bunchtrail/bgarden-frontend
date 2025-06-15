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
    // Получить все семейства (доступно без авторизации для чтения)
    async getAllFamilies(): Promise<FamilyDto[]> {
        return httpClient.get<FamilyDto[]>('Family', { requiresAuth: false });
    }

    // Получить семейство по ID (доступно без авторизации для чтения)
    async getFamilyById(id: number): Promise<FamilyDto> {
        return httpClient.get<FamilyDto>(`Family/${id}`, { requiresAuth: false });
    }

    // Получить семейство по названию (доступно без авторизации для чтения)
    async getFamilyByName(name: string): Promise<FamilyDto> {
        return httpClient.get<FamilyDto>(`Family/name/${encodeURIComponent(name)}`, { requiresAuth: false });
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