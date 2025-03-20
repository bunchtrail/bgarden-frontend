import React from 'react';
import { Specimen, SectorType } from '../../types';
import { Modal } from '../../../ui';
import { 
  getSpecimenCardHeader, 
  SpecimenBadges, 
  SpecimenDetails,
  SpecimenCardFooter 
} from './card-parts';

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
  if (!specimen) return null;
  
  const sectorType = specimen.sectorType as SectorType;
  
  // Получаем пропсы для заголовка
  const headerProps = getSpecimenCardHeader({
    id: specimen.id,
    russianName: specimen.russianName,
    latinName: specimen.latinName,
    sectorType
  });
  
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
        <SpecimenCardFooter 
          specimenId={specimen.id} 
          onDelete={onDelete} 
        />
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