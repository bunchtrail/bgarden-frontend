import React from 'react';
import { SectorType } from '../../types';
import { cardClasses } from '../../../../styles/global-styles';
import Button from '../../../ui/components/Button';

interface SpecimensEmptyStateProps {
  searchQuery: string;
  activeSectorType: SectorType | null;
  getSectorTypeName: (sectorType: SectorType) => string;
  onResetSearch: () => void;
  onResetSectorFilter: () => void;
}

/**
 * Компонент для отображения пустого состояния списка образцов
 */
const SpecimensEmptyState: React.FC<SpecimensEmptyStateProps> = ({
  searchQuery,
  activeSectorType,
  getSectorTypeName,
  onResetSearch,
  onResetSectorFilter
}) => {
  // Текст сообщения в зависимости от фильтров
  const getMessage = () => {
    if (searchQuery) {
      return 'По вашему запросу ничего не найдено';
    } else if (activeSectorType !== null) {
      return `В секторе "${getSectorTypeName(activeSectorType)}" пока нет образцов`;
    } else {
      return 'В базе данных пока нет образцов';
    }
  };

  return (
    <div className={`text-center py-16 ${cardClasses.elevated}`}>
      <svg className="mx-auto h-16 w-16 text-[#AEAEB2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h3 className="mt-4 text-2xl font-medium text-[#1D1D1F]">Образцы не найдены</h3>
      <p className="mt-2 text-[#86868B] max-w-md mx-auto">
        {getMessage()}
      </p>
      {(searchQuery || activeSectorType !== null) && (
        <div className="mt-6 space-x-3">
          {searchQuery && (
            <Button 
              variant="primary"
              onClick={onResetSearch}
            >
              Сбросить поиск
            </Button>
          )}
          {activeSectorType !== null && (
            <Button 
              variant="neutral"
              onClick={onResetSectorFilter}
            >
              Сбросить фильтр сектора
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default SpecimensEmptyState; 