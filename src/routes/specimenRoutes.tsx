import React from 'react';
import { RouteObject } from 'react-router-dom';
import SpecimenPage from '../pages/specimens/SpecimenPage';
import SpecimensListPage from '../pages/specimens/SpecimensListPage';
import { ProtectedRoute } from '../modules/auth/components/ProtectedRoute';
import { UserRole } from '../modules/specimens/types';

/**
 * Маршруты для модуля образцов растений
 */
export const specimenRoutes: RouteObject[] = [
  {
    path: '/specimens',
    element: (
      <ProtectedRoute>
        <SpecimensListPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/specimens/new',
    element: (
      <ProtectedRoute requiredRoles={[UserRole.Administrator, UserRole.Employee]}>
        <SpecimenPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/specimens/:id',
    element: (
      <ProtectedRoute>
        <SpecimenPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/specimens/:id/edit',
    element: (
      <ProtectedRoute requiredRoles={[UserRole.Administrator, UserRole.Employee]}>
        <SpecimenPage />
      </ProtectedRoute>
    ),
  },
];

export default specimenRoutes; 