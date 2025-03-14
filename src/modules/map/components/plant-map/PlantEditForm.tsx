// Форма редактирования растения
import React, { useState } from 'react';
import { useMapContext } from '../../contexts';
import type { Plant } from '../../contexts';
import { useNotifications } from '../../../../modules/notifications';

interface PlantEditFormProps {
  plantId: string;
  onClose: () => void;
}

const PlantEditForm: React.FC<PlantEditFormProps> = ({ plantId, onClose }) => {
  const { plants, updatePlant } = useMapContext();
  const plant = plants.find(p => p.id === plantId);
  const { showWarning, showSuccess } = useNotifications();

  const [name, setName] = useState(plant?.name || '');
  const [description, setDescription] = useState(plant?.description || '');
  const [position, setPosition] = useState<[number, number]>(plant?.position || [0, 0]);

  if (!plant) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      showWarning('Введите название растения');
      return;
    }
    
    updatePlant(plantId, {
      name,
      description,
      position,
    });
    
    showSuccess('Растение успешно обновлено');
    onClose();
  };

  return (
    <div className="bg-white p-4 rounded shadow-lg">
      <h3 className="text-lg font-semibold mb-4">Редактировать растение</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Название</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Описание</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            rows={3}
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Координаты X, Y</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={position[0]}
              onChange={(e) => setPosition([Number(e.target.value), position[1]])}
              className="w-1/2 px-3 py-2 border rounded"
            />
            <input
              type="number"
              value={position[1]}
              onChange={(e) => setPosition([position[0], Number(e.target.value)])}
              className="w-1/2 px-3 py-2 border rounded"
            />
          </div>
        </div>
        
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
          >
            Отмена
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Сохранить
          </button>
        </div>
      </form>
    </div>
  );
};

export default PlantEditForm;
