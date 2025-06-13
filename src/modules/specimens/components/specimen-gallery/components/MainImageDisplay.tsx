import React from 'react';
import { SpecimenImage } from '../../../types';
import { mainImageStyles } from '../../../styles';

interface MainImageDisplayProps {
  isLoading: boolean;
  images: SpecimenImage[];
  currentImageIndex: number;
  specimenName: string;
  latinName: string;
  onImageClick: (imageId: number) => void;
  onPrevClick: () => void;
  onNextClick: () => void;
  onImageError: () => void;
}

const MainImageDisplay: React.FC<MainImageDisplayProps> = ({
  isLoading,
  images,
  currentImageIndex,
  specimenName,
  latinName,
  onImageClick,
  onPrevClick,
  onNextClick,
  onImageError
}) => {
  const currentImage = images.length > 0 ? images[currentImageIndex] : null;
  const currentImageSrc = currentImage 
    ? currentImage.imageUrl
    : '/images/specimens/placeholder.jpg';

  if (isLoading) {
    return (
      <div className={mainImageStyles.loaderContainer}>
        <span className="text-gray-500">Загрузка изображений...</span>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className={mainImageStyles.placeholder}>
        <svg className="w-16 h-16 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
        </svg>
        <p className="mt-2 text-gray-600 font-medium text-sm">Изображения отсутствуют</p>
        <p className="text-xs text-gray-400 mt-1 max-w-xs text-center">Добавьте изображения растения</p>
      </div>
    );
  }

  return (
    <div className="relative h-full flex items-center justify-center">
      {currentImage && currentImage.isMain && (
        <div className={mainImageStyles.mainImageBadge}>
          <span className="flex items-center">
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            Основное фото
          </span>
        </div>
      )}
      
      <img 
        src={currentImageSrc} 
        alt={`${specimenName} (${latinName})`}
        className={mainImageStyles.image}
        onError={onImageError}
        onClick={() => currentImage && onImageClick(currentImage.id)}
      />
      
      {/* Полупрозрачное наложение при наведении */}
      <div className={mainImageStyles.overlay}></div>
      
      {/* Навигационные кнопки для переключения изображений */}
      {images.length > 1 && (
        <div className={mainImageStyles.navigationContainer}>
          <button 
            onClick={onPrevClick}
            className={mainImageStyles.navigationButton}
            aria-label="Предыдущее изображение"
          >
            <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>
          <button 
            onClick={onNextClick}
            className={mainImageStyles.navigationButton}
            aria-label="Следующее изображение"
          >
            <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default MainImageDisplay; 