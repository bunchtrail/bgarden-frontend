import React from 'react';
import { AbstractPattern, PatternType, SectorCard, Card } from '@modules/ui';
import { SectorType } from '@modules/specimens/types';

// Данные о секторах
export const sectorData = [
  {
    id: SectorType.Dendrology,
    title: 'Дендрология',
    description: 'Изучение и сохранение древесных растений',
    patternType: 'dendrology' as PatternType,
    imageUrl: '/images/sectors/dendrology.jpg'
  },
  {
    id: SectorType.Flora,
    title: 'Флора',
    description: 'Коллекция цветковых растений',
    patternType: 'flora' as PatternType,
    imageUrl: '/images/sectors/flora.jpg'
  },
  {
    id: SectorType.Flowering,
    title: 'Цветоводство',
    description: 'Декоративные цветочные растения',
    patternType: 'flowering' as PatternType,
    imageUrl: '/images/sectors/flowering.jpg'
  },
];

interface SectorGridProps {
  className?: string;
}

/**
 * Компонент для отображения сетки секторов ботанического сада
 */
const SectorGrid: React.FC<SectorGridProps> = ({ className = '' }) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {sectorData.map((sector) => (
        <SectorCard
          key={sector.id}
          id={sector.id}
          title={sector.title}
          description={sector.description}
          patternType={sector.patternType}
          imageUrl={sector.imageUrl}
        />
      ))}
      
      {/* Примеры использования других UI компонентов */}
      <Card 
        title="Дополнительная информация" 
        subtitle="Используйте эту карточку для просмотра деталей"
        variant="outlined"
        footer={<div className="text-center text-sm text-gray-500">© Ботанический сад</div>}
      >
        <p className="mb-3">Здесь может быть размещена дополнительная информация о секторах и экспозициях ботанического сада.</p>
      </Card>
    </div>
  );
};

export default SectorGrid; 