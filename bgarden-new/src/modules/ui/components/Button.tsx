import React from 'react';
import { buttonClasses } from '../../../styles/global-styles';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'warning' | 'neutral' | 'success';
export type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isFullWidth?: boolean;
  isLoading?: boolean;
  isDisabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

/**
 * Универсальный компонент кнопки с поддержкой различных вариантов,
 * размеров и состояний. Использует глобальные стили из global-styles.ts.
 */
const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  isFullWidth = false,
  isLoading = false,
  isDisabled = false,
  leftIcon,
  rightIcon,
  children,
  className = '',
  ...props
}) => {
  // Получаем базовый класс кнопки
  const baseClass = buttonClasses.base;
  
  // Получаем класс варианта кнопки
  const variantClass = buttonClasses[variant] || buttonClasses.primary;
  
  // Создаем класс размера
  const sizeClass = {
    small: 'py-1 px-3 text-xs',
    medium: 'py-2 px-4 text-sm',
    large: 'py-3 px-6 text-base'
  }[size];
  
  // Собираем все классы
  const classes = [
    baseClass,
    variantClass,
    sizeClass,
    isFullWidth ? 'w-full' : '',
    isDisabled || isLoading ? buttonClasses.disabled || 'opacity-60 cursor-not-allowed' : '',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <button
      className={classes}
      disabled={isDisabled || isLoading}
      {...props}
    >
      {isLoading && (
        <span className="mr-2 inline-block">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </span>
      )}
      
      {leftIcon && !isLoading && <span className="mr-2 inline-flex items-center">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="ml-2 inline-flex items-center">{rightIcon}</span>}
    </button>
  );
};

export default Button; 