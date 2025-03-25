import React, { useEffect, useMemo, useState } from 'react';
import { Specimen, SpecimenFormData } from '../../types';
import { cardClasses } from '@/styles/global-styles';
import { useNotification } from '@/modules/notifications';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/modules/auth/hooks';
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
import { SectorType } from '@/modules/specimens/types';
import { FamilyDto } from '../../services/familyService';
import { ExpositionDto } from '../../services/expositionService';
import { RegionData } from '@/modules/map/types/mapTypes';
import { createSpecimenWithImages } from '../../services/specimenService';

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
  
  // Получаем тип сектора из URL, если он там есть
  const getSectorTypeFromUrl = (): number | null => {
    const params = new URLSearchParams(location.search);
    const sectorTypeParam = params.get('sectorType');
    return sectorTypeParam ? Number(sectorTypeParam) : null;
  };
  
  // Получаем тип сектора из URL
  const sectorTypeFromUrl = getSectorTypeFromUrl();
  
  // Начальное состояние формы
  const initialFormState: SpecimenFormData = {
    inventoryNumber: '',
    sectorType: SectorType.Dendrology,
    latitude: 0,
    longitude: 0,
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
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // Обновление формы при получении данных образца
  useEffect(() => {
    if (specimen) {
      setFormData({
        ...specimen,
        sectorType: typeof specimen.sectorType === 'string' ? Number(specimen.sectorType) : specimen.sectorType
      });
    }
  }, [specimen, setFormData]);

  // Обработчик выбора изображений
  const handleImagesChange = (files: File[]) => {
    setSelectedImages(files);
  };

  // Обработчик ошибок загрузки изображений
  const handleImageError = (message: string) => {
    notification.error(message);
  };

  // Отправка формы
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Проверка, вызван ли submit действительно через кнопку "Сохранить"
    const submitEvent = e.nativeEvent as SubmitEvent;
    const isRealSubmit = submitEvent.submitter?.getAttribute('type') === 'submit';
    
    // Если это не настоящий submit, то выходим (например, при клике на кнопку "Далее")
    if (!isRealSubmit) {
      return;
    }
    
    // Проверяем все поля перед отправкой
    const allFields = [
      'inventoryNumber', 'russianName', 'latinName', 'genus', 'species',
      'familyId', 'familyName', 'latitude', 'longitude', 'regionId'
    ];
    
    // Помечаем все обязательные поля как затронутые
    const newTouchedFields = { ...touchedFields };
    allFields.forEach(field => {
      newTouchedFields[field] = true;
    });
    setTouchedFields(newTouchedFields);
    
    // Валидируем все поля
    let isValid = true;
    allFields.forEach(field => {
      const fieldIsValid = validateField(field, formData[field as keyof SpecimenFormData]);
      if (!fieldIsValid) isValid = false;
    });
    
    if (isValid) {
      notification.info('Отправка данных образца...', { duration: 3000 });
      
      // Проверяем и преобразуем sectorType в число, если это строка
      const finalFormData = { 
        ...formData,
        // Преобразуем строковое значение sectorType в число
        sectorType: typeof formData.sectorType === 'string' ? Number(formData.sectorType) : formData.sectorType 
      };
      
      // Если есть изображения, используем метод createSpecimenWithImages
      if (selectedImages.length > 0) {
        try {
          setIsUploading(true);
          
          // Отладочный вывод
          console.log('Отправляемые данные образца:', finalFormData);
          console.log('Отправляемые изображения:', selectedImages.map(img => ({
            name: img.name,
            type: img.type,
            size: img.size
          })));
          
          const result = await createSpecimenWithImages(
            finalFormData, 
            selectedImages,
            (progress) => {
              console.log(`Прогресс загрузки: ${progress}%`);
              setUploadProgress(progress);
            }
          );
          
          notification.success('Образец успешно создан с изображениями', { duration: 5000 });
          navigate(`/specimens/${result.specimen.id}`);
        } catch (error: any) {
          console.error('Подробная ошибка:', error);
          notification.error(`Ошибка при создании образца: ${error.message || 'Неизвестная ошибка'}`);
        } finally {
          setIsUploading(false);
        }
      } else {
        // Если изображения не выбраны, используем стандартный метод создания образца
        onSubmit(finalFormData);
      }
    } else {
      notification.error('Форма содержит ошибки. Пожалуйста, проверьте введенные данные.');
      
      // Переходим к первому шагу с ошибкой
      const fieldsToValidate: Record<number, string[]> = {
        1: ['inventoryNumber', 'russianName', 'latinName', 'genus', 'species'],
        2: ['familyId', 'familyName'],
        3: ['latitude', 'longitude', 'regionId'],
        4: []
      };
      
      const stepsWithErrors = [1, 2, 3, 4].filter(step => {
        const stepFields = (fieldsToValidate[step] || []);
        return stepFields.some(field => !!errors[field]);
      });
      
      if (stepsWithErrors.length > 0) {
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
      1: ['inventoryNumber', 'russianName', 'latinName', 'genus', 'species'],
      2: ['familyId', 'familyName'],
      3: ['latitude', 'longitude', 'regionId'],
      4: []
    };
    
    const stepFields = fieldsToValidate[step] || [];
    
    // Проверяем только наличие заполненных обязательных полей
    // без вызова функций, обновляющих состояние
    return stepFields.every(field => {
      const value = formData[field as keyof SpecimenFormData];
      if (field === 'inventoryNumber' || field === 'russianName' || field === 'latinName') {
        return value !== undefined && value !== '';
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
      4: checkStepValidity(4)
    };
  }, [formData]);

  // Проверка валидности текущего шага для кнопки "Далее"
  const isCurrentStepValid = useMemo(() => {
    return checkStepValidity(activeStep);
  }, [activeStep, formData]);

  // Проверка валидности всей формы для кнопки "Сохранить"
  const isFormValid = useMemo(() => {
    return [1, 2, 3, 4].every(step => checkStepValidity(step));
  }, [formData]);

  // Рендер шага с загрузкой изображений
  const renderImagesStep = () => (
    <div className="py-4">
      <h3 className="text-xl font-semibold mb-4">Загрузка изображений</h3>
      <p className="text-gray-600 mb-4">
        Загрузите изображения образца. Первое изображение будет использоваться как основное.
      </p>
      
      <ImageUploader
        value={selectedImages}
        onChange={handleImagesChange}
        onError={handleImageError}
        maxImages={5}
      />
      
      {isUploading && (
        <div className="mt-4">
          <p className="text-sm font-medium mb-2">Прогресс загрузки: {uploadProgress}%</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-green-600 h-2.5 rounded-full transition-all duration-300" 
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div>
      <FormStepper 
        activeStep={activeStep} 
        goToStep={goToStep} 
      />
      
      <form onSubmit={handleSubmit} className={`${cardClasses.outlined} ${cardClasses.content} rounded-xl`}>
        {/* Контейнер шагов с анимацией */}
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
        
        {/* Индикатор заполненности формы */}
        <FormProgress 
          progress={calculateFormProgress(formData)} 
        />
        
        {/* Навигационные кнопки */}
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
      </form>
    </div>
  );
};

export default SpecimenForm; 