import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Specimen, SectorType } from '../../types';
import { Modal } from '../../../ui';
import Button from '../../../ui/components/Button';
import { 
  getSpecimenCardHeader, 
  SpecimenBadges, 
  SpecimenDetails,
  SpecimenCardFooter 
} from './card-parts';
import { buttonClasses } from '../../../../styles/global-styles';

interface SpecimenModalProps {
  specimen: Specimen | null;
  isOpen: boolean;
  onClose: () => void;
  getSectorTypeName: (sectorType: SectorType) => string;
  onDelete: (id: number) => void;
  size?: 'small' | 'medium' | 'large' | 'fullscreen';
}

/**
 * Модальное окно для отображения детальной информации об образце растения.
 * Использует те же компоненты, что и карточка образца для единообразного отображения.
 */
const SpecimenModal: React.FC<SpecimenModalProps> = ({ 
  specimen, 
  isOpen, 
  onClose, 
  getSectorTypeName,
  onDelete,
  size = 'medium'
}) => {
  const navigate = useNavigate();
  
  if (!specimen) return null;
  
  const sectorType = specimen.sectorType as SectorType;
  
  // Получаем пропсы для заголовка
  const headerProps = getSpecimenCardHeader({
    id: specimen.id,
    russianName: specimen.russianName,
    latinName: specimen.latinName,
    sectorType
  });
  
  const handleViewFullPage = () => {
    navigate(`/specimens/${specimen.id}`);
    onClose();
  };
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={headerProps.title}
      headerAction={headerProps.headerAction}
      size={size}
      variant="elevated"
      animation="fade"
      blockScroll={true}
      footer={
        <div className="flex justify-between items-center w-full">
          <Button 
            variant="primary"
            onClick={handleViewFullPage}
            className="flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Полная информация
          </Button>
          
          <SpecimenCardFooter 
            specimenId={specimen.id} 
            onDelete={onDelete} 
          />
        </div>
      }
    >
      <div className="p-2">
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
        
        {/* Дополнительная информация, которую можно показать в модальном окне */}
        {specimen.plantingYear && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h3 className="text-md font-medium mb-2">Дополнительная информация</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-500">Год посадки:</span>
                <p className="text-sm">{specimen.plantingYear}</p>
              </div>
              
              {specimen.conservationStatus && (
                <div>
                  <span className="text-sm text-gray-500">Статус сохранения:</span>
                  <p className="text-sm">{specimen.conservationStatus}</p>
                </div>
              )}
              
              {specimen.naturalRange && (
                <div>
                  <span className="text-sm text-gray-500">Естественный ареал:</span>
                  <p className="text-sm">{specimen.naturalRange}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default SpecimenModal; 