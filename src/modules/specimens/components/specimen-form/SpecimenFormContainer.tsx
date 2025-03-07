import React, { useEffect, useState } from 'react';
import { Specimen, SpecimenFormData } from '../../types';
import { CancelIcon, SaveIcon } from '../icons';
import {
  actionsContainerClasses,
  buttonClasses,
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
          setActiveTab(SpecimenFormTab.BasicInfo); // Основная информация
        } else if (
          [
            'regionId',
            'country',
            'naturalRange',
            'latitude',
            'longitude',
          ].includes(firstErrorField)
        ) {
          setActiveTab(SpecimenFormTab.GeographicInfo); // Географическая информация
        } else if (
          [
            'expositionId',
            'plantingYear',
            'hasHerbarium',
            'duplicatesInfo',
          ].includes(firstErrorField)
        ) {
          setActiveTab(SpecimenFormTab.ExpositionInfo); // Экспозиционная информация
        } else {
          setActiveTab(SpecimenFormTab.AdditionalInfo); // Дополнительная информация
        }
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className={formClasses.base}>
      {/* Заголовок формы и основные действия */}
      <div className={`mb-6`}>
        <div className='text-center bg-gradient-to-r from-gray-50 via-white to-gray-50 rounded-lg p-4 shadow-sm border border-gray-100'>
          <h1 className={`${headingClasses.page} mb-2`}>
            {initialData
              ? 'Редактирование образца'
              : 'Добавление нового образца'}
          </h1>
          <p className='text-gray-600 max-w-2xl mx-auto'>
            Заполните информацию об образце растения. Используйте вкладки ниже
            для навигации по разделам формы. Поля, отмеченные{' '}
            <span className='text-red-500'>*</span>, обязательны для заполнения.
          </p>
        </div>
      </div>

      {/* Вкладки для навигации */}
      <FormTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        errors={errors}
      />

      {/* Кнопка перехода к следующей вкладке, показывается внизу текущей вкладки */}
      {activeTab < SpecimenFormTab.AdditionalInfo && (
        <div className='flex justify-end mb-4'>
          <button
            type='button'
            onClick={() => setActiveTab(activeTab + 1)}
            className={`${buttonClasses.base} bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300 flex items-center px-4 py-2 rounded-md transition-colors duration-200`}
          >
            Следующий раздел
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-5 w-5 ml-2'
              viewBox='0 0 20 20'
              fill='currentColor'
            >
              <path
                fillRule='evenodd'
                d='M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z'
                clipRule='evenodd'
              />
            </svg>
          </button>
        </div>
      )}

      {/* Отображение секции в зависимости от активной вкладки */}
      {activeTab === SpecimenFormTab.BasicInfo && (
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
      )}

      {activeTab === SpecimenFormTab.GeographicInfo && (
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
      )}

      {activeTab === SpecimenFormTab.ExpositionInfo && (
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
      )}

      {activeTab === SpecimenFormTab.AdditionalInfo && (
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
      )}

      {/* TODO: Добавить другие секции */}

      {/* Кнопки действий */}
      <div
        className={`${actionsContainerClasses.base} justify-center sticky bottom-0 bg-white p-4 border-t border-gray-200 shadow-md z-10 transition-all duration-300`}
      >
        <div className='flex space-x-4'>
          <button
            type='button'
            onClick={onCancel}
            className={`${buttonClasses.base} ${buttonClasses.secondary} flex items-center px-6 py-2 transition-colors duration-200 rounded-md`}
            disabled={isLoading}
          >
            <CancelIcon className='w-5 h-5 mr-2' />
            Отмена
          </button>
          <button
            type='submit'
            className={`${buttonClasses.base} ${buttonClasses.primary} flex items-center px-6 py-2 transition-colors duration-200 shadow-sm hover:shadow rounded-md`}
            disabled={isLoading}
          >
            <SaveIcon className='w-5 h-5 mr-2' />
            {isLoading ? (
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
              'Сохранить'
            )}
          </button>
        </div>
      </div>
    </form>
  );
};
