import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../../ui/components/Card';
import Modal from '../../../ui/components/Modal';
import Button from '../../../ui/components/Button';
import { Specimen, SectorType } from '../../types';
import { animationClasses } from '../../../../styles/global-styles';
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
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const navigate = useNavigate();
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
      navigate(`/specimens/${specimen.id}`);
    }
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleOpenImageModal = (e: React.MouseEvent) => {
    e.stopPropagation(); // Предотвращаем срабатывание onClick всей карточки
    setIsImageModalOpen(true);
  };

  const handleCloseImageModal = () => {
    setIsImageModalOpen(false);
  };
  
  // Временное изображение-заполнитель
  const placeholderImage = '/images/specimens/placeholder.jpg';
  const imageSrc = specimen.imageUrl || placeholderImage;
  
  return (
    <>
      <Card
        className={`${animationClasses.transition} group overflow-hidden 
          hover:shadow-lg hover:border-[#0A84FF]/20 ${isClickable ? 'cursor-pointer' : ''}`}
        headerClassName={headerProps.headerClassName}
        title={headerProps.title}
        subtitle={headerProps.subtitle}
        headerAction={headerProps.headerAction}
        footer={
          <div className="flex justify-between items-center w-full">
            <Button
              variant="secondary"
              size="small"
              onClick={handleOpenImageModal}
              className="text-xs flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Изображение
            </Button>
            <SpecimenCardFooter 
              specimenId={specimen.id} 
              onDelete={onDelete} 
            />
          </div>
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

      {/* Модальное окно с изображением */}
      <Modal
        isOpen={isImageModalOpen}
        onClose={handleCloseImageModal}
        title={`Изображение: ${specimen.russianName}`}
        size="medium"
        variant="elevated"
        animation="fade"
        blockScroll={true}
      >
        <div className="flex flex-col items-center p-2">
          <div className="w-full max-h-[70vh] overflow-hidden rounded-lg">
            <img 
              src={imageSrc} 
              alt={`${specimen.russianName} (${specimen.latinName})`}
              className="w-full h-full object-contain"
              onError={(e) => {
                // Если изображение не загрузилось, используем заполнитель
                const target = e.target as HTMLImageElement;
                target.src = placeholderImage;
              }}
            />
          </div>
          <div className="text-center mt-4 w-full">
            <p className="text-sm text-gray-700 italic">{specimen.latinName}</p>
            {specimen.expositionName && (
              <p className="text-xs text-gray-500 mt-1">Экспозиция: {specimen.expositionName}</p>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default SpecimenCard; 