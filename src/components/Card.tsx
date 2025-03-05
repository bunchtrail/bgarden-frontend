import React from 'react';
import {
  buttonClasses,
  chipClasses,
  containerClasses,
  textClasses,
} from '../styles/global-styles';

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
    ? `${containerClasses.base} ${containerClasses.withHover} ${className}`
    : `${containerClasses.base} ${className}`;

  return (
    <div className={cardClasses}>
      {imageUrl && (
        <div className='h-48 overflow-hidden rounded-t-lg -mt-4 -mx-4 sm:-mx-6 mb-3'>
          <img
            className='w-full h-full object-cover transition-transform duration-500 hover:scale-105'
            src={imageUrl}
            alt={title}
          />
        </div>
      )}
      <div className='py-2'>
        <h2 className={textClasses.heading}>{title}</h2>
        <p className={`${textClasses.body} ${textClasses.secondary}`}>
          {description}
        </p>
      </div>
      {tags && tags.length > 0 && (
        <div className='flex flex-wrap mt-2'>
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
  );
};

export default Card;
