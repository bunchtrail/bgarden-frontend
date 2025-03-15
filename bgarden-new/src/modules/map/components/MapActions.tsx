// Панель действий на карте (добавить, редактировать, удалить)

import React, { useState } from 'react';
import { useMapContext, useModalContext } from '../contexts';
import styles from '../styles/map.module.css';
import useNotification from '../../notifications/hooks/useNotification';

const MapActions: React.FC = () => {
  const { 
    plants, 
    deletePlant, 
    selectedPlantId, 
    setSelectedPlantId,
    deletingPlant,
    deletePlantError
  } = useMapContext();
  
  const { openModal } = useModalContext();
  const notification = useNotification();
  
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const selectedPlant = plants.find((plant) => plant.id === selectedPlantId);

  const handleDeleteClick = () => {
    setShowConfirmDelete(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedPlantId) {
      const success = await deletePlant(selectedPlantId);
      if (success) {
        notification.success('Растение успешно удалено');
        // После успешного удаления закрываем диалог
        setShowConfirmDelete(false);
      } else if (deletePlantError) {
        notification.error(`Ошибка при удалении растения: ${deletePlantError}`);
      }
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmDelete(false);
  };

  const deselectPlant = () => {
    setSelectedPlantId(null);
  };

  const handleShowDetails = () => {
    if (selectedPlantId) {
      openModal(selectedPlantId);
    }
  };

  if (!selectedPlant) {
    return null;
  }

  return (
    <>
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
            className={`${styles.controlButton} ${styles.controlButtonActive} px-2 py-1.5 text-xs rounded-lg shadow-sm transition-all duration-200 flex items-center justify-center`}
            onClick={handleShowDetails}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
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
          <div className="mt-3 p-3 bg-[#FFF5F5] border border-[#FF3B30] rounded-md shadow-sm">
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
          </div>
        )}
      </div>
    </>
  );
};

export default MapActions;