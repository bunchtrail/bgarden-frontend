import React, { useState } from 'react';
import { AbstractPattern, PatternType, SectorCard } from '../../../modules/ui';
import { SectorType } from '../../../modules/specimens/types';

// Данные о секторах
export const sectorData = [
  {
    id: SectorType.Dendrology,
    title: 'Дендрология',
    description: '',
    patternType: 'dendrology' as PatternType,
    imageUrl: '/images/sectors/dendrology.jpg'
  },
  {
    id: SectorType.Flora,
    title: 'Флора',
    description: '',
    patternType: 'flora' as PatternType,
    imageUrl: '/images/sectors/flora.jpg'
  },
  {
    id: SectorType.Flowering,
    title: 'Цветоводство',
    description: '',
    patternType: 'flowering' as PatternType,
    imageUrl: '/images/sectors/flowering.jpg'
  },
];

interface SectorGridProps {
  className?: string;
}

const SectorGrid: React.FC<SectorGridProps> = ({ className = '' }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="mb-12">
      <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 transform-gpu relative ${className}`}>
        {sectorData.map((sector, index) => (
          <div 
            key={sector.id} 
            className={`transform-gpu transition-all duration-500 will-change-transform
                      ${hoveredIndex === index ? 'z-10 scale-[1.02]' : 
                        hoveredIndex !== null ? 'scale-[0.99] opacity-85' : ''}`}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className={`transition-all duration-500 shadow-md
                          ${hoveredIndex === index ? 'shadow-lg' : ''}`}>
              <SectorCard
                id={sector.id}
                title={sector.title}
                description={sector.description}
                patternType={sector.patternType}
              />
            </div>
          </div>
        ))}
      </div>
      
      
    </div>
  );
};

export default SectorGrid; 