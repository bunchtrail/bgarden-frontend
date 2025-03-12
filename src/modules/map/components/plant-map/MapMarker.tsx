// Компонент маркера растения на карте

import L, { Icon } from 'leaflet';
import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import { useMapContext } from '../../contexts';

// Тип для свойств маркера растения
interface MapMarkerProps {
  id: string;
  position: [number, number];
  name: string;
  onClick?: () => void;
  draggable?: boolean;
}

// Создаем кастомную иконку для маркера (зеленый маркер для растения)
const plantIcon = new Icon({
  iconUrl:
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEyLDJhMTAsMTAgMCAwLDAgMCwyMGExMCwxMCAwIDAsMCAwLC0yMHoiIGZpbGw9IiMwMDgwMDAiIC8+PC9zdmc+',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12],
});

const MapMarker: React.FC<MapMarkerProps> = ({
  id,
  position,
  name,
  onClick,
  draggable = false,
}) => {
  const { updatePlant } = useMapContext();

  // Обработчик окончания перетаскивания
  const handleDragEnd = (e: L.DragEndEvent) => {
    const marker = e.target;
    const position: [number, number] = [
      marker.getLatLng().lat,
      marker.getLatLng().lng,
    ];
    updatePlant(id, { position });
  };

  return (
    <Marker
      position={position}
      icon={plantIcon}
      draggable={draggable}
      eventHandlers={{
        click: () => {
          if (onClick) onClick();
        },
        dragend: handleDragEnd,
      }}
    >
      <Popup>
        <div>
          <h3 className='font-bold'>{name}</h3>
        </div>
      </Popup>
    </Marker>
  );
};

export default MapMarker;
