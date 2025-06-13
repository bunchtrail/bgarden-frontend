// Реэкспорт основных типов из общего сервиса
export * from '@/services/specimens';

// Дополнительные типы, специфичные для модуля specimens
export enum UserRole {
  /**
   * Администратор системы (полный доступ)
   */
  Administrator = 1,
  
  /**
   * Работник ботанического сада (расширенный доступ)
   */
  Employee = 2,
  
  /**
   * Клиент (ограниченный доступ, только для просмотра)
   */
  Client = 3
}

export interface SpecimenFormData extends Omit<import('@/services/specimens').Specimen, 'id'> {
  id?: number;
}

export interface SpecimenFilterParams {
  searchField?: keyof import('@/services/specimens').Specimen;
  searchValue?: string;
  familyId?: number;
  sectorType?: import('@/services/specimens').SectorType;
  regionId?: number;
  expositionId?: number;
}

// Интерфейс для данных биометрии растений
export interface Biometry {
  id: number;
  specimenId: number;
  specimenInfo?: string;
  measurementDate: Date;
  height?: number;
  flowerDiameter?: number;
  notes?: string;
}

// Интерфейс для формы биометрии
export interface BiometryFormData extends Omit<Biometry, 'id'> {
  id?: number;
}

// Интерфейс для данных фенологии растений
export interface Phenology {
  id: number;
  specimenId: number;
  specimenInfo?: string;
  year: number;
  floweringStart?: Date;
  floweringEnd?: Date;
  fruitingDate?: Date;
  notes?: string;
}

// Интерфейс для формы фенологии
export interface PhenologyFormData extends Omit<Phenology, 'id'> {
  id?: number;
}

// Интерфейс для данных семейства растений
export interface Family {
  id: number;
  name: string;
  description?: string;
  specimensCount?: number;
}

// Интерфейс для данных региона
export interface Region {
  id: number;
  name: string;
  description?: string;
  climate?: string;
} 