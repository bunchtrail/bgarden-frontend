import React from 'react';
import Card from '../../../../modules/ui/components/Card';
import { Specimen } from '../../types';
import { cardClasses, textClasses, animationClasses } from '../../../../styles/global-styles';

interface AdditionalInfoCardProps {
  specimen: Specimen;
}

/**
 * Компонент для отображения дополнительной информации о образце
 */
const AdditionalInfoCard: React.FC<AdditionalInfoCardProps> = ({ specimen }) => {
  return (
    <Card className={`${cardClasses.elevated} ${animationClasses.transition} ${animationClasses.springHover}`}>
      <div className={cardClasses.header}>
        <h2 className={cardClasses.title}>Дополнительная информация</h2>
      </div>
      <div className={cardClasses.content}>
        <div className={`space-y-4`}>
          {specimen.conservationStatus && (
            <div className="border-b border-gray-100 pb-3">
              <div className={`${textClasses.small} ${textClasses.secondary}`}>Статус сохранения</div>
              <div className={`${textClasses.body} ${textClasses.primary} font-medium`}>{specimen.conservationStatus}</div>
            </div>
          )}
          
          {specimen.naturalRange && (
            <div className="border-b border-gray-100 pb-3">
              <div className={`${textClasses.small} ${textClasses.secondary}`}>Естественный ареал</div>
              <div className={`${textClasses.body} ${textClasses.primary} font-medium`}>{specimen.naturalRange}</div>
            </div>
          )}
          
          {specimen.ecologyAndBiology && (
            <div className="border-b border-gray-100 pb-3">
              <div className={`${textClasses.small} ${textClasses.secondary}`}>Экология и биология</div>
              <div className={`${textClasses.body} ${textClasses.primary} font-medium`}>{specimen.ecologyAndBiology}</div>
            </div>
          )}
          
          {specimen.economicUse && (
            <div className="border-b border-gray-100 pb-3">
              <div className={`${textClasses.small} ${textClasses.secondary}`}>Экономическое использование</div>
              <div className={`${textClasses.body} ${textClasses.primary} font-medium`}>{specimen.economicUse}</div>
            </div>
          )}
          
          {specimen.duplicatesInfo && (
            <div className="border-b border-gray-100 pb-3">
              <div className={`${textClasses.small} ${textClasses.secondary}`}>Информация о дубликатах</div>
              <div className={`${textClasses.body} ${textClasses.primary} font-medium`}>{specimen.duplicatesInfo}</div>
            </div>
          )}
          
          {specimen.illustration && (
            <div className="border-b border-gray-100 pb-3">
              <div className={`${textClasses.small} ${textClasses.secondary}`}>Иллюстрация</div>
              <div className={`${textClasses.body} ${textClasses.primary} font-medium`}>{specimen.illustration}</div>
            </div>
          )}
          
          {specimen.notes && (
            <div className="border-b border-gray-100 pb-3">
              <div className={`${textClasses.small} ${textClasses.secondary}`}>Примечания</div>
              <div className={`${textClasses.body} ${textClasses.primary} font-medium`}>{specimen.notes}</div>
            </div>
          )}
          
          {specimen.filledBy && (
            <div className="border-b border-gray-100 pb-3">
              <div className={`${textClasses.small} ${textClasses.secondary}`}>Заполнил</div>
              <div className={`${textClasses.body} ${textClasses.primary} font-medium`}>{specimen.filledBy}</div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default AdditionalInfoCard; 