import React from 'react';
import {
  AddIcon,
  DeleteIcon,
  ExitToAppIcon,
  MonitorHeartIcon,
  SearchIcon,
} from '../icons';
import { buttonClasses } from '../styles';

interface AdditionalActionsProps {
  onAddNew: () => void;
  onViewReports: () => void;
  onExit: () => void;
  onDelete?: (id: number) => void;
  onViewPhenology?: () => void;
  onViewBiometry?: () => void;
  currentId?: number;
  isLoading?: boolean;
}

export const AdditionalActions: React.FC<AdditionalActionsProps> = ({
  onAddNew,
  onViewReports,
  onExit,
  onDelete,
  onViewPhenology,
  onViewBiometry,
  currentId,
  isLoading = false,
}) => {
  return (
    <div className='flex items-center space-x-2'>
      <button
        className={`${buttonClasses.success} ${
          isLoading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        onClick={onAddNew}
        disabled={isLoading}
        title='Добавить новый образец'
        aria-label='Добавить новый образец'
      >
        <AddIcon className='mr-1' /> Создать
      </button>

      {onViewPhenology && (
        <button
          className={`${buttonClasses.secondary} ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          onClick={onViewPhenology}
          disabled={isLoading}
          title='Фенология'
          aria-label='Фенология'
        >
          <MonitorHeartIcon className='mr-1' /> Фенология
        </button>
      )}

      {onViewBiometry && (
        <button
          className={`${buttonClasses.secondary} ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          onClick={onViewBiometry}
          disabled={isLoading}
          title='Биометрия'
          aria-label='Биометрия'
        >
          <MonitorHeartIcon className='mr-1' /> Биометрия
        </button>
      )}

      <button
        className={`${buttonClasses.secondary} ${
          isLoading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        onClick={onViewReports}
        disabled={isLoading}
        title='Запросы и отчеты'
        aria-label='Запросы и отчеты'
      >
        <SearchIcon className='mr-1' /> Запросы
      </button>

      {onDelete && currentId && (
        <button
          className={`${buttonClasses.danger} ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          onClick={() => onDelete(currentId)}
          disabled={isLoading}
          title='Удалить образец'
          aria-label='Удалить образец'
        >
          <DeleteIcon className='mr-1' /> Удалить
        </button>
      )}

      <button
        className={buttonClasses.secondary}
        onClick={onExit}
        title='Выйти'
        aria-label='Выйти'
      >
        <ExitToAppIcon className='mr-1' /> Выйти
      </button>
    </div>
  );
};
