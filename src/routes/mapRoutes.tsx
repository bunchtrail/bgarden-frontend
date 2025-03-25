import React from 'react';
import { RouteObject } from 'react-router-dom';
import { ProtectedRoute } from '../modules/auth/components/ProtectedRoute';
import { MainLayout } from '../modules/layouts';
import { 
  MapPage, 
  MapProvider, 
  useMapConfig, 
  MAP_LAYERS,
  MAP_MODES,
  DEFAULT_MAP_CONFIG,
  UnifiedControlPanel
} from '../modules/map';
import { buttonClasses } from '../styles/global-styles';
import { Switch } from '../modules/ui/components/Form';
import { PanelSection } from '../modules/map/components/control-panel';

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
              extraControls={<UnifiedControlPanel pageType="map" />}
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
            <MapPage 
              showControls={true}
              extraControls={
                <UnifiedControlPanel 
                  pageType="sector" 
                  config={{
                    mode: 'geography',
                    visibleSections: [
                      PanelSection.LAYERS,
                      PanelSection.SETTINGS
                    ]
                  }}
                />
              }
            />
          </MapProvider>
        </MainLayout>
      </ProtectedRoute>
    ),
  },
]; 