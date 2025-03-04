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
      <AppBar
        position='static'
        elevation={0}
        sx={{
          bgcolor: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
          '@media (prefers-color-scheme: dark)': {
            bgcolor: 'rgba(0, 0, 0, 0.7)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          },
        }}
      >
        <Container maxWidth='xl'>
          <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
            <Typography
              variant='h6'
              component='div'
              sx={{
                fontWeight: 600,
                letterSpacing: '-0.02em',
                color: '#1d1d1f',
                '@media (prefers-color-scheme: dark)': {
                  color: '#f5f5f7',
                },
              }}
            >
              <RouterLink
                to='/'
                style={{ color: 'inherit', textDecoration: 'none' }}
              >
                Ботанический сад
              </RouterLink>
            </Typography>

            <Box sx={{ display: 'flex', gap: 2 }}>
              {isAuthenticated ? (
                <>
                  <Button
                    color='primary'
                    component={RouterLink}
                    to='/profile'
                    sx={{
                      padding: '8px 16px',
                    }}
                  >
                    Профиль
                  </Button>
                  <Button
                    color='primary'
                    onClick={handleLogout}
                    sx={{
                      padding: '8px 16px',
                    }}
                  >
                    Выйти
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    color='primary'
                    component={RouterLink}
                    to='/login'
                    sx={{
                      padding: '8px 16px',
                    }}
                  >
                    Вход
                  </Button>
                  <Button
                    color='primary'
                    component={RouterLink}
                    to='/register'
                    variant='contained'
                    sx={{
                      padding: '8px 16px',
                      boxShadow: 'none',
                    }}
                  >
                    Регистрация
                  </Button>
                </>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Box component='main' sx={{ flexGrow: 1 }}>
        {children}
      </Box>

      <Box
        component='footer'
        sx={{
          py: 4,
          textAlign: 'center',
          borderTop: '1px solid rgba(0, 0, 0, 0.05)',
          backgroundColor: '#fbfbfd',
          '@media (prefers-color-scheme: dark)': {
            backgroundColor: '#000',
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          },
        }}
      >
        <Container>
          <Typography
            variant='body2'
            sx={{
              color: '#86868b',
              '@media (prefers-color-scheme: dark)': {
                color: '#86868b',
              },
            }}
          >
            © {new Date().getFullYear()} Ботанический сад
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;
