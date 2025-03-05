import React, { useState } from 'react';
import styles from './specimens.module.css';
import {
  buttonClasses,
  containerClasses,
  dividerClasses,
  subheadingClasses,
} from './styles';

import {
  AddIcon,
  DeleteIcon,
  ExitToAppIcon,
  FileDownloadIcon,
  FirstPageIcon,
  LastPageIcon,
  ListAltIcon,
  MonitorHeartIcon,
  NavigateBeforeIcon,
  NavigateNextIcon,
  PrintIcon,
  SearchIcon,
  VisibilityIcon,
} from './icons';

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

export const SpecimenActions: React.FC<SpecimenActionsProps> = ({
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
}) => {
  // Состояние для ввода номера образца
  const [goToIndex, setGoToIndex] = useState<string>('');

  // Обработчик перехода к конкретному образцу
  const handleGoToIndex = () => {
    const index = parseInt(goToIndex, 10);
    if (
      !isNaN(index) &&
      index > 0 &&
      index <= totalCount &&
      onNavigateToIndex
    ) {
      onNavigateToIndex(index - 1); // Преобразуем номер образца в индекс (с нуля)
      setGoToIndex(''); // Очищаем поле ввода
    }
  };

  // Обработчик нажатия Enter в поле ввода
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleGoToIndex();
    }
  };

  // Заголовки секций
  const sectionHeadingClass = subheadingClasses.base;

  // Определяем наличие текущего образца для действий удаления
  const hasCurrentSpecimen =
    totalCount > 0 && currentIndex >= 0 && currentIndex < totalCount;

  // Классы для кнопок навигации
  const navButtonBase =
    'flex items-center justify-center p-2 transition-all duration-200 border border-gray-200 hover:bg-blue-50 hover:border-blue-600 hover:text-blue-600';
  const navButtonDisabled = 'opacity-50 cursor-not-allowed bg-gray-50';
  const navButtonEnabled =
    'hover:bg-blue-50 hover:border-blue-600 hover:text-blue-600';

  return (
    <div className={`${containerClasses.detail} ${styles.fadeIn} p-4`}>
      {/* Навигация */}
      <div className='mb-5'>
        <h2 className='mt-3 mb-3 text-base sm:text-lg font-semibold text-blue-700 flex items-center'>
          <span className='bg-blue-100 p-1 rounded-full mr-2'>
            <NavigateNextIcon size={18} className='text-blue-700' />
          </span>
          Навигация по образцам
        </h2>

        <div className='flex flex-col w-full gap-3'>
          {/* Счетчик записей */}
          <div className='flex items-center bg-blue-50 px-4 py-2 rounded-lg text-sm font-medium w-full'>
            <span className='text-blue-800 whitespace-nowrap'>
              {totalCount > 0
                ? `Образец ${currentIndex + 1} из ${totalCount}`
                : 'Нет образцов'}
            </span>
          </div>

          {/* Кнопки навигации */}
          <div className='flex w-full justify-center gap-1 mb-2'>
            <button
              onClick={onNavigateFirst}
              disabled={isLoading || currentIndex <= 0}
              className={`${navButtonBase} rounded-l-lg ${
                isLoading || currentIndex <= 0
                  ? navButtonDisabled
                  : navButtonEnabled
              }`}
              title='Первый образец'
            >
              <FirstPageIcon size={20} />
            </button>
            <button
              onClick={onNavigatePrev}
              disabled={isLoading || currentIndex <= 0}
              className={`${navButtonBase} ${
                isLoading || currentIndex <= 0
                  ? navButtonDisabled
                  : navButtonEnabled
              }`}
              title='Предыдущий образец'
            >
              <NavigateBeforeIcon size={20} />
            </button>

            {/* Поле для быстрого перехода к образцу */}
            {onNavigateToIndex && totalCount > 0 && (
              <div className='flex items-center bg-white border border-gray-200 rounded-md overflow-hidden'>
                <input
                  type='number'
                  min='1'
                  max={totalCount}
                  value={goToIndex}
                  onChange={(e) => setGoToIndex(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className='w-16 text-center py-1 px-2 border-none focus:ring-0 focus:outline-none'
                  placeholder='№'
                  title='Введите номер образца и нажмите Enter'
                  disabled={isLoading}
                />
                <button
                  onClick={handleGoToIndex}
                  disabled={isLoading || !goToIndex}
                  className='bg-gray-100 hover:bg-gray-200 p-1 border-l border-gray-200'
                  title='Перейти к образцу'
                >
                  <SearchIcon size={18} />
                </button>
              </div>
            )}

            <button
              onClick={onNavigateNext}
              disabled={isLoading || currentIndex >= totalCount - 1}
              className={`${navButtonBase} ${
                isLoading || currentIndex >= totalCount - 1
                  ? navButtonDisabled
                  : navButtonEnabled
              }`}
              title='Следующий образец'
            >
              <NavigateNextIcon size={20} />
            </button>
            <button
              onClick={onNavigateLast}
              disabled={isLoading || currentIndex >= totalCount - 1}
              className={`${navButtonBase} rounded-r-lg ${
                isLoading || currentIndex >= totalCount - 1
                  ? navButtonDisabled
                  : navButtonEnabled
              }`}
              title='Последний образец'
            >
              <LastPageIcon size={20} />
            </button>
          </div>

          {/* Кнопка добавления */}
          <button
            onClick={onAddNew}
            disabled={isLoading}
            className='w-full rounded-lg m-0.5 normal-case px-4 py-2 bg-green-600 hover:bg-green-700 text-white flex items-center justify-center transition-all duration-200 hover:shadow-md'
            title='Добавить новый образец'
          >
            <AddIcon size={20} className='mr-1' />
            <span>Новый образец</span>
          </button>
        </div>
      </div>

      <div className={dividerClasses.base}></div>

      {/* Печать и экспорт */}
      <div className='mb-5'>
        <h2
          className={`${sectionHeadingClass} text-blue-700 flex items-center mb-3`}
        >
          <span className='bg-blue-100 p-1 rounded-full mr-2'>
            <PrintIcon size={18} className='text-blue-700' />
          </span>
          Печать и экспорт
        </h2>
        <div className='flex flex-wrap gap-2'>
          <button
            onClick={onPrintCurrent}
            disabled={isLoading || !hasCurrentSpecimen}
            className={`${buttonClasses.base} ${buttonClasses.secondary} flex items-center transition-all duration-200 hover:shadow-sm`}
            title='Печать текущего образца'
          >
            <PrintIcon size={20} className='mr-1' />
            <span>Текущий образец</span>
          </button>
          <button
            onClick={onPrintList}
            disabled={isLoading}
            className={`${buttonClasses.base} ${buttonClasses.secondary} flex items-center transition-all duration-200 hover:shadow-sm`}
            title='Печать списка образцов'
          >
            <ListAltIcon size={20} className='mr-1' />
            <span>Список образцов</span>
          </button>
          <button
            onClick={onExportToExcel}
            disabled={isLoading}
            className={`${buttonClasses.base} ${buttonClasses.success} flex items-center transition-all duration-200 hover:shadow-sm`}
            title='Экспорт в Excel'
          >
            <FileDownloadIcon size={20} className='mr-1' />
            <span>Excel</span>
          </button>
          <button
            onClick={onExportToPdf}
            disabled={isLoading}
            className={`${buttonClasses.base} ${buttonClasses.secondary} flex items-center transition-all duration-200 hover:shadow-sm`}
            title='Экспорт в PDF'
          >
            <FileDownloadIcon size={20} className='mr-1' />
            <span>PDF</span>
          </button>
        </div>
      </div>

      <div className={dividerClasses.base}></div>

      {/* Дополнительные модули */}
      <div className='mb-5'>
        <h2
          className={`${sectionHeadingClass} text-blue-700 flex items-center mb-3`}
        >
          <span className='bg-blue-100 p-1 rounded-full mr-2'>
            <VisibilityIcon size={18} className='text-blue-700' />
          </span>
          Дополнительные модули
        </h2>
        <div className='flex flex-wrap gap-2'>
          {onViewPhenology && (
            <button
              onClick={onViewPhenology}
              disabled={isLoading || !hasCurrentSpecimen}
              className={`${buttonClasses.base} ${buttonClasses.secondary} flex items-center transition-all duration-200 hover:shadow-sm hover:bg-blue-50`}
              title='Фенологические наблюдения'
            >
              <MonitorHeartIcon size={20} className='mr-1' />
              <span>Фенология</span>
            </button>
          )}
          {onViewBiometry && (
            <button
              onClick={onViewBiometry}
              disabled={isLoading || !hasCurrentSpecimen}
              className={`${buttonClasses.base} ${buttonClasses.secondary} flex items-center transition-all duration-200 hover:shadow-sm hover:bg-blue-50`}
              title='Биометрические показатели'
            >
              <VisibilityIcon size={20} className='mr-1' />
              <span>Биометрия</span>
            </button>
          )}
          <button
            onClick={onViewReports}
            disabled={isLoading}
            className={`${buttonClasses.base} ${buttonClasses.secondary} flex items-center transition-all duration-200 hover:shadow-sm hover:bg-blue-50`}
            title='Формирование отчетов'
          >
            <ListAltIcon size={20} className='mr-1' />
            <span>Отчеты</span>
          </button>
        </div>
      </div>

      <div className={dividerClasses.base}></div>

      {/* Системные действия */}
      <div className='mb-2'>
        <h2
          className={`${sectionHeadingClass} text-blue-700 flex items-center mb-3`}
        >
          <span className='bg-blue-100 p-1 rounded-full mr-2'>
            <ExitToAppIcon size={18} className='text-blue-700' />
          </span>
          Системные действия
        </h2>
        <div className='flex flex-wrap gap-2'>
          <button
            onClick={onExit}
            disabled={isLoading}
            className={`${buttonClasses.base} ${buttonClasses.secondary} flex items-center transition-all duration-200 hover:shadow-sm`}
            title='Выход в главное меню'
          >
            <ExitToAppIcon size={20} className='mr-1' />
            <span>Выход</span>
          </button>
          {onDelete && (
            <button
              onClick={() => onDelete(currentIndex)}
              disabled={isLoading || !hasCurrentSpecimen}
              className={`${buttonClasses.base} ${buttonClasses.danger} flex items-center transition-all duration-200 hover:shadow-sm`}
              title='Удалить текущий образец'
            >
              <DeleteIcon size={20} className='mr-1' />
              <span>Удалить</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
