import React from 'react';
import { Specimen, SectorType } from '../../types';
import { layoutClasses, animationClasses } from '../../../../styles/global-styles';
import SpecimenCard from './SpecimenCard';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

  if (specimens.length === 0) {
    return (
      <div className="w-full py-12 flex items-center justify-center">
        <div className="text-center px-4 py-8 rounded-xl bg-white/80 border border-[#E5E5EA]/60 shadow-sm">
          <p className="text-[#86868B] mb-2">Нет доступных образцов</p>
          <p className="text-xs text-[#AEAEB2]">Добавьте новый образец, чтобы увидеть его здесь</p>
        </div>
      </div>
    );
  }

  const handleCardClick = (specimenId: number) => {
    navigate(`/specimens/${specimenId}`);
  };

  return (
    <div className={`${layoutClasses.grid4.replace('gap-6', 'gap-8')} ${animationClasses.fadeIn}`}>
      {specimens.map((specimen) => (
        <div key={specimen.id} className={`${animationClasses.transition} ${animationClasses.springHover}`}>
          <SpecimenCard
            specimen={specimen}
            getSectorTypeName={getSectorTypeName}
            onDelete={onDelete}
            onClick={() => handleCardClick(specimen.id)}
          />
        </div>
      ))}
    </div>
  );
};

export default SpecimensGrid; 