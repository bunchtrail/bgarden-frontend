import React, { useEffect, useState } from 'react';
import {
  containerClasses,
  layoutClasses,
  textClasses,
} from '../../../styles/global-styles';
import { MapProvider } from '../contexts/MapContext';
import { getActiveMap, getMapImageUrl, MapData } from '../services/mapService';
import ControlPanel from './ControlPanel';
import MapActions from './MapActions';
import MapLegend from './MapLegend';
import { MapContainer } from './plant-map';

// Компонент индикатора загрузки
const LoadingIndicator: React.FC = () => (
  <div className='flex justify-center items-center p-4'>
    <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-green-700'></div>
    <span className='ml-2'>Загрузка карты...</span>
  </div>
);

// Страница с картой и режимами работы
const MapPage: React.FC = () => {
  const [mapData, setMapData] = useState<MapData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMapData = async () => {
      try {
        setIsLoading(true);
        const mapsData = await getActiveMap();
        // Берем первую карту из массива, если она есть
        if (mapsData && mapsData.length > 0) {
          setMapData(mapsData[0]);
        } else {
          setError('Активная карта не найдена');
        }
      } catch (err) {
        setError('Ошибка при загрузке карты');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMapData();
  }, []);

  // Получаем URL изображения с помощью функции-помощника
  const imageUrl = getMapImageUrl(mapData);

  return (
    <div className={containerClasses.base}>
      <h1 className={textClasses.heading}>Карта ботанического сада</h1>
      {error && <div className='text-red-500 mb-4'>{error}</div>}
      {mapData && (
        <div className='mb-3'>
          <h2 className={textClasses.subheading}>{mapData.name}</h2>
          {mapData.description && (
            <p className='text-gray-600'>{mapData.description}</p>
          )}
        </div>
      )}
      <MapProvider>
        <div className={layoutClasses.flexCol}>
          <ControlPanel />
          <div className={`${layoutClasses.flex} gap-4 mb-4`}>
            <div className='flex-1'>
              {isLoading && <LoadingIndicator />}
              <MapContainer loadingMap={isLoading} imageUrl={imageUrl} />
            </div>
            <div className='w-64'>
              <MapLegend />
              <div className='mt-4'>
                <MapActions />
              </div>
            </div>
          </div>
        </div>
      </MapProvider>
    </div>
  );
};

export default MapPage;
