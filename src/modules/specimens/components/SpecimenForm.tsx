import React, { useEffect, useState } from 'react';
import { Specimen, SpecimenFormData } from '../types';
import { CancelIcon, SaveIcon, InfoIcon, MapIcon, LeafIcon, NoteIcon } from './icons';
import {
  actionsContainerClasses,
  buttonClasses,
  formClasses,
  headingClasses,
} from './styles';

interface SpecimenFormProps {
  initialData?: Specimen;
  onSave: (data: SpecimenFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  // Справочные данные для выпадающих списков могут быть переданы как props
  familyOptions?: { id: number; name: string }[];
  expositionOptions?: { id: number; name: string }[];
  regionOptions?: { id: number; name: string }[];
}

export const SpecimenForm: React.FC<SpecimenFormProps> = ({
  initialData,
  onSave,
  onCancel,
  isLoading = false,
  familyOptions = [],
  expositionOptions = [],
  regionOptions = [],
}) => {
  const emptyFormData: SpecimenFormData = {
    inventoryNumber: '',
    sectorType: 0,
    latitude: 0,
    longitude: 0,
    regionId: 1,
    regionName: '',
    familyId: 1,
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
    expositionId: 1,
    expositionName: '',
    hasHerbarium: false,
    duplicatesInfo: '',
    originalBreeder: '',
    originalYear: 0,
    country: '',
    illustration: '',
    notes: '',
    filledBy: '',
  };

  const [formData, setFormData] = useState<SpecimenFormData>(
    initialData || emptyFormData
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Сбрасываем ошибку для этого поля при изменении
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    let updatedData = { ...formData };

    if (name === 'familyId') {
      const selectedFamily = familyOptions.find((f) => f.id === Number(value));
      updatedData = {
        ...updatedData,
        [name]: Number(value),
        familyName: selectedFamily ? selectedFamily.name : '',
      };
    } else if (name === 'expositionId') {
      const selectedExposition = expositionOptions.find(
        (e) => e.id === Number(value)
      );
      updatedData = {
        ...updatedData,
        [name]: Number(value),
        expositionName: selectedExposition ? selectedExposition.name : '',
      };
    } else if (name === 'regionId') {
      const selectedRegion = regionOptions.find((r) => r.id === Number(value));
      updatedData = {
        ...updatedData,
        [name]: Number(value),
        regionName: selectedRegion ? selectedRegion.name : '',
      };
    } else {
      updatedData = {
        ...updatedData,
        [name]: Number(value),
      };
    }

    setFormData(updatedData);
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = value === '' ? 0 : Number(value);
    setFormData((prev) => ({ ...prev, [name]: numValue }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Обязательные поля
    if (!formData.inventoryNumber) {
      newErrors.inventoryNumber = 'Инвентарный номер обязателен';
    }

    // Хотя бы одно из названий должно быть заполнено
    if (!formData.russianName && !formData.latinName) {
      newErrors.russianName = 'Должно быть указано хотя бы одно название';
      newErrors.latinName = 'Должно быть указано хотя бы одно название';
    }

    // Проверка на существование значений ID для связанных сущностей
    if (!formData.familyId || formData.familyId <= 0) {
      newErrors.familyId = 'Необходимо выбрать семейство';
    }

    if (!formData.expositionId || formData.expositionId <= 0) {
      newErrors.expositionId = 'Необходимо выбрать местоположение';
    }

    if (!formData.regionId || formData.regionId <= 0) {
      newErrors.regionId = 'Необходимо выбрать регион';
    }

    // Проверка координат
    if (formData.latitude < -90 || formData.latitude > 90) {
      newErrors.latitude = 'Широта должна быть в диапазоне от -90 до 90';
    }

    if (formData.longitude < -180 || formData.longitude > 180) {
      newErrors.longitude = 'Долгота должна быть в диапазоне от -180 до 180';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSave(formData);
    }
  };

  // Обновленный метод рендеринга текстового поля с улучшенным выравниванием
  const renderTextField = (
    label: string,
    name: keyof SpecimenFormData,
    required: boolean = false,
    multiline: boolean = false,
    rows: number = 1
  ) => {
    return (
      <div className="mb-4">
        <div className="flex flex-col sm:flex-row sm:items-start">
          <label 
            htmlFor={name.toString()} 
            className="block text-sm font-medium text-gray-700 sm:w-1/3 sm:py-2"
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <div className="mt-1 sm:mt-0 sm:w-2/3">
            {multiline ? (
              <textarea
                id={name.toString()}
                name={name.toString()}
                rows={rows}
                value={formData[name] as string}
                onChange={handleChange}
                className={formClasses.textarea}
                required={required}
              />
            ) : (
              <input
                type="text"
                id={name.toString()}
                name={name.toString()}
                value={formData[name] as string}
                onChange={handleChange}
                className={formClasses.input}
                required={required}
              />
            )}
            {errors[name] && (
              <p className={formClasses.error}>{errors[name]}</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Обновленный метод рендеринга числового поля с улучшенным выравниванием
  const renderNumberField = (
    label: string,
    name: keyof SpecimenFormData,
    required: boolean = false
  ) => {
    return (
      <div className="mb-4">
        <div className="flex flex-col sm:flex-row sm:items-start">
          <label 
            htmlFor={name.toString()} 
            className="block text-sm font-medium text-gray-700 sm:w-1/3 sm:py-2"
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <div className="mt-1 sm:mt-0 sm:w-2/3">
            <input
              type="number"
              id={name.toString()}
              name={name.toString()}
              value={formData[name] as number}
              onChange={handleNumberChange}
              className={formClasses.input}
              required={required}
            />
            {errors[name] && (
              <p className={formClasses.error}>{errors[name]}</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Обновленный метод рендеринга выпадающего списка с улучшенным выравниванием
  const renderSelectField = (
    label: string,
    name: keyof SpecimenFormData,
    options: { id: number; name: string }[],
    required: boolean = false
  ) => {
    return (
      <div className="mb-4">
        <div className="flex flex-col sm:flex-row sm:items-start">
          <label 
            htmlFor={name.toString()} 
            className="block text-sm font-medium text-gray-700 sm:w-1/3 sm:py-2"
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <div className="mt-1 sm:mt-0 sm:w-2/3">
            <select
              id={name.toString()}
              name={name.toString()}
              value={formData[name] as number}
              onChange={handleSelectChange}
              className={formClasses.select}
              required={required}
            >
              <option value="">Выберите {label.toLowerCase()}</option>
              {options.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
            {errors[name] && (
              <p className={formClasses.error}>{errors[name]}</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Обновленный метод рендеринга чекбокса с улучшенным выравниванием
  const renderCheckboxField = (label: string, name: keyof SpecimenFormData) => {
    return (
      <div className="mb-4">
        <div className="flex items-center">
          <div className="sm:w-1/3"></div>
          <div className="sm:w-2/3 flex items-center">
            <input
              type="checkbox"
              id={name.toString()}
              name={name.toString()}
              checked={formData[name] as boolean}
              onChange={handleCheckboxChange}
              className={formClasses.checkbox + " mr-2"}
            />
            <label htmlFor={name.toString()} className="text-sm font-medium text-gray-700">
              {label}
            </label>
          </div>
        </div>
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className={formClasses.base}>
      {/* Заголовок формы и основные действия */}
      <div className={`${headingClasses.page} mb-6 text-center`}>
        {initialData ? 'Редактирование образца' : 'Добавление нового образца'}
      </div>

      {/* Основная информация - секция с визуальным выделением */}
      <div className='mb-6 bg-gray-50 p-5 rounded-lg border border-gray-200 shadow-sm'>
        <h3 className={`${headingClasses.heading} flex items-center text-xl mb-4 pb-2 border-b border-gray-300`}>
          <InfoIcon className="w-5 h-5 mr-2 text-blue-600" />
          Основная информация
        </h3>

        <div className='space-y-2'>
          {renderTextField('Инвентарный номер', 'inventoryNumber', true)}
          {renderTextField('Русское название', 'russianName', true)}
          {renderTextField('Латинское название', 'latinName', true)}
          {renderSelectField('Семейство', 'familyId', familyOptions, true)}

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            {renderTextField('Род', 'genus')}
            {renderTextField('Вид', 'species')}
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            {renderTextField('Сорт', 'cultivar')}
            {renderTextField('Форма', 'form')}
          </div>
        </div>
      </div>

      {/* Географическая информация - с единым стилем */}
      <div className='mb-6 bg-gray-50 p-5 rounded-lg border border-gray-200 shadow-sm'>
        <h3 className={`${headingClasses.heading} flex items-center text-xl mb-4 pb-2 border-b border-gray-300`}>
          <MapIcon className="w-5 h-5 mr-2 text-green-600" />
          Географическая информация
        </h3>

        <div className='space-y-2'>
          {renderSelectField('Регион', 'regionId', regionOptions, true)}
          {renderTextField('Страна происхождения', 'country')}
          {renderTextField('Естественный ареал', 'naturalRange')}

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            {renderNumberField('Широта', 'latitude')}
            {renderNumberField('Долгота', 'longitude')}
          </div>
        </div>
      </div>

      {/* Экспозиционная информация - с единым стилем */}
      <div className='mb-6 bg-gray-50 p-5 rounded-lg border border-gray-200 shadow-sm'>
        <h3 className={`${headingClasses.heading} flex items-center text-xl mb-4 pb-2 border-b border-gray-300`}>
          <LeafIcon className="w-5 h-5 mr-2 text-amber-600" />
          Экспозиционная информация
        </h3>

        <div className='space-y-2'>
          {renderSelectField(
            'Экспозиция',
            'expositionId',
            expositionOptions,
            true
          )}
          {renderNumberField('Год посадки', 'plantingYear')}
          {renderCheckboxField('Наличие гербария', 'hasHerbarium')}
          {renderTextField('Информация о дубликатах', 'duplicatesInfo')}
        </div>
      </div>

      {/* Дополнительная информация - с единым стилем */}
      <div className='mb-6 bg-gray-50 p-5 rounded-lg border border-gray-200 shadow-sm'>
        <h3 className={`${headingClasses.heading} flex items-center text-xl mb-4 pb-2 border-b border-gray-300`}>
          <NoteIcon className="w-5 h-5 mr-2 text-purple-600" />
          Дополнительная информация
        </h3>

        <div className='space-y-2'>
          {renderTextField('Синонимы', 'synonyms')}
          {renderTextField('Определил', 'determinedBy')}
          {renderTextField('Происхождение образца', 'sampleOrigin')}
          {renderTextField(
            'Экология и биология',
            'ecologyAndBiology',
            false,
            true,
            3
          )}
          {renderTextField(
            'Хозяйственное значение',
            'economicUse',
            false,
            true,
            3
          )}
          {renderTextField('Статус охраны', 'conservationStatus')}
          {renderTextField('Оригинальный селекционер', 'originalBreeder')}
          {renderNumberField('Год селекции', 'originalYear')}
          {renderTextField('Примечания', 'notes', false, true, 3)}
          {renderTextField('Заполнил', 'filledBy')}
        </div>
      </div>

      {/* Кнопки действий */}
      <div className={`${actionsContainerClasses.base} justify-center`}>
        <div className='flex space-x-4'>
          <button
            type='button'
            onClick={onCancel}
            className={`${buttonClasses.base} ${buttonClasses.secondary} flex items-center px-6 py-2`}
            disabled={isLoading}
          >
            <CancelIcon className='w-5 h-5 mr-2' />
            Отмена
          </button>
          <button
            type='submit'
            className={`${buttonClasses.base} ${buttonClasses.primary} flex items-center px-6 py-2`}
            disabled={isLoading}
          >
            <SaveIcon className='w-5 h-5 mr-2' />
            {isLoading ? 'Сохранение...' : 'Сохранить'}
          </button>
        </div>
      </div>
    </form>
  );
};
