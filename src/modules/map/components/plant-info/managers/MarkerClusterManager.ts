import L from 'leaflet';
import { Plant } from '@/services/regions/types';
import { MarkerIconFactory } from '../utils/MarkerIconFactory';
import { specimenService } from '@/modules/specimens/services/specimenService';

/**
 * Класс для управления кластеризацией маркеров на карте
 */
export class MarkerClusterManager {
  private markerClusterGroup: L.MarkerClusterGroup | null = null;
  private markers: L.Marker[] = [];
  private map: L.Map;
  private popupImageCache: Map<string, string> = new Map();
  private showPopupOnClick: boolean;

  /**
   * Создает новый менеджер кластеризации маркеров
   * @param map Карта Leaflet
   * @param showPopupOnClick Флаг, указывающий, нужно ли показывать попап при клике на маркер
   */
  constructor(map: L.Map, showPopupOnClick: boolean = true) {
    this.map = map;
    this.showPopupOnClick = showPopupOnClick;
  }

  /**
   * Устанавливает настройку отображения попапов при клике
   * @param value Новое значение настройки
   */
  public setShowPopupOnClick(value: boolean): void {
    this.showPopupOnClick = value;
  }

  /**
   * Создает содержимое попапа для растения
   * @param plant Данные растения
   * @returns HTML-содержимое попапа
   */
  private async createPopupContent(plant: Plant): Promise<string> {
    let imageUrl = '/images/specimens/placeholder.jpg';
    
    // Извлекаем ID образца из ID растения (specimen-123 -> 123)
    const specimenIdMatch = plant.id.match(/specimen-(\d+)/);
    
    if (specimenIdMatch && specimenIdMatch[1]) {
      const specimenId = parseInt(specimenIdMatch[1], 10);
      
      // Проверяем кэш изображений
      if (this.popupImageCache.has(plant.id)) {
        imageUrl = this.popupImageCache.get(plant.id) || imageUrl;
      } else {
        try {
          // Получаем изображение растения
          const image = await specimenService.getSpecimenMainImage(specimenId);
          
          if (image && image.imageDataBase64) {
            // Преобразуем base64 в URL изображения
            imageUrl = `data:${image.contentType};base64,${image.imageDataBase64}`;
            // Сохраняем в кэш
            this.popupImageCache.set(plant.id, imageUrl);
          }
        } catch (error) {
          console.error('Ошибка при загрузке изображения для попапа:', error);
        }
      }
    }
    
    // HTML-структура попапа
    return `
      <div class="plant-popup" style="width: 250px; padding: 0;">
        <div style="position: relative; width: 100%; height: 150px; overflow: hidden;">
          <img src="${imageUrl}" alt="${plant.name}" 
            style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px 8px 0 0;"
          />
        </div>
        <div style="padding: 12px; background-color: white; border-radius: 0 0 8px 8px;">
          <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #1E293B;">${plant.name}</h3>
          ${plant.latinName ? `<p style="margin: 0 0 8px 0; font-size: 14px; font-style: italic; color: #475569;">${plant.latinName}</p>` : ''}
          ${plant.description ? `<p style="margin: 0; font-size: 14px; color: #64748B;">${plant.description}</p>` : ''}
          <div style="margin-top: 12px; text-align: right;">
            <a href="/specimens/${specimenIdMatch?.[1] || ''}" 
               style="background-color: #0EA5E9; color: white; padding: 6px 12px; border-radius: 4px; text-decoration: none; font-size: 14px;">
              Подробнее
            </a>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Создает маркеры для растений
   * @param plants Массив растений
   * @returns Массив маркеров Leaflet
   */
  createPlantMarkers(plants: Plant[]): L.Marker[] {
    return plants.map(plant => {
      const marker = L.marker(plant.position, {
        title: plant.name,
        icon: MarkerIconFactory.createStyledMarkerIcon(plant)
      });
      
      // Добавляем попап только если включена соответствующая настройка
      if (this.showPopupOnClick) {
        // Создаем пустой попап и привязываем к маркеру
        const popup = L.popup({
          className: 'plant-popup-container',
          maxWidth: 280,
          minWidth: 250,
          offset: [0, -10],
          autoPan: true,
          closeButton: true,
          closeOnClick: false
        }).setContent('<div class="plant-popup-loading">Загрузка...</div>');
        
        marker.bindPopup(popup);
        
        // Добавляем обработчик события открытия попапа
        marker.on('popupopen', async () => {
          try {
            // Загружаем содержимое попапа
            const content = await this.createPopupContent(plant);
            popup.setContent(content);
            popup.update();
          } catch (error) {
            console.error('Ошибка при загрузке данных для попапа:', error);
            popup.setContent('<div class="plant-popup-error">Ошибка загрузки данных</div>');
            popup.update();
          }
        });
      } else {
        // Если попапы отключены, добавляем класс к маркеру для визуального отображения
        const iconElement = marker.getElement();
        if (iconElement) {
          iconElement.classList.add('popup-disabled');
        }
      }
      
      return marker;
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
    
    // Очищаем кэш изображений при удалении всех маркеров
    this.popupImageCache.clear();
  }
} 
