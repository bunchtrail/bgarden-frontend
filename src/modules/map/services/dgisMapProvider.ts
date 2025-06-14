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
  maxZoom: 22, // Увеличиваем максимальный зум (после 18 тайлы будут растягиваться)
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
   * Проверка доступности тайлового сервиса 2ГИС.
   * Реализована через загрузку маленького изображения, что избавляет
   * от проблем 405 (Method Not Allowed) при HEAD-запросах и CORS-ограничений.
   */
  async checkAvailability(): Promise<boolean> {
    const testUrl = `https://tile0.maps.2gis.com/tiles?x=0&y=0&z=1&v=1`;

    return new Promise<boolean>((resolve) => {
      const img = new Image();

      const timer = setTimeout(() => {
        // если за 5 сек не загрузилось – считаем недоступным
        img.src = '';
        resolve(false);
      }, 5000);

      img.onload = () => {
        clearTimeout(timer);
        resolve(true);
      };

      img.onerror = () => {
        clearTimeout(timer);
        resolve(false);
      };

      img.src = testUrl;
    });
  }

  /**
   * Тестирование конкретного тайла для отладки
   */
  async testTile(x: number, y: number, z: number): Promise<boolean> {
    const testUrl = `https://tile0.maps.2gis.com/tiles?x=${x}&y=${y}&z=${z}&v=1`;
    
    return new Promise<boolean>((resolve) => {
      const img = new Image();

      const timer = setTimeout(() => {
        console.warn(`2ГИС тайл не загружен за 10 сек: z=${z}, x=${x}, y=${y}`);
        img.src = '';
        resolve(false);
      }, 10000);

      img.onload = () => {
        clearTimeout(timer);
        console.log(`2ГИС тайл успешно загружен: z=${z}, x=${x}, y=${y}`);
        resolve(true);
      };

      img.onerror = (error) => {
        clearTimeout(timer);
        console.error(`2ГИС тайл ошибка загрузки: z=${z}, x=${x}, y=${y}`, error);
        resolve(false);
      };

      img.src = testUrl;
    });
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
        maxZoom: this.getMaxZoom(), // Максимальный зум для пользователя
        minZoom: this.getMinZoom(),
        maxNativeZoom: 18, // 2ГИС предоставляет реальные тайлы до 18 зума
        detectRetina: false, // Отключаем для стабильности
        crossOrigin: false, // Убираем CORS проблемы
        updateWhenIdle: false,
        updateWhenZooming: false, // Отключаем для лучшей производительности
        keepBuffer: 2, // Уменьшаем буфер для экономии памяти
        tileSize: 256, // Стандартный размер тайлов 2ГИС
        zIndex: 1,
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