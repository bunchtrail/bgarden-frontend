import React from 'react';
import Card from '../../../../modules/ui/components/Card';
import { Specimen } from '../../types';
import { specimenDisplayStyles } from '../../styles';
import InfoField from './InfoField';

interface AdditionalInfoCardProps {
  specimen: Specimen;
}

/**
 * Компонент для отображения дополнительной информации о образце
 */
const AdditionalInfoCard: React.FC<AdditionalInfoCardProps> = ({ specimen }) => {
  return (
    <Card className={specimenDisplayStyles.card.container}>
      <div className={specimenDisplayStyles.card.header}>
        <h2 className={specimenDisplayStyles.card.title}>Дополнительная информация</h2>
      </div>
      <div className={specimenDisplayStyles.card.content}>
        <div className={specimenDisplayStyles.infoField.section}>
          <InfoField 
            label="Статус сохранения" 
            value={specimen.conservationStatus}
            type="highlight"
          />
          
          <InfoField 
            label="Естественный ареал" 
            value={specimen.naturalRange}
          />
          
          <InfoField 
            label="Экология и биология" 
            value={specimen.ecologyAndBiology}
          />
          
          <InfoField 
            label="Экономическое использование" 
            value={specimen.economicUse}
          />
          
          <InfoField 
            label="Информация о дубликатах" 
            value={specimen.duplicatesInfo}
          />
          
          <InfoField 
            label="Иллюстрация" 
            value={specimen.illustration}
          />
          
          <InfoField 
            label="Примечания" 
            value={specimen.notes}
          />
          
          <InfoField 
            label="Заполнил" 
            value={specimen.filledBy}
          />
        </div>
      </div>
    </Card>
  );
};

export default AdditionalInfoCard; 