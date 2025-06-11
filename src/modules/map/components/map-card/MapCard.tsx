import React from 'react';
import { Card, LoadingSpinner } from '@/modules/ui';
import { MAP_STYLES } from '../../styles';
import { MapCardProps } from '../../types/mapTypes';

/**
 * Компонент карточки карты отвечает за отображение карты в контейнере карточки
 */
const MapCard: React.FC<MapCardProps> = ({ title, loading = false, children }) => {
  return (
    <Card 
      title={title}
      headerAction={loading && <LoadingSpinner size="small" message="" />}
      variant="elevated"
      className="h-full flex flex-col"
      contentClassName="p-0 flex-1"
    >
      <div className={MAP_STYLES.mapContent}>
        {children}
      </div>
    </Card>
  );
};

export default MapCard; 