import {
  Box,
  Button,
  Container,
  Divider,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from '@mui/material';
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../modules/auth';

const ProfilePage: React.FC = () => {
  const { user, isAuthenticated, loading, logout } = useAuth();

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to='/login' />;
  }

  const handleLogout = async () => {
    try {
      setLoading(true);
      await logout(true);
    } catch (error) {
      console.error('Ошибка при выходе из системы:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth='md'>
      <Box mt={4} mb={4}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Box
            display='flex'
            justifyContent='space-between'
            alignItems='center'
            mb={2}
          >
            <Typography variant='h4' component='h1'>
              Профиль пользователя
            </Typography>
            <Button variant='outlined' color='primary' onClick={handleLogout}>
              Выйти
            </Button>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Box sx={{ mb: 4 }}>
            <Typography variant='h6' gutterBottom>
              Информация пользователя
            </Typography>
            <List dense>
              <ListItem>
                <ListItemText
                  primary='Имя пользователя'
                  secondary={user.username}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary='Имя'
                  secondary={`${user.firstName} ${user.lastName}`}
                />
              </ListItem>
              <ListItem>
                <ListItemText primary='Email' secondary={user.email} />
              </ListItem>
              <ListItem>
                <ListItemText primary='Роль' secondary={user.role} />
              </ListItem>
            </List>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default ProfilePage;
