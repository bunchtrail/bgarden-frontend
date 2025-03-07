import React, { useEffect, useRef } from 'react';
import { headingClasses, specimenContainerClasses } from './styles';

interface SpecimenLocationMapProps {
  latitude: number;
  longitude: number;
  specimenName: string;
  inventoryNumber: string;
}

export const SpecimenLocationMap: React.FC<SpecimenLocationMapProps> = ({
  latitude,
  longitude,
  specimenName,
  inventoryNumber,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Здесь бы подключалась карта через Leaflet или Google Maps API
    // Для демонстрации используем статическую карту
    if (mapRef.current) {
      // Имитация подключения карты
      console.log(
        'Map initialized for specimen',
        inventoryNumber,
        'at',
        latitude,
        longitude
      );
    }
  }, [latitude, longitude, inventoryNumber]);

  // Проверка на валидные координаты
  const hasValidCoordinates = latitude !== 0 && longitude !== 0;

  return (
    <div className={`${specimenContainerClasses.card} p-4 mb-6`}>
      <div className='flex justify-between items-center mb-2'>
        <h3 className={headingClasses.heading}>Местоположение образца</h3>
        {hasValidCoordinates && (
          <a
            href={`https://www.google.com/maps?q=${latitude},${longitude}`}
            target='_blank'
            rel='noopener noreferrer'
            className='text-blue-600 hover:text-blue-800 text-sm'
          >
            Открыть в Google Maps
          </a>
        )}
      </div>

      {hasValidCoordinates ? (
        <>
          <div
            ref={mapRef}
            className='h-64 bg-gray-100 rounded-md mb-2 border border-gray-200'
            style={{
              backgroundImage: `url(https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=15&size=600x300&markers=color:red%7C${latitude},${longitude}&key=YOUR_API_KEY)`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {/* Здесь будет отображаться карта */}
          </div>
          <div className='grid grid-cols-2 gap-4 mt-2'>
            <div>
              <p className='text-sm text-gray-600'>Широта:</p>
              <p className='font-medium'>{latitude.toFixed(6)}</p>
            </div>
            <div>
              <p className='text-sm text-gray-600'>Долгота:</p>
              <p className='font-medium'>{longitude.toFixed(6)}</p>
            </div>
          </div>
        </>
      ) : (
        <div className='h-32 flex items-center justify-center bg-gray-100 rounded-md'>
          <p className='text-gray-500'>Координаты не указаны</p>
        </div>
      )}
    </div>
  );
};
