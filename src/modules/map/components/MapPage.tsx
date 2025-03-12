import React, { useEffect, useState } from 'react';
import { cardClasses, layoutClasses } from '../../../styles/global-styles';
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
    <div className='max-w-screen-2xl mx-auto h-[calc(100vh-6rem)]'>
      <MapProvider>
        <div
          className={`${layoutClasses.flex} gap-4 flex-col lg:flex-row h-full`}
        >
          {/* Боковая панель управления */}
          <div className='w-full lg:w-1/5 xl:w-1/6'>
            <MapControlPanel />
          </div>

          {/* Карта */}
          <div className='w-full lg:w-4/5 xl:w-5/6 h-[calc(100vh-8rem)]'>
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
