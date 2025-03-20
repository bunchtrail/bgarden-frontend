import L from 'leaflet';
import { Plant } from '../../../contexts/MapContext';
import { MarkerIconFactory } from '../utils/MarkerIconFactory';

/**
 * Класс для управления кластеризацией маркеров на карте
 */
export class MarkerClusterManager {
  private markerClusterGroup: L.MarkerClusterGroup | null = null;
  private markers: L.Marker[] = [];
  private map: L.Map;

  /**
   * Создает новый менеджер кластеризации маркеров
   * @param map Карта Leaflet
   */
  constructor(map: L.Map) {
    this.map = map;
  }

  /**
   * Создает маркеры для растений
   * @param plants Массив растений
   * @returns Массив маркеров Leaflet
   */
  createPlantMarkers(plants: Plant[]): L.Marker[] {
    return plants.map(plant => {
      return L.marker(plant.position, {
        title: plant.name,
        icon: MarkerIconFactory.createStyledMarkerIcon(plant)
      });
    });
  }

  /**
   * Добавляет маркеры на карту с кластеризацией
   * @param markers Массив маркеров
   */
  addMarkersWithClustering(markers: L.Marker[]): void {
    this.clearAllMarkers();
    this.markers = markers;

    this.markerClusterGroup = L.markerClusterGroup({
      maxClusterRadius: 40,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
      iconCreateFunction: MarkerIconFactory.createClusterIcon
    });

    markers.forEach(marker => {
      if (this.markerClusterGroup) {
        this.markerClusterGroup.addLayer(marker);
      }
    });

    this.map.addLayer(this.markerClusterGroup);
  }

  /**
   * Добавляет маркеры на карту без кластеризации
   * @param markers Массив маркеров
   */
  addMarkersWithoutClustering(markers: L.Marker[]): void {
    this.clearAllMarkers();
    this.markers = markers;

    markers.forEach(marker => {
      marker.addTo(this.map);
    });
  }

  /**
   * Очищает все маркеры и кластеры с карты
   */
  clearAllMarkers(): void {
    if (this.markerClusterGroup) {
      this.map.removeLayer(this.markerClusterGroup);
      this.markerClusterGroup = null;
    }
    
    this.markers.forEach(marker => marker.remove());
    this.markers = [];
  }
} 