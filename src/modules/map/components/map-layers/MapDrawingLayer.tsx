import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import { useMap } from 'react-leaflet';
import 'leaflet-draw';
import 'leaflet-draw/dist/leaflet.draw.css';
import { useMapConfig, MAP_MODES } from '../../contexts/MapConfigContext';
import { useMap as useMapContext } from '../../hooks';
import { Area } from '../../contexts/MapContext';
import { COLORS } from '../../../../styles/global-styles';
import { createRegion, updateRegion, convertPointsToPolygonCoordinates } from '../../services/regionService';
import { logError } from '@/utils/logger';
import { RegionData, SectorType } from '../../types/mapTypes';
import { Button } from '../../../../modules/ui';
import Modal from '../../../../modules/ui/components/Modal';
import { TextField } from '../../../../modules/ui/components/Form';

// Дополняем типы Leaflet для устаревшего метода _flat
declare module 'leaflet' {
  namespace LineUtil {
    // Объявляем устаревший метод _flat
    const _flat: (latlngs: any) => boolean;
    // isFlat уже должен быть объявлен в типах
  }
}

// Исправляем устаревшее использование _flat
// Это решит проблему "Deprecated use of _flat, please use L.LineUtil.isFlat instead."
if (typeof L.LineUtil !== 'undefined') {
  if (!L.LineUtil.isFlat && L.LineUtil._flat) {
    L.LineUtil.isFlat = function(latlngs) {
      return L.LineUtil._flat(latlngs);
    };
  }
}

// Дополняем типы Leaflet
declare module 'leaflet' {
  interface Map {
    editTools?: any;
    hasControl?: (control: L.Control) => boolean;
  }
  namespace Control {
    interface DrawOptions {
      edit?: {
        featureGroup: L.FeatureGroup;
        remove?: boolean;
        edit?: boolean;
      };
    }
  }
  interface PolylineOptions {
    areaId?: string;
  }
  interface Polygon {
    editing?: {
      enable: () => void;
      disable: () => void;
    };
  }
  interface Rectangle {
    editing?: {
      enable: () => void;
      disable: () => void;
    };
  }
}

interface MapDrawingLayerProps {
  isVisible: boolean;
  config?: {
    color?: string;
    fillColor?: string;
    fillOpacity?: number;
    weight?: number;
  };
}

// Добавим функцию для логирования в консоль
const logDebug = (message: string, data?: any) => {
  if (process.env.NODE_ENV !== 'production') {
    if (data) {
      console.log(`[MapDrawingLayer] ${message}`, data);
    } else {
      console.log(`[MapDrawingLayer] ${message}`);
    }
  }
};

// Отслеживаем все события Leaflet для отладки
const trackLeafletEvents = (map: L.Map) => {
  const events = [
    'draw:created', 'draw:edited', 'draw:drawstart', 'draw:drawstop', 
    'draw:deletestart', 'draw:deletestop', 'draw:toolbaropened', 'draw:toolbarclosed',
    'layeradd', 'layerremove'
  ];
  
  events.forEach(event => {
    map.on(event, (e: any) => {
      logDebug(`Event: ${event}`, e);
    });
  });
};

/**
 * Компонент для рисования и редактирования областей на карте
 */
const MapDrawingLayer: React.FC<MapDrawingLayerProps> = ({ isVisible, config }) => {
  const map = useMap();
  const { mapConfig, updateMapConfig } = useMapConfig();
  const { areas, setAreas } = useMapContext();
  const [drawControl, setDrawControl] = useState<L.Control.Draw | null>(null);
  const drawnItemsRef = useRef<L.FeatureGroup | null>(null);
  const initializedRef = useRef<boolean>(false);
  const areasRef = useRef<Area[]>(areas);
  const isDrawingMode = mapConfig.interactionMode === MAP_MODES.DRAW;
  const isEditMode = mapConfig.interactionMode === MAP_MODES.EDIT;
  
  // Добавляем состояние для отслеживания завершения рисования полигона
  const [hasCompletedDrawing, setHasCompletedDrawing] = useState<boolean>(false);
  
  // Состояние для модального окна
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newAreaName, setNewAreaName] = useState('');
  const [newAreaDescription, setNewAreaDescription] = useState('');
  const [editingAreaId, setEditingAreaId] = useState<string | null>(null);
  const [tempAreaData, setTempAreaData] = useState<{
    newAreaId: string;
    layer: L.Layer;
    points: [number, number][];
  } | null>(null);

  // Обновляем ссылку на текущие области
  useEffect(() => {
    areasRef.current = areas;
  }, [areas]);

  // Вычисляем центр полигона
  const calculatePolygonCenter = useCallback((points: [number, number][]): [number, number] => {
    if (!points || points.length === 0) return [0, 0];
    
    const totalPoints = points.length;
    let sumLat = 0;
    let sumLng = 0;
    
    points.forEach(point => {
      sumLat += point[0];
      sumLng += point[1];
    });
    
    return [
      parseFloat((sumLat / totalPoints).toFixed(6)),
      parseFloat((sumLng / totalPoints).toFixed(6))
    ];
  }, []);

  // Функция для сохранения области на сервере
  const saveAreaToServer = useCallback((
    areaId: string, 
    areaName: string, 
    areaDescription: string, 
    points: [number, number][]
  ) => {
    // Рассчитываем центр области
    const [centerLat, centerLng] = calculatePolygonCenter(points);
    
    // Отправляем новую область на сервер
    const polygonCoordinates = convertPointsToPolygonCoordinates(points);
    
    // Создаем объект с данными для API
    const regionData: Omit<RegionData, 'id' | 'specimensCount'> = {
      name: areaName,
      description: areaDescription || '',
      polygonCoordinates: polygonCoordinates,
      strokeColor: config?.color || COLORS.primary.main,
      fillColor: config?.fillColor || COLORS.primary.light,
      fillOpacity: config?.fillOpacity || 0.3,
      latitude: centerLat, 
      longitude: centerLng,
      radius: 0,
      boundaryWkt: '',
      sectorType: SectorType.UNDEFINED
    };
    
    // Проверяем, редактируем ли мы существующую область или создаем новую
    const isEditingExistingRegion = areaId.startsWith('region-');
    
    if (isEditingExistingRegion) {
      // Получаем ID региона из ID области (убираем префикс 'region-')
      const regionId = areaId.replace('region-', '');
      
      // Обновляем существующий регион
      updateRegion(regionId, regionData).then(() => {
        // Обновляем область в локальном хранилище
        const updatedAreas = areasRef.current.map(area => 
          area.id === areaId 
            ? { ...area, name: areaName, description: areaDescription, points }
            : area
        );
        
        setAreas(updatedAreas);
      }).catch((error: any) => {
        logError('Ошибка при обновлении области:', error);
      });
    } else {
      // Создаем новый регион
      createRegion(regionData).then(response => {
        // Сохраняем новый ID, который мы получили от сервера
        const newRegionId = `region-${response.id}`;
        
        // Обновляем ID области в локальном хранилище
        const updatedAreas = areasRef.current.map(area => 
          area.id === areaId 
            ? { ...area, id: newRegionId }
            : area
        );
        
        // Важно: также обновляем ID в слое на карте
        if (drawnItemsRef.current) {
          drawnItemsRef.current.eachLayer((layer: any) => {
            if (layer.options?.areaId === areaId) {
              // Обновляем ID в опциях слоя
              layer.options.areaId = newRegionId;
            }
          });
        }
        
        // Обновляем состояние
        setAreas(updatedAreas);
      }).catch(error => {
        logError('Ошибка при сохранении области:', error);
      });
    }
  }, [calculatePolygonCenter, config, setAreas]);

  // Функция для добавления возможности перетаскивания полигона
  const makePolygonDraggable = useCallback((polygon: L.Polygon | L.Rectangle) => {
    polygon.on('click', function(e: any) {
      if (isEditMode) {
        // Предотвращаем распространение события
        L.DomEvent.stop(e);
        
        // Активируем режим редактирования области
        try {
          // Используем безопасный подход с проверкой существования свойства
          const editableLayer = polygon as any;
          if (editableLayer.editing && typeof editableLayer.editing.enable === 'function') {
            editableLayer.editing.enable();
            
            // Показываем информацию пользователю только один раз
            if (!localStorage.getItem('drag_polygon_hint_shown')) {
              alert('Для перемещения всей области целиком: \n1. Удерживайте клавишу Ctrl (или Command на Mac) \n2. Нажмите на любую точку области и перетащите её');
              localStorage.setItem('drag_polygon_hint_shown', 'true');
            }
          }
        } catch (err) {
          console.error('Ошибка при включении режима редактирования:', err);
        }
      }
    });
  }, [isEditMode]);

  // Создаем группу для хранения нарисованных объектов при первом рендере
  useEffect(() => {
    if (!isVisible) return;

    // Инициализация drawnItems если еще не создана
    if (!drawnItemsRef.current) {
      logDebug('Инициализация группы drawnItems');
      drawnItemsRef.current = new L.FeatureGroup();
      map.addLayer(drawnItemsRef.current);
      
      // Отслеживаем все события для отладки
      trackLeafletEvents(map);

      // Создаем новый экземпляр контрола для рисования
      const drawingControl = new L.Control.Draw({
        position: 'topleft',
        draw: {
          polyline: false,
          circle: false,
          circlemarker: false,
          marker: false,
          rectangle: {
            shapeOptions: {
              color: config?.color || COLORS.primary.main,
              fillColor: config?.fillColor || COLORS.primary.light,
              fillOpacity: config?.fillOpacity || 0.3,
              weight: config?.weight || 2
            }
          },
          polygon: {
            allowIntersection: false,
            showArea: true,
            shapeOptions: {
              color: config?.color || COLORS.primary.main,
              fillColor: config?.fillColor || COLORS.primary.light,
              fillOpacity: config?.fillOpacity || 0.3,
              weight: config?.weight || 2
            }
          }
        },
        edit: {
          featureGroup: drawnItemsRef.current,
          remove: true,
          edit: {}
        }
      });

      setDrawControl(drawingControl);

      // Добавляем отслеживание начала рисования
      map.on(L.Draw.Event.DRAWSTART, (event: any) => {
        logDebug('Событие DRAWSTART: Начало рисования', event);
        // Сбрасываем флаг завершения рисования при начале нового рисования
        setHasCompletedDrawing(false);
      });

      // Добавляем отслеживание остановки рисования
      map.on(L.Draw.Event.DRAWSTOP, (event: any) => {
        logDebug('Событие DRAWSTOP: Остановка рисования', event);
        // Проверим, сколько слоев осталось в drawnItems после DRAWSTOP
        if (drawnItemsRef.current) {
          const layers = drawnItemsRef.current.getLayers();
          logDebug('Слои в drawnItems после DRAWSTOP', {
            count: layers.length,
            ids: layers.map((l: any) => l._leaflet_id)
          });
        }
      });

      // Обрабатываем дополнительные события для отладки уровня drawing
      const drawingTypes = ['polyline', 'polygon', 'rectangle', 'circle', 'marker'];
      drawingTypes.forEach(type => {
        map.on(`draw:${type}created` as any, (e: any) => {
          logDebug(`Событие draw:${type}created`, e);
        });
      });

      // Обработчики событий при рисовании
      map.on(L.Draw.Event.CREATED, (event: any) => {
        const { layer } = event;
        
        if (drawnItemsRef.current) {
          logDebug('Создан новый слой', { layerId: (layer as any)._leaflet_id, type: event.layerType });
          
          // Создаем ID для новой области
          const newAreaId = `area-${Date.now()}`;
          logDebug(`Создан новый ID для области: ${newAreaId}`);
          
          try {
            // Устанавливаем ID области в свойствах слоя
            layer.options.areaId = newAreaId;
            
            // Добавляем слой в drawnItems напрямую, без клонирования
            // и сразу добавляем его в группу отображаемых объектов
            drawnItemsRef.current.addLayer(layer);
            logDebug('Слой добавлен в группу drawnItems', { 
              layerId: (layer as any)._leaflet_id,
              layerCount: drawnItemsRef.current.getLayers().length 
            });
            
            // Добавляем возможность перетаскивать полигон
            if (layer instanceof L.Polygon || layer instanceof L.Rectangle) {
              // Делаем полигон перетаскиваемым
              makePolygonDraggable(layer);
              logDebug('Слой сделан перетаскиваемым');
            }
            
            // Подготавливаем данные для новой области
            let points: [number, number][] = [];
            
            if (layer instanceof L.Polygon || layer instanceof L.Rectangle) {
              const coords = layer.getLatLngs()[0];
              logDebug('Получены координаты полигона', coords);
              
              if (Array.isArray(coords)) {
                // Приводим координаты к нужному формату
                points = coords.map((coord: any) => 
                  [coord.lat, coord.lng] as [number, number]
                );
                
                logDebug('Точки полигона преобразованы', points);
                
                // Создаем новую область сразу и добавляем ее во временное состояние areas
                // с базовым именем, чтобы не терять нарисованный полигон
                const newArea: Area = {
                  id: newAreaId,
                  name: `Новая область ${areasRef.current.length + 1}`,
                  description: '',
                  points: points,
                  strokeColor: config?.color || COLORS.primary.main,
                  fillColor: config?.fillColor || COLORS.primary.light,
                  fillOpacity: config?.fillOpacity || 0.3
                };
                
                // Обновляем массив областей, чтобы сохранить нарисованный полигон
                const updatedAreas = [...areasRef.current, newArea];
                setAreas(updatedAreas);
                logDebug('Область временно добавлена в состояние', newArea);
                
                // Сохраняем временные данные новой области со слоем
                setTempAreaData({
                  newAreaId,
                  layer,
                  points
                });
                
                logDebug('Временные данные области сохранены', {
                  newAreaId,
                  pointsCount: points.length,
                  layerId: (layer as any)._leaflet_id
                });
                
                // Открываем модальное окно для ввода имени области
                setNewAreaName(`Новая область ${areasRef.current.length + 1}`);
                setNewAreaDescription('');
                setIsModalOpen(true);
                logDebug('Открыто модальное окно для ввода имени области');
                
                // Проверяем состояние drawnItems после всех операций
                if (drawnItemsRef.current) {
                  const currentLayers = drawnItemsRef.current.getLayers();
                  logDebug('Текущие слои в drawnItems после создания', {
                    count: currentLayers.length,
                    ids: currentLayers.map((l: any) => l._leaflet_id)
                  });
                }
                
                // Устанавливаем флаг завершения рисования в true при создании полигона
                setHasCompletedDrawing(true);
                logDebug('Установлен флаг hasCompletedDrawing = true');
              }
            }
          } catch (error) {
            logDebug('Ошибка при обработке созданного полигона', error);
          }
        } else {
          logDebug('Ошибка: drawnItemsRef.current не существует!');
        }
      });

      map.on(L.Draw.Event.EDITED, (event: any) => {
        const editedLayers = event.layers;
        // Обновляем координаты областей после редактирования
        const updatedAreas = [...areasRef.current];
        let hasChanges = false;
        
        editedLayers.eachLayer((layer: any) => {
          if (layer.options && layer.options.areaId) {
            const areaId = layer.options.areaId;
            const coords = layer.getLatLngs()[0];
            if (Array.isArray(coords)) {
              // Находим индекс области в массиве
              const areaIndex = updatedAreas.findIndex(area => area.id === areaId);
              
              if (areaIndex !== -1) {
                // Обновляем координаты
                const newPoints = coords.map((coord: any) => 
                  [coord.lat, coord.lng] as [number, number]
                );
                
                updatedAreas[areaIndex] = {
                  ...updatedAreas[areaIndex],
                  points: newPoints
                };
                
                // Если область имеет ID региона (начинается с 'region-'), сохраняем изменения на сервере
                if (areaId.startsWith('region-')) {
                  saveAreaToServer(
                    areaId,
                    updatedAreas[areaIndex].name,
                    updatedAreas[areaIndex].description || '',
                    newPoints
                  );
                }
                
                hasChanges = true;
              }
            }
          }
        });
        
        if (hasChanges && drawnItemsRef.current) {
          // Очищаем все слои перед обновлением
          drawnItemsRef.current.clearLayers();
          
          // Перерисовываем все области заново
          updatedAreas.forEach(area => {
            if (area.points.length > 2) {
              const polygon = L.polygon(area.points, {
                color: area.strokeColor || config?.color || COLORS.primary.main,
                fillColor: area.fillColor || config?.fillColor || COLORS.primary.light,
                fillOpacity: area.fillOpacity || config?.fillOpacity || 0.3,
                weight: config?.weight || 2,
                areaId: area.id
              });
              
              // Делаем полигон перетаскиваемым
              makePolygonDraggable(polygon);
              
              drawnItemsRef.current?.addLayer(polygon);
            }
          });
          
          setAreas(updatedAreas);
        }
      });

      map.on(L.Draw.Event.DELETED, (event: any) => {
        const deletedLayers = event.layers;
        // Удаляем области, которые были удалены на карте
        const deletedIds: string[] = [];
        deletedLayers.eachLayer((layer: any) => {
          if (layer.options && layer.options.areaId) {
            deletedIds.push(layer.options.areaId);
          }
        });
        
        if (deletedIds.length > 0) {
          const updatedAreas = areasRef.current.filter(area => !deletedIds.includes(area.id));
          setAreas(updatedAreas);
        }
      });
      
      // Добавляем слушатель событий для клика по полигонам (для редактирования свойств)
      drawnItemsRef.current.on('click', (event: any) => {
        if (isEditMode && event.layer && event.layer.options && event.layer.options.areaId) {
          const clickedAreaId = event.layer.options.areaId;
          const area = areasRef.current.find(a => a.id === clickedAreaId);
          
          if (area) {
            // Открываем модальное окно для редактирования свойств области
            setEditingAreaId(clickedAreaId);
            setNewAreaName(area.name);
            setNewAreaDescription(area.description || '');
            setIsEditModalOpen(true);
          }
        }
      });
      
      initializedRef.current = true;
    }

    // Загружаем существующие области на карту
    if (drawnItemsRef.current) {
      // Получаем список ID слоев, которые уже на карте
      const displayedAreaIds = Array.from(drawnItemsRef.current.getLayers())
        .map((layer: any) => layer.options?.areaId)
        .filter(Boolean);
      
      // Отображаем только те области, которые еще не на карте
      areas.forEach(area => {
        if (area.points.length > 2 && !displayedAreaIds.includes(area.id)) {
          const polygon = L.polygon(area.points, {
            color: area.strokeColor || config?.color || COLORS.primary.main,
            fillColor: area.fillColor || config?.fillColor || COLORS.primary.light,
            fillOpacity: area.fillOpacity || config?.fillOpacity || 0.3,
            weight: config?.weight || 2,
            areaId: area.id // Сохраняем ID области для редактирования
          });
          
          // Делаем полигон перетаскиваемым
          makePolygonDraggable(polygon);
          
          drawnItemsRef.current?.addLayer(polygon);
        }
      });
    }

    return () => {
      // Очистка событий при размонтировании компонента
      map.off(L.Draw.Event.DRAWSTART);
      map.off(L.Draw.Event.DRAWSTOP);
      map.off(L.Draw.Event.CREATED);
      map.off(L.Draw.Event.EDITED);
      map.off(L.Draw.Event.DELETED);
      
      // Удаляем отслеживание дополнительных событий
      const drawingTypes = ['polyline', 'polygon', 'rectangle', 'circle', 'marker'];
      drawingTypes.forEach(type => {
        map.off(`draw:${type}created` as any);
      });
      
      // Удаляем отслеживание всех общих событий
      const events = [
        'draw:created', 'draw:edited', 'draw:drawstart', 'draw:drawstop', 
        'draw:deletestart', 'draw:deletestop', 'draw:toolbaropened', 'draw:toolbarclosed',
        'layeradd', 'layerremove'
      ];
      events.forEach(event => map.off(event));
    };
  }, [map, isVisible, config, calculatePolygonCenter, areas, saveAreaToServer, isEditMode, makePolygonDraggable]);

  // Подписываемся на события Leaflet, чтобы отловить момент удаления слоя
  useEffect(() => {
    if (!map || !isVisible) return;
    
    // Функция для обработки событий layeradd и layerremove
    const handleLayerEvent = (event: any) => {
      // Определяем тип слоя и его свойства для более детального логирования
      const layerType = 
        event.layer instanceof L.Polygon ? 'Polygon' :
        event.layer instanceof L.Rectangle ? 'Rectangle' :
        event.layer instanceof L.Marker ? 'Marker' :
        event.layer instanceof L.Circle ? 'Circle' :
        event.layer instanceof L.CircleMarker ? 'CircleMarker' :
        event.layer instanceof L.Polyline ? 'Polyline' : 
        'Unknown';
        
      logDebug(`Событие ${event.type}`, {
        layer: event.layer,
        layerId: event.layer._leaflet_id,
        layerType,
        hasOptions: !!event.layer.options,
        areaId: event.layer.options?.areaId
      });
      
      // Если слой удаляется, проверяем его на принадлежность к отрисованным фигурам
      if (event.type === 'layerremove') {
        // Если слой был частью создаваемой области, нужно попытаться его сохранить
        if (event.layer instanceof L.Polygon || event.layer instanceof L.Rectangle) {
          logDebug('Удаляется полигон или прямоугольник', {
            layerId: event.layer._leaflet_id,
            coords: event.layer.getLatLngs()
          });
          
          // Проверяем, есть ли у нас временные данные и относятся ли они к удаляемому слою
          if (tempAreaData && tempAreaData.layer) {
            const tempLayerId = (tempAreaData.layer as any)._leaflet_id;
            logDebug('Сравнение с временным слоем', { 
              eventLayerId: event.layer._leaflet_id, 
              tempLayerId 
            });
          }
          
          // Если это не наш клонированный слой (не имеет areaId), клонируем его немедленно
          if (!event.layer.options?.areaId && isDrawingMode && !tempAreaData) {
            try {
              // Клонируем слой перед удалением
              const clonedLayer = cloneLayer(event.layer);
              const newAreaId = `area-temp-${Date.now()}`;
              (clonedLayer as any).options.areaId = newAreaId;
              
              if (drawnItemsRef.current) {
                drawnItemsRef.current.addLayer(clonedLayer);
                
                logDebug('Предотвращено удаление слоя - создан клон', {
                  originalId: event.layer._leaflet_id,
                  cloneId: (clonedLayer as any)._leaflet_id,
                  newAreaId
                });
                
                // Получаем координаты из удаляемого слоя
                let points: [number, number][] = [];
                if (event.layer instanceof L.Polygon || event.layer instanceof L.Rectangle) {
                  const coords = event.layer.getLatLngs()[0];
                  if (Array.isArray(coords)) {
                    points = coords.map((coord: any) => 
                      [coord.lat, coord.lng] as [number, number]
                    );
                    
                    // Сохраняем временные данные для использования позже
                    setTempAreaData({
                      newAreaId,
                      layer: clonedLayer,
                      points
                    });
                    
                    // Устанавливаем флаг завершения рисования
                    setHasCompletedDrawing(true);
                    
                    logDebug('Клонированный слой сохранен во временных данных', {
                      newAreaId,
                      points
                    });
                  }
                }
              }
            } catch (error) {
              logDebug('Ошибка при клонировании удаляемого слоя', error);
            }
          }
        }
      }
      
      // Если у нас есть временные данные и слой совпадает с временным
      if (tempAreaData && event.layer._leaflet_id === (tempAreaData.layer as any)._leaflet_id) {
        logDebug(`Событие ${event.type} затронуло текущий редактируемый слой!`, {
          tempLayer: tempAreaData.layer,
          eventLayer: event.layer
        });
      }
    };
    
    // Подписываемся на события добавления и удаления слоев на карте
    map.on('layeradd', handleLayerEvent);
    map.on('layerremove', handleLayerEvent);
    
    return () => {
      map.off('layeradd', handleLayerEvent);
      map.off('layerremove', handleLayerEvent);
    };
  }, [map, isVisible, tempAreaData, isDrawingMode]);
  
  // Функция для клонирования слоя
  const cloneLayer = (originalLayer: any): L.Layer => {
    let clonedLayer: L.Layer;
    
    if (originalLayer instanceof L.Polygon) {
      // Клонируем полигон
      const latlngs = originalLayer.getLatLngs();
      const options = { ...originalLayer.options };
      clonedLayer = new L.Polygon(latlngs, options);
      logDebug('Клонирован полигон', { originalId: (originalLayer as any)._leaflet_id, latlngs });
    } else if (originalLayer instanceof L.Rectangle) {
      // Клонируем прямоугольник
      const bounds = originalLayer.getBounds();
      const options = { ...originalLayer.options };
      clonedLayer = new L.Rectangle(bounds, options);
      logDebug('Клонирован прямоугольник', { originalId: (originalLayer as any)._leaflet_id, bounds });
    } else {
      // Для других типов (на всякий случай)
      clonedLayer = originalLayer;
      logDebug('Копирован другой тип слоя', { originalId: (originalLayer as any)._leaflet_id, type: originalLayer.constructor.name });
    }
    
    return clonedLayer;
  };

  // Обновляем слои при изменении областей - синхронизация состояния
  useEffect(() => {
    if (!isVisible || !drawnItemsRef.current) return;
    
    // Очищаем все слои
    drawnItemsRef.current.clearLayers();
    
    // Добавляем все области заново
    areas.forEach(area => {
      if (area.points.length > 2) {
        const polygon = L.polygon(area.points, {
          color: area.strokeColor || config?.color || COLORS.primary.main,
          fillColor: area.fillColor || config?.fillColor || COLORS.primary.light,
          fillOpacity: area.fillOpacity || config?.fillOpacity || 0.3,
          weight: config?.weight || 2,
          areaId: area.id
        });
        
        // Делаем полигон перетаскиваемым
        makePolygonDraggable(polygon);
        
        drawnItemsRef.current?.addLayer(polygon);
      }
    });
  }, [areas, isVisible, config, isEditMode, makePolygonDraggable]);

  // Управление видимостью controls в зависимости от режима
  useEffect(() => {
    if (!isVisible || !drawControl) return;

    // Добавляем или удаляем контрол в зависимости от режима
    if (isDrawingMode || isEditMode) {
      map.addControl(drawControl);
    } else {
      // Проверка наличия контрола на карте перед его удалением
      try {
        map.removeControl(drawControl);
      } catch (e) {
        // Контрол уже удален или не существует
      }
    }

    return () => {
      try {
        map.removeControl(drawControl);
      } catch (e) {
        // Контрол уже удален или не существует
      }
    };
  }, [map, isVisible, isDrawingMode, isEditMode, drawControl]);

  // Эффект для сброса флага завершения рисования при изменении режима
  useEffect(() => {
    if (!isDrawingMode) {
      setHasCompletedDrawing(false);
      logDebug('Сброшен флаг hasCompletedDrawing из-за изменения режима');
    }
  }, [isDrawingMode]);

  // Экспортируем состояние завершения рисования в родительский контекст
  useEffect(() => {
    // Если есть функция для обновления глобального состояния, вызываем ее
    if (updateMapConfig && isDrawingMode) {
      updateMapConfig({ hasCompletedDrawing });
      logDebug(`Обновлен глобальный флаг hasCompletedDrawing = ${hasCompletedDrawing}`);
    }
  }, [hasCompletedDrawing, isDrawingMode, updateMapConfig]);

  // Обработчик сохранения имени области из модального окна
  const handleSaveAreaName = () => {
    logDebug('Вызван обработчик сохранения имени области');
    if (!tempAreaData) {
      logDebug('Ошибка: tempAreaData отсутствует');
      return;
    }
    
    const { newAreaId, points } = tempAreaData;
    
    // Создаем новую область с введенным именем
    const newArea: Area = {
      id: newAreaId,
      name: newAreaName || `Новая область ${areasRef.current.length + 1}`,
      description: newAreaDescription,
      points: points
    };
    
    logDebug('Создана новая область', newArea);
    
    // Проверяем состояние drawnItems перед обновлением
    if (drawnItemsRef.current) {
      const currentLayers = drawnItemsRef.current.getLayers();
      logDebug('Слои в drawnItems перед добавлением области', {
        count: currentLayers.length,
        ids: currentLayers.map((l: any) => l._leaflet_id)
      });
    }
    
    // Обновляем состояние областей
    const updatedAreas = [...areasRef.current, newArea];
    setAreas(updatedAreas);
    logDebug('Обновлен массив областей', { count: updatedAreas.length });
    
    // Сохраняем на сервере
    saveAreaToServer(newAreaId, newArea.name, newArea.description || '', points);
    logDebug('Отправлен запрос на сохранение области на сервере');
    
    // Проверяем, сохранился ли слой в drawnItems
    if (drawnItemsRef.current) {
      const hasLayer = drawnItemsRef.current.getLayers().some(
        (l: any) => l.options?.areaId === newAreaId
      );
      logDebug(`Слой ${newAreaId} присутствует в drawnItems: ${hasLayer}`);
    }
    
    // Закрываем модальное окно и очищаем временные данные
    setIsModalOpen(false);
    setTempAreaData(null);
    logDebug('Модальное окно закрыто, временные данные очищены');
    
    // Устанавливаем флаг завершения рисования в true
    setHasCompletedDrawing(true);
    logDebug('Установлен флаг hasCompletedDrawing = true');
  };

  // Обработчик отмены создания области
  const handleCancelAreaCreation = () => {
    logDebug('Вызван обработчик отмены создания области');
    if (tempAreaData && drawnItemsRef.current) {
      // Удаляем нарисованную область с карты
      logDebug('Удаление слоя с карты', {
        layerId: (tempAreaData.layer as any)._leaflet_id
      });
      drawnItemsRef.current.removeLayer(tempAreaData.layer);
      
      // Проверяем, действительно ли слой удален
      const remainingLayers = drawnItemsRef.current.getLayers();
      logDebug('Оставшиеся слои после удаления', {
        count: remainingLayers.length,
        ids: remainingLayers.map((l: any) => l._leaflet_id)
      });
    }
    
    // Закрываем модальное окно и очищаем временные данные
    setIsModalOpen(false);
    setTempAreaData(null);
    logDebug('Модальное окно закрыто, временные данные очищены');
    
    // Сбрасываем флаг завершения рисования
    setHasCompletedDrawing(false);
    logDebug('Сброшен флаг hasCompletedDrawing');
  };

  // Обработчик сохранения изменений области
  const handleSaveAreaEdit = () => {
    if (!editingAreaId) return;
    
    // Находим область в текущем списке
    const areaIndex = areasRef.current.findIndex(area => area.id === editingAreaId);
    
    if (areaIndex !== -1) {
      const area = areasRef.current[areaIndex];
      
      // Обновляем свойства области
      const updatedArea: Area = {
        ...area,
        name: newAreaName || area.name,
        description: newAreaDescription
      };
      
      // Обновляем массив областей
      const updatedAreas = [...areasRef.current];
      updatedAreas[areaIndex] = updatedArea;
      setAreas(updatedAreas);
      
      // Сохраняем изменения на сервере, если это существующий регион
      if (editingAreaId.startsWith('region-')) {
        saveAreaToServer(editingAreaId, updatedArea.name, updatedArea.description || '', updatedArea.points);
      }
    }
    
    // Закрываем модальное окно и очищаем состояние
    setIsEditModalOpen(false);
    setEditingAreaId(null);
  };

  // Обработчик отмены редактирования области
  const handleCancelAreaEdit = () => {
    setIsEditModalOpen(false);
    setEditingAreaId(null);
  };

  return (
    <>
      <Modal
        isOpen={isModalOpen}
        onClose={handleCancelAreaCreation}
        title="Создание новой области"
        footer={
          <div className="flex justify-end space-x-3">
            <Button variant="neutral" onClick={handleCancelAreaCreation}>
              Отмена
            </Button>
            <Button onClick={handleSaveAreaName}>
              Сохранить
            </Button>
          </div>
        }
        size="small"
        animation="fade"
        closeOnEsc={false}
        closeOnOverlayClick={false}
        className="z-[9999]"
      >
        <div className="space-y-4">
          <TextField
            label="Название области"
            value={newAreaName}
            onChange={(e) => setNewAreaName(e.target.value)}
            fullWidth
            autoFocus
          />
          <TextField
            label="Описание (необязательно)"
            value={newAreaDescription}
            onChange={(e) => setNewAreaDescription(e.target.value)}
            fullWidth
          />
        </div>
      </Modal>
      
      <Modal
        isOpen={isEditModalOpen}
        onClose={handleCancelAreaEdit}
        title="Редактирование области"
        footer={
          <div className="flex justify-end space-x-3">
            <Button variant="neutral" onClick={handleCancelAreaEdit}>
              Отмена
            </Button>
            <Button onClick={handleSaveAreaEdit}>
              Сохранить
            </Button>
          </div>
        }
        size="small"
        animation="fade"
        closeOnEsc={false}
        closeOnOverlayClick={false}
        className="z-[9999]"
      >
        <div className="space-y-4">
          <TextField
            label="Название области"
            value={newAreaName}
            onChange={(e) => setNewAreaName(e.target.value)}
            fullWidth
            autoFocus
          />
          <TextField
            label="Описание (необязательно)"
            value={newAreaDescription}
            onChange={(e) => setNewAreaDescription(e.target.value)}
            fullWidth
          />
        </div>
      </Modal>
    </>
  );
};

export default MapDrawingLayer; 