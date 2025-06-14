// MapDrawingLayer/hooks/useLeafletEvents.ts
import { useEffect, useRef } from 'react';
import L from 'leaflet';
import cloneLayer from '../utils/cloneLayers';
import { Area } from '@/services/regions/types';
import { COLORS } from '@/styles/global-styles';
import { getAreaIdGenerator } from '../utils/idGenerator';

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
  setTempAreaData: React.Dispatch<
    React.SetStateAction<{
      newAreaId: string;
      layer: L.Layer;
      points: [number, number][];
    } | null>
  >;
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
  // Store event handlers in refs to prevent memory leaks
  const handlersRef = useRef<{ [key: string]: (e: any) => void }>({});
  const generateAreaId = getAreaIdGenerator();

  useEffect(() => {
    if (!map || !isVisible) return;
    if (!drawnItemsRef.current) {
      drawnItemsRef.current = new L.FeatureGroup();
      map.addLayer(drawnItemsRef.current);
    }

    

    // Store drawstart handler
    handlersRef.current.drawstart = () => {
      setHasCompletedDrawing(false);
    };

    // Store drawstop handler
    handlersRef.current.drawstop = () => {
      // Здесь можем что-то делать после остановки рисования
    };

    // Store created handler
    handlersRef.current.created = (event: any) => {
      const { layer } = event;
      if (!drawnItemsRef.current) return;

      // Используем UUID для генерации ID
      const newAreaId = generateAreaId();
      layer.options.areaId = newAreaId;
      drawnItemsRef.current.addLayer(layer);

      if (layer instanceof L.Polygon || layer instanceof L.Rectangle) {
        makePolygonDraggable(layer);

        const coords = layer.getLatLngs()[0];
        if (Array.isArray(coords)) {
          const points = coords.map(
            (coord: any) => [coord.lat, coord.lng] as [number, number]
          );
          const newArea = {
            id: newAreaId,
            name: `Новая область ${areasRef.current.length + 1}`,
            description: '',
            points,
            strokeColor: config?.color || COLORS.primary.main,
            fillColor: config?.fillColor || COLORS.primary.light,
            fillOpacity: config?.fillOpacity || 0.3,
          } as Area;

          const updatedAreas = [...areasRef.current, newArea];
          setAreas(updatedAreas);

          setTempAreaData({ newAreaId, layer, points });
          setNewAreaName(newArea.name);
          setNewAreaDescription('');
          setIsModalOpen(true);
          setHasCompletedDrawing(true);
        }
      }
    };

    // Store edited handler
    handlersRef.current.edited = (event: any) => {
      const editedLayers = event.layers;
      const updatedAreas = [...areasRef.current];
      let changed = false;

      editedLayers.eachLayer((layer: any) => {
        const { areaId } = layer.options || {};
        if (!areaId) return;
        const areaIndex = updatedAreas.findIndex((a) => a.id === areaId);
        if (areaIndex !== -1) {
          const coords = layer.getLatLngs()[0];
          if (Array.isArray(coords)) {
            const newPoints = coords.map(
              (coord: any) => [coord.lat, coord.lng] as [number, number]
            );
            updatedAreas[areaIndex] = {
              ...updatedAreas[areaIndex],
              points: newPoints,
            };
            changed = true;
          }
        }
      });

      if (changed) {
        drawnItemsRef.current?.clearLayers();
        updatedAreas.forEach((a) => {
          if (a.points.length > 2) {
            const polygon = L.polygon(a.points, {
              color: a.strokeColor || config?.color || COLORS.primary.main,
              fillColor:
                a.fillColor || config?.fillColor || COLORS.primary.light,
              fillOpacity: a.fillOpacity || config?.fillOpacity || 0.3,
              weight: config?.weight || 2,
              areaId: a.id,
            });
            makePolygonDraggable(polygon);
            drawnItemsRef.current?.addLayer(polygon);
          }
        });
        setAreas(updatedAreas);
      }
    };

    // Store deleted handler
    handlersRef.current.deleted = (event: any) => {
      const deletedLayers = event.layers;
      const deletedIds: string[] = [];
      deletedLayers.eachLayer((layer: any) => {
        if (layer.options && layer.options.areaId) {
          deletedIds.push(layer.options.areaId);
        }
      });
      if (deletedIds.length > 0) {
        const updatedAreas = areasRef.current.filter(
          (a) => !deletedIds.includes(a.id)
        );
        setAreas(updatedAreas);
      }
    };

    // Store layer event handler
    handlersRef.current.layerEvent = (e: any) => {
      const layer = e.layer;
      if (!layer) return;

      if (e.type === 'layerremove') {
        if (
          (layer instanceof L.Polygon || layer instanceof L.Rectangle) &&
          isDrawingMode
        ) {
          if (!layer.options?.areaId) {
            try {
              const cloned = cloneLayer(layer);
              const newAreaId = generateAreaId();
              (cloned as any).options.areaId = newAreaId;
              drawnItemsRef.current?.addLayer(cloned);

              const coords = layer.getLatLngs()[0];
              if (Array.isArray(coords)) {
                const points = coords.map(
                  (coord: any) => [coord.lat, coord.lng] as [number, number]
                );
                setTempAreaData({ newAreaId, layer: cloned, points });
                setHasCompletedDrawing(true);
              }
            } catch (error) {
            }
          }
        }
      }
    };

    // Bind all events with stored handlers
    const eventsToLog = [
      'draw:created',
      'draw:edited',
      'draw:drawstart',
      'draw:drawstop',
      'draw:deletestart',
      'draw:deletestop',
      'draw:toolbaropened',
      'draw:toolbarclosed',
      'layeradd',
      'layerremove',
    ];

    eventsToLog.forEach((eventType) => {
      map.on(eventType, handlersRef.current.debug);
    });

    map.on(L.Draw.Event.DRAWSTART, handlersRef.current.drawstart);
    map.on(L.Draw.Event.DRAWSTOP, handlersRef.current.drawstop);
    map.on(L.Draw.Event.CREATED, handlersRef.current.created);
    map.on(L.Draw.Event.EDITED, handlersRef.current.edited);
    map.on(L.Draw.Event.DELETED, handlersRef.current.deleted);
    map.on('layeradd', handlersRef.current.layerEvent);
    map.on('layerremove', handlersRef.current.layerEvent);

    // Force add pointer-events blocking class when entering DELETE mode
    if (map.getPanes().overlayPane && (isDrawingMode || isEditMode)) {
      map.getPanes().overlayPane.classList.add('leaflet-pane-no-pointer-events');
    }

    return () => {
      // Clean up using the same handler references
      eventsToLog.forEach((evt) => map.off(evt, handlersRef.current.debug));
      map.off(L.Draw.Event.DRAWSTART, handlersRef.current.drawstart);
      map.off(L.Draw.Event.DRAWSTOP, handlersRef.current.drawstop);
      map.off(L.Draw.Event.CREATED, handlersRef.current.created);
      map.off(L.Draw.Event.EDITED, handlersRef.current.edited);
      map.off(L.Draw.Event.DELETED, handlersRef.current.deleted);
      map.off('layeradd', handlersRef.current.layerEvent);
      map.off('layerremove', handlersRef.current.layerEvent);

      // Remove pointer-events blocking class
      if (map.getPanes().overlayPane) {
        map.getPanes().overlayPane.classList.remove('leaflet-pane-no-pointer-events');
      }
    };
  }, [
    map,
    isVisible,
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
    drawnItemsRef,
    generateAreaId,
    setAreas,
  ]);
}
