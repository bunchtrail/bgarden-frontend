import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import React, { ReactNode, useEffect, useState } from 'react';
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  ZoomControl,
} from 'react-leaflet';
import { MapLayer, MapMarker, MapOptions, MarkerType } from '../types';
import { MapControls } from './';
import './map.module.css';

// Интерфейс для пропсов компонента карты
interface GardenMapProps {
  markers?: MapMarker[];
  options: MapOptions;
  availableLayers?: MapLayer[];
  className?: string;
  defaultLayer?: string;
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
    id: 'default',
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

  // Состояние для активного слоя
  const [activeLayer, setActiveLayer] = useState<MapLayer>(
    defaultLayer
      ? availableLayers.find((layer) => layer.id === defaultLayer) ||
          defaultMapLayer
      : availableLayers.find((layer) => layer.isDefault) || defaultMapLayer
  );

  // Состояние для фильтров
  const [filters, setFilters] = useState(initialFilters || defaultFilters);

  // Путь до изображений для маркеров
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

  useEffect(() => {
    // Добавление CSS для Leaflet контейнера
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  // Изменение слоя карты при изменении defaultLayer
  useEffect(() => {
    if (defaultLayer) {
      const layer = availableLayers.find((l) => l.id === defaultLayer);
      if (layer) {
        setActiveLayer(layer);
      }
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
  const handleLayerChange = (layerId: string) => {
    const layer = availableLayers.find((l) => l.id === layerId);
    if (layer) {
      setActiveLayer(layer);
    }
  };

  return (
    <div className={`garden-map-container ${className}`}>
      <MapContainer
        center={options.center}
        zoom={options.zoom}
        minZoom={options.minZoom}
        maxZoom={options.maxZoom}
        maxBounds={options.maxBounds}
        className='h-full w-full'
        zoomControl={false}
      >
        <ZoomControl position='bottomright' />
        <TileLayer
          url={activeLayer.url}
          attribution={activeLayer.attribution}
        />

        {/* Элементы управления картой (фильтры, слои) */}
        <MapControls
          filters={filters}
          onFilterChange={handleFilterChange}
          layers={availableLayers}
          activeLayer={activeLayer.id}
          onLayerChange={handleLayerChange}
        />

        {/* Маркеры на карте */}
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={[marker.lat, marker.lng]}
            icon={getMarkerIcon(marker.type)}
            title={marker.title}
          >
            <Popup>
              <div>
                <h4 className='font-semibold'>{marker.title}</h4>
                {marker.description && (
                  <p className='text-sm'>{marker.description}</p>
                )}
                {marker.popupContent && (
                  <div
                    dangerouslySetInnerHTML={{ __html: marker.popupContent }}
                  />
                )}
                {marker.specimenId && (
                  <a
                    href={`/specimens/${marker.specimenId}`}
                    className='text-blue-600 hover:underline text-sm mt-2 block'
                  >
                    Подробнее о растении
                  </a>
                )}
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Дочерние элементы (MapAreas, MarkerCluster и др.) */}
        {children}
      </MapContainer>
    </div>
  );
};
