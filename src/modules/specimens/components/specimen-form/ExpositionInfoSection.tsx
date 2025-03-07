import React from 'react';
import { ExpositionInfoSectionProps } from './types';
import { TextField, SelectField, NumberField, CheckboxField } from './FormFields';
import { LeafIcon } from '../icons';
import { headingClasses } from '../styles';

export const ExpositionInfoSection: React.FC<ExpositionInfoSectionProps> = ({
  formData,
  errors,
  touchedFields,
  formSubmitted,
  markFieldAsTouched,
  validateField,
  expositionOptions,
  handleChange,
  handleSelectChange,
  handleNumberChange,
  handleCheckboxChange,
}) => {
  const currentYear = new Date().getFullYear();

  return (
    <div className='mb-6 bg-gray-50 p-5 rounded-lg border border-gray-200 shadow-sm transition-all duration-300 hover:shadow-md animate-slideInRight'>
      <h3
        className={`${headingClasses.heading} flex items-center text-xl mb-4 pb-2 border-b border-gray-300`}
      >
        <LeafIcon className='w-5 h-5 mr-2 text-amber-600' />
        Экспозиционная информация
      </h3>

      <div className='space-y-4'>
        <div className='bg-amber-50 p-3 rounded-md border border-amber-100 mb-4'>
          <div className='flex items-center text-amber-800 text-sm mb-2'>
            <span className='mr-2'>ⓘ</span>
            <span>Информация о размещении образца на территории сада</span>
          </div>
        </div>

        <SelectField
          label="Экспозиция"
          name="expositionId"
          options={expositionOptions}
          required={true}
          formData={formData}
          errors={errors}
          touchedFields={touchedFields}
          formSubmitted={formSubmitted}
          markFieldAsTouched={markFieldAsTouched}
          handleSelectChange={handleSelectChange}
        />

        <div className='p-3 bg-white rounded-md border border-gray-200 transition-all duration-200 hover:border-amber-300'>
          <h4 className='font-medium text-gray-700 mb-2'>
            Информация о посадке
          </h4>
          <NumberField
            label="Год посадки"
            name="plantingYear"
            min={1700}
            max={currentYear}
            formData={formData}
            errors={errors}
            touchedFields={touchedFields}
            formSubmitted={formSubmitted}
            markFieldAsTouched={markFieldAsTouched}
            handleNumberChange={handleNumberChange}
          />
        </div>

        <div className='p-3 bg-white rounded-md border border-gray-200 transition-all duration-200 hover:border-amber-300'>
          <h4 className='font-medium text-gray-700 mb-2'>
            Гербарные материалы
          </h4>
          <CheckboxField
            label="Наличие гербария"
            name="hasHerbarium"
            hint="Отметьте, если для данного образца имеется гербарный материал"
            formData={formData}
            errors={errors}
            touchedFields={touchedFields}
            formSubmitted={formSubmitted}
            markFieldAsTouched={markFieldAsTouched}
            handleCheckboxChange={handleCheckboxChange}
          />
          
          <TextField
            label="Информация о дубликатах"
            name="duplicatesInfo"
            formData={formData}
            errors={errors}
            touchedFields={touchedFields}
            formSubmitted={formSubmitted}
            markFieldAsTouched={markFieldAsTouched}
            handleChange={handleChange}
          />
        </div>
      </div>
    </div>
  );
}; 