import React from 'react';
import { Link } from 'react-router-dom';
import { SectorType } from '../modules/specimens/types';
import { buttonClasses, containerClasses, textClasses } from '../styles/global-styles';

interface SectorCardProps {
  id: SectorType;
  title: string;
  description: string;
  imageUrl: string;
}

const SectorCard: React.FC<SectorCardProps> = ({
  id,
  title,
  description,
  imageUrl,
}) => {
  return (
    <Link
      to={`/specimens?sector=${id}`}
      className='block w-full'
    >
      <div className={`${containerClasses.base} ${containerClasses.withHover} h-full flex flex-col`}>
        <div className='h-48 overflow-hidden rounded-t-lg -mt-4 -mx-4 sm:-mx-6 mb-3'>
          <img
            src={imageUrl}
            alt={title}
            className='w-full h-full object-cover transition-transform duration-500 hover:scale-110'
          />
        </div>
        <div className='p-2 flex-1 flex flex-col'>
          <h3 className={textClasses.heading}>{title}</h3>
          <p className={`${textClasses.body} ${textClasses.secondary} flex-1`}>{description}</p>
          <div className='mt-auto'>
            <span className={`${buttonClasses.base} ${buttonClasses.success} inline-block`}>
              Перейти к разделу
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default SectorCard;
