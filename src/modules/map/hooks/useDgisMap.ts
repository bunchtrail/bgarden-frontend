import { useState, useEffect, useCallback } from 'react';
import { 
  dgisMapProvider, 
  createDgisMapProvider, 
  DgisMapSettings,
  DgisMapProvider 
} from '../services/dgisMapProvider';
import { useMapConfig, MAP_TYPES } from '../contexts/MapConfigContext';

interface UseDgisMapOptions {
  autoCheckAvailability?: boolean;
  customSettings?: Partial<DgisMapSettings>;
}

interface UseDgisMapReturn {
  provider: DgisMapProvider;
  isAvailable: boolean | null;
  isLoading: boolean;
  settings: DgisMapSettings;
  isDgisMapActive: boolean;
  checkAvailability: () => Promise<boolean>;
  updateSettings: (newSettings: Partial<DgisMapSettings>) => void;
  switchToDgisMap: () => void;
}

/**
 * Хук для работы с провайдером карты 2ГИС
 * 
 * @param options - Опции хука
 * @returns Объект с методами и состоянием провайдера 2ГИС
 */
export const useDgisMap = (options: UseDgisMapOptions = {}): UseDgisMapReturn => {
  const { 
    autoCheckAvailability = true, 
    customSettings 
  } = options;

  const { mapConfig, setMapType } = useMapConfig();
  
  // Создаем провайдер (кастомный или используем глобальный)
  const [provider] = useState<DgisMapProvider>(() => 
    customSettings ? createDgisMapProvider(customSettings) : dgisMapProvider
  );

  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Проверяем доступность сервиса
  const checkAvailability = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      const available = await provider.checkAvailability();
      setIsAvailable(available);
      return available;
    } catch (error) {
      console.error('Error checking 2GIS availability:', error);
      setIsAvailable(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [provider]);

  // Автоматическая проверка доступности при монтировании
  useEffect(() => {
    if (autoCheckAvailability) {
      checkAvailability();
    }
  }, [autoCheckAvailability, checkAvailability]);

  // Обновление настроек провайдера
  const updateSettings = useCallback((newSettings: Partial<DgisMapSettings>) => {
    provider.updateSettings(newSettings);
  }, [provider]);

  // Переключение на карту 2ГИС
  const switchToDgisMap = useCallback(() => {
    setMapType(MAP_TYPES.DGIS);
  }, [setMapType]);

  // Проверяем, активна ли карта 2ГИС
  const isDgisMapActive = mapConfig.mapType === MAP_TYPES.DGIS;

  return {
    provider,
    isAvailable,
    isLoading,
    settings: provider.getSettings(),
    isDgisMapActive,
    checkAvailability,
    updateSettings,
    switchToDgisMap,
  };
}; 