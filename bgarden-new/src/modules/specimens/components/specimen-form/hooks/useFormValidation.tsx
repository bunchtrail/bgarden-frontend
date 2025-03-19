import { useState } from 'react';
import { SpecimenFormData } from '../../../types';

/**
 * Хук для валидации полей формы образца
 * Проверяет обязательные поля и управляет статусом ошибок
 */
export const useFormValidation = (formData: SpecimenFormData) => {
  // Для валидации формы
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});

  // Валидация отдельного поля
  const validateField = (name: string, value: any) => {
    let error = '';
    
    // Проверяем обязательные поля
    const requiredFields = ['inventoryNumber', 'russianName', 'latinName', 'genus', 'species'];
    
    if (requiredFields.includes(name) && (!value || value === '')) {
      error = 'Это поле обязательно для заполнения';
    }
    
    // Устанавливаем или удаляем ошибку
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
    
    return !error;
  };
  
  // Валидация текущего шага формы
  const validateCurrentStep = (activeStep: number) => {
    const fieldsToValidate: Record<number, string[]> = {
      1: ['inventoryNumber', 'russianName', 'latinName', 'genus', 'species'],
      2: ['familyId', 'familyName'],
      3: ['latitude', 'longitude', 'regionId'],
      4: []
    };
    
    const currentFields = fieldsToValidate[activeStep] || [];
    let isValid = true;
    
    // Помечаем все поля текущего шага как затронутые
    const newTouchedFields = { ...touchedFields };
    currentFields.forEach(field => {
      newTouchedFields[field] = true;
    });
    setTouchedFields(newTouchedFields);
    
    // Валидируем каждое поле
    currentFields.forEach(field => {
      const fieldIsValid = validateField(field, formData[field as keyof SpecimenFormData]);
      if (!fieldIsValid) isValid = false;
    });
    
    return isValid;
  };
  
  return {
    errors,
    touchedFields,
    validateField,
    validateCurrentStep,
    setTouchedFields,
    setErrors
  };
}; 