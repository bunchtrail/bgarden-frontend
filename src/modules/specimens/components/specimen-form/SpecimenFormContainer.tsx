import React, { useEffect, useState } from 'react';
import { Specimen, SpecimenFormData } from '../../types';
import { CancelIcon, SaveIcon } from '../icons';
import {
  actionsContainerClasses,
  formClasses,
  headingClasses,
} from '../styles';
import { AdditionalInfoSection } from './AdditionalInfoSection';
import { BasicInfoSection } from './BasicInfoSection';
import { ExpositionInfoSection } from './ExpositionInfoSection';
import { GeographicInfoSection } from './GeographicInfoSection';
import { FormTabs } from './Tabs';
import { SpecimenFormTab } from './types';

interface SpecimenFormContainerProps {
  initialData?: Specimen;
  onSave: (data: SpecimenFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  familyOptions?: { id: number; name: string }[];
  expositionOptions?: { id: number; name: string }[];
  regionOptions?: { id: number; name: string }[];
}

export const SpecimenFormContainer: React.FC<SpecimenFormContainerProps> = ({
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
  const [activeTab, setActiveTab] = useState<SpecimenFormTab>(
    SpecimenFormTab.BasicInfo
  );
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

    // Проверяем валидность всех полей
    if (validate()) {
      onSave(formData);
    } else {
      // Находим первую вкладку с ошибкой и переключаемся на нее
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
        ].some((field) => !!errors[field])
      ) {
        setActiveTab(SpecimenFormTab.BasicInfo);
      } else if (
        ['regionId', 'country', 'naturalRange', 'latitude', 'longitude'].some(
          (field) => !!errors[field]
        )
      ) {
        setActiveTab(SpecimenFormTab.GeographicInfo);
      } else if (
        ['expositionId', 'plantingYear', 'hasHerbarium', 'duplicatesInfo'].some(
          (field) => !!errors[field]
        )
      ) {
        setActiveTab(SpecimenFormTab.ExpositionInfo);
      } else if (
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
        ].some((field) => !!errors[field])
      ) {
        setActiveTab(SpecimenFormTab.AdditionalInfo);
      }
    }
  };

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case SpecimenFormTab.BasicInfo:
        return (
          <BasicInfoSection
            formData={formData}
            errors={errors}
            touchedFields={touchedFields}
            formSubmitted={formSubmitted}
            markFieldAsTouched={markFieldAsTouched}
            validateField={validateField}
            familyOptions={familyOptions}
            handleChange={handleChange}
            handleSelectChange={handleSelectChange}
          />
        );
      case SpecimenFormTab.GeographicInfo:
        return (
          <GeographicInfoSection
            formData={formData}
            errors={errors}
            touchedFields={touchedFields}
            formSubmitted={formSubmitted}
            markFieldAsTouched={markFieldAsTouched}
            validateField={validateField}
            regionOptions={regionOptions}
            handleChange={handleChange}
            handleSelectChange={handleSelectChange}
            handleNumberChange={handleNumberChange}
          />
        );
      case SpecimenFormTab.ExpositionInfo:
        return (
          <ExpositionInfoSection
            formData={formData}
            errors={errors}
            touchedFields={touchedFields}
            formSubmitted={formSubmitted}
            markFieldAsTouched={markFieldAsTouched}
            validateField={validateField}
            expositionOptions={expositionOptions}
            handleChange={handleChange}
            handleSelectChange={handleSelectChange}
            handleNumberChange={handleNumberChange}
            handleCheckboxChange={handleCheckboxChange}
          />
        );
      case SpecimenFormTab.AdditionalInfo:
        return (
          <AdditionalInfoSection
            formData={formData}
            errors={errors}
            touchedFields={touchedFields}
            formSubmitted={formSubmitted}
            markFieldAsTouched={markFieldAsTouched}
            validateField={validateField}
            handleChange={handleChange}
            handleNumberChange={handleNumberChange}
          />
        );
      default:
        return null;
    }
  };

  // Навигационные кнопки для вкладок
  const renderTabNavigation = () => {
    return (
      <div className='flex justify-between items-center mt-8 mb-4 bg-gray-50 rounded-lg p-3 border border-gray-200 shadow-sm'>
        <button
          type='button'
          onClick={() => {
            if (activeTab > SpecimenFormTab.BasicInfo) {
              setActiveTab(activeTab - 1);
            }
          }}
          disabled={activeTab === SpecimenFormTab.BasicInfo}
          className={`flex items-center justify-center px-4 py-2 rounded-lg bg-white border ${
            activeTab === SpecimenFormTab.BasicInfo
              ? 'border-gray-200 text-gray-400 cursor-not-allowed'
              : 'border-blue-500 text-blue-600 hover:bg-blue-50 hover:shadow-sm transition-all duration-300'
          }`}
        >
          <svg className='w-5 h-5 mr-2' fill='currentColor' viewBox='0 0 20 20'>
            <path
              fillRule='evenodd'
              d='M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z'
              clipRule='evenodd'
            />
          </svg>
          Назад
        </button>

        <div className='flex space-x-1'>
          {[0, 1, 2, 3].map((tabIndex) => (
            <button
              key={tabIndex}
              type='button'
              onClick={() => setActiveTab(tabIndex)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                activeTab === tabIndex
                  ? 'bg-blue-600 scale-125'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Перейти к вкладке ${tabIndex + 1}`}
            />
          ))}
        </div>

        <button
          type='button'
          onClick={() => {
            if (activeTab < SpecimenFormTab.AdditionalInfo) {
              setActiveTab(activeTab + 1);
            }
          }}
          disabled={activeTab === SpecimenFormTab.AdditionalInfo}
          className={`flex items-center justify-center px-4 py-2 rounded-lg bg-white border ${
            activeTab === SpecimenFormTab.AdditionalInfo
              ? 'border-gray-200 text-gray-400 cursor-not-allowed'
              : 'border-blue-500 text-blue-600 hover:bg-blue-50 hover:shadow-sm transition-all duration-300'
          }`}
        >
          Далее
          <svg className='w-5 h-5 ml-2' fill='currentColor' viewBox='0 0 20 20'>
            <path
              fillRule='evenodd'
              d='M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z'
              clipRule='evenodd'
            />
          </svg>
        </button>
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className={formClasses.base}>
      <div
        className={`${headingClasses.page} flex items-center justify-between`}
      >
        <h2 className='text-3xl font-bold text-gray-800 flex items-center'>
          {initialData ? (
            <>
              <span className='w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center mr-3 shadow-sm'>
                <svg
                  className='w-6 h-6 text-amber-600'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path d='M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z' />
                </svg>
              </span>
              <span className='bg-gradient-to-r from-amber-700 to-amber-500 bg-clip-text text-transparent'>
                Редактирование образца
              </span>
            </>
          ) : (
            <>
              <span className='w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3 shadow-sm'>
                <svg
                  className='w-6 h-6 text-green-600'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path
                    fillRule='evenodd'
                    d='M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z'
                    clipRule='evenodd'
                  />
                </svg>
              </span>
              <span className='bg-gradient-to-r from-green-700 to-green-500 bg-clip-text text-transparent'>
                Создание нового образца
              </span>
            </>
          )}
        </h2>
      </div>

      <FormTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        errors={errors}
      />

      {renderActiveTabContent()}

      {renderTabNavigation()}

      <div className={`${actionsContainerClasses.base} mt-8`}>
        <button
          type='button'
          onClick={onCancel}
          className='flex items-center justify-center px-6 py-3 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all duration-300 shadow-sm hover:shadow'
          disabled={isLoading}
        >
          <CancelIcon className='w-5 h-5 mr-2 text-gray-500' />
          Отмена
        </button>
        <button
          type='submit'
          className='flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all duration-300 shadow-sm hover:shadow'
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <svg
                className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
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
            <>
              <SaveIcon className='w-5 h-5 mr-2' />
              Сохранить
            </>
          )}
        </button>
      </div>
    </form>
  );
};
