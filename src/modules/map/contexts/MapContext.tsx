// Контекст для работы с картой

import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { MapData, getActiveMap } from '../services/mapService';
import {
  SpecimenData,
  convertSpecimensToPlants,
  getAllSpecimens,
  deleteSpecimen
} from '../services/plantService';
import {
  convertRegionsToAreas,
  getAllRegions,
  createRegion,
  convertPointsToPolygonCoordinates
} from '../services/regionService';
import { RegionData } from '../types/mapTypes';

// Перечисление режимов работы с картой
export enum MapMode {
  VIEW = 'view', // Просмотр
  ADD = 'add', // Добавление маркера
  EDIT = 'edit', // Редактирование маркеров
  AREA = 'area', // Добавление области
  FILTER = 'filter', // Фильтрация
  SELECT_LOCATION = 'select_location', // Новый режим: выбор геопозиции
}

// Тип для растения на карте
export interface Plant {
  id: string;
  name: string;
  position: [number, number]; // [x, y] координаты
  description?: string;
  latinName?: string; // Добавляем латинское название
}

// Тип для области на карте
export interface Area {
  id: string;
  name: string;
  points: [number, number][]; // Массив точек, образующих полигон
  description?: string;
  strokeColor?: string;
  fillColor?: string;
  fillOpacity?: number;
}

// Интерфейс для геопозиции на карте
export interface GeoPosition {
  latitude: number;
  longitude: number;
  timestamp: number;
}

// Интерфейс для настроек кластеризации маркеров
export interface ClusteringSettings {
  enabled: boolean;
  // Оставляем только флаг включения/выключения
}

// Интерфейс для параметров создания области
export interface CreateAreaParams {
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  radius: number;
  strokeColor: string;
  fillColor: string;
  fillOpacity: number;
  sectorType: number;
  boundaryWkt: string;
}

// Тип для контекста карты
interface MapContextType {
  customImage: string | null;
  setCustomImage: (url: string | null) => void;
  mapData: MapData | null;
  loadingMap: boolean;
  loadMapError: string | null;
  loadMapFromServer: () => Promise<void>;
  plants: Plant[];
  addPlant: (plant: Omit<Plant, 'id'>) => void;
  updatePlant: (id: string, plant: Partial<Omit<Plant, 'id'>>) => void;
  deletePlant: (id: string) => Promise<boolean>;
  selectedPlantId: string | null;
  setSelectedPlantId: (id: string | null) => void;
  // Режимы
  currentMode: MapMode;
  setCurrentMode: (mode: MapMode) => void;
  // Области
  areas: Area[];
  addArea: (area: Omit<Area, 'id'>) => void;
  updateArea: (id: string, area: Partial<Omit<Area, 'id'>>) => void;
  deleteArea: (id: string) => void;
  selectedAreaId: string | null;
  setSelectedAreaId: (id: string | null) => void;
  // Для режима добавления области
  currentAreaPoints: [number, number][];
  addPointToArea: (point: [number, number]) => void;
  clearAreaPoints: () => void;
  removeLastPoint: () => void;
  // Модальное окно
  isAreaFormOpen: boolean;
  openAreaForm: () => void;
  closeAreaForm: () => void;
  finishDrawing: () => void;
  saveCurrentArea: (areaParams: CreateAreaParams) => void;
  isDrawingComplete: boolean;
  // Геопозиция
  selectedPosition: GeoPosition | null;
  savePosition: (position: [number, number]) => void;
  clearSelectedPosition: () => void;
  // Настройки кластеризации
  clusteringSettings: ClusteringSettings;
  updateClusteringSettings: (settings: Partial<ClusteringSettings>) => void;
  toggleClustering: () => void;
  // Добавляем поля для работы с растениями с сервера
  loadingPlants: boolean;
  loadPlantsError: string | null;
  loadPlantsFromServer: () => Promise<void>;
  specimensData: SpecimenData[];
  // Добавляем поля для работы с областями (регионами) с сервера
  loadingRegions: boolean;
  loadRegionsError: string | null;
  loadRegionsFromServer: () => Promise<void>;
  regionsData: RegionData[];
  // Добавляем состояние для отслеживания процесса удаления
  deletingPlant: boolean;
  deletePlantError: string | null;
}

// Создаем контекст
const MapContext = createContext<MapContextType | undefined>(undefined);

// Провайдер контекста
export const MapProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [plants, setPlants] = useState<Plant[]>([]);
  const [selectedPlantId, setSelectedPlantId] = useState<string | null>(null);

  // Состояние для карты с сервера
  const [mapData, setMapData] = useState<MapData | null>(null);
  const [loadingMap, setLoadingMap] = useState<boolean>(false);
  const [loadMapError, setLoadMapError] = useState<string | null>(null);

  // Состояние для загрузки растений с сервера
  const [loadingPlants, setLoadingPlants] = useState<boolean>(false);
  const [loadPlantsError, setLoadPlantsError] = useState<string | null>(null);
  const [specimensData, setSpecimensData] = useState<SpecimenData[]>([]);

  // Состояние для областей (регионов) с сервера
  const [regionsData, setRegionsData] = useState<RegionData[]>([]);
  const [loadingRegions, setLoadingRegions] = useState<boolean>(false);
  const [loadRegionsError, setLoadRegionsError] = useState<string | null>(null);

  // Настройки кластеризации
  const [clusteringSettings, setClusteringSettings] =
    useState<ClusteringSettings>(() => {
      // Загружаем настройки из localStorage или используем значения по умолчанию
      const savedSettings = localStorage.getItem('mapClusteringSettings');
      if (savedSettings) {
        try {
          const parsed = JSON.parse(savedSettings);
          return { enabled: parsed.enabled };
        } catch (e) {
          console.error('Ошибка при загрузке настроек кластеризации:', e);
        }
      }

      // Значения по умолчанию
      return {
        enabled: true,
      };
    });

  // Сохраняем настройки в localStorage при их изменении
  useEffect(() => {
    localStorage.setItem(
      'mapClusteringSettings',
      JSON.stringify(clusteringSettings)
    );
  }, [clusteringSettings]);

  // Обновление настроек кластеризации (упрощено до включения/выключения)
  const updateClusteringSettings = (settings: Partial<ClusteringSettings>) => {
    setClusteringSettings((prev) => ({
      ...prev,
      ...settings,
    }));
  };

  // Включение/выключение кластеризации
  const toggleClustering = () => {
    setClusteringSettings((prev) => ({
      enabled: !prev.enabled,
    }));
  };

  // Состояния для режимов и областей
  const [currentMode, setCurrentMode] = useState<MapMode>(MapMode.VIEW);
  const [areas, setAreas] = useState<Area[]>([]);
  const [selectedAreaId, setSelectedAreaId] = useState<string | null>(null);
  const [currentAreaPoints, setCurrentAreaPoints] = useState<
    [number, number][]
  >([]);

  // Состояния для управления формой области
  const [isAreaFormOpen, setIsAreaFormOpen] = useState<boolean>(false);
  const [isDrawingComplete, setIsDrawingComplete] = useState<boolean>(false);

  // Состояние для хранения выбранной геопозиции
  const [selectedPosition, setSelectedPosition] = useState<GeoPosition | null>(
    null
  );

  // Добавляем состояние для отслеживания процесса удаления
  const [deletingPlant, setDeletingPlant] = useState<boolean>(false);
  const [deletePlantError, setDeletePlantError] = useState<string | null>(null);

  // Функция для загрузки карты с сервера
  const loadMapFromServer = async () => {
    try {
      setLoadingMap(true);
      setLoadMapError(null);
      const maps = await getActiveMap();
      if (maps && maps.length > 0) {
        setMapData(maps[0]);
        // Формируем путь к изображению
        const imageUrl = `http://localhost:7254${maps[0].filePath}`;
        setCustomImage(imageUrl);
      } else {
        setLoadMapError('Активная карта не найдена');
      }
    } catch (error) {
      console.error('Ошибка при загрузке карты:', error);
      setLoadMapError('Ошибка при загрузке карты');
    } finally {
      setLoadingMap(false);
    }
  };

  // Функция для загрузки растений с сервера
  const loadPlantsFromServer = async () => {
    try {
      setLoadingPlants(true);
      setLoadPlantsError(null);

      const specimens = await getAllSpecimens();
      setSpecimensData(specimens);

      // Преобразуем данные с сервера в формат для отображения на карте
      const plantsData = convertSpecimensToPlants(specimens);
      setPlants(plantsData);
    } catch (error) {
      console.error('Ошибка при загрузке растений:', error);
      setLoadPlantsError('Ошибка при загрузке растений');
    } finally {
      setLoadingPlants(false);
    }
  };

  // Функция для загрузки областей (регионов) с сервера
  const loadRegionsFromServer = async () => {
    setLoadingRegions(true);
    setLoadRegionsError(null);
    try {
      const regions = await getAllRegions();
      setRegionsData(regions);

      // Преобразуем и добавляем области на карту
      const convertedAreas = convertRegionsToAreas(regions);
      setAreas(convertedAreas);
    } catch (error) {
      console.error('Ошибка при загрузке областей:', error);
      setLoadRegionsError(
        'Не удалось загрузить области. Пожалуйста, попробуйте позже.'
      );
    } finally {
      setLoadingRegions(false);
    }
  };

  // Загружаем карту и растения при монтировании компонента
  useEffect(() => {
    loadMapFromServer();
    loadPlantsFromServer();
    loadRegionsFromServer(); // Добавляем загрузку областей
  }, []);

  // Добавить новое растение
  const addPlant = (plantData: Omit<Plant, 'id'>) => {
    const newPlant: Plant = {
      ...plantData,
      id: `plant-${Date.now()}`,
    };
    setPlants((prevPlants) => [...prevPlants, newPlant]);
  };

  // Обновить существующее растение
  const updatePlant = (id: string, plantData: Partial<Omit<Plant, 'id'>>) => {
    setPlants((prevPlants) =>
      prevPlants.map((plant) =>
        plant.id === id ? { ...plant, ...plantData } : plant
      )
    );
  };

  // Обновляем функцию удаления растения для работы с API
  const deletePlant = async (id: string): Promise<boolean> => {
    try {
      setDeletingPlant(true);
      setDeletePlantError(null);
      
      // Извлекаем числовой ID из строки формата "specimen-123"
      const numericId = parseInt(id.replace('specimen-', ''));
      
      if (isNaN(numericId)) {
        throw new Error('Неверный формат ID растения');
      }
      
      // Отправляем запрос на удаление на сервер
      await deleteSpecimen(numericId);
      
      // Удаляем растение из локального состояния
      setPlants((prevPlants) => prevPlants.filter((plant) => plant.id !== id));
      
      if (selectedPlantId === id) {
        setSelectedPlantId(null);
      }
      
      return true;
    } catch (error) {
      console.error('Ошибка при удалении растения:', error);
      setDeletePlantError(error instanceof Error ? error.message : 'Неизвестная ошибка при удалении растения');
      return false;
    } finally {
      setDeletingPlant(false);
    }
  };

  // Функции для работы с областями
  const addArea = (areaData: Omit<Area, 'id'>) => {
    const newArea: Area = {
      ...areaData,
      id: `area-${Date.now()}`,
    };
    setAreas((prevAreas) => [...prevAreas, newArea]);
  };

  const updateArea = (id: string, areaData: Partial<Omit<Area, 'id'>>) => {
    setAreas((prevAreas) =>
      prevAreas.map((area) =>
        area.id === id ? { ...area, ...areaData } : area
      )
    );
  };

  const deleteArea = (id: string) => {
    setAreas((prevAreas) => prevAreas.filter((area) => area.id !== id));
    if (selectedAreaId === id) {
      setSelectedAreaId(null);
    }
  };

  // Функции для режима добавления области
  const addPointToArea = (point: [number, number]) => {
    setCurrentAreaPoints((prevPoints) => [...prevPoints, point]);
  };

  const clearAreaPoints = () => {
    setCurrentAreaPoints([]);
    setIsDrawingComplete(false);
  };

  const removeLastPoint = () => {
    setCurrentAreaPoints((prevPoints) =>
      prevPoints.length > 0
        ? prevPoints.slice(0, prevPoints.length - 1)
        : prevPoints
    );
  };

  // Завершить рисование и открыть форму
  const finishDrawing = () => {
    if (currentAreaPoints.length >= 3) {
      setIsDrawingComplete(true);
      openAreaForm();
    }
  };

  // Управление модальным окном
  const openAreaForm = () => {
    setIsAreaFormOpen(true);
  };

  const closeAreaForm = () => {
    setIsAreaFormOpen(false);
  };

  // Сохранить текущую область
  const saveCurrentArea = async (areaParams: CreateAreaParams) => {
    if (currentAreaPoints.length >= 3) {
      try {
        // Конвертируем точки в формат JSON
        const polygonCoordinates = convertPointsToPolygonCoordinates(currentAreaPoints);
        
        // Создаем объект для API
        const regionData = {
          ...areaParams,
          polygonCoordinates
        };
        
        // Отправляем запрос на создание области
        const createdRegion = await createRegion(regionData);
        
        // Добавляем созданную область в локальное состояние
        addArea({
          name: createdRegion.name,
          points: currentAreaPoints,
          description: createdRegion.description,
          strokeColor: createdRegion.strokeColor,
          fillColor: createdRegion.fillColor,
          fillOpacity: createdRegion.fillOpacity
        });
        
        // Перезагружаем области с сервера
        await loadRegionsFromServer();
        
        // Очищаем точки и закрываем форму
        clearAreaPoints();
        closeAreaForm();
        setIsDrawingComplete(false);
      } catch (error) {
        console.error('Ошибка при сохранении области:', error);
        // Здесь можно добавить обработку ошибок, например, показать уведомление
      }
    }
  };

  // Функция для сохранения геопозиции
  const savePosition = (position: [number, number]) => {
    setSelectedPosition({
      latitude: position[0],
      longitude: position[1],
      timestamp: Date.now(),
    });
    console.log(
      `Сохранена позиция: широта ${position[0]}, долгота ${position[1]}`
    );
  };

  // Функция для очистки выбранной позиции
  const clearSelectedPosition = () => {
    setSelectedPosition(null);
  };

  const value = {
    customImage,
    setCustomImage,
    mapData,
    loadingMap,
    loadMapError,
    loadMapFromServer,
    plants,
    addPlant,
    updatePlant,
    deletePlant,
    selectedPlantId,
    setSelectedPlantId,
    // Режимы
    currentMode,
    setCurrentMode,
    // Области
    areas,
    addArea,
    updateArea,
    deleteArea,
    selectedAreaId,
    setSelectedAreaId,
    // Для режима добавления области
    currentAreaPoints,
    addPointToArea,
    clearAreaPoints,
    removeLastPoint,
    // Модальное окно
    isAreaFormOpen,
    openAreaForm,
    closeAreaForm,
    finishDrawing,
    saveCurrentArea,
    isDrawingComplete,
    // Геопозиция
    selectedPosition,
    savePosition,
    clearSelectedPosition,
    // Настройки кластеризации
    clusteringSettings,
    updateClusteringSettings,
    toggleClustering,
    // Добавляем новые поля
    loadingPlants,
    loadPlantsError,
    loadPlantsFromServer,
    specimensData,
    // Поля для работы с областями (регионами) с сервера
    loadingRegions,
    loadRegionsError,
    loadRegionsFromServer,
    regionsData,
    // Добавляем новые свойства в контекст
    deletingPlant,
    deletePlantError,
  };

  return <MapContext.Provider value={value}>{children}</MapContext.Provider>;
};

// Хук для использования контекста карты
export const useMapContext = () => {
  const context = useContext(MapContext);
  if (context === undefined) {
    throw new Error('useMapContext must be used within a MapProvider');
  }
  return context;
};

export default MapContext;
