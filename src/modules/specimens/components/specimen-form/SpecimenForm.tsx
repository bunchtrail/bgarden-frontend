import React, { useEffect, useMemo, useState } from 'react';
import { Specimen, SpecimenFormData } from '../../types';
import { useNotification } from '@/modules/notifications';
import { useLocation, useNavigate } from 'react-router-dom';
import { useFormValidation } from './hooks/useFormValidation';
import { useFormChanges } from './hooks/useFormChanges';
import { useFormNavigation } from './hooks/useFormNavigation';
import FormStepper from './form-stepper/FormStepper';
import FormProgress from './form-progress/FormProgress';
import { calculateFormProgress } from './utils/calculateFormProgress';
import StepContainer from './StepContainer';
import StepRenderer from './StepRenderer';
import NavigationButtons from './NavigationButtons';
import ImageUploader from './ImageUploader';
import { SectorType, LocationType } from '@/modules/specimens/types';
import { FamilyDto } from '../../services/familyService';
import { ExpositionDto } from '../../services/expositionService';
import { RegionData } from '@/modules/map/types/mapTypes';
import { useSpecimenImage } from '../../hooks';
import { specimenService } from '../../services/specimenService';
import { useLogger } from '@/hooks/useLogger';

interface SpecimenFormProps {
  specimen?: Specimen;
  onSubmit: (data: SpecimenFormData) => void;
  onCancel: () => void;
  families: FamilyDto[];
  expositions: ExpositionDto[];
  regions: RegionData[];
}

/**
 * Форма для добавления/редактирования образца растения
 * Современная многошаговая форма с визуальным прогресс-индикатором
 * 
 * @param specimen - Существующий образец для редактирования (опционально)
 * @param onSubmit - Функция для отправки формы
 * @param onCancel - Функция отмены
 */
const SpecimenForm: React.FC<SpecimenFormProps> = ({ specimen, onSubmit, onCancel, families, expositions, regions }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Инициализация логгера
  const log = useLogger('SpecimenForm');
  
  // Получаем тип сектора из URL, если он там есть
  const getSectorTypeFromUrl = (): number | null => {
    const params = new URLSearchParams(location.search);
    const sectorTypeParam = params.get('sectorType');
    const sectorType = sectorTypeParam ? Number(sectorTypeParam) : null;
    
    log.debug('Анализ параметров URL', { 
      sectorTypeParam, 
      sectorType, 
      search: location.search 
    });
    
    return sectorType;
  };
  
  // Получаем тип сектора из URL
  const sectorTypeFromUrl = getSectorTypeFromUrl();
  
  // Начальное состояние формы
  const initialFormState: SpecimenFormData = {
    inventoryNumber: '',
    sectorType: SectorType.Dendrology,
    locationType: LocationType.SchematicMap,
    latitude: 0,
    longitude: 0,
    locationWkt: '',
    mapX: 0,
    mapY: 0,
    regionId: null,
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
  };
  
  // Подключаем custom hooks для управления формой
  const { 
    activeStep, 
    slideDirection, 
    goToNextStep, 
    goToPreviousStep, 
    goToStep 
  } = useFormNavigation();
  
  const {
    errors,
    touchedFields,
    validateField,
    validateCurrentStep,
    setTouchedFields
  } = useFormValidation(specimen || initialFormState);

  // Используем новый хук для управления изменениями формы
  const {
    formData,
    setFormData,
    handleChange
  } = useFormChanges(specimen || initialFormState, (name, value) => {
    // Помечаем поле как затронутое и валидируем его
    setTouchedFields(prev => ({ ...prev, [name]: true }));
    validateField(name, value);
  });

  // Инициализация уведомлений
  const notification = useNotification();

  // Добавляем состояние для хранения выбранных изображений
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  
  // Добавляем локальное состояние для отслеживания прогресса загрузки
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  
  // Используем обновленный хук для работы с изображениями
  const { 
    uploadImage 
  } = useSpecimenImage(
    specimen?.id || 0, 
    null, 
    false // не загружать изображение автоматически
  );

  // Обновление формы при получении данных образца
  useEffect(() => {
    if (specimen) {
      log.info('Инициализация формы для редактирования образца', { 
        specimenId: specimen.id,
        inventoryNumber: specimen.inventoryNumber,
        russianName: specimen.russianName,
        latinName: specimen.latinName
      });
      
      setFormData({
        ...specimen,
        sectorType: typeof specimen.sectorType === 'string' ? Number(specimen.sectorType) : specimen.sectorType
      });
      
      log.debug('Данные образца загружены в форму', { formData: specimen });
    } else {
      log.info('Инициализация формы для создания нового образца', { 
        sectorTypeFromUrl,
        initialSectorType: initialFormState.sectorType 
      });
    }
  }, [specimen, setFormData, log, sectorTypeFromUrl]);

  // Обработчик выбора изображений
  const handleImagesChange = (files: File[]) => {
    log.info('Изображения выбраны пользователем', { 
      filesCount: files.length,
      filesInfo: files.map(f => ({
        name: f.name,
        size: f.size,
        type: f.type,
        lastModified: f.lastModified
      }))
    });
    
    setSelectedImages(files);
    
    log.debug('Детали выбранных изображений', {
      totalSize: files.reduce((sum, f) => sum + f.size, 0),
      fileTypes: Array.from(new Set(files.map(f => f.type))),
      averageSize: files.length > 0 ? files.reduce((sum, f) => sum + f.size, 0) / files.length : 0
    });
  };

  // Обработчик ошибок загрузки изображений
  const handleImageError = (message: string) => {
    log.error('Ошибка при работе с изображениями', { errorMessage: message });
    notification.error(message);
  };

  // Отправка формы
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    log.info('Начало обработки отправки формы образца');
    
    // Проверка, вызван ли submit действительно через кнопку "Сохранить"
    const submitEvent = e.nativeEvent as SubmitEvent;
    const isRealSubmit = submitEvent.submitter?.getAttribute('type') === 'submit';
    
    log.debug('Анализ события отправки формы', { 
      isRealSubmit,
      submitterType: submitEvent.submitter?.getAttribute('type'),
      submitterText: submitEvent.submitter?.textContent
    });
    
    // Если это не настоящий submit, то выходим (например, при клике на кнопку "Далее")
    if (!isRealSubmit) {
      log.debug('Прервана обработка - не является настоящей отправкой формы');
      return;
    }
    
    
    // Проверяем все обязательные поля перед отправкой (согласованно с другими функциями валидации)
    const allFields = [
      'inventoryNumber', 'russianName', 'latinName', // Шаг 1
      'familyId', // Шаг 2  
      'regionId' // Шаг 3
      // Шаги 4 и 5 не имеют обязательных полей
    ];
    
    log.debug('Валидация формы перед отправкой', { 
      allFields,
      currentFormData: {
        inventoryNumber: formData.inventoryNumber,
        russianName: formData.russianName,
        latinName: formData.latinName,
        familyId: formData.familyId,
        regionId: formData.regionId
      }
    });
    
    // Помечаем все обязательные поля как затронутые
    const newTouchedFields = { ...touchedFields };
    allFields.forEach(field => {
      newTouchedFields[field] = true;
    });
    setTouchedFields(newTouchedFields);
    
    // Валидируем все поля
    let isValid = true;
    const validationErrors: string[] = [];
    allFields.forEach(field => {
      const fieldIsValid = validateField(field, formData[field as keyof SpecimenFormData]);
      if (!fieldIsValid) {
        isValid = false;
        validationErrors.push(field);
      }
    });
    
    log.debug('Результат валидации формы', { 
      isValid, 
      validationErrors,
      touchedFieldsCount: Object.keys(newTouchedFields).length
    });
    
    if (isValid) {
      log.info('Форма прошла валидацию, начинаем отправку данных образца', {
        hasImages: selectedImages.length > 0,
        imagesCount: selectedImages.length,
        isEditMode: !!specimen?.id
      });
      
      notification.info('Отправка данных образца...', { duration: 3000 });
      
      // Проверяем и преобразуем sectorType в число, если это строка
      const finalFormData = {
        ...formData,
        // Преобразуем строковые значения в числа там, где это требуется API
        sectorType:
          typeof formData.sectorType === 'string'
            ? Number(formData.sectorType)
            : formData.sectorType,
        locationType:
          typeof formData.locationType === 'string'
            ? Number(formData.locationType)
            : formData.locationType,
        latitude:
          typeof formData.latitude === 'string'
            ? parseFloat(formData.latitude)
            : formData.latitude,
        longitude:
          typeof formData.longitude === 'string'
            ? parseFloat(formData.longitude)
            : formData.longitude,
        mapX:
          typeof formData.mapX === 'string'
            ? parseFloat(formData.mapX)
            : formData.mapX,
        mapY:
          typeof formData.mapY === 'string'
            ? parseFloat(formData.mapY)
            : formData.mapY,
      } as SpecimenFormData;
      
      log.debug('Подготовлены финальные данные для отправки', {
        finalFormData: {
          inventoryNumber: finalFormData.inventoryNumber,
          russianName: finalFormData.russianName,
          latinName: finalFormData.latinName,
          sectorType: finalFormData.sectorType,
          locationType: finalFormData.locationType,
          regionId: finalFormData.regionId,
          familyId: finalFormData.familyId,
          coordinates: {
            latitude: finalFormData.latitude,
            longitude: finalFormData.longitude,
            mapX: finalFormData.mapX,
            mapY: finalFormData.mapY
          }
        }
      });
      
      // Корректируем данные в зависимости от типа локации
      if (finalFormData.locationType === LocationType.SchematicMap) {
        log.debug('Применены настройки для схематических координат - убираем географические');
        // Для схематических координат убираем географические
        finalFormData.latitude = null as unknown as number;
        finalFormData.longitude = null as unknown as number;
      } else if (finalFormData.locationType === LocationType.Geographic) {
        log.debug('Применены настройки для географических координат - убираем схематические');
        // Для географических координат убираем схематические
        finalFormData.mapId = null as unknown as number;
        finalFormData.mapX = null as unknown as number;
        finalFormData.mapY = null as unknown as number;
      }
      
    
      
      // Если есть изображения, используем обновленный метод работы с изображениями
      if (selectedImages.length > 0) {
        log.info('Начинаем создание образца с изображениями', {
          imagesCount: selectedImages.length,
          imagesTotalSize: selectedImages.reduce((sum, f) => sum + f.size, 0),
          imageNames: selectedImages.map(f => f.name)
        });
        
        try {
          setIsUploading(true);
          log.debug('Установлен статус загрузки изображений');

          const result = await specimenService.createSpecimenWithImages(finalFormData, selectedImages);

          log.info('Образец успешно создан с изображениями', {
            specimenId: result.specimen.id,
            uploadedImageIds: result.imageIds,
            imagesUploaded: result.imageIds?.length || 0
          });

          setIsUploading(false);
          notification.success('Образец успешно создан с изображениями', { duration: 5000 });
          navigate(`/specimens/${result.specimen.id}`);
        } catch (error: any) {
          setIsUploading(false);
          
          log.error('Ошибка при создании образца с изображениями', {
            error: error.message || 'Неизвестная ошибка',
            errorDetails: error,
            finalFormData: {
              inventoryNumber: finalFormData.inventoryNumber,
              russianName: finalFormData.russianName,
              latinName: finalFormData.latinName
            },
            imagesInfo: {
              count: selectedImages.length,
              totalSize: selectedImages.reduce((sum, f) => sum + f.size, 0)
            }
          }, error);
          
          notification.error(`Ошибка при создании образца: ${error.message || 'Неизвестная ошибка'}`);
        }
      } else {
        log.info('Создание образца без изображений', {
          inventoryNumber: finalFormData.inventoryNumber,
          russianName: finalFormData.russianName,
          latinName: finalFormData.latinName
        });
        
        // Если изображения не выбраны, используем стандартный метод создания образца
        onSubmit(finalFormData);
      }
    } else {
      log.warn('Форма не прошла валидацию', {
        validationErrors,
        currentStep: activeStep,
        errors: errors
      });
      
      notification.error('Форма содержит ошибки. Пожалуйста, проверьте введенные данные.');
      
      // Переходим к первому шагу с ошибкой
      const fieldsToValidate: Record<number, string[]> = {
        1: ['inventoryNumber', 'russianName', 'latinName'],
        2: ['familyId'],
        3: ['regionId'],
        4: [],
        5: []
      };
      
      const stepsWithErrors = [1, 2, 3, 4, 5].filter(step => {
        const stepFields = (fieldsToValidate[step] || []);
        return stepFields.some(field => !!errors[field]);
      });
      
      log.debug('Определены шаги с ошибками', {
        stepsWithErrors,
        fieldsToValidate,
        currentErrors: errors
      });
      
      if (stepsWithErrors.length > 0) {
        log.info('Переход к первому шагу с ошибкой', { targetStep: stepsWithErrors[0] });
        goToStep(stepsWithErrors[0]);
      }
    }
  };

  // Определение шагов формы
  const formSteps = [
    { id: 1, title: 'Основная информация' },
    { id: 2, title: 'Таксономия' },
    { id: 3, title: 'География' },
    { id: 4, title: 'Дополнительно' },
    { id: 5, title: 'Изображения' },
  ];

  // Функция для проверки валидности шага без побочных эффектов
  const checkStepValidity = (step: number) => {
    const fieldsToValidate: Record<number, string[]> = {
      1: ['inventoryNumber', 'russianName', 'latinName'],
      2: ['familyId'],
      3: ['regionId'],
      4: [],
      5: []
    };
    
    const stepFields = fieldsToValidate[step] || [];
    
    // Проверяем только наличие заполненных обязательных полей
    // без вызова функций, обновляющих состояние
    return stepFields.every(field => {
      const value = formData[field as keyof SpecimenFormData];
      if (field === 'inventoryNumber' || field === 'russianName' || field === 'latinName') {
        return value !== undefined && value !== '';
      }
      if (field === 'familyId' || field === 'regionId') {
        return value !== undefined && value !== 0 && value !== '0';
      }
      return true;
    });
  };

  // Используем useMemo для вычисления статуса завершенности шагов
  // без вызова функций, обновляющих состояние во время рендера
  const completedSteps = useMemo(() => {
    return {
      1: checkStepValidity(1),
      2: checkStepValidity(2),
      3: checkStepValidity(3),
      4: checkStepValidity(4),
      5: checkStepValidity(5)
    };
  }, [formData]);

  // Проверка валидности текущего шага для кнопки "Далее"
  const isCurrentStepValid = useMemo(() => {
    return checkStepValidity(activeStep);
  }, [activeStep, formData]);

  // Проверка валидности всей формы для кнопки "Сохранить"
  const isFormValid = useMemo(() => {
    return [1, 2, 3, 4, 5].every(step => checkStepValidity(step));
  }, [formData]);

  // Рендер шага с загрузкой изображений
  const renderImagesStep = () => (
    <div className="flex flex-col space-y-6">
      <h3 className="text-xl font-semibold">Загрузка изображений</h3>
      
      {/* Отображаем галерею только для существующих образцов */}
      {specimen && specimen.id ? (
        <div className="mb-4">
          <h4 className="text-lg mb-3">Существующие изображения</h4>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {React.createElement(require('../specimen-gallery').default, { specimen })}
          </div>
        </div>
      ) : null}
      
      {/* Компонент загрузки новых изображений - всегда отображается */}
      <div className="mb-4">
        <h4 className="text-lg mb-3">Добавить изображения</h4>
        <ImageUploader
          value={selectedImages}
          onChange={handleImagesChange}
          onError={handleImageError}
          maxImages={5}
        />
      </div>
      
      {/* Индикатор загрузки */}
      {isUploading && (
        <div className="mt-4">
          <div className="flex justify-between mb-1 text-sm">
            <span>Загрузка изображений:</span>
            <span className="font-medium">{uploadProgress}%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-500 transition-all duration-300" 
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <FormStepper 
        activeStep={activeStep} 
        goToStep={goToStep} 
      />
      
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Контейнер шагов с анимацией */}
        <div className="p-8">
          <StepContainer slideDirection={slideDirection}>
            {/* Рендерер активного шага */}
            <StepRenderer 
              activeStep={activeStep} 
              formData={formData} 
              onChange={handleChange}
              errors={errors}
              touchedFields={touchedFields}
              families={families}
              regions={regions}
              expositions={expositions}
              imagesStep={renderImagesStep()}
            />
          </StepContainer>
        </div>
        
        {/* Индикатор заполненности формы */}
        <div className="px-8 py-4 bg-gray-50 border-t border-gray-100">
          <FormProgress 
            progress={calculateFormProgress(formData)} 
          />
        </div>
        
        {/* Навигационные кнопки */}
        <div className="px-8 py-6 bg-white border-t border-gray-100">
          <NavigationButtons 
            activeStep={activeStep}
            totalSteps={formSteps.length}
            onNext={() => {
              // Проверяем текущий шаг и переходим к следующему
              if (isCurrentStepValid) {
                // Убираем уведомление о переходе на следующий шаг
                goToNextStep();
              } else {
                notification.warning('Пожалуйста, заполните все обязательные поля', {
                  title: 'Невозможно перейти дальше'
                });
              }
            }}
            onPrevious={() => {
              const prevStepInfo = formSteps[activeStep - 2];
              notification.info(`Возврат к шагу "${prevStepInfo.title}"`, { 
                duration: 2000 
              });
              goToPreviousStep();
            }}
            onCancel={() => {
              notification.info('Ввод данных отменен', { duration: 3000 });
              onCancel();
            }}
            onSubmit={handleSubmit}
            isNextDisabled={!isCurrentStepValid}
            isSubmitDisabled={!isFormValid}
          />
        </div>
      </form>
    </div>
  );
};

export default SpecimenForm; 