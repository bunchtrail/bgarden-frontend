// Компоненты
import SpecimenForm from './components/specimen-form';

// Компоненты состояний
import SpecimensLoading from './components/specimens-states/SpecimensLoading';
import SpecimensError from './components/specimens-states/SpecimensError';
import SpecimensEmptyState from './components/specimens-states/SpecimensEmptyState';

// UI компоненты
import SpecimensHeader from './components/specimens-ui/SpecimensHeader';
import MobileAddButton from './components/specimens-ui/MobileAddButton';

// Компоненты управления
import SpecimensSortControls from './components/specimens-controls/SpecimensSortControls';
import SpecimensSearchBar from './components/specimens-controls/SpecimensSearchBar';
import ActionButtons from './components/specimens-controls/ActionButtons';

// Компоненты отображения
import SpecimensTable from './components/specimens-components/SpecimensTable';
import SpecimensGrid from './components/specimens-components/SpecimensGrid';
import SpecimenRow from './components/specimens-components/SpecimenRow';
import SpecimenCard from './components/specimens-components/SpecimenCard';
import SpecimenModal from './components/specimens-components/SpecimenModal';

// Импорт компонента галереи
import SpecimenGallery from './components/specimen-gallery/SpecimenGallery';

// Сервисы
import { specimenService } from './services/specimenService';
import { familyService } from './services/familyService';
import { expositionService } from './services/expositionService';

// регионы
import { 
  getAllRegions,
  getRegionById,
  getSpecimensInRegion,
  getSectorRegionMapping,
  createRegion,
  updateRegion,
  deleteRegion,
  getDefaultRegions 
} from '@/services/regions';

// Типы
export * from './types';

/**
 * Модуль образцов растений (Specimens)
 * 
 * Модуль для работы с образцами растений в ботаническом саду.
 * Использует централизованную UI библиотеку из модуля ui.
 * 
 * Миграция UI компонентов завершена (16.03.2025)
 * Структура модуля реорганизована (17.03.2025)
 */

// Экспорт компонентов
export {
  // Компоненты форм
  SpecimenForm,
  
  // Компоненты состояний
  SpecimensLoading,
  SpecimensError,
  SpecimensEmptyState,
  
  // UI компоненты
  SpecimensHeader,
  MobileAddButton,
  
  // Компоненты управления
  SpecimensSortControls,
  SpecimensSearchBar,
  ActionButtons,
  
  // Компоненты отображения
  SpecimensTable,
  SpecimensGrid,
  SpecimenRow,
  SpecimenCard,
  SpecimenModal,
  
  // Компонент галереи
  SpecimenGallery,
  
  // Сервисы
  specimenService,
  familyService,
  expositionService,
};

// По умолчанию экспортируем объект с основными сервисами
export default {
  specimenService,
  familyService,
  expositionService,
};

// Компоненты для работы с изображениями
export { default as ImageUploader } from './components/specimen-form/ImageUploader';

// Хуки
export { useSpecimenImage } from './hooks';

// Для совместимости создаем объект regionService
const regionService = {
  getAllRegions,
  getRegionById,
  getSpecimensInRegion,
  getSectorRegionMapping,
  createRegion,
  updateRegion,
  deleteRegion,
  getDefaultRegions
};

// API сервисы
export const services = {
  specimenService,
  familyService,
  expositionService,
  regionService
};

// Экспортируем regionService для обратной совместимости
export { regionService }; 