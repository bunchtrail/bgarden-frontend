import React from 'react';
import { MapIcon } from '../icons';
import { headingClasses } from '../styles';
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
  return (
    <div className='mb-6 bg-gray-50 p-5 rounded-lg border border-gray-200 shadow-sm transition-all duration-300 hover:shadow-md animate-slideInRight'>
      <h3
        className={`${headingClasses.heading} flex items-center text-xl mb-4 pb-2 border-b border-gray-300`}
      >
        <MapIcon className='w-5 h-5 mr-2 text-green-600' />
        Географическая информация
      </h3>

      <div className='space-y-4'>
        <div className='bg-green-50 p-3 rounded-md border border-green-100 mb-4'>
          <div className='flex items-center text-green-800 text-sm mb-2'>
            <span className='mr-2'>ⓘ</span>
            <span>
              Укажите информацию о происхождении и расположении образца
            </span>
          </div>
        </div>

        <SelectField
          label='Регион'
          name='regionId'
          options={regionOptions}
          required={true}
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

        <div className='p-3 bg-white rounded-md border border-gray-200 transition-all duration-200 hover:border-green-300'>
          <h4 className='font-medium text-gray-700 mb-2'>Естественный ареал</h4>
          <TextField
            label='Естественный ареал'
            name='naturalRange'
            multiline={true}
            rows={2}
            formData={formData}
            errors={errors}
            touchedFields={touchedFields}
            formSubmitted={formSubmitted}
            markFieldAsTouched={markFieldAsTouched}
            handleChange={handleChange}
          />
        </div>

        <div className='p-3 bg-white rounded-md border border-gray-200 transition-all duration-200 hover:border-green-300'>
          <h4 className='font-medium text-gray-700 mb-2'>Координаты образца</h4>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <NumberField
              label='Широта'
              name='latitude'
              min={-90}
              max={90}
              formData={formData}
              errors={errors}
              touchedFields={touchedFields}
              formSubmitted={formSubmitted}
              markFieldAsTouched={markFieldAsTouched}
              handleNumberChange={handleNumberChange}
            />

            <NumberField
              label='Долгота'
              name='longitude'
              min={-180}
              max={180}
              formData={formData}
              errors={errors}
              touchedFields={touchedFields}
              formSubmitted={formSubmitted}
              markFieldAsTouched={markFieldAsTouched}
              handleNumberChange={handleNumberChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
