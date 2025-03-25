import React from 'react';
import Card from '../../../../modules/ui/components/Card';
import { Specimen } from '../../types';
import { cardClasses, textClasses, animationClasses } from '../../../../styles/global-styles';

interface SpecimenImageCardProps {
  specimen: Specimen;
}

/**
 * Компонент для отображения фотографии образца
 */
const SpecimenImageCard: React.FC<SpecimenImageCardProps> = ({ specimen }) => {
  // Используем временный заполнитель изображения, пока нет API для изображений
  const placeholderImage = '/images/specimens/placeholder.jpg';
  
  // В будущем здесь будет логика получения изображения из API
  const imageSrc = specimen.imageUrl || placeholderImage;

  return (
    <Card className={`${cardClasses.elevated} ${animationClasses.transition} ${animationClasses.springHover}`}>
      <div className={cardClasses.header}>
        <h2 className={cardClasses.title}>Фотография растения</h2>
      </div>
      <div className={cardClasses.content}>
        <div className="flex flex-col items-center">
          <div className="w-full h-64 overflow-hidden rounded-lg mb-3">
            <img 
              src={imageSrc} 
              alt={`${specimen.russianName} (${specimen.latinName})`}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              onError={(e) => {
                // Если изображение не загрузилось, используем заполнитель
                const target = e.target as HTMLImageElement;
                target.src = placeholderImage;
              }}
            />
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