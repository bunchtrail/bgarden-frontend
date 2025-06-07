import React, { useEffect } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';
import { LoadingSpinner } from '../../../modules/ui';
import { containerClasses, textClasses, buttonClasses } from '@/styles/global-styles';

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
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || !user) {
      const timer = setTimeout(() => navigate('/login'), 3000);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, user, navigate]);

  if (loading) {
    return <LoadingSpinner message="Проверка доступа..." />;
  }

  if (!isAuthenticated || !user) {
    return (
      <div className={containerClasses.base}>
        <h2 className={`${textClasses.heading} mb-2`}>Требуется авторизация</h2>
        <p className={`${textClasses.body} mb-4`}>
          {error || 'Для доступа к этой странице необходимо войти. Вы будете автоматически перенаправлены.'}
        </p>
        <Link to='/login'>
          <button className={`${buttonClasses.base} ${buttonClasses.primary}`}>Перейти на страницу входа</button>
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
