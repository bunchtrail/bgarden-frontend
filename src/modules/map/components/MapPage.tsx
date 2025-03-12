import React, { useEffect, useState } from 'react';
import {
  cardClasses,
  layoutClasses,
  textClasses,
} from '../../../styles/global-styles';
import { MapProvider } from '../contexts/MapContext';
import { getActiveMap, getMapImageUrl, MapData } from '../services/mapService';
import MapControlPanel from './MapControlPanel';
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
    <div className='max-w-screen-2xl mx-auto'>
      {/* Заголовок и информация о карте */}
      <div className='bg-white p-5 rounded-2xl border border-[#E5E5EA] mb-6'>
        <h1 className={textClasses.heading}>Карта ботанического сада</h1>
        {error && (
          <div className='mt-3 p-3 bg-[#FFF5F5] border border-[#FF3B30] rounded-lg text-[#D70015]'>
            {error}
          </div>
        )}
        {mapData && (
          <div className='mt-3'>
            <h2 className={textClasses.subheading}>{mapData.name}</h2>
            {mapData.description && (
              <p className={`${textClasses.body} ${textClasses.secondary}`}>
                {mapData.description}
              </p>
            )}
          </div>
        )}
      </div>

      <MapProvider>
        <div className={`${layoutClasses.flex} gap-6 flex-col lg:flex-row`}>
          {/* Боковая панель управления */}
          <div className='w-full lg:w-1/3 xl:w-1/4'>
            <MapControlPanel />
          </div>

          {/* Карта */}
          <div className='w-full lg:w-2/3 xl:w-3/4'>
            <div className={`${cardClasses.base} p-0 overflow-hidden h-full`}>
              {isLoading && <LoadingIndicator />}
              <MapContainer loadingMap={isLoading} imageUrl={imageUrl} />
            </div>
          </div>
        </div>
      </MapProvider>
    </div>
  );
};

export default MapPage;
