import React from 'react';
import { RouteObject } from 'react-router-dom';
import { ProtectedRoute } from '../modules/auth/components/ProtectedRoute';
import { MainLayout } from '../modules/layouts';

// Здесь нужно создать заглушки для страниц карты
const MapPage = () => <div>Страница карты (скоро будет реализована)</div>;
const MapSectorPage = () => <div>Страница сектора карты (скоро будет реализована)</div>;

export const mapRoutes: RouteObject[] = [
  {
    path: 'map',
    element: (
      <ProtectedRoute>
        <MainLayout>
          <MapPage />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: 'map/sector/:id',
    element: (
      <ProtectedRoute>
        <MainLayout>
          <MapSectorPage />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
]; 