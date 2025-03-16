import React, { useState, useEffect } from 'react';
import { Specimen, SpecimenFormData } from '../../types';
import { Button } from '@/modules/ui';
import { BasicInfoSection } from './sections/basic-info';
import { TaxonomySection } from './sections/taxonomy';
import { GeographySection } from './sections/geography';
import { AdditionalInfoSection } from './sections/additional-info';

import { useFormNavigation } from './hooks/useFormNavigation';
import { useFormValidation } from './hooks/useFormValidation';
import { cardClasses, buttonClasses } from '@/styles/global-styles';

// Импортируем недостающие компоненты и функции
import FormStepper from './form-stepper/FormStepper';
import FormProgress from './form-progress/FormProgress';
import { calculateFormProgress } from './utils/calculateFormProgress';

interface SpecimenFormProps {
  specimen?: Specimen;
  onSubmit: (data: SpecimenFormData) => void;
  onCancel: () => void;
}

/**
 * Форма для добавления/редактирования образца растения
 * Современная многошаговая форма с визуальным прогресс-индикатором
 * 
 * @param specimen - Существующий образец для редактирования (опционально)
 * @param onSubmit - Функция для отправки формы
 * @param onCancel - Функция отмены
 */
const SpecimenForm: React.FC<SpecimenFormProps> = ({ specimen, onSubmit, onCancel }) => {
  // Инициализация формы значениями по умолчанию или данными образца
  const [formData, setFormData] = useState<SpecimenFormData>({
    inventoryNumber: '',
    sectorType: 0,
    latitude: 0,
    longitude: 0,
    regionId: 0,
    regionName: '',
    familyId: 0,
    familyName: '',
    russianName: '',
    latinName: '',
    genus: '',
    species: '',
    cultivar: '',
    form: '',
    synonyms: '',
    determinedBy: '',
    plantingYear: new Date().getFullYear(),
    sampleOrigin: '',
    naturalRange: '',
    ecologyAndBiology: '',
    economicUse: '',
    conservationStatus: '',
    expositionId: 0,
    expositionName: '',
    hasHerbarium: false,
    duplicatesInfo: '',
    originalBreeder: '',
    originalYear: 0,
    country: '',
    illustration: '',
    notes: '',
    filledBy: ''
  });
  
  // Подключаем custom hooks для управления формой
  const { 
    activeStep, 
    slideDirection, 
    goToNextStep: goToNextStepNav, 
    goToPreviousStep, 
    goToStep 
  } = useFormNavigation();
  
  const {
    errors,
    touchedFields,
    validateField,
    validateCurrentStep,
    setTouchedFields,
    setErrors
  } = useFormValidation(formData);

  // Обновление формы при получении данных образца
  useEffect(() => {
    if (specimen) {
      setFormData(specimen);
    }
  }, [specimen]);

  // Обработчик изменения полей формы
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Помечаем поле как затронутое для валидации
    setTouchedFields(prev => ({
      ...prev,
      [name]: true
    }));
    
    // Для чекбоксов обрабатываем отдельно
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setFormData(prev => ({
        ...prev,
        [name]: checkbox.checked
      }));
      return;
    }
    
    // Для числовых полей преобразуем значение
    if (type === 'number') {
      setFormData(prev => ({
        ...prev,
        [name]: value === '' ? 0 : Number(value)
      }));
      return;
    }
    
    // Для остальных полей просто устанавливаем значение
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Валидируем поле после изменения
    validateField(name, type === 'number' ? (value === '' ? 0 : Number(value)) : value);
  };

  // Переход к следующему шагу с валидацией
  const goToNextStep = () => {
    if (validateCurrentStep(activeStep)) {
      goToNextStepNav();
    }
  };

  // Отправка формы
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Проверяем все поля перед отправкой
    const allFields = [
      'inventoryNumber', 'russianName', 'latinName', 'genus', 'species',
      'familyId', 'familyName', 'latitude', 'longitude', 'regionId'
    ];
    
    // Помечаем все обязательные поля как затронутые
    const newTouchedFields = { ...touchedFields };
    allFields.forEach(field => {
      newTouchedFields[field] = true;
    });
    setTouchedFields(newTouchedFields);
    
    // Валидируем все поля
    let isValid = true;
    allFields.forEach(field => {
      const fieldIsValid = validateField(field, formData[field as keyof SpecimenFormData]);
      if (!fieldIsValid) isValid = false;
    });
    
    if (isValid) {
      onSubmit(formData);
    } else {
      // Переходим к первому шагу с ошибкой
      const fieldsToValidate: Record<number, string[]> = {
        1: ['inventoryNumber', 'russianName', 'latinName', 'genus', 'species'],
        2: ['familyId', 'familyName'],
        3: ['latitude', 'longitude', 'regionId'],
        4: []
      };
      
      const stepsWithErrors = [1, 2, 3, 4].filter(step => {
        const stepFields = (fieldsToValidate[step] || []);
        return stepFields.some(field => !!errors[field]);
      });
      
      if (stepsWithErrors.length > 0) {
        goToStep(stepsWithErrors[0]);
      }
    }
  };

  // Рендер активного шага формы
  const renderActiveStep = () => {
    switch (activeStep) {
      case 1:
        return (
          <BasicInfoSection 
            formData={formData} 
            onChange={handleChange}
            errors={errors}
            touchedFields={touchedFields}
          />
        );
      case 2:
        return (
          <TaxonomySection 
            formData={formData} 
            onChange={handleChange}
          />
        );
      case 3:
        return (
          <GeographySection 
            formData={formData} 
            onChange={handleChange}
          />
        );
      case 4:
        return (
          <AdditionalInfoSection 
            formData={formData} 
            onChange={handleChange}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div>
      {/* Прогресс-индикатор */}
      <FormStepper 
        activeStep={activeStep} 
        goToStep={goToStep} 
      />
      
      <form onSubmit={handleSubmit} className={`${cardClasses.outlined} ${cardClasses.content} rounded-xl`}>
        {/* Анимированный контейнер шагов */}
        <div className="overflow-hidden min-h-[500px]">
          <div 
            className={`transition-transform duration-300 transform ${
              slideDirection === 'right' 
                ? 'translate-x-full' 
                : '-translate-x-full'
            }`}
            style={{ 
              transform: 'translateX(0)' 
            }}
          >
            {/* Содержимое активного шага */}
            {renderActiveStep()}
          </div>
        </div>
        
        {/* Индикатор заполненности формы */}
        <FormProgress 
          progress={calculateFormProgress(formData)} 
        />
        
        {/* Навигационные кнопки */}
        <div className="flex justify-between pt-6 mt-4 border-t border-gray-200">
          <div>
            {activeStep > 1 ? (
              <Button 
                variant="neutral"
                onClick={goToPreviousStep}
                className="flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Назад
              </Button>
            ) : (
              <Button 
                variant="neutral"
                onClick={onCancel}
              >
                Отмена
              </Button>
            )}
          </div>
          
          <div>
            {activeStep < 4 ? (
              <Button 
                variant="primary"
                onClick={goToNextStep}
                className="flex items-center"
              >
                Далее
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Button>
            ) : (
              <Button 
                variant="success" 
                type="submit"
                className="flex items-center"
              >
                Сохранить
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default SpecimenForm; 