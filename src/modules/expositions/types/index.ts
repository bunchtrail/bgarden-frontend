/**
 * Интерфейс для данных экспозиции
 */
export interface ExpositionDto {
  id: number;
  name: string;
  description: string;
  specimensCount: number | null;
}

/**
 * Интерфейс для создания/обновления экспозиции без ID
 */
export interface ExpositionFormData extends Omit<ExpositionDto, 'id'> {
  id?: number;
}

/**
 * Интерфейс для параметров фильтрации экспозиций
 */
export interface ExpositionFilterParams {
  searchValue?: string;
} 