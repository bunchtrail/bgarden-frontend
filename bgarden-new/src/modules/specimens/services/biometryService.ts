import httpClient from '../../../services/httpClient';

// Интерфейс для объекта данных биометрии
export interface BiometryDto {
  id: number;
  specimenId: number;
  specimenInfo?: string;
  measurementDate: Date;
  height?: number;
  flowerDiameter?: number;
  notes?: string;
}

// Класс для работы с API биометрии растений
class BiometryService {
    // Получить все биометрические данные
    async getAllBiometryRecords(): Promise<BiometryDto[]> {
        return httpClient.get<BiometryDto[]>('Biometry');
    }

    // Получить биометрию по ID
    async getBiometryById(id: number): Promise<BiometryDto> {
        return httpClient.get<BiometryDto>(`Biometry/${id}`);
    }

    // Получить биометрические данные для образца
    async getBiometryForSpecimen(specimenId: number): Promise<BiometryDto[]> {
        return httpClient.get<BiometryDto[]>(`Biometry/specimen/${specimenId}`);
    }

    // Создать новую биометрическую запись
    async createBiometry(biometry: Omit<BiometryDto, 'id'>): Promise<BiometryDto> {
        return httpClient.post<BiometryDto>('Biometry', biometry);
    }

    // Обновить биометрическую запись
    async updateBiometry(id: number, biometry: BiometryDto): Promise<BiometryDto> {
        return httpClient.put<BiometryDto>(`Biometry/${id}`, biometry);
    }

    // Удалить биометрическую запись
    async deleteBiometry(id: number): Promise<boolean> {
        await httpClient.delete(`Biometry/${id}`);
        return true;
    }
}

// Экспортируем экземпляр сервиса для использования в приложении
export const biometryService = new BiometryService(); 