// Компонент для кластеризации маркеров на карте
import L from 'leaflet';
import 'leaflet.markercluster/dist/leaflet.markercluster.js';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import React, { useMemo } from 'react';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { ClusteringSettings, Plant } from '../../contexts/MapContext';
import styles from '../../styles/map.module.css';
import MapMarker from './MapMarker';

// Интерфейс для свойств компонента
interface ClusteredMarkersProps {
  plants: Plant[];
  onPlantClick: (id: string) => void;
  isDraggable: boolean;
  clusteringSettings: ClusteringSettings;
}

// Компонент для кластеризации маркеров
const ClusteredMarkers: React.FC<ClusteredMarkersProps> = ({
  plants,
  onPlantClick,
  isDraggable,
  clusteringSettings,
}) => {
  // Создаем настройки кластеризации с улучшенным визуальным представлением
  const clusterOptions = useMemo(() => {
    return {
      showCoverageOnHover: false,
      spiderfyOnMaxZoom: true,
      disableClusteringAtZoom: 18,
      maxClusterRadius: 50, // Увеличено для лучшей группировки
      animate: true, // Включаем анимацию
      animateAddingMarkers: true, // Анимация при добавлении маркеров
      spiderfyDistanceMultiplier: 1.8, // Увеличено для лучшего распределения при раскрытии кластера
      zoomToBoundsOnClick: true,
      removeOutsideVisibleBounds: true, // Улучшает производительность
      iconCreateFunction: (cluster: any) => {
        const count = cluster.getChildCount();

        // Создаем стиль кластера на основе количества маркеров
        let size, fontSize, bgOpacity, strokeWidth;
        if (count < 10) {
          size = 38;
          fontSize = 14;
          bgOpacity = 0.85;
          strokeWidth = 2.5;
        } else if (count < 50) {
          size = 46;
          fontSize = 16;
          bgOpacity = 0.9;
          strokeWidth = 3;
        } else if (count < 100) {
          size = 54;
          fontSize = 18;
          bgOpacity = 0.92;
          strokeWidth = 3.5;
        } else {
          size = 60;
          fontSize = 20;
          bgOpacity = 0.95;
          strokeWidth = 4;
        }

        // Улучшенный SVG для кластера с двойным градиентом и эффектом свечения
        const svg = `
          <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="radialGrad" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="0%" style="stop-color:#10B981;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#059669;stop-opacity:${bgOpacity}" />
              </radialGradient>
              <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="2.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            <circle 
              cx="${size / 2}" 
              cy="${size / 2}" 
              r="${size / 2 - strokeWidth}" 
              fill="url(#radialGrad)" 
              stroke="#057857" 
              stroke-width="${strokeWidth}" 
              filter="url(#glow)"
            />
            <text 
              x="${size / 2}" 
              y="${size / 2 + fontSize / 3}" 
              font-size="${fontSize}px" 
              font-weight="bold" 
              text-anchor="middle" 
              fill="white" 
              style="text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);"
            >${count}</text>
          </svg>
        `;

        // Создаем base64 кодированную строку из SVG
        const iconUrl = `data:image/svg+xml;base64,${btoa(svg)}`;

        return new L.DivIcon({
          html: `<div class="${styles.clusterIconContainer}"><img src="${iconUrl}" /></div>`,
          className: `marker-cluster ${styles.markerCluster}`,
          iconSize: new L.Point(size, size),
          iconAnchor: new L.Point(size / 2, size / 2),
        });
      },
    };
  }, []); // Убираем зависимость от clusteringSettings

  // Если кластеризация отключена, рендерим маркеры без кластеров
  if (!clusteringSettings.enabled) {
    return (
      <>
        {plants.map((plant) => (
          <MapMarker
            key={plant.id}
            id={plant.id}
            position={plant.position}
            name={plant.name}
            onClick={() => onPlantClick(plant.id)}
            draggable={isDraggable}
          />
        ))}
      </>
    );
  }

  return (
    <MarkerClusterGroup 
      {...clusterOptions}
      key={`cluster-group-${plants.length}`}
      chunkedLoading={true} // Загрузка частями для лучшей производительности
    >
      {plants.map((plant) => (
        <MapMarker
          key={plant.id}
          id={plant.id}
          position={plant.position}
          name={plant.name}
          onClick={() => onPlantClick(plant.id)}
          draggable={isDraggable}
        />
      ))}
    </MarkerClusterGroup>
  );
};

export default ClusteredMarkers;
