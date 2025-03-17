import React from 'react';
import LoadingSpinner from '../../ui/components/LoadingSpinner';

interface SpecimensLoadingProps {
  fullScreen?: boolean;
}

/**
 * Компонент для отображения состояния загрузки образцов
 */
const SpecimensLoading: React.FC<SpecimensLoadingProps> = ({ fullScreen = true }) => {
  if (fullScreen) {
    return (
      <div className="flex justify-center items-center p-16">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white p-3 rounded-full shadow-lg">
      <LoadingSpinner size="small" />
    </div>
  );
};

export default SpecimensLoading; 