import React from 'react';
import { 
  FileDownloadIcon, 
  PrintIcon 
} from '../icons';
import { buttonClasses } from '../styles';

interface ExportActionsProps {
  onPrintCurrent: () => void;
  onPrintList: () => void;
  onExportToExcel: () => void;
  onExportToPdf: () => void;
  isLoading?: boolean;
}

export const ExportActions: React.FC<ExportActionsProps> = ({
  onPrintCurrent,
  onPrintList,
  onExportToExcel,
  onExportToPdf,
  isLoading = false,
}) => {
  return (
    <div className="flex items-center space-x-2">
      <button
        className={`${buttonClasses.base} ${buttonClasses.secondary} ${
          isLoading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        onClick={onPrintCurrent}
        disabled={isLoading}
        title="Распечатать текущий образец"
        aria-label="Распечатать текущий образец"
      >
        <PrintIcon />
      </button>
      
      <button
        className={`${buttonClasses.base} ${buttonClasses.secondary} ${
          isLoading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        onClick={onPrintList}
        disabled={isLoading}
        title="Распечатать список образцов"
        aria-label="Распечатать список образцов"
      >
        <PrintIcon /> <span className="text-xs ml-1">Список</span>
      </button>
      
      <button
        className={`${buttonClasses.base} ${buttonClasses.success} ${
          isLoading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        onClick={onExportToExcel}
        disabled={isLoading}
        title="Экспорт в Excel"
        aria-label="Экспорт в Excel"
      >
        <FileDownloadIcon /> <span className="text-xs ml-1">Excel</span>
      </button>
      
      <button
        className={`${buttonClasses.base} ${buttonClasses.secondary} ${
          isLoading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        onClick={onExportToPdf}
        disabled={isLoading}
        title="Экспорт в PDF"
        aria-label="Экспорт в PDF"
      >
        <FileDownloadIcon /> <span className="text-xs ml-1">PDF</span>
      </button>
    </div>
  );
}; 