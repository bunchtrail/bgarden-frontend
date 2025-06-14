import React from 'react';
import { SpecimenFormData, LocationType } from '../../../../types';
import { ExpositionDto } from '../../../../services/expositionService';
import { RegionData } from '@/modules/map/types/mapTypes';
import { animationClasses } from '@/styles/global-styles';
// Импортируем компоненты и хуки
import { 
  RegionSelector, 
  ExpositionSelector, 
  LocationDescriptionInput,
  RegionMapSelector,
  CoordinatesInput 
} from './components';
import { useRegionMarkerLogic } from './hooks';
import Switch from '@/modules/ui/components/Form/Switch';
import { MAP_TYPES } from '@/modules/map/contexts/MapConfigContext';

// Расширяем интерфейс SpecimenFormData для дополнительных полей
interface ExtendedSpecimenFormData extends SpecimenFormData {
  locationDescription?: string;
  locationType?: number;
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

  // Обработчик изменения типа локации
  const handleLocationTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e);
  };

  return (
    <div className={`${animationClasses.fadeIn} space-y-8`}>
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-3">География и местоположение</h2>
        <p className="text-gray-600">
          Укажите точное местоположение образца на карте ботанического сада и выберите экспозицию.
        </p>
      </div>
      
      {/* Переключатель подсказок */}
      <div className="flex justify-end">
        <Switch 
          label="Показывать информацию при наведении" 
          checked={showTooltips} 
          onChange={toggleTooltips}
          className="text-sm"
        />
      </div>
      
      {/* Карта для выбора региона */}
      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
        <div className="p-6 bg-gray-50 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Выбор на карте</h3>
          <p className="text-sm text-gray-600">Кликните на карте, чтобы выбрать регион</p>
        </div>
        <div className="p-6">
          <RegionMapSelector 
            regions={regions}
            selectedRegionIds={selectedRegionIds}
            onRegionClick={handleRegionClick}
            onCoordinatesChange={handleCoordinatesChange}
            markerPosition={markerPosition}
            showTooltips={showTooltips}
            initialMapType={formData.locationType === LocationType.Geographic ? MAP_TYPES.GEO : MAP_TYPES.SCHEMATIC}
          />
        </div>
      </div>
      
      {/* Координаты */}
      <div className="bg-white border border-gray-100 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Координаты</h3>
        <CoordinatesInput 
          latitude={formData.latitude}
          longitude={formData.longitude}
          mapX={formData.mapX}
          mapY={formData.mapY}
          locationType={formData.locationType || LocationType.None}
          onTypeChange={handleLocationTypeChange}
          onChange={onChange}
        />
      </div>
      
      {/* Выбор региона и экспозиции */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-100 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Регион *</h3>
          <RegionSelector 
            regionId={regionIdValue}
            regions={regions}
            onChange={onChange}
            getRegionIdString={getRegionIdString}
          />
        </div>
        
        <div className="bg-white border border-gray-100 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Экспозиция</h3>
          <ExpositionSelector 
            expositionId={formData.expositionId}
            expositions={expositions}
            onChange={onChange}
          />
        </div>
      </div>

      {/* Дополнительная информация о местоположении */}
      <div className="bg-white border border-gray-100 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Описание местоположения</h3>
        <LocationDescriptionInput 
          value={formData.locationDescription}
          onChange={onChange}
        />
      </div>
      
      <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <svg className="w-5 h-5 text-amber-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-amber-900 mb-1">Местоположение</h4>
            <p className="text-sm text-amber-800">
              Обязательно укажите регион, где расположен образец. Точные координаты помогут в дальнейшем мониторинге растения.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}; 