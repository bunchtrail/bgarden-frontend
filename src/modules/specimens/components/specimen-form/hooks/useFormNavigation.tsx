import { useState } from 'react';

/**
 * Хук для управления навигацией между шагами многошаговой формы
 * Управляет активным шагом и анимациями при переходе между шагами
 */
export const useFormNavigation = () => {
  // Текущий активный шаг формы (1-5)
  const [activeStep, setActiveStep] = useState(1);
  
  // Для анимаций при смене шагов
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right');
  
  // Переход к следующему шагу
  const goToNextStep = () => {
    setSlideDirection('left');
    setTimeout(() => {
      setActiveStep(prev => Math.min(prev + 1, 5));
      setSlideDirection('right');
    }, 200);
  };

  // Переход к предыдущему шагу
  const goToPreviousStep = () => {
    setSlideDirection('right');
    setTimeout(() => {
      setActiveStep(prev => Math.max(prev - 1, 1));
      setSlideDirection('left');
    }, 200);
  };

  // Переход к конкретному шагу
  const goToStep = (step: number) => {
    if (step === activeStep) return;
    setSlideDirection(step > activeStep ? 'left' : 'right');
    setTimeout(() => {
      setActiveStep(step);
      setSlideDirection(step > activeStep ? 'right' : 'left');
    }, 200);
  };
  
  return {
    activeStep,
    slideDirection,
    goToNextStep,
    goToPreviousStep,
    goToStep
  };
}; 