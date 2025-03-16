// Компоненты
import SpecimenForm from './components/specimen-form';

// Сервисы
import { specimenService } from './services/specimenService';
import { familyService } from './services/familyService';
import { regionService } from './services/regionService';
import { expositionService } from './services/expositionService';

// Типы
export * from './types';

// Экспорт компонентов
export {
  // Компоненты
  SpecimenForm,
  
  // Сервисы
  specimenService,
  familyService,
  regionService,
  expositionService,
};

// По умолчанию экспортируем объект с основными сервисами
export default {
  specimenService,
  familyService,
  regionService,
  expositionService,
}; 