// Экспорт сервисов
export { biometryService } from './biometryService';
export { expositionService } from './expositionService';
export { familyService } from './familyService';
export { phenologyService } from './phenologyService';
export { 
  regionService,
  getAllRegions,
  getRegionById,
  getSpecimensInRegion,
  getSectorRegionMapping,
  createRegion,
  updateRegion,
  deleteRegion,
  getDefaultRegions
} from './regionService';
export { specimenService } from './specimenService';

