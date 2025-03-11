import React, { useEffect, useState } from 'react';
import {
  FamilyDto,
  familyService,
} from '../../../specimens/services/familyService';
import {
  RegionDto,
  regionService,
} from '../../../specimens/services/regionService';
import { specimenService } from '../../../specimens/services/specimenService';
import { Specimen } from '../../../specimens/types';
import { useMapContext } from '../../contexts/MapContext';
import { MapMode } from '../../types';

interface PlantEditFormProps {
  specimen: Specimen;
}

interface ValidationErrors {
  inventoryNumber?: string;
  russianName?: string;
  latinName?: string;
  familyId?: string;
  regionId?: string;
  submitError?: string;
}

const PlantEditForm: React.FC<PlantEditFormProps> = ({ specimen }) => {
  const { state: _state, setMode } = useMapContext();
  const [formData, setFormData] = useState<Specimen>(specimen);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [success, setSuccess] = useState<string | null>(null);

  // Состояния для списков семейств и регионов
  const [families, setFamilies] = useState<FamilyDto[]>([]);
  const [regions, setRegions] = useState<RegionDto[]>([]);
  const [isLoadingFamilies, setIsLoadingFamilies] = useState(false);
  const [isLoadingRegions, setIsLoadingRegions] = useState(false);
  const [familiesError, setFamiliesError] = useState<string | null>(null);
  const [regionsError, setRegionsError] = useState<string | null>(null);

  // Загрузка списков семейств и регионов при монтировании компонента
  useEffect(() => {
    const loadFamilies = async () => {
      setIsLoadingFamilies(true);
      setFamiliesError(null);
      try {
        const data = await familyService.getAllFamilies();
        setFamilies(data);
      } catch (error: any) {
        console.error('Ошибка при загрузке семейств:', error);
        setFamiliesError(
          error.message || 'Не удалось загрузить список семейств'
        );
      } finally {
        setIsLoadingFamilies(false);
      }
    };

    const loadRegions = async () => {
      setIsLoadingRegions(true);
      setRegionsError(null);
      try {
        const data = await regionService.getAllRegions();
        setRegions(data);
      } catch (error: any) {
        console.error('Ошибка при загрузке регионов:', error);
        setRegionsError(
          error.message || 'Не удалось загрузить список регионов'
        );
      } finally {
        setIsLoadingRegions(false);
      }
    };

    loadFamilies();
    loadRegions();
  }, []);

  // Обновляем данные формы при изменении выбранного образца
  useEffect(() => {
    setFormData(specimen);
    // Сбрасываем ошибки и сообщение об успехе при смене образца
    setErrors({});
    setSuccess(null);
  }, [specimen]);

  // Обработчик изменения полей формы
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    // Сбрасываем ошибку для текущего поля
    setErrors((prev) => ({
      ...prev,
      [name]: undefined,
    }));

    // Сбрасываем сообщение об успехе при изменении любого поля
    setSuccess(null);

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'familyId' || name === 'regionId' || name === 'sectorType'
          ? parseInt(value, 10)
          : value,
    }));
  };

  // Валидация формы
  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!formData.inventoryNumber?.trim()) {
      newErrors.inventoryNumber = 'Инвентарный номер обязателен';
    }

    if (!formData.russianName?.trim()) {
      newErrors.russianName = 'Русское название обязательно';
    }

    if (!formData.latinName?.trim()) {
      newErrors.latinName = 'Латинское название обязательно';
    }

    if (!formData.familyId || formData.familyId === 0) {
      newErrors.familyId = 'Выберите семейство';
    }

    if (!formData.regionId || formData.regionId === 0) {
      newErrors.regionId = 'Выберите регион';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Обработчик отправки формы
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Проводим валидацию перед отправкой
    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);

      // Используем сервис образцов вместо сервиса карты
      await specimenService.updateSpecimen(formData.id, formData);

      // Показываем сообщение об успехе
      setSuccess('Растение успешно обновлено!');

      // Задержка перед возвратом в режим просмотра
      setTimeout(() => {
        setMode(MapMode.VIEW);
      }, 1500);
    } catch (error) {
      console.error('Ошибка при обновлении растения:', error);
      setErrors({
        ...errors,
        submitError:
          'Не удалось обновить растение. Проверьте введенные данные.',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className='plant-form bg-white p-4 rounded-lg shadow-md'>
      <h3 className='text-lg font-bold mb-4'>Редактировать растение</h3>

      {success && (
        <div className='mb-4 p-3 bg-green-100 text-green-800 rounded border border-green-200 flex items-center'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-5 w-5 mr-2'
            viewBox='0 0 20 20'
            fill='currentColor'
          >
            <path
              fillRule='evenodd'
              d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
              clipRule='evenodd'
            />
          </svg>
          {success}
        </div>
      )}

      <div className='mb-4 p-3 bg-blue-50 rounded border border-blue-100 flex items-center'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='h-5 w-5 mr-2 text-blue-600'
          viewBox='0 0 20 20'
          fill='currentColor'
        >
          <path
            fillRule='evenodd'
            d='M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z'
            clipRule='evenodd'
          />
        </svg>
        <span>
          <strong>ID:</strong> {formData.id}
          <br />
          <strong>Координаты:</strong> {formData.latitude.toFixed(6)},{' '}
          {formData.longitude.toFixed(6)}
        </span>
      </div>

      <form onSubmit={handleSubmit} className='space-y-4'>
        <div className='form-group'>
          <label htmlFor='inventoryNumber' className='block mb-1'>
            Инвентарный номер <span className='text-red-500'>*</span>
          </label>
          <input
            type='text'
            id='inventoryNumber'
            name='inventoryNumber'
            value={formData.inventoryNumber || ''}
            onChange={handleChange}
            className={`w-full p-2 border rounded ${
              errors.inventoryNumber ? 'border-red-500' : 'border-gray-300'
            }`}
            required
          />
          {errors.inventoryNumber && (
            <p className='mt-1 text-sm text-red-600'>
              {errors.inventoryNumber}
            </p>
          )}
        </div>

        <div className='form-group'>
          <label htmlFor='russianName' className='block mb-1'>
            Русское название <span className='text-red-500'>*</span>
          </label>
          <input
            type='text'
            id='russianName'
            name='russianName'
            value={formData.russianName || ''}
            onChange={handleChange}
            className={`w-full p-2 border rounded ${
              errors.russianName ? 'border-red-500' : 'border-gray-300'
            }`}
            required
          />
          {errors.russianName && (
            <p className='mt-1 text-sm text-red-600'>{errors.russianName}</p>
          )}
        </div>

        <div className='form-group'>
          <label htmlFor='latinName' className='block mb-1'>
            Латинское название <span className='text-red-500'>*</span>
          </label>
          <input
            type='text'
            id='latinName'
            name='latinName'
            value={formData.latinName || ''}
            onChange={handleChange}
            className={`w-full p-2 border rounded ${
              errors.latinName ? 'border-red-500' : 'border-gray-300'
            }`}
            required
          />
          {errors.latinName && (
            <p className='mt-1 text-sm text-red-600'>{errors.latinName}</p>
          )}
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <div className='form-group'>
            <label htmlFor='genus' className='block mb-1'>
              Род
            </label>
            <input
              type='text'
              id='genus'
              name='genus'
              value={formData.genus || ''}
              onChange={handleChange}
              className='w-full p-2 border rounded border-gray-300'
            />
          </div>

          <div className='form-group'>
            <label htmlFor='species' className='block mb-1'>
              Вид
            </label>
            <input
              type='text'
              id='species'
              name='species'
              value={formData.species || ''}
              onChange={handleChange}
              className='w-full p-2 border rounded border-gray-300'
            />
          </div>
        </div>

        <div className='form-group'>
          <label htmlFor='familyId' className='block mb-1'>
            Семейство <span className='text-red-500'>*</span>
          </label>
          <select
            id='familyId'
            name='familyId'
            value={formData.familyId}
            onChange={handleChange}
            className={`w-full p-2 border rounded ${
              errors.familyId ? 'border-red-500' : 'border-gray-300'
            }`}
            required
            disabled={isLoadingFamilies || saving}
          >
            <option value='0'>Выберите семейство...</option>
            {families.map((family) => (
              <option key={family.id} value={family.id}>
                {family.name} {family.latinName ? `(${family.latinName})` : ''}
              </option>
            ))}
          </select>
          {isLoadingFamilies && (
            <p className='mt-1 text-sm text-blue-600'>Загрузка семейств...</p>
          )}
          {familiesError && (
            <p className='mt-1 text-sm text-red-600'>{familiesError}</p>
          )}
          {errors.familyId && (
            <p className='mt-1 text-sm text-red-600'>{errors.familyId}</p>
          )}
        </div>

        <div className='form-group'>
          <label htmlFor='regionId' className='block mb-1'>
            Регион <span className='text-red-500'>*</span>
          </label>
          <select
            id='regionId'
            name='regionId'
            value={formData.regionId}
            onChange={handleChange}
            className={`w-full p-2 border rounded ${
              errors.regionId ? 'border-red-500' : 'border-gray-300'
            }`}
            required
            disabled={isLoadingRegions || saving}
          >
            <option value='0'>Выберите регион...</option>
            {regions.map((region) => (
              <option key={region.id} value={region.id}>
                {region.name}
              </option>
            ))}
          </select>
          {isLoadingRegions && (
            <p className='mt-1 text-sm text-blue-600'>Загрузка регионов...</p>
          )}
          {regionsError && (
            <p className='mt-1 text-sm text-red-600'>{regionsError}</p>
          )}
          {errors.regionId && (
            <p className='mt-1 text-sm text-red-600'>{errors.regionId}</p>
          )}
        </div>

        {errors.submitError && (
          <div className='p-3 bg-red-50 rounded border border-red-100 text-red-700'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-5 w-5 mr-2 inline'
              viewBox='0 0 20 20'
              fill='currentColor'
            >
              <path
                fillRule='evenodd'
                d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                clipRule='evenodd'
              />
            </svg>
            {errors.submitError}
          </div>
        )}

        <div className='form-actions flex space-x-2 pt-2'>
          <button
            type='submit'
            className='px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:bg-gray-400 flex items-center'
            disabled={saving}
          >
            {saving ? (
              <>
                <svg
                  className='animate-spin -ml-1 mr-2 h-4 w-4 text-white'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                >
                  <circle
                    className='opacity-25'
                    cx='12'
                    cy='12'
                    r='10'
                    stroke='currentColor'
                    strokeWidth='4'
                  ></circle>
                  <path
                    className='opacity-75'
                    fill='currentColor'
                    d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                  ></path>
                </svg>
                Сохранение...
              </>
            ) : (
              'Сохранить изменения'
            )}
          </button>
          <button
            type='button'
            className='px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors'
            onClick={() => setMode(MapMode.VIEW)}
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
};

export default PlantEditForm;
