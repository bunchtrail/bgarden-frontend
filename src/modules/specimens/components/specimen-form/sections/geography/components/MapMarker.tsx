import React, { useEffect, useState, useCallback } from 'react';
import L from 'leaflet';
import { useMap, Marker, Popup, useMapEvents } from 'react-leaflet';

interface MapMarkerProps {
  position: [number, number] | null;
  onPositionChange: (lat: number, lng: number) => void;
}

export const MapMarker: React.FC<MapMarkerProps> = ({ position, onPositionChange }) => {
  const map = useMap();
  const [isInteracting, setIsInteracting] = useState(false);
  
  // Подготавливаем слои карты для лучшей обработки кликов
  useEffect(() => {
    if (!map) return;

    // Применяем дополнительные настройки для карты
    const container = map.getContainer();
    container.style.cursor = 'crosshair';

    // Настраиваем все слои карты на правильную обработку кликов
    const panes = [
      'overlayPane',
      'markerPane',
      'shadowPane',
      'popupPane',
      'tooltipPane'
    ];

    panes.forEach(paneName => {
      const pane = map.getPane(paneName);
      if (pane) {
        pane.style.pointerEvents = 'auto';
      }
    });

  }, [map]);
  
  // Улучшенный обработчик клика по карте с обработкой различных элементов
  const handleMapClick = useCallback((e: L.LeafletMouseEvent) => {
    // Не обрабатываем клик, если идет взаимодействие с картой
    if (isInteracting) return;

    // Пропускаем обработку клика, если клик был на маркере
    if (e.originalEvent && e.originalEvent.target) {
      const target = e.originalEvent.target as HTMLElement;
      
      // Проверка на клик по маркеру или его элементам
      if (
        target.closest('.custom-plant-marker') || 
        target.closest('.leaflet-marker-icon') || 
        target.closest('.leaflet-marker-shadow')
      ) {
        console.log('Клик на маркере, игнорируем');
        return;
      }
    }
    
    const { lat, lng } = e.latlng;
    
    // Логируем событие для отладки
    console.log('Клик по карте:', { lat, lng, originalEvent: e.originalEvent?.target });
    
    // Принудительно останавливаем всплытие события, чтобы региональный слой не перехватил его
    if (e.originalEvent) {
      e.originalEvent.stopPropagation();
    }
    
    // Приводим координаты к числам с фиксированной точностью для избежания ошибок округления
    const latFixed = parseFloat(lat.toFixed(6));
    const lngFixed = parseFloat(lng.toFixed(6));
    
    onPositionChange(latFixed, lngFixed);
  }, [onPositionChange, isInteracting]);
  
  // Перехватываем все возможные события клика на карте
  useMapEvents({
    click: handleMapClick,
    // Стандартные события для отслеживания взаимодействия с картой
    dragstart: () => setIsInteracting(true),
    dragend: () => setTimeout(() => setIsInteracting(false), 300),
    zoomstart: () => setIsInteracting(true),
    zoomend: () => setTimeout(() => setIsInteracting(false), 300),
    movestart: () => setIsInteracting(true),
    moveend: () => setTimeout(() => setIsInteracting(false), 300)
  });
  
  // Запасной обработчик для прямого перехвата кликов на всех слоях
  useEffect(() => {
    if (!map) return;
    
    const handleDirectClick = (e: MouseEvent) => {
      // Пропускаем обработку, если идет взаимодействие с картой
      if (isInteracting) return;
      
      // Проверка на клик по маркеру
      const target = e.target as HTMLElement;
      if (
        target.closest('.custom-plant-marker') || 
        target.closest('.leaflet-marker-icon') || 
        target.closest('.leaflet-marker-shadow')
      ) {
        // Клик на маркере, игнорируем
        return;
      }
      
      // Если клик был на сложном элементе (полигоне) и не обработан
      if (target.closest('.leaflet-overlay-pane') || target.closest('path')) {
        const point = map.mouseEventToLatLng(e);
        
        // Проверка на валидные координаты
        if (point && isFinite(point.lat) && isFinite(point.lng)) {
          console.log('Прямой клик на слое:', point, e.target);
          
          // Останавливаем дальнейшее распространение события
          e.stopPropagation();
          e.preventDefault();
          
          onPositionChange(point.lat, point.lng);
        }
      }
    };
    
    // Добавляем прослушивание клика прямо на контейнер карты
    // с высоким приоритетом перехвата
    const container = map.getContainer();
    container.addEventListener('click', handleDirectClick, true);
    
    return () => {
      container.removeEventListener('click', handleDirectClick, true);
    };
  }, [map, onPositionChange, isInteracting]);
  
  // CSS класс для состояния взаимодействия
  useEffect(() => {
    const mapContainer = map.getContainer();
    
    if (isInteracting) {
      mapContainer.classList.add('map-interacting');
    } else {
      mapContainer.classList.remove('map-interacting');
    }
    
    return () => {
      mapContainer.classList.remove('map-interacting');
    };
  }, [isInteracting, map]);
  
  if (!position) return null;
  
  // Создаем стилизованный зеленый значок маркера с улучшенной видимостью
  const greenMarkerIcon = L.divIcon({
    className: 'custom-plant-marker',
    html: `<div style="
      width: 16px;
      height: 16px;
      background-color: #2D8731;
      border-radius: 50%;
      border: 2px solid white;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
      transition: all 0.15s ease;
    "></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8]
  });
  
  return (
    <Marker 
      position={position}
      draggable={true}
      icon={greenMarkerIcon}
      autoPan={true}
      zIndexOffset={1000} // Высокий z-index для маркера
      eventHandlers={{
        dragend: (e) => {
          const marker = e.target;
          const position = marker.getLatLng();
          const latFixed = parseFloat(position.lat.toFixed(6));
          const lngFixed = parseFloat(position.lng.toFixed(6));
          onPositionChange(latFixed, lngFixed);
        },
        drag: (e) => {
          const marker = e.target;
          const position = marker.getLatLng();
          const latFixed = parseFloat(position.lat.toFixed(6));
          const lngFixed = parseFloat(position.lng.toFixed(6));
          onPositionChange(latFixed, lngFixed);
        }
      }}
    >
      <Popup>
        <div className="text-center">
          <div className="font-medium">Положение растения</div>
          <div className="text-sm text-gray-600 mt-1">Перетащите маркер для изменения</div>
        </div>
      </Popup>
    </Marker>
  );
};

export default MapMarker; 