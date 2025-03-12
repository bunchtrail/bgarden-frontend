// Компонент-контейнер для карты

import { CRS, LatLng, LatLngBounds } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import React, { useRef, useState } from 'react';
import {
  ImageOverlay,
  MapContainer as LeafletMapContainer,
  ZoomControl,
  useMapEvents,
} from 'react-leaflet';
import {
  COLORS,
  containerClasses,
  layoutClasses,
  textClasses,
} from '../../../../styles/global-styles';
import { useMapContext } from '../../contexts';
import styles from '../../styles/map.module.css';
import MapMarker from './MapMarker';
import PlantAddForm from './PlantAddForm';

// Компонент для отслеживания кликов по карте
const MapClickHandler: React.FC<{
  onMapClick: (position: [number, number]) => void;
}> = ({ onMapClick }) => {
  useMapEvents({
    click: (e) => {
      onMapClick([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
};

interface MapContainerProps {
  customImage?: string;
}

const MapContainer: React.FC<MapContainerProps> = ({
  customImage: propCustomImage,
}) => {
  const {
    customImage: contextCustomImage,
    setCustomImage,
    plants,
    selectedPlantId,
    setSelectedPlantId,
    loadingMap,
    loadMapError,
    loadMapFromServer,
    mapData,
  } = useMapContext();

  // Используем изображение из пропсов или из контекста
  const imageUrl = propCustomImage || contextCustomImage || '';

  const [imageDimensions, setImageDimensions] = useState<{
    width: number;
    height: number;
  }>({
    width: 1000,
    height: 800,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Состояние для добавления нового растения
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPlantPosition, setNewPlantPosition] = useState<
    [number, number] | null
  >(null);

  // Создаем границы изображения на основе его размеров
  const bounds = new LatLngBounds(
    new LatLng(0, 0), // Нижний левый угол
    new LatLng(imageDimensions.height, imageDimensions.width) // Верхний правый угол
  );

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setCustomImage(result);

        // Получаем размеры изображения
        const img = new Image();
        img.onload = () => {
          setImageDimensions({ width: img.width, height: img.height });
        };
        img.src = result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePlantClick = (plantId: string) => {
    setSelectedPlantId(plantId);
  };

  const handleMapClick = (position: [number, number]) => {
    setNewPlantPosition(position);
    setShowAddForm(true);
  };

  const handleCloseAddForm = () => {
    setShowAddForm(false);
    setNewPlantPosition(null);
  };

  const handleLoadMapClick = () => {
    loadMapFromServer();
  };

  return (
    <div className={layoutClasses.flexCol}>
      <div className={`${layoutClasses.flexWrap} gap-2 mb-4`}></div>

      {mapData && (
        <div className='mb-2'>
          <p className={textClasses.body}>
            Текущая карта: <strong>{mapData.name}</strong>
            {mapData.description && ` - ${mapData.description}`}
          </p>
        </div>
      )}

      {loadMapError && (
        <div
          className={`mb-2 p-2 bg-[${COLORS.DANGER_LIGHT}] border border-[${COLORS.DANGER}] text-[${COLORS.DANGER_DARK}] rounded-lg`}
        >
          <p className={textClasses.body}>{loadMapError}</p>
        </div>
      )}

      <div
        className={`${styles.mapContainer} border border-[${COLORS.SEPARATOR}] rounded-lg`}
      >
        {loadingMap ? (
          <div
            className={`h-full w-full ${layoutClasses.flexCenter} bg-[${COLORS.BACKGROUND}]`}
          >
            <p className={`${textClasses.body} ${textClasses.secondary}`}>
              Загрузка карты...
            </p>
          </div>
        ) : imageUrl ? (
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

            {/* Обработчик кликов по карте */}
            <MapClickHandler onMapClick={handleMapClick} />

            {/* Рендерим маркеры растений */}
            {plants.map((plant) => (
              <MapMarker
                key={plant.id}
                id={plant.id}
                position={plant.position}
                name={plant.name}
                onClick={() => handlePlantClick(plant.id)}
              />
            ))}
          </LeafletMapContainer>
        ) : (
          <div
            className={`h-full w-full ${layoutClasses.flexCenter} bg-[${COLORS.BACKGROUND}]`}
          >
            <p className={`${textClasses.body} ${textClasses.secondary}`}>
              Карта не загружена. Используйте кнопки выше для загрузки карты.
            </p>
          </div>
        )}

        {/* Форма добавления растения */}
        {showAddForm && newPlantPosition && (
          <div
            className={`absolute top-4 right-4 z-[1000] w-80 ${containerClasses.base}`}
          >
            <PlantAddForm
              position={newPlantPosition}
              onClose={handleCloseAddForm}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MapContainer;
