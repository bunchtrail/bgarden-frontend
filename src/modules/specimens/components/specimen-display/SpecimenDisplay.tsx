import React from 'react';
import { Specimen } from '../../types';
import BasicInfoCard from './BasicInfoCard';
import GeographicInfoCard from './GeographicInfoCard';
import TimelineInfoCard from './TimelineInfoCard';
import AdditionalInfoCard from './AdditionalInfoCard';
import SpecimenGallery from '../specimen-gallery/SpecimenGallery';
import { specimenDisplayStyles } from '../../styles';
import { useAuth } from '../../../auth/hooks';

interface SpecimenDisplayProps {
  specimen: Specimen | null;
}

/**
 * Компонент для отображения всех данных образца 
 * в виде набора карточек с информацией
 */
const SpecimenDisplay: React.FC<SpecimenDisplayProps> = ({ specimen }) => {
  const { isAuthenticated } = useAuth();

  if (!specimen) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4 max-w-7xl mx-auto">
      {/* Левая колонка */}
      <div className="space-y-6">
        <BasicInfoCard specimen={specimen} />
        {isAuthenticated && <GeographicInfoCard specimen={specimen} />}
      </div>
      
      {/* Правая колонка */}
      <div className="space-y-6">
        <SpecimenGallery specimen={specimen} />
        {isAuthenticated && (
          <>
            <TimelineInfoCard specimen={specimen} />
            <AdditionalInfoCard specimen={specimen} />
          </>
        )}
      </div>
    </div>
  );
};

export default SpecimenDisplay; 