import httpClient from '../../../services/httpClient';

// Интерфейс для объекта данных экспозиции
export interface ExpositionDto {
  id: number;
  name: string;
  description?: string;
  location?: string;
}

// Класс для работы с API экспозиций
class ExpositionService {
    // Получить все экспозиции (доступно без авторизации для чтения)
    async getAllExpositions(): Promise<ExpositionDto[]> {
        return httpClient.get<ExpositionDto[]>('Exposition', { requiresAuth: false });
    }

    // Получить экспозицию по ID (доступно без авторизации для чтения)
    async getExpositionById(id: number): Promise<ExpositionDto> {
        return httpClient.get<ExpositionDto>(`Exposition/${id}`, { requiresAuth: false });
    }

    // Получить экспозицию по имени (доступно без авторизации для чтения)
    async getExpositionByName(name: string): Promise<ExpositionDto> {
        return httpClient.get<ExpositionDto>(`Exposition/name/${name}`, { requiresAuth: false });
    }

    // Создать новую экспозицию
    async createExposition(exposition: Omit<ExpositionDto, 'id'>): Promise<ExpositionDto> {
        return httpClient.post<ExpositionDto>('Exposition', exposition);
    }

    // Обновить существующую экспозицию
    async updateExposition(id: number, exposition: ExpositionDto): Promise<ExpositionDto> {
        return httpClient.put<ExpositionDto>(`Exposition/${id}`, exposition);
    }

    // Удалить экспозицию
    async deleteExposition(id: number): Promise<boolean> {
        await httpClient.delete(`Exposition/${id}`);
        return true;
    }
}

// Экспортируем экземпляр сервиса для использования в приложении
export const expositionService = new ExpositionService(); 