import React from 'react';

/**
 * Интерфейс пропсов для компонента Button
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Вариант отображения кнопки
   */
  variant?: 'filled' | 'outlined' | 'text';
  /**
   * Цвет кнопки
   */
  color?: 'primary' | 'secondary' | 'error' | 'success' | 'warning' | 'info';
  /**
   * Размер кнопки
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * Дочерние элементы
   */
  children: React.ReactNode;
  /**
   * Дополнительные классы
   */
  className?: string;
}

/**
 * Унифицированный компонент кнопки с использованием Tailwind CSS
 */
export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'filled',
  color = 'primary',
  size = 'medium',
  className = '',
  ...rest
}) => {
  // Базовые классы для всех вариантов кнопок
  const baseClasses = 'font-medium rounded-pill transition-all duration-200 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-opacity-30';
  
  // Классы для разных вариантов кнопок
  const variantClasses = {
    filled: {
      primary: 'bg-primary hover:bg-primary-600 text-white focus:ring-primary-200',
      secondary: 'bg-secondary hover:bg-secondary-600 text-white focus:ring-secondary-200',
      error: 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-200',
      success: 'bg-green-500 hover:bg-green-600 text-white focus:ring-green-200',
      warning: 'bg-amber-500 hover:bg-amber-600 text-white focus:ring-amber-200',
      info: 'bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-200',
    },
    outlined: {
      primary: 'border border-primary text-primary hover:bg-primary-50 focus:ring-primary-100',
      secondary: 'border border-secondary text-secondary hover:bg-gray-100 focus:ring-gray-200',
      error: 'border border-red-500 text-red-500 hover:bg-red-50 focus:ring-red-100',
      success: 'border border-green-500 text-green-500 hover:bg-green-50 focus:ring-green-100',
      warning: 'border border-amber-500 text-amber-500 hover:bg-amber-50 focus:ring-amber-100',
      info: 'border border-blue-500 text-blue-500 hover:bg-blue-50 focus:ring-blue-100',
    },
    text: {
      primary: 'text-primary hover:bg-primary-50 focus:ring-primary-100',
      secondary: 'text-secondary hover:bg-gray-100 focus:ring-gray-200',
      error: 'text-red-500 hover:bg-red-50 focus:ring-red-100',
      success: 'text-green-500 hover:bg-green-50 focus:ring-green-100',
      warning: 'text-amber-500 hover:bg-amber-50 focus:ring-amber-100',
      info: 'text-blue-500 hover:bg-blue-50 focus:ring-blue-100',
    },
  };
  
  // Классы для разных размеров кнопок
  const sizeClasses = {
    small: 'px-3 py-1 text-sm',
    medium: 'px-4 py-2',
    large: 'px-6 py-3 text-lg',
  };
  
  // Объединяем все классы
  const classes = `${baseClasses} ${variantClasses[variant][color]} ${sizeClasses[size]} ${className}`;

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
};

export default Button;
