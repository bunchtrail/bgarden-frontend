import React from 'react';
import { SectorType } from '../../types';
import { cardClasses, buttonClasses, textClasses, animationClasses } from '../../../../styles/global-styles';
import Button from '../../../ui/components/Button';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();
  
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

  // Обработчик перехода на страницу создания нового образца
  const handleCreateNew = () => {
    navigate('/specimens/new');
  };

  // Обработчик изменения сектора
  const handleSectorChange = (sectorType: SectorType) => {
    navigate(`/specimens?sectorType=${sectorType}`);
  };

  // Проверяем, пустая ли база данных (нет ни запроса поиска, ни фильтра сектора)
  const isEmptyDatabase = !searchQuery && activeSectorType === null;

  return (
    <div className={`text-center py-16 ${cardClasses.elevated} ${animationClasses.fadeIn} rounded-2xl max-w-3xl mx-auto`}>
      <svg className={`mx-auto h-16 w-16 ${textClasses.tertiary} ${animationClasses.springHover}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h3 className={`mt-4 text-2xl font-medium ${textClasses.primary}`}>Образцы не найдены</h3>
      <p className={`mt-2 ${textClasses.secondary} max-w-md mx-auto`}>
        {getMessage()}
      </p>
      
      <div className="mt-8 space-y-4">
        {searchQuery && (
          <Button 
            variant="primary"
            onClick={onResetSearch}
            className={animationClasses.transition}
          >
            Сбросить поиск
          </Button>
        )}
        
        {activeSectorType !== null && (
          <div className="inline-flex flex-wrap justify-center items-center gap-2 max-w-lg mx-auto">
            <div className={`${textClasses.body} ${textClasses.secondary}`}>
              Попробуйте другой сектор:
            </div>
            {Object.values(SectorType)
              .filter(value => typeof value === 'number' && value !== activeSectorType)
              .map(sectorType => (
                <button
                  key={sectorType}
                  className={`${buttonClasses.base} ${buttonClasses.neutral} py-1 px-3 text-xs ${animationClasses.transition}`}
                  onClick={() => handleSectorChange(sectorType as SectorType)}
                >
                  {getSectorTypeName(sectorType as SectorType)}
                </button>
              ))}
            <Button 
              variant="neutral"
              size="small"
              onClick={onResetSectorFilter}
              className={`text-xs ${animationClasses.transition}`}
            >
              <span className="flex items-center">
                <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Сбросить 
              </span>
            </Button>
          </div>
        )}
        
        {isEmptyDatabase && (
          <Button 
            variant="primary"
            onClick={handleCreateNew}
            className={animationClasses.transition}
          >
            Создать первый образец
          </Button>
        )}
      </div>
    </div>
  );
};

export default SpecimensEmptyState; 