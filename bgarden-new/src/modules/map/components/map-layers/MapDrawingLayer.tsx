import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { useMap } from 'react-leaflet';
import 'leaflet-draw';
import 'leaflet-draw/dist/leaflet.draw.css';
import { useMapConfig, MAP_MODES } from '../../contexts/MapConfigContext';
import { useMap as useMapContext } from '../../hooks';
import { Area } from '../../contexts/MapContext';
import { COLORS } from '../../../../styles/global-styles';

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

/**
 * Компонент для рисования и редактирования областей на карте
 */
const MapDrawingLayer: React.FC<MapDrawingLayerProps> = ({ isVisible, config }) => {
  const map = useMap();
  const { mapConfig } = useMapConfig();
  const { areas, setAreas } = useMapContext();
  const [drawControl, setDrawControl] = useState<L.Control.Draw | null>(null);
  const drawnItemsRef = useRef<L.FeatureGroup | null>(null);
  const initializedRef = useRef<boolean>(false);
  const areasRef = useRef<Area[]>(areas);
  const isDrawingMode = mapConfig.interactionMode === MAP_MODES.DRAW;
  const isEditMode = mapConfig.interactionMode === MAP_MODES.EDIT;

  // Обновляем ссылку на текущие области
  useEffect(() => {
    areasRef.current = areas;
  }, [areas]);

  // Создаем группу для хранения нарисованных объектов при первом рендере
  useEffect(() => {
    if (!isVisible) return;

    // Инициализация drawnItems если еще не создана
    if (!drawnItemsRef.current) {
      console.log('Создаем группу для нарисованных объектов');
      drawnItemsRef.current = new L.FeatureGroup();
      map.addLayer(drawnItemsRef.current);

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
          edit: false
        }
      });

      setDrawControl(drawingControl);

      // Обработчики событий при рисовании
      map.on(L.Draw.Event.CREATED, (event: any) => {
        const layer = event.layer;
        if (drawnItemsRef.current) {
          // Создаем ID для новой области
          const newAreaId = `area-${Date.now()}`;
          
          // Устанавливаем ID области в свойствах слоя
          layer.options.areaId = newAreaId;
          
          // Добавляем слой в группу нарисованных объектов
          drawnItemsRef.current.addLayer(layer);
          
          // Сохраняем нарисованную область в контекст
          let newArea: Area = {
            id: newAreaId,
            name: `Новая область ${areasRef.current.length + 1}`,
            points: []
          };
          
          if (layer instanceof L.Polygon || layer instanceof L.Rectangle) {
            const coords = layer.getLatLngs()[0];
            if (Array.isArray(coords)) {
              // Приводим координаты к нужному формату
              newArea.points = coords.map((coord: any) => 
                [coord.lat, coord.lng] as [number, number]
              );
              
              console.log('Новая область создана:', newArea);
              
              // Обновляем состояние областей
              setAreas([...areasRef.current, newArea]);
            }
          }
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
                updatedAreas[areaIndex] = {
                  ...updatedAreas[areaIndex],
                  points: coords.map((coord: any) => 
                    [coord.lat, coord.lng] as [number, number]
                  )
                };
                hasChanges = true;
              }
            }
          }
        });
        
        if (hasChanges) {
          console.log('Области обновлены после редактирования');
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
          console.log('Удаляем области:', deletedIds);
          const updatedAreas = areasRef.current.filter(area => !deletedIds.includes(area.id));
          setAreas(updatedAreas);
        }
      });
      
      initializedRef.current = true;
    }

    // Загружаем существующие области только при первом рендере
    // или если слой был очищен, но не при каждом обновлении areas
    if (drawnItemsRef.current && (!initializedRef.current || drawnItemsRef.current.getLayers().length === 0)) {
      // Сначала добавляем к каждой области на карте areaId
      // чтобы потом можно было определить, какие области уже отображены
      const displayedAreaIds = Array.from(drawnItemsRef.current.getLayers())
        .map((layer: any) => layer.options?.areaId)
        .filter(Boolean);
      
      // Отображаем только те области, которые еще не на карте
      areas.forEach(area => {
        if (area.points.length > 2 && !displayedAreaIds.includes(area.id)) {
          console.log('Добавляем область на карту:', area.id);
          const polygon = L.polygon(area.points, {
            color: area.strokeColor || config?.color || COLORS.primary.main,
            fillColor: area.fillColor || config?.fillColor || COLORS.primary.light,
            fillOpacity: area.fillOpacity || config?.fillOpacity || 0.3,
            weight: config?.weight || 2,
            areaId: area.id // Сохраняем ID области для редактирования
          });
          drawnItemsRef.current?.addLayer(polygon);
        }
      });
    }

    return () => {
      // Очистка событий при размонтировании компонента
      map.off(L.Draw.Event.CREATED);
      map.off(L.Draw.Event.EDITED);
      map.off(L.Draw.Event.DELETED);
    };
  }, [map, isVisible, config]);

  // Обновляем слои при изменении областей
  useEffect(() => {
    if (!isVisible || !drawnItemsRef.current || !initializedRef.current) return;
    
    // Получаем список ID слоев, которые уже на карте
    const displayedLayers: Record<string, L.Layer> = {};
    drawnItemsRef.current.eachLayer((layer: any) => {
      if (layer.options?.areaId) {
        displayedLayers[layer.options.areaId] = layer;
      }
    });
    
    // Добавляем новые области и удаляем отсутствующие
    const currentAreaIds = areas.map(area => area.id);
    
    // Удаляем слои, которых нет в текущем массиве областей
    Object.keys(displayedLayers).forEach(areaId => {
      if (!currentAreaIds.includes(areaId)) {
        drawnItemsRef.current?.removeLayer(displayedLayers[areaId]);
      }
    });
    
    // Добавляем области, которых нет на карте
    areas.forEach(area => {
      if (area.points.length > 2 && !displayedLayers[area.id]) {
        const polygon = L.polygon(area.points, {
          color: area.strokeColor || config?.color || COLORS.primary.main,
          fillColor: area.fillColor || config?.fillColor || COLORS.primary.light,
          fillOpacity: area.fillOpacity || config?.fillOpacity || 0.3,
          weight: config?.weight || 2,
          areaId: area.id
        });
        drawnItemsRef.current?.addLayer(polygon);
      }
    });
  }, [areas, isVisible, config]);

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
        console.log('Контрол уже удален или не существует');
      }
    }

    return () => {
      try {
        map.removeControl(drawControl);
      } catch (e) {
        console.log('Контрол уже удален или не существует');
      }
    };
  }, [map, isVisible, isDrawingMode, isEditMode, drawControl]);

  return null;
};

export default MapDrawingLayer; 