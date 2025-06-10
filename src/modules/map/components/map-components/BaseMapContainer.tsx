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
  const crs = mapConfig.mapType === 'schematic' ? L.CRS.Simple : L.CRS.EPSG3857;
  // Чтобы корректно менять систему координат при переключении типа карты,
  // используем ключ для принудительного размонтирования контейнера
  const mapKey = mapConfig.mapType;
  return (
    <MapContainer
      key={mapKey}
      center={mapConfig.center}
      zoom={mapConfig.zoom}
      maxZoom={mapConfig.maxZoom}
      minZoom={mapConfig.minZoom}
      style={style}
      zoomControl={false}
      crs={crs}
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