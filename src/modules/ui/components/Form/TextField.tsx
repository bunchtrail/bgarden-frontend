import React, { forwardRef } from 'react';

export interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  fullWidth?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

/**
 * Компонент поля ввода текста для форм.
 * Поддерживает иконки, метки, вспомогательный текст и сообщения об ошибках.
 */
const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      label,
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
    // Базовые стили для поля ввода
    const baseInputStyles = 'block w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:bg-white transition-all duration-200';
    
    // Стили в зависимости от состояния (ошибка, отключено)
    const inputStateStyles = error
      ? 'focus:ring-red-200 text-red-900 bg-red-50'
      : disabled
      ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
      : 'focus:ring-blue-200 focus:shadow-sm';
    
    // Стили контейнера
    const containerStyles = `${fullWidth ? 'w-full' : ''} mb-6`;
    
    return (
      <div className={`${containerStyles} ${className}`}>
        {label && (
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {startIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {startIcon}
            </div>
          )}
          <input
            ref={ref}
            className={`${baseInputStyles} ${inputStateStyles} ${
              startIcon ? 'pl-10' : ''
            } ${endIcon ? 'pr-10' : ''}`}
            disabled={disabled}
            aria-invalid={error ? 'true' : 'false'}
            {...rest}
          />
          {endIcon && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {endIcon}
            </div>
          )}
        </div>
        {(helperText || error) && (
          <p className={`mt-2 text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

TextField.displayName = 'TextField';

export default TextField; 