import L from 'leaflet';
import 'leaflet.markercluster';
import { Plant } from '@/services/regions/types';
import { MarkerIconFactory } from '../utils/MarkerIconFactory';
import { specimenService } from '@/modules/specimens/services/specimenService';
import { MAP_MODES } from '@/modules/map/contexts/MapConfigContext';

interface AddMarkersOptions {
  fitBounds?: boolean;
}

interface CacheKey {
  mapType: string;
  specimenId: string;
}

// Расширяем тип Plant для поддержки mapType
interface PlantWithMapType extends Plant {
  mapType?: string;
}

/**
 * Класс для управления кластеризацией маркеров на карте
 */
export class MarkerClusterManager {
  private markerClusterGroup: L.MarkerClusterGroup;
  private markers: L.Marker[] = [];
  private map: L.Map;
  private popupImageCache: Map<string, string> = new Map();
  private showPopupOnClick: boolean;
  private currentPlants: PlantWithMapType[] = [];
  private interactionMode: string;

  /**
   * Создает новый менеджер кластеризации маркеров
   * @param map Карта Leaflet
   * @param showPopupOnClick Флаг, указывающий, нужно ли показывать попап при клике на маркер
   * @param interactionMode Текущий режим взаимодействия карты (VIEW, DELETE и т. д.)
   */
  constructor(
    map: L.Map,
    showPopupOnClick: boolean = true,
    interactionMode: string = MAP_MODES.VIEW
  ) {
    this.map = map;
    this.showPopupOnClick = showPopupOnClick;
    this.interactionMode = interactionMode;

    this.markerClusterGroup = L.markerClusterGroup({
      maxClusterRadius: 40,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
      iconCreateFunction: MarkerIconFactory.createClusterIcon,
    });

    this.map.addLayer(this.markerClusterGroup);
  }

  /**
   * Устанавливает настройку отображения попапов при клике
   * @param value Новое значение настройки
   */
  public setShowPopupOnClick(value: boolean): void {
    if (this.showPopupOnClick === value) return;
    
    this.showPopupOnClick = value;
    
    // Пересоздаем маркеры с новыми настройками попапов
    if (this.currentPlants.length > 0) {
      const markers = this.createPlantMarkers(this.currentPlants);
      this.addMarkersWithClustering(markers, { fitBounds: false });
    }
  }

  /**
   * Устанавливает текущий режим взаимодействия карты (VIEW, DELETE и т. д.)
   */
  public setInteractionMode(mode: string): void {
    this.interactionMode = mode;
  }

  /**
   * Создает содержимое попапа для растения
   * @param plant Данные растения
   * @returns HTML-содержимое попапа
   */
  private async createPopupContent(plant: PlantWithMapType): Promise<string> {
    let imageUrl = '/images/specimens/placeholder.jpg';

    // Извлекаем ID образца из ID растения (specimen-123 -> 123)
    const specimenIdMatch = plant.id.match(/specimen-(\d+)/);

    if (specimenIdMatch && specimenIdMatch[1]) {
      const specimenId = parseInt(specimenIdMatch[1], 10);
      const cacheKey = `${plant.mapType || 'default'}-${plant.id}`;

      // Проверяем кэш изображений
      if (this.popupImageCache.has(cacheKey)) {
        imageUrl = this.popupImageCache.get(cacheKey) || imageUrl;
      } else {
        try {
          // Получаем изображение растения
          const image = await specimenService.getSpecimenMainImage(specimenId);

          if (image && image.imageUrl) {
            // Используем полученный URL
            imageUrl = image.imageUrl;
            // Сохраняем в кэш
            this.popupImageCache.set(cacheKey, imageUrl);
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
          <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #1E293B;">${
            plant.name
          }</h3>
          ${
            plant.latinName
              ? `<p style="margin: 0 0 8px 0; font-size: 14px; font-style: italic; color: #475569;">${plant.latinName}</p>`
              : ''
          }
          ${
            plant.description
              ? `<p style="margin: 0; font-size: 14px; color: #64748B;">${plant.description}</p>`
              : ''
          }
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
  createPlantMarkers(plants: PlantWithMapType[]): L.Marker[] {
    // Сохраняем текущие растения для возможного пересоздания маркеров
    this.currentPlants = plants;

    return plants.map((plant) => {
      const marker = L.marker(plant.position, {
        title: plant.name,
        icon: MarkerIconFactory.createStyledMarkerIcon(plant),
      });

      // ===== Обработка клика по маркеру в зависимости от режима =====

      if (this.interactionMode === MAP_MODES.DELETE) {
        // В режиме удаления запрашиваем подтверждение и удаляем растение
        marker.on('click', (e: any) => {
          L.DomEvent.stop(e);
          const specimenIdMatch = plant.id.match(/specimen-(\d+)/);
          const specimenId = specimenIdMatch && specimenIdMatch[1] ? parseInt(specimenIdMatch[1], 10) : null;

          if (!specimenId) return;

          // Создаем красивый попап для подтверждения удаления образца
          this.showSpecimenDeletionPopup(plant, marker);
        });
      } else if (this.showPopupOnClick) {
        // Создаем пустой попап и привязываем к маркеру
        const popup = L.popup({
          className: 'plant-popup-container',
          maxWidth: 280,
          minWidth: 250,
          offset: [0, -10],
          autoPan: true,
          closeButton: true,
          closeOnClick: false,
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
            popup.setContent(
              '<div class="plant-popup-error">Ошибка загрузки данных</div>'
            );
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
   * @param options Опции добавления маркеров
   */
  addMarkersWithClustering(
    markers: L.Marker[],
    options: AddMarkersOptions = { fitBounds: true }
  ): void {
    this.clearAllMarkers(false); // Не очищаем кэш при обновлении маркеров
    
    // Оптимизируем кэш - очищаем только устаревшие записи
    if (this.currentPlants.length > 0) {
      const currentMapType = this.currentPlants[0]?.mapType || 'default';
      const currentSpecimenIds = this.currentPlants.map(plant => plant.id);
      this.clearStaleCache(currentMapType, currentSpecimenIds);
    }
    
    this.markers = markers;

    this.markerClusterGroup.addLayers(markers);

    if (options.fitBounds && markers.length > 0) {
      const bounds = this.markerClusterGroup.getBounds();
      if (bounds.isValid()) {
        this.map.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }

  /**
   * Добавляет маркеры на карту без кластеризации
   * @param markers Массив маркеров
   */
  addMarkersWithoutClustering(markers: L.Marker[]): void {
    this.clearAllMarkers(false); // Не очищаем кэш при обновлении маркеров
    
    // Оптимизируем кэш - очищаем только устаревшие записи
    if (this.currentPlants.length > 0) {
      const currentMapType = this.currentPlants[0]?.mapType || 'default';
      const currentSpecimenIds = this.currentPlants.map(plant => plant.id);
      this.clearStaleCache(currentMapType, currentSpecimenIds);
    }
    
    this.markers = markers;

    markers.forEach((marker) => {
      marker.addTo(this.map);
    });
  }

  /**
   * Очищает все маркеры и кластеры с карты
   * @param clearCache Флаг, указывающий, нужно ли очищать кэш изображений
   */
  clearAllMarkers(clearCache: boolean = true): void {
    this.markerClusterGroup.clearLayers();

    this.markers.forEach((marker) => marker.remove());
    this.markers = [];

    // Очищаем кэш изображений только если явно запрошено
    if (clearCache) {
      this.popupImageCache.clear();
    }
  }

  /**
   * Очищает устаревшие записи из кэша изображений
   * @param currentMapType Текущий тип карты
   * @param currentSpecimenIds Массив текущих ID образцов
   */
  clearStaleCache(currentMapType: string, currentSpecimenIds: string[]): void {
    Array.from(this.popupImageCache.keys()).forEach(key => {
      const [mapType, specimenId] = key.split('-');
      if (mapType !== currentMapType || !currentSpecimenIds.includes(specimenId)) {
        this.popupImageCache.delete(key);
      }
    });
  }

  /**
   * Показывает стилизованный попап для подтверждения удаления образца
   */
  private showSpecimenDeletionPopup(plant: PlantWithMapType, marker: L.Marker): void {
    // Создаем backdrop
    const backdrop = document.createElement('div');
    backdrop.className = 'fixed inset-0 z-[9999] flex items-center justify-center';
    backdrop.innerHTML = `
      <div class="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
      <div class="relative max-w-md w-full mx-4 rounded-xl overflow-hidden bg-white/80 border border-gray-200 shadow-md transform transition-all duration-300 scale-100 animate-fadeIn">
        <!-- Header -->
        <div class="flex items-center justify-between px-5 pt-4 pb-2">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <div>
              <h3 class="font-bold text-lg text-gray-900">Удаление образца</h3>
              <p class="text-sm text-gray-600">Это действие нельзя отменить</p>
            </div>
          </div>
        </div>

        <!-- Content -->
        <div class="px-5 py-4">
          <p class="text-sm text-gray-900 leading-relaxed">
            Вы действительно хотите удалить образец 
            <span class="font-semibold text-red-600">"${plant.name}"</span>?
          </p>
          ${plant.latinName ? `<p class="text-xs text-gray-500 mt-1 italic">${plant.latinName}</p>` : ''}
          <p class="text-xs text-gray-600 mt-2">
            Все данные, связанные с этим образцом, будут безвозвратно удалены.
          </p>
        </div>

        <!-- Footer -->
        <div class="px-5 py-3 border-t border-gray-200 flex justify-end space-x-3">
          <button class="px-6 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-600 border border-gray-200 hover:bg-white transition-all duration-300" data-action="cancel">
            Отмена
          </button>
          <button class="px-6 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-red-500 to-red-600 text-white hover:shadow-lg transition-all duration-300" data-action="confirm">
            Удалить
          </button>
        </div>
      </div>
    `;

    // Добавляем обработчики событий
    const cancelBtn = backdrop.querySelector('[data-action="cancel"]') as HTMLButtonElement;
    const confirmBtn = backdrop.querySelector('[data-action="confirm"]') as HTMLButtonElement;
    const backdropDiv = backdrop.querySelector('.absolute.inset-0') as HTMLDivElement;

    const closePopup = () => {
      backdrop.remove();
    };

    const handleConfirm = async () => {
      try {
        const specimenIdMatch = plant.id.match(/specimen-(\d+)/);
        const specimenId = specimenIdMatch && specimenIdMatch[1] ? parseInt(specimenIdMatch[1], 10) : null;
        
        if (specimenId) {
          await specimenService.deleteSpecimen(specimenId);
          // Удаляем маркер с карты и из кластера
          this.markerClusterGroup.removeLayer(marker);
          // Обновляем внутреннее состояние
          this.currentPlants = this.currentPlants.filter((p) => p.id !== plant.id);
        }
      } catch (error) {
        console.error('Ошибка при удалении образца:', error);
      } finally {
        closePopup();
      }
    };

    cancelBtn.addEventListener('click', closePopup);
    confirmBtn.addEventListener('click', handleConfirm);
    backdropDiv.addEventListener('click', closePopup);

    // Добавляем попап в DOM
    document.body.appendChild(backdrop);
  }
}
