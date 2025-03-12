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
  // Создаем настройки кластеризации с фиксированными значениями
  const clusterOptions = useMemo(() => {
    return {
      showCoverageOnHover: false,
      spiderfyOnMaxZoom: true,
      disableClusteringAtZoom: 18,
      maxClusterRadius: 40,
      animate: false,
      animateAddingMarkers: false,
      spiderfyDistanceMultiplier: 1.5,
      zoomToBoundsOnClick: true,
      removeOutsideVisibleBounds: false,
      iconCreateFunction: (cluster: any) => {
        const count = cluster.getChildCount();

        // Создаем стиль кластера на основе количества маркеров
        let size, fontSize;
        if (count < 10) {
          size = 36;
          fontSize = 14;
        } else if (count < 100) {
          size = 44;
          fontSize = 16;
        } else {
          size = 52;
          fontSize = 18;
        }

        // SVG для кластера с градиентом
        const svg = `
          <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#10B981;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#059669;stop-opacity:1" />
              </linearGradient>
            </defs>
            <circle cx="${size / 2}" cy="${size / 2}" r="${
          size / 2 - 2
        }" fill="url(#grad)" stroke="#059669" stroke-width="2" />
            <text x="${size / 2}" y="${
          size / 2 + fontSize / 3
        }" font-size="${fontSize}px" font-weight="bold" text-anchor="middle" fill="white">${count}</text>
          </svg>
        `;

        // Создаем base64 кодированную строку из SVG
        const iconUrl = `data:image/svg+xml;base64,${btoa(svg)}`;

        return new L.DivIcon({
          html: `<div class="${styles.clusterIconContainer}"><img src="${iconUrl}" /></div>`,
          className: `marker-cluster ${styles.markerCluster}`,
          iconSize: new L.Point(size, size),
          iconAnchor: new L.Point(size / 2, size / 2),
          popupAnchor: new L.Point(0, -size / 2),
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
