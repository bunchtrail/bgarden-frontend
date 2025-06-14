import React from 'react';
import { SectorType } from '../../../types';
import { sectorTypeColors, statusColors, getSectorTypeNumber } from '../../../styles';

interface SpecimenBadgesProps {
  sectorType: SectorType;
  hasHerbarium?: boolean;
  getSectorTypeName: (sectorType: SectorType) => string;
}

export const SpecimenBadges: React.FC<SpecimenBadgesProps> = ({
  sectorType,
  hasHerbarium,
  getSectorTypeName
}) => {
  const sectorTypeNumber = getSectorTypeNumber(sectorType);
  const sectorColor = sectorTypeColors[sectorTypeNumber as keyof typeof sectorTypeColors] || sectorTypeColors[0];
  
  return (
    <div className="flex items-center justify-between mb-4">
      {/* Сектор */}
      <span 
        className={`text-xs font-medium px-2.5 py-1.5 bg-white/70 
          rounded-full shadow-sm flex items-center space-x-1 ${sectorColor.text} font-semibold`}
        aria-label={`Сектор: ${getSectorTypeName(sectorTypeNumber as SectorType)}`}
      >
        {getSectorTypeName(sectorTypeNumber as SectorType)}
      </span>
      
      {/* Дополнительные бейджи */}
      {hasHerbarium && (
        <span
          className={`text-xs font-medium px-2 py-1 ${statusColors.info.bg} ${statusColors.info.text} 
          rounded-full shadow-sm ml-2`}
          aria-label="Имеется гербарий"
        >
          Гербарий
        </span>
      )}
    </div>
  );
}; 