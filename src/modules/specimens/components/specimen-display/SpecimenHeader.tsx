import React from 'react';
import Button from '../../../../modules/ui/components/Button';
import { Specimen, SectorType } from '../../types';
import { textClasses, layoutClasses, chipClasses } from '../../../../styles/global-styles';

interface SpecimenHeaderProps {
  specimen: Specimen | null;
  isNew: boolean;
  isEditing: boolean;
  onEdit: () => void;
  onBack: () => void;
}

/**
 * Компонент заголовка для страницы образца
 */
const SpecimenHeader: React.FC<SpecimenHeaderProps> = ({ 
  specimen, 
  isNew, 
  isEditing, 
  onEdit, 
  onBack 
}) => {
  const getSectorTypeName = (sectorType: SectorType): string => {
    switch (sectorType) {
      case SectorType.Dendrology: return 'Дендрология';
      case SectorType.Flora: return 'Флора';
      case SectorType.Flowering: return 'Цветение';
      default: return 'Неизвестный сектор';
    }
  };

  return (
    <div className={`${layoutClasses.flexBetween} mb-6`}>
      <div>
        <h1 className={`${textClasses.heading} text-2xl sm:text-3xl`}>
          {isNew 
            ? 'Добавление нового образца' 
            : `Образец: ${specimen?.russianName || specimen?.latinName || 'Без названия'}`}
        </h1>
        {specimen && (
          <div className="mt-2 flex flex-wrap gap-2">
            <span className={`${chipClasses.base} ${chipClasses.primary}`}>
              № {specimen.inventoryNumber}
            </span>
            <span className={`${chipClasses.base} ${chipClasses.secondary}`}>
              {getSectorTypeName(specimen.sectorType as SectorType)}
            </span>
            {specimen.hasHerbarium && (
              <span className={`${chipClasses.base} ${chipClasses.warning}`}>
                Имеется гербарий
              </span>
            )}
          </div>
        )}
      </div>
      
      <div className="flex gap-2">
        {!isEditing && !isNew && (
          <Button 
            variant="primary"
            onClick={onEdit}
          >
            Редактировать
          </Button>
        )}
        
        <Button 
          variant="neutral"
          onClick={onBack}
        >
          Назад к списку
        </Button>
      </div>
    </div>
  );
};

export default SpecimenHeader; 