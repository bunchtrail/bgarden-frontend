// Контекст для работы с картой

import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { MapData, getActiveMap } from '../services/mapService';

// Тип для растения на карте
export interface Plant {
  id: string;
  name: string;
  position: [number, number]; // [x, y] координаты
  description?: string;
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
  deletePlant: (id: string) => void;
  selectedPlantId: string | null;
  setSelectedPlantId: (id: string | null) => void;
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

  // Загружаем карту при монтировании компонента
  useEffect(() => {
    loadMapFromServer();
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

  // Удалить растение
  const deletePlant = (id: string) => {
    setPlants((prevPlants) => prevPlants.filter((plant) => plant.id !== id));
    if (selectedPlantId === id) {
      setSelectedPlantId(null);
    }
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
