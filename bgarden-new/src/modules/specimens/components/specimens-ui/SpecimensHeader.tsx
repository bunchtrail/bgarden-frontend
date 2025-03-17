import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SectorType } from '../../types';
import Button from '../../../ui/components/Button';
import { cardClasses, buttonClasses, animationClasses, textClasses } from '../../../../styles/global-styles';

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

  return (
    <div className={`${cardClasses.outlined} rounded-xl p-6 bg-white mb-8`}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className={`${textClasses.heading} text-3xl tracking-tight`}>Образцы растений</h1>
          {activeSectorType !== null && (
            <div className="flex items-center mt-2">
              <span className="text-sm bg-[#E1F0FF] text-[#0A84FF] py-1 px-3 rounded-full font-medium shadow-sm">
                Сектор: {getSectorTypeName(activeSectorType)}
              </span>
              <Button 
                variant="neutral" 
                size="small" 
                className="ml-2 text-xs hover:bg-gray-200 transition-colors duration-200"
                onClick={handleResetSectorFilter}
              >
                Сбросить фильтр
              </Button>
            </div>
          )}
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
            onClick={() => navigate('/specimens/new')}
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