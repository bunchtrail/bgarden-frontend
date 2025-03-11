import L from 'leaflet';
import { SectorType, Specimen } from '../../specimens/types';

// Тип для карты
export interface MapData {
  id: number;
  name: string;
  description: string;
  filePath: string;
  contentType: string;
  fileSize: number;
  uploadDate: string;
  lastUpdated: string;
  isActive: boolean;
  specimensCount: number;
}

// Тип для ошибок в модуле карты
export interface MapError {
  message: string;
  details?: any;
}

// Режимы взаимодействия с картой
export enum MapMode {
  VIEW = 'view', // Режим просмотра
  ADD_PLANT = 'add_plant', // Режим добавления растения
  EDIT_PLANT = 'edit_plant', // Режим редактирования растения
  DELETE_PLANT = 'delete_plant' // Режим удаления растения
}

// Интерфейс для координат растения
export interface PlantLocation {
  latitude: number;
  longitude: number;
}

// Состояние контекста карты
export interface MapState {
  mapInstance: L.Map | null;
  mapReady: boolean;
  selectedMap: MapData | null;
  selectedSpecimen: Specimen | null;
  selectedSector: SectorType;
  mode: MapMode;
  loading: boolean;
  error: string | null;
  isSimpleImageMode: boolean; // Флаг режима простого изображения
}

// Типы действий для работы с контекстом карты
export type MapAction =
  | { type: 'SET_MAP'; payload: L.Map | null }
  | { type: 'SET_MAP_READY'; payload: boolean }
  | { type: 'SET_SELECTED_MAP'; payload: MapData }
  | { type: 'SET_SELECTED_SPECIMEN'; payload: Specimen | null }
  | { type: 'SET_MODE'; payload: MapMode }
  | { type: 'SET_SELECTED_SECTOR'; payload: SectorType }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_SIMPLE_IMAGE_MODE'; payload: boolean }; 