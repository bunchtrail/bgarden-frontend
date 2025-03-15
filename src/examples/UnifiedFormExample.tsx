import React, { useState } from 'react';
import {
  ExtendedForm,
  ValidatedTextField,
  ValidatedNumberField,
  ValidatedSelectField,
  ValidatedCheckboxField
} from '../components/ui/FormExtended';
import { buttonClasses } from '../styles/global-styles';

interface FormData {
  name: string;
  description: string;
  category: string;
  quantity: number | '';
  isActive: boolean;
}

const UnifiedFormExample: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    category: '',
    quantity: '',
    isActive: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
  const [formSubmitted, setFormSubmitted] = useState(false);

  const categoryOptions = [
    { value: 'category1', label: 'Категория 1' },
    { value: 'category2', label: 'Категория 2' },
    { value: 'category3', label: 'Категория 3' }
  ];

  const validateField = (name: string, value: any): boolean => {
    let isValid = true;
    const newErrors = { ...errors };

    switch (name) {
      case 'name':
        if (!value) {
          newErrors[name] = 'Название обязательно';
          isValid = false;
        } else if (value.length < 3) {
          newErrors[name] = 'Название должно содержать минимум 3 символа';
          isValid = false;
        } else {
          delete newErrors[name];
        }
        break;
      case 'description':
        if (value && value.length > 200) {
          newErrors[name] = 'Описание не должно превышать 200 символов';
          isValid = false;
        } else {
          delete newErrors[name];
        }
        break;
      case 'category':
        if (!value) {
          newErrors[name] = 'Категория обязательна';
          isValid = false;
        } else {
          delete newErrors[name];
        }
        break;
      case 'quantity':
        if (value === '' || value === null) {
          newErrors[name] = 'Количество обязательно';
          isValid = false;
        } else if (Number(value) < 0) {
          newErrors[name] = 'Количество не может быть отрицательным';
          isValid = false;
        } else {
          delete newErrors[name];
        }
        break;
      default:
        break;
    }

    setErrors(newErrors);
    return isValid;
  };

  const markFieldAsTouched = (name: string) => {
    setTouchedFields(prev => ({ ...prev, [name]: true }));
    validateField(name, formData[name as keyof FormData]);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (touchedFields[name]) {
      validateField(name, value);
    }
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = value === '' ? '' : Number(value);
    setFormData(prev => ({ ...prev, [name]: numValue }));
    if (touchedFields[name]) {
      validateField(name, numValue);
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (touchedFields[name]) {
      validateField(name, value);
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const validateForm = (): boolean => {
    let isValid = true;
    
    // Проверяем каждое поле
    Object.keys(formData).forEach(key => {
      const fieldName = key as keyof FormData;
      const isFieldValid = validateField(fieldName, formData[fieldName]);
      if (!isFieldValid) {
        isValid = false;
      }
    });
    
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    
    if (validateForm()) {
      // Успешная отправка формы
      console.log('Форма успешно отправлена', formData);
      alert('Форма успешно отправлена!');
    } else {
      console.log('Форма содержит ошибки', errors);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Пример унифицированной формы</h1>
      
      <ExtendedForm onSubmit={handleSubmit}>
        <ValidatedTextField
          label="Название"
          name="name"
          required
          value={formData.name}
          onChange={handleTextChange}
          errors={errors}
          touchedFields={touchedFields}
          formSubmitted={formSubmitted}
          markFieldAsTouched={markFieldAsTouched}
        />
        
        <ValidatedTextField
          label="Описание"
          name="description"
          multiline
          rows={4}
          value={formData.description}
          onChange={handleTextChange}
          errors={errors}
          touchedFields={touchedFields}
          formSubmitted={formSubmitted}
          markFieldAsTouched={markFieldAsTouched}
        />
        
        <ValidatedSelectField
          label="Категория"
          name="category"
          required
          options={categoryOptions}
          value={formData.category}
          onChange={handleSelectChange}
          errors={errors}
          touchedFields={touchedFields}
          formSubmitted={formSubmitted}
          markFieldAsTouched={markFieldAsTouched}
        />
        
        <ValidatedNumberField
          label="Количество"
          name="quantity"
          required
          min={0}
          max={100}
          value={formData.quantity}
          onChange={handleNumberChange}
          errors={errors}
          touchedFields={touchedFields}
          formSubmitted={formSubmitted}
          markFieldAsTouched={markFieldAsTouched}
        />
        
        <ValidatedCheckboxField
          label="Активен"
          name="isActive"
          checked={formData.isActive}
          onChange={handleCheckboxChange}
          hint="Отметьте, если элемент активен"
          errors={errors}
          touchedFields={touchedFields}
          formSubmitted={formSubmitted}
          markFieldAsTouched={markFieldAsTouched}
        />
        
        <div className="mt-6 flex gap-4">
          <button 
            type="submit" 
            className={`${buttonClasses.base} ${buttonClasses.primary}`}
          >
            Отправить
          </button>
          <button 
            type="button" 
            className={`${buttonClasses.base} ${buttonClasses.secondary}`}
            onClick={() => {
              setFormData({
                name: '',
                description: '',
                category: '',
                quantity: '',
                isActive: false
              });
              setErrors({});
              setTouchedFields({});
              setFormSubmitted(false);
            }}
          >
            Очистить
          </button>
        </div>
      </ExtendedForm>
    </div>
  );
};

export default UnifiedFormExample; 