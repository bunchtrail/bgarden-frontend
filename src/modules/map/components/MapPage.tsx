import React, { useEffect, useState } from 'react';
import { cardClasses } from '../../../styles/global-styles';
import { MapProvider } from '../contexts/MapContext';
import { ModalProvider } from '../contexts/ModalContext';
import { getActiveMap, getMapImageUrl, MapData } from '../services/mapService';
import MapControlPanel from './MapControlPanel';
import { MapContainer, PlantDetailsModal } from './plant-map';

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

  // Функция для рендеринга модальных окон
  const renderPlantModal = (modalId: string, plantId: string, onClose: () => void) => (
    <PlantDetailsModal
      key={modalId}
      modalId={modalId}
      plantId={plantId}
      onClose={onClose}
    />
  );

  return (
    <div className='max-w-screen-2xl mx-auto h-[calc(100vh-4rem)] pt-6'>
      <MapProvider>
        <ModalProvider renderModal={renderPlantModal}>
          {/* Карта занимает всё пространство */}
          <div className='h-full w-full'>
            <div className={`${cardClasses.base} p-0 overflow-hidden h-full`}>
              {isLoading && <LoadingIndicator />}
              <MapContainer loadingMap={isLoading} imageUrl={imageUrl} />
            </div>
          </div>

          {/* Панель управления теперь располагается поверх карты */}
          <MapControlPanel />
        </ModalProvider>
      </MapProvider>
    </div>
  );
};

export default MapPage;
