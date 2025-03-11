import L from 'leaflet';
import React, { createContext, ReactNode, useContext, useReducer } from 'react';
import { SectorType, Specimen } from '../../specimens/types';
import { MapAction, MapData, MapMode, MapState } from '../types';

// Начальное состояние
const initialState: MapState = {
  mapInstance: null,
  mapReady: false,
  selectedMap: null,
  selectedSpecimen: null,
  selectedSector: SectorType.Dendrology, // По умолчанию дендрологический сектор
  mode: MapMode.VIEW,
  loading: false,
  error: null,
  isSimpleImageMode: false, // Добавляем флаг режима простого изображения
};

// Редуктор для обработки действий
const mapReducer = (state: MapState, action: MapAction): MapState => {
  switch (action.type) {
    case 'SET_MAP':
      return { ...state, mapInstance: action.payload };
    case 'SET_MAP_READY':
      return { ...state, mapReady: action.payload };
    case 'SET_SELECTED_MAP':
      return { ...state, selectedMap: action.payload };
    case 'SET_SELECTED_SPECIMEN':
      return { ...state, selectedSpecimen: action.payload };
    case 'SET_MODE':
      return { ...state, mode: action.payload };
    case 'SET_SELECTED_SECTOR':
      return { ...state, selectedSector: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      if (action.payload) {
        console.error('MapContext: Ошибка:', action.payload);
      }
      return { ...state, error: action.payload };
    case 'SET_SIMPLE_IMAGE_MODE':
      return { ...state, isSimpleImageMode: action.payload };
    default:
      return state;
  }
};

// Тип контекста
interface MapContextType {
  state: MapState;
  setMap: (map: L.Map | null) => void;
  setMapReady: (ready: boolean) => void;
  selectMap: (map: MapData) => void;
  selectSpecimen: (specimen: Specimen | null) => void;
  setMode: (mode: MapMode) => void;
  selectSector: (sectorType: SectorType) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSimpleImageMode: (isSimpleMode: boolean) => void; // Добавляем метод установки режима
}

// Создание контекста
const MapContext = createContext<MapContextType | undefined>(undefined);

// Провайдер контекста
export const MapProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(mapReducer, initialState);

  // Методы для диспетчеризации действий
  const setMap = (map: L.Map | null) => {
    try {
      dispatch({ type: 'SET_MAP', payload: map });
    } catch (error) {
      console.error('Ошибка при установке экземпляра карты:', error);
    }
  };

  const setMapReady = (ready: boolean) => {
    try {
      dispatch({ type: 'SET_MAP_READY', payload: ready });
    } catch (error) {
      console.error('Ошибка при установке готовности карты:', error);
    }
  };

  const selectMap = (map: MapData) =>
    dispatch({ type: 'SET_SELECTED_MAP', payload: map });

  const selectSpecimen = (specimen: Specimen | null) =>
    dispatch({ type: 'SET_SELECTED_SPECIMEN', payload: specimen });

  const setMode = (mode: MapMode) =>
    dispatch({ type: 'SET_MODE', payload: mode });

  const selectSector = (sectorType: SectorType) =>
    dispatch({ type: 'SET_SELECTED_SECTOR', payload: sectorType });

  const setLoading = (loading: boolean) =>
    dispatch({ type: 'SET_LOADING', payload: loading });

  const setError = (error: string | null) =>
    dispatch({ type: 'SET_ERROR', payload: error });

  const setSimpleImageMode = (isSimpleMode: boolean) => {
    if (state.isSimpleImageMode !== isSimpleMode) {
      dispatch({ type: 'SET_SIMPLE_IMAGE_MODE', payload: isSimpleMode });
    }
  };

  const value = {
    state,
    setMap,
    setMapReady,
    selectMap,
    selectSpecimen,
    setMode,
    selectSector,
    setLoading,
    setError,
    setSimpleImageMode,
  };

  return <MapContext.Provider value={value}>{children}</MapContext.Provider>;
};

// Хук для использования контекста
export const useMapContext = () => {
  const context = useContext(MapContext);
  if (context === undefined) {
    throw new Error('useMapContext должен использоваться внутри MapProvider');
  }
  return context;
};
