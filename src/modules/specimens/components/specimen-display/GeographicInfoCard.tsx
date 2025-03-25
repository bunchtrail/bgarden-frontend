import React from 'react';
import Card from '../../../../modules/ui/components/Card';
import { Specimen } from '../../types';
import { cardClasses, textClasses, animationClasses } from '../../../../styles/global-styles';

interface GeographicInfoCardProps {
  specimen: Specimen;
}

/**
 * Компонент для отображения географической информации о образце
 */
const GeographicInfoCard: React.FC<GeographicInfoCardProps> = ({ specimen }) => {
  return (
    <Card className={`${cardClasses.elevated} ${animationClasses.transition} ${animationClasses.springHover}`}>
      <div className={cardClasses.header}>
        <h2 className={cardClasses.title}>Географические данные</h2>
      </div>
      <div className={cardClasses.content}>
        <div className={`space-y-4`}>
          {specimen.regionName && (
            <div className="border-b border-gray-100 pb-3">
              <div className={`${textClasses.small} ${textClasses.secondary}`}>Регион</div>
              <div className={`${textClasses.body} ${textClasses.primary} font-medium`}>{specimen.regionName}</div>
            </div>
          )}
          
          <div className="border-b border-gray-100 pb-3">
            <div className={`${textClasses.small} ${textClasses.secondary}`}>Координаты</div>
            <div className={`${textClasses.body} ${textClasses.primary} font-medium`}>
              {`${specimen.latitude.toFixed(6)}, ${specimen.longitude.toFixed(6)}`}
            </div>
          </div>
          
          {specimen.locationWkt && (
            <div className="border-b border-gray-100 pb-3">
              <div className={`${textClasses.small} ${textClasses.secondary}`}>WKT-координаты</div>
              <div className={`${textClasses.body} ${textClasses.primary} font-medium`}>{specimen.locationWkt}</div>
            </div>
          )}
          
          <div className="border-b border-gray-100 pb-3">
            <div className={`${textClasses.small} ${textClasses.secondary}`}>Экспозиция</div>
            <div className={`${textClasses.body} ${textClasses.primary} font-medium`}>{specimen.expositionName}</div>
          </div>
          
          {specimen.sampleOrigin && (
            <div className="border-b border-gray-100 pb-3">
              <div className={`${textClasses.small} ${textClasses.secondary}`}>Происхождение образца</div>
              <div className={`${textClasses.body} ${textClasses.primary} font-medium`}>{specimen.sampleOrigin}</div>
            </div>
          )}
          
          {specimen.country && (
            <div className="border-b border-gray-100 pb-3">
              <div className={`${textClasses.small} ${textClasses.secondary}`}>Страна</div>
              <div className={`${textClasses.body} ${textClasses.primary} font-medium`}>{specimen.country}</div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default GeographicInfoCard; 