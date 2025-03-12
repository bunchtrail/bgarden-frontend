// Компонент маркера растения на карте

import React from 'react';
import { Marker, Popup, useMap } from 'react-leaflet';
import { Icon, LatLng } from 'leaflet';
import L from 'leaflet';

// Тип для свойств маркера растения
interface MapMarkerProps {
  id: string;
  position: [number, number];
  name: string;
  onClick?: () => void;
}

// Создаем кастомную иконку для маркера (зеленый маркер для растения)
const plantIcon = new Icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEyLDJhMTAsMTAgMCAwLDAgMCwyMGExMCwxMCAwIDAsMCAwLC0yMHoiIGZpbGw9IiMwMDgwMDAiIC8+PC9zdmc+',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12],
});

const MapMarker: React.FC<MapMarkerProps> = ({ id, position, name, onClick }) => {
  return (
    <Marker 
      position={position} 
      icon={plantIcon}
      eventHandlers={{
        click: () => {
          if (onClick) onClick();
        }
      }}
    >
      <Popup>
        <div>
          <h3 className="font-bold">{name}</h3>
        </div>
      </Popup>
    </Marker>
  );
};

export default MapMarker;
