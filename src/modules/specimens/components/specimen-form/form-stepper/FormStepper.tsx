import React from 'react';

interface FormStepperProps {
  activeStep: number;
  goToStep: (step: number) => void;
}

/**
 * Компонент для отображения прогресса шагов формы
 * Визуализирует текущий шаг и позволяет переходить между шагами
 * 
 * @param activeStep - Текущий активный шаг
 * @param goToStep - Функция для перехода к указанному шагу
 */
export const FormStepper: React.FC<FormStepperProps> = ({ activeStep, goToStep }) => {
  const steps = [
    { id: 1, title: 'Основная информация' },
    { id: 2, title: 'Таксономия' },
    { id: 3, title: 'География' },
    { id: 4, title: 'Дополнительно' },
    { id: 5, title: 'Изображения' }
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step) => (
          <React.Fragment key={step.id}>
            {/* Кнопка шага */}
            <button
              type="button"
              onClick={() => goToStep(step.id)}
              className={`flex flex-col items-center transition-all duration-300 ${
                step.id === activeStep 
                  ? 'text-blue-600' 
                  : step.id < activeStep 
                    ? 'text-green-600'
                    : 'text-gray-400'
              }`}
            >
              {/* Номер шага */}
              <div 
                className={`flex items-center justify-center w-12 h-12 rounded-full text-white font-semibold mb-3 transition-all duration-300 ${
                  step.id === activeStep 
                    ? 'bg-blue-600 shadow-lg scale-110' 
                    : step.id < activeStep 
                      ? 'bg-green-500 shadow-md'
                      : 'bg-gray-300'
                }`}
              >
                {step.id < activeStep ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  step.id
                )}
              </div>
              
              {/* Название шага */}
              <span className={`text-sm font-medium hidden sm:block transition-all duration-300 ${
                step.id === activeStep ? 'font-semibold' : ''
              }`}>{step.title}</span>
            </button>
            
            {/* Линия-разделитель между шагами - более деликатная */}
            {step.id < steps.length && (
              <div className="flex-1 h-px mx-4 sm:mx-6 bg-gray-100 relative">
                <div 
                  className="absolute top-0 left-0 h-px bg-gradient-to-r from-green-400 to-blue-400 transition-all duration-500"
                  style={{ 
                    width: step.id < activeStep ? '100%' : '0%'
                  }}
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default FormStepper;
