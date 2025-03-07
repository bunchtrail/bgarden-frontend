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
      <div className='flex flex-col sm:flex-row sm:items-start'>
        <label
          htmlFor={name.toString()}
          className={`block text-sm font-medium ${
            hasError ? 'text-red-700' : 'text-gray-700'
          } sm:w-1/3 sm:py-2 transition-colors duration-200`}
        >
          {label}
          {required && <span className='text-red-500 ml-1'>*</span>}
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
                showError ? 'border-red-500 ring-red-500' : ''
              } transition-all duration-200 focus:scale-[1.01] group-hover:border-blue-300 shadow-sm`}
              required={required}
              aria-invalid={showError}
              aria-describedby={showError ? `${name}-error` : undefined}
              placeholder={`Введите ${label.toLowerCase()}`}
              onFocus={(e) => e.target.classList.add('ring-2', 'ring-blue-100')}
              onBlur={(e) => e.target.classList.remove('ring-2', 'ring-blue-100')}
            />
          ) : (
            <input
              type='text'
              id={name.toString()}
              name={name.toString()}
              value={formData[name] as string}
              onChange={handleChange}
              className={`${formClasses.input} ${
                showError ? 'border-red-500 ring-red-500' : ''
              } transition-all duration-200 focus:scale-[1.01] group-hover:border-blue-300 shadow-sm hover:shadow`}
              required={required}
              aria-invalid={showError}
              aria-describedby={showError ? `${name}-error` : undefined}
              placeholder={`Введите ${label.toLowerCase()}`}
              onFocus={(e) => e.target.classList.add('ring-2', 'ring-blue-100')}
              onBlur={(e) => e.target.classList.remove('ring-2', 'ring-blue-100')}
            />
          )}
          {showError && (
            <p
              id={`${name}-error`}
              className={`${formClasses.error} animate-fadeIn flex items-center mt-1`}
            >
              <svg className="w-4 h-4 mr-1 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors[name]}
            </p>
          )}
          {!showError && isTouched && formData[name] && (
            <span className='absolute right-2 top-2 text-green-500 animate-fadeIn'>
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

  return (
    <div className='mb-4 group transition-all duration-300 hover:bg-gray-50 rounded-lg p-2'>
      <div className='flex flex-col sm:flex-row sm:items-start'>
        <label
          htmlFor={name.toString()}
          className={`block text-sm font-medium ${
            hasError ? 'text-red-700' : 'text-gray-700'
          } sm:w-1/3 sm:py-2 transition-colors duration-200`}
        >
          {label}
          {required && <span className='text-red-500 ml-1'>*</span>}
        </label>
        <div className='mt-1 sm:mt-0 sm:w-2/3 relative'>
          <input
            type='number'
            id={name.toString()}
            name={name.toString()}
            value={
              formData[name] !== undefined
                ? typeof formData[name] === 'boolean'
                  ? ''
                  : String(formData[name])
                : ''
            }
            min={min}
            max={max}
            onChange={handleNumberChange}
            className={`${formClasses.input} ${
              showError ? 'border-red-500 ring-red-500' : ''
            } transition-all duration-200 focus:scale-[1.01] group-hover:border-blue-300 shadow-sm hover:shadow`}
            required={required}
            aria-invalid={showError}
            aria-describedby={showError ? `${name}-error` : undefined}
            placeholder={
              min !== undefined && max !== undefined
                ? `${min} - ${max}`
                : `Введите ${label.toLowerCase()}`
            }
            onFocus={(e) => e.target.classList.add('ring-2', 'ring-blue-100')}
            onBlur={(e) => e.target.classList.remove('ring-2', 'ring-blue-100')}
          />
          {showError && (
            <p
              id={`${name}-error`}
              className={`${formClasses.error} animate-fadeIn flex items-center mt-1`}
            >
              <svg className="w-4 h-4 mr-1 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors[name]}
            </p>
          )}
          {!showError && isTouched && formData[name] && (
            <span className='absolute right-2 top-2 text-green-500 animate-fadeIn'>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </span>
          )}
          {min !== undefined && max !== undefined && (
            <p className='text-xs text-gray-500 mt-1 flex items-center'>
              <svg className="w-3 h-3 mr-1 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd" />
              </svg>
              Допустимый диапазон: {min} - {max}
            </p>
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

  return (
    <div className='mb-4 group transition-all duration-300 hover:bg-gray-50 rounded-lg p-2'>
      <div className='flex flex-col sm:flex-row sm:items-start'>
        <label
          htmlFor={name.toString()}
          className={`block text-sm font-medium ${
            hasError ? 'text-red-700' : 'text-gray-700'
          } sm:w-1/3 sm:py-2 transition-colors duration-200`}
        >
          {label}
          {required && <span className='text-red-500 ml-1'>*</span>}
        </label>
        <div className='mt-1 sm:mt-0 sm:w-2/3 relative'>
          <select
            id={name.toString()}
            name={name.toString()}
            value={formData[name] as number}
            onChange={handleSelectChange}
            className={`${formClasses.select} ${
              showError ? 'border-red-500 ring-red-500' : ''
            } transition-all duration-200 focus:scale-[1.01] group-hover:border-blue-300 appearance-none pr-8 shadow-sm hover:shadow`}
            required={required}
            aria-invalid={showError}
            aria-describedby={showError ? `${name}-error` : undefined}
            onFocus={(e) => e.target.classList.add('ring-2', 'ring-blue-100')}
            onBlur={(e) => e.target.classList.remove('ring-2', 'ring-blue-100')}
          >
            <option value=''>Выберите {label.toLowerCase()}</option>
            {options.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
          <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700'>
            <svg
              className='h-4 w-4 fill-current text-blue-500'
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 20 20'
            >
              <path d='M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z' />
            </svg>
          </div>
          {showError && (
            <p
              id={`${name}-error`}
              className={`${formClasses.error} animate-fadeIn flex items-center mt-1`}
            >
              <svg className="w-4 h-4 mr-1 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors[name]}
            </p>
          )}
          {!showError &&
            isTouched &&
            formData[name] &&
            formData[name] !== '' && (
              <span className='absolute right-8 top-2 text-green-500 animate-fadeIn'>
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

// Компонент флажка
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

  return (
    <div className='mb-4 group'>
      <div className='flex flex-col sm:flex-row sm:items-start'>
        <div className='sm:w-1/3'></div>
        <div className='mt-1 sm:mt-0 sm:w-2/3'>
          <div className='flex items-center'>
            <input
              type='checkbox'
              id={name.toString()}
              name={name.toString()}
              checked={Boolean(formData[name])}
              onChange={handleCheckboxChange}
              className={`${formClasses.checkbox} transition-all duration-200 h-5 w-5 cursor-pointer hover:ring-2 hover:ring-blue-200 border-gray-300 rounded`}
              aria-describedby={hint ? `${name}-hint` : undefined}
            />
            <label
              htmlFor={name.toString()}
              className='ml-2 block text-sm text-gray-700 font-medium cursor-pointer select-none'
            >
              {label}
            </label>
          </div>
          {hint && (
            <p
              id={`${name}-hint`}
              className='mt-1 text-sm text-gray-500 group-hover:text-gray-700 transition-colors duration-200'
            >
              {hint}
            </p>
          )}
          {showError && (
            <p
              id={`${name}-error`}
              className={`${formClasses.error} animate-fadeIn`}
            >
              {errors[name]}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
