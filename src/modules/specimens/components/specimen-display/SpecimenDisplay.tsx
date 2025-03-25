import React from 'react';
import { Specimen } from '../../types';
import BasicInfoCard from './BasicInfoCard';
import GeographicInfoCard from './GeographicInfoCard';
import TimelineInfoCard from './TimelineInfoCard';
import AdditionalInfoCard from './AdditionalInfoCard';
import { layoutClasses } from '../../../../styles/global-styles';

interface SpecimenDisplayProps {
  specimen: Specimen | null;
}

/**
 * Компонент для отображения всех данных образца 
 * в виде набора карточек с информацией
 */
const SpecimenDisplay: React.FC<SpecimenDisplayProps> = ({ specimen }) => {
  if (!specimen) {
    return null;
  }

  return (
    <div className={`${layoutClasses.grid2} gap-6`}>
      <BasicInfoCard specimen={specimen} />
      <GeographicInfoCard specimen={specimen} />
      <TimelineInfoCard specimen={specimen} />
      <AdditionalInfoCard specimen={specimen} />
    </div>
  );
};

export default SpecimenDisplay; 