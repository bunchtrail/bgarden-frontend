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
    const baseInputStyles = 'block w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:bg-white transition-all duration-200 resize-y';
    
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
          <p className={`mt-2 text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea; 