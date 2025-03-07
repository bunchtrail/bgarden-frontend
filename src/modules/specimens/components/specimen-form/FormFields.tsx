import React from 'react';
import { formClasses } from '../styles';
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

  return (
    <div className='mb-4 group transition-all duration-300 hover:bg-gray-50 rounded-lg p-2'>
      <div className='flex flex-col sm:flex-row sm:items-start space-y-1 sm:space-y-0'>
        <label
          htmlFor={name.toString()}
          className={`block text-sm font-medium ${
            hasError ? 'text-red-700' : 'text-gray-700'
          } sm:w-1/3 sm:py-2 transition-colors duration-200`}
        >
          {label}
          {required && <span className='text-red-500 ml-1 font-bold'>*</span>}
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
                showError ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300 bg-white'
              } transition-all duration-200 focus:ring-2 focus:ring-blue-300 group-hover:border-blue-300 shadow-sm w-full px-3 py-2 rounded-md text-gray-700 focus:outline-none`}
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
                showError ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300 bg-white'
              } transition-all duration-200 focus:ring-2 focus:ring-blue-300 hover:border-blue-400 shadow-sm w-full px-3 py-2 rounded-md text-gray-700 focus:outline-none`}
              required={required}
              aria-invalid={showError}
              aria-describedby={showError ? `${name}-error` : undefined}
              placeholder={`Введите ${label.toLowerCase()}`}
              onBlur={() => markFieldAsTouched(name)}
            />
          )}
          {showError && (
            <p
              id={`${name}-error`}
              className='text-sm text-red-600 mt-1 animate-fadeIn flex items-center'
            >
              <svg className="w-4 h-4 mr-1 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors[name]}
            </p>
          )}
          {!showError && isTouched && formData[name] && (
            <span className='absolute right-3 top-3 text-green-500 animate-fadeIn'>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </span>
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
  required = false,
  min,
  max,
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
  
  // Корректное отображение числовых значений - не показывать 0 как значение по умолчанию
  // Приводим к строке, чтобы избежать проблем с типами для React-компонента input
  const displayValue = formData[name] === 0 && !isTouched 
    ? '' 
    : String(formData[name]);

  return (
    <div className='mb-4 group transition-all duration-300 hover:bg-gray-50 rounded-lg p-2'>
      <div className='flex flex-col sm:flex-row sm:items-start space-y-1 sm:space-y-0'>
        <label
          htmlFor={name.toString()}
          className={`block text-sm font-medium ${
            hasError ? 'text-red-700' : 'text-gray-700'
          } sm:w-1/3 sm:py-2 transition-colors duration-200`}
        >
          {label}
          {required && <span className='text-red-500 ml-1 font-bold'>*</span>}
        </label>
        <div className='mt-1 sm:mt-0 sm:w-2/3 relative'>
          <input
            type='number'
            id={name.toString()}
            name={name.toString()}
            value={displayValue}
            min={min}
            max={max}
            onChange={handleNumberChange}
            className={`${formClasses.input} ${
              showError ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300 bg-white'
            } transition-all duration-200 focus:ring-2 focus:ring-blue-300 hover:border-blue-400 shadow-sm w-full px-3 py-2 rounded-md text-gray-700 focus:outline-none`}
            required={required}
            aria-invalid={showError}
            aria-describedby={showError ? `${name}-error` : undefined}
            placeholder={min !== undefined && max !== undefined ? `${min} - ${max}` : `Введите ${label.toLowerCase()}`}
            onBlur={() => markFieldAsTouched(name)}
          />
          
          {/* Пояснение к числовому полю */}
          {min !== undefined && max !== undefined && (
            <p className='text-xs text-gray-500 mt-1 flex items-center'>
              <svg className="w-3 h-3 mr-1 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd" />
              </svg>
              Допустимый диапазон: {min} - {max}
            </p>
          )}
          
          {showError && (
            <p
              id={`${name}-error`}
              className='text-sm text-red-600 mt-1 animate-fadeIn flex items-center'
            >
              <svg className="w-4 h-4 mr-1 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors[name]}
            </p>
          )}
          {!showError && isTouched && formData[name] && (
            <span className='absolute right-3 top-3 text-green-500 animate-fadeIn'>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

// Компонент выпадающего списка
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
  
  // Находим текущее выбранное значение для отображения
  const selectedOption = options.find(option => option.id === formData[name]);

  return (
    <div className='mb-4 group transition-all duration-300 hover:bg-gray-50 rounded-lg p-2'>
      <div className='flex flex-col sm:flex-row sm:items-start space-y-1 sm:space-y-0'>
        <label
          htmlFor={name.toString()}
          className={`block text-sm font-medium ${
            hasError ? 'text-red-700' : 'text-gray-700'
          } sm:w-1/3 sm:py-2 transition-colors duration-200`}
        >
          {label}
          {required && <span className='text-red-500 ml-1 font-bold'>*</span>}
        </label>
        <div className='mt-1 sm:mt-0 sm:w-2/3 relative'>
          <select
            id={name.toString()}
            name={name.toString()}
            value={formData[name] as string | number}
            onChange={handleSelectChange}
            className={`appearance-none ${formClasses.select} ${
              showError ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300 bg-white'
            } transition-all duration-200 focus:ring-2 focus:ring-blue-300 hover:border-blue-400 shadow-sm w-full pl-3 pr-10 py-2 rounded-md text-gray-700 focus:outline-none`}
            required={required}
            aria-invalid={showError}
            aria-describedby={showError ? `${name}-error` : undefined}
            onBlur={() => markFieldAsTouched(name)}
          >
            <option value="">Выберите {label.toLowerCase()}</option>
            {options.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
          
          {/* Отображение текущего выбранного значения */}
          {selectedOption && !showError && (
            <div className="absolute top-2 right-10 pointer-events-none">
              <span className="text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded-full">
                {selectedOption.name}
              </span>
            </div>
          )}
          
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
          {showError && (
            <p
              id={`${name}-error`}
              className='text-sm text-red-600 mt-1 animate-fadeIn flex items-center'
            >
              <svg className="w-4 h-4 mr-1 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors[name]}
            </p>
          )}
          {!showError && isTouched && formData[name] && (
            <span className='absolute right-8 top-3 text-green-500 animate-fadeIn'>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </span>
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
  const isChecked = formData[name] as boolean;

  return (
    <div className='mb-4 group transition-all duration-300 hover:bg-gray-50 rounded-lg p-2'>
      <div className='flex flex-col sm:flex-row sm:items-start space-y-1 sm:space-y-0'>
        <div className='sm:w-1/3 sm:py-2'>
          <label
            htmlFor={name.toString()}
            className={`inline-flex items-center ${
              hasError ? 'text-red-700' : 'text-gray-700'
            } transition-colors duration-200`}
          >
            <span className="block text-sm font-medium">{label}</span>
          </label>
        </div>
        <div className='mt-1 sm:mt-0 sm:w-2/3 relative'>
          <div className='flex items-center'>
            <div className='relative'>
              <input
                type='checkbox'
                id={name.toString()}
                name={name.toString()}
                checked={isChecked}
                onChange={handleCheckboxChange}
                className={`h-5 w-5 rounded border-2 focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 transition-colors duration-200 
                  ${hasError ? 'border-red-500' : isChecked ? 'border-blue-500 bg-blue-500' : 'border-gray-300 bg-white'}`}
                aria-invalid={showError}
                aria-describedby={showError ? `${name}-error` : undefined}
                onBlur={() => markFieldAsTouched(name)}
              />
              {isChecked && (
                <svg className="absolute top-0.5 left-0.5 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            
            <span className={`ml-3 text-sm ${isChecked ? 'font-medium text-blue-600' : 'text-gray-600'}`}>
              {isChecked ? 'Да' : 'Нет'}
            </span>
            
            {hint && (
              <div className="ml-2 group relative">
                <span className="inline-block w-4 h-4 bg-blue-100 text-blue-600 rounded-full cursor-help">?</span>
                <div className="absolute left-0 bottom-full mb-2 w-48 rounded bg-gray-800 text-white text-xs p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                  {hint}
                  <span className="absolute left-1 top-full w-2 h-2 bg-gray-800 transform rotate-45"></span>
                </div>
              </div>
            )}
          </div>
          
          {showError && (
            <p 
              id={`${name}-error`}
              className='text-sm text-red-600 mt-1 animate-fadeIn flex items-center'
            >
              <svg className="w-4 h-4 mr-1 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors[name]}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
