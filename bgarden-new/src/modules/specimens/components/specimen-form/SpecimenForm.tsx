import React, { useState, useEffect, ChangeEvent } from 'react';
import { Specimen, SpecimenFormData } from '../../types';
import { Button, TextField, Select, SelectOption, CheckboxField, Textarea } from '@/modules/ui';

interface SpecimenFormProps {
  specimen?: Specimen;
  onSubmit: (data: SpecimenFormData) => void;
  onCancel: () => void;
}

/**
 * Форма для добавления/редактирования образца растения
 * 
 * @param specimen - Существующий образец для редактирования (опционально)
 * @param onSubmit - Функция для отправки формы
 * @param onCancel - Функция отмены
 */
const SpecimenForm: React.FC<SpecimenFormProps> = ({ specimen, onSubmit, onCancel }) => {
  // Инициализация формы значениями по умолчанию или данными образца
  const [formData, setFormData] = useState<SpecimenFormData>({
    inventoryNumber: '',
    sectorType: 0,
    latitude: 0,
    longitude: 0,
    regionId: 0,
    regionName: '',
    familyId: 0,
    familyName: '',
    russianName: '',
    latinName: '',
    genus: '',
    species: '',
    cultivar: '',
    form: '',
    synonyms: '',
    determinedBy: '',
    plantingYear: new Date().getFullYear(),
    sampleOrigin: '',
    naturalRange: '',
    ecologyAndBiology: '',
    economicUse: '',
    conservationStatus: '',
    expositionId: 0,
    expositionName: '',
    hasHerbarium: false,
    duplicatesInfo: '',
    originalBreeder: '',
    originalYear: 0,
    country: '',
    illustration: '',
    notes: '',
    filledBy: ''
  });

  // Обновление формы при получении данных образца
  useEffect(() => {
    if (specimen) {
      setFormData(specimen);
    }
  }, [specimen]);

  // Обработчик изменения полей формы
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Для чекбоксов обрабатываем отдельно
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setFormData(prev => ({
        ...prev,
        [name]: checkbox.checked
      }));
      return;
    }
    
    // Для числовых полей преобразуем значение
    if (type === 'number') {
      setFormData(prev => ({
        ...prev,
        [name]: value === '' ? 0 : Number(value)
      }));
      return;
    }
    
    // Для остальных полей просто устанавливаем значение
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Отправка формы
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Основная информация */}
      <h3 className="text-lg font-semibold mb-2">Основная информация</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <TextField
          id="inventoryNumber"
          name="inventoryNumber"
          label="Инвентарный номер"
          value={formData.inventoryNumber}
          onChange={handleChange}
          fullWidth
        />
        
        <Select
          id="sectorType"
          name="sectorType"
          label="Тип сектора"
          value={formData.sectorType}
          onChange={handleChange}
          options={[
            { value: 0, label: 'Дендрологический' },
            { value: 1, label: 'Флора' },
            { value: 2, label: 'Цветущий' }
          ]}
          fullWidth
        />
        
        <TextField
          id="russianName"
          name="russianName"
          label="Название на русском"
          value={formData.russianName ?? ''}
          onChange={handleChange}
          fullWidth
        />
        
        <TextField
          id="latinName"
          name="latinName"
          label="Латинское название"
          value={formData.latinName ?? ''}
          onChange={handleChange}
          fullWidth
        />
        
        <TextField
          id="genus"
          name="genus"
          label="Род"
          value={formData.genus ?? ''}
          onChange={handleChange}
          fullWidth
        />
      </div>
      
      {/* Таксономическая информация */}
      <fieldset className="p-4 border rounded-md">
        <legend className="text-lg font-medium px-2">Таксономическая информация</legend>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="familyId">
              Семейство *
            </label>
            <select
              id="familyId"
              name="familyId"
              value={formData.familyId}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
              required
            >
              <option value={0}>Выберите семейство</option>
              {/* Тут будет подгрузка семейств из API */}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="species">
              Вид
            </label>
            <input
              type="text"
              id="species"
              name="species"
              value={formData.species}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="synonyms">
              Синонимы
            </label>
            <input
              type="text"
              id="synonyms"
              name="synonyms"
              value={formData.synonyms ?? ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
        </div>
      </fieldset>
      
      {/* Географическая информация */}
      <fieldset className="p-4 border rounded-md">
        <legend className="text-lg font-medium px-2">Географическая информация</legend>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="regionId">
              Регион *
            </label>
            <select
              id="regionId"
              name="regionId"
              value={formData.regionId ?? 0}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
              required
            >
              <option value={0}>Выберите регион</option>
              {/* Тут будет подгрузка регионов из API */}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="expositionId">
              Экспозиция *
            </label>
            <select
              id="expositionId"
              name="expositionId"
              value={formData.expositionId}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
              required
            >
              <option value={0}>Выберите экспозицию</option>
              {/* Тут будет подгрузка экспозиций из API */}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="latitude">
              Широта
            </label>
            <input
              type="number"
              id="latitude"
              name="latitude"
              value={formData.latitude}
              onChange={handleChange}
              step="0.000001"
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="longitude">
              Долгота
            </label>
            <input
              type="number"
              id="longitude"
              name="longitude"
              value={formData.longitude}
              onChange={handleChange}
              step="0.000001"
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
        </div>
      </fieldset>
      
      {/* Дополнительная информация */}
      <fieldset className="p-4 border rounded-md">
        <legend className="text-lg font-medium px-2">Дополнительная информация</legend>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="plantingYear">
              Год посадки
            </label>
            <input
              type="number"
              id="plantingYear"
              name="plantingYear"
              value={formData.plantingYear}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          
          <div>
            <TextField
              id="sampleOrigin"
              name="sampleOrigin"
              label="Происхождение образца"
              value={formData.sampleOrigin ?? ''}
              onChange={handleChange}
              fullWidth
            />
          </div>
          
          <div>
            <TextField
              id="naturalRange"
              name="naturalRange"
              label="Естественный ареал"
              value={formData.naturalRange ?? ''}
              onChange={handleChange}
              fullWidth
            />
          </div>
          
          <div>
            <CheckboxField
              id="hasHerbarium"
              name="hasHerbarium"
              label="Есть гербарий"
              checked={formData.hasHerbarium}
              onChange={handleChange}
            />
          </div>
          
          <div className="md:col-span-2">
            <Textarea
              id="notes"
              name="notes"
              label="Примечания"
              value={formData.notes ?? ''}
              onChange={handleChange}
              rows={3}
              fullWidth
            />
          </div>
        </div>
      </fieldset>
      
      {/* Кнопки формы */}
      <div className="flex justify-end space-x-3 pt-4">
        <Button 
          variant="neutral"
          onClick={onCancel}
        >
          Отмена
        </Button>
        <Button 
          variant="success" 
          type="submit"
        >
          Сохранить
        </Button>
      </div>
    </form>
  );
};

export default SpecimenForm; 