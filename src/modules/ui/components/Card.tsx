import React from 'react';
import { cardClasses } from '../../../styles/global-styles';

export interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  headerAction?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  contentClassName?: string;
  headerClassName?: string;
  footerClassName?: string;
  variant?: 'outlined' | 'elevated' | 'filled';
  onClick?: () => void;
}

/**
 * Универсальный компонент Card для отображения содержимого в виде карточки.
 * Поддерживает заголовок, подзаголовок, действия в шапке, футер и различные варианты стилей.
 */
const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  headerAction,
  footer,
  className = '',
  contentClassName = '',
  headerClassName = '',
  footerClassName = '',
  variant = 'elevated',
  onClick
}) => {
  // Базовый класс карточки
  const baseClass = cardClasses.base;
  
  // Класс для варианта стиля
  const variantClass = variant === 'outlined' 
    ? cardClasses.outlined
    : variant === 'filled'
    ? cardClasses.filled
    : cardClasses.elevated;
    
  // Классы для основного контейнера
  const containerClasses = `${baseClass} ${variantClass} ${className} ${onClick ? 'cursor-pointer transition-shadow duration-300' : ''}`;
  
  // Классы для содержимого
  const contentClasses = `${cardClasses.content} ${contentClassName}`;
  
  // Классы для шапки (если она есть)
  const hasHeader = title || subtitle || headerAction;
  const headerClasses = hasHeader ? `${cardClasses.header} ${headerClassName}` : '';
  
  // Классы для футера (если он есть)
  const footerClasses = footer ? `${cardClasses.footer} ${footerClassName}` : '';
  
  return (
    <div className={containerClasses} onClick={onClick}>
      {hasHeader && (
        <div className={headerClasses}>
          <div className="flex-grow">
            {title && <h3 className={cardClasses.title}>{title}</h3>}
            {subtitle && <p className={cardClasses.subtitle}>{subtitle}</p>}
          </div>
          {headerAction && <div className="ml-4">{headerAction}</div>}
        </div>
      )}
      
      <div className={contentClasses}>{children}</div>
      
      {footer && <div className={footerClasses}>{footer}</div>}
    </div>
  );
};

export default Card; 