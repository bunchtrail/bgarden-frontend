import React, { ReactNode } from 'react';

interface AnimatedViewContainerProps {
  children: ReactNode;
  transitionClasses: string;
  containerClasses: string;
  isTransitioning: boolean;
  className?: string;
}

/**
 * Контейнер для анимированного переключения между видами
 */
const AnimatedViewContainer: React.FC<AnimatedViewContainerProps> = ({
  children,
  transitionClasses,
  containerClasses,
  isTransitioning,
  className = '',
}) => {
  return (
    <div
      className={`
        min-h-[500px] 
        relative 
        overflow-hidden 
        transition-all 
        duration-300 
        bg-[#FAFAFA] 
        ${containerClasses}
        ${className}
      `}
    >
      <div
        className={`
          ${transitionClasses}
          ${isTransitioning ? 'pointer-events-none' : ''}
        `}
        style={{
          animationFillMode: 'forwards',
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default AnimatedViewContainer;
