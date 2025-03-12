// Компонент маркера растения на карте

import L from 'leaflet';
import React, { useEffect, useRef } from 'react';
import { Marker, Tooltip } from 'react-leaflet';
import { useMapContext } from '../../contexts';
import styles from '../../styles/map.module.css';

// Улучшенные SVG иконки для маркеров
const createMarkerIcon = (color: string, selected: boolean) => {
  const svgSize = selected ? 36 : 32;
  const dotSize = selected ? 16 : 14;
  const strokeWidth = selected ? 3 : 2;

  // SVG маркер с улучшенным дизайном
  const svg = `
  <svg width="${svgSize}" height="${svgSize}" viewBox="0 0 ${svgSize} ${svgSize}" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="${svgSize / 2}" cy="${svgSize / 2}" r="${
    svgSize / 2 - 2
  }" fill="white" stroke="${color}" stroke-width="${strokeWidth}" />
    <circle cx="${svgSize / 2}" cy="${svgSize / 2}" r="${
    dotSize / 2
  }" fill="${color}" />
  </svg>`;

  // Создаем base64 кодированную строку из SVG
  const iconUrl = `data:image/svg+xml;base64,${btoa(svg)}`;

  return new L.Icon({
    iconUrl,
    iconSize: [svgSize, svgSize],
    iconAnchor: [svgSize / 2, svgSize / 2],
    tooltipAnchor: [0, -svgSize / 2],
  });
};

// Интерфейс для свойств компонента маркера
interface MapMarkerProps {
  id: string;
  position: [number, number];
  name: string;
  onClick: () => void;
  draggable: boolean;
}

// Компонент маркера
const MapMarker: React.FC<MapMarkerProps> = ({
  id,
  position,
  name,
  onClick,
  draggable,
}) => {
  const { currentMode, selectedPlantId, updatePlant } = useMapContext();
  const markerRef = useRef<L.Marker>(null);

  // Определяем, выбран ли маркер
  const isSelected = selectedPlantId === id;

  // Получаем цвет для маркера из mapColors
  const defaultColor = '#10B981'; // Зеленый цвет по умолчанию
  const selectedColor = '#059669'; // Более темный зеленый для выбранного

  // Создаем иконку маркера
  const icon = createMarkerIcon(
    isSelected ? selectedColor : defaultColor,
    isSelected
  );

  // Применяем класс пульсации к выбранному маркеру через DOM
  useEffect(() => {
    if (markerRef.current) {
      const markerElement = markerRef.current.getElement();
      if (markerElement) {
        if (isSelected) {
          markerElement.classList.add('selected-marker');
        } else {
          markerElement.classList.remove('selected-marker');
        }
      }
    }
  }, [isSelected]);

  // Обработчик события окончания перетаскивания
  const handleDragEnd = (e: L.DragEndEvent) => {
    const marker = e.target;
    const position: [number, number] = [
      marker.getLatLng().lat,
      marker.getLatLng().lng,
    ];
    updatePlant(id, { position });
  };

  // Создаем объект обработчиков событий
  const eventHandlers = {
    click: onClick,
    dragend: handleDragEnd,
  };

  return (
    <Marker
      ref={markerRef}
      position={position}
      icon={icon}
      draggable={draggable}
      eventHandlers={eventHandlers}
    >
      {/* Всплывающая подсказка при наведении */}
      <Tooltip direction='top' offset={[0, -10]} opacity={0.9}>
        {name}
      </Tooltip>
    </Marker>
  );
};

export default MapMarker;
