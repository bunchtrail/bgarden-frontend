import L, { Icon } from 'leaflet';
import 'leaflet.markercluster/dist/leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import React, { useEffect, useState } from 'react';
import { Marker, Popup, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { MapMarker, MarkerType } from '../types';

// Интерфейс для пропсов компонента
interface MarkerClusterProps {
  markers: MapMarker[];
  onMarkerClick?: (marker: MapMarker) => void;
  clusterOptions?: any;
}

// Функция для создания иконки маркера
const createMarkerIcon = (type: MarkerType): Icon => {
  let iconUrl = '';
  let iconSize: [number, number] = [32, 32];
  let iconAnchor: [number, number] = [16, 32];

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
    iconSize,
    iconAnchor,
    popupAnchor: [0, -32],
  });
};

// Компонент для кластеризации маркеров на карте
export const MarkerCluster: React.FC<MarkerClusterProps> = ({
  markers,
  onMarkerClick,
  clusterOptions,
}) => {
  const map = useMap();
  const [cachedMarkers, setCachedMarkers] = useState<MapMarker[]>([]);

  // Получаем координаты маркера с учётом GeoJSON
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

  // Обработчик клика по маркеру
  const handleMarkerClick = (marker: MapMarker) => {
    if (onMarkerClick) {
      onMarkerClick(marker);
    }
  };

  // Кэшируем маркеры для предотвращения лишних ререндеров
  useEffect(() => {
    setCachedMarkers(markers);
  }, [markers]);

  // Если нет маркеров, ничего не рендерим
  if (!cachedMarkers.length) {
    return null;
  }

  // Стандартные опции для кластеризации
  const defaultClusterOptions = {
    chunkedLoading: true,
    maxClusterRadius: 80,
    iconCreateFunction: (cluster: any) => {
      const count = cluster.getChildCount();
      let size = 'text-xs';
      let bgClass = 'bg-green-500';

      if (count > 20) {
        size = 'text-base';
        bgClass = 'bg-green-700';
      } else if (count > 10) {
        size = 'text-sm';
        bgClass = 'bg-green-600';
      }

      return L.divIcon({
        html: `<div class="cluster-icon flex items-center justify-center ${size} font-bold text-white ${bgClass} rounded-full h-10 w-10">${count}</div>`,
        className: 'custom-marker-cluster',
        iconSize: L.point(40, 40),
      });
    },
    ...clusterOptions,
  };

  return (
    <MarkerClusterGroup key='marker-cluster-group' {...defaultClusterOptions}>
      {cachedMarkers.map((marker) => (
        <Marker
          key={`marker-${marker.id}`}
          position={getMarkerPosition(marker)}
          icon={createMarkerIcon(marker.type)}
          eventHandlers={{
            click: () => handleMarkerClick(marker),
          }}
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
    </MarkerClusterGroup>
  );
};
