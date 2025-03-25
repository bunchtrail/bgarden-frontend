/**
 * Унифицированная фабрика для создания полигонов карты
 * Объединяет логику создания полигонов из разных компонентов
 * и решает проблемы с дублированием кода
 */

import L from 'leaflet';
import { RegionData, Area, CoordinatePoint } from './types';
import { 
  parseCoordinates, 
  calculatePolygonCenter, 
  REGION_COLORS, 
  isPointInPolygon, 
  isValidPolygon,
  calculatePolygonArea,
  convertPointsToPolygonCoordinates,
  getDefaultCoordinates,
  simplifyPolygon
} from './RegionUtils';
import { COLORS } from '@/styles/global-styles';
import { logError, logWarning } from '@/utils/logger';

// Расширяем типы для Leaflet
declare module 'leaflet' {
  // Добавляем кастомные свойства для полигона
  interface Polygon {
    _draggable?: L.Draggable;
    _initialLatLngs?: any;
    _startPoint?: L.Point;
    _path?: HTMLElement;
    // Не пытаемся изменить protected свойство, вместо этого добавляем метод получения карты
    getPolygonMap(): L.Map | undefined;
  }

  // Расширяем типы для DomEvent для поддержки Window
  namespace DomEvent {
    // Определяем тип EventHandlerFn, который принимает Event или MouseEvent
    type EventHandlerFnCustom = (event: Event | MouseEvent | L.LeafletEvent | L.LeafletMouseEvent) => void;
    
    function on(el: Window | HTMLElement, types: string, fn: EventHandlerFnCustom, context?: any): typeof DomEvent;
    function off(el: Window | HTMLElement, types: string, fn: EventHandlerFnCustom, context?: any): typeof DomEvent;
  }
}

/**
 * Интерфейс для опций полигона
 */
export interface PolygonOptions {
  strokeColor?: string;
  fillColor?: string;
  fillOpacity?: number;
  weight?: number;
  isSelected?: boolean;
  isDraggable?: boolean;
  areaId?: string;
}

/**
 * Интерфейс для стилей полигона
 */
export interface PolygonStyles {
  color: string;
  fillColor: string;
  fillOpacity: number;
  weight: number;
}

// Определяем тип функции для перемещения координат
type MoveLatLngsFn = (latlngs: any, dx: number, dy: number, map: L.Map) => any;

/**
 * Проверяет, является ли объект экземпляром Area
 */
export const isArea = (obj: any): obj is Area => {
  return obj && 'points' in obj && Array.isArray(obj.points);
};

/**
 * Проверяет, является ли объект экземпляром RegionData
 */
export const isRegionData = (obj: any): obj is RegionData => {
  return obj && 'polygonCoordinates' in obj;
};

/**
 * Метод для получения карты из полигона
 * Безопасный способ доступа к protected свойству _map
 */
L.Polygon.prototype.getPolygonMap = function(): L.Map | undefined {
  // @ts-ignore: мы знаем, что _map существует, но оно protected
  return this._map;
};

/**
 * Фабрика для создания полигонов Leaflet
 * Использует унифицированные типы Area и RegionData
 */
export class PolygonFactory {
  // Кэш для созданных полигонов
  private static polygonCache = new Map<string, L.Polygon>();

  // Максимальное количество точек для полигона без оптимизации
  private static MAX_POINTS_WITHOUT_OPTIMIZATION = 100;

  // Допуск для оптимизации полигона (чем меньше, тем точнее)
  private static POLYGON_SIMPLIFICATION_TOLERANCE = 0.00001;

  /**
   * Очищает кэш полигонов
   */
  static clearCache(): void {
    this.polygonCache.clear();
    logWarning('Кэш полигонов очищен');
  }

  /**
   * Создает стили для полигона на основе опций
   */
  static createStyles(
    options: Partial<PolygonOptions> = {}
  ): L.PathOptions {
    return {
      color: options.isSelected 
        ? REGION_COLORS.SELECTED.STROKE 
        : (options.strokeColor || REGION_COLORS.DEFAULT.STROKE),
      fillColor: options.isSelected 
        ? REGION_COLORS.SELECTED.FILL
        : (options.fillColor || REGION_COLORS.DEFAULT.FILL),
      fillOpacity: options.fillOpacity !== undefined 
        ? options.fillOpacity 
        : (options.isSelected ? REGION_COLORS.SELECTED.OPACITY : REGION_COLORS.DEFAULT.OPACITY),
      weight: options.isSelected ? 3 : (options.weight || 2),
      interactive: true,
      bubblingMouseEvents: false
    };
  }

  /**
   * Создает обработчики событий для полигона
   */
  static createEventHandlers<T extends { id: string | number }>(
    options: {
      isSelected?: boolean;
      onClick?: (id: string | number) => void;
    },
    region: T
  ): L.LeafletEventHandlerFnMap {
    const handlers: L.LeafletEventHandlerFnMap = {};
    
    if (options.onClick) {
      handlers.click = (e: L.LeafletMouseEvent) => {
        L.DomEvent.stopPropagation(e);
        options.onClick!(region.id);
      };
    }
    
    // Добавляем обработчики наведения мыши для визуального эффекта
    if (!options.isSelected) {
      let originalStyle: L.PathOptions | null = null;
      
      handlers.mouseover = (e: L.LeafletMouseEvent) => {
        const target = e.target;
        originalStyle = { 
          color: target.options.color,
          fillColor: target.options.fillColor,
          fillOpacity: target.options.fillOpacity,
          weight: target.options.weight || 2 // Устанавливаем значение по умолчанию
        };
        
        target.setStyle({
          color: REGION_COLORS.HOVER.STROKE,
          fillColor: REGION_COLORS.HOVER.FILL,
          fillOpacity: REGION_COLORS.HOVER.OPACITY,
          weight: (target.options.weight || 2) + 1 // Устанавливаем значение по умолчанию
        });
      };
      
      handlers.mouseout = (e: L.LeafletMouseEvent) => {
        if (originalStyle) {
          e.target.setStyle(originalStyle);
          originalStyle = null;
        }
      };
    }
    
    return handlers;
  }

  /**
   * Оптимизирует координаты полигона, если необходимо
   * @param points Исходные координаты полигона
   * @returns Оптимизированные координаты полигона
   */
  static optimizePolygonPoints(points: CoordinatePoint[]): CoordinatePoint[] {
    try {
      // Если полигон имеет слишком много точек, применяем оптимизацию
      if (points.length > this.MAX_POINTS_WITHOUT_OPTIMIZATION) {
        const optimizedPoints = simplifyPolygon(points, this.POLYGON_SIMPLIFICATION_TOLERANCE);
        logWarning(`Полигон оптимизирован: было ${points.length} точек, стало ${optimizedPoints.length}`);
        return optimizedPoints;
      }
      return points;
    } catch (error) {
      logError('Ошибка при оптимизации полигона', error);
      return points;
    }
  }

  /**
   * Создает полигон из массива координат
   */
  static createFromPoints(
    points: CoordinatePoint[],
    options: PolygonOptions & {
      onClick?: (id: string) => void;
    } = {}
  ): L.Polygon {
    try {
      // Проверяем достаточность координат и их валидность
      if (!points || points.length < 3) {
        logWarning('Недостаточно точек для создания полигона. Используются координаты по умолчанию.');
        points = getDefaultCoordinates();
      } else if (!isValidPolygon(points)) {
        logWarning('Полигон с некорректными координатами. Используются координаты по умолчанию.');
        points = getDefaultCoordinates();
      }
      
      // Создаем ключ для кэша
      const cacheKey = `${JSON.stringify(points)}_${JSON.stringify(options)}`;
      
      // Проверяем наличие полигона в кэше
      if (this.polygonCache.has(cacheKey)) {
        return this.polygonCache.get(cacheKey)!;
      }

      // Оптимизируем полигон для улучшения производительности
      const optimizedPoints = this.optimizePolygonPoints(points);

      // Создаем стили для полигона
      const pathOptions = this.createStyles(options);

      // Создаем полигон с оптимизированными координатами и стилями
      const polygon = L.polygon(optimizedPoints, pathOptions);

      // Если указан ID области, добавляем его в опции полигона
      if (options.areaId) {
        polygon.options.areaId = options.areaId;
      }

      // Если указан обработчик события клика, добавляем его
      if (options.onClick && options.areaId) {
        polygon.on('click', (e: L.LeafletMouseEvent) => {
          // Предотвращаем всплытие события, чтобы не вызвать двойное срабатывание
          L.DomEvent.stopPropagation(e);
          options.onClick!(options.areaId!);
        });
      }

      // Добавляем обработчики наведения мыши, если полигон не выбран
      if (!options.isSelected) {
        this.addHoverHandlers(polygon, pathOptions);
      }

      // Делаем полигон перетаскиваемым, если требуется
      if (options.isDraggable) {
        this.makePolygonDraggable(polygon);
      }
      
      // Сохраняем полигон в кэш
      this.polygonCache.set(cacheKey, polygon);

      return polygon;
    } catch (error) {
      logError('Ошибка при создании полигона', error);
      // Возвращаем пустой полигон в случае ошибки
      return L.polygon([]);
    }
  }
  
  /**
   * Добавляет обработчики наведения мыши к полигону
   */
  private static addHoverHandlers(polygon: L.Polygon, defaultStyles: L.PathOptions): void {
    polygon.on('mouseover', (e: L.LeafletMouseEvent) => {
      polygon.setStyle({
        color: REGION_COLORS.HOVER.STROKE,
        fillColor: REGION_COLORS.HOVER.FILL,
        fillOpacity: REGION_COLORS.HOVER.OPACITY,
        weight: (polygon.options.weight || 2) + 1
      });
    });
    
    polygon.on('mouseout', (e: L.LeafletMouseEvent) => {
      polygon.setStyle(defaultStyles);
    });
  }

  /**
   * Перемещает координаты полигона
   * @param latlngs Координаты полигона
   * @param dx Смещение по оси X
   * @param dy Смещение по оси Y
   * @param map Карта, на которой размещен полигон
   * @returns Новые координаты полигона
   */
  private static moveLatLngs(latlngs: any, dx: number, dy: number, map: L.Map): any {
    if (Array.isArray(latlngs[0]) && typeof latlngs[0][0] !== 'number') {
      // Многоуровневый массив (для многоугольников)
      return latlngs.map((ll: any) => this.moveLatLngs(ll, dx, dy, map));
    } else {
      // Одноуровневый массив (для простых полигонов)
      return latlngs.map((ll: L.LatLng) => {
        const point = map.latLngToContainerPoint(ll);
        const newPoint = new L.Point(point.x + dx, point.y + dy);
        return map.containerPointToLatLng(newPoint);
      });
    }
  }

  /**
   * Делает полигон перетаскиваемым
   */
  static makePolygonDraggable(polygon: L.Polygon): void {
    try {
      if (!polygon._path) {
        logWarning('Не удалось сделать полигон перетаскиваемым: нет DOM элемента');
        return;
      }

      // Сохраняем начальные координаты полигона
      polygon._initialLatLngs = polygon.getLatLngs();

      let isDragging = false;
      let startPoint: L.Point;

      // Получаем ссылку на карту для использования в обработчиках
      const map = polygon.getPolygonMap();
      
      if (!map) {
        logWarning('Не удалось сделать полигон перетаскиваемым: полигон не добавлен на карту');
        return;
      }

      // Оптимизация: используем привязку обработчиков к панели карты вместо window
      const mapContainer = map.getContainer();
      
      // Обработчик начала перетаскивания
      const onMouseDown = (e: L.LeafletEvent) => {
        // Предотвращаем всплытие события
        L.DomEvent.stopPropagation(e as any);
        L.DomEvent.preventDefault(e as any);
        
        // Устанавливаем флаг перетаскивания
        isDragging = true;
        
        // Запоминаем начальную точку
        const mouseEvent = e as L.LeafletMouseEvent;
        startPoint = map.mouseEventToContainerPoint(mouseEvent.originalEvent);
        
        // Добавляем класс для визуального эффекта перетаскивания
        L.DomUtil.addClass(mapContainer, 'leaflet-dragging');
        
        // Добавляем обработчики движения и окончания перетаскивания
        L.DomEvent.on(mapContainer, 'mousemove', onDrag as any);
        L.DomEvent.on(mapContainer, 'mouseup', onDragEnd as any);
      };
      
      // Обработчик перетаскивания
      const onDrag = (e: MouseEvent) => {
        if (!isDragging || !map) return;
        
        // Преобразуем события мыши в точки на карте
        const currentPoint = map.mouseEventToContainerPoint(e);
        const dx = currentPoint.x - startPoint.x;
        const dy = currentPoint.y - startPoint.y;
        
        // Если смещение слишком маленькое, игнорируем
        if (Math.abs(dx) < 2 && Math.abs(dy) < 2) return;
        
        // Обновляем начальную точку
        startPoint = currentPoint;
        
        // Перемещаем полигон
        const oldLatLngs = polygon.getLatLngs();
        const newLatLngs = PolygonFactory.moveLatLngs(oldLatLngs, dx, dy, map);
        polygon.setLatLngs(newLatLngs);
      };
      
      // Обработчик окончания перетаскивания
      const onDragEnd = (e: MouseEvent) => {
        // Удаляем обработчики движения и окончания
        L.DomEvent.off(mapContainer, 'mousemove', onDrag as any);
        L.DomEvent.off(mapContainer, 'mouseup', onDragEnd as any);
        
        // Сбрасываем флаг перетаскивания
        isDragging = false;
        
        // Удаляем класс для визуального эффекта
        L.DomUtil.removeClass(mapContainer, 'leaflet-dragging');
        
        // Обновляем начальные координаты полигона
        polygon._initialLatLngs = polygon.getLatLngs();
        
        // Вызываем событие окончания редактирования
        polygon.fire('dragend');
      };
      
      // Добавляем обработчик начала перетаскивания
      polygon.on('mousedown', onMouseDown);
    } catch (error) {
      logError('Ошибка при настройке перетаскивания полигона', error);
    }
  }

  /**
   * Создает полигон из объекта RegionData
   */
  static createFromRegion(
    region: RegionData,
    options: Partial<PolygonOptions> & {
      onClick?: (id: number) => void;
    } = {}
  ): L.Polygon {
    try {
      // Формируем уникальный ключ для кэша
      const cacheKey = `region_${region.id}_${JSON.stringify(options)}`;
      
      // Проверяем наличие полигона в кэше
      if (this.polygonCache.has(cacheKey)) {
        return this.polygonCache.get(cacheKey)!;
      }
      
      // Парсим координаты из строки
      const points = parseCoordinates(region.polygonCoordinates);
      
      // Создаем полигон с дополнительными опциями
      const extendedOptions: PolygonOptions & { onClick?: (id: string) => void } = {
        ...options,
        strokeColor: options.strokeColor || region.strokeColor,
        fillColor: options.fillColor || region.fillColor,
        fillOpacity: options.fillOpacity || region.fillOpacity,
        areaId: `region-${region.id}`,
        // Преобразуем обработчик клика для работы с числовыми ID
        onClick: options.onClick 
          ? (id: string) => {
              const regionId = parseInt(id.replace('region-', ''));
              options.onClick!(regionId);
            }
          : undefined
      };
      
      const polygon = this.createFromPoints(points, extendedOptions);
      
      // Сохраняем полигон в кэш
      this.polygonCache.set(cacheKey, polygon);
      
      return polygon;
    } catch (error) {
      logError(`Ошибка при создании полигона из региона ${region.id}`, error);
      // Возвращаем пустой полигон в случае ошибки
      return L.polygon([]);
    }
  }

  /**
   * Создает полигон из объекта Area
   */
  static createFromArea(
    area: Area,
    options: Partial<PolygonOptions> & {
      onClick?: (id: string) => void;
    } = {}
  ): L.Polygon {
    try {
      // Формируем уникальный ключ для кэша
      const cacheKey = `area_${area.id}_${JSON.stringify(options)}`;
      
      // Проверяем наличие полигона в кэше
      if (this.polygonCache.has(cacheKey)) {
        return this.polygonCache.get(cacheKey)!;
      }
      
      // Создаем полигон с дополнительными опциями
      const extendedOptions: PolygonOptions & { onClick?: (id: string) => void } = {
        ...options,
        strokeColor: options.strokeColor || area.strokeColor,
        fillColor: options.fillColor || area.fillColor,
        fillOpacity: options.fillOpacity || area.fillOpacity,
        isSelected: options.isSelected || area.selected,
        areaId: area.id,
        onClick: options.onClick
      };
      
      const polygon = this.createFromPoints(area.points, extendedOptions);
      
      // Сохраняем полигон в кэш
      this.polygonCache.set(cacheKey, polygon);
      
      return polygon;
    } catch (error) {
      logError(`Ошибка при создании полигона из области ${area.id}`, error);
      // Возвращаем пустой полигон в случае ошибки
      return L.polygon([]);
    }
  }
} 