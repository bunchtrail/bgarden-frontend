import { Box, Button, Typography } from '@mui/material';
import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
}) => {
  const { isAuthenticated, user, loading, error } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated || !user) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '50vh',
          padding: 3,
        }}
      >
        <Typography variant='h5' gutterBottom>
          Требуется авторизация
        </Typography>
        <Typography variant='body1' color='text.secondary' gutterBottom>
          {error || 'Для доступа к этой странице необходимо войти в систему.'}
        </Typography>
        <Button component={Link} to='/login' variant='contained' sx={{ mt: 2 }}>
          Перейти на страницу входа
        </Button>
      </Box>
    );
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to='/' />;
  }

  return <>{children}</>;
};
