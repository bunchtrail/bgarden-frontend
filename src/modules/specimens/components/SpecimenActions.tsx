import React from 'react';
import { SpecimenActionsContainer } from './specimen-actions';

interface SpecimenActionsProps {
  currentIndex: number;
  totalCount: number;
  isLoading?: boolean;
  onNavigateFirst: () => void;
  onNavigateLast: () => void;
  onNavigatePrev: () => void;
  onNavigateNext: () => void;
  onNavigateToIndex?: (index: number) => void;
  onAddNew: () => void;
  onPrintCurrent: () => void;
  onPrintList: () => void;
  onExportToExcel: () => void;
  onExportToPdf: () => void;
  onViewPhenology?: () => void; // Опционально: переход к фенологическим наблюдениям
  onViewBiometry?: () => void; // Опционально: переход к биометрии (для цветоводства)
  onViewReports: () => void; // Переход к форме запросов
  onExit: () => void;
  onDelete?: (id: number) => void; // Опционально: удаление текущего образца
}

export const SpecimenActions: React.FC<SpecimenActionsProps> = (props) => {
  // Просто передаем все пропсы в контейнерный компонент
  return <SpecimenActionsContainer {...props} />;
};
