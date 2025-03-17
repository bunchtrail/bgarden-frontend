import React from 'react';
import { Specimen, SectorType } from '../types';
import { sectorTypeColors } from '../styles';
import { cardClasses, animationClasses } from '../../../styles/global-styles';
import ActionButtons from './ActionButtons';

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
    <div className={`${cardClasses.elevated} ${animationClasses.springHover}`}>
      <div className={`${sectorColor.bg} py-3 px-4 flex justify-between items-center`}>
        <span className={`text-xs font-medium ${sectorColor.text} rounded-full px-2 py-1 bg-white bg-opacity-30`}>
          {getSectorTypeName(sectorType)}
        </span>
        <span className="text-xs text-[#86868B] font-medium bg-white bg-opacity-70 rounded-full px-2 py-1">
          ID: {specimen.id}
        </span>
      </div>
      <div className="p-5">
        <h2 className="text-xl font-semibold mb-3 text-[#1D1D1F] line-clamp-2">
          {specimen.russianName || specimen.latinName || 'Без названия'}
        </h2>
        
        <div className="text-sm text-[#86868B] space-y-2">
          <p className="flex items-center">
            <span className="font-medium w-24 text-[#1D1D1F]">Инв. номер:</span> 
            <span className="bg-[#F5F5F7] px-2 py-1 rounded">{specimen.inventoryNumber}</span>
          </p>
          {specimen.latinName && (
            <p className="flex items-center italic">
              <span className="font-medium not-italic w-24 text-[#1D1D1F]">Лат. название:</span> {specimen.latinName}
            </p>
          )}
          {specimen.familyName && (
            <p className="flex items-center">
              <span className="font-medium w-24 text-[#1D1D1F]">Семейство:</span> {specimen.familyName}
            </p>
          )}
          {specimen.regionName && (
            <p className="flex items-center">
              <span className="font-medium w-24 text-[#1D1D1F]">Регион:</span> {specimen.regionName}
            </p>
          )}
        </div>

        <div className="mt-5">
          <ActionButtons specimenId={specimen.id} onDelete={onDelete} variant="card" />
        </div>
      </div>
    </div>
  );
};

export default SpecimenCard; 