import React, { useState } from 'react';
import { Specimen, SectorType } from '../../types';
import { animationClasses } from '../../../../styles/global-styles';
import { Card } from '../../../ui';
import { 
  getSpecimenCardHeader, 
  SpecimenBadges, 
  SpecimenDetails,
  SpecimenCardFooter 
} from './card-parts';
import SpecimenModal from './SpecimenModal';

interface SpecimenCardProps {
  specimen: Specimen;
  getSectorTypeName: (sectorType: SectorType) => string;
  onDelete: (id: number) => void;
  onClick?: () => void;
  isClickable?: boolean;
}

/**
 * Компонент карточки образца для отображения в режиме сетки
 */
const SpecimenCard: React.FC<SpecimenCardProps> = ({
  specimen,
  getSectorTypeName,
  onDelete,
  onClick,
  isClickable = true
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const sectorType = specimen.sectorType as SectorType;
  
  // Получаем пропсы для заголовка
  const headerProps = getSpecimenCardHeader({
    id: specimen.id,
    russianName: specimen.russianName,
    latinName: specimen.latinName,
    sectorType
  });
  
  const handleCardClick = () => {
    if (onClick) {
      onClick();
    } else if (isClickable) {
      setIsModalOpen(true);
    }
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  
  return (
    <>
      <Card
        className={`${animationClasses.transition} group overflow-hidden backdrop-blur-md 
          hover:shadow-lg hover:border-[#0A84FF]/20 ${isClickable ? 'cursor-pointer' : ''}`}
        headerClassName={headerProps.headerClassName}
        title={headerProps.title}
        subtitle={headerProps.subtitle}
        headerAction={headerProps.headerAction}
        footer={
          <SpecimenCardFooter 
            specimenId={specimen.id} 
            onDelete={onDelete} 
          />
        }
        onClick={isClickable ? handleCardClick : undefined}
      >
        <SpecimenBadges 
          sectorType={sectorType}
          hasHerbarium={specimen.hasHerbarium}
          getSectorTypeName={getSectorTypeName}
        />
        
        <SpecimenDetails 
          inventoryNumber={specimen.inventoryNumber}
          latinName={specimen.latinName}
          familyName={specimen.familyName}
          regionName={specimen.regionName || undefined}
          expositionName={specimen.expositionName}
        />
      </Card>
      
      {/* Модальное окно с детальной информацией */}
      <SpecimenModal
        specimen={specimen}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        getSectorTypeName={getSectorTypeName}
        onDelete={onDelete}
        size="large"
      />
    </>
  );
};

export default SpecimenCard; 