import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import React, { ReactNode, useEffect, useState } from 'react';
import {
  ImageOverlay,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  ZoomControl,
  useMap,
} from 'react-leaflet';
import {
  getActiveCustomMapSchema,
} from '../services/map/schemaService';
import {
  getDefaultMapOptions,
} from '../services/map/optionsService';
import {
  CustomMapSchema,
  MapLayer,
  MapMarker,
  MapOptions,
  MarkerType,
} from '../types';
import { MapControls } from './MapControls';

// Компонент для автоматического изменения параметров карты
const MapUpdater: React.FC<{
  center: [number, number];
  zoom: number;
}> = ({ center, zoom }) => {
  const map = useMap();

  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);

  return null;
};

// Интерфейс для пропсов компонента карты
interface GardenMapProps {
  markers?: MapMarker[];
  options?: MapOptions;
  availableLayers?: MapLayer[];
  className?: string;
  defaultLayer?: string | number; // Может быть ID или строковый идентификатор
  children?: ReactNode;
  initialFilters?: {
    plants: boolean;
    expositions: boolean;
    facilities: boolean;
    entrances: boolean;
    sectors: boolean;
    greenhouses: boolean;
  };
  onFilterChange?: (filterType: string) => void;
}

// Карта ботанического сада
export const GardenMap: React.FC<GardenMapProps> = ({
  markers = [],
  options,
  availableLayers = [],
  className = '',
  defaultLayer,
  children,
  initialFilters,
  onFilterChange,
}) => {
  // Стандартный слой карты, если не указаны другие
  const defaultMapLayer: MapLayer = {
    id: 0,
    name: 'OpenStreetMap',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    isDefault: true,
  };

  // Стандартные фильтры, если не указаны другие
  const defaultFilters = {
    plants: true,
    expositions: true,
    facilities: false,
    entrances: true,
    sectors: true,
    greenhouses: false,
  };

  // Состояния
  const [activeLayer, setActiveLayer] = useState<MapLayer>(
    defaultMapLayer // Будет заменено при загрузке данных
  );
  const [filters, setFilters] = useState(initialFilters || defaultFilters);
  const [mapOptions, setMapOptions] = useState<MapOptions>({
    center: [55.75, 37.61], // Москва по умолчанию
    zoom: 14,
    minZoom: 12,
    maxZoom: 19,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Состояние для пользовательской схемы карты
  const [customMapSchema, setCustomMapSchema] =
    useState<CustomMapSchema | null>(null);
  const [usingCustomSchema, setUsingCustomSchema] = useState<boolean>(false);

  // Получение иконки для маркера в зависимости от типа
  const getMarkerIcon = (type: MarkerType): Icon => {
    let iconUrl = '';

    // Выбор иконки в зависимости от типа маркера
    switch (type) {
      case MarkerType.PLANT:
        iconUrl = '/images/markers/plant-marker.png';
        break;
      case MarkerType.EXPOSITION:
        iconUrl = '/images/markers/exposition-marker.png';
        break;
      case MarkerType.FACILITY:
        iconUrl = '/images/markers/facility-marker.png';
        break;
      case MarkerType.ENTRANCE:
        iconUrl = '/images/markers/entrance-marker.png';
        break;
      default:
        iconUrl = '/images/markers/default-marker.png';
    }

    return new Icon({
      iconUrl,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });
  };

  // Получение координат маркера с учетом GeoJSON
  const getMarkerPosition = (marker: MapMarker): [number, number] => {
    if (
      marker.coordinates &&
      typeof marker.coordinates === 'object' &&
      marker.coordinates.type === 'Point'
    ) {
      // Извлекаем координаты из GeoJSON Point (lng, lat)
      const coords = marker.coordinates.coordinates;
      // Преобразуем в формат Leaflet (lat, lng)
      return [coords[1], coords[0]];
    }
    // Используем стандартные координаты
    return [marker.lat, marker.lng];
  };

  // Загрузка опций карты при инициализации
  useEffect(() => {
    const loadDefaultOptions = async () => {
      if (!options) {
        // Если опции не переданы в пропсах
        try {
          const defaultOptions = await getDefaultMapOptions();
          if (defaultOptions) {
            setMapOptions({
              center: [defaultOptions.center[0], defaultOptions.center[1]],
              zoom: defaultOptions.zoom,
              minZoom: defaultOptions.minZoom,
              maxZoom: defaultOptions.maxZoom,
              maxBounds: defaultOptions.maxBounds,
            });
          }
        } catch (error) {
          console.error('Ошибка загрузки опций карты:', error);
          setError('Не удалось загрузить настройки карты');
        }
      } else {
        setMapOptions(options);
      }
      setLoading(false);
    };

    loadDefaultOptions();
  }, [options]);

  // Загрузка пользовательской схемы карты при инициализации
  useEffect(() => {
    const loadCustomMapSchema = async () => {
      try {
        const schema = await getActiveCustomMapSchema();
        if (schema) {
          setCustomMapSchema(schema);
          // Если схема активна, используем её
          setUsingCustomSchema(true);
        }
      } catch (error) {
        console.error('Ошибка загрузки пользовательской схемы карты:', error);
      }
    };

    loadCustomMapSchema();
  }, []);

  // Изменение слоя карты при изменении defaultLayer
  useEffect(() => {
    if (defaultLayer) {
      let layer;

      if (typeof defaultLayer === 'string') {
        // Поиск по строковому идентификатору (для обратной совместимости)
        layer = availableLayers.find(
          (l) => l.name === defaultLayer || l.id.toString() === defaultLayer
        );
      } else {
        // Поиск по числовому ID
        layer = availableLayers.find((l) => l.id === defaultLayer);
      }

      if (layer) {
        setActiveLayer(layer);
      }
    } else {
      // Выбираем слой по умолчанию
      const defaultLayer =
        availableLayers.find((l) => l.isDefault) ||
        (availableLayers.length > 0 ? availableLayers[0] : defaultMapLayer);
      setActiveLayer(defaultLayer);
    }
  }, [defaultLayer, availableLayers]);

  // Обновление фильтров при изменении initialFilters
  useEffect(() => {
    if (initialFilters) {
      setFilters(initialFilters);
    }
  }, [initialFilters]);

  // Обработчик изменения фильтров
  const handleFilterChange = (filterType: string) => {
    const newFilters = {
      ...filters,
      [filterType]: !filters[filterType as keyof typeof filters],
    };
    setFilters(newFilters);

    // Вызов обработчика из родительского компонента, если он передан
    if (onFilterChange) {
      onFilterChange(filterType);
    }
  };

  // Обработчик изменения слоя карты
  const handleLayerChange = (layerId: string | number) => {
    let layer;

    if (typeof layerId === 'string') {
      // Поиск по строковому идентификатору (для обратной совместимости)
      const idNum = parseInt(layerId, 10);
      if (isNaN(idNum)) {
        layer = availableLayers.find((l) => l.name === layerId);
      } else {
        layer = availableLayers.find((l) => l.id === idNum);
      }
    } else {
      // Поиск по числовому ID
      layer = availableLayers.find((l) => l.id === layerId);
    }

    if (layer) {
      setActiveLayer(layer);
    }
  };

  // Фильтрация маркеров в зависимости от настроек фильтра
  const filteredMarkers = React.useMemo(() => {
    if (!markers || markers.length === 0) return [];

    return markers.filter((marker) => {
      switch (marker.type) {
        case MarkerType.PLANT:
          return filters.plants;
        case MarkerType.EXPOSITION:
          return filters.expositions;
        case MarkerType.FACILITY:
          return filters.facilities;
        case MarkerType.ENTRANCE:
          return filters.entrances;
        default:
          return true;
      }
    });
  }, [markers, filters]);

  if (loading) {
    return (
      <div className='w-full h-[500px] flex items-center justify-center bg-green-50 rounded-lg shadow'>
        <div className='flex flex-col items-center'>
          <div className='w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin'></div>
          <p className='mt-4 text-green-800 font-medium'>Загрузка карты...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='w-full h-[500px] flex items-center justify-center bg-red-50 rounded-lg shadow'>
        <div className='flex flex-col items-center p-6 text-center'>
          <div className='w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-4'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-8 w-8'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
              />
            </svg>
          </div>
          <h3 className='text-lg font-semibold text-red-600 mb-2'>
            Ошибка загрузки карты
          </h3>
          <p className='text-red-500 mb-4'>{error}</p>
          <button
            className='px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50'
            onClick={() => window.location.reload()}
          >
            Обновить страницу
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`w-full h-[700px] relative rounded-lg shadow-lg overflow-hidden ${className}`}
    >
      <MapContainer
        center={mapOptions.center}
        zoom={mapOptions.zoom}
        minZoom={mapOptions.minZoom}
        maxZoom={mapOptions.maxZoom}
        maxBounds={mapOptions.maxBounds}
        className='h-full w-full'
        zoomControl={false}
      >
        <ZoomControl position='bottomright' />
        <MapUpdater center={mapOptions.center} zoom={mapOptions.zoom} />

        {/* Используем пользовательскую схему или стандартный слой */}
        {usingCustomSchema && customMapSchema ? (
          <ImageOverlay
            bounds={customMapSchema.bounds}
            url={customMapSchema.imageUrl}
            opacity={1}
            zIndex={10}
          />
        ) : (
          <TileLayer
            attribution={activeLayer.attribution}
            url={activeLayer.url}
          />
        )}

        {/* Маркеры на карте */}
        {filteredMarkers.map((marker) => (
          <Marker
            key={`marker-${marker.id}`}
            position={getMarkerPosition(marker)}
            icon={getMarkerIcon(marker.type)}
          >
            <Popup>
              <div className='min-w-[200px]'>
                <h3 className='text-lg font-semibold text-green-800 border-b border-green-200 pb-2 mb-2'>
                  {marker.title}
                </h3>
                {marker.description && (
                  <p className='text-sm text-gray-600 mb-2'>
                    {marker.description}
                  </p>
                )}
                {marker.popupContent && (
                  <div
                    className='text-sm'
                    dangerouslySetInnerHTML={{ __html: marker.popupContent }}
                  />
                )}
                {marker.specimenId && (
                  <div className='mt-3 pt-2 border-t border-green-200'>
                    <a
                      href={`/specimens/${marker.specimenId}`}
                      className='text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 inline-block'
                    >
                      Открыть карточку
                    </a>
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Дополнительные компоненты карты */}
        {children}

        {/* Элементы управления картой */}
        <MapControls
          layers={availableLayers}
          activeLayerId={activeLayer.id}
          onLayerChange={handleLayerChange}
          filters={filters}
          onFilterChange={handleFilterChange}
        />
      </MapContainer>
    </div>
  );
};
