import React, { useState, useEffect } from 'react';
import { SpecimenFormData } from '../../../../types';
import { ExpositionDto } from '../../../../services/expositionService';
import { RegionData } from '@/modules/map/types/mapTypes';
import LightMapView from '@/modules/map/components/LightMapView';
import { MapData } from '@/modules/map/services/mapService';
import { getActiveMap } from '@/modules/map/services/mapService';
import { ControlPanelSection } from '@/modules/map/components/control-panel';

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

// Отдельный компонент карты для правильной работы с контекстами
const RegionMapSelector: React.FC<{
  regions: RegionData[];
  selectedRegionIds: string[];
  onRegionClick: (regionId: string) => void;
  onCoordinatesChange?: (lat: number, lng: number) => void;
}> = ({ regions, selectedRegionIds, onRegionClick, onCoordinatesChange }) => {
  const [mapData, setMapData] = useState<MapData | null>(null);
  const [loading, setLoading] = useState(true);

  // Загружаем данные карты без использования useMapData
  useEffect(() => {
    const fetchMap = async () => {
      try {
        setLoading(true);
        const maps = await getActiveMap();
        setMapData(maps && maps.length > 0 ? maps[0] : null);
      } catch (error) {
        console.error('Ошибка при загрузке карты:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMap();
  }, []);

  return (
    <div className="relative">
      <LightMapView 
        mapData={mapData}
        regions={regions}
        selectedRegionIds={selectedRegionIds}
        onRegionClick={onRegionClick}
        loading={loading}
        aspectRatio="landscape"
        showControls={true}
        controlPanelMode="geography"
      />
    </div>
  );
};

export const GeographySection: React.FC<GeographySectionProps> = ({ 
  formData, 
  onChange, 
  regions, 
  expositions 
}) => {
  const [selectedRegionIds, setSelectedRegionIds] = useState<string[]>([]);

  // Обновляем выбранный регион при изменении formData.regionId
  useEffect(() => {
    if (formData.regionId && formData.regionId !== null) {
      setSelectedRegionIds([formData.regionId.toString()]);
    } else {
      setSelectedRegionIds([]);
    }
  }, [formData.regionId]);

  // Обработчик клика по региону на карте
  const handleRegionClick = (regionId: string) => {
    const numericId = parseInt(regionId.replace('region-', ''), 10);
    if (!isNaN(numericId)) {
      // Создаем объект, имитирующий изменение в select
      const mockEvent = {
        target: {
          name: 'regionId',
          value: numericId.toString()
        }
      };
      
      // Приводим к нужному типу через unknown
      onChange(mockEvent as unknown as React.ChangeEvent<HTMLSelectElement>);
    }
  };

  // Обработчик изменения координат
  const handleCoordinatesChange = (lat: number, lng: number) => {
    // Обновляем поля широты и долготы
    onChange({
      target: { name: 'latitude', value: lat.toString() }
    } as unknown as React.ChangeEvent<HTMLInputElement>);
    
    onChange({
      target: { name: 'longitude', value: lng.toString() }
    } as unknown as React.ChangeEvent<HTMLInputElement>);
  };

  // Безопасно получаем строковое представление regionId
  const getRegionIdString = (id: number | null | undefined): string => {
    if (id === null || id === undefined) return '';
    return id.toString();
  };

  // Находим выбранный регион (если есть)
  const selectedRegion = formData.regionId && formData.regionId !== null
    ? regions.find(r => r.id.toString() === getRegionIdString(formData.regionId)) 
    : null;

  // Подготовленное значение для select, проверяем что regionId не null и не undefined
  const regionIdValue = getRegionIdString(formData.regionId);

  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="border p-4 rounded-md bg-white shadow-sm">
        <h4 className="font-medium text-lg mb-4">Местоположение экземпляра</h4>
        
        {/* Выбор сектора - комбинация карты и выпадающего списка */}
        <div className="space-y-4">
          <div className="map-selection-container mb-4">
            <RegionMapSelector 
              regions={regions}
              selectedRegionIds={selectedRegionIds}
              onRegionClick={handleRegionClick}
              onCoordinatesChange={handleCoordinatesChange}
            />
            <small className="block mt-2 text-gray-500">
              Выберите участок сада, нажав на него на карте
            </small>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Выбор участка */}
            <div>
              <label htmlFor="regionId" className="block text-sm font-medium text-gray-700 mb-1">
                Участок
              </label>
              <select
                id="regionId"
                name="regionId"
                value={regionIdValue}
                onChange={onChange}
                className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                required
              >
                <option value="">Выберите участок</option>
                {regions.map(region => (
                  <option key={region.id} value={region.id}>
                    {region.name || `Участок #${region.id}`}
                  </option>
                ))}
              </select>
            </div>

            {/* Выбор экспозиции */}
            <div>
              <label htmlFor="expositionId" className="block text-sm font-medium text-gray-700 mb-1">
                Экспозиция
              </label>
              <select
                id="expositionId"
                name="expositionId"
                value={formData.expositionId || ''}
                onChange={onChange}
                className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              >
                <option value="">Выберите экспозицию</option>
                {expositions.map(exposition => (
                  <option key={exposition.id} value={exposition.id}>
                    {exposition.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Координаты */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label htmlFor="latitude" className="block text-sm font-medium text-gray-700 mb-1">
                Широта
              </label>
              <input
                type="text"
                name="latitude"
                id="latitude"
                value={formData.latitude || ''}
                onChange={onChange}
                placeholder="Например: 55.751244"
                className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="longitude" className="block text-sm font-medium text-gray-700 mb-1">
                Долгота
              </label>
              <input
                type="text"
                name="longitude"
                id="longitude"
                value={formData.longitude || ''}
                onChange={onChange}
                placeholder="Например: 37.618423"
                className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              />
            </div>
          </div>
          
          {/* Дополнительная информация о местоположении */}
          <div className="mt-4">
            <label htmlFor="locationDescription" className="block text-sm font-medium text-gray-700 mb-1">
              Описание местоположения
            </label>
            <textarea
              id="locationDescription"
              name="locationDescription"
              rows={3}
              value={formData.locationDescription || ''}
              onChange={onChange}
              placeholder="Дополнительное описание местоположения..."
              className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
}; 