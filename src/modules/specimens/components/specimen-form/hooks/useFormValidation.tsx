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
    
    // Проверяем обязательные поля по шагам
    const requiredFieldsByStep = {
      1: ['inventoryNumber', 'russianName', 'latinName'],
      2: ['familyId'],
      3: ['regionId'],
      4: [],
      5: []
    };
    
    // Получаем все обязательные поля
    const allRequiredFields = Object.values(requiredFieldsByStep).flat();
    
    if (allRequiredFields.includes(name)) {
      if (name === 'familyId' || name === 'regionId') {
        // Для ID полей проверяем, что значение больше 0
        if (!value || value === 0 || value === '0') {
          error = 'Это поле обязательно для заполнения';
        }
      } else {
        // Для текстовых полей проверяем, что значение не пустое
        if (!value || value === '') {
          error = 'Это поле обязательно для заполнения';
        }
      }
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
      1: ['inventoryNumber', 'russianName', 'latinName'],
      2: ['familyId'],
      3: ['regionId'],
      4: [],
      5: []
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