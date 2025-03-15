import React from 'react';
import { formClasses } from '../../styles/global-styles';
import { Form, FormControl, FormError, FormInput, FormLabel, FormSelect, FormTextarea } from './Form';

/**
 * Расширенные компоненты форм с поддержкой валидации, анимации и индикации состояний
 */

interface ExtendedFormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  children: React.ReactNode;
  className?: string;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
}

export const ExtendedForm: React.FC<ExtendedFormProps> = ({
  children,
  className = '',
  onSubmit,
  ...props
}) => {
  return (
    <Form className={className} onSubmit={onSubmit} {...props}>
      {children}
    </Form>
  );
};

interface ValidatedFieldProps {
  name: string;
  errors?: Record<string, string>;
  touchedFields?: Record<string, boolean>;
  formSubmitted?: boolean;
  markFieldAsTouched?: (name: string) => void;
  hasValue?: boolean;
}

interface ValidatedTextFieldProps extends ValidatedFieldProps {
  label: string;
  required?: boolean;
  multiline?: boolean;
  rows?: number;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  className?: string;
}

export const ValidatedTextField: React.FC<ValidatedTextFieldProps> = ({
  label,
  name,
  required = false,
  multiline = false,
  rows = 1,
  value,
  onChange,
  placeholder,
  errors = {},
  touchedFields = {},
  formSubmitted = false,
  markFieldAsTouched = () => {},
  className = '',
}) => {
  const hasError = !!errors[name];
  const isTouched = touchedFields[name];
  const showError = hasError && (isTouched || formSubmitted);
  const isValid = isTouched && !hasError && value;

  const handleBlur = () => {
    markFieldAsTouched(name);
  };

  const inputClasses = `
    ${formClasses.input} 
    ${showError ? 'border-red-400 ring-1 ring-red-400 bg-red-50' : ''} 
    ${isValid ? 'border-green-400 ring-1 ring-green-200 bg-green-50' : ''}
    transition-all duration-200 hover:border-blue-300
    ${className}
  `;

  return (
    <FormControl>
      <FormLabel htmlFor={name.toString()}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </FormLabel>
      
      {multiline ? (
        <FormTextarea
          id={name.toString()}
          name={name.toString()}
          rows={rows}
          value={value}
          onChange={onChange}
          className={inputClasses}
          placeholder={placeholder || `Введите ${label.toLowerCase()}`}
          onBlur={handleBlur}
          required={required}
        />
      ) : (
        <FormInput
          id={name.toString()}
          name={name.toString()}
          type="text"
          value={value}
          onChange={onChange}
          className={inputClasses}
          placeholder={placeholder || `Введите ${label.toLowerCase()}`}
          onBlur={handleBlur}
          required={required}
        />
      )}

      {showError && <FormError>{errors[name]}</FormError>}
      
      {isValid && (
        <div className="absolute right-3 top-3 text-green-500 animate-fadeIn">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}
    </FormControl>
  );
};

interface ValidatedNumberFieldProps extends ValidatedFieldProps {
  label: string;
  required?: boolean;
  min?: number;
  max?: number;
  value: number | '';
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
}

export const ValidatedNumberField: React.FC<ValidatedNumberFieldProps> = ({
  label,
  name,
  required = false,
  min,
  max,
  value,
  onChange,
  placeholder,
  errors = {},
  touchedFields = {},
  formSubmitted = false,
  markFieldAsTouched = () => {},
  className = '',
}) => {
  const hasError = !!errors[name];
  const isTouched = touchedFields[name];
  const showError = hasError && (isTouched || formSubmitted);
  const isValid = isTouched && !hasError && value !== undefined && value !== '';

  const handleBlur = () => {
    markFieldAsTouched(name);
  };

  const inputClasses = `
    ${formClasses.input} 
    ${showError ? 'border-red-400 ring-1 ring-red-400 bg-red-50' : ''} 
    ${isValid ? 'border-green-400 ring-1 ring-green-200 bg-green-50' : ''}
    transition-all duration-200 hover:border-blue-300
    ${className}
  `;

  return (
    <FormControl>
      <FormLabel htmlFor={name.toString()}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </FormLabel>
      
      <FormInput
        id={name.toString()}
        name={name.toString()}
        type="number"
        value={value}
        min={min}
        max={max}
        onChange={onChange}
        className={inputClasses}
        placeholder={placeholder || `Введите ${label.toLowerCase()}`}
        onBlur={handleBlur}
        required={required}
      />

      {showError && <FormError>{errors[name]}</FormError>}
      
      {isValid && (
        <div className="absolute right-3 top-3 text-green-500 animate-fadeIn">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}
      
      {(min !== undefined || max !== undefined) && (
        <p className="text-sm text-gray-500 mt-1">
          {min !== undefined && max !== undefined
            ? `Допустимый диапазон: от ${min} до ${max}`
            : min !== undefined
            ? `Минимальное значение: ${min}`
            : `Максимальное значение: ${max}`}
        </p>
      )}
    </FormControl>
  );
};

interface ValidatedSelectFieldProps extends ValidatedFieldProps {
  label: string;
  required?: boolean;
  options: Array<{ value: string | number; label: string }>;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  placeholder?: string;
  className?: string;
}

export const ValidatedSelectField: React.FC<ValidatedSelectFieldProps> = ({
  label,
  name,
  required = false,
  options,
  value,
  onChange,
  placeholder,
  errors = {},
  touchedFields = {},
  formSubmitted = false,
  markFieldAsTouched = () => {},
  className = '',
}) => {
  const hasError = !!errors[name];
  const isTouched = touchedFields[name];
  const showError = hasError && (isTouched || formSubmitted);
  const isValid = isTouched && !hasError && value !== undefined && value !== '';

  const handleBlur = () => {
    markFieldAsTouched(name);
  };

  const selectClasses = `
    ${formClasses.select} 
    ${showError ? 'border-red-400 ring-1 ring-red-400 bg-red-50' : ''} 
    ${isValid ? 'border-green-400 ring-1 ring-green-200 bg-green-50' : ''}
    transition-all duration-200 hover:border-blue-300
    ${className}
  `;
  
  // Преобразуем options в формат, который ожидает FormSelect
  const formattedOptions = options.map(option => ({
    value: String(option.value),
    label: option.label
  }));

  return (
    <FormControl>
      <FormLabel htmlFor={name.toString()}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </FormLabel>
      
      <FormSelect
        id={name.toString()}
        name={name.toString()}
        value={String(value)}
        onChange={onChange}
        options={formattedOptions}
        placeholder={placeholder || `Выберите ${label.toLowerCase()}`}
        className={selectClasses}
        onBlur={handleBlur}
        required={required}
      />

      {showError && <FormError>{errors[name]}</FormError>}
      
      {isValid && (
        <div className="absolute right-8 top-3 text-green-500 animate-fadeIn">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}
    </FormControl>
  );
};

interface ValidatedCheckboxFieldProps extends ValidatedFieldProps {
  label: string;
  required?: boolean;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  hint?: string;
  className?: string;
}

export const ValidatedCheckboxField: React.FC<ValidatedCheckboxFieldProps> = ({
  label,
  name,
  required = false,
  checked,
  onChange,
  hint,
  errors = {},
  touchedFields = {},
  formSubmitted = false,
  markFieldAsTouched = () => {},
  className = '',
}) => {
  const hasError = !!errors[name];
  const isTouched = touchedFields[name];
  const showError = hasError && (isTouched || formSubmitted);

  const handleBlur = () => {
    markFieldAsTouched(name);
  };

  return (
    <FormControl className="flex items-start space-x-3">
      <div className="flex items-center h-5">
        <input
          id={name.toString()}
          name={name.toString()}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          onBlur={handleBlur}
          className={`
            ${formClasses.checkbox}
            ${showError ? 'border-red-400 ring-1 ring-red-400' : ''}
            ${className}
          `}
          required={required}
        />
      </div>
      <div>
        <FormLabel htmlFor={name.toString()} className="mb-0">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </FormLabel>
        {hint && <p className="text-sm text-gray-500 mt-1">{hint}</p>}
        {showError && <FormError>{errors[name]}</FormError>}
      </div>
    </FormControl>
  );
};

// Экспорт группы компонентов
export default {
  ExtendedForm,
  ValidatedTextField,
  ValidatedNumberField,
  ValidatedSelectField,
  ValidatedCheckboxField
}; 