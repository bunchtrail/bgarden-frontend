import React from 'react';
import { useMapConfig, MAP_TYPES } from '../contexts/MapConfigContext';
import { useDgisMap } from '../hooks/useDgisMap';

interface MapTypeSelectorProps {
  className?: string;
  showLabels?: boolean;
  compact?: boolean;
}

/**
 * Компонент для переключения между типами карт
 * Включает проверку доступности 2ГИС
 */
const MapTypeSelector: React.FC<MapTypeSelectorProps> = ({
  className = '',
  showLabels = true,
  compact = false,
}) => {
  const { mapConfig, setMapType } = useMapConfig();
  const { isAvailable: isDgisAvailable, isLoading: isDgisLoading } = useDgisMap();

  const mapTypes = [
    {
      id: MAP_TYPES.DGIS,
      label: compact ? '2ГИС' : 'Карты 2ГИС',
      shortLabel: '2ГИС',
      description: 'Детальные карты с информацией о городах',
      available: isDgisAvailable,
      loading: isDgisLoading,
      primary: true,
    },
    {
      id: MAP_TYPES.GEO,
      label: compact ? 'OSM' : 'OpenStreetMap',
      shortLabel: 'OSM',
      description: 'Общая географическая карта',
      available: true,
      loading: false,
      primary: false,
    },
    {
      id: MAP_TYPES.SCHEMATIC,
      label: compact ? 'Схема' : 'Схематическая карта',
      shortLabel: 'Схема',
      description: 'План ботанического сада',
      available: true,
      loading: false,
      primary: false,
    },
  ];

  const handleMapTypeChange = (mapType: typeof MAP_TYPES[keyof typeof MAP_TYPES]) => {
    setMapType(mapType);
  };

  if (compact) {
    return (
      <div className={`flex space-x-1 ${className}`}>
        {mapTypes.map((type) => {
          const isActive = mapConfig.mapType === type.id;
          const isDisabled = !type.available || type.loading;

          return (
            <button
              key={type.id}
              onClick={() => handleMapTypeChange(type.id)}
              disabled={isDisabled}
              title={`${type.description}${isDisabled ? ' (недоступно)' : ''}`}
              className={`
                px-2 py-1 text-xs font-medium rounded transition-all
                ${isActive 
                  ? 'bg-blue-600 text-white' 
                  : isDisabled 
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
                ${type.primary && !isDisabled ? 'ring-2 ring-blue-200' : ''}
              `}
            >
              {type.loading ? '...' : type.shortLabel}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {showLabels && (
        <h3 className="text-sm font-medium text-gray-700">Тип карты</h3>
      )}
      
      <div className="grid grid-cols-1 gap-2">
        {mapTypes.map((type) => {
          const isActive = mapConfig.mapType === type.id;
          const isDisabled = !type.available || type.loading;

          return (
            <button
              key={type.id}
              onClick={() => handleMapTypeChange(type.id)}
              disabled={isDisabled}
              className={`
                p-3 text-left rounded-lg border-2 transition-all
                ${isActive 
                  ? 'border-blue-500 bg-blue-50 text-blue-900' 
                  : isDisabled 
                    ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                }
                ${type.primary && !isDisabled ? 'ring-2 ring-blue-100' : ''}
              `}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium">
                      {type.loading ? `${type.label} (проверка...)` : type.label}
                    </h4>
                    {type.primary && !isDisabled && (
                      <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-600 rounded-full">
                        Рекомендуемая
                      </span>
                    )}
                    {isDisabled && !type.loading && (
                      <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-500 rounded-full">
                        Недоступно
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {type.description}
                  </p>
                </div>
                
                <div className="flex-shrink-0 ml-3">
                  {isActive ? (
                    <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  ) : (
                    <div className="w-4 h-4 border-2 border-gray-300 rounded-full"></div>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
      
      {isDgisLoading && (
        <div className="text-xs text-gray-500 mt-2">
          Проверка доступности сервиса 2ГИС...
        </div>
      )}
      
      {!isDgisAvailable && !isDgisLoading && (
        <div className="text-xs text-amber-600 mt-2">
          ⚠️ Сервис 2ГИС недоступен в вашем регионе
        </div>
      )}
    </div>
  );
};

export default MapTypeSelector; 