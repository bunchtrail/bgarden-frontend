/**
 * Унифицированная фабрика для создания полигонов карты
 * Объединяет логику создания полигонов из разных компонентов
 * и решает проблемы с дублированием кода
 */

import L from 'leaflet';
import { RegionData } from '@/modules/map/types/mapTypes';
import { Area } from '@/modules/map/contexts/MapContext';
import { parseCoordinates, calculatePolygonCenter, REGION_COLORS, isPointInPolygon } from '@/utils/regionUtils';
import { COLORS } from '@/styles/global-styles';

// Расширяем интерфейс Polygon для добавления кастомных свойств
declare module 'leaflet' {
  interface Polygon {
    _draggable?: L.Draggable;
    _initialLatLngs?: any;
    _startPoint?: L.Point;
    _path?: HTMLElement;
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
 * Интерфейс стилей полигона для Leaflet
 */
export interface PolygonStyles extends L.PathOptions {
  color: string;
  fillColor: string;
  fillOpacity: number;
  weight: number;
  opacity: number;
}

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
 * Унифицированная фабрика для создания полигонов
 */
export class PolygonFactory {
  /**
   * Создает стили для полигона
   */
  static createStyles(
    options: PolygonOptions = {},
    region?: RegionData | Area
  ): PolygonStyles {
    const {
      strokeColor = COLORS.primary.main,
      fillColor = COLORS.primary.light,
      fillOpacity = 0.3,
      weight = 2,
      isSelected = false
    } = options;

    return {
      color: isSelected ? COLORS.primary.dark : (region?.strokeColor || strokeColor),
      fillColor: isSelected ? COLORS.primary.main : (region?.fillColor || fillColor),
      fillOpacity: isSelected ? 0.4 : (region?.fillOpacity || fillOpacity),
      weight: isSelected ? 3 : weight,
      opacity: 0.8
    };
  }

  /**
   * Создает обработчики событий для полигона
   */
  static createEventHandlers(
    options: {
      isSelected?: boolean;
      onClick?: (id: string | number) => void;
    } = {},
    region?: RegionData | Area
  ) {
    const { isSelected = false, onClick } = options;
    
    // Определяем ID для обработчика клика
    let id: string | number = '';
    
    if (region) {
      if (isArea(region)) {
        id = region.id;
      } else if (isRegionData(region)) {
        id = `region-${region.id}`;
      }
    }
    
    return {
      click: () => {
        if (onClick && id) onClick(id);
      },
      mouseover: (e: any) => {
        const layer = e.target;
        layer.setStyle({
          fillOpacity: 0.5,
          weight: isSelected ? 3 : 2.5,
        });
      },
      mouseout: (e: any) => {
        const layer = e.target;
        const fillOpacityValue = isSelected 
          ? 0.4 
          : (region?.fillOpacity || 0.3);
          
        layer.setStyle({
          fillOpacity: fillOpacityValue,
          weight: isSelected ? 3 : 2,
        });
      }
    };
  }

  /**
   * Делает полигон перетаскиваемым
   */
  static makePolygonDraggable(polygon: L.Polygon): void {
    // @ts-ignore - обход ограничений типизации Leaflet
    if (!L.EditToolbar || !L.EditToolbar.Edit) {
      console.warn('Leaflet Edit plugin не найден. Перетаскивание недоступно.');
      return;
    }

    // Создаем редактор, если его еще нет
    if (!polygon.editing) {
      polygon.editing = {
        enable: () => {},
        disable: () => {}
      };
    }

    // Добавляем обработчики для drag & drop
    let isDragging = false;
    let startPoint: L.Point | null = null;
    let initialLatLngs: any = null;

    polygon.on('mousedown', (e: any) => {
      isDragging = true;
      startPoint = e.containerPoint;
      initialLatLngs = JSON.parse(JSON.stringify(polygon.getLatLngs()));
      
      // Изменяем курсор при перетаскивании
      if (polygon._path) {
        polygon._path.style.cursor = 'grabbing';
      }
    });

    // Обработчик движения мыши
    polygon.on('mousemove', (e: any) => {
      if (!isDragging || !startPoint || !initialLatLngs) return;
      
      const map = e.target._map;
      const currentPoint = e.containerPoint;
      const diff = currentPoint.subtract(startPoint);
      
      // Смещаем каждую точку полигона
      let latlngs = JSON.parse(JSON.stringify(initialLatLngs));
      const moveLatLng = (point: any) => {
        const pixelPoint = map.latLngToContainerPoint(point);
        const newPixel = pixelPoint.add(diff);
        return map.containerPointToLatLng(newPixel);
      };
      
      // Рекурсивно обходим все точки (включая вложенные массивы)
      const processPoints = (points: any): any => {
        if (!Array.isArray(points)) return points;
        if (points.length === 0) return points;
        
        // Проверяем, является ли точка объектом LatLng
        if (typeof points === 'object' && 'lat' in points && 'lng' in points) {
          return moveLatLng(points);
        }
        
        // Если это массив точек или массив массивов
        return points.map(processPoints);
      };
      
      // Применяем смещение ко всем точкам
      const newLatLngs = processPoints(latlngs);
      polygon.setLatLngs(newLatLngs);
    });

    // Завершение перетаскивания
    polygon.on('mouseup', (e: any) => {
      isDragging = false;
      startPoint = null;
      initialLatLngs = null;
      
      // Восстанавливаем курсор
      if (polygon._path) {
        polygon._path.style.cursor = 'pointer';
      }
    });
    
    // Обработка выхода за пределы полигона
    polygon.on('mouseout', () => {
      if (isDragging) {
        isDragging = false;
        startPoint = null;
        initialLatLngs = null;
      }
    });
  }

  /**
   * Создает полигон из точек координат с указанными стилями
   */
  static createFromPoints(
    points: [number, number][],
    options: {
      areaId: string;
      strokeColor?: string;
      fillColor?: string; 
      fillOpacity?: number;
      weight?: number;
      isSelected?: boolean;
      isDraggable?: boolean;
      onClick?: (id: string | number) => void;
    }
  ): L.Polygon {
    if (points.length < 3) {
      return L.polygon([]);
    }
    
    // Создаем объект опций для Leaflet
    const pathOptions: Record<string, any> = {
      ...this.createStyles(options),
      areaId: options.areaId
    };
    
    // Создаем полигон
    const polygon = L.polygon(points, pathOptions);
    
    // Добавляем обработчики событий
    if (options.onClick) {
      const handlers = this.createEventHandlers(
        { 
          isSelected: options.isSelected, 
          onClick: options.onClick
        }
      );
      
      polygon.on('click', handlers.click);
      polygon.on('mouseover', handlers.mouseover);
      polygon.on('mouseout', handlers.mouseout);
    }
    
    // Делаем полигон перетаскиваемым, если нужно
    if (options.isDraggable) {
      this.makePolygonDraggable(polygon);
    }
    
    return polygon;
  }

  /**
   * Создает полигон из региона или области
   */
  static createFromRegion(
    region: RegionData | Area,
    options: {
      isSelected?: boolean;
      isDraggable?: boolean;
      onClick?: (id: string | number) => void;
    } = {}
  ): L.Polygon {
    // Получаем координаты для полигона
    let coordinates: [number, number][] = [];
    
    // Проверяем, какой тип объекта передан и как получить координаты
    if (isArea(region)) {
      // Это объект Area с уже готовыми координатами
      coordinates = region.points;
    } else if (isRegionData(region)) {
      // Это объект RegionData с координатами в строковом формате
      const coordsString = region.polygonCoordinates;
      if (typeof coordsString === 'string') {
        coordinates = parseCoordinates(coordsString);
      }
    }
    
    // Если координат недостаточно, возвращаем пустой полигон
    if (coordinates.length < 3) {
      return L.polygon([]);
    }
    
    // Определяем ID для полигона
    let areaId: string;
    if (isArea(region)) {
      areaId = String(region.id);
    } else if (isRegionData(region)) {
      areaId = `region-${region.id}`;
    } else {
      areaId = `polygon-${Date.now()}`;
    }
    
    // Используем универсальный метод createFromPoints
    return this.createFromPoints(coordinates, {
      areaId,
      strokeColor: region.strokeColor,
      fillColor: region.fillColor,
      fillOpacity: region.fillOpacity,
      isSelected: options.isSelected,
      isDraggable: options.isDraggable,
      onClick: options.onClick
    });
  }

  /**
   * Вычисляет центр полигона
   */
  static calculateCenter(points: [number, number][]): [number, number] {
    return calculatePolygonCenter(points);
  }
} 