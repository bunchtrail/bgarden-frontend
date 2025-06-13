import React from 'react';

interface FormProgressProps {
  progress: number;
}

/**
 * Компонент для отображения общего прогресса заполнения формы
 * Визуализирует процент заполнения в виде прогресс-бара
 * 
 * @param progress - Процент заполнения формы (0-100)
 */
export const FormProgress: React.FC<FormProgressProps> = ({ progress }) => {
  // Округляем прогресс до целого числа
  const roundedProgress = Math.round(progress);
  
  // Определяем цвет прогресс-бара в зависимости от процента заполнения
  const getProgressColor = () => {
    if (roundedProgress < 33) return 'bg-red-500';
    if (roundedProgress < 66) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between text-sm">
        <span className="font-medium text-gray-700">Заполнено:</span>
        <span className="font-semibold text-gray-900">{roundedProgress}%</span>
      </div>
      <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
        <div 
          className={`h-full ${getProgressColor()} transition-all duration-700 ease-out rounded-full`}
          style={{ width: `${roundedProgress}%` }}
        />
      </div>
    </div>
  );
};

export default FormProgress;
