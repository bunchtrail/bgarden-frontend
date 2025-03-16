// Компоненты
import SpecimenForm from './components/specimen-form';

// Сервисы
import { specimenService } from './services/specimenService';
import { familyService } from './services/familyService';
import { regionService } from './services/regionService';
import { expositionService } from './services/expositionService';

// Типы
export * from './types';

/**
 * Модуль образцов растений (Specimens)
 * 
 * Модуль для работы с образцами растений в ботаническом саду.
 * Использует централизованную UI библиотеку из модуля ui.
 * 
 * Миграция UI компонентов завершена (16.03.2025)
 */

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