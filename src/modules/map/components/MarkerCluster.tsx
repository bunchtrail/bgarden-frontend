import React, { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import { useMap } from 'react-leaflet';
import { MapMarker, MarkerType } from '../types';

interface MarkerClusterProps {
  markers: MapMarker[];
}

// Компонент кластеризации маркеров
export const MarkerCluster: React.FC<MarkerClusterProps> = ({ markers }) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    // Создание слоя для группировки маркеров
    const markerClusterGroup = L.markerClusterGroup({
      showCoverageOnHover: false,
      maxClusterRadius: 35,
      iconCreateFunction: (cluster) => {
        const childCount = cluster.getChildCount();
        
        let size = 'small';
        if (childCount > 20) {
          size = 'large';
        } else if (childCount > 10) {
          size = 'medium';
        }
        
        return L.divIcon({
          html: `<div><span>${childCount}</span></div>`,
          className: `marker-cluster marker-cluster-${size}`,
          iconSize: new L.Point(40, 40),
        });
      },
    });

    // Получение иконки для маркера
    const getMarkerIcon = (type: MarkerType): L.Icon => {
      let iconUrl = '';
      
      switch (type) {
        case MarkerType.PLANT:
          iconUrl = '/images/markers/plant-marker.png';
          break;
        case MarkerType.EXPOSITION:
          iconUrl = '/images/markers/exposition-marker.png';
          break;
        case MarkerType.FACILITY:
          iconUrl = '/images/markers/facility-marker.png';
          break;
        case MarkerType.ENTRANCE:
          iconUrl = '/images/markers/entrance-marker.png';
          break;
        default:
          iconUrl = '/images/markers/default-marker.png';
      }
      
      return L.icon({
        iconUrl,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      });
    };

    // Добавление маркеров в кластер
    markers.forEach((marker) => {
      const icon = getMarkerIcon(marker.type);
      
      const leafletMarker = L.marker([marker.lat, marker.lng], {
        icon,
        title: marker.title,
      });
      
      // Добавление всплывающего окна
      if (marker.description || marker.popupContent) {
        let popupContent = `<div>
          <h4 class="font-semibold">${marker.title}</h4>`;
        
        if (marker.description) {
          popupContent += `<p class="text-sm">${marker.description}</p>`;
        }
        
        if (marker.popupContent) {
          popupContent += marker.popupContent;
        }
        
        if (marker.specimenId) {
          popupContent += `
            <a href="/specimens/${marker.specimenId}" 
               class="text-blue-600 hover:underline text-sm mt-2 block">
              Подробнее о растении
            </a>`;
        }
        
        popupContent += '</div>';
        
        leafletMarker.bindPopup(popupContent);
      }
      
      markerClusterGroup.addLayer(leafletMarker);
    });

    // Добавление группы маркеров на карту
    map.addLayer(markerClusterGroup);

    // Очистка при размонтировании компонента
    return () => {
      map.removeLayer(markerClusterGroup);
    };
  }, [map, markers]);

  return null;
}; 