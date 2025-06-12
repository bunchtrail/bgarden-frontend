// MapDrawingLayer/MapDrawingLayer.tsx
import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import { useMap } from 'react-leaflet';
import 'leaflet-draw';
import 'leaflet-draw/dist/leaflet.draw.css';

// Контексты и хуки

import { Area } from '@/services/regions/types';

// Логгеры и утилиты
import { logError } from '@/utils/logger';

// Модалки

// Сервисы
import { PolygonFactory, createRegion, updateRegion } from '@/services/regions';
import regionBridge, {
  convertPointsForStorage,
} from '@/services/regions/RegionBridge';

// Хуки

import { MAP_MODES, useMapConfig, useMapContext } from '@/modules/map';
import { COLORS } from '@/styles';
import AreaCreationModal from './MapDrawingLayer/components/AreaCreationModal';
import AreaEditModal from './MapDrawingLayer/components/AreaEditModal';
import { useLeafletEvents } from './MapDrawingLayer/hooks/useLeafletEvents';

// Дополняем типы Leaflet для устаревшего метода _flat
declare module 'leaflet' {
  namespace LineUtil {
    const _flat: (latlngs: any) => boolean;
  }
}

// Исправляем устаревшее использование _flat
if (typeof L.LineUtil !== 'undefined') {
  if (!L.LineUtil.isFlat && L.LineUtil._flat) {
    L.LineUtil.isFlat = function (latlngs) {
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

/**
 * Основной компонент для рисования и редактирования областей на карте
 */
const MapDrawingLayer: React.FC<MapDrawingLayerProps> = ({
  isVisible,
  config,
}) => {
  const map = useMap();
  const { mapConfig, updateMapConfig } = useMapConfig();
  const { areas, setAreas } = useMapContext();
  const [drawControl, setDrawControl] = useState<L.Control.Draw | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [hasCompletedDrawing, setHasCompletedDrawing] =
    useState<boolean>(false);
  const [isDeleteMode, setIsDeleteMode] = useState(false);

  const [newAreaName, setNewAreaName] = useState('');
  const [newAreaDescription, setNewAreaDescription] = useState('');
  const [editingAreaId, setEditingAreaId] = useState<string | null>(null);

  // Храним слой + данные области при создании (до сохранения)
  const [tempAreaData, setTempAreaData] = useState<{
    newAreaId: string;
    layer: L.Layer;
    points: [number, number][];
  } | null>(null);

  const drawnItemsRef = useRef<L.FeatureGroup | null>(null);
  const areasRef = useRef<Area[]>(areas);

  const isDrawingMode = mapConfig.interactionMode === MAP_MODES.DRAW;

  // Эффект для управления pointer-events у панелей в режиме рисования
  useEffect(() => {
    if (!map) return;

    // перечень панелей, которые перехватывают клики
    const panes = [
      'overlayPane',
      'markerPane',
      'shadowPane',
      'popupPane',
      'tooltipPane',
    ] as const;

    const togglePointerEvents = (enabled: boolean) => {
      panes.forEach((name) => {
        const pane = map.getPane(name);
        if (pane) pane.style.pointerEvents = enabled ? 'auto' : 'none';
      });
    };

    // при входе в режим рисования
    if (isDrawingMode) {
      togglePointerEvents(false); // ❌ блокируем перетаскивание
      map.dragging.disable(); // выключаем drag карты
      map.doubleClickZoom.disable(); // отключаем зум по двойному клику
    } else {
      togglePointerEvents(true); // ✅ возвращаем интерактивность
      map.dragging.enable();
      map.doubleClickZoom.enable();
    }

    // на случай размонтирования - восстанавливаем исходное состояние
    return () => togglePointerEvents(true);
  }, [map, isDrawingMode]);
  const isEditMode = mapConfig.interactionMode === MAP_MODES.EDIT;

  // Синхронизируем локальную ref с актуальным состоянием areas
  useEffect(() => {
    areasRef.current = areas;
  }, [areas]); // Основная функция для сохранения области на сервере
  const saveAreaToServer = useCallback(
    (
      areaId: string,
      areaName: string,
      areaDescription: string,
      points: [number, number][]
    ) => {
      // Преобразуем координаты для сохранения в БД в зависимости от типа карты
      const storagePoints = convertPointsForStorage(points, mapConfig.mapType);

      const area: Area = {
        id: areaId,
        name: areaName,
        description: areaDescription,
        points: storagePoints, // Используем преобразованные координаты
        fillColor: config?.fillColor || '#60A5FA',
        strokeColor: config?.color || '#3B82F6',
        fillOpacity: config?.fillOpacity || 0.3,
      };

      const regionData = {
        ...regionBridge.toRegionData(area),
        mapType: mapConfig.mapType, // Добавляем тип карты
      };
      const isEditingExistingRegion = areaId.startsWith('region-');

      if (isEditingExistingRegion) {
        const regionId = regionBridge.areaIdToRegionId(areaId);
        updateRegion(regionId, regionData)
          .then(() => {
            const updatedAreas = areasRef.current.map((a) =>
              a.id === areaId
                ? { ...a, name: areaName, description: areaDescription, points }
                : a
            );
            setAreas(updatedAreas);
          })
          .catch((error: any) => {
            logError('Ошибка при обновлении области:', error);
          });
      } else {
        createRegion(regionData)
          .then((response) => {
            const newRegionId = regionBridge.regionIdToAreaId(response.id);
            const updatedAreas = areasRef.current.map((a) =>
              a.id === areaId ? { ...a, id: newRegionId } : a
            );
            if (drawnItemsRef.current) {
              drawnItemsRef.current.eachLayer((layer: any) => {
                if (layer.options?.areaId === areaId) {
                  layer.options.areaId = newRegionId;
                }
              });
            }
            setAreas(updatedAreas);
          })
          .catch((error) => {
            logError('Ошибка при сохранении области:', error);
          });
      }
    },
    [config, setAreas, mapConfig.mapType]
  ); // Функция, делающая полигон «перетаскиваемым» (через режим редактирования Leaflet)
  const makePolygonDraggable = useCallback(
    (polygon: L.Polygon | L.Rectangle) => {
      polygon.on('click', function (e: any) {
        // Если пользователь выбрал «корзину» – даём Leaflet-Draw самому удалить слой
        // Не блокируем события, чтобы удаление работало корректно
        if (isDeleteMode) return;

        if (isEditMode) {
          // Блокируем всплытие события только для режима редактирования
          // чтобы включить перетаскивание полигона
          L.DomEvent.stop(e);
          const editableLayer = polygon as any;
          if (
            editableLayer.editing &&
            typeof editableLayer.editing.enable === 'function'
          ) {
            editableLayer.editing.enable();
            if (!localStorage.getItem('drag_polygon_hint_shown')) {
              alert(
                'Для перемещения всей области целиком:\n' +
                  '1. Удерживайте клавишу Ctrl (или Command на Mac)\n' +
                  '2. Нажмите на любую точку области и перетащите её'
              );
              localStorage.setItem('drag_polygon_hint_shown', 'true');
            }
          }
        }
      });
    },
    [isEditMode, isDeleteMode]
  );

  // Вспомогательный хук для трекинга событий Leaflet (draw:start, stop и т. п.)
  useLeafletEvents({
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
  });

  // При изменении списка областей перерисовываем их на карте
  useEffect(() => {
    if (!isVisible || !drawnItemsRef.current) return;
    drawnItemsRef.current.clearLayers();
    areas.forEach((area) => {
      if (area.points.length > 2) {
        const polygon = PolygonFactory.createFromPoints(area.points, {
          areaId: area.id,
          strokeColor: area.strokeColor || config?.color || COLORS.primary.main,
          fillColor:
            area.fillColor || config?.fillColor || COLORS.primary.light,
          fillOpacity: area.fillOpacity || config?.fillOpacity || 0.3,
          weight: config?.weight || 2,
          isDraggable: true,
        });
        if (drawnItemsRef.current) {
          drawnItemsRef.current.addLayer(polygon);
          // В режиме редактирования делаем полигон сразу редактируемым
          if (isEditMode) {
            makePolygonDraggable(polygon);
          }
        }
      }
    });
  }, [areas, isVisible, config, isEditMode, makePolygonDraggable]);

  // Эффект для включения режима редактирования всех полигонов при переходе в режим EDIT
  useEffect(() => {
    if (!drawnItemsRef.current || !isEditMode) return;

    // Включаем редактирование для всех существующих полигонов
    drawnItemsRef.current.eachLayer((layer: any) => {
      if (layer instanceof L.Polygon || layer instanceof L.Rectangle) {
        // Включаем режим редактирования для каждого полигона
        if (layer.editing && typeof layer.editing.enable === 'function') {
          layer.editing.enable();
        }
        // Добавляем визуальную подсказку о том, что полигон редактируется
        layer.setStyle({
          ...layer.options,
          weight: (layer.options.weight || 2) + 1,
          opacity: 0.8,
          dashArray: '5, 5',
        });
      }
    });

    // При выходе из режима редактирования отключаем редактирование
    return () => {
      if (drawnItemsRef.current) {
        drawnItemsRef.current.eachLayer((layer: any) => {
          if (layer instanceof L.Polygon || layer instanceof L.Rectangle) {
            if (layer.editing && typeof layer.editing.disable === 'function') {
              layer.editing.disable();
            }
            // Возвращаем стандартный стиль
            layer.setStyle({
              ...layer.options,
              weight: layer.options.weight || 2,
              opacity: 1,
              dashArray: undefined,
            });
          }
        });
      }
    };
  }, [isEditMode]);

  // Управляем появлением/скрытием контролов рисования в зависимости от режима
  useEffect(() => {
    if (!map || !isVisible) return;

    // Удаляем предыдущий контрол, если он существует
    if (drawControl) {
      try {
        map.removeControl(drawControl);
      } catch {}
      setDrawControl(null);
    }

    // Инициализируем drawnItemsRef, если не инициализирован
    if (!drawnItemsRef.current) {
      drawnItemsRef.current = new L.FeatureGroup();
      map.addLayer(drawnItemsRef.current);
    }

    let newDrawControl: L.Control.Draw | null = null;
    if (isDrawingMode) {
      // Режим создания областей - показываем инструменты рисования
      newDrawControl = new L.Control.Draw({
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
              weight: config?.weight || 2,
            },
          },
          polygon: {
            allowIntersection: false,
            showArea: true,
            shapeOptions: {
              color: config?.color || COLORS.primary.main,
              fillColor: config?.fillColor || COLORS.primary.light,
              fillOpacity: config?.fillOpacity || 0.3,
              weight: config?.weight || 2,
            },
          },
        },
        edit: {
          featureGroup: drawnItemsRef.current,
          remove: false,
          edit: false,
        },
      });
    } else if (isEditMode) {
      // Режим редактирования объектов - показываем только инструменты редактирования
      newDrawControl = new L.Control.Draw({
        position: 'topleft',
        draw: {
          polyline: false,
          circle: false,
          circlemarker: false,
          marker: false,
          rectangle: false,
          polygon: false,
        },
        edit: {
          featureGroup: drawnItemsRef.current,
          remove: true,
          edit: {},
        },
      });
    }

    if (newDrawControl) {
      setDrawControl(newDrawControl);
      map.addControl(newDrawControl);
    }

    return () => {
      if (newDrawControl) {
        try {
          map.removeControl(newDrawControl);
        } catch {}
      }
    };
  }, [map, isVisible, isDrawingMode, isEditMode, config]);

  // Сброс флага завершения рисования при выходе из DRAW-режима
  useEffect(() => {
    if (!isDrawingMode) {
      setHasCompletedDrawing(false);
    }
  }, [isDrawingMode]);

  // Вызываем updateMapConfig, если нужно синхронизировать состояние с глобальным контекстом
  useEffect(() => {
    if (updateMapConfig && isDrawingMode) {
      updateMapConfig({ hasCompletedDrawing });
    }
  }, [hasCompletedDrawing, isDrawingMode, updateMapConfig]);

  // Обработчик сохранения при создании области (из модалки)
  const handleSaveAreaName = () => {
    if (!tempAreaData) return;
    const { newAreaId, points } = tempAreaData;
    const newArea: Area = {
      id: newAreaId,
      name: newAreaName || `Новая область ${areasRef.current.length + 1}`,
      description: newAreaDescription,
      points,
    };
    const updatedAreas = [...areasRef.current, newArea];
    setAreas(updatedAreas);
    saveAreaToServer(
      newAreaId,
      newArea.name,
      newArea.description || '',
      points
    );
    setIsModalOpen(false);
    setTempAreaData(null);
    setHasCompletedDrawing(true);
  };

  // Обработчик отмены при создании области
  const handleCancelAreaCreation = () => {
    if (tempAreaData && drawnItemsRef.current) {
      drawnItemsRef.current.removeLayer(tempAreaData.layer);
    }
    setIsModalOpen(false);
    setTempAreaData(null);
    setHasCompletedDrawing(false);
  };

  // Обработчик сохранения при редактировании
  const handleSaveAreaEdit = () => {
    if (!editingAreaId) return;
    const areaIndex = areasRef.current.findIndex((a) => a.id === editingAreaId);
    if (areaIndex !== -1) {
      const oldArea = areasRef.current[areaIndex];
      const updatedArea: Area = {
        ...oldArea,
        name: newAreaName || oldArea.name,
        description: newAreaDescription,
      };
      const updatedAreas = [...areasRef.current];
      updatedAreas[areaIndex] = updatedArea;
      setAreas(updatedAreas);

      if (editingAreaId.startsWith('region-')) {
        saveAreaToServer(
          editingAreaId,
          updatedArea.name,
          updatedArea.description || '',
          updatedArea.points
        );
      }
    }
    setIsEditModalOpen(false);
    setEditingAreaId(null);
  };

  // Обработчик отмены при редактировании
  const handleCancelAreaEdit = () => {
    setIsEditModalOpen(false);
    setEditingAreaId(null);
  };

  // Обработчики открытия модалок (например, по клику на слой — см. useLeafletEvents)
  const openCreateModal = (defaultName: string) => {
    setNewAreaName(defaultName);
    setNewAreaDescription('');
    setIsModalOpen(true);
  };

  const openEditModal = (areaId: string, name: string, description: string) => {
    setEditingAreaId(areaId);
    setNewAreaName(name);
    setNewAreaDescription(description);
    setIsEditModalOpen(true);
  };

  // Эффект для отслеживания режима удаления Leaflet Draw
  useEffect(() => {
    if (!map) return;

    const onDeleteStart = () => setIsDeleteMode(true);
    const onDeleteStop = () => setIsDeleteMode(false);

    map.on('draw:deletestart', onDeleteStart);
    map.on('draw:deletestop', onDeleteStop);

    return () => {
      map.off('draw:deletestart', onDeleteStart);
      map.off('draw:deletestop', onDeleteStop);
    };
  }, [map]);

  return (
    <>
      <AreaCreationModal
        isOpen={isModalOpen}
        onClose={handleCancelAreaCreation}
        newAreaName={newAreaName}
        setNewAreaName={setNewAreaName}
        newAreaDescription={newAreaDescription}
        setNewAreaDescription={setNewAreaDescription}
        onSave={handleSaveAreaName}
      />

      <AreaEditModal
        isOpen={isEditModalOpen}
        onClose={handleCancelAreaEdit}
        newAreaName={newAreaName}
        setNewAreaName={setNewAreaName}
        newAreaDescription={newAreaDescription}
        setNewAreaDescription={setNewAreaDescription}
        onSave={handleSaveAreaEdit}
      />
    </>
  );
};

export default MapDrawingLayer;
