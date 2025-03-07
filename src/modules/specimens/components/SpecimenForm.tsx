import React, { useEffect, useState } from 'react';
import { layoutClasses } from '../../../styles/global-styles';
import { Specimen, SpecimenFormData } from '../types';
import {
  CancelIcon,
  InfoIcon,
  LeafIcon,
  MapIcon,
  NoteIcon,
  SaveIcon,
} from './icons';
import {
  actionsContainerClasses,
  buttonClasses,
  chipClasses,
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
  const [activeTab, setActiveTab] = useState<number>(0);
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>(
    {}
  );
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const markFieldAsTouched = (name: string) => {
    setTouchedFields((prev) => ({ ...prev, [name]: true }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    markFieldAsTouched(name);

    // Сбрасываем ошибку для этого поля при изменении
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    // Валидация на лету
    if (formSubmitted) {
      validateField(name, value);
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    let updatedData = { ...formData };
    markFieldAsTouched(name);

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

    // Валидация на лету
    if (formSubmitted) {
      validateField(name, value);
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
    markFieldAsTouched(name);
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = value === '' ? 0 : Number(value);
    setFormData((prev) => ({ ...prev, [name]: numValue }));
    markFieldAsTouched(name);

    // Валидация на лету
    if (formSubmitted) {
      validateField(name, numValue);
    }
  };

  const validateField = (name: string, value: any): boolean => {
    let isValid = true;
    let errorMessage = '';

    switch (name) {
      case 'inventoryNumber':
        if (!value) {
          isValid = false;
          errorMessage = 'Инвентарный номер обязателен';
        }
        break;
      case 'russianName':
      case 'latinName':
        // Если проверяем русское название и латинское пустое
        if (name === 'russianName' && !value && !formData.latinName) {
          isValid = false;
          errorMessage = 'Должно быть указано хотя бы одно название';
        }
        // Если проверяем латинское название и русское пустое
        else if (name === 'latinName' && !value && !formData.russianName) {
          isValid = false;
          errorMessage = 'Должно быть указано хотя бы одно название';
        }
        break;
      case 'familyId':
        if (!value || value <= 0) {
          isValid = false;
          errorMessage = 'Необходимо выбрать семейство';
        }
        break;
      case 'expositionId':
        if (!value || value <= 0) {
          isValid = false;
          errorMessage = 'Необходимо выбрать местоположение';
        }
        break;
      case 'regionId':
        if (!value || value <= 0) {
          isValid = false;
          errorMessage = 'Необходимо выбрать регион';
        }
        break;
      case 'latitude':
        if (value < -90 || value > 90) {
          isValid = false;
          errorMessage = 'Широта должна быть в диапазоне от -90 до 90';
        }
        break;
      case 'longitude':
        if (value < -180 || value > 180) {
          isValid = false;
          errorMessage = 'Долгота должна быть в диапазоне от -180 до 180';
        }
        break;
      case 'plantingYear':
        const currentYear = new Date().getFullYear();
        if (value > currentYear) {
          isValid = false;
          errorMessage = `Год посадки не может быть больше ${currentYear}`;
        } else if (value < 1700) {
          isValid = false;
          errorMessage = 'Год посадки не может быть меньше 1700';
        }
        break;
    }

    if (!isValid) {
      setErrors((prev) => ({ ...prev, [name]: errorMessage }));
    } else {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    return isValid;
  };

  const validate = (): boolean => {
    let isValid = true;
    const newErrors: Record<string, string> = {};

    // Пройдемся по всем полям формы и вызовем validateField
    // Инвентарный номер (обязательное поле)
    if (!validateField('inventoryNumber', formData.inventoryNumber)) {
      isValid = false;
      newErrors.inventoryNumber = 'Инвентарный номер обязателен';
    }

    // Названия (одно из двух должно быть заполнено)
    if (!formData.russianName && !formData.latinName) {
      isValid = false;
      newErrors.russianName = 'Должно быть указано хотя бы одно название';
      newErrors.latinName = 'Должно быть указано хотя бы одно название';
    }

    // Связанные сущности
    if (!formData.familyId || formData.familyId <= 0) {
      isValid = false;
      newErrors.familyId = 'Необходимо выбрать семейство';
    }

    if (!formData.expositionId || formData.expositionId <= 0) {
      isValid = false;
      newErrors.expositionId = 'Необходимо выбрать местоположение';
    }

    if (!formData.regionId || formData.regionId <= 0) {
      isValid = false;
      newErrors.regionId = 'Необходимо выбрать регион';
    }

    // Координаты
    if (formData.latitude < -90 || formData.latitude > 90) {
      isValid = false;
      newErrors.latitude = 'Широта должна быть в диапазоне от -90 до 90';
    }

    if (formData.longitude < -180 || formData.longitude > 180) {
      isValid = false;
      newErrors.longitude = 'Долгота должна быть в диапазоне от -180 до 180';
    }

    // Год посадки
    const currentYear = new Date().getFullYear();
    if (formData.plantingYear > currentYear) {
      isValid = false;
      newErrors.plantingYear = `Год посадки не может быть больше ${currentYear}`;
    } else if (formData.plantingYear < 1700) {
      isValid = false;
      newErrors.plantingYear = 'Год посадки не может быть меньше 1700';
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);

    if (validate()) {
      onSave(formData);
    } else {
      // Если есть ошибки, переключаемся на вкладку с первой ошибкой
      const firstErrorField = Object.keys(errors)[0];
      if (firstErrorField) {
        // Определяем, к какой вкладке относится поле с ошибкой
        if (
          [
            'inventoryNumber',
            'russianName',
            'latinName',
            'familyId',
            'genus',
            'species',
            'cultivar',
            'form',
          ].includes(firstErrorField)
        ) {
          setActiveTab(0); // Основная информация
        } else if (
          [
            'regionId',
            'country',
            'naturalRange',
            'latitude',
            'longitude',
          ].includes(firstErrorField)
        ) {
          setActiveTab(1); // Географическая информация
        } else if (
          [
            'expositionId',
            'plantingYear',
            'hasHerbarium',
            'duplicatesInfo',
          ].includes(firstErrorField)
        ) {
          setActiveTab(2); // Экспозиционная информация
        } else {
          setActiveTab(3); // Дополнительная информация
        }
      }
    }
  };

  // Обновленный метод рендеринга текстового поля с улучшенным выравниванием и индикацией обязательности
  const renderTextField = (
    label: string,
    name: keyof SpecimenFormData,
    required: boolean = false,
    multiline: boolean = false,
    rows: number = 1
  ) => {
    const hasError = !!errors[name];
    const isTouched = touchedFields[name];
    const showError = hasError && (isTouched || formSubmitted);

    return (
      <div className='mb-4'>
        <div className='flex flex-col sm:flex-row sm:items-start'>
          <label
            htmlFor={name.toString()}
            className={`block text-sm font-medium ${
              hasError ? 'text-red-700' : 'text-gray-700'
            } sm:w-1/3 sm:py-2`}
          >
            {label}
            {required && <span className='text-red-500 ml-1'>*</span>}
          </label>
          <div className='mt-1 sm:mt-0 sm:w-2/3'>
            {multiline ? (
              <textarea
                id={name.toString()}
                name={name.toString()}
                rows={rows}
                value={formData[name] as string}
                onChange={handleChange}
                className={`${formClasses.textarea} ${
                  showError ? 'border-red-500 ring-red-500' : ''
                }`}
                required={required}
                aria-invalid={showError}
                aria-describedby={showError ? `${name}-error` : undefined}
              />
            ) : (
              <input
                type='text'
                id={name.toString()}
                name={name.toString()}
                value={formData[name] as string}
                onChange={handleChange}
                className={`${formClasses.input} ${
                  showError ? 'border-red-500 ring-red-500' : ''
                }`}
                required={required}
                aria-invalid={showError}
                aria-describedby={showError ? `${name}-error` : undefined}
              />
            )}
            {showError && (
              <p id={`${name}-error`} className={formClasses.error}>
                {errors[name]}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Обновленный метод рендеринга числового поля с улучшенным выравниванием и валидацией
  const renderNumberField = (
    label: string,
    name: keyof SpecimenFormData,
    required: boolean = false,
    min?: number,
    max?: number
  ) => {
    const hasError = !!errors[name];
    const isTouched = touchedFields[name];
    const showError = hasError && (isTouched || formSubmitted);

    return (
      <div className='mb-4'>
        <div className='flex flex-col sm:flex-row sm:items-start'>
          <label
            htmlFor={name.toString()}
            className={`block text-sm font-medium ${
              hasError ? 'text-red-700' : 'text-gray-700'
            } sm:w-1/3 sm:py-2`}
          >
            {label}
            {required && <span className='text-red-500 ml-1'>*</span>}
          </label>
          <div className='mt-1 sm:mt-0 sm:w-2/3'>
            <input
              type='number'
              id={name.toString()}
              name={name.toString()}
              value={formData[name] as number}
              onChange={handleNumberChange}
              className={`${formClasses.input} ${
                showError ? 'border-red-500 ring-red-500' : ''
              }`}
              required={required}
              min={min}
              max={max}
              aria-invalid={showError}
              aria-describedby={showError ? `${name}-error` : undefined}
            />
            {showError && (
              <p id={`${name}-error`} className={formClasses.error}>
                {errors[name]}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Обновленный метод рендеринга выпадающего списка с улучшенной обработкой ошибок
  const renderSelectField = (
    label: string,
    name: keyof SpecimenFormData,
    options: { id: number; name: string }[],
    required: boolean = false
  ) => {
    const hasError = !!errors[name];
    const isTouched = touchedFields[name];
    const showError = hasError && (isTouched || formSubmitted);

    return (
      <div className='mb-4'>
        <div className='flex flex-col sm:flex-row sm:items-start'>
          <label
            htmlFor={name.toString()}
            className={`block text-sm font-medium ${
              hasError ? 'text-red-700' : 'text-gray-700'
            } sm:w-1/3 sm:py-2`}
          >
            {label}
            {required && <span className='text-red-500 ml-1'>*</span>}
          </label>
          <div className='mt-1 sm:mt-0 sm:w-2/3'>
            <select
              id={name.toString()}
              name={name.toString()}
              value={formData[name] as number}
              onChange={handleSelectChange}
              className={`${formClasses.select} ${
                showError ? 'border-red-500 ring-red-500' : ''
              }`}
              required={required}
              aria-invalid={showError}
              aria-describedby={showError ? `${name}-error` : undefined}
            >
              <option value=''>Выберите {label.toLowerCase()}</option>
              {options.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
            {showError && (
              <p id={`${name}-error`} className={formClasses.error}>
                {errors[name]}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Обновленный метод рендеринга чекбокса с подсказкой
  const renderCheckboxField = (
    label: string,
    name: keyof SpecimenFormData,
    hint?: string
  ) => {
    return (
      <div className='mb-4'>
        <div className='flex flex-col sm:flex-row'>
          <div className='sm:w-1/3'></div>
          <div className='sm:w-2/3 flex flex-col'>
            <div className='flex items-center'>
              <input
                type='checkbox'
                id={name.toString()}
                name={name.toString()}
                checked={formData[name] as boolean}
                onChange={handleCheckboxChange}
                className={`${formClasses.checkbox} mr-2`}
                aria-describedby={hint ? `${name}-hint` : undefined}
              />
              <label
                htmlFor={name.toString()}
                className='text-sm font-medium text-gray-700'
              >
                {label}
              </label>
            </div>
            {hint && (
              <p
                id={`${name}-hint`}
                className='text-xs text-gray-500 mt-1 ml-6'
              >
                {hint}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Новый метод для навигации по вкладкам
  const renderTabs = () => {
    const tabs = [
      {
        name: 'Основная информация',
        icon: <InfoIcon className='w-5 h-5 mr-2 text-blue-600' />,
      },
      {
        name: 'Географическая информация',
        icon: <MapIcon className='w-5 h-5 mr-2 text-green-600' />,
      },
      {
        name: 'Экспозиционная информация',
        icon: <LeafIcon className='w-5 h-5 mr-2 text-amber-600' />,
      },
      {
        name: 'Дополнительная информация',
        icon: <NoteIcon className='w-5 h-5 mr-2 text-purple-600' />,
      },
    ];

    // Проверяем наличие ошибок в секциях
    const tabHasErrors = [
      [
        'inventoryNumber',
        'russianName',
        'latinName',
        'familyId',
        'genus',
        'species',
        'cultivar',
        'form',
      ].some((field) => !!errors[field]),
      ['regionId', 'country', 'naturalRange', 'latitude', 'longitude'].some(
        (field) => !!errors[field]
      ),
      ['expositionId', 'plantingYear', 'hasHerbarium', 'duplicatesInfo'].some(
        (field) => !!errors[field]
      ),
      [
        'synonyms',
        'determinedBy',
        'sampleOrigin',
        'ecologyAndBiology',
        'economicUse',
        'conservationStatus',
        'originalBreeder',
        'originalYear',
        'notes',
        'filledBy',
      ].some((field) => !!errors[field]),
    ];

    return (
      <div className='mb-6 border-b border-gray-200'>
        <ul
          className={`${layoutClasses.flex} flex-wrap -mb-px text-sm font-medium`}
        >
          {tabs.map((tab, index) => (
            <li key={index} className='mr-2'>
              <button
                type='button'
                onClick={() => setActiveTab(index)}
                className={`inline-flex items-center px-4 py-2 border-b-2 rounded-t-lg ${
                  activeTab === index
                    ? 'text-blue-600 border-blue-600 active'
                    : 'border-transparent hover:text-gray-600 hover:border-gray-300'
                } group`}
                aria-current={activeTab === index ? 'page' : undefined}
              >
                {tab.icon}
                {tab.name}
                {tabHasErrors[index] && (
                  <span
                    className={`${chipClasses.base} ${chipClasses.danger} ml-2 py-0 px-1`}
                  >
                    !
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className={formClasses.base}>
      {/* Заголовок формы и основные действия */}
      <div className={`${headingClasses.page} mb-6 text-center`}>
        {initialData ? 'Редактирование образца' : 'Добавление нового образца'}
      </div>

      {/* Вкладки для навигации */}
      {renderTabs()}

      {/* Основная информация - отображается только если активна первая вкладка */}
      {activeTab === 0 && (
        <div className='mb-6 bg-gray-50 p-5 rounded-lg border border-gray-200 shadow-sm transition-all duration-300'>
          <h3
            className={`${headingClasses.heading} flex items-center text-xl mb-4 pb-2 border-b border-gray-300`}
          >
            <InfoIcon className='w-5 h-5 mr-2 text-blue-600' />
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
      )}

      {/* Географическая информация - отображается только если активна вторая вкладка */}
      {activeTab === 1 && (
        <div className='mb-6 bg-gray-50 p-5 rounded-lg border border-gray-200 shadow-sm transition-all duration-300'>
          <h3
            className={`${headingClasses.heading} flex items-center text-xl mb-4 pb-2 border-b border-gray-300`}
          >
            <MapIcon className='w-5 h-5 mr-2 text-green-600' />
            Географическая информация
          </h3>

          <div className='space-y-2'>
            {renderSelectField('Регион', 'regionId', regionOptions, true)}
            {renderTextField('Страна происхождения', 'country')}
            {renderTextField(
              'Естественный ареал',
              'naturalRange',
              false,
              true,
              2
            )}

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              {renderNumberField('Широта', 'latitude', false, -90, 90)}
              {renderNumberField('Долгота', 'longitude', false, -180, 180)}
            </div>
          </div>
        </div>
      )}

      {/* Экспозиционная информация - отображается только если активна третья вкладка */}
      {activeTab === 2 && (
        <div className='mb-6 bg-gray-50 p-5 rounded-lg border border-gray-200 shadow-sm transition-all duration-300'>
          <h3
            className={`${headingClasses.heading} flex items-center text-xl mb-4 pb-2 border-b border-gray-300`}
          >
            <LeafIcon className='w-5 h-5 mr-2 text-amber-600' />
            Экспозиционная информация
          </h3>

          <div className='space-y-2'>
            {renderSelectField(
              'Экспозиция',
              'expositionId',
              expositionOptions,
              true
            )}
            {renderNumberField(
              'Год посадки',
              'plantingYear',
              false,
              1700,
              new Date().getFullYear()
            )}
            {renderCheckboxField(
              'Наличие гербария',
              'hasHerbarium',
              'Отметьте, если для данного образца имеется гербарный материал'
            )}
            {renderTextField('Информация о дубликатах', 'duplicatesInfo')}
          </div>
        </div>
      )}

      {/* Дополнительная информация - отображается только если активна четвертая вкладка */}
      {activeTab === 3 && (
        <div className='mb-6 bg-gray-50 p-5 rounded-lg border border-gray-200 shadow-sm transition-all duration-300'>
          <h3
            className={`${headingClasses.heading} flex items-center text-xl mb-4 pb-2 border-b border-gray-300`}
          >
            <NoteIcon className='w-5 h-5 mr-2 text-purple-600' />
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
      )}

      {/* Кнопки действий */}
      <div
        className={`${actionsContainerClasses.base} justify-center sticky bottom-0 bg-white p-4 border-t border-gray-200 shadow-sm z-10`}
      >
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
