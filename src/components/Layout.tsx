import {
  AppBar,
  Box,
  Button,
  Container,
  Toolbar,
  Typography,
} from '@mui/material';
import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../modules/auth';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position='static'>
        <Toolbar>
          <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
            <RouterLink
              to='/'
              style={{ color: 'white', textDecoration: 'none' }}
            >
              Ботанический сад
            </RouterLink>
          </Typography>

          {isAuthenticated ? (
            <>
              <Button color='inherit' component={RouterLink} to='/profile'>
                Профиль
              </Button>
              <Button color='inherit' onClick={handleLogout}>
                Выйти
              </Button>
            </>
          ) : (
            <>
              <Button color='inherit' component={RouterLink} to='/login'>
                Вход
              </Button>
              <Button color='inherit' component={RouterLink} to='/register'>
                Регистрация
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Container component='main' sx={{ flexGrow: 1, py: 3 }}>
        {children}
      </Container>

      <Box
        component='footer'
        sx={{ py: 3, bgcolor: 'background.paper', textAlign: 'center' }}
      >
        <Typography variant='body2' color='text.secondary'>
          © {new Date().getFullYear()} Ботанический сад
        </Typography>
      </Box>
    </Box>
  );
};

export default Layout;
