import React from 'react';
import { containerClasses, dividerClasses, subheadingClasses } from '../styles';
import { AdditionalActions } from './AdditionalActions';
import { ExportActions } from './ExportActions';
import { NavigationActions } from './NavigationActions';

interface SpecimenActionsContainerProps {
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
  onViewPhenology?: () => void;
  onViewBiometry?: () => void;
  onViewReports: () => void;
  onExit: () => void;
  onDelete?: (id: number) => void;
  currentId?: number;
}

export const SpecimenActionsContainer: React.FC<
  SpecimenActionsContainerProps
> = ({
  currentIndex,
  totalCount,
  isLoading = false,
  onNavigateFirst,
  onNavigateLast,
  onNavigatePrev,
  onNavigateNext,
  onNavigateToIndex,
  onAddNew,
  onPrintCurrent,
  onPrintList,
  onExportToExcel,
  onExportToPdf,
  onViewPhenology,
  onViewBiometry,
  onViewReports,
  onExit,
  onDelete,
  currentId,
}) => {
  return (
    <div className={containerClasses.detail}>
      <div className="mb-4">
        <h3 className={subheadingClasses.base}>Навигация</h3>
        <NavigationActions
          currentIndex={currentIndex}
          totalCount={totalCount}
          onNavigateFirst={onNavigateFirst}
          onNavigateLast={onNavigateLast}
          onNavigatePrev={onNavigatePrev}
          onNavigateNext={onNavigateNext}
          onNavigateToIndex={onNavigateToIndex}
          isLoading={isLoading}
        />
      </div>
      
      <hr className={dividerClasses.base} />
      
      <div className="mb-4">
        <h3 className={subheadingClasses.base}>Печать и экспорт</h3>
        <ExportActions
          onPrintCurrent={onPrintCurrent}
          onPrintList={onPrintList}
          onExportToExcel={onExportToExcel}
          onExportToPdf={onExportToPdf}
          isLoading={isLoading}
        />
      </div>
      
      <hr className={dividerClasses.base} />
      
      <div className="mb-4">
        <h3 className={subheadingClasses.base}>Действия</h3>
        <AdditionalActions
          onAddNew={onAddNew}
          onViewReports={onViewReports}
          onExit={onExit}
          onDelete={onDelete}
          onViewPhenology={onViewPhenology}
          onViewBiometry={onViewBiometry}
          currentId={currentId}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};
