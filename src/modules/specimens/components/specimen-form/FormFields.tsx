import React from 'react';
import { animationClasses, formClasses } from '../styles';
import {
  CheckboxFieldProps,
  NumberFieldProps,
  SelectFieldProps,
  TextFieldProps,
} from './types';

// Компонент текстового поля
export const TextField: React.FC<TextFieldProps> = ({
  label,
  name,
  required = false,
  multiline = false,
  rows = 1,
  formData,
  errors,
  touchedFields,
  formSubmitted,
  markFieldAsTouched,
  handleChange,
}) => {
  const hasError = !!errors[name];
  const isTouched = touchedFields[name];
  const showError = hasError && (isTouched || formSubmitted);
  const isValid = isTouched && !hasError && formData[name];

  return (
    <div className={formClasses.fieldGroup}>
      <div className='flex flex-col sm:flex-row sm:items-start space-y-1 sm:space-y-0'>
        <label
          htmlFor={name.toString()}
          className={`block text-sm font-medium ${
            hasError ? 'text-red-700' : 'text-gray-700'
          } sm:w-1/3 sm:py-2 transition-colors duration-200`}
        >
          {label}
          {required && <span className={formClasses.requiredMark}>*</span>}
        </label>
        <div className='mt-1 sm:mt-0 sm:w-2/3 relative'>
          {multiline ? (
            <textarea
              id={name.toString()}
              name={name.toString()}
              rows={rows}
              value={formData[name] as string}
              onChange={handleChange}
              className={`${formClasses.textarea} ${
                showError
                  ? 'border-red-400 ring-1 ring-red-400 bg-red-50'
                  : isValid
                  ? 'border-green-400 ring-1 ring-green-200 bg-green-50'
                  : 'border-gray-300 bg-white hover:border-blue-300'
              } ${animationClasses.smoothTransition} ${
                animationClasses.smoothScale
              }`}
              required={required}
              aria-invalid={showError}
              aria-describedby={showError ? `${name}-error` : undefined}
              placeholder={`Введите ${label.toLowerCase()}`}
              onBlur={() => markFieldAsTouched(name)}
            />
          ) : (
            <input
              type='text'
              id={name.toString()}
              name={name.toString()}
              value={formData[name] as string}
              onChange={handleChange}
              className={`${formClasses.input} ${
                showError
                  ? 'border-red-400 ring-1 ring-red-400 bg-red-50'
                  : isValid
                  ? 'border-green-400 ring-1 ring-green-200 bg-green-50'
                  : 'border-gray-300 bg-white hover:border-blue-300'
              } ${animationClasses.smoothTransition} ${
                animationClasses.smoothScale
              }`}
              required={required}
              aria-invalid={showError}
              aria-describedby={showError ? `${name}-error` : undefined}
              placeholder={`Введите ${label.toLowerCase()}`}
              onBlur={() => markFieldAsTouched(name)}
            />
          )}

          {/* Индикаторы состояния */}
          {showError && (
            <div
              id={`${name}-error`}
              className='text-sm text-red-600 mt-1.5 flex items-center animate-fadeIn'
            >
              <svg
                className='w-4 h-4 mr-1.5 flex-shrink-0'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path
                  fillRule='evenodd'
                  d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                  clipRule='evenodd'
                />
              </svg>
              {errors[name]}
            </div>
          )}

          {isValid && (
            <div className='absolute right-3 top-3 text-green-500 animate-fadeIn'>
              <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
                <path
                  fillRule='evenodd'
                  d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                  clipRule='evenodd'
                />
              </svg>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Компонент числового поля
export const NumberField: React.FC<NumberFieldProps> = ({
  label,
  name,
  min,
  max,
  required = false,
  formData,
  errors,
  touchedFields,
  formSubmitted,
  markFieldAsTouched,
  handleNumberChange,
}) => {
  const hasError = !!errors[name];
  const isTouched = touchedFields[name];
  const showError = hasError && (isTouched || formSubmitted);
  const isValid = isTouched && !hasError && formData[name] !== undefined;

  return (
    <div className={formClasses.fieldGroup}>
      <div className='flex flex-col sm:flex-row sm:items-start space-y-1 sm:space-y-0'>
        <label
          htmlFor={name.toString()}
          className={`block text-sm font-medium ${
            hasError ? 'text-red-700' : 'text-gray-700'
          } sm:w-1/3 sm:py-2 transition-colors duration-200`}
        >
          {label}
          {required && <span className={formClasses.requiredMark}>*</span>}
        </label>
        <div className='mt-1 sm:mt-0 sm:w-2/3 relative'>
          <input
            type='number'
            id={name.toString()}
            name={name.toString()}
            value={formData[name] as number}
            onChange={handleNumberChange}
            min={min}
            max={max}
            className={`${formClasses.input} ${
              showError
                ? 'border-red-400 ring-1 ring-red-400 bg-red-50'
                : isValid
                ? 'border-green-400 ring-1 ring-green-200 bg-green-50'
                : 'border-gray-300 bg-white hover:border-blue-300'
            } ${animationClasses.smoothTransition} ${
              animationClasses.smoothScale
            }`}
            required={required}
            aria-invalid={showError}
            aria-describedby={showError ? `${name}-error` : undefined}
            placeholder={`Введите ${label.toLowerCase()}`}
            onBlur={() => markFieldAsTouched(name)}
          />

          {/* Индикаторы состояния */}
          {showError && (
            <div
              id={`${name}-error`}
              className='text-sm text-red-600 mt-1.5 flex items-center animate-fadeIn'
            >
              <svg
                className='w-4 h-4 mr-1.5 flex-shrink-0'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path
                  fillRule='evenodd'
                  d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                  clipRule='evenodd'
                />
              </svg>
              {errors[name]}
            </div>
          )}

          {isValid && (
            <div className='absolute right-3 top-3 text-green-500 animate-fadeIn'>
              <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
                <path
                  fillRule='evenodd'
                  d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                  clipRule='evenodd'
                />
              </svg>
            </div>
          )}

          {/* Подсказка о диапазоне значений */}
          {(min !== undefined || max !== undefined) && (
            <p className={formClasses.hintText}>
              {min !== undefined && max !== undefined
                ? `Допустимый диапазон: от ${min} до ${max}`
                : min !== undefined
                ? `Минимальное значение: ${min}`
                : `Максимальное значение: ${max}`}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

// Компонент списка выбора
export const SelectField: React.FC<SelectFieldProps> = ({
  label,
  name,
  options,
  required = false,
  formData,
  errors,
  touchedFields,
  formSubmitted,
  markFieldAsTouched,
  handleSelectChange,
}) => {
  const hasError = !!errors[name];
  const isTouched = touchedFields[name];
  const showError = hasError && (isTouched || formSubmitted);
  const isValid = isTouched && !hasError && formData[name];

  // Преобразуем значение в строку для select
  const selectValue = formData[name] !== undefined && formData[name] !== null 
    ? String(formData[name]) 
    : '';
  
  console.log(`SelectField ${name} value:`, formData[name], 'converted to:', selectValue);

  return (
    <div className={formClasses.fieldGroup}>
      <div className='flex flex-col sm:flex-row sm:items-start space-y-1 sm:space-y-0'>
        <label
          htmlFor={name.toString()}
          className={`block text-sm font-medium ${
            hasError ? 'text-red-700' : 'text-gray-700'
          } sm:w-1/3 sm:py-2 transition-colors duration-200`}
        >
          {label}
          {required && <span className={formClasses.requiredMark}>*</span>}
        </label>
        <div className='mt-1 sm:mt-0 sm:w-2/3 relative'>
          <select
            id={name.toString()}
            name={name.toString()}
            value={selectValue}
            onChange={handleSelectChange}
            className={`${formClasses.select} ${
              showError
                ? 'border-red-400 ring-1 ring-red-400 bg-red-50'
                : isValid
                ? 'border-green-400 ring-1 ring-green-200 bg-green-50'
                : 'border-gray-300 bg-white hover:border-blue-300'
            } ${animationClasses.smoothTransition} pr-10 appearance-none`}
            required={required}
            aria-invalid={showError}
            aria-describedby={showError ? `${name}-error` : undefined}
            onBlur={() => markFieldAsTouched(name)}
          >
            <option value=''>Выберите {label.toLowerCase()}</option>
            {options.map((option) => (
              <option key={option.id} value={option.id.toString()}>
                {option.name}
              </option>
            ))}
          </select>

          {/* Стрелка для селекта */}
          <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500'>
            <svg
              className='w-5 h-5'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M19 9l-7 7-7-7'
              />
            </svg>
          </div>

          {/* Индикаторы состояния */}
          {showError && (
            <div
              id={`${name}-error`}
              className='text-sm text-red-600 mt-1.5 flex items-center animate-fadeIn'
            >
              <svg
                className='w-4 h-4 mr-1.5 flex-shrink-0'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path
                  fillRule='evenodd'
                  d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                  clipRule='evenodd'
                />
              </svg>
              {errors[name]}
            </div>
          )}

          {isValid && !showError && (
            <div className='absolute right-8 top-3 text-green-500 animate-fadeIn'>
              <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
                <path
                  fillRule='evenodd'
                  d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                  clipRule='evenodd'
                />
              </svg>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Компонент чекбокса
export const CheckboxField: React.FC<CheckboxFieldProps> = ({
  label,
  name,
  hint,
  required = false,
  formData,
  errors,
  touchedFields,
  formSubmitted,
  markFieldAsTouched,
  handleCheckboxChange,
}) => {
  const hasError = !!errors[name];
  const isTouched = touchedFields[name];
  const showError = hasError && (isTouched || formSubmitted);

  return (
    <div className={`${formClasses.fieldGroup} sm:pl-4`}>
      <div className='flex items-start space-x-3'>
        <div className='flex items-center h-5'>
          <input
            type='checkbox'
            id={name.toString()}
            name={name.toString()}
            checked={!!formData[name]}
            onChange={handleCheckboxChange}
            className={`${formClasses.checkbox} ${
              showError
                ? 'border-red-400 ring-1 ring-red-400'
                : 'border-gray-300'
            } ${animationClasses.smoothTransition}`}
            required={required}
            aria-invalid={showError}
            aria-describedby={
              showError ? `${name}-error` : hint ? `${name}-hint` : undefined
            }
            onBlur={() => markFieldAsTouched(name)}
          />
        </div>
        <div className='flex-1'>
          <label
            htmlFor={name.toString()}
            className={`text-sm font-medium ${
              hasError ? 'text-red-700' : 'text-gray-700'
            } transition-colors duration-200`}
          >
            {label}
            {required && <span className={formClasses.requiredMark}>*</span>}
          </label>

          {hint && (
            <p id={`${name}-hint`} className={formClasses.hintText}>
              {hint}
            </p>
          )}

          {showError && (
            <div
              id={`${name}-error`}
              className='text-sm text-red-600 mt-1 flex items-center animate-fadeIn'
            >
              <svg
                className='w-4 h-4 mr-1.5 flex-shrink-0'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path
                  fillRule='evenodd'
                  d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                  clipRule='evenodd'
                />
              </svg>
              {errors[name]}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
