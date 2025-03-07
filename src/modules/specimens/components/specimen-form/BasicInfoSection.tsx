import React from 'react';
import { InfoIcon } from '../icons';
import { headingClasses } from '../styles';
import { SelectField, TextField } from './FormFields';
import { BasicInfoSectionProps } from './types';

export const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
  formData,
  errors,
  touchedFields,
  formSubmitted,
  markFieldAsTouched,
  validateField,
  familyOptions,
  handleChange,
  handleSelectChange,
}) => {
  return (
    <div className='mb-6 bg-gray-50 p-5 rounded-lg border border-gray-200 shadow-sm transition-all duration-300 hover:shadow-md animate-fadeIn'>
      <h3
        className={`${headingClasses.heading} flex items-center text-xl mb-4 pb-2 border-b border-gray-300`}
      >
        <InfoIcon className='w-5 h-5 mr-2 text-blue-600' />
        Основная информация
      </h3>

      <div className='space-y-4'>
        <div className='bg-blue-50 p-3 rounded-md border border-blue-100 mb-4'>
          <div className='flex items-center text-blue-800 text-sm mb-2'>
            <span className='mr-2'>ⓘ</span>
            <span>
              Поля, отмеченные <span className='text-red-500'>*</span>,
              обязательны для заполнения
            </span>
          </div>
        </div>

        <TextField
          label='Инвентарный номер'
          name='inventoryNumber'
          required={true}
          formData={formData}
          errors={errors}
          touchedFields={touchedFields}
          formSubmitted={formSubmitted}
          markFieldAsTouched={markFieldAsTouched}
          handleChange={handleChange}
        />

        <TextField
          label='Русское название'
          name='russianName'
          required={true}
          formData={formData}
          errors={errors}
          touchedFields={touchedFields}
          formSubmitted={formSubmitted}
          markFieldAsTouched={markFieldAsTouched}
          handleChange={handleChange}
        />

        <TextField
          label='Латинское название'
          name='latinName'
          required={true}
          formData={formData}
          errors={errors}
          touchedFields={touchedFields}
          formSubmitted={formSubmitted}
          markFieldAsTouched={markFieldAsTouched}
          handleChange={handleChange}
        />

        <SelectField
          label='Семейство'
          name='familyId'
          options={familyOptions}
          required={true}
          formData={formData}
          errors={errors}
          touchedFields={touchedFields}
          formSubmitted={formSubmitted}
          markFieldAsTouched={markFieldAsTouched}
          handleSelectChange={handleSelectChange}
        />

        <div className='p-3 bg-white rounded-md border border-gray-200 transition-all duration-200 hover:border-blue-300'>
          <h4 className='font-medium text-gray-700 mb-2'>
            Таксономическая классификация
          </h4>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <TextField
              label='Род'
              name='genus'
              formData={formData}
              errors={errors}
              touchedFields={touchedFields}
              formSubmitted={formSubmitted}
              markFieldAsTouched={markFieldAsTouched}
              handleChange={handleChange}
            />

            <TextField
              label='Вид'
              name='species'
              formData={formData}
              errors={errors}
              touchedFields={touchedFields}
              formSubmitted={formSubmitted}
              markFieldAsTouched={markFieldAsTouched}
              handleChange={handleChange}
            />
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3'>
            <TextField
              label='Сорт'
              name='cultivar'
              formData={formData}
              errors={errors}
              touchedFields={touchedFields}
              formSubmitted={formSubmitted}
              markFieldAsTouched={markFieldAsTouched}
              handleChange={handleChange}
            />

            <TextField
              label='Форма'
              name='form'
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
    </div>
  );
};
