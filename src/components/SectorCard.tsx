import React from 'react';
import { Link } from 'react-router-dom';
import { SectorType } from '../modules/specimens/types';
import { appStyles } from '../styles/global-styles';

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
      className='block w-full h-full'
    >
      <div className={appStyles.card.sectorCard}>
        <div className={appStyles.card.sectorImage}>
          <img
            src={imageUrl}
            alt={title}
            className={appStyles.card.sectorImageInner}
          />
        </div>
        <div className={appStyles.card.sectorContent}>
          <h3 className={appStyles.card.sectorTitle}>{title}</h3>
          <p className={appStyles.card.sectorDescription}>{description}</p>
          <div className='flex items-center justify-center'>
            <span className={appStyles.card.sectorButton}>
              <svg
                className='w-3 h-3 mr-1'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9 5l7 7-7 7'
                />
              </svg>
              Перейти к разделу
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default SectorCard;
