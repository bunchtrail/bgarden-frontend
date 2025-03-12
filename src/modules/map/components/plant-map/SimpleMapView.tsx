// Упрощенный компонент карты для использования в других модулях
// Содержит только функциональность для отображения карты и добавления растений

import L, { CRS, LatLngBounds } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import React, { useCallback, useState } from 'react';
import {
  ImageOverlay,
  MapContainer as LeafletMapContainer,
  Marker,
  ZoomControl,
  useMapEvents,
} from 'react-leaflet';
import styles from '../../styles/map.module.css';
import MapMarker from './MapMarker';
import PlantAddForm from './PlantAddForm';

export interface SimpleMapViewProps {
  imageUrl: string | null;
  onAddPlant?: (
    position: [number, number],
    name: string,
    description: string
  ) => void;
  readOnly?: boolean;
  plants?: Array<{
    id: string;
    name: string;
    position: [number, number];
    description?: string;
  }>;
}

// Тип для координат позиции
export interface PositionData {
  position: [number, number];
  timestamp: number;
}

// Компонент обработчик событий карты
const MapEventsHandler: React.FC<{
  onPositionSelect: (position: [number, number]) => void;
  onPlantClick?: (id: string) => void;
  mode: 'select' | 'view';
  readOnly: boolean;
}> = ({ onPositionSelect, onPlantClick, mode, readOnly }) => {
  const map = useMapEvents({
    click: (e) => {
      if (readOnly) return;

      const position: [number, number] = [e.latlng.lat, e.latlng.lng];
      if (mode === 'select') {
        onPositionSelect(position);
      }
    },
  });

  return null;
};

// Размеры карты по умолчанию
const defaultImageDimensions = {
  width: 1000,
  height: 1000,
};

const SimpleMapView: React.FC<SimpleMapViewProps> = ({
  imageUrl,
  onAddPlant,
  readOnly = false,
  plants = [],
}) => {
  const [selectedPosition, setSelectedPosition] = useState<PositionData | null>(
    null
  );
  const [showAddForm, setShowAddForm] = useState(false);
  const [mode, setMode] = useState<'select' | 'view'>('view');

  // Обработчик выбора позиции
  const handlePositionSelect = useCallback((position: [number, number]) => {
    setSelectedPosition({
      position,
      timestamp: Date.now(),
    });
    setShowAddForm(true);
  }, []);

  // Обработчик закрытия формы
  const handleCloseForm = useCallback(() => {
    setShowAddForm(false);
  }, []);

  // Обработчик добавления растения
  const handleAddPlant = useCallback(
    (name: string, description: string) => {
      if (selectedPosition && onAddPlant) {
        onAddPlant(selectedPosition.position, name, description);
        setSelectedPosition(null);
        setShowAddForm(false);
      }
    },
    [selectedPosition, onAddPlant]
  );

  // Обработчик клика по растению
  const handlePlantClick = useCallback((id: string) => {
    // Реализация при необходимости
  }, []);

  // Определяем размеры и границы изображения карты
  const imageDimensions = defaultImageDimensions;
  const bounds: LatLngBounds = new LatLngBounds(
    [0, 0],
    [imageDimensions.height, imageDimensions.width]
  );

  // Иконка для маркера выбранной позиции
  const selectedPositionIcon = new L.Icon({
    iconUrl:
      'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTIiIGZpbGw9IiM0MmI3MmEiIHN0cm9rZT0iIzAwMDAwMCIgc3Ryb2tlLXdpZHRoPSIyIiAvPjwvc3ZnPg==',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });

  return (
    <div className={styles.simpleMapContainer}>
      {!readOnly && (
        <div className={styles.simpleMapControls}>
          <button
            className={`${styles.mapButton} ${
              mode === 'select' ? styles.active : ''
            }`}
            onClick={() => setMode('select')}
          >
            Выбрать позицию
          </button>
          <button
            className={`${styles.mapButton} ${
              mode === 'view' ? styles.active : ''
            }`}
            onClick={() => setMode('view')}
          >
            Просмотр
          </button>
        </div>
      )}

      <div
        className={`${styles.mapContainer} ${
          mode === 'select' ? styles.cursorLocation : ''
        }`}
      >
        {imageUrl ? (
          <LeafletMapContainer
            center={[imageDimensions.height / 2, imageDimensions.width / 2]}
            zoom={0}
            minZoom={-1}
            maxZoom={3}
            crs={CRS.Simple}
            style={{ height: '100%', width: '100%' }}
            zoomControl={false}
          >
            <ZoomControl position='bottomright' />
            <ImageOverlay bounds={bounds} url={imageUrl} />

            {/* Обработчик событий карты */}
            <MapEventsHandler
              onPositionSelect={handlePositionSelect}
              onPlantClick={handlePlantClick}
              mode={mode}
              readOnly={readOnly}
            />

            {/* Рендерим существующие растения */}
            {plants.map((plant) => (
              <MapMarker
                key={plant.id}
                id={plant.id}
                position={plant.position}
                name={plant.name}
                onClick={() => handlePlantClick(plant.id)}
                draggable={false}
              />
            ))}

            {/* Отображаем маркер выбранной позиции */}
            {selectedPosition && mode === 'select' && (
              <Marker
                position={selectedPosition.position}
                icon={selectedPositionIcon}
              />
            )}
          </LeafletMapContainer>
        ) : (
          <div className={styles.mapPlaceholder}>
            <p>Карта не загружена</p>
          </div>
        )}
      </div>

      {/* Форма добавления растения */}
      {showAddForm && selectedPosition && !readOnly && (
        <div className={styles.formOverlay}>
          <div className={styles.formContainer}>
            <PlantAddForm
              position={selectedPosition.position}
              onClose={handleCloseForm}
              onSubmit={(name, description) =>
                handleAddPlant(name, description)
              }
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleMapView;
