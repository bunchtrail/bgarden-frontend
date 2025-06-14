/**
 * Провайдер карты 2ГИС
 * Содержит настройки и утилиты для работы с картами 2ГИС
 */

import { LatLngExpression } from 'leaflet';

export interface DgisMapSettings {
  zoom: number;
  tile_url: string;
  subdomains: string[];
  attribution: string;
  maxZoom?: number;
  minZoom?: number;
  center?: LatLngExpression;
}

/**
 * Настройки карты 2ГИС по умолчанию
 */
export const DEFAULT_DGIS_SETTINGS: DgisMapSettings = {
  zoom: 13,
  tile_url: "https://tile{s}.maps.2gis.com/tiles?x={x}&y={y}&z={z}&v=1",
  subdomains: ["0", "1", "2", "3"],
  attribution: "&copy; 2ГИС",
  maxZoom: 18,
  minZoom: 8,
  center: [58.596323, 49.666755], // Координаты ботанического сада в Кирове
};

/**
 * Класс провайдера карты 2ГИС
 */
export class DgisMapProvider {
  private settings: DgisMapSettings;

  constructor(customSettings?: Partial<DgisMapSettings>) {
    this.settings = {
      ...DEFAULT_DGIS_SETTINGS,
      ...customSettings,
    };
  }

  /**
   * Получить настройки карты
   */
  getSettings(): DgisMapSettings {
    return { ...this.settings };
  }

  /**
   * Обновить настройки карты
   */
  updateSettings(newSettings: Partial<DgisMapSettings>): void {
    this.settings = {
      ...this.settings,
      ...newSettings,
    };
  }

  /**
   * Получить URL для тайлов
   */
  getTileUrl(): string {
    return this.settings.tile_url;
  }

  /**
   * Получить поддомены
   */
  getSubdomains(): string[] {
    return [...this.settings.subdomains];
  }

  /**
   * Получить атрибуцию
   */
  getAttribution(): string {
    return this.settings.attribution;
  }

  /**
   * Получить центр карты
   */
  getCenter(): LatLngExpression {
    return this.settings.center || DEFAULT_DGIS_SETTINGS.center!;
  }

  /**
   * Получить масштаб по умолчанию
   */
  getZoom(): number {
    return this.settings.zoom;
  }

  /**
   * Получить максимальный масштаб
   */
  getMaxZoom(): number {
    return this.settings.maxZoom || DEFAULT_DGIS_SETTINGS.maxZoom!;
  }

  /**
   * Получить минимальный масштаб
   */
  getMinZoom(): number {
    return this.settings.minZoom || DEFAULT_DGIS_SETTINGS.minZoom!;
  }

  /**
   * Проверить доступность сервиса 2ГИС
   */
  async checkAvailability(): Promise<boolean> {
    try {
      const testUrl = `https://tile0.maps.2gis.com/tiles?x=0&y=0&z=1&v=1`;
      const response = await fetch(testUrl, { 
        method: 'HEAD',
        mode: 'no-cors'
      });
      return true;
    } catch (error) {
      console.warn('2ГИС service is not available:', error);
      return false;
    }
  }

  /**
   * Получить полную конфигурацию для Leaflet
   */
  getLeafletConfig() {
    return {
      url: this.getTileUrl(),
      options: {
        attribution: this.getAttribution(),
        subdomains: this.getSubdomains(),
        maxZoom: this.getMaxZoom(),
        minZoom: this.getMinZoom(),
        maxNativeZoom: 18,
        detectRetina: true,
        crossOrigin: true,
        updateWhenIdle: false,
        updateWhenZooming: true,
        keepBuffer: 4,
      },
    };
  }
}

/**
 * Экземпляр провайдера по умолчанию
 */
export const dgisMapProvider = new DgisMapProvider();

/**
 * Фабрика для создания кастомного провайдера
 */
export const createDgisMapProvider = (settings?: Partial<DgisMapSettings>) => {
  return new DgisMapProvider(settings);
}; 