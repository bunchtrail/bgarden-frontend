// Компонент-контейнер для карты

import L, { CRS, LatLngBounds } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import React from 'react';
import {
  ImageOverlay,
  MapContainer as LeafletMapContainer,
  Marker,
  Polygon,
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
import { MapMode } from '../../contexts/MapContext';
import styles from '../../styles/map.module.css';
import AreaForm from './AreaForm';
import ClusteredMarkers from './ClusteredMarkers';

// Компонент для отслеживания кликов и взаимодействия с картой
const MapEventHandler: React.FC = () => {
  const {
    currentMode,
    addPointToArea,
    addPlant,
    setSelectedPlantId,
    isDrawingComplete,
    savePosition,
  } = useMapContext();

  const map = useMapEvents({
    click: (e) => {
      const position: [number, number] = [e.latlng.lat, e.latlng.lng];

      // Обработка кликов в зависимости от режима
      if (currentMode === MapMode.ADD) {
        // В режиме добавления создаем новое растение
        addPlant({
          name: `Новое растение`,
          position,
          description: 'Кликните для редактирования',
        });
      } else if (currentMode === MapMode.AREA && !isDrawingComplete) {
        // В режиме области добавляем точку к полигону, если рисование не завершено
        addPointToArea(position);
      } else if (currentMode === MapMode.VIEW) {
        // В режиме просмотра сбрасываем выбор
        setSelectedPlantId(null);
      } else if (currentMode === MapMode.SELECT_LOCATION) {
        // В режиме выбора геопозиции сохраняем координаты клика
        savePosition(position);
      }
    },
  });

  return null;
};

// Тип для свойств компонента карты
interface MapContainerProps {
  loadingMap: boolean;
  imageUrl: string | null;
}

// Размеры карты по умолчанию
const defaultImageDimensions = {
  width: 1000,
  height: 1000,
};

const MapContainer: React.FC<MapContainerProps> = ({
  loadingMap,
  imageUrl,
}) => {
  // Используем контекст карты
  const {
    plants,
    currentMode,
    selectedPlantId,
    setSelectedPlantId,
    currentAreaPoints,
    areas,
    isDrawingComplete,
    selectedPosition,
    clusteringSettings,
  } = useMapContext();

  // Определяем размеры и границы изображения карты
  const imageDimensions = defaultImageDimensions;
  const bounds: LatLngBounds = new LatLngBounds(
    [0, 0],
    [imageDimensions.height, imageDimensions.width]
  );

  // Обработчик клика по растению
  const handlePlantClick = (id: string) => {
    if (currentMode === MapMode.VIEW || currentMode === MapMode.EDIT) {
      setSelectedPlantId(id);
    }
  };

  // Определяем класс для курсора в зависимости от режима
  const getMapCursorClass = () => {
    switch (currentMode) {
      case MapMode.ADD:
        return styles.cursorAdd;
      case MapMode.EDIT:
        return styles.cursorEdit;
      case MapMode.AREA:
        return isDrawingComplete ? '' : styles.cursorDraw;
      case MapMode.SELECT_LOCATION:
        return styles.cursorLocation;
      default:
        return '';
    }
  };

  // Создаем стиль для полигона области
  const areaStyle = {
    fillColor: '#3388ff',
    color: '#3388ff',
    weight: 2,
    opacity: 0.7,
    fillOpacity: 0.3,
  };

  // Создаем стиль для текущего полигона области
  const currentAreaStyle = {
    fillColor: '#ff3333',
    color: '#ff3333',
    weight: 2,
    opacity: 0.7,
    fillOpacity: 0.3,
  };

  // Иконка для точек области
  const areaPointIcon = new L.Icon({
    iconUrl:
      'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iOCIgY3k9IjgiIHI9IjgiIGZpbGw9IiNmZjMzMzMiIC8+PC9zdmc+',
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });

  // Иконка для маркера выбранной позиции
  const selectedPositionIcon = new L.Icon({
    iconUrl:
      'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTIiIGZpbGw9IiM0MmI3MmEiIHN0cm9rZT0iIzAwMDAwMCIgc3Ryb2tlLXdpZHRoPSIyIiAvPjwvc3ZnPg==',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });

  return (
    <div className={containerClasses.base}>
      <div className={`${styles.enhancedMapContainer} ${getMapCursorClass()}`}>
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
            style={{ height: '100%', width: '100%', minHeight: '85vh' }}
            zoomControl={false}
          >
            <ZoomControl position='bottomright' />
            <ImageOverlay bounds={bounds} url={imageUrl} />

            {/* Обработчик кликов и событий карты */}
            <MapEventHandler />

            {/* Используем кластеризованные маркеры для растений */}
            <ClusteredMarkers 
              plants={plants} 
              onPlantClick={handlePlantClick} 
              isDraggable={currentMode === MapMode.EDIT} 
              clusteringSettings={clusteringSettings}
            />

            {/* Рендерим сохраненные области */}
            {areas.map((area) => (
              <Polygon
                key={area.id}
                positions={area.points}
                pathOptions={areaStyle}
              />
            ))}

            {/* Рендерим текущую область в режиме рисования */}
            {currentMode === MapMode.AREA && currentAreaPoints.length > 0 && (
              <Polygon
                positions={currentAreaPoints}
                pathOptions={currentAreaStyle}
              />
            )}

            {/* Отображаем маркеры точек текущей области */}
            {currentMode === MapMode.AREA &&
              !isDrawingComplete &&
              currentAreaPoints.map((point, index) => (
                <Marker
                  key={`area-point-${index}`}
                  position={point}
                  icon={areaPointIcon}
                />
              ))}

            {/* Отображаем маркер выбранной позиции */}
            {selectedPosition && (
              <Marker
                position={[
                  selectedPosition.latitude,
                  selectedPosition.longitude,
                ]}
                icon={selectedPositionIcon}
              ></Marker>
            )}
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
      </div>

      {/* Форма создания области (отображается как модальное окно) */}
      <AreaForm />
    </div>
  );
};

export default MapContainer;
