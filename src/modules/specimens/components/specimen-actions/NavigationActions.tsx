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

  return (
    <div className='flex items-center space-x-2'>
      <button
        className={`${buttonClasses.base} ${buttonClasses.secondary} ${
          currentIndex === 0 || isLoading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        onClick={onNavigateFirst}
        disabled={currentIndex === 0 || isLoading}
        title='Первый образец'
        aria-label='Первый образец'
      >
        <FirstPageIcon />
      </button>

      <button
        className={`${buttonClasses.base} ${buttonClasses.secondary} ${
          currentIndex === 0 || isLoading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        onClick={onNavigatePrev}
        disabled={currentIndex === 0 || isLoading}
        title='Предыдущий образец'
        aria-label='Предыдущий образец'
      >
        <NavigateBeforeIcon />
      </button>

      <div className='mx-2 text-sm'>
        <span className='mr-1'>{currentIndex + 1}</span>
        <span className='text-gray-500'>из</span>
        <span className='ml-1'>{totalCount}</span>
      </div>

      {onNavigateToIndex && (
        <div className='flex items-center'>
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
            className={`${buttonClasses.secondary} text-xs ml-1 py-1 px-2`}
            onClick={handleGoToIndex}
            disabled={!indexInput || isLoading}
          >
            Перейти
          </button>
        </div>
      )}

      <button
        className={`${buttonClasses.base} ${buttonClasses.secondary} ${
          currentIndex === totalCount - 1 || isLoading
            ? 'opacity-50 cursor-not-allowed'
            : ''
        }`}
        onClick={onNavigateNext}
        disabled={currentIndex === totalCount - 1 || isLoading}
        title='Следующий образец'
        aria-label='Следующий образец'
      >
        <NavigateNextIcon />
      </button>

      <button
        className={`${buttonClasses.base} ${buttonClasses.secondary} ${
          currentIndex === totalCount - 1 || isLoading
            ? 'opacity-50 cursor-not-allowed'
            : ''
        }`}
        onClick={onNavigateLast}
        disabled={currentIndex === totalCount - 1 || isLoading}
        title='Последний образец'
        aria-label='Последний образец'
      >
        <LastPageIcon />
      </button>
    </div>
  );
};
