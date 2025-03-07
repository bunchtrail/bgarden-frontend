import React, { useState } from 'react';
import {
  FirstPageIcon,
  LastPageIcon,
  NavigateBeforeIcon,
  NavigateNextIcon,
} from '../icons';
import { buttonClasses } from '../styles';

interface NavigationActionsProps {
  currentIndex: number;
  totalCount: number;
  onNavigateFirst: () => void;
  onNavigateLast: () => void;
  onNavigatePrev: () => void;
  onNavigateNext: () => void;
  onNavigateToIndex?: (index: number) => void;
  isLoading?: boolean;
}

export const NavigationActions: React.FC<NavigationActionsProps> = ({
  currentIndex,
  totalCount,
  onNavigateFirst,
  onNavigateLast,
  onNavigatePrev,
  onNavigateNext,
  onNavigateToIndex,
  isLoading = false,
}) => {
  const [indexInput, setIndexInput] = useState<string>('');

  const handleGoToIndex = () => {
    if (indexInput && onNavigateToIndex) {
      const index = parseInt(indexInput, 10);
      if (!isNaN(index) && index > 0 && index <= totalCount) {
        onNavigateToIndex(index - 1); // Преобразуем из пользовательского индекса (с 1) в программный (с 0)
        setIndexInput('');
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleGoToIndex();
    }
  };

  // Функция для единообразного применения стилей кнопок
  const getButtonStyle = (isDisabled: boolean) => {
    return `${buttonClasses.base} ${buttonClasses.outline} ${
      isDisabled ? 'opacity-50 cursor-not-allowed' : ''
    }`;
  };

  return (
    <div className='flex flex-wrap items-center gap-2'>
      <div className='flex items-center'>
        <button
          className={getButtonStyle(currentIndex === 0 || isLoading)}
          onClick={onNavigateFirst}
          disabled={currentIndex === 0 || isLoading}
          title='Первый образец'
          aria-label='Первый образец'
        >
          <FirstPageIcon />
        </button>

        <button
          className={getButtonStyle(currentIndex === 0 || isLoading)}
          onClick={onNavigatePrev}
          disabled={currentIndex === 0 || isLoading}
          title='Предыдущий образец'
          aria-label='Предыдущий образец'
        >
          <NavigateBeforeIcon />
        </button>
      </div>

      <div className='px-2 py-1 bg-gray-100 rounded text-sm flex items-center'>
        <span className='font-medium'>{currentIndex + 1}</span>
        <span className='text-gray-500 mx-1'>из</span>
        <span className='font-medium'>{totalCount}</span>
      </div>

      <div className='flex items-center'>
        <button
          className={getButtonStyle(
            currentIndex === totalCount - 1 || isLoading
          )}
          onClick={onNavigateNext}
          disabled={currentIndex === totalCount - 1 || isLoading}
          title='Следующий образец'
          aria-label='Следующий образец'
        >
          <NavigateNextIcon />
        </button>

        <button
          className={getButtonStyle(
            currentIndex === totalCount - 1 || isLoading
          )}
          onClick={onNavigateLast}
          disabled={currentIndex === totalCount - 1 || isLoading}
          title='Последний образец'
          aria-label='Последний образец'
        >
          <LastPageIcon />
        </button>
      </div>

      {onNavigateToIndex && (
        <div className='flex items-center ml-2'>
          <input
            type='number'
            min={1}
            max={totalCount}
            value={indexInput}
            onChange={(e) => setIndexInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className='w-16 border rounded-md px-2 py-1 text-sm'
            placeholder='№'
            disabled={isLoading}
          />
          <button
            className={`${buttonClasses.outline} text-xs ml-1 py-1 px-2`}
            onClick={handleGoToIndex}
            disabled={!indexInput || isLoading}
          >
            Перейти
          </button>
        </div>
      )}
    </div>
  );
};
