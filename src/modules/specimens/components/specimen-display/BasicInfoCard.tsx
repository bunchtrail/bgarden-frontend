import React from 'react';
import Card from '../../../../modules/ui/components/Card';
import { Specimen } from '../../types';
import { specimenDisplayStyles } from '../../styles';
import InfoField from './InfoField';

interface BasicInfoCardProps {
  specimen: Specimen;
}

/**
 * Компонент для отображения основной информации о образце
 */
const BasicInfoCard: React.FC<BasicInfoCardProps> = ({ specimen }) => {
  return (
    <Card className={specimenDisplayStyles.card.container}>
      <div className={specimenDisplayStyles.card.header}>
        <h2 className={specimenDisplayStyles.card.title}>Основная информация</h2>
      </div>
      <div className={specimenDisplayStyles.card.content}>
        <div className={specimenDisplayStyles.infoField.section}>
          <InfoField 
            label="Инвентарный номер" 
            value={specimen.inventoryNumber}
            type="highlight"
          />
          
          <InfoField 
            label="Русское название" 
            value={specimen.russianName}
          />
          
          <InfoField 
            label="Латинское название" 
            value={specimen.latinName}
            type="highlight"
          />
          
          <InfoField 
            label="Семейство" 
            value={specimen.familyName}
          />
          
          <InfoField 
            label="Род" 
            value={specimen.genus}
          />
          
          <InfoField 
            label="Вид" 
            value={specimen.species}
          />
          
          <InfoField 
            label="Сорт" 
            value={specimen.cultivar}
          />
          
          <InfoField 
            label="Форма" 
            value={specimen.form}
          />
          
          <InfoField 
            label="Синонимы" 
            value={specimen.synonyms}
          />
          
          <InfoField 
            label="Определил" 
            value={specimen.determinedBy}
          />
        </div>
      </div>
    </Card>
  );
};

export default BasicInfoCard; 