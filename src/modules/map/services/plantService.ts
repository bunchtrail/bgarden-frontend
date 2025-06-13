// Реэкспорт из общего сервиса specimens
export * from '@/services/specimens';

// Для обратной совместимости экспортируем основные функции
export {
  getPagedSpecimens,
  getAllSpecimens,
  getSpecimenById,
  deleteSpecimen,
  convertSpecimensToPlants,
  specimenService,
  type SpecimenData,
  type PagedResult,
  type SectorType,
  type LocationType,
} from '@/services/specimens';
