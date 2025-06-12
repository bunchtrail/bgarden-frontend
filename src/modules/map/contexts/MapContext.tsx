import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Area, Plant } from '@/services/regions/types';

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
export const MapProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
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
        setPlants,
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
