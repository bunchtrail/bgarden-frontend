import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SectorType } from '../../types';
import Button from '../../../ui/components/Button';
import { cardClasses, buttonClasses, animationClasses, textClasses, chipClasses } from '../../../../styles/global-styles';

interface SpecimensHeaderProps {
  activeSectorType: SectorType | null;
  getSectorTypeName: (sectorType: SectorType) => string;
  handleResetSectorFilter: () => void;
  view: 'grid' | 'list';
  toggleView: () => void;
}

/**
 * Компонент заголовка страницы списка образцов
 */
const SpecimensHeader: React.FC<SpecimensHeaderProps> = ({
  activeSectorType,
  getSectorTypeName,
  handleResetSectorFilter,
  view,
  toggleView
}) => {
  const navigate = useNavigate();

  // Обработчик смены сектора
  const handleSectorChange = (sectorType: SectorType) => {
    navigate(`/specimens?sectorType=${sectorType}`);
  };

  return (
    <div className={`${cardClasses.outlined} rounded-xl p-6 bg-white mb-8`}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className={`${textClasses.heading} text-3xl tracking-tight`}>Образцы растений</h1>
          <div className="mt-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <span className={`${textClasses.body} ${textClasses.secondary} pr-1 mb-1 sm:mb-0`}>Сектор:</span>
              <div className="flex flex-wrap gap-2">
                {Object.values(SectorType)
                  .filter(value => typeof value === 'number')
                  .map(sectorType => (
                    <button
                      key={sectorType}
                      className={`${buttonClasses.base} ${animationClasses.transition} ${
                        activeSectorType === sectorType 
                          ? `${chipClasses.primary} font-medium shadow-sm` 
                          : `${buttonClasses.neutral} text-xs`
                      }`}
                      onClick={() => handleSectorChange(sectorType as SectorType)}
                    >
                      {getSectorTypeName(sectorType as SectorType)}
                    </button>
                  ))}
                {activeSectorType !== null && (
                  <Button 
                    variant="neutral" 
                    size="small" 
                    className={`ml-1 text-xs ${animationClasses.transition} flex items-center h-[34px]`}
                    onClick={handleResetSectorFilter}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Сбросить
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex space-x-3">
          <Button 
            variant="neutral"
            size="medium"
            onClick={toggleView}
            className={`flex items-center ${animationClasses.transition}`}
          >
            {view === 'grid' ? (
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                Список
              </span>
            ) : (
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                Сетка
              </span>
            )}
          </Button>
          <Button 
            variant="success"
            onClick={() => navigate(activeSectorType !== null 
              ? `/specimens/new?sectorType=${activeSectorType}` 
              : '/specimens/new'
            )}
            className={`flex items-center ${animationClasses.springHover}`}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Добавить образец
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SpecimensHeader; 