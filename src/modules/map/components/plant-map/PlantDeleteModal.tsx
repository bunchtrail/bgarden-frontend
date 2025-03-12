// Модальное окно для удаления растения
import React from 'react';
import { useMapContext } from '../../contexts';

interface PlantDeleteModalProps {
  plantId: string;
  onClose: () => void;
}

const PlantDeleteModal: React.FC<PlantDeleteModalProps> = ({ plantId, onClose }) => {
  const { plants, deletePlant } = useMapContext();
  const plant = plants.find(p => p.id === plantId);

  if (!plant) {
    return null;
  }

  const handleDelete = () => {
    deletePlant(plantId);
    onClose();
  };

  return (
    <div className="bg-white p-4 rounded shadow-lg">
      <h3 className="text-lg font-semibold mb-4">Удалить растение</h3>
      <p className="mb-4">
        Вы уверены, что хотите удалить растение "{plant.name}"?
      </p>
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
        >
          Отмена
        </button>
        <button
          type="button"
          onClick={handleDelete}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Удалить
        </button>
      </div>
    </div>
  );
};

export default PlantDeleteModal;
