import React, { useState } from 'react';
import { gridContainerClasses } from '../styles';
import { NumberField, SelectField, TextField } from './FormFields';
import { GeographicInfoSectionProps } from './types';

export const GeographicInfoSection: React.FC<GeographicInfoSectionProps> = ({
  formData,
  errors,
  touchedFields,
  formSubmitted,
  markFieldAsTouched,
  validateField,
  regionOptions,
  handleChange,
  handleSelectChange,
  handleNumberChange,
}) => {
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

  return (
    <div className='space-y-6'>
      {/* Основные поля */}
      <div className='space-y-4'>
        <SelectField
          label='Регион происхождения'
          name='regionId'
          options={regionOptions}
          formData={formData}
          errors={errors}
          touchedFields={touchedFields}
          formSubmitted={formSubmitted}
          markFieldAsTouched={markFieldAsTouched}
          handleSelectChange={handleSelectChange}
        />

        <TextField
          label='Страна происхождения'
          name='country'
          formData={formData}
          errors={errors}
          touchedFields={touchedFields}
          formSubmitted={formSubmitted}
          markFieldAsTouched={markFieldAsTouched}
          handleChange={handleChange}
        />
      </div>

      {/* Дополнительные поля */}
      <div className='mt-4 border-t border-gray-200 pt-4'>
        <button
          type='button'
          onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
          className='flex items-center text-blue-600 hover:text-blue-800 mb-4'
        >
          <svg
            className={`w-5 h-5 mr-1 transition-transform ${
              showAdvancedOptions ? 'rotate-90' : ''
            }`}
            fill='currentColor'
            viewBox='0 0 20 20'
          >
            <path
              fillRule='evenodd'
              d='M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z'
              clipRule='evenodd'
            />
          </svg>
          {showAdvancedOptions
            ? 'Скрыть дополнительные поля'
            : 'Показать дополнительные поля'}
        </button>

        {showAdvancedOptions && (
          <div className='space-y-4 animate-fadeIn'>
            <div className={gridContainerClasses.responsive}>
              <NumberField
                label='Широта'
                name='latitude'
                formData={formData}
                errors={errors}
                touchedFields={touchedFields}
                formSubmitted={formSubmitted}
                markFieldAsTouched={markFieldAsTouched}
                handleNumberChange={handleNumberChange}
                min={-90}
                max={90}
              />
              <NumberField
                label='Долгота'
                name='longitude'
                formData={formData}
                errors={errors}
                touchedFields={touchedFields}
                formSubmitted={formSubmitted}
                markFieldAsTouched={markFieldAsTouched}
                handleNumberChange={handleNumberChange}
                min={-180}
                max={180}
              />
            </div>

            <TextField
              label='Естественный ареал'
              name='naturalRange'
              multiline
              rows={3}
              formData={formData}
              errors={errors}
              touchedFields={touchedFields}
              formSubmitted={formSubmitted}
              markFieldAsTouched={markFieldAsTouched}
              handleChange={handleChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};
