import React from 'react';

interface StepContainerProps {
  children: React.ReactNode;
  slideDirection: 'left' | 'right' | 'none';
}

/**
 * Контейнер для отображения шагов формы с анимацией перехода
 */
const StepContainer: React.FC<StepContainerProps> = ({ 
  children, 
  slideDirection 
}) => {
  return (
    <div className="overflow-hidden min-h-[500px]">
      <div 
        className={`transition-transform duration-300 transform ${
          slideDirection === 'right' 
            ? 'translate-x-full' 
            : slideDirection === 'left'
              ? '-translate-x-full'
              : ''
        }`}
        style={{ 
          transform: 'translateX(0)' 
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default StepContainer; 