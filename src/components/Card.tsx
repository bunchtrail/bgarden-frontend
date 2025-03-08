import React from 'react';
import { appStyles } from '../styles/global-styles';

interface CardProps {
  title: string;
  description: string;
  imageUrl?: string;
  tags?: string[];
  className?: string;
  withHover?: boolean;
  buttonText?: string;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  title,
  description,
  imageUrl,
  tags = [],
  className = '',
  withHover = true,
  buttonText,
  onClick,
}) => {
  const cardClasses = withHover
    ? `${appStyles.card.base} ${appStyles.card.interactive} ${className}`
    : `${appStyles.card.base} ${className}`;

  return (
    <div className={cardClasses}>
      {imageUrl && (
        <div className='h-48 overflow-hidden rounded-t-2xl'>
          <img
            className='w-full h-full object-cover transition-transform duration-500 hover:scale-105'
            src={imageUrl}
            alt={title}
          />
        </div>
      )}
      <div className={appStyles.card.body}>
        <h2 className={appStyles.card.title}>{title}</h2>
        <p className={`${appStyles.text.body} ${appStyles.text.secondary} mt-2`}>
          {description}
        </p>
        
        {tags && tags.length > 0 && (
          <div className='flex flex-wrap mt-3'>
            {tags.map((tag, index) => (
              <span
                key={index}
                className={`${appStyles.chip.base} ${appStyles.chip.neutral}`}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        
        {buttonText && (
          <div className='mt-4'>
            <button 
              onClick={onClick}
              className={`${appStyles.button.base} ${appStyles.button.primary}`}
            >
              {buttonText}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;
