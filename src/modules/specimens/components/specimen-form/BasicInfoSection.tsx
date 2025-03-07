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
    <div className='bg-white p-6 rounded-lg border border-gray-200 shadow-sm transition-all duration-300 hover:shadow-md animate-fadeIn'>
      <h3
        className={`${headingClasses.heading} flex items-center text-xl mb-6 pb-3 border-b border-gray-200`}
      >
        <span className='w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center mr-3 shadow-sm'>
          <InfoIcon className='w-5 h-5 text-blue-600' />
        </span>
        <span className='bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent font-semibold'>
          Основная информация
        </span>
      </h3>

      <div className='space-y-6'>
        <div className='bg-blue-50 p-4 rounded-lg border border-blue-100 mb-6 shadow-sm'>
          <div className='flex items-start'>
            <svg
              className='w-5 h-5 mr-3 text-blue-600 mt-0.5 flex-shrink-0'
              fill='currentColor'
              viewBox='0 0 20 20'
            >
              <path
                fillRule='evenodd'
                d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2h2a1 1 0 100-2H9z'
                clipRule='evenodd'
              />
            </svg>
            <div>
              <p className='text-blue-800 font-medium mb-1'>
                Обязательные поля
              </p>
              <p className='text-blue-700 text-sm'>
                Поля, отмеченные{' '}
                <span className='text-red-500 font-bold'>*</span>, необходимо
                заполнить для сохранения образца
              </p>
            </div>
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='md:col-span-2 bg-gray-50 p-3 rounded-lg shadow-inner border border-gray-200'>
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
          </div>

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

          <div className='md:col-span-2'>
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
          </div>
        </div>

        <div className='p-5 bg-gray-50 rounded-lg border border-gray-200 transition-all duration-200 hover:border-blue-300 shadow-sm mt-6'>
          <h4 className='font-medium text-gray-700 mb-4 flex items-center'>
            <svg
              className='w-5 h-5 mr-2 text-blue-600'
              fill='currentColor'
              viewBox='0 0 20 20'
            >
              <path d='M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z' />
            </svg>
            <span className='bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent'>
              Таксономическая классификация
            </span>
          </h4>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-5 mt-3'>
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

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-5 mt-4'>
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
