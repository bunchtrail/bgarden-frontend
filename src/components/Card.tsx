import React from 'react';
import { cardClasses, textClasses, chipClasses, buttonClasses } from '../styles/global-styles';

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
  const classes = withHover
    ? `${cardClasses.base} ${cardClasses.interactive} ${className}`
    : `${cardClasses.base} ${className}`;

  return (
    <div className={classes}>
      {imageUrl && (
        <div className='h-48 overflow-hidden rounded-t-2xl'>
          <img
            className='w-full h-full object-cover transition-transform duration-500 hover:scale-105'
            src={imageUrl}
            alt={title}
          />
        </div>
      )}
      <div className={cardClasses.body}>
        <h2 className={cardClasses.title}>{title}</h2>
        <p className={`${textClasses.body} ${textClasses.secondary} mt-2`}>
          {description}
        </p>
        
        {tags && tags.length > 0 && (
          <div className='flex flex-wrap mt-3'>
            {tags.map((tag, index) => (
              <span
                key={index}
                className={`${chipClasses.base} ${chipClasses.neutral}`}
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
              className={`${buttonClasses.base} ${buttonClasses.primary}`}
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
