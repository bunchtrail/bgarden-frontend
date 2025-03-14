// Компонент маркера растения на карте

import L from 'leaflet';
import React, { useCallback, useMemo } from 'react';
import { Marker, useMap } from 'react-leaflet';
import { useMapContext } from '../../contexts';
import styles from '../../styles/map.module.css';

// Улучшенные SVG иконки для маркеров
const createMarkerIcon = (color: string, selected: boolean) => {
  const svgSize = selected ? 38 : 32;
  const dotSize = selected ? 18 : 14;
  const strokeWidth = selected ? 3 : 2;
  const strokeColor = color;
  const fillColor = selected ? color : 'white';
  const dotFillColor = selected ? 'white' : color;

  // SVG маркер с улучшенным дизайном и анимацией для выбранного состояния
  const svg = `
  <svg width="${svgSize}" height="${svgSize}" viewBox="0 0 ${svgSize} ${svgSize}" fill="none" xmlns="http://www.w3.org/2000/svg" class="${
    selected ? 'selected-marker' : ''
  }">
    <circle cx="${svgSize / 2}" cy="${svgSize / 2}" r="${
    svgSize / 2 - 2
  }" fill="${fillColor}" stroke="${strokeColor}" stroke-width="${strokeWidth}" ${
    selected ? 'filter="drop-shadow(0 0 3px rgba(22, 163, 74, 0.7))"' : ''
  } />
    <circle cx="${svgSize / 2}" cy="${svgSize / 2}" r="${
    dotSize / 2
  }" fill="${dotFillColor}" ${
    selected ? 'filter="drop-shadow(0 0 2px rgba(255, 255, 255, 0.9))"' : ''
  } />
  </svg>`;

  // Создаем base64 кодированную строку из SVG
  const iconUrl = `data:image/svg+xml;base64,${btoa(svg)}`;

  return new L.Icon({
    iconUrl,
    iconSize: [svgSize, svgSize],
    iconAnchor: [svgSize / 2, svgSize / 2],
    tooltipAnchor: [0, -svgSize / 2],
    className: selected ? `${styles.selectedMarker}` : `${styles.normalMarker}`,
  });
};

// Интерфейс для свойств компонента маркера
interface MapMarkerProps {
  id: string;
  position: [number, number];
  name: string;
  onClick: () => void;
  draggable?: boolean;
}

// Компонент маркера
const MapMarker: React.FC<MapMarkerProps> = ({
  id,
  position,
  name,
  onClick,
  draggable = false,
}) => {
  const map = useMap();
  const { updatePlant, specimensData, selectedPlantId } = useMapContext();

  // Определяем, выбран ли маркер
  const isSelected = selectedPlantId === id;

  // Находим данные о растении в specimensData по id
  const specimenData = useMemo(() => {
    // Извлекаем id из формата "specimen-{id}"
    if (id.startsWith('specimen-')) {
      const specimenId = parseInt(id.split('-')[1]);
      return specimensData.find((specimen) => specimen.id === specimenId);
    }
    return null;
  }, [id, specimensData]);

  // Создаем кастомный значок для маркера с использованием улучшенной функции
  const markerIcon = useMemo(() => {
    // Используем зеленый цвет для растений
    return createMarkerIcon('#059669', isSelected);
  }, [isSelected]);

  // Обработчик для окончания перетаскивания
  const handleDragEnd = useCallback(
    (e: L.DragEndEvent) => {
      const marker = e.target;
      const position: [number, number] = [
        marker.getLatLng().lat,
        marker.getLatLng().lng,
      ];
      updatePlant(id, { position });
    },
    [id, updatePlant]
  );

  // Обработчик нажатия на маркер - просто вызываем переданный onClick
  const handleMarkerClick = useCallback(() => {
    // Вызываем оригинальный обработчик для выбора маркера
    onClick();
    
    // Убираем открытие модального окна здесь, так как это делается в MapContainer
  }, [onClick]);

  return (
    <Marker
      position={position}
      icon={markerIcon}
      eventHandlers={{
        click: handleMarkerClick,
        dragend: handleDragEnd,
      }}
      draggable={draggable}
      zIndexOffset={isSelected ? 1000 : 0}
    />
  );
};

export default MapMarker;
