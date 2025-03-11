import React, { useEffect, useState } from 'react';
import { SectorType } from '../../specimens/types';
import { MapProvider, useMapContext } from '../contexts/MapContext';
import { mapService } from '../services/mapService';
import { MapData } from '../types';
import Map from './Map';
import MapControls from './MapControls';

interface MapContainerProps {
  mapId?: number;
  sectorType?: SectorType;
}

const MapContainer: React.FC<MapContainerProps> = ({
  mapId = 1,
  sectorType = SectorType.Dendrology,
}) => {
  const [mapData, setMapData] = useState<MapData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mapImageUrl, setMapImageUrl] = useState<string>('');
  const [viewMode, setViewMode] = useState<'image' | 'interactive'>(
    'interactive'
  );

  // Загрузка данных карты при монтировании
  useEffect(() => {
    const loadMap = async () => {
      try {
        setLoading(true);
        // Используем новый метод для получения активной карты
        let data = null;

        if (mapId) {
          // Если указан конкретный ID карты, используем его
          data = await mapService.getMapById(mapId);
        } else {
          // Иначе получаем активную карту
          data = await mapService.getActiveMap();

          // Если активная карта не найдена, пробуем получить карту с ID = 1
          if (!data) {
            data = await mapService.getMapById(1);
          }
        }

        if (data) {
          setMapData(data);
          // Получаем полный URL для изображения карты
          const imageUrl = mapService.getMapImageUrl(data.filePath);
          setMapImageUrl(imageUrl);
        }

        setError(null);
      } catch (err) {
        console.error('Ошибка при загрузке карты:', err);
        setError('Не удалось загрузить карту');
      } finally {
        setLoading(false);
      }
    };

    loadMap();
  }, [mapId]);

  if (loading) {
    return (
      <div className='map-loading p-8 text-center'>
        <div className='animate-pulse text-lg'>Загрузка карты...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='map-error p-8 text-center bg-red-50 border border-red-200 rounded-lg'>
        <div className='text-red-600'>{error}</div>
      </div>
    );
  }

  // Если у карты есть изображение, показываем режим переключения и соответствующий режим
  if (mapData && mapImageUrl) {
    return (
      <MapProvider>
        <MapContainerContent
          mapData={mapData}
          mapImageUrl={mapImageUrl}
          viewMode={viewMode}
          setViewMode={setViewMode}
          mapId={mapId}
          sectorType={sectorType}
        />
      </MapProvider>
    );
  }

  // Если изображения нет, показываем только карту Leaflet
  return (
    <MapProvider>
      <div className='map-container-wrapper'>
        <div className='map-header mb-4'>
          <h2 className='text-2xl font-bold'>
            {mapData?.name || 'Карта ботанического сада'}
          </h2>
          {mapData?.description && (
            <p className='text-gray-600 mt-2'>{mapData.description}</p>
          )}
        </div>

        <Map mapId={mapId} sectorType={sectorType} />
      </div>
    </MapProvider>
  );
};

// Выделяем содержимое в отдельный компонент для использования контекста
const MapContainerContent: React.FC<{
  mapData: MapData;
  mapImageUrl: string;
  viewMode: 'image' | 'interactive';
  setViewMode: React.Dispatch<React.SetStateAction<'image' | 'interactive'>>;
  mapId: number;
  sectorType: SectorType;
}> = ({ mapData, mapImageUrl, viewMode, setViewMode, mapId, sectorType }) => {
  const { setSimpleImageMode } = useMapContext();

  // Устанавливаем режим простого изображения при изменении viewMode
  useEffect(() => {
    setSimpleImageMode(viewMode === 'image');
  }, [viewMode, setSimpleImageMode]);

  return (
    <div className='map-container-wrapper'>
      <div className='map-header mb-4'>
        <h2 className='text-2xl font-bold'>
          {mapData?.name || 'Карта ботанического сада'}
        </h2>
        {mapData?.description && (
          <p className='text-gray-600 mt-2'>{mapData.description}</p>
        )}
      </div>

      <div className='flex justify-end mb-3'>
        <div className='inline-flex rounded-lg shadow-sm'>
          <button
            type='button'
            onClick={() => setViewMode('image')}
            className={`px-4 py-2 text-sm font-medium rounded-l-lg border ${
              viewMode === 'image'
                ? 'bg-[#0A84FF] text-white border-[#0A84FF]'
                : 'bg-white text-[#1D1D1F] border-[#E5E5EA] hover:bg-[#F5F5F7]'
            }`}
          >
            Простой вид
          </button>
          <button
            type='button'
            onClick={() => setViewMode('interactive')}
            className={`px-4 py-2 text-sm font-medium rounded-r-lg border ${
              viewMode === 'interactive'
                ? 'bg-[#0A84FF] text-white border-[#0A84FF]'
                : 'bg-white text-[#1D1D1F] border-[#E5E5EA] hover:bg-[#F5F5F7]'
            }`}
          >
            Интерактивный вид
          </button>
        </div>
      </div>

      {viewMode === 'image' ? (
        <div className='custom-map-image-container'>
          <div className='custom-map-image mb-4 relative'>
            <div
              className='map-image-interactive-area'
              style={{
                position: 'relative',
                maxHeight: '600px',
                margin: '0 auto',
              }}
            >
              <img
                src={mapImageUrl}
                alt={mapData.name}
                className='w-full rounded-lg shadow-md'
                style={{
                  maxHeight: '600px',
                  objectFit: 'contain',
                  margin: '0 auto',
                  display: 'block',
                }}
              />

              {/* Здесь можно добавить обработку кликов по изображению */}
              <div
                className='absolute inset-0 cursor-crosshair'
                onClick={(e) => {
                  // Обработка клика по изображению для добавления растений
                  // Координаты клика можно использовать для позиционирования маркеров
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left; // x позиция внутри элемента
                  const y = e.clientY - rect.top; // y позиция внутри элемента

                  // Нормализуем координаты (0-1)
                  const normalizedX = x / rect.width;
                  const normalizedY = y / rect.height;

                  console.log(
                    `Клик по карте: x=${normalizedX.toFixed(
                      4
                    )}, y=${normalizedY.toFixed(4)}`
                  );

                  // Здесь можно добавить логику для создания маркера растения
                }}
              />
            </div>
          </div>

          {/* Элементы управления для режима простого изображения */}
          <MapControls standaloneMode={true} />
        </div>
      ) : (
        <Map mapId={mapId} sectorType={sectorType} />
      )}
    </div>
  );
};

export default MapContainer;
