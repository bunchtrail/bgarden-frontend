import React from 'react';
import { Card, LoadingSpinner } from '@/modules/ui';
import { MAP_STYLES } from '../../styles';
import { MapCardProps } from '../../types/mapTypes';

/**
 * Компонент карточки карты отвечает за отображение карты в контейнере карточки
 */
const MapCard: React.FC<MapCardProps> = ({
  title,
  loading = false,
  children,
  fullscreen = false,
  hideHeader = false,
  compactHeader = false,
  floatingHeader = false,
}) => {
  if (fullscreen) {
    // Полностью скрыть заголовок
    if (hideHeader) {
      return (
        <div className="flex flex-col h-full w-full overflow-hidden">
          <div className="flex-1 overflow-hidden">
            <div className={MAP_STYLES.mapContent}>{children}</div>
          </div>
        </div>
      );
    }

    // Плавающий заголовок больше не используется - название отображается в панели управления

    // Компактный заголовок
    const headerClasses = compactHeader
      ? 'flex items-center justify-between px-4 py-2 bg-white/95 backdrop-blur-lg border-b border-gray-200/40'
      : 'flex items-center justify-between px-6 py-4 bg-white/90 backdrop-blur-lg border-b border-gray-200/60 shadow-sm';

    const titleClasses = compactHeader
      ? 'text-lg font-medium text-gray-800'
      : 'text-xl font-semibold text-gray-800 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent';

    return (
      <div className="flex flex-col h-full w-full overflow-hidden">
        {/* Заголовок (обычный или компактный) */}
        <div className={headerClasses}>
          <h1 className={titleClasses}>{title}</h1>
          {loading && <LoadingSpinner size="small" message="" />}
        </div>

        {/* Полноэкранный контент карты */}
        <div className="flex-1 overflow-hidden">
          <div className={MAP_STYLES.mapContent}>{children}</div>
        </div>
      </div>
    );
  }

  return (
    <Card
      title={title}
      headerAction={loading && <LoadingSpinner size="small" message="" />}
      variant="elevated"
      className="flex flex-col flex-1"
      contentClassName="flex-1 p-0 flex"
    >
      <div className={MAP_STYLES.mapContent}>{children}</div>
    </Card>
  );
};

export default MapCard;

