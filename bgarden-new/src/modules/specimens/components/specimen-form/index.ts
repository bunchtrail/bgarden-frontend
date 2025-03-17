import SpecimenForm from './SpecimenForm';

export { default as SpecimenForm } from './SpecimenForm';
export { default as StepContainer } from './StepContainer';
export { default as StepRenderer } from './StepRenderer';
export { default as NavigationButtons } from './NavigationButtons';

// Re-export hooks
export * from './hooks/useFormNavigation';
export * from './hooks/useFormValidation';
export * from './hooks/useFormChanges';

// Добавляем default экспорт
export default SpecimenForm; 