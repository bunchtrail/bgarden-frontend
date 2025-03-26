import React from 'react';
import Card from '../../../../modules/ui/components/Card';
import { Specimen } from '../../types';
import { cardClasses, textClasses, animationClasses } from '../../../../styles/global-styles';
import { useSpecimenImage } from '../../hooks';

interface SpecimenImageCardProps {
  specimen: Specimen;
}

/**
 * Компонент для отображения фотографии образца
 */
const SpecimenImageCard: React.FC<SpecimenImageCardProps> = ({ specimen }) => {
  // Используем новый хук вместо дублирования логики
  const { imageSrc, isLoading, handleImageError } = useSpecimenImage(
    specimen.id,
    specimen.imageUrl
  );
  
  return (
    <Card className={`${cardClasses.elevated} ${animationClasses.transition} ${animationClasses.springHover}`}>
      <div className={cardClasses.header}>
        <h2 className={cardClasses.title}>Фотография растения</h2>
      </div>
      <div className={cardClasses.content}>
        <div className="flex flex-col items-center">
          <div className="w-full h-64 overflow-hidden rounded-lg mb-3">
            {isLoading ? (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <span className="text-gray-500">Загрузка изображения...</span>
              </div>
            ) : imageSrc === '/images/specimens/placeholder.jpg' ? (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 border-2 border-dashed border-gray-200">
                <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <p className="mt-2 text-gray-500 font-medium">Изображение отсутствует</p>
                <p className="text-xs text-gray-400 mt-1">Добавьте изображение растения в режиме редактирования</p>
              </div>
            ) : (
              <img 
                src={imageSrc || ''} 
                alt={`${specimen.russianName} (${specimen.latinName})`}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                onError={() => handleImageError()}
              />
            )}
          </div>
          <div className="text-center mt-2 w-full">
            <p className={`${textClasses.small} ${textClasses.secondary}`}>
              {specimen.russianName}
            </p>
            <p className={`${textClasses.small} italic ${textClasses.secondary}`}>
              {specimen.latinName}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default SpecimenImageCard; 