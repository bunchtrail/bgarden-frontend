import React from 'react';
import { Specimen, SectorType } from '../../types';
import { sectorTypeColors } from '../../styles';
import ActionButtons from '../specimens-controls/ActionButtons';

interface SpecimenRowProps {
  specimen: Specimen;
  getSectorTypeName: (sectorType: SectorType) => string;
  onDelete: (id: number) => void;
}

/**
 * Компонент строки таблицы для образца в режиме списка
 */
const SpecimenRow: React.FC<SpecimenRowProps> = ({
  specimen,
  getSectorTypeName,
  onDelete
}) => {
  const sectorType = specimen.sectorType as SectorType;
  const sectorColor = sectorTypeColors[sectorType] || sectorTypeColors[0];
  
  return (
    <tr className="hover:bg-[#F5F5F7] transition-colors duration-150">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div>
            <div className="text-sm font-medium text-[#1D1D1F]">
              {specimen.russianName || 'Без названия'}
            </div>
            {specimen.latinName && (
              <div className="text-sm text-[#86868B] italic">
                {specimen.latinName}
              </div>
            )}
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-[#1D1D1F] bg-[#F5F5F7] inline-block px-2 py-1 rounded">
          {specimen.inventoryNumber}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-[#1D1D1F]">{specimen.familyName}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${sectorColor.bg} ${sectorColor.text}`}>
          {getSectorTypeName(sectorType)}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <ActionButtons specimenId={specimen.id} onDelete={onDelete} variant="row" />
      </td>
    </tr>
  );
};

export default SpecimenRow; 