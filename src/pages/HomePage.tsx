import { Box, Button, Container, Paper, Typography } from '@mui/material';
import React from 'react';
import { useAuth } from '../contexts/AuthContext';

export const HomePage: React.FC = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant='h4' gutterBottom>
            Добро пожаловать, {user?.name}!
          </Typography>
          <Typography variant='body1' paragraph>
            Ваша роль: {user?.role === 'editor' ? 'Редактор' : 'Просмотр'}
          </Typography>
          {user?.role === 'editor' && (
            <Typography variant='body1' paragraph>
              У вас есть права на редактирование контента.
            </Typography>
          )}
          <Button
            variant='contained'
            color='primary'
            onClick={handleLogout}
            sx={{ mt: 2 }}
          >
            Выйти
          </Button>
        </Paper>
      </Box>
    </Container>
  );
};
