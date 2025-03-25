import React from 'react';
import { SpecimenFormData } from '../../types';
import { BasicInfoSection } from './sections/basic-info';
import { TaxonomySection } from './sections/taxonomy';
import { GeographySection } from './sections/geography';
import { AdditionalInfoSection } from './sections/additional-info';
import { FamilyDto } from '../../services/familyService';
import { ExpositionDto } from '../../services/expositionService';
import { RegionData } from '@/modules/map/types/mapTypes';

export interface StepRendererProps {
  activeStep: number;
  formData: SpecimenFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  errors?: Record<string, string>;
  touchedFields?: Record<string, boolean>;
  families: FamilyDto[];
  regions: RegionData[];
  expositions: ExpositionDto[];
  slideDirection?: 'left' | 'right';
  // Шаг с загрузкой изображений
  imagesStep?: React.ReactNode;
}

/**
 * Компонент для рендеринга активного шага формы
 */
const StepRenderer: React.FC<StepRendererProps> = ({
  activeStep,
  formData,
  onChange,
  errors = {},
  touchedFields = {},
  families,
  regions,
  expositions,
  imagesStep
}) => {
  switch (activeStep) {
    case 1:
      return (
        <BasicInfoSection 
          formData={formData} 
          onChange={onChange}
          errors={errors}
          touchedFields={touchedFields}
        />
      );
    case 2:
      return (
        <TaxonomySection 
          formData={formData} 
          onChange={onChange}
          families={families}
        />
      );
    case 3:
      return (
        <GeographySection 
          formData={formData} 
          onChange={onChange}
          regions={regions}
          expositions={expositions}
        />
      );
    case 4:
      return (
        <AdditionalInfoSection 
          formData={formData} 
          onChange={onChange}
        />
      );
    case 5:
      // Шаг с загрузкой изображений
      return <>{imagesStep}</> || null;
    default:
      return null;
  }
};

export default StepRenderer; 