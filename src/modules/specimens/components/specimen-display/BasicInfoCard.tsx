import React from 'react';
import Card from '../../../../modules/ui/components/Card';
import { Specimen } from '../../types';
import { cardClasses, textClasses, animationClasses } from '../../../../styles/global-styles';

interface BasicInfoCardProps {
  specimen: Specimen;
}

/**
 * Компонент для отображения основной информации о образце
 */
const BasicInfoCard: React.FC<BasicInfoCardProps> = ({ specimen }) => {
  return (
    <Card className={`${cardClasses.elevated} ${animationClasses.transition} ${animationClasses.springHover}`}>
      <div className={cardClasses.header}>
        <h2 className={cardClasses.title}>Основная информация</h2>
      </div>
      <div className={cardClasses.content}>
        <div className={`space-y-4`}>
          <div className="border-b border-gray-100 pb-3">
            <div className={`${textClasses.small} ${textClasses.secondary}`}>Инвентарный номер</div>
            <div className={`${textClasses.body} ${textClasses.primary} font-medium`}>{specimen.inventoryNumber}</div>
          </div>
          
          <div className="border-b border-gray-100 pb-3">
            <div className={`${textClasses.small} ${textClasses.secondary}`}>Русское название</div>
            <div className={`${textClasses.body} ${textClasses.primary} font-medium`}>{specimen.russianName}</div>
          </div>
          
          <div className="border-b border-gray-100 pb-3">
            <div className={`${textClasses.small} ${textClasses.secondary}`}>Латинское название</div>
            <div className={`${textClasses.body} ${textClasses.primary} font-medium`}>{specimen.latinName}</div>
          </div>
          
          <div className="border-b border-gray-100 pb-3">
            <div className={`${textClasses.small} ${textClasses.secondary}`}>Семейство</div>
            <div className={`${textClasses.body} ${textClasses.primary} font-medium`}>{specimen.familyName}</div>
          </div>
          
          <div className="border-b border-gray-100 pb-3">
            <div className={`${textClasses.small} ${textClasses.secondary}`}>Род</div>
            <div className={`${textClasses.body} ${textClasses.primary} font-medium`}>{specimen.genus}</div>
          </div>
          
          <div className="border-b border-gray-100 pb-3">
            <div className={`${textClasses.small} ${textClasses.secondary}`}>Вид</div>
            <div className={`${textClasses.body} ${textClasses.primary} font-medium`}>{specimen.species}</div>
          </div>
          
          {specimen.cultivar && (
            <div className="border-b border-gray-100 pb-3">
              <div className={`${textClasses.small} ${textClasses.secondary}`}>Сорт</div>
              <div className={`${textClasses.body} ${textClasses.primary} font-medium`}>{specimen.cultivar}</div>
            </div>
          )}
          
          {specimen.form && (
            <div className="border-b border-gray-100 pb-3">
              <div className={`${textClasses.small} ${textClasses.secondary}`}>Форма</div>
              <div className={`${textClasses.body} ${textClasses.primary} font-medium`}>{specimen.form}</div>
            </div>
          )}
          
          {specimen.synonyms && (
            <div className="border-b border-gray-100 pb-3">
              <div className={`${textClasses.small} ${textClasses.secondary}`}>Синонимы</div>
              <div className={`${textClasses.body} ${textClasses.primary} font-medium`}>{specimen.synonyms}</div>
            </div>
          )}
          
          {specimen.determinedBy && (
            <div className="border-b border-gray-100 pb-3">
              <div className={`${textClasses.small} ${textClasses.secondary}`}>Определил</div>
              <div className={`${textClasses.body} ${textClasses.primary} font-medium`}>{specimen.determinedBy}</div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default BasicInfoCard; 