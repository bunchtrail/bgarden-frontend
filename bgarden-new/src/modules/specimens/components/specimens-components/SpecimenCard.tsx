import React from 'react';
import { Specimen, SectorType } from '../../types';
import { sectorTypeColors } from '../../styles';
import { cardClasses, animationClasses, textClasses } from '../../../../styles/global-styles';
import ActionButtons from '../specimens-controls/ActionButtons';

interface SpecimenCardProps {
  specimen: Specimen;
  getSectorTypeName: (sectorType: SectorType) => string;
  onDelete: (id: number) => void;
}

/**
 * Компонент карточки образца для отображения в режиме сетки
 */
const SpecimenCard: React.FC<SpecimenCardProps> = ({
  specimen,
  getSectorTypeName,
  onDelete
}) => {
  const sectorType = specimen.sectorType as SectorType;
  const sectorColor = sectorTypeColors[sectorType] || sectorTypeColors[0];
  
  return (
    <div className={`${cardClasses.base} ${cardClasses.outlined} overflow-hidden transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px]`}>
      {/* Верхняя полоса с категорией и ID */}
      <div className={`${sectorColor.bg} py-3 px-4 flex justify-between items-center border-b border-gray-200`}>
        <span className="text-xs font-medium px-2 py-1 bg-white/60 backdrop-blur-sm rounded-full shadow-sm">
          <span className={`${sectorColor.text}`}>{getSectorTypeName(sectorType)}</span>
        </span>
        <span className="text-xs text-[#86868B] font-medium bg-white/70 backdrop-blur-sm rounded-full px-2 py-1 shadow-sm">
          ID: {specimen.id}
        </span>
      </div>

      {/* Основное содержимое */}
      <div className="p-5">
        {/* Название образца */}
        <h2 className={`${textClasses.heading} text-xl mb-4 text-[#1D1D1F] line-clamp-2`}>
          {specimen.russianName || specimen.latinName || 'Без названия'}
        </h2>
        
        {/* Параметры образца */}
        <div className="space-y-3 mb-5">
          <div className="flex items-center">
            <span className={`${textClasses.small} ${textClasses.secondary} uppercase tracking-wider w-24`}>Инв. номер</span> 
            <span className="bg-[#F5F5F7] px-3 py-1.5 rounded-md text-sm font-medium flex-1">{specimen.inventoryNumber}</span>
          </div>
          
          {specimen.latinName && (
            <div className="flex items-center">
              <span className={`${textClasses.small} ${textClasses.secondary} uppercase tracking-wider w-24`}>Лат. название</span> 
              <span className="text-sm italic flex-1">{specimen.latinName}</span>
            </div>
          )}
          
          {specimen.familyName && (
            <div className="flex items-center">
              <span className={`${textClasses.small} ${textClasses.secondary} uppercase tracking-wider w-24`}>Семейство</span>
              <span className="text-sm flex-1">{specimen.familyName}</span>
            </div>
          )}
          
          {specimen.regionName && (
            <div className="flex items-center">
              <span className={`${textClasses.small} ${textClasses.secondary} uppercase tracking-wider w-24`}>Регион</span>
              <span className="text-sm flex-1">{specimen.regionName}</span>
            </div>
          )}
        </div>

        {/* Разделитель */}
        <div className="border-t border-gray-100 mb-4"></div>

        {/* Кнопки действий */}
        <div className="flex justify-end">
          <ActionButtons specimenId={specimen.id} onDelete={onDelete} variant="card" />
        </div>
      </div>
    </div>
  );
};

export default SpecimenCard; 