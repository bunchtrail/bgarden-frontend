import React, { forwardRef } from 'react';

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'value'> {
  label?: string;
  options: SelectOption[];
  value?: string | number;
  helperText?: string;
  error?: string;
  fullWidth?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

/**
 * Компонент выпадающего списка для форм.
 * Поддерживает опции, метки, вспомогательный текст и сообщения об ошибках.
 */
const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      options,
      helperText,
      error,
      fullWidth = false,
      startIcon,
      endIcon,
      className = '',
      disabled = false,
      ...rest
    },
    ref
  ) => {
    // Базовые стили для выпадающего списка
    const baseSelectStyles = 'block w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors duration-200';
    
    // Стили в зависимости от состояния (ошибка, отключено)
    const selectStateStyles = error
      ? 'border-red-500 focus:ring-red-200 text-red-900'
      : disabled
      ? 'border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed'
      : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500';
    
    // Стили контейнера
    const containerStyles = `${fullWidth ? 'w-full' : ''} mb-4`;
    
    return (
      <div className={`${containerStyles} ${className}`}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <div className="relative">
          {startIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              {startIcon}
            </div>
          )}
          <select
            ref={ref}
            className={`${baseSelectStyles} ${selectStateStyles} ${
              startIcon ? 'pl-10' : ''
            } ${endIcon ? 'pr-10' : ''}`}
            disabled={disabled}
            aria-invalid={error ? 'true' : 'false'}
            {...rest}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {endIcon && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              {endIcon}
            </div>
          )}
        </div>
        {(helperText || error) && (
          <p className={`mt-1 text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select; 