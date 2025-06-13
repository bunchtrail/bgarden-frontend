import React from 'react';
import { Button } from '@/modules/ui';

interface NavigationButtonsProps {
  activeStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrevious: () => void;
  onCancel: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isNextDisabled?: boolean;
  isSubmitDisabled?: boolean;
}

/**
 * Компонент навигационных кнопок для многошаговой формы
 */
const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  activeStep,
  totalSteps,
  onNext,
  onPrevious,
  onCancel,
  onSubmit,
  isNextDisabled = false,
  isSubmitDisabled = false
}) => {
  return (
    <div className="flex justify-between">
      <div>
        {activeStep > 1 ? (
          <Button 
            variant="neutral"
            onClick={onPrevious}
            className="flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Назад
          </Button>
        ) : (
          <Button 
            variant="neutral"
            onClick={onCancel}
          >
            Отмена
          </Button>
        )}
      </div>
      
      <div className="flex space-x-2">
        {/* Кнопка "Сохранить" присутствует всегда */}
        <Button 
          variant="success" 
          type="submit"
          className="flex items-center"
          disabled={isSubmitDisabled}
        >
          Сохранить
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </Button>
        
        {/* Кнопка "Далее" только если это не последний шаг */}
        {activeStep < totalSteps && (
          <Button 
            variant="primary"
            onClick={(e) => {
              // Останавливаем стандартное событие отправки формы
              e.preventDefault();
              onNext();
            }}
            className="flex items-center"
            disabled={isNextDisabled}
            type="button" // Явно указываем тип кнопки как button, чтобы не отправлять форму
          >
            Далее
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Button>
        )}
      </div>
    </div>
  );
};

export default NavigationButtons; 