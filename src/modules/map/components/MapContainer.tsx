import React, { useEffect, useRef, useState } from 'react';
import { SectorType } from '../../specimens/types';
import { MapProvider, useMapContext } from '../contexts/MapContext';
import { mapService } from '../services/mapService';
import { MapData, MapMode } from '../types';
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
  // Всегда используем только простой режим
  const [viewMode] = useState<'image' | 'interactive'>('image');

  // Загрузка данных карты при монтировании
  useEffect(() => {
    const loadMap = async () => {
      try {
        setLoading(true);
        // Используем новый метод для получения активной карты
        let data: MapData | null = null;

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
          const imageUrl = mapService.getMapImageUrl(data?.filePath || '');
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

  // Если у карты есть изображение, показываем соответствующий режим
  if (mapData && mapImageUrl) {
    return (
      <MapProvider>
        <MapContainerContent
          mapData={mapData}
          mapImageUrl={mapImageUrl}
          viewMode={viewMode}
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
  mapId: number;
  sectorType: SectorType;
}> = ({ mapData, mapImageUrl, viewMode, mapId, sectorType }) => {
  const { setSimpleImageMode, state, setMode } = useMapContext();
  // Используем ref для отслеживания, было ли обновление режима
  const initialModeSetRef = useRef(false);
  // Используем ref для сохранения предыдущего значения viewMode
  const prevViewModeRef = useRef(viewMode);
  // Добавляем состояние для хранения координат точки на карте
  const [simpleImageMarker, setSimpleImageMarker] = useState<{
    x: number;
    y: number;
  } | null>(null);

  // Устанавливаем режим простого изображения при первичном рендере или при изменении viewMode
  useEffect(() => {
    // Обновляем режим только при первом рендере или при изменении viewMode
    if (!initialModeSetRef.current || prevViewModeRef.current !== viewMode) {
      prevViewModeRef.current = viewMode;

      // Используем timeout для разделения обновлений состояний
      const timeout = setTimeout(() => {
        setSimpleImageMode(viewMode === 'image');
        initialModeSetRef.current = true;
      }, 0);

      return () => clearTimeout(timeout);
    }
  }, [viewMode, setSimpleImageMode]);

  // Добавляем обработчик событий для слушания кликов по изображению карты
  useEffect(() => {
    const handleImageMapClick = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        // Получаем оригинальные нормализованные координаты из события
        const normalizedX = customEvent.detail.lng - 37;
        const normalizedY = 56 - customEvent.detail.lat;

        // Устанавливаем маркер для отображения на изображении
        setSimpleImageMarker({ x: normalizedX, y: normalizedY });
      }
    };

    // Регистрируем слушатель событий
    document.addEventListener('map-image-click', handleImageMapClick);

    // Удаляем слушатель при размонтировании компонента
    return () => {
      document.removeEventListener('map-image-click', handleImageMapClick);
    };
  }, []);

  // Очищаем маркер при изменении режима или карты
  useEffect(() => {
    if (state.mode !== MapMode.ADD_PLANT) {
      setSimpleImageMarker(null);
    }
  }, [state.mode, mapId]);

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

      {/* Информационное сообщение о том, что интерактивный режим временно отключен */}
      <div className='mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg'>
        <p className='text-yellow-800'>
          Интерактивный режим временно отключен. Используется только простой
          режим.
        </p>
      </div>

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

            <div
              className='absolute inset-0 cursor-crosshair'
              onClick={(e) => {
                // Обработка клика по изображению для добавления растений
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

                // Преобразуем нормализованные координаты в псевдо-географические для совместимости
                // с существующей логикой форм
                const geoLat = 56 - normalizedY; // Инвертируем Y, так как 0 - верх изображения
                const geoLng = 37 + normalizedX;

                // Устанавливаем маркер для отображения на изображении карты
                setSimpleImageMarker({ x: normalizedX, y: normalizedY });

                // При клике в режиме добавления растения, передаем координаты в форму
                if (state.mode === MapMode.ADD_PLANT) {
                  // Создаем объект события для передачи координат в формы через хук
                  const mapClickEvent = new CustomEvent('map-image-click', {
                    detail: { lat: geoLat, lng: geoLng },
                  });

                  // Отправляем событие, которое будет перехвачено в PlantAddForm
                  document.dispatchEvent(mapClickEvent);
                }
              }}
            >
              {/* Добавляем подсказку в режиме добавления растения */}
              {state.mode === MapMode.ADD_PLANT && (
                <div className='absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg opacity-80'>
                  Кликните по карте, чтобы выбрать местоположение растения
                </div>
              )}

              {/* Отображаем маркер на карте если он установлен */}
              {simpleImageMarker && (
                <div
                  className='absolute w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-lg transform -translate-x-1/2 -translate-y-1/2'
                  style={{
                    left: `${simpleImageMarker.x * 100}%`,
                    top: `${simpleImageMarker.y * 100}%`,
                  }}
                />
              )}
            </div>
          </div>

          {/* Элементы управления для режима простого изображения */}
          <MapControls standaloneMode={true} />
        </div>
      </div>
    </div>
  );
};

export default MapContainer;
