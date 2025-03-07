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
  // Функция для единообразного применения стилей кнопок
  const getButtonStyle = (type: 'primary' | 'danger' | 'default', isDisabled: boolean) => {
    const baseStyle = `${buttonClasses.base} ${buttonClasses.outline}`;
    
    if (type === 'primary') {
      return `${baseStyle} text-green-700 border-green-600 hover:bg-green-50 ${
        isDisabled ? 'opacity-50 cursor-not-allowed' : ''
      }`;
    } else if (type === 'danger') {
      return `${baseStyle} text-red-700 border-red-600 hover:bg-red-50 ${
        isDisabled ? 'opacity-50 cursor-not-allowed' : ''
      }`;
    } else {
      return `${baseStyle} ${
        isDisabled ? 'opacity-50 cursor-not-allowed' : ''
      }`;
    }
  };

  return (
    <div className='flex flex-wrap items-center gap-2'>
      <button
        className={getButtonStyle('primary', isLoading)}
        onClick={onAddNew}
        disabled={isLoading}
        title='Добавить новый образец'
        aria-label='Добавить новый образец'
      >
        <AddIcon className='mr-1' /> Создать
      </button>

      {onViewPhenology && (
        <button
          className={getButtonStyle('default', isLoading)}
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
          className={getButtonStyle('default', isLoading)}
          onClick={onViewBiometry}
          disabled={isLoading}
          title='Биометрия'
          aria-label='Биометрия'
        >
          <MonitorHeartIcon className='mr-1' /> Биометрия
        </button>
      )}

      <button
        className={getButtonStyle('default', isLoading)}
        onClick={onViewReports}
        disabled={isLoading}
        title='Запросы и отчеты'
        aria-label='Запросы и отчеты'
      >
        <SearchIcon className='mr-1' /> Запросы
      </button>

      {onDelete && currentId && (
        <button
          className={getButtonStyle('danger', isLoading)}
          onClick={() => onDelete(currentId)}
          disabled={isLoading}
          title='Удалить образец'
          aria-label='Удалить образец'
        >
          <DeleteIcon className='mr-1' /> Удалить
        </button>
      )}

      <button
        className={getButtonStyle('default', false)}
        onClick={onExit}
        title='Выйти'
        aria-label='Выйти'
      >
        <ExitToAppIcon className='mr-1' /> Выйти
      </button>
    </div>
  );
};
