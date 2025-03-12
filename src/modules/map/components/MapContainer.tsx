import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { SectorType, Specimen } from '../../specimens/types';
import { MapProvider, useMapContext } from '../contexts/MapContext';
import { mapService } from '../services/mapService';
import { specimenService } from '../services/specimenService';
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
  // Всегда используем только простой режим изображения
  const [viewMode] = useState<'image' | 'interactive'>('image');

  const loadMapMemo = useMemo(
    () => async () => {
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
    },
    [mapId]
  );

  // Загрузка данных карты при монтировании
  useEffect(() => {
    loadMapMemo();
  }, [loadMapMemo]);

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
          <h2 className='text-2xl font-bold'>Интерактивная карта</h2>
          <p className='text-gray-600 mt-2'>
            Используется интерактивная карта Leaflet
          </p>
        </div>

        <div className='leaflet-map-container mb-4'>
          {/* Отображаем компонент Map для интерактивного отображения */}
          <Map mapId={mapId} sectorType={sectorType} />
        </div>
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
}> = React.memo(({ mapData, mapImageUrl, viewMode, mapId, sectorType }) => {
  const { setSimpleImageMode, state, setMode, setMap, setMapReady } =
    useMapContext();
  // Используем ref для отслеживания, было ли обновление режима
  const initialModeSetRef = useRef(false);
  // Используем ref для сохранения предыдущего значения viewMode
  const prevViewModeRef = useRef(viewMode);
  // Добавляем состояние для хранения координат точки на карте
  const [simpleImageMarker, setSimpleImageMarker] = useState<{
    x: number;
    y: number;
  } | null>(null);

  // Инициализация фиктивной карты - выполняется только один раз
  const initializeDummyMap = useCallback(() => {
    // Проверяем, не инициализирована ли уже карта
    if (state.mapInstance || state.mapReady) {
      console.log(
        '🔄 MapContainer: фиктивная карта уже инициализирована, пропускаем',
        {
          hasMapInstance: !!state.mapInstance,
          mapReady: state.mapReady,
        }
      );
      return;
    }

    console.log('🔧 MapContainer: инициализация новой фиктивной карты');

    // Создаем объект для хранения слоев карты
    const layers = new Set();

    // Создаем фиктивный объект карты для работы с PlantLayer
    const dummyMap = {
      getContainer: () => document.createElement('div'),
      invalidateSize: () => {},
      once: (event: string, callback: () => void) => callback(),
      remove: () => {},
      // Поддержка маркеров
      addLayer: (layer: any) => {
        console.log('DummyMap: addLayer вызван');
        layers.add(layer);

        // Имитируем событие добавления слоя
        if (layer._events && layer._events.add) {
          layer._events.add.forEach((handler: Function) => {
            try {
              handler({ target: layer });
            } catch (e) {
              console.error(
                'Ошибка при вызове обработчика добавления слоя:',
                e
              );
            }
          });
        }

        // Вызываем onAdd если это доступно (для L.Control и других компонентов)
        if (typeof layer.onAdd === 'function') {
          try {
            layer.onAdd(dummyMap);
          } catch (e) {
            console.error('Ошибка при вызове onAdd слоя:', e);
          }
        }

        return dummyMap; // Для цепочки вызовов
      },
      removeLayer: (layer: any) => {
        console.log('DummyMap: removeLayer вызван');
        layers.delete(layer);

        // Имитируем событие удаления слоя
        if (layer._events && layer._events.remove) {
          layer._events.remove.forEach((handler: Function) => {
            try {
              handler({ target: layer });
            } catch (e) {
              console.error('Ошибка при вызове обработчика удаления слоя:', e);
            }
          });
        }

        // Вызываем onRemove если это доступно
        if (typeof layer.onRemove === 'function') {
          try {
            layer.onRemove(dummyMap);
          } catch (e) {
            console.error('Ошибка при вызове onRemove слоя:', e);
          }
        }

        return dummyMap; // Для цепочки вызовов
      },
      // Метод возвращающий все слои
      getLayers: () => Array.from(layers),
      // Для совместимости с L.marker и другими методами
      options: {},
      _panes: {
        markerPane: document.createElement('div'),
        overlayPane: document.createElement('div'),
        shadowPane: document.createElement('div'),
        tooltipPane: document.createElement('div'),
        popupPane: document.createElement('div'),
      },
      // Добавляем метод addTo для совместимости
      // Это позволит маркерам вызывать myMarker.addTo(map)
      addTo: function (obj: any) {
        console.log('DummyMap: кто-то пытается вызвать addTo на карте');
        return dummyMap;
      },
    } as unknown as L.Map;

    // Устанавливаем фиктивную карту в контекст
    setMap(dummyMap);

    // Отмечаем карту как готовую
    setTimeout(() => {
      console.log('🎯 MapContainer: отмечаем фиктивную карту как готовую');
      setMapReady(true);
    }, 100);
  }, [state.mapInstance, state.mapReady, setMap, setMapReady]);

  // Эффект для установки режима простого изображения при монтировании компонента
  useEffect(() => {
    // Всегда устанавливаем режим простого изображения
    if (!initialModeSetRef.current) {
      console.log('🖼️ MapContainer: устанавливаем режим простого изображения');
      setSimpleImageMode(true);
      initialModeSetRef.current = true;
    }
  }, [setSimpleImageMode]);

  // Обработчик клика по изображению карты
  const handleImageMapClick = (e: React.MouseEvent<HTMLImageElement>) => {
    // Получаем координаты клика относительно изображения
    const rect = e.currentTarget.getBoundingClientRect();
    // Вычисляем относительные координаты (0-1)
    const relativeX = (e.clientX - rect.left) / rect.width;
    const relativeY = (e.clientY - rect.top) / rect.height;

    console.log(
      `Клик по карте: x=${relativeX.toFixed(4)}, y=${relativeY.toFixed(4)}`
    );

    // Устанавливаем маркер в режиме добавления растения
    if (state.mode === MapMode.ADD_PLANT) {
      setSimpleImageMarker({ x: relativeX, y: relativeY });

      // Преобразуем координаты пикселей в условные географические координаты
      // Используем диапазон 55-56 для широты и 37-38 для долготы, чтобы имитировать реальные координаты
      const latitude = 55 + relativeY;
      const longitude = 37 + relativeX;

      // Создаем пользовательское событие для передачи координат в форму добавления растения
      const mapClickEvent = new CustomEvent('map-image-click', {
        detail: {
          latlng: { lat: latitude, lng: longitude },
          relativeCoords: { x: relativeX, y: relativeY },
        },
        bubbles: true,
      });

      // Отправляем событие
      e.currentTarget.dispatchEvent(mapClickEvent);
    }
  };

  // Эффект для очистки маркера при изменении режима
  useEffect(() => {
    if (state.mode !== MapMode.ADD_PLANT) {
      // Если режим не ADD_PLANT, то очищаем маркер
      setSimpleImageMarker(null);
    }
  }, [state.mode]);

  return (
    <div className='map-container-wrapper'>
      <div className='map-header mb-4'>
        <h2 className='text-2xl font-bold'>{mapData.name}</h2>
        <p className='text-gray-600 mt-2'>{mapData.description}</p>
      </div>

      <div className='map-container position-relative mb-6'>
        {/* Контейнер с изображением */}
        <div
          className='map-image-container relative rounded-lg overflow-hidden'
          style={{
            width: '100%',
            height: '600px',
            position: 'relative',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          }}
        >
          {/* Изображение карты */}
          <img
            src={mapImageUrl}
            alt={`Карта ${mapData.name}`}
            className='w-full h-full object-contain bg-gray-50'
            style={{ userSelect: 'none' }}
            onClick={handleImageMapClick}
          />

          {/* Маркеры на простом изображении */}
          <SimpleImageMarkers />

          {/* Отображение временного маркера при добавлении растения */}
          {simpleImageMarker && state.mode === MapMode.ADD_PLANT && (
            <div
              className='absolute w-6 h-6 rounded-full bg-red-500 border-2 border-white transform -translate-x-1/2 -translate-y-1/2 z-10'
              style={{
                left: `${simpleImageMarker.x * 100}%`,
                top: `${simpleImageMarker.y * 100}%`,
                boxShadow: '0 0 0 2px rgba(239, 68, 68, 0.3)',
              }}
            ></div>
          )}

          {/* Подсказка для режима добавления */}
          {state.mode === MapMode.ADD_PLANT && (
            <div className='absolute bottom-4 left-0 right-0 mx-auto text-center bg-white bg-opacity-80 py-2 px-4 rounded-md shadow-md text-sm max-w-md'>
              Выберите позицию растения на карте, кликнув в нужное место
            </div>
          )}
        </div>
      </div>

      {/* Элементы управления остаются без изменений */}
      <MapControls />
    </div>
  );
});

// Компонент для отображения растений на простом изображении карты
const SimpleImageMarkers: React.FC = () => {
  const { state } = useMapContext();
  const [specimens, setSpecimens] = useState<Specimen[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Загрузка экземпляров растений
  useEffect(() => {
    const loadSpecimens = async () => {
      try {
        setLoading(true);
        // getAllSpecimens не принимает аргументов в интерфейсе
        const data = await specimenService.getAllSpecimens();

        console.log(`Загружено ${data.length} растений для отображения на простой карте`);
        
        // Фильтруем только те растения, у которых есть координаты
        // У Specimen координаты хранятся напрямую, а не в объекте location
        const validSpecimens = data.filter(
          (s) => s.latitude && s.longitude && !isNaN(s.latitude) && !isNaN(s.longitude)
        );
        
        setSpecimens(validSpecimens);
      } catch (error) {
        console.error('Ошибка при загрузке растений:', error);
        setError('Не удалось загрузить растения');
      } finally {
        setLoading(false);
      }
    };

    // Загружаем растения только если режим простого изображения активен и карта готова
    if (state.isSimpleImageMode && state.mapReady) {
      loadSpecimens();
    }
  }, [state.isSimpleImageMode, state.mapReady, state.selectedSector]);

  // Если данных нет, не отображаем ничего
  if (loading || !specimens.length) {
    return null;
  }

  return (
    <>
      {/* Маркеры растений на простом изображении */}
      {specimens.map((specimen) => {
        // Преобразуем реальные координаты обратно в относительные для изображения
        // Используем условную логику: latitude в диапазоне 55-56, longitude в диапазоне 37-38
        // Координаты хранятся напрямую в объекте specimen
        const relativeX = specimen.longitude - 37;
        const relativeY = specimen.latitude - 55;

        return (
          <div
            key={specimen.id}
            className='absolute w-4 h-4 rounded-full bg-green-500 border border-white transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10'
            style={{
              left: `${relativeX * 100}%`,
              top: `${relativeY * 100}%`,
              boxShadow: '0 0 0 2px rgba(16, 185, 129, 0.3)',
            }}
            title={`${specimen.russianName} (${specimen.latinName})`}
            onClick={() => {
              // Можно добавить обработчик для показа подробной информации
              console.log('Растение выбрано:', specimen);
            }}
          >
            {/* Можно добавить номер растения для отображения */}
            <span className='absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center text-white text-[8px] font-bold'>
              {specimen.id}
            </span>
          </div>
        );
      })}
    </>
  );
};

export default MapContainer;
