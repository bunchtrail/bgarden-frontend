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
    const baseSelectStyles = `block w-full py-2 px-4 rounded-lg ${animationClasses.transition} focus:outline-none focus:ring-2`;
    
    // Стили в зависимости от состояния (ошибка, отключено)
    const selectStateStyles = error
      ? `border-${COLORS.danger.main} focus:ring-${COLORS.danger.light} text-${COLORS.danger.dark}`
      : disabled
      ? 'border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed'
      : `border border-[#E5E5EA] focus:ring-${COLORS.primary.light} focus:border-${COLORS.primary.main}`;
    
    // Стили контейнера
    const containerStyles = `${fullWidth ? 'w-full' : ''} mb-4 ${className}`;
    
    return (
      <div className={containerStyles}>
        {label && (
          <label className={`block ${textClasses.body} ${textClasses.primary} font-medium mb-1`}>
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
          {!endIcon && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">
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
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              {endIcon}
            </div>
          )}
        </div>
        {(helperText || error) && (
          <p className={`mt-1 ${textClasses.small} ${error ? `text-${COLORS.danger.main}` : textClasses.secondary}`}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select; 