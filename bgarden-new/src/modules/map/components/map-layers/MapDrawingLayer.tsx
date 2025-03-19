import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import { useMap } from 'react-leaflet';
import 'leaflet-draw';
import 'leaflet-draw/dist/leaflet.draw.css';
import { useMapConfig, MAP_MODES } from '../../contexts/MapConfigContext';
import { useMap as useMapContext } from '../../hooks';
import { Area } from '../../contexts/MapContext';
import { COLORS } from '../../../../styles/global-styles';
import { createRegion, convertPointsToPolygonCoordinates } from '../../services/regionService';
import { logError } from '@/utils/logger';
import { RegionData, SectorType } from '../../types/mapTypes';
import { Button } from '../../../../modules/ui';
import Modal from '../../../../modules/ui/components/Modal';
import { TextField } from '../../../../modules/ui/components/Form';

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
  
  // Состояние для модального окна
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAreaName, setNewAreaName] = useState('');
  const [newAreaDescription, setNewAreaDescription] = useState('');
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
  }, [calculatePolygonCenter, config, setAreas]);

  // Создаем группу для хранения нарисованных объектов при первом рендере
  useEffect(() => {
    if (!isVisible) return;

    // Инициализация drawnItems если еще не создана
    if (!drawnItemsRef.current) {
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
          
          // Подготавливаем данные для новой области
          let points: [number, number][] = [];
          
          if (layer instanceof L.Polygon || layer instanceof L.Rectangle) {
            const coords = layer.getLatLngs()[0];
            if (Array.isArray(coords)) {
              // Приводим координаты к нужному формату
              points = coords.map((coord: any) => 
                [coord.lat, coord.lng] as [number, number]
              );
              
              // Сохраняем временные данные новой области
              setTempAreaData({
                newAreaId,
                layer,
                points
              });
              
              // Открываем модальное окно для ввода имени области
              setNewAreaName(`Новая область ${areasRef.current.length + 1}`);
              setNewAreaDescription('');
              setIsModalOpen(true);
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
  }, [map, isVisible, config, calculatePolygonCenter, areas, saveAreaToServer]);

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

  // Обработчик сохранения имени области из модального окна
  const handleSaveAreaName = () => {
    if (!tempAreaData) return;
    
    const { newAreaId, points } = tempAreaData;
    
    // Создаем новую область с введенным именем
    const newArea: Area = {
      id: newAreaId,
      name: newAreaName || `Новая область ${areasRef.current.length + 1}`,
      description: newAreaDescription,
      points: points
    };
    
    // Обновляем состояние областей
    const updatedAreas = [...areasRef.current, newArea];
    setAreas(updatedAreas);
    
    // Сохраняем на сервере
    saveAreaToServer(newAreaId, newArea.name, newArea.description || '', points);
    
    // Закрываем модальное окно и очищаем временные данные
    setIsModalOpen(false);
    setTempAreaData(null);
  };

  // Обработчик отмены создания области
  const handleCancelAreaCreation = () => {
    if (tempAreaData && drawnItemsRef.current) {
      // Удаляем нарисованную область с карты
      drawnItemsRef.current.removeLayer(tempAreaData.layer);
    }
    
    // Закрываем модальное окно и очищаем временные данные
    setIsModalOpen(false);
    setTempAreaData(null);
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
    </>
  );
};

export default MapDrawingLayer; 