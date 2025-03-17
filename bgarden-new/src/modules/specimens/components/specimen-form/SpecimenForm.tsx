import React, { useEffect } from 'react';
import { Specimen, SpecimenFormData } from '../../types';
import { cardClasses } from '@/styles/global-styles';

// Импортируем компоненты
import FormStepper from './form-stepper/FormStepper';
import FormProgress from './form-progress/FormProgress';
import { calculateFormProgress } from './utils/calculateFormProgress';
import StepContainer from './StepContainer';
import StepRenderer from './StepRenderer';
import NavigationButtons from './NavigationButtons';

// Импортируем хуки
import { useFormNavigation } from './hooks/useFormNavigation';
import { useFormValidation } from './hooks/useFormValidation';
import { useFormChanges } from './hooks/useFormChanges';

interface SpecimenFormProps {
  specimen?: Specimen;
  onSubmit: (data: SpecimenFormData) => void;
  onCancel: () => void;
}

/**
 * Форма для добавления/редактирования образца растения
 * Современная многошаговая форма с визуальным прогресс-индикатором
 * 
 * @param specimen - Существующий образец для редактирования (опционально)
 * @param onSubmit - Функция для отправки формы
 * @param onCancel - Функция отмены
 */
const SpecimenForm: React.FC<SpecimenFormProps> = ({ specimen, onSubmit, onCancel }) => {
  // Инициализация дефолтных значений формы
  const defaultFormData: SpecimenFormData = {
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
  };
  
  // Подключаем custom hooks для управления формой
  const { 
    activeStep, 
    slideDirection, 
    goToNextStep: goToNextStepNav, 
    goToPreviousStep, 
    goToStep 
  } = useFormNavigation();
  
  const {
    errors,
    touchedFields,
    validateField,
    validateCurrentStep,
    setTouchedFields
  } = useFormValidation(specimen || defaultFormData);

  // Используем новый хук для управления изменениями формы
  const {
    formData,
    setFormData,
    handleChange
  } = useFormChanges(specimen || defaultFormData, (name, value) => {
    // Помечаем поле как затронутое и валидируем его
    setTouchedFields(prev => ({ ...prev, [name]: true }));
    validateField(name, value);
  });

  // Обновление формы при получении данных образца
  useEffect(() => {
    if (specimen) {
      setFormData(specimen);
    }
  }, [specimen, setFormData]);

  // Переход к следующему шагу с валидацией
  const goToNextStep = () => {
    if (validateCurrentStep(activeStep)) {
      goToNextStepNav();
    }
  };

  // Отправка формы
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
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
      onSubmit(formData);
    } else {
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

  // Общее количество шагов формы
  const TOTAL_STEPS = 4;

  return (
    <div>
      {/* Прогресс-индикатор */}
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
          />
        </StepContainer>
        
        {/* Индикатор заполненности формы */}
        <FormProgress 
          progress={calculateFormProgress(formData)} 
        />
        
        {/* Навигационные кнопки */}
        <NavigationButtons
          activeStep={activeStep}
          totalSteps={TOTAL_STEPS}
          onNext={goToNextStep}
          onPrevious={goToPreviousStep}
          onCancel={onCancel}
          onSubmit={handleSubmit}
        />
      </form>
    </div>
  );
};

export default SpecimenForm; 