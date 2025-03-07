import React from 'react';
import { FileDownloadIcon, PrintIcon } from '../icons';
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
  // Функция для единообразного применения стилей кнопок
  const getButtonStyle = (isDisabled: boolean) => {
    return `${buttonClasses.base} ${buttonClasses.outline} ${
      isDisabled ? 'opacity-50 cursor-not-allowed' : ''
    }`;
  };

  return (
    <div className='flex flex-wrap items-center gap-2'>
      <button
        className={getButtonStyle(isLoading)}
        onClick={onPrintCurrent}
        disabled={isLoading}
        title='Распечатать текущий образец'
        aria-label='Распечатать текущий образец'
      >
        <PrintIcon className='mr-1' /> <span className='text-xs'>Текущий</span>
      </button>

      <button
        className={getButtonStyle(isLoading)}
        onClick={onPrintList}
        disabled={isLoading}
        title='Распечатать список образцов'
        aria-label='Распечатать список образцов'
      >
        <PrintIcon className='mr-1' /> <span className='text-xs'>Список</span>
      </button>

      <button
        className={getButtonStyle(isLoading)}
        onClick={onExportToExcel}
        disabled={isLoading}
        title='Экспорт в Excel'
        aria-label='Экспорт в Excel'
      >
        <FileDownloadIcon className='mr-1' />{' '}
        <span className='text-xs'>Excel</span>
      </button>

      <button
        className={getButtonStyle(isLoading)}
        onClick={onExportToPdf}
        disabled={isLoading}
        title='Экспорт в PDF'
        aria-label='Экспорт в PDF'
      >
        <FileDownloadIcon className='mr-1' />{' '}
        <span className='text-xs'>PDF</span>
      </button>
    </div>
  );
};
