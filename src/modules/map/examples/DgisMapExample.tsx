import React from 'react';
import { 
  MapPage, 
  MAP_TYPES, 
  useDgisMap, 
  useMapConfig 
} from '../index';

/**
 * Пример использования карты 2ГИС
 */
const DgisMapExample: React.FC = () => {
  const { mapConfig, setMapType } = useMapConfig();
  const { 
    isAvailable, 
    isLoading, 
    isDgisMapActive,
    switchToDgisMap,
    settings 
  } = useDgisMap();

  const handleSwitchToDgis = () => {
    if (isAvailable) {
      switchToDgisMap();
    } else {
      console.warn('2ГИС сервис недоступен');
    }
  };

  return (
    <div className="dgis-map-example">
      <div className="controls mb-4 p-4 bg-gray-100 rounded">
        <h3 className="text-lg font-semibold mb-2">Управление картой 2ГИС</h3>
        
        <div className="status mb-2">
          <span className="mr-2">Статус сервиса:</span>
          {isLoading ? (
            <span className="text-yellow-600">Проверка...</span>
          ) : isAvailable === true ? (
            <span className="text-green-600">Доступен</span>
          ) : isAvailable === false ? (
            <span className="text-red-600">Недоступен</span>
          ) : (
            <span className="text-gray-600">Неизвестно</span>
          )}
        </div>

        <div className="current-map mb-2">
          <span className="mr-2">Текущая карта:</span>
          <span className={`font-semibold ${
            isDgisMapActive ? 'text-blue-600' : 'text-gray-600'
          }`}>
            {mapConfig.mapType === MAP_TYPES.DGIS ? '2ГИС' : 
             mapConfig.mapType === MAP_TYPES.GEO ? 'OpenStreetMap' : 
             'Схематическая'}
          </span>
        </div>

        <div className="actions">
          <button
            onClick={handleSwitchToDgis}
            disabled={!isAvailable || isDgisMapActive}
            className={`px-4 py-2 rounded mr-2 ${
              !isAvailable || isDgisMapActive
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            Переключить на 2ГИС
          </button>

          <button
            onClick={() => setMapType(MAP_TYPES.GEO)}
            disabled={mapConfig.mapType === MAP_TYPES.GEO}
            className={`px-4 py-2 rounded mr-2 ${
              mapConfig.mapType === MAP_TYPES.GEO
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-green-500 text-white hover:bg-green-600'
            }`}
          >
            OpenStreetMap
          </button>

          <button
            onClick={() => setMapType(MAP_TYPES.SCHEMATIC)}
            disabled={mapConfig.mapType === MAP_TYPES.SCHEMATIC}
            className={`px-4 py-2 rounded ${
              mapConfig.mapType === MAP_TYPES.SCHEMATIC
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-purple-500 text-white hover:bg-purple-600'
            }`}
          >
            Схематическая
          </button>
        </div>

        {isDgisMapActive && (
          <div className="dgis-settings mt-4 p-3 bg-blue-50 rounded">
            <h4 className="font-semibold mb-2">Настройки 2ГИС:</h4>
            <div className="text-sm">
              <div>Центр: {JSON.stringify(settings.center)}</div>
              <div>Масштаб: {settings.zoom}</div>
              <div>Мин. масштаб: {settings.minZoom}</div>
              <div>Макс. масштаб: {settings.maxZoom}</div>
              <div>Поддомены: {settings.subdomains.join(', ')}</div>
            </div>
          </div>
        )}
      </div>

      <div className="map-container" style={{ height: '500px', borderRadius: '8px' }}>
        <MapPage />
      </div>
    </div>
  );
};

export default DgisMapExample; 