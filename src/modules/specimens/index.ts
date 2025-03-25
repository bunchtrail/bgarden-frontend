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