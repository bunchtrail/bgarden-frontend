import React from 'react';
import 'leaflet/dist/leaflet.css';
import { MapConfigProvider } from '../contexts/MapConfigContext';
import { MapProvider } from '../contexts/MapContext';
import MapPageContent from './MapPageContent';
import { MapPageProps } from '../types/mapTypes';

/**
 * Основной компонент карты
 * Предоставляет контекст конфигурации и карты для дочерних компонентов
 */
const MapPage: React.FC<MapPageProps> = ({
  initialConfig,
  onMapReady,
  ...contentProps
}) => {
  return (
    <MapConfigProvider initialConfig={initialConfig}>
      <MapProvider>
        <MapPageContent
          {...contentProps}
          onMapReady={onMapReady}
        />
      </MapProvider>
    </MapConfigProvider>
  );
};

export default MapPage; 