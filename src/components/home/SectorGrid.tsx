import React from 'react';
import SectorCard from '../SectorCard';
import { PatternType } from '../AbstractPattern';
import { SectorType } from '../../modules/specimens/types';

// Данные о секторах
export const sectorData = [
  {
    id: SectorType.Dendrology,
    title: 'Дендрология',
    description:
      'Раздел ботаники, изучающий древесные растения (деревья, кустарники, кустарнички, древесные лианы).',
    patternType: 'dendrology' as PatternType,
    imageUrl: '/images/sectors/dendrology.jpg'
  },
  {
    id: SectorType.Flora,
    title: 'Флора',
    description:
      'Исторически сложившаяся совокупность всех видов растений на определённой территории.',
    patternType: 'flora' as PatternType,
    imageUrl: '/images/sectors/flora.jpg'
  },
  {
    id: SectorType.Flowering,
    title: 'Цветоводство',
    description:
      'Искусство выращивания декоративно-цветущих растений как в открытом, так и в защищённом грунте.',
    patternType: 'flowering' as PatternType,
    imageUrl: '/images/sectors/flowering.jpg'
  },
];

interface SectorGridProps {
  className?: string;
}

const SectorGrid: React.FC<SectorGridProps> = ({ className = '' }) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 transform-gpu ${className}`}>
      {sectorData.map((sector) => (
        <div key={sector.id} className="transform-gpu transition-transform duration-300 hover:translate-y-[-4px] hover:shadow-lg will-change-transform">
          <SectorCard
            key={sector.id}
            id={sector.id}
            title={sector.title}
            description={sector.description}
            patternType={sector.patternType}
          />
        </div>
      ))}
    </div>
  );
};

export default SectorGrid; 