import { useCallback } from 'react';
import { useMapContext } from '../contexts/MapContext';
import { mapService } from '../services/mapService';
import { specimenService } from '../../specimens/services/specimenService';
import { MapMode } from '../types';

/**
 * Хук для работы с элементами управления картой
 */
export const useMapControls = () => {
  const { state, setMode, selectSpecimen, setLoading, setError } = useMapContext();
  
  /**
   * Переключение в режим добавления растения
   */
  const startAddingPlant = useCallback(() => {
    setMode(MapMode.ADD_PLANT);
    selectSpecimen(null);
  }, [setMode, selectSpecimen]);
  
  /**
   * Переключение в режим редактирования растения
   */
  const startEditingPlant = useCallback(() => {
    setMode(MapMode.EDIT_PLANT);
  }, [setMode]);
  
  /**
   * Переключение в режим удаления растения
   */
  const startDeletingPlant = useCallback(() => {
    setMode(MapMode.DELETE_PLANT);
    selectSpecimen(null);
  }, [setMode, selectSpecimen]);
  
  /**
   * Переключение в режим просмотра
   */
  const cancelAction = useCallback(() => {
    setMode(MapMode.VIEW);
  }, [setMode]);
  
  /**
   * Удаление растения
   */
  const deletePlant = useCallback(async (id: number) => {
    try {
      setLoading(true);
      await specimenService.deleteSpecimen(id);
      selectSpecimen(null);
      setMode(MapMode.VIEW);
      return true;
    } catch (error) {
      console.error('Ошибка при удалении растения:', error);
      setError('Не удалось удалить растение');
      return false;
    } finally {
      setLoading(false);
    }
  }, [setLoading, selectSpecimen, setMode, setError]);
  
  return {
    mode: state.mode,
    selectedSpecimen: state.selectedSpecimen,
    loading: state.loading,
    startAddingPlant,
    startEditingPlant,
    startDeletingPlant,
    cancelAction,
    deletePlant
  };
};

export default useMapControls; 