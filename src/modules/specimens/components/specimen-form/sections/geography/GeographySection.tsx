import React from 'react';
import { SpecimenFormData } from '../../../../types';
import { ExpositionDto } from '../../../../services/expositionService';
import { RegionData } from '@/modules/map/types/mapTypes';
import { cardClasses, textClasses } from '@/styles/global-styles';
// Импортируем компоненты и хуки
import { 
  RegionSelector, 
  ExpositionSelector, 
  CoordinatesInput, 
  LocationDescriptionInput,
  RegionMapSelector 
} from './components';
import { useRegionMarkerLogic } from './hooks';

// Расширяем интерфейс SpecimenFormData для дополнительных полей
interface ExtendedSpecimenFormData extends SpecimenFormData {
  locationDescription?: string;
}

interface GeographySectionProps {
  formData: ExtendedSpecimenFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  regions: RegionData[];
  expositions: ExpositionDto[];
}

export const GeographySection: React.FC<GeographySectionProps> = ({ 
  formData, 
  onChange, 
  regions, 
  expositions 
}) => {
  const {
    selectedRegionIds,
    markerPosition,
    handleRegionClick,
    handleCoordinatesChange,
    getRegionIdString
  } = useRegionMarkerLogic(formData, regions, onChange);

  // Подготовленное значение для select, проверяем что regionId не null и не undefined
  const regionIdValue = getRegionIdString(formData.regionId);

  return (
    <div className="grid grid-cols-1 gap-6">
      <div className={`border p-4 rounded-md ${cardClasses.elevated}`}>
        <h4 className={`font-medium text-lg mb-4 ${textClasses.heading}`}>Местоположение экземпляра</h4>
        
        <div className="space-y-4">
          <div className="map-selection-container mb-4">
            <RegionMapSelector 
              regions={regions}
              selectedRegionIds={selectedRegionIds}
              onRegionClick={handleRegionClick}
              onCoordinatesChange={handleCoordinatesChange}
              markerPosition={markerPosition}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Выбор участка */}
            <RegionSelector 
              regionId={regionIdValue}
              regions={regions}
              onChange={onChange}
              getRegionIdString={getRegionIdString}
            />

            {/* Выбор экспозиции */}
            <ExpositionSelector 
              expositionId={formData.expositionId}
              expositions={expositions}
              onChange={onChange}
            />
          </div>

          {/* Координаты */}
          <CoordinatesInput 
            mapX={formData.mapX}
            mapY={formData.mapY}
            onChange={onChange}
          />
          
          {/* Дополнительная информация о местоположении */}
          <LocationDescriptionInput 
            value={formData.locationDescription}
            onChange={onChange}
          />
        </div>
      </div>
    </div>
  );
}; 