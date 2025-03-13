import React from 'react';
import { NumberField } from '../FormFields';
import { gridContainerClasses } from '../../styles';

interface CoordinatesSectionProps {
  formData: any;
  errors: any;
  touchedFields: any;
  formSubmitted: boolean;
  markFieldAsTouched: (fieldName: string) => void;
  handleNumberChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CoordinatesSection: React.FC<CoordinatesSectionProps> = ({
  formData,
  errors,
  touchedFields,
  formSubmitted,
  markFieldAsTouched,
  handleNumberChange
}) => {
  const handleFieldTouch = (fieldName: string) => {
    markFieldAsTouched(fieldName);
  };

  return (
    <div className='p-4 bg-white rounded-xl border border-gray-200 transition-all duration-300 hover:border-green-200'>
      <h4 className='font-medium text-gray-700 mb-3 flex items-center'>
        <span className="mr-2">📊</span>
        Координаты
      </h4>
      <div className={`${gridContainerClasses.responsive} gap-6`}>
        <NumberField
          label='Широта'
          name='latitude'
          formData={formData}
          errors={errors}
          touchedFields={touchedFields}
          formSubmitted={formSubmitted}
          markFieldAsTouched={handleFieldTouch}
          handleNumberChange={handleNumberChange}
        />
        <NumberField
          label='Долгота'
          name='longitude'
          formData={formData}
          errors={errors}
          touchedFields={touchedFields}
          formSubmitted={formSubmitted}
          markFieldAsTouched={handleFieldTouch}
          handleNumberChange={handleNumberChange}
        />
      </div>
    </div>
  );
};

export default CoordinatesSection; 