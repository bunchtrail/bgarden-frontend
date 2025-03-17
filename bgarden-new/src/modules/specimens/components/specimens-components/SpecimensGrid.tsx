import React from 'react';
import { Specimen, SectorType } from '../../types';
import { layoutClasses } from '../../../../styles/global-styles';
import SpecimenCard from './SpecimenCard';

interface SpecimensGridProps {
  specimens: Specimen[];
  getSectorTypeName: (sectorType: SectorType) => string;
  onDelete: (id: number) => void;
}

/**
 * Компонент отображения списка образцов в виде сетки
 */
const SpecimensGrid: React.FC<SpecimensGridProps> = ({
  specimens,
  getSectorTypeName,
  onDelete
}) => {
  return (
    <div className={layoutClasses.grid4.replace('gap-6', 'gap-8')}>
      {specimens.map((specimen) => (
        <SpecimenCard
          key={specimen.id}
          specimen={specimen}
          getSectorTypeName={getSectorTypeName}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default SpecimensGrid; 