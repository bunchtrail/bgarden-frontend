import React from 'react';

export interface CardProps {
  /**
   * Содержимое карточки
   */
  children: React.ReactNode;
  /**
   * Дополнительные классы
   */
  className?: string;
  /**
   * Включить эффект наведения
   */
  hoverable?: boolean;
  /**
   * Обработчик нажатия на карточку
   */
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hoverable = false,
  onClick,
}) => {
  const baseClasses =
    'bg-white dark:bg-gray-800 rounded-xl shadow-card border border-gray-100 dark:border-gray-800 overflow-hidden';
  const hoverClasses = hoverable
    ? 'transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px]'
    : '';
  const clickableClasses = onClick ? 'cursor-pointer' : '';

  return (
    <div
      className={`${baseClasses} ${hoverClasses} ${clickableClasses} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => (
  <div className={`px-6 pt-6 pb-2 ${className}`}>{children}</div>
);

export const CardBody: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => (
  <div className={`px-6 py-4 ${className}`}>{children}</div>
);

export const CardFooter: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => (
  <div
    className={`px-6 py-4 border-t border-gray-100 dark:border-gray-700 ${className}`}
  >
    {children}
  </div>
);

export const CardTitle: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => (
  <h3
    className={`text-xl font-semibold text-secondary-dark dark:text-secondary-light ${className}`}
  >
    {children}
  </h3>
);

export const CardImage: React.FC<{
  src: string;
  alt: string;
  className?: string;
}> = ({ src, alt, className = '' }) => (
  <div className='w-full h-48 overflow-hidden'>
    <img
      src={src}
      alt={alt}
      className={`w-full h-full object-cover transition-transform duration-500 hover:scale-105 ${className}`}
    />
  </div>
);

export default Card;
