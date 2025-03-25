import React, { useState, useEffect } from 'react';
import Card from '../../../../modules/ui/components/Card';
import { Specimen } from '../../types';
import { cardClasses, textClasses, animationClasses } from '../../../../styles/global-styles';
import { specimenService } from '../../services/specimenService';

interface SpecimenImageCardProps {
  specimen: Specimen;
}

/**
 * Компонент для отображения фотографии образца
 */
const SpecimenImageCard: React.FC<SpecimenImageCardProps> = ({ specimen }) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const placeholderImage = '/images/specimens/placeholder.jpg';
  
  useEffect(() => {
    const fetchSpecimenImage = async () => {
      try {
        setIsLoading(true);
        const imageData = await specimenService.getSpecimenMainImage(specimen.id);
        
        if (imageData && imageData.imageDataBase64) {
          setImageSrc(`data:${imageData.contentType};base64,${imageData.imageDataBase64}`);
        } else {
          setImageSrc(specimen.imageUrl || placeholderImage);
        }
      } catch (error) {
        console.error('Ошибка при загрузке изображения образца:', error);
        setImageSrc(specimen.imageUrl || placeholderImage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSpecimenImage();
  }, [specimen.id, specimen.imageUrl]);

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
                src={imageSrc || placeholderImage} 
                alt={`${specimen.russianName} (${specimen.latinName})`}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                onError={(e) => {
                  // Если изображение не загрузилось, используем заполнитель
                  const target = e.target as HTMLImageElement;
                  target.src = placeholderImage;
                }}
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