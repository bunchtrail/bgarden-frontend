import React, { useState } from 'react';
import { SectorType } from '../../types';
import { gridContainerClasses, headingClasses } from '../styles';
import { SelectField, TextField } from './FormFields';
import { BasicInfoSectionProps } from './types';
import { InfoIcon } from '../icons';

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
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

  // Определяем радиокнопки для типа сектора
  const sectorTypeOptions = [
    { id: SectorType.Dendrology, name: 'Дендрология' },
    { id: SectorType.Flora, name: 'Флора' },
    { id: SectorType.Flowering, name: 'Цветущие растения' },
  ];

  return (
    <div className='mb-6 bg-gray-50 p-5 rounded-lg border border-gray-200 shadow-sm transition-all duration-300 animate-slideInRight'>
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
            <span>Базовая информация для идентификации образца</span>
          </div>
        </div>

        {/* Обязательные поля */}
        <div className='p-3 bg-white rounded-md border border-gray-200 transition-all duration-200 focus-within:border-blue-200'>
          <h4 className='font-medium text-gray-700 mb-2'>
            Идентификация образца
          </h4>
          <TextField
            label='Инвентарный номер'
            name='inventoryNumber'
            required
            formData={formData}
            errors={errors}
            touchedFields={touchedFields}
            formSubmitted={formSubmitted}
            markFieldAsTouched={markFieldAsTouched}
            handleChange={handleChange}
          />
        </div>

        <div className='p-3 bg-white rounded-md border border-gray-200 transition-all duration-200 focus-within:border-blue-200'>
          <h4 className='font-medium text-gray-700 mb-2'>
            Наименование
          </h4>
          <div className={gridContainerClasses.responsive}>
            <TextField
              label='Русское название'
              name='russianName'
              required
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
              required
              formData={formData}
              errors={errors}
              touchedFields={touchedFields}
              formSubmitted={formSubmitted}
              markFieldAsTouched={markFieldAsTouched}
              handleChange={handleChange}
            />
          </div>
        </div>

        <div className='p-3 bg-white rounded-md border border-gray-200 transition-all duration-200 focus-within:border-blue-200'>
          <h4 className='font-medium text-gray-700 mb-2'>
            Классификация
          </h4>
          <SelectField
            label='Семейство'
            name='familyId'
            required
            options={familyOptions}
            formData={formData}
            errors={errors}
            touchedFields={touchedFields}
            formSubmitted={formSubmitted}
            markFieldAsTouched={markFieldAsTouched}
            handleSelectChange={handleSelectChange}
          />

          <SelectField
            label='Тип сектора'
            name='sectorType'
            options={sectorTypeOptions}
            formData={formData}
            errors={errors}
            touchedFields={touchedFields}
            formSubmitted={formSubmitted}
            markFieldAsTouched={markFieldAsTouched}
            handleSelectChange={handleSelectChange}
          />
        </div>

        {/* Дополнительные поля (скрываемые) */}
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
              <div className='p-3 bg-white rounded-md border border-gray-200 transition-all duration-200 focus-within:border-blue-200'>
                <h4 className='font-medium text-gray-700 mb-2'>
                  Таксономическая информация
                </h4>
                <div className={gridContainerClasses.responsive}>
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

                <div className={gridContainerClasses.responsive}>
                  <TextField
                    label='Культивар'
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
          )}
        </div>
      </div>
    </div>
  );
};
