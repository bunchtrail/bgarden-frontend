import React from 'react';
import { RouteObject } from 'react-router-dom';
import { ProtectedRoute } from '../modules/auth/components/ProtectedRoute';
import { MainLayout } from '../modules/layouts';
import { MapPage, MapProvider } from '../modules/map';

// Заглушка для страницы сектора карты (будет реализована позже)
const MapSectorPage = () => <div>Страница сектора карты (скоро будет реализована)</div>;

export const mapRoutes: RouteObject[] = [
  {
    path: 'map',
    element: (
      <ProtectedRoute>
        <MainLayout>
          <MapProvider>
            <MapPage />
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