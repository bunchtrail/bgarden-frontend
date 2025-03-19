import React, { ReactNode } from 'react';
import { MapContainer, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapConfig } from '../../contexts/MapConfigContext';
import { MAP_STYLES } from '../../styles';

export interface BaseMapContainerProps {
  mapConfig: MapConfig;
  children: ReactNode;
  showControls?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

/**
 * Базовый компонент контейнера карты, абстрагирующий общие настройки MapContainer
 * для устранения дублирования между MapPage и LightMapView
 */
const BaseMapContainer: React.FC<BaseMapContainerProps> = ({
  mapConfig,
  children,
  showControls = true,
  style = { height: '100%', width: '100%' },
  className = ''
}) => {
  return (
    <MapContainer
      center={mapConfig.center}
      zoom={mapConfig.zoom}
      maxZoom={mapConfig.maxZoom}
      minZoom={mapConfig.minZoom}
      style={style}
      zoomControl={false}
      crs={L.CRS.Simple}
      maxBounds={mapConfig.maxBounds}
      maxBoundsViscosity={mapConfig.maxBoundsViscosity}
      attributionControl={false}
      className={`${mapConfig.lightMode ? MAP_STYLES.lightMode : ''} ${className}`}
      scrollWheelZoom={showControls}
      dragging={showControls}
    >
      {showControls && <ZoomControl position={mapConfig.zoomControlPosition} />}
      {children}
    </MapContainer>
  );
};

export default BaseMapContainer; 