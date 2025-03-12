import L, { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import React, { useCallback, useState } from 'react';
import {
  ImageOverlay,
  MapContainer as LeafletMapContainer,
  Marker,
  Popup,
  useMapEvents,
  ZoomControl,
} from 'react-leaflet';
import { gridContainerClasses } from '../styles';
import { NumberField, SelectField, TextField } from './FormFields';
import { GeographicInfoSectionProps } from './types';

// Определяем интерфейс для растения на карте
interface PlantMarker {
  id: string;
  name: string;
  position: [number, number];
  description?: string;
}

// Определяем интерфейс свойств компонента SimpleMap
interface SimpleMapProps {
  imageUrl: string | null;
  readOnly?: boolean;
  onPositionSelect?: (position: [number, number]) => void;
  plants?: PlantMarker[];
}

// Простая карта без зависимости от MapContext
const SimpleMap: React.FC<SimpleMapProps> = ({
  imageUrl,
  readOnly = false,
  onPositionSelect,
  plants = [],
}) => {
  const [selectedPosition, setSelectedPosition] = useState<
    [number, number] | null
  >(null);

  // Создаем кастомную иконку для маркера
  const plantIcon = new Icon({
    iconUrl:
      'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEyLDJhMTAsMTAgMCAwLDAgMCwyMGExMCwxMCAwIDAsMCAwLC0yMHoiIGZpbGw9IiMwMDgwMDAiIC8+PC9zdmc+',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });

  // Иконка для выбранной позиции
  const selectedPositionIcon = new L.Icon({
    iconUrl:
      'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTIiIGZpbGw9IiM0MmI3MmEiIHN0cm9rZT0iIzAwMDAwMCIgc3Ryb2tlLXdpZHRoPSIyIiAvPjwvc3ZnPg==',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });

  // Обработчик событий карты
  const MapEvents = () => {
    useMapEvents({
      click: (e) => {
        if (!readOnly) {
          const position: [number, number] = [e.latlng.lat, e.latlng.lng];
          setSelectedPosition(position);
          if (onPositionSelect) {
            onPositionSelect(position);
          }
        }
      },
    });
    return null;
  };

  // Размеры карты
  const imageDimensions = { width: 1000, height: 1000 };
  const bounds = L.latLngBounds(
    [0, 0],
    [imageDimensions.height, imageDimensions.width]
  );

  return (
    <div className='w-full h-full relative'>
      {!readOnly && (
        <div className='absolute top-2 left-2 z-10 bg-white/80 rounded p-2 shadow-md text-sm'>
          <span className='font-medium'>
            Кликните на карте для выбора позиции растения
          </span>
        </div>
      )}
      <div className='w-full h-full cursor-crosshair'>
        {imageUrl ? (
          <LeafletMapContainer
            center={[imageDimensions.height / 2, imageDimensions.width / 2]}
            zoom={0}
            minZoom={-1}
            maxZoom={3}
            crs={L.CRS.Simple}
            style={{ height: '100%', width: '100%' }}
            zoomControl={false}
          >
            <ZoomControl position='bottomright' />
            <ImageOverlay bounds={bounds} url={imageUrl} />

            <MapEvents />

            {/* Маркеры растений */}
            {plants.map((plant) => (
              <Marker key={plant.id} position={plant.position} icon={plantIcon}>
                <Popup>
                  <div>
                    <h3 className='font-bold'>{plant.name}</h3>
                    {plant.description && <p>{plant.description}</p>}
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* Маркер выбранной позиции */}
            {selectedPosition && (
              <Marker position={selectedPosition} icon={selectedPositionIcon} />
            )}
          </LeafletMapContainer>
        ) : (
          <div className='w-full h-full flex items-center justify-center bg-gray-100 border border-dashed border-gray-300'>
            <p className='text-gray-500'>Карта не загружена</p>
          </div>
        )}
      </div>
    </div>
  );
};

export const GeographicInfoSection: React.FC<GeographicInfoSectionProps> = ({
  formData,
  errors,
  touchedFields,
  formSubmitted,
  markFieldAsTouched,
  validateField,
  regionOptions,
  handleChange,
  handleSelectChange,
  handleNumberChange,
  mapImageUrl,
  onPositionSelected,
}) => {
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

  // Обработчик выбора позиции на карте
  const handlePositionSelect = useCallback(
    (position: [number, number]) => {
      if (onPositionSelected) {
        onPositionSelected(position[0], position[1]);
      }
    },
    [onPositionSelected]
  );

  return (
    <div className='space-y-6'>
      {/* Компонент карты - перемещен в верхнюю часть */}
      <div className='mb-6 h-96 border rounded-lg overflow-hidden'>
        <SimpleMap
          imageUrl={mapImageUrl || null}
          readOnly={false}
          onPositionSelect={handlePositionSelect}
          plants={
            formData.latitude && formData.longitude
              ? [
                  {
                    id: 'current',
                    name: formData.russianName || 'Текущее растение',
                    position: [formData.latitude, formData.longitude],
                    description: formData.naturalRange,
                  },
                ]
              : []
          }
        />
      </div>

      {/* Основные поля */}
      <div className='space-y-4'>
        <div className={gridContainerClasses.responsive}>
          <NumberField
            label='Широта'
            name='latitude'
            formData={formData}
            errors={errors}
            touchedFields={touchedFields}
            formSubmitted={formSubmitted}
            markFieldAsTouched={markFieldAsTouched}
            handleNumberChange={handleNumberChange}
          />
          <NumberField
            label='Долгота'
            name='longitude'
            formData={formData}
            errors={errors}
            touchedFields={touchedFields}
            formSubmitted={formSubmitted}
            markFieldAsTouched={markFieldAsTouched}
            handleNumberChange={handleNumberChange}
          />
        </div>

        <SelectField
          label='Регион происхождения'
          name='regionId'
          options={regionOptions}
          formData={formData}
          errors={errors}
          touchedFields={touchedFields}
          formSubmitted={formSubmitted}
          markFieldAsTouched={markFieldAsTouched}
          handleSelectChange={handleSelectChange}
        />

        <TextField
          label='Страна происхождения'
          name='country'
          formData={formData}
          errors={errors}
          touchedFields={touchedFields}
          formSubmitted={formSubmitted}
          markFieldAsTouched={markFieldAsTouched}
          handleChange={handleChange}
        />
      </div>

      {/* Дополнительные поля */}
      <div className='mt-4 border-t border-gray-200 pt-4'>
        <button
          type='button'
          onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
          className='flex items-center text-blue-600 hover:text-blue-800 mb-4'
        >
          <svg
            className={`w-5 h-5 mr-1 transition-transform ${
              showAdvancedOptions ? 'rotate-90' : ''
            }`}
            fill='currentColor'
            viewBox='0 0 20 20'
          >
            <path
              fillRule='evenodd'
              d='M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z'
              clipRule='evenodd'
            />
          </svg>
          {showAdvancedOptions
            ? 'Скрыть дополнительные поля'
            : 'Показать дополнительные поля'}
        </button>

        {showAdvancedOptions && (
          <div className='space-y-4 animate-fadeIn'>
            <TextField
              label='Естественный ареал'
              name='naturalRange'
              multiline
              rows={3}
              formData={formData}
              errors={errors}
              touchedFields={touchedFields}
              formSubmitted={formSubmitted}
              markFieldAsTouched={markFieldAsTouched}
              handleChange={handleChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};
