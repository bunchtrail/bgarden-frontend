export interface Specimen {
  id: number;
  inventoryNumber: string;
  sectorType: number;
  latitude: number;
  longitude: number;
  locationWkt?: string;
  regionId?: number | null;
  regionName?: string | null;
  familyId: number;
  familyName: string;
  russianName: string;
  latinName: string;
  genus: string;
  species: string;
  cultivar?: string | null;
  form?: string | null;
  synonyms?: string | null;
  determinedBy?: string | null;
  plantingYear: number;
  sampleOrigin?: string | null;
  naturalRange?: string | null;
  ecologyAndBiology?: string | null;
  economicUse?: string | null;
  conservationStatus?: string | null;
  expositionId: number;
  expositionName: string;
  hasHerbarium: boolean;
  duplicatesInfo?: string | null;
  originalBreeder?: string | null;
  originalYear?: number | null;
  country?: string | null;
  illustration?: string | null;
  notes?: string | null;
  filledBy?: string | null;
}

export enum SectorType {
  Dendrology = 0,
  Flora = 1,
  Flowering = 2
}

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

export interface SpecimenFormData extends Omit<Specimen, 'id'> {
  id?: number;
}

export interface SpecimenFilterParams {
  searchField?: keyof Specimen;
  searchValue?: string;
  familyId?: number;
  sectorType?: SectorType;
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