import React from 'react';
import { RouteObject } from 'react-router-dom';
import { ProtectedRoute } from '../modules/auth/components/ProtectedRoute';
import { MainLayout } from '../modules/layouts';
import { 
  MapPage, 
  MapProvider, 
  useMapConfig, 
  MAP_LAYERS, 
  DEFAULT_MAP_CONFIG 
} from '../modules/map';
import { buttonClasses } from '../styles/global-styles';
import { Switch } from '../modules/ui/components/Form';

// Компонент для панели управления как отдельный компонент
// Он будет использоваться внутри MapPage, где доступен контекст MapConfigProvider
const MapExtraControls = () => {
  const { mapConfig, toggleLayer, updateMapConfig } = useMapConfig();
  
  const handleToggleLayer = (layerName: string) => {
    toggleLayer(layerName);
  };
  
  const handleToggleClustering = () => {
    updateMapConfig({ enableClustering: !mapConfig.enableClustering });
  };
  
  const handleResetConfig = () => {
    updateMapConfig(DEFAULT_MAP_CONFIG);
  };
  
  return (
    <div className="p-3">
      <h3 className="font-medium mb-3 text-center">Управление картой</h3>
      
      <div className="space-y-3">
        <div className="border-b pb-2">
          <h4 className="text-sm font-medium mb-2">Слои</h4>
          <div className="space-y-2">
            <Switch 
              label="Области"
              checked={mapConfig.visibleLayers.includes(MAP_LAYERS.REGIONS)}
              onChange={() => handleToggleLayer(MAP_LAYERS.REGIONS)}
            />
            <Switch 
              label="Растения"
              checked={mapConfig.visibleLayers.includes(MAP_LAYERS.PLANTS)}
              onChange={() => handleToggleLayer(MAP_LAYERS.PLANTS)}
            />
            <Switch 
              label="Изображение карты"
              checked={mapConfig.visibleLayers.includes(MAP_LAYERS.IMAGERY)}
              onChange={() => handleToggleLayer(MAP_LAYERS.IMAGERY)}
            />
          </div>
        </div>
        
        <div className="border-b pb-2">
          <h4 className="text-sm font-medium mb-2">Настройки</h4>
          <div className="space-y-2">
            <Switch 
              label="Кластеризация маркеров"
              checked={mapConfig.enableClustering}
              onChange={handleToggleClustering}
            />
          </div>
        </div>
        
        <button 
          className={`w-full px-3 py-1.5 ${buttonClasses.success} text-sm`}
          onClick={handleResetConfig}
        >
          Сбросить настройки
        </button>
      </div>
    </div>
  );
};

// Заглушка для страницы сектора карты (будет реализована позже)
const MapSectorPage = () => <div>Страница сектора карты (скоро будет реализована)</div>;

export const mapRoutes: RouteObject[] = [
  {
    path: 'map',
    element: (
      <ProtectedRoute>
        <MainLayout>
          <MapProvider>
            <MapPage 
              showControls={true}
              extraControls={<MapExtraControls />}
            />
          </MapProvider>
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: 'map/sector/:id',
    element: (
      <ProtectedRoute>
        <MainLayout>
          <MapProvider>
            <MapSectorPage />
          </MapProvider>
        </MainLayout>
      </ProtectedRoute>
    ),
  },
]; 