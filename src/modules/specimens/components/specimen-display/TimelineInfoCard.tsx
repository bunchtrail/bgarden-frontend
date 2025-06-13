import React from 'react';
import Card from '../../../../modules/ui/components/Card';
import { Specimen } from '../../types';
import { specimenDisplayStyles } from '../../styles';
import InfoField from './InfoField';

interface TimelineInfoCardProps {
  specimen: Specimen;
}

/**
 * Компонент для отображения информации о времени и развитии образца
 */
const TimelineInfoCard: React.FC<TimelineInfoCardProps> = ({ specimen }) => {
  return (
    <Card className={specimenDisplayStyles.card.container}>
      <div className={specimenDisplayStyles.card.header}>
        <h2 className={specimenDisplayStyles.card.title}>Время и развитие</h2>
      </div>
      <div className={specimenDisplayStyles.card.content}>
        <div className={specimenDisplayStyles.infoField.section}>
          <InfoField 
            label="Год посадки" 
            value={specimen.plantingYear}
            type="highlight"
          />
          
          <InfoField 
            label="Год селекции" 
            value={specimen.originalYear}
          />
          
          <InfoField 
            label="Селекционер" 
            value={specimen.originalBreeder}
          />
          
          <InfoField 
            label="Наличие гербария" 
            value={specimen.hasHerbarium}
            type="boolean"
          />
        </div>
      </div>
    </Card>
  );
};

export default TimelineInfoCard; 