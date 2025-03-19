import React, { forwardRef } from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
  fullWidth?: boolean;
}

/**
 * Компонент многострочного поля ввода текста для форм.
 * Поддерживает метки, вспомогательный текст и сообщения об ошибках.
 */
const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      helperText,
      error,
      fullWidth = false,
      className = '',
      disabled = false,
      rows = 3,
      ...rest
    },
    ref
  ) => {
    // Базовые стили для поля ввода
    const baseInputStyles = 'block w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors duration-200';
    
    // Стили в зависимости от состояния (ошибка, отключено)
    const inputStateStyles = error
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
          <textarea
            ref={ref}
            className={`${baseInputStyles} ${inputStateStyles}`}
            disabled={disabled}
            aria-invalid={error ? 'true' : 'false'}
            rows={rows}
            {...rest}
          />
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

Textarea.displayName = 'Textarea';

export default Textarea; 