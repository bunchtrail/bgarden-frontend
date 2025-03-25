import React, { ReactNode } from 'react';
import { ErrorView, LoadingView } from '../map-components';
import { MAP_STYLES, MAP_COLORS } from '../../styles';

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
      {/* Добавляем информационное сообщение если карта пуста, но не блокируем доступ к карте */}
      {isEmpty && !loading && (
        <div 
          className="absolute top-20 right-4 z-40 p-3 rounded-md shadow-md max-w-xs border border-neutral-dark/20"
          style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.9)', 
            backdropFilter: 'blur(4px)',
            animation: 'fadeIn 0.3s ease-in-out'
          }}
        >
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 mr-2" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke={MAP_COLORS.secondary}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-text-secondary">
              Карта отображается, но на ней нет данных о растениях и областях
            </p>
          </div>
        </div>
      )}
      
      {/* Всегда отображаем содержимое карты, независимо от наличия данных */}
      {children}
    </>
  );
};

export default MapContentStateRenderer; 