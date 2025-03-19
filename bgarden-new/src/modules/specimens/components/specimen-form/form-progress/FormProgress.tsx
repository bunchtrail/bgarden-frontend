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
    <div className="mt-4">
      <div className="flex justify-between mb-1 text-sm">
        <span>Заполнено:</span>
        <span className="font-medium">{roundedProgress}%</span>
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`h-full ${getProgressColor()} transition-all duration-500`}
          style={{ width: `${roundedProgress}%` }}
        />
      </div>
    </div>
  );
};

export default FormProgress;
