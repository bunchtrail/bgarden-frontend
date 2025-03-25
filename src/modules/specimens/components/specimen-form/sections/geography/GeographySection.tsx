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
import Switch from '@/modules/ui/components/Form/Switch';

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
    getRegionIdString,
    showTooltips,
    toggleTooltips
  } = useRegionMarkerLogic(formData, regions, onChange);

  // Подготовленное значение для select, проверяем что regionId не null и не undefined
  const regionIdValue = getRegionIdString(formData.regionId);

  return (
    <div className="grid grid-cols-1 gap-6">
      <div className={`border p-4 rounded-md ${cardClasses.elevated}`}>
        <h4 className={`font-medium text-lg mb-4 ${textClasses.heading}`}>Местоположение экземпляра</h4>
        
        <div className="space-y-4">
          <div className="flex justify-end mb-2">
            <Switch 
              label="Показывать информацию при наведении" 
              checked={showTooltips} 
              onChange={toggleTooltips}
              className="text-sm"
            />
          </div>
          
          <div className="map-selection-container mb-4">
            <RegionMapSelector 
              regions={regions}
              selectedRegionIds={selectedRegionIds}
              onRegionClick={handleRegionClick}
              onCoordinatesChange={handleCoordinatesChange}
              markerPosition={markerPosition}
              showTooltips={showTooltips}
            />
            <small className="block mt-1 text-gray-500">
              Текущие координаты на карте: X:{formData.mapX || '-'}, Y:{formData.mapY || '-'}
            </small>
            <div className="bg-blue-50 p-3 rounded mt-2 text-xs text-blue-700 border border-blue-200">
              <p className="font-medium mb-2">Инструкция по размещению маркера:</p>
              <ul className="list-disc pl-4 space-y-1.5">
                <li className="font-medium">Чтобы установить маркер, просто кликните в <strong>любое место</strong> на карте</li>
                <li>Сначала выберите область через клик на карте или через выпадающий список</li>
                <li>Затем кликните внутрь выбранной области для установки точного местоположения</li>
                <li>Вы можете перетаскивать уже установленный маркер для уточнения позиции</li>
                <li className="text-red-600">Важно: если клик внутри области не срабатывает, попробуйте кликнуть еще раз или по краю области</li>
              </ul>
            </div>
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