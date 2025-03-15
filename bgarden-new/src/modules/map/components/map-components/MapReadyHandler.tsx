import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

interface MapReadyHandlerProps {
  onMapReady?: (map: L.Map) => void;
}

/**
 * Компонент для обработки события готовности карты.
 * Использует хук useMap из react-leaflet для получения экземпляра карты.
 */
const MapReadyHandler: React.FC<MapReadyHandlerProps> = ({ onMapReady }) => {
  const map = useMap();
  
  useEffect(() => {
    if (map && onMapReady) {
      onMapReady(map);
    }
  }, [map, onMapReady]);
  
  return null; // Компонент не рендерит ничего видимого
};

export default MapReadyHandler; 