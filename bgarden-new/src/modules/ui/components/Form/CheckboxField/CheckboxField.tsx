import React, { forwardRef } from 'react';

export interface CheckboxFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  helperText?: string;
  error?: string;
}

/**
 * Компонент чекбокса для форм.
 * Поддерживает метки, вспомогательный текст и сообщения об ошибках.
 */
const CheckboxField = forwardRef<HTMLInputElement, CheckboxFieldProps>(
  (
    {
      label,
      helperText,
      error,
      className = '',
      disabled = false,
      id,
      ...rest
    },
    ref
  ) => {
    // Стили чекбокса
    const checkboxStyles = 'h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500';
    const disabledStyles = disabled ? 'opacity-60 cursor-not-allowed' : '';
    const errorStyles = error ? 'border-red-500' : '';
    
    return (
      <div className={`mb-4 ${className}`}>
        <div className="flex items-center">
          <input
            ref={ref}
            id={id}
            type="checkbox"
            className={`${checkboxStyles} ${errorStyles} ${disabledStyles}`}
            disabled={disabled}
            aria-invalid={error ? 'true' : 'false'}
            {...rest}
          />
          {label && (
            <label 
              htmlFor={id} 
              className={`ml-2 block text-sm text-gray-700 ${disabled ? 'opacity-60' : ''}`}
            >
              {label}
            </label>
          )}
        </div>
        {(helperText || error) && (
          <p className={`mt-1 text-sm ${error ? 'text-red-600' : 'text-gray-500'} ml-6`}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

CheckboxField.displayName = 'CheckboxField';

export default CheckboxField; 