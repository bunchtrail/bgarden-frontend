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