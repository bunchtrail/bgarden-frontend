import React from 'react';
import Card from '../../../../modules/ui/components/Card';
import { Specimen } from '../../types';
import { cardClasses, textClasses, animationClasses } from '../../../../styles/global-styles';

interface TimelineInfoCardProps {
  specimen: Specimen;
}

/**
 * Компонент для отображения информации о времени и развитии образца
 */
const TimelineInfoCard: React.FC<TimelineInfoCardProps> = ({ specimen }) => {
  return (
    <Card className={`${cardClasses.elevated} ${animationClasses.transition} ${animationClasses.springHover}`}>
      <div className={cardClasses.header}>
        <h2 className={cardClasses.title}>Время и развитие</h2>
      </div>
      <div className={cardClasses.content}>
        <div className="space-y-4">
          <div className="border-b border-gray-100 pb-3">
            <div className={`${textClasses.small} ${textClasses.secondary}`}>Год посадки</div>
            <div className={`${textClasses.body} ${textClasses.primary} font-medium`}>{specimen.plantingYear}</div>
          </div>
          
          {specimen.originalYear && (
            <div className="border-b border-gray-100 pb-3">
              <div className={`${textClasses.small} ${textClasses.secondary}`}>Год селекции</div>
              <div className={`${textClasses.body} ${textClasses.primary} font-medium`}>{specimen.originalYear}</div>
            </div>
          )}
          
          {specimen.originalBreeder && (
            <div className="border-b border-gray-100 pb-3">
              <div className={`${textClasses.small} ${textClasses.secondary}`}>Селекционер</div>
              <div className={`${textClasses.body} ${textClasses.primary} font-medium`}>{specimen.originalBreeder}</div>
            </div>
          )}
          
          <div className="border-b border-gray-100 pb-3">
            <div className={`${textClasses.small} ${textClasses.secondary}`}>Наличие гербария</div>
            <div className={`${textClasses.body} ${textClasses.primary} font-medium`}>
              {specimen.hasHerbarium ? 'Да' : 'Нет'}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TimelineInfoCard; 