import React, { createContext, useContext, useState, ReactNode } from 'react';

// Тип для области на карте
export interface Area {
  id: string;
  name: string;
  points: [number, number][];
  description?: string;
  fillColor?: string;
  strokeColor?: string;
  fillOpacity?: number;
}

// Тип для растения на карте
export interface Plant {
  id: string;
  name: string;
  latinName?: string;
  description?: string;
  position: [number, number]; // [x, y] координаты на карте
}

// Тип для контекста карты
interface MapContextType {
  areas: Area[];
  setAreas: (areas: Area[]) => void;
  selectedAreaId: string | null;
  setSelectedAreaId: (id: string | null) => void;
  plants: Plant[];
  setPlants: (plants: Plant[]) => void;
}

// Создаем контекст
const MapContext = createContext<MapContextType | undefined>(undefined);

// Провайдер контекста
export const MapProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [areas, setAreas] = useState<Area[]>([]);
  const [selectedAreaId, setSelectedAreaId] = useState<string | null>(null);
  const [plants, setPlants] = useState<Plant[]>([]);

  return (
    <MapContext.Provider 
      value={{ 
        areas, 
        setAreas, 
        selectedAreaId, 
        setSelectedAreaId,
        plants,
        setPlants
      }}
    >
      {children}
    </MapContext.Provider>
  );
};

// Хук для использования контекста
export const useMapContext = () => {
  const context = useContext(MapContext);
  if (context === undefined) {
    throw new Error('useMapContext must be used within a MapProvider');
  }
  return context;
}; 