// Реэкспорт из общего сервиса specimens
export * from '@/services/specimens';

// Для обратной совместимости экспортируем основные интерфейсы и классы
export {
  specimenService,
  type SpecimenData,
  type Specimen,
  type PagedResult,
  type SpecimenImage,
  type BatchSpecimenImageResultDto,
  type LocationUpdateDto,
  type UploadImageOptions,
  type BatchImageUploadResult,
  SectorType,
  LocationType,
} from '@/services/specimens';

// Экспортируем default для совместимости
export { default } from '@/services/specimens'; 