// Панель действий на карте (добавить, редактировать, удалить)

import React, { useState } from 'react';
import { useMapContext } from '../contexts';

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
    <div className='border-t border-[#E5E5EA] p-2 space-y-2'>
      <span className='text-xs font-medium text-[#86868B] block mb-1'>
        Выбранное растение
      </span>
      <div className='mb-2'>
        <h3 className='text-sm font-medium'>{selectedPlant.name}</h3>
        {selectedPlant.description && (
          <p className='text-xs text-[#86868B] truncate'>
            {selectedPlant.description}
          </p>
        )}
      </div>

      <div className='grid grid-cols-3 gap-1'>
        <button
          className='px-2 py-1.5 text-xs rounded-md bg-[#0A84FF] text-white transition-colors'
          onClick={() =>
            window.open(`/specimens/${selectedPlant.id}`, '_blank')
          }
        >
          Подробно
        </button>
        <button
          className='px-2 py-1.5 text-xs rounded-md border border-[#E5E5EA] bg-[#F5F5F7] transition-colors'
          onClick={() => setSelectedPlantId(null)}
        >
          Закрыть
        </button>
        <button
          className='px-2 py-1.5 text-xs rounded-md text-[#FF3B30] border border-[#FFE5E5] bg-[#FFF5F5] transition-colors'
          onClick={handleDeleteClick}
        >
          Удалить
        </button>
      </div>

      {showConfirmDelete && (
        <div className='mt-2 p-2 bg-[#FFF5F5] border border-[#FF3B30] rounded-md'>
          <p className='text-xs text-[#FF3B30] mb-1'>Удалить растение?</p>
          <div className='grid grid-cols-2 gap-1'>
            <button
              className='px-2 py-1 text-xs rounded-md bg-[#F5F5F7] border border-[#E5E5EA] transition-colors'
              onClick={handleCancelDelete}
            >
              Отмена
            </button>
            <button
              className='px-2 py-1 text-xs rounded-md bg-[#FF3B30] text-white transition-colors'
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
