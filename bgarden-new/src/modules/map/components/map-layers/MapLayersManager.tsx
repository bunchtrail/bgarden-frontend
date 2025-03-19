import React, { memo, useEffect, useState, ReactNode } from 'react';
import L from 'leaflet';
import 'leaflet.markercluster'; // Убедитесь, что этот пакет установлен
import { RegionData } from '../../types/mapTypes';
// Убираем импорт и используем локальное объявление
// import { MapLayerProps } from '../MapPage';
import { MapImageLayer, MapRegionsLayer } from '../map-components';
import { useMapLayers } from '../../hooks/useMapLayers';
import { MapConfig, MAP_LAYERS } from '../../contexts/MapConfigContext';
import { getAllSpecimens, convertSpecimensToPlants } from '../../services/plantService';
import { Plant } from '../../contexts/MapContext';
import { useMap } from 'react-leaflet';
import { MAP_COLORS } from '../../styles';
// Импортируем компонент напрямую, а не через индексный файл
import MapDrawingLayer from './MapDrawingLayer';

// Компонент слоя маркеров растений
const PlantMarkersLayer: React.FC<{ isVisible: boolean, mapConfig: MapConfig }> = ({ isVisible, mapConfig }) => {
  const [plants, setPlants] = useState<Plant[]>([]);
  const map = useMap();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [markerClusterGroup, setMarkerClusterGroup] = useState<L.MarkerClusterGroup | null>(null);
  const [markers, setMarkers] = useState<L.Marker[]>([]);

  // Функция для создания стилизованного маркера
  const createStyledMarkerIcon = (plant: Plant) => {
    // Определяем цвет маркера на основе имеющихся данных о растении
    // Можно улучшить логику в будущем, добавив больше вариаций
    let markerColor = MAP_COLORS.primary;
    let markerSize = 15;
    
    // Пытаемся определить тип растения по описанию или названию
    const latinName = plant.latinName?.toLowerCase() || '';
    const name = plant.name.toLowerCase();
    const description = plant.description?.toLowerCase() || '';
    
    // Примерная категоризация растений по названию или описанию
    if (latinName.includes('conifer') || name.includes('хвой') || description.includes('хвой')) {
      markerColor = '#2D8731'; // Темно-зеленый для хвойных
      markerSize = 14;
    } else if (latinName.includes('flower') || name.includes('цвет') || description.includes('цвет')) {
      markerColor = '#E86A33'; // Оранжевый для цветущих
      markerSize = 13;
    } else if (latinName.includes('shrub') || name.includes('куст') || description.includes('куст')) {
      markerColor = '#41924B'; // Зеленый для кустарников
      markerSize = 12;
    } else if (latinName.includes('tree') || name.includes('дерев') || description.includes('дерев')) {
      markerColor = '#1A5D1A'; // Темно-зеленый для деревьев
      markerSize = 16;
    }

    const halfSize = markerSize / 2;
    
    return L.divIcon({
      className: 'custom-plant-marker',
      html: `<div style="
        width: ${markerSize}px;
        height: ${markerSize}px;
        background-color: ${markerColor};
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
      "></div>`,
      iconSize: [markerSize, markerSize],
      iconAnchor: [halfSize, halfSize]
    });
  };

  // Функция для очистки всех маркеров и кластеров
  const clearAllMarkers = () => {
    if (markerClusterGroup && map) {
      map.removeLayer(markerClusterGroup);
      setMarkerClusterGroup(null);
    }
    
    markers.forEach(marker => marker.remove());
    setMarkers([]);
  };

  useEffect(() => {
    // Загружаем данные растений при монтировании компонента
    const loadPlants = async () => {
      try {
        const specimens = await getAllSpecimens();
        const plantsData = convertSpecimensToPlants(specimens);
        setPlants(plantsData);
      } catch (error) {
        console.error('Ошибка при загрузке данных растений:', error);
      }
    };

    if (isVisible) {
      loadPlants();
    } else {
      // Очищаем маркеры, если слой невидим
      clearAllMarkers();
    }
  }, [isVisible]);

  // Эффект для отрисовки маркеров на карте
  useEffect(() => {
    if (!isVisible || !map || plants.length === 0) {
      // Очищаем маркеры, если слой невидим или данные отсутствуют
      clearAllMarkers();
      return;
    }

    // Очищаем предыдущие маркеры
    clearAllMarkers();

    // Создаем маркеры растений
    const newMarkers: L.Marker[] = [];
    
    plants.forEach(plant => {
      const marker = L.marker(plant.position, {
        title: plant.name,
        icon: createStyledMarkerIcon(plant)
      }).bindPopup(`
        <div>
          <h3>${plant.name}</h3>
          <p><i>${plant.latinName || ''}</i></p>
          <p>${plant.description || ''}</p>
        </div>
      `);
      
      newMarkers.push(marker);
    });

    // Если кластеризация включена, используем MarkerClusterGroup
    if (mapConfig.enableClustering) {
      // Создаем группу кластеров
      const clusterGroup = L.markerClusterGroup({
        maxClusterRadius: 40,
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: false,
        zoomToBoundsOnClick: true,
        iconCreateFunction: (cluster) => {
          const count = cluster.getChildCount();
          // Определяем размер кластера в зависимости от количества маркеров
          let size = 30;
          if (count > 50) size = 40;
          else if (count > 20) size = 35;
          
          return L.divIcon({
            html: `<div style="
              display: flex;
              align-items: center;
              justify-content: center;
              width: ${size}px;
              height: ${size}px;
              background-color: ${MAP_COLORS.primary};
              color: white;
              border-radius: 50%;
              border: 2px solid white;
              box-shadow: 0 3px 6px rgba(0, 0, 0, 0.3);
              font-weight: bold;
              font-size: ${count > 99 ? '10px' : '12px'};
            ">${count > 99 ? '99+' : count}</div>`,
            className: 'plant-cluster-icon',
            iconSize: L.point(size, size)
          });
        }
      });

      // Добавляем маркеры в кластер
      newMarkers.forEach(marker => {
        clusterGroup.addLayer(marker);
      });

      // Добавляем группу кластеров на карту
      map.addLayer(clusterGroup);
      setMarkerClusterGroup(clusterGroup);
    } else {
      // Если кластеризация отключена, добавляем отдельные маркеры на карту
      newMarkers.forEach(marker => {
        marker.addTo(map);
      });
      setMarkers(newMarkers);
    }

    // Очистка маркеров при размонтировании компонента
    return () => {
      clearAllMarkers();
    };
  }, [isVisible, map, plants, mapConfig.enableClustering]);

  // Дополнительный эффект для очистки маркеров при изменении видимости
  useEffect(() => {
    if (!isVisible) {
      clearAllMarkers();
    }
    
    return () => {
      clearAllMarkers();
    };
  }, [isVisible]);

  return null; // Этот компонент не возвращает видимый React-элемент
};

// Интерфейс для пользовательских слоёв
export interface CustomMapLayerProps {
  isVisible: boolean;
  config?: Record<string, any>;
}

export interface MapLayerProps {
  layerId: string;
  order: number;
  component: React.ComponentType<CustomMapLayerProps>;
  isVisible: boolean;
  config?: Record<string, any>;
}

interface MapLayersManagerProps {
  visibleLayers: string[];
  mapImageUrl: string | null;
  imageBounds: L.LatLngBoundsExpression;
  regions: RegionData[];
  customLayers?: MapLayerProps[];
  mapConfig: MapConfig;
  onRegionClick?: (regionId: string) => void;
  selectedRegionIds?: string[];
  highlightSelected?: boolean;
  children?: ReactNode;
}

/**
 * Улучшенный компонент для управления слоями карты
 * Использует хук useMapLayers для эффективного управления видимостью и сортировкой слоев
 */
const MapLayersManager: React.FC<MapLayersManagerProps> = memo(({
  visibleLayers,
  mapImageUrl,
  imageBounds,
  regions,
  customLayers = [],
  mapConfig,
  onRegionClick,
  selectedRegionIds = [],
  highlightSelected = true
}) => {
  // Используем расширенный хук для управления слоями
  const {
    isLayerVisible,
    sortedLayers,
    hasMapImage,
    filteredRegions,
    shouldShowRegions
  } = useMapLayers({
    visibleLayers,
    customLayers,
    mapImageUrl,
    regions,
    config: mapConfig
  });

  // Фильтруем регионы по ID, если указаны
  const displayRegions = filteredRegions; // Всегда показываем все регионы

  // Сортируем слои по порядку (если указан)
  const sortedCustomLayers = [...customLayers].sort((a, b) => a.order - b.order);

  // Проверяем, что мы находимся внутри контекста Leaflet
  const renderLayers = () => {
    return (
      <>
        {/* Слой изображения карты */}
        {hasMapImage && isLayerVisible(MAP_LAYERS.IMAGERY) && mapImageUrl && (
          <MapImageLayer 
            imageUrl={mapImageUrl} 
            bounds={imageBounds}
          />
        )}
        
        {/* Слой регионов */}
        {shouldShowRegions && displayRegions.length > 0 && (
          <MapRegionsLayer 
            regions={displayRegions} 
            highlightSelected={highlightSelected}
            showTooltips={mapConfig.showTooltips}
            onClick={onRegionClick}
          />
        )}
        
        {/* Слой маркеров растений */}
        <PlantMarkersLayer isVisible={isLayerVisible('plants')} mapConfig={mapConfig} />
        
        {/* Слой для рисования областей (всегда доступен, видимость зависит от режима) */}
        <MapDrawingLayer 
          isVisible={mapConfig.drawingEnabled} 
          config={{
            color: '#3B82F6',
            fillColor: '#60A5FA',
            fillOpacity: 0.3,
            weight: 2
          }}
        />
        
        {/* Пользовательские слои в порядке их приоритета */}
        {sortedCustomLayers.map(layer => {
          const CustomLayer = layer.component;
          return (
            <CustomLayer 
              key={layer.layerId}
              isVisible={layer.isVisible && isLayerVisible(layer.layerId)}
              config={layer.config}
            />
          );
        })}
      </>
    );
  };

  return renderLayers();
});

export default MapLayersManager; 