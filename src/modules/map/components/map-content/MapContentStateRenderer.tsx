import React, { ReactNode } from 'react';
import { LoadingView, ErrorView, EmptyMapView } from '../map-components';

interface MapContentStateRendererProps {
  loading: boolean;
  error: string | null;
  mapImageUrl: string | null;
  handleRefresh: () => void;
  children: ReactNode;
}

/**
 * Компонент для отображения различных состояний контента карты
 * (загрузка, ошибка, пустое состояние, нормальное состояние)
 */
const MapContentStateRenderer: React.FC<MapContentStateRendererProps> = ({
  loading,
  error,
  mapImageUrl,
  handleRefresh,
  children
}) => {
  // При загрузке данных показываем индикатор загрузки
  if (loading) {
    return <LoadingView />;
  }

  // Если есть ошибка, показываем компонент ошибки
  if (error) {
    return <ErrorView error={error} onRefresh={handleRefresh} />;
  }

  // Если нет URL изображения, показываем пустой компонент
  if (!mapImageUrl) {
    return <EmptyMapView onRefresh={handleRefresh} />;
  }

  // В нормальном состоянии возвращаем дочерние элементы
  return <>{children}</>;
};

export default MapContentStateRenderer; 