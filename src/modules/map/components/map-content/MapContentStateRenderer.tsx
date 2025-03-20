import React, { ReactNode } from 'react';
import { ErrorView, LoadingView } from '../map-components';

interface MapContentStateRendererProps {
  loading: boolean;
  error: Error | null;
  mapImageUrl: string | null;
  handleRefresh: () => void;
  children: ReactNode;
}

/**
 * Компонент для отображения состояния содержимого карты
 * Отображает загрузку, ошибку или содержимое в зависимости от состояния
 */
const MapContentStateRenderer: React.FC<MapContentStateRendererProps> = ({
  loading,
  error,
  mapImageUrl,
  handleRefresh,
  children
}) => {
  // Если загрузка
  if (loading && !mapImageUrl) {
    return <LoadingView message="Загрузка карты..." />;
  }

  // Если ошибка
  if (error) {
    return <ErrorView error={error.message} onRefresh={handleRefresh} />;
  }

  // Если нет данных карты
  if (!mapImageUrl && !loading) {
    return <ErrorView error="Карта не найдена" onRefresh={handleRefresh} />;
  }

  // Отображаем содержимое карты
  return <>{children}</>;
};

export default MapContentStateRenderer; 