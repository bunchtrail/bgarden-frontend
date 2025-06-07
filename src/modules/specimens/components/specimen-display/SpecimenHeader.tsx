import React from 'react';
import Button from '../../../../modules/ui/components/Button';
import { Specimen, SectorType } from '../../types';
import { textClasses, layoutClasses, chipClasses, animationClasses } from '../../../../styles/global-styles';

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

  // Базовые классы для кнопок
  const baseButtonClasses = `flex items-center py-1.5 ${animationClasses.transition}`;

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
            className={baseButtonClasses}
            leftIcon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            }
          >
            Редактировать
          </Button>
        )}
        
        <Button 
          variant="neutral"
          onClick={onBack}
          className={baseButtonClasses}
          leftIcon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          }
        >
          Назад к списку
        </Button>
      </div>
    </div>
  );
};

export default SpecimenHeader; 