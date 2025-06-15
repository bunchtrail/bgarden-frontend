import React from 'react';
import Card from '../../../../modules/ui/components/Card';
import { Specimen } from '../../types';
import { specimenDisplayStyles } from '../../styles';
import InfoField from './InfoField';
import { useAuth } from '../../../auth/hooks';

interface BasicInfoCardProps {
  specimen: Specimen;
}

/**
 * Компонент для отображения основной информации о образце
 */
const BasicInfoCard: React.FC<BasicInfoCardProps> = ({ specimen }) => {
  const { isAuthenticated } = useAuth();

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
          
          {isAuthenticated && (
            <>
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
            </>
          )}

          {!isAuthenticated && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700">
                <span className="font-medium">💡 Больше информации:</span> Авторизуйтесь для просмотра полной информации об образце, включая детальное описание, географические данные и дополнительные характеристики.
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default BasicInfoCard; 