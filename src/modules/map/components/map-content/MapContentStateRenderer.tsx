import React, { ReactNode, useEffect, useRef, useCallback } from 'react';
import { ErrorView, LoadingView } from '../map-components';
import { MAP_STYLES, MAP_COLORS } from '../../styles';
import useNotification from '../../../notifications/hooks/useNotification';

interface MapContentStateRendererProps {
  loading: boolean;
  error: Error | null;
  mapImageUrl: string | null;
  isEmpty?: boolean;
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
  isEmpty = false,
  handleRefresh,
  children
}) => {
  const { info } = useNotification();
  // Добавляем ref для отслеживания показа уведомления
  const notificationShown = useRef(false);
  
  // Мемоизируем функцию для показа уведомления, чтобы избежать лишних зависимостей
  const showEmptyMapNotification = useCallback(() => {
    if (!notificationShown.current) {
      info('Карта отображается, но на ней нет данных о растениях и областях', {
        duration: 10000, // Увеличенное время показа
        dismissible: true
      });
      notificationShown.current = true;
    }
  }, [info]);
  
  // Эффект для показа уведомления при пустой карте
  useEffect(() => {
    // Показываем уведомление только если карта пуста, не в процессе загрузки и есть изображение карты
    if (isEmpty && !loading && mapImageUrl) {
      showEmptyMapNotification();
    }
  }, [isEmpty, loading, mapImageUrl, showEmptyMapNotification]); 
  
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
  
  // Отображаем содержимое карты со всеми элементами управления,
  // даже если данные о растениях и областях отсутствуют
  return (
    <>
      {/* Всегда отображаем содержимое карты, независимо от наличия данных */}
      {children}
    </>
  );
};

export default MapContentStateRenderer; 