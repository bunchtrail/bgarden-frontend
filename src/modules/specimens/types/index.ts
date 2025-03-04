export interface Specimen {
  id: number;
  inventoryNumber: string;
  sectorType: number;
  latitude: number;
  longitude: number;
  regionId: number;
  regionName: string;
  familyId: number;
  familyName: string;
  russianName: string;
  latinName: string;
  genus: string;
  species: string;
  cultivar: string;
  form: string;
  synonyms: string;
  determinedBy: string;
  plantingYear: number;
  sampleOrigin: string;
  naturalRange: string;
  ecologyAndBiology: string;
  economicUse: string;
  conservationStatus: string;
  expositionId: number;
  expositionName: string;
  hasHerbarium: boolean;
  duplicatesInfo: string;
  originalBreeder: string;
  originalYear: number;
  country: string;
  illustration: string;
  notes: string;
  filledBy: string;
}

export enum SectorType {
  Dendrology = 0,
  Floriculture = 1,
  // Добавьте другие типы секторов по мере необходимости
}

export interface SpecimenFormData extends Omit<Specimen, 'id'> {
  id?: number;
}

export interface SpecimenFilterParams {
  searchField?: keyof Specimen;
  searchValue?: string;
  familyId?: number;
  sectorType?: SectorType;
} 