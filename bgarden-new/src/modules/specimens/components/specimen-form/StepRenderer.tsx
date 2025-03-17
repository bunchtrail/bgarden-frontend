import React from 'react';
import { SpecimenFormData } from '../../types';
import { BasicInfoSection } from './sections/basic-info';
import { TaxonomySection } from './sections/taxonomy';
import { GeographySection } from './sections/geography';
import { AdditionalInfoSection } from './sections/additional-info';

interface StepRendererProps {
  activeStep: number;
  formData: SpecimenFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  errors?: Record<string, string>;
  touchedFields?: Record<string, boolean>;
}

/**
 * Компонент для рендеринга активного шага формы
 */
const StepRenderer: React.FC<StepRendererProps> = ({
  activeStep,
  formData,
  onChange,
  errors = {},
  touchedFields = {}
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
        />
      );
    case 3:
      return (
        <GeographySection 
          formData={formData} 
          onChange={onChange}
        />
      );
    case 4:
      return (
        <AdditionalInfoSection 
          formData={formData} 
          onChange={onChange}
        />
      );
    default:
      return null;
  }
};

export default StepRenderer; 