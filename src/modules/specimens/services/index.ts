// Экспорт сервисов
export { biometryService } from './biometryService';
export { expositionService } from './expositionService';
export { familyService } from './familyService';
export { phenologyService } from './phenologyService';
export { 
  getAllRegions,
  getRegionById,
  getSpecimensInRegion,
  getSectorRegionMapping,
  createRegion,
  updateRegion,
  deleteRegion,
  getDefaultRegions
} from '@/services/regions';
export { specimenService } from './specimenService';

