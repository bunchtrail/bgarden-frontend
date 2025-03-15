import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';
import { LoadingSpinner } from '../../../modules/ui';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: UserRole | UserRole[];
  redirectPath?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRoles,
  redirectPath = '/'
}) => {
  const { isAuthenticated, user, loading, error } = useAuth();

  if (loading) {
    return <LoadingSpinner message="Проверка авторизации..." />;
  }

  if (!isAuthenticated || !user) {
    return (
      <div className='flex flex-col items-center justify-center min-h-[50vh] p-4'>
        <h2 className='text-xl font-semibold mb-2'>Требуется авторизация</h2>
        <p className='text-gray-600 mb-4'>
          {error || 'Для доступа к этой странице необходимо войти в систему.'}
        </p>
        <Link to='/login'>
          <button className='bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mt-2'>
            Перейти на страницу входа
          </button>
        </Link>
      </div>
    );
  }

  if (!requiredRoles) {
    return <>{children}</>;
  }

  const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];

  if (user.role === UserRole.Administrator) {
    return <>{children}</>;
  }

  if (user.role === UserRole.Employee && roles.includes(UserRole.Client)) {
    return <>{children}</>;
  }

  if (roles.includes(user.role)) {
    return <>{children}</>;
  }

  return <Navigate to={redirectPath} />;
};
