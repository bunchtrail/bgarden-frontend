import React, { useEffect } from 'react';
import L from 'leaflet';
import { useMap, Marker, Popup } from 'react-leaflet';

interface MapMarkerProps {
  position: [number, number] | null;
  onPositionChange: (lat: number, lng: number) => void;
}

export const MapMarker: React.FC<MapMarkerProps> = ({ position, onPositionChange }) => {
  const map = useMap();
  
  // Обработчик клика по карте
  useEffect(() => {
    if (!map) return;
    
    const handleMapClick = (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      onPositionChange(lat, lng);
    };
    
    map.on('click', handleMapClick);
    
    return () => {
      map.off('click', handleMapClick);
    };
  }, [map, onPositionChange]);
  
  if (!position) return null;
  
  // Создаем стилизованный зеленый значок маркера
  const greenMarkerIcon = L.divIcon({
    className: 'custom-plant-marker',
    html: `<div style="
      width: 16px;
      height: 16px;
      background-color: #2D8731;
      border-radius: 50%;
      border: 2px solid white;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
    "></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8]
  });
  
  return (
    <Marker 
      position={position}
      draggable={true}
      icon={greenMarkerIcon}
      eventHandlers={{
        dragend: (e) => {
          const marker = e.target;
          const position = marker.getLatLng();
          onPositionChange(position.lat, position.lng);
        }
      }}
    >
      <Popup>
        Положение растения <br />
        Перетащите маркер для изменения
      </Popup>
    </Marker>
  );
};

export default MapMarker; 