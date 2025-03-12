// Панель действий на карте (добавить, редактировать, удалить)

import React, { useState } from 'react';
import {
  buttonClasses,
  COLORS,
  containerClasses,
  layoutClasses,
  textClasses,
} from '../../../styles/global-styles';
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
    <div className={`p-3 bg-[#F2F7FF] border border-[${COLORS.PRIMARY}] rounded-lg`}>
      <div className="mb-3 border-b border-[#E5E5EA] pb-2">
        <span className={`${textClasses.body} block mb-2 font-medium`}>
          Выбранное растение
        </span>
        <h3 className={textClasses.subheading}>{selectedPlant.name}</h3>
        {selectedPlant.description && (
          <p className={`${textClasses.body} ${textClasses.secondary}`}>
            {selectedPlant.description}
          </p>
        )}
      </div>

      <div className="mb-2">
        <span className={`${textClasses.body} text-xs font-medium text-[${COLORS.TEXT_SECONDARY}]`}>
          Действия с растением
        </span>
      </div>
      <div className={`${layoutClasses.flex} flex-wrap gap-2`}>
        <button
          className={`${buttonClasses.base} ${buttonClasses.primary}`}
          onClick={() => window.open(`/specimens/${selectedPlant.id}`, '_blank')}
        >
          Подробности
        </button>
        <button
          className={`${buttonClasses.base} ${buttonClasses.secondary}`}
          onClick={() => setSelectedPlantId(null)}
        >
          Закрыть
        </button>
        <button
          className={`${buttonClasses.base} ${buttonClasses.danger}`}
          onClick={handleDeleteClick}
        >
          Удалить
        </button>
      </div>

      {showConfirmDelete && (
        <div
          className={`mt-4 p-3 bg-[${COLORS.DANGER_LIGHT}] border border-[${COLORS.DANGER}] rounded-lg`}
        >
          <p
            className={`${textClasses.body} text-[${COLORS.DANGER_DARK}] mb-2`}
          >
            Вы уверены, что хотите удалить это растение?
          </p>
          <div className={layoutClasses.flex + ' gap-2'}>
            <button
              className={`${buttonClasses.base} ${buttonClasses.secondary}`}
              onClick={handleCancelDelete}
            >
              Отмена
            </button>
            <button
              className={`${buttonClasses.base} ${buttonClasses.danger}`}
              onClick={handleConfirmDelete}
            >
              Да, удалить
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapActions;
