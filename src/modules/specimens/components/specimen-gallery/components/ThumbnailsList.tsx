import React from 'react';
import { SpecimenImage } from '../../../types';
import { thumbnailStyles } from '../../../styles';

interface ThumbnailsListProps {
  images: SpecimenImage[];
  currentIndex: number;
  onThumbnailClick: (index: number) => void;
  onSetMainImage?: (imageId: number) => void;
}

const ThumbnailsList: React.FC<ThumbnailsListProps> = ({ 
  images, 
  currentIndex, 
  onThumbnailClick,
  onSetMainImage
}) => {
  if (images.length <= 1) return null;
  
  const handleSetAsMain = (e: React.MouseEvent, imageId: number) => {
    e.stopPropagation(); // Остановка всплытия события, чтобы не выбрать миниатюру
    if (onSetMainImage) {
      onSetMainImage(imageId);
    }
  };
  
  return (
    <div className={thumbnailStyles.container}>
      {images.map((image, index) => (
        <div 
          key={image.id} 
          className={`${thumbnailStyles.thumbnailWrapper} ${
            currentIndex === index ? thumbnailStyles.activeThumbnail : ''
          } ${image.isMain ? thumbnailStyles.mainThumbnail : ''}`}
          onClick={() => onThumbnailClick(index)}
        >
          <img 
            src={image.imageUrl} 
            alt={`Миниатюра ${index + 1}`}
            className={thumbnailStyles.thumbnail}
          />
          
          {/* Наложение при наведении */}
          <div className={thumbnailStyles.thumbnailOverlay}></div>
          
          {/* Индикатор основного изображения */}
          {image.isMain && (
            <div className={thumbnailStyles.indicator} title="Основное изображение">
              <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
          )}
          
          {/* Кнопка для установки основного изображения */}
          {!image.isMain && onSetMainImage && (
            <div 
              className={thumbnailStyles.setMainButton}
              title="Сделать основным изображением"
              onClick={(e) => handleSetAsMain(e, image.id)}
            >
              <svg 
                className={thumbnailStyles.setMainButtonIcon} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
          )}
          
          {/* Номер изображения */}
          <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs rounded px-1 opacity-70">
            {index + 1}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ThumbnailsList; 