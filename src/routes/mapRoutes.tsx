import React from 'react';
import { RouteObject } from 'react-router-dom';
import { ProtectedRoute } from '../modules/auth/components/ProtectedRoute';
import { MainLayout } from '../modules/layouts';
import { MapPage, UnifiedControlPanel } from '../modules/map';

// Заглушка для страницы сектора карты (будет реализована позже)
const MapSectorPage = () => <div>Страница сектора карты (скоро будет реализована)</div>;

export const mapRoutes: RouteObject[] = [
  {
    path: 'map',
    element: (
      <ProtectedRoute>
        <MainLayout>
          <MapPage
            showControls={true}
            extraControls={<UnifiedControlPanel pageType="map" />}
          />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: 'map/sector/:id',
    element: (
      <ProtectedRoute>
        <MainLayout>
          <MapPage
            showControls={true}
            extraControls={<UnifiedControlPanel pageType="sector" />}
          />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
]; 