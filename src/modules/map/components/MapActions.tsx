// Панель действий на карте (добавить, редактировать, удалить)

import React, { useState } from 'react';
import { useMapContext } from '../contexts';
import styles from '../styles/map.module.css';
import { useNavigate } from 'react-router-dom';

const MapActions: React.FC = () => {
  const { 
    plants, 
    deletePlant, 
    selectedPlantId, 
    setSelectedPlantId,
    deletingPlant,
    deletePlantError
  } = useMapContext();
  
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const navigate = useNavigate();

  const selectedPlant = plants.find((plant) => plant.id === selectedPlantId);

  const handleDeleteClick = () => {
    setShowConfirmDelete(true);
    // Сбрасываем статус успешного удаления при открытии диалога
    setDeleteSuccess(false);
  };

  const handleConfirmDelete = async () => {
    if (selectedPlantId) {
      const success = await deletePlant(selectedPlantId);
      if (success) {
        setDeleteSuccess(true);
        // После успешного удаления закрываем диалог через небольшую задержку
        setTimeout(() => {
          setShowConfirmDelete(false);
          setDeleteSuccess(false);
        }, 1500);
      }
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmDelete(false);
    setDeleteSuccess(false);
  };

  const deselectPlant = () => {
    setSelectedPlantId(null);
  };

  if (!selectedPlant) {
    return null;
  }

  return (
    <div className={`${styles.selectedPlantPanel} p-4`}>
      <div className={styles.mapControlHeader}>
        <span className={styles.mapControlTitle}>Выбранное растение</span>
      </div>

      <div className='mb-4'>
        <h3 className={`${styles.specimenTitle} text-sm`}>
          {selectedPlant.name || 'Тестовое растение'}
        </h3>
        <p className="text-xs text-[#86868B] mt-1 leading-relaxed">
          {selectedPlant.latinName || 'Testus Plantus'}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <button 
          className={`${styles.controlButton} ${styles.controlButtonActive} px-2 py-1.5 text-xs rounded-lg shadow-sm transition-all duration-200`}
          onClick={() => navigate(`/specimens/${selectedPlant.id}`)}
        >
          Подробно
        </button>
        <button 
          className={`${styles.controlButton} px-2 py-1.5 text-xs rounded-lg transition-colors`}
          onClick={() => deselectPlant()}
        >
          Закрыть
        </button>
        <button 
          className="px-2 py-1.5 text-xs rounded-lg text-[#FF3B30] border border-[#FFE5E5] bg-[#FFF5F5] hover:bg-[#FFE0E0] active:bg-[#FFCBCB] transition-all duration-200 shadow-sm"
          onClick={handleDeleteClick}
          disabled={deletingPlant}
        >
          {deletingPlant ? 'Удаление...' : 'Удалить'}
        </button>
      </div>
      
      {showConfirmDelete && (
        <div className={`mt-3 p-3 ${deleteSuccess ? 'bg-[#E2F9EB] border border-[#30D158]' : 'bg-[#FFF5F5] border border-[#FF3B30]'} rounded-md shadow-sm transition-all duration-300`}>
          {deleteSuccess ? (
            <p className='text-xs text-[#30D158] mb-2 font-medium'>
              Растение успешно удалено!
            </p>
          ) : deletePlantError ? (
            <>
              <p className='text-xs text-[#FF3B30] mb-2 font-medium'>
                Ошибка при удалении растения
              </p>
              <p className='text-xs text-[#4a5568] mb-2'>
                {deletePlantError}
              </p>
              <div className='grid grid-cols-2 gap-2'>
                <button
                  className='px-2 py-1.5 text-xs rounded-md bg-[#F5F5F7] border border-[#E5E5EA] hover:bg-[#E5E5EA] transition-all duration-200'
                  onClick={handleCancelDelete}
                >
                  Закрыть
                </button>
                <button
                  className='px-2 py-1.5 text-xs rounded-md bg-[#FF3B30] text-white hover:bg-[#E73229] transition-all duration-200 shadow-sm'
                  onClick={handleConfirmDelete}
                  disabled={deletingPlant}
                >
                  Повторить
                </button>
              </div>
            </>
          ) : (
            <>
              <p className='text-xs text-[#FF3B30] mb-2 font-medium'>
                Удалить растение?
              </p>
              <div className='grid grid-cols-2 gap-2'>
                <button
                  className='px-2 py-1.5 text-xs rounded-md bg-[#F5F5F7] border border-[#E5E5EA] hover:bg-[#E5E5EA] transition-all duration-200'
                  onClick={handleCancelDelete}
                  disabled={deletingPlant}
                >
                  Отмена
                </button>
                <button
                  className='px-2 py-1.5 text-xs rounded-md bg-[#FF3B30] text-white hover:bg-[#E73229] transition-all duration-200 shadow-sm'
                  onClick={handleConfirmDelete}
                  disabled={deletingPlant}
                >
                  {deletingPlant ? (
                    <span className="flex items-center justify-center">
                      <span className="w-3 h-3 mr-1 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Удаление
                    </span>
                  ) : (
                    'Удалить'
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default MapActions;
