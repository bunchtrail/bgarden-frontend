import React from 'react';
import Card from '../../../../modules/ui/components/Card';
import { Specimen, LocationType } from '../../types';
import { specimenDisplayStyles } from '../../styles';
import InfoField from './InfoField';

interface GeographicInfoCardProps {
  specimen: Specimen;
}

/**
 * Компонент для отображения географической информации о образце
 */
const GeographicInfoCard: React.FC<GeographicInfoCardProps> = ({ specimen }) => {
  const getCoordinatesDisplay = () => {
    if (specimen.locationType === LocationType.Geographic && 
        specimen.latitude !== null && specimen.longitude !== null) {
      return {
        label: 'Географические координаты',
        value: `${specimen.latitude.toFixed(6)}, ${specimen.longitude.toFixed(6)}`,
        type: 'coordinates' as const,
        coordinateType: 'geographic' as const
      };
    } else if (specimen.locationType === LocationType.SchematicMap && 
               specimen.mapX !== null && specimen.mapY !== null) {
      return {
        label: 'Координаты на схеме',
        value: `X: ${specimen.mapX}, Y: ${specimen.mapY}`,
        type: 'coordinates' as const,
        coordinateType: 'schematic' as const
      };
    }
    return null;
  };

  const coordinates = getCoordinatesDisplay();

  return (
    <Card className={specimenDisplayStyles.card.container}>
      <div className={specimenDisplayStyles.card.header}>
        <h2 className={specimenDisplayStyles.card.title}>Географические данные</h2>
      </div>
      <div className={specimenDisplayStyles.card.content}>
        <div className={specimenDisplayStyles.infoField.section}>
          <InfoField 
            label="Регион" 
            value={specimen.regionName}
          />
          
          {coordinates && (
            <InfoField 
              label={coordinates.label}
              value={coordinates.value}
              type={coordinates.type}
              coordinateType={coordinates.coordinateType}
            />
          )}
          
          <InfoField 
            label="WKT-координаты" 
            value={specimen.locationWkt}
            type="coordinates"
          />
          
          <InfoField 
            label="Экспозиция" 
            value={specimen.expositionName}
            type="highlight"
          />
          
          <InfoField 
            label="Происхождение образца" 
            value={specimen.sampleOrigin}
          />
          
          <InfoField 
            label="Страна" 
            value={specimen.country}
          />
        </div>
      </div>
    </Card>
  );
};

export default GeographicInfoCard; 