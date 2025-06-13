import React, { forwardRef } from 'react';
import { textClasses, buttonClasses, animationClasses, COLORS } from '../../../../styles/global-styles';

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
    // Базовые стили для выпадающего списка, используя глобальные стили
    const baseSelectStyles = `block w-full py-3 px-4 bg-gray-50 border-0 rounded-xl ${animationClasses.transition} focus:outline-none focus:ring-2 focus:bg-white`;
    
    // Стили в зависимости от состояния (ошибка, отключено)
    const selectStateStyles = error
      ? `focus:ring-red-200 text-red-900 bg-red-50`
      : disabled
      ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
      : `focus:ring-blue-200 focus:shadow-sm`;
    
    // Стили контейнера
    const containerStyles = `${fullWidth ? 'w-full' : ''} mb-6 ${className}`;
    
    return (
      <div className={containerStyles}>
        {label && (
          <label className={`block ${textClasses.body} ${textClasses.primary} font-semibold mb-2`}>
            {label}
          </label>
        )}
        <div className="relative">
          {startIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
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
          {!endIcon && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
              <svg 
                className="w-4 h-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M19 9l-7 7-7-7" 
                />
              </svg>
            </div>
          )}
          {endIcon && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {endIcon}
            </div>
          )}
        </div>
        {(helperText || error) && (
          <p className={`mt-2 ${textClasses.small} ${error ? `text-red-600` : textClasses.secondary}`}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select; 