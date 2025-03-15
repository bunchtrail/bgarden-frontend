import React from 'react';
import { LoadingSpinner } from '../../../ui';
import { layoutClasses } from '../../../../styles/global-styles';

interface LoadingViewProps {
  message?: string;
}

const LoadingView: React.FC<LoadingViewProps> = ({
  message = 'Загрузка данных карты...'
}) => {
  return (
    <div className={layoutClasses.flexCenter + " py-16"}>
      <LoadingSpinner message={message} />
    </div>
  );
};

export default LoadingView; 