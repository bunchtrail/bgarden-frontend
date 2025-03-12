// Панель действий на карте (добавить, редактировать, удалить)

import React, { useState } from 'react';
import { useMapContext } from '../contexts';
import styles from '../styles/map.module.css';

const MapActions: React.FC = () => {
  const { plants, deletePlant, selectedPlantId, setSelectedPlantId } =
    useMapContext();
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const selectedPlant = plants.find((plant) => plant.id === selectedPlantId);

  const handleDeleteClick = () => {
    setShowConfirmDelete(true);
  };

  const handleConfirmDelete = () => {
    if (selectedPlantId) {
      deletePlant(selectedPlantId);
      setShowConfirmDelete(false);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmDelete(false);
  };

  if (!selectedPlant) {
    return null;
  }

  return (
    <div className={`${styles.selectedPlantPanel} p-3 space-y-2`}>
      <div className={styles.mapControlHeader}>
        <span className={styles.mapControlTitle}>Выбранное растение</span>
      </div>

      <div className='mb-3'>
        <h3 className={`${styles.specimenTitle} text-sm`}>
          {selectedPlant.name}
        </h3>
        {selectedPlant.description && (
          <p className='text-xs text-[#4a5568] mt-1 leading-relaxed'>
            {selectedPlant.description}
          </p>
        )}
      </div>

      <div className='grid grid-cols-3 gap-2'>
        <button
          className={`${styles.controlButton} ${styles.controlButtonActive} px-2 py-1.5 text-xs rounded-md shadow-sm`}
          onClick={() =>
            window.open(`/specimens/${selectedPlant.id}`, '_blank')
          }
        >
          Подробно
        </button>
        <button
          className={`${styles.controlButton} px-2 py-1.5 text-xs rounded-md border transition-colors`}
          onClick={() => setSelectedPlantId(null)}
        >
          Закрыть
        </button>
        <button
          className='px-2 py-1.5 text-xs rounded-md text-[#FF3B30] border border-[#FFE5E5] bg-[#FFF5F5] hover:bg-[#FFE0E0] active:bg-[#FFCBCB] transition-all duration-200 shadow-sm'
          onClick={handleDeleteClick}
        >
          Удалить
        </button>
      </div>

      {showConfirmDelete && (
        <div className='mt-3 p-3 bg-[#FFF5F5] border border-[#FF3B30] rounded-md shadow-sm'>
          <p className='text-xs text-[#FF3B30] mb-2 font-medium'>
            Удалить растение?
          </p>
          <div className='grid grid-cols-2 gap-2'>
            <button
              className='px-2 py-1.5 text-xs rounded-md bg-[#F5F5F7] border border-[#E5E5EA] hover:bg-[#E5E5EA] transition-all duration-200'
              onClick={handleCancelDelete}
            >
              Отмена
            </button>
            <button
              className='px-2 py-1.5 text-xs rounded-md bg-[#FF3B30] text-white hover:bg-[#E73229] transition-all duration-200 shadow-sm'
              onClick={handleConfirmDelete}
            >
              Удалить
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapActions;
