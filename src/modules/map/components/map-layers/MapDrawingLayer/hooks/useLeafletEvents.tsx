// MapDrawingLayer/hooks/useLeafletEvents.ts
import { useEffect } from 'react';
import L from 'leaflet';
import cloneLayer from '../utils/cloneLayers';
import { Area } from '@/services/regions/types';
import { COLORS } from '@/styles/global-styles';

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

interface UseLeafletEventsProps {
  map: L.Map;
  isVisible: boolean;
  drawnItemsRef: React.MutableRefObject<L.FeatureGroup | null>;
  config?: {
    color?: string;
    fillColor?: string;
    fillOpacity?: number;
    weight?: number;
  };
  isDrawingMode: boolean;
  isEditMode: boolean;
  makePolygonDraggable: (layer: L.Polygon | L.Rectangle) => void;
  setTempAreaData: React.Dispatch<React.SetStateAction<{
    newAreaId: string;
    layer: L.Layer;
    points: [number, number][];
  } | null>>;
  setHasCompletedDrawing: React.Dispatch<React.SetStateAction<boolean>>;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setNewAreaName: React.Dispatch<React.SetStateAction<string>>;
  setNewAreaDescription: React.Dispatch<React.SetStateAction<string>>;
  areasRef: React.MutableRefObject<Area[]>;
  setAreas: (areas: Area[]) => void;
}

/**
 * Хук для подписки на события Leaflet (draw:created, edited, и т.д.).
 * Облегчает MapDrawingLayer, вынося в себя логику обработки.
 */
export function useLeafletEvents({
  map,
  isVisible,
  drawnItemsRef,
  config,
  isDrawingMode,
  isEditMode,
  makePolygonDraggable,
  setTempAreaData,
  setHasCompletedDrawing,
  setIsModalOpen,
  setNewAreaName,
  setNewAreaDescription,
  areasRef,
  setAreas,
}: UseLeafletEventsProps) {
  useEffect(() => {
    if (!map || !isVisible) return;
    if (!drawnItemsRef.current) {
      drawnItemsRef.current = new L.FeatureGroup();
      map.addLayer(drawnItemsRef.current);
    }

    // Отслеживаем события для отладки
    const eventsToLog = [
      'draw:created', 'draw:edited', 'draw:drawstart', 'draw:drawstop', 
      'draw:deletestart', 'draw:deletestop', 'draw:toolbaropened', 'draw:toolbarclosed',
      'layeradd', 'layerremove'
    ];
    eventsToLog.forEach(eventType => {
      map.on(eventType, (e: any) => {
        logDebug(`Событие: ${eventType}`, e);
      });
    });

    // DRAWSTART
    map.on(L.Draw.Event.DRAWSTART, () => {
      setHasCompletedDrawing(false);
    });

    // DRAWSTOP
    map.on(L.Draw.Event.DRAWSTOP, () => {
      // Здесь можем что-то делать после остановки рисования
    });

    // CREATED
    map.on(L.Draw.Event.CREATED, (event: any) => {
      const { layer } = event;
      if (!drawnItemsRef.current) return;

      // Создаём локальный ID
      const newAreaId = `area-${Date.now()}`;
      layer.options.areaId = newAreaId;
      drawnItemsRef.current.addLayer(layer);

      if (layer instanceof L.Polygon || layer instanceof L.Rectangle) {
        makePolygonDraggable(layer);

        // Преобразуем координаты
        const coords = layer.getLatLngs()[0];
        if (Array.isArray(coords)) {
          const points = coords.map((coord: any) => [coord.lat, coord.lng] as [number, number]);
          const newArea = {
            id: newAreaId,
            name: `Новая область ${areasRef.current.length + 1}`,
            description: '',
            points,
            strokeColor: config?.color || COLORS.primary.main,
            fillColor: config?.fillColor || COLORS.primary.light,
            fillOpacity: config?.fillOpacity || 0.3
          } as Area;

          // Добавляем во временный массив (в состоянии)
          const updatedAreas = [...areasRef.current, newArea];
          setAreas(updatedAreas);

          // Сохраняем данные для последующего сохранения в модалке
          setTempAreaData({ newAreaId, layer, points });

          // Открываем модалку
          setNewAreaName(newArea.name);
          setNewAreaDescription('');
          setIsModalOpen(true);
          setHasCompletedDrawing(true);
        }
      }
    });

    // EDITED
    map.on(L.Draw.Event.EDITED, (event: any) => {
      const editedLayers = event.layers;
      const updatedAreas = [...areasRef.current];
      let changed = false;

      editedLayers.eachLayer((layer: any) => {
        const { areaId } = layer.options || {};
        if (!areaId) return;
        const areaIndex = updatedAreas.findIndex(a => a.id === areaId);
        if (areaIndex !== -1) {
          const coords = layer.getLatLngs()[0];
          if (Array.isArray(coords)) {
            const newPoints = coords.map((coord: any) => [coord.lat, coord.lng] as [number, number]);
            updatedAreas[areaIndex] = {
              ...updatedAreas[areaIndex],
              points: newPoints
            };
            changed = true;
          }
        }
      });

      if (changed) {
        // Перерисовываем
        drawnItemsRef.current?.clearLayers();
        updatedAreas.forEach(a => {
          if (a.points.length > 2) {
            const polygon = L.polygon(a.points, {
              color: a.strokeColor || config?.color || COLORS.primary.main,
              fillColor: a.fillColor || config?.fillColor || COLORS.primary.light,
              fillOpacity: a.fillOpacity || config?.fillOpacity || 0.3,
              weight: config?.weight || 2,
              areaId: a.id
            });
            makePolygonDraggable(polygon);
            drawnItemsRef.current?.addLayer(polygon);
          }
        });
        setAreas(updatedAreas);
      }
    });

    // DELETED
    map.on(L.Draw.Event.DELETED, (event: any) => {
      const deletedLayers = event.layers;
      const deletedIds: string[] = [];
      deletedLayers.eachLayer((layer: any) => {
        if (layer.options && layer.options.areaId) {
          deletedIds.push(layer.options.areaId);
        }
      });
      if (deletedIds.length > 0) {
        const updatedAreas = areasRef.current.filter(a => !deletedIds.includes(a.id));
        setAreas(updatedAreas);
      }
    });

    // layeradd / layerremove
    const handleLayerEvent = (e: any) => {
      const layer = e.layer;
      if (!layer) return;

      if (e.type === 'layerremove') {
        // Если слой удаляется, но мы в процессе рисования, возможно, нужно клонировать его.
        if ((layer instanceof L.Polygon || layer instanceof L.Rectangle) && isDrawingMode) {
          if (!layer.options?.areaId) {
            try {
              const cloned = cloneLayer(layer);
              const newAreaId = `area-temp-${Date.now()}`;
              (cloned as any).options.areaId = newAreaId;
              drawnItemsRef.current?.addLayer(cloned);

              // Извлекаем координаты
              const coords = layer.getLatLngs()[0];
              if (Array.isArray(coords)) {
                const points = coords.map((coord: any) => [coord.lat, coord.lng] as [number, number]);
                setTempAreaData({ newAreaId, layer: cloned, points });
                setHasCompletedDrawing(true);
              }
            } catch (error) {
              logDebug('Ошибка при клонировании удаляемого слоя', error);
            }
          }
        }
      }
    };

    map.on('layeradd', handleLayerEvent);
    map.on('layerremove', handleLayerEvent);

    return () => {
      // Чистим все события
      eventsToLog.forEach(evt => map.off(evt));
      map.off(L.Draw.Event.DRAWSTART);
      map.off(L.Draw.Event.DRAWSTOP);
      map.off(L.Draw.Event.CREATED);
      map.off(L.Draw.Event.EDITED);
      map.off(L.Draw.Event.DELETED);
      map.off('layeradd', handleLayerEvent);
      map.off('layerremove', handleLayerEvent);
    };
  }, [
    map,
    isVisible,
    drawnItemsRef,
    config,
    areasRef,
    setAreas,
    isDrawingMode,
    isEditMode,
    makePolygonDraggable,
    setTempAreaData,
    setHasCompletedDrawing,
    setIsModalOpen,
    setNewAreaName,
    setNewAreaDescription,
  ]);
}
