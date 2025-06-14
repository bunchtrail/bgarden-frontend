import React from 'react';
import { Specimen, SectorType } from '../../types';
import { sectorTypeColors, getSectorTypeNumber } from '../../styles';
import { animationClasses } from '../../../../styles/global-styles';
import ActionButtons from '../specimens-controls/ActionButtons';

interface SpecimenRowProps {
  specimen: Specimen;
  getSectorTypeName: (sectorType: SectorType) => string;
  onDelete: (id: number) => void;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Компонент строки таблицы для образца в режиме списка
 */
const SpecimenRow: React.FC<SpecimenRowProps> = ({
  specimen,
  getSectorTypeName,
  onDelete,
  className = '',
  style = {},
}) => {
  const sectorTypeNumber = getSectorTypeNumber(specimen.sectorType);
  const sectorType = sectorTypeNumber as SectorType;
  const sectorColor = sectorTypeColors[sectorTypeNumber as keyof typeof sectorTypeColors] || sectorTypeColors[0];
  return (
    <tr
      className={`${animationClasses.transition} hover:bg-[#F5F5F7]/90 group cursor-default ${className}`}
      style={style}
    >
      <td className="px-6 py-4 whitespace-nowrap w-1/4">
        <div className="flex items-center">
          <div>
            <div className="text-sm font-medium text-[#1D1D1F] group-hover:text-[#0A84FF] transition-colors duration-200">
              {specimen.russianName || 'Без названия'}
            </div>
            {specimen.latinName && (
              <div className="text-sm text-[#86868B] italic mt-1">
                {specimen.latinName}
              </div>
            )}
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap w-1/6">
        <div className="text-sm font-medium text-[#1D1D1F] bg-[#F5F5F7] inline-block px-2.5 py-1.5 rounded-md shadow-sm">
          {specimen.inventoryNumber}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap w-1/6">
        <div className="text-sm text-[#1D1D1F]">
          {specimen.familyName || (
            <span className="text-[#86868B] italic">Не указано</span>
          )}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap w-1/6">
        <span
          className={`px-3 py-1.5 inline-flex text-xs leading-5 font-semibold rounded-full ${sectorColor.bg} ${sectorColor.text} shadow-sm ${animationClasses.transition} ${sectorColor.hoverBg}`}
        >
          {getSectorTypeName(sectorType)}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium w-1/6">
        <div className="opacity-80 group-hover:opacity-100 transition-opacity">
          <ActionButtons
            specimenId={specimen.id}
            onDelete={onDelete}
            variant="row"
          />
        </div>
      </td>
    </tr>
  );
};

export default React.memo(SpecimenRow);
