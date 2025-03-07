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
  const [isEditMode, setIsEditMode] = useState<boolean>(!!initialData?.id);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setIsEditMode(!!initialData.id);
    } else {
      setFormData(emptyFormData);
      setIsEditMode(false);
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

  // Обработчики для переключателя режимов
  const handleAddNewMode = () => {
    if (isLoading) return;
    
    // Убираем диалог подтверждения и сразу переключаемся в режим добавления
    setFormData(emptyFormData);
    setErrors({});
    setTouchedFields({});
    setFormSubmitted(false);
    setIsEditMode(false);
    setActiveTab(SpecimenFormTab.BasicInfo);
    
    // Не вызываем onCancel(), чтобы не перенаправлять на страницу списка образцов
  };
  
  // Обработчик для переключения в режим редактирования
  const handleEditMode = () => {
    if (isLoading || !initialData?.id) return;
    
    // Если есть данные для редактирования, восстанавливаем их
    if (initialData) {
      setFormData(initialData);
      setErrors({});
      setTouchedFields({});
      setFormSubmitted(false);
      setIsEditMode(true);
      setActiveTab(SpecimenFormTab.BasicInfo);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`${formClasses.base} max-w-4xl mx-auto`}>
      <div className={`${headingClasses.page} flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4`}>
        <h2 className='text-2xl sm:text-3xl font-bold text-gray-800 flex items-center'>
          {isEditMode ? (
            <>
              <span className='w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center mr-3 shadow-md'>
                <svg
                  className='w-6 h-6 text-amber-600'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path d='M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z' />
                </svg>
              </span>
              <span className='bg-gradient-to-r from-amber-700 to-amber-500 bg-clip-text text-transparent'>
                Редактирование образца #{formData.inventoryNumber}
              </span>
            </>
          ) : (
            <>
              <span className='w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3 shadow-md'>
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
                Добавление нового образца
              </span>
            </>
          )}
        </h2>
        
        <div className='flex items-center'>
          {/* Переключатель режима работы с образцом */}
          <div className='mr-4 bg-gray-100 p-1 rounded-lg shadow-inner border border-gray-200'>
            <div className='flex items-center'>
              <button 
                type='button' 
                onClick={handleAddNewMode} 
                className={`px-3 py-1.5 text-sm rounded-md transition-all ${!isEditMode 
                  ? 'bg-green-500 text-white shadow-sm' 
                  : 'text-gray-600 hover:bg-gray-200'}`}
                disabled={isLoading}
                title="Создать новый образец"
              >
                <span className='flex items-center'>
                  <svg className='w-4 h-4 mr-1' fill='currentColor' viewBox='0 0 20 20'>
                    <path fillRule='evenodd' d='M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z' clipRule='evenodd' />
                  </svg>
                  Новый
                </span>
              </button>
              <button 
                type='button'
                onClick={handleEditMode} 
                className={`px-3 py-1.5 text-sm rounded-md transition-all ${isEditMode 
                  ? 'bg-amber-500 text-white shadow-sm' 
                  : 'text-gray-600 hover:bg-gray-200'}`}
                disabled={isLoading || !initialData?.id}
                title={!initialData?.id ? "Нет данных для редактирования" : "Режим редактирования образца"}
              >
                <span className='flex items-center'>
                  <svg className='w-4 h-4 mr-1' fill='currentColor' viewBox='0 0 20 20'>
                    <path d='M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z' />
                  </svg>
                  Редактировать
                </span>
              </button>
            </div>
          </div>
          
          {/* Кнопка сохранения */}
          <button
            type='submit'
            className='px-3 py-1.5 bg-white border border-green-500 text-green-600 text-sm rounded-lg hover:bg-green-50 transition-colors disabled:opacity-50 flex items-center'
            disabled={isLoading}
            title={isEditMode ? "Сохранить изменения в образце" : "Создать новый образец"}
          >
            <SaveIcon className='w-4 h-4 mr-1.5' />
            <span>{isLoading ? 'Сохранение...' : isEditMode ? 'Сохранить изменения' : 'Создать образец'}</span>
          </button>
        </div>
      </div>

      {/* Визуальный индикатор прогресса */}
      <div className='mb-2 bg-gray-100 rounded-lg p-3 flex items-center justify-between'>
        <div className='flex items-center'>
          <span className='text-sm font-medium text-gray-700 mr-3'>Прогресс заполнения:</span>
          <div className='w-40 h-2 bg-gray-200 rounded-full overflow-hidden'>
            <div 
              className='h-full bg-gradient-to-r from-blue-500 to-green-500'
              style={{ width: `${(activeTab + 1) / Object.keys(SpecimenFormTab).length * 100}%` }}
            />
          </div>
        </div>
        <div className='text-xs text-gray-500 px-2 py-1 bg-white rounded-md border border-gray-200 shadow-sm'>
          {activeTab === SpecimenFormTab.BasicInfo && 'Шаг 1 из 4: Основная информация'}
          {activeTab === SpecimenFormTab.GeographicInfo && 'Шаг 2 из 4: Географическая информация'}
          {activeTab === SpecimenFormTab.ExpositionInfo && 'Шаг 3 из 4: Экспозиционная информация'}
          {activeTab === SpecimenFormTab.AdditionalInfo && 'Шаг 4 из 4: Дополнительная информация'}
        </div>
      </div>

      {/* Вкладки формы */}
      <div className='bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden mb-4'>
        <FormTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          errors={errors}
        />
      </div>

      {/* Контейнер для основного содержимого формы */}
      <div className="transition-all duration-500 ease-in-out bg-white rounded-lg border border-gray-200 shadow-sm p-4">
        <div className="animate-fadeIn">{renderActiveTabContent()}</div>
      </div>

      {/* Навигация по вкладкам */}
      <div className='flex justify-between items-center mt-6 mb-4 bg-gray-50 rounded-lg p-4 border border-gray-200 shadow-sm'>
        <button
          type='button'
          onClick={() => {
            if (activeTab > SpecimenFormTab.BasicInfo) {
              setActiveTab(activeTab - 1);
            }
          }}
          disabled={activeTab === SpecimenFormTab.BasicInfo}
          className={`flex items-center justify-center px-4 py-2 rounded-lg ${
            activeTab === SpecimenFormTab.BasicInfo
              ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-white border border-blue-500 text-blue-600 hover:bg-blue-50 hover:shadow-sm transition-all duration-300'
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

        {/* Счетчик заполненных полей */}
        <div className="px-4 py-2 bg-white rounded-lg border border-gray-200 text-sm text-gray-700 flex flex-col items-center">
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Заполнено полей: {Object.keys(touchedFields).length}</span>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {Object.keys(errors).length > 0 ? 
              <span className="text-red-500">Ошибок: {Object.keys(errors).length}</span> : 
              <span className="text-green-500">Все заполненные поля валидны</span>
            }
          </div>
        </div>

        <button
          type='button'
          onClick={() => {
            if (activeTab < SpecimenFormTab.AdditionalInfo) {
              setActiveTab(activeTab + 1);
            }
          }}
          disabled={activeTab === SpecimenFormTab.AdditionalInfo}
          className={`flex items-center justify-center px-4 py-2 rounded-lg ${
            activeTab === SpecimenFormTab.AdditionalInfo
              ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-white border border-blue-500 text-blue-600 hover:bg-blue-50 hover:shadow-sm transition-all duration-300'
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
    </form>
  );
};
