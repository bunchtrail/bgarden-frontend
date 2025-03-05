import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../modules/auth';
import { Button } from './ui';

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
    <div className='flex flex-col min-h-screen'>
      <header className='sticky top-0 z-10 bg-white/80 dark:bg-black/70 backdrop-blur-md border-b border-gray-100 dark:border-gray-800'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center h-16'>
            <h1 className='text-lg font-semibold tracking-tight text-secondary-dark dark:text-secondary-light'>
              <RouterLink to='/' className='text-inherit no-underline'>
                Ботанический сад
              </RouterLink>
            </h1>

            <div className='flex items-center gap-2'>
              {isAuthenticated ? (
                <>
                  <Button
                    variant='text'
                    color='primary'
                    onClick={() => navigate('/profile')}
                    className='whitespace-nowrap'
                  >
                    Профиль
                  </Button>
                  <Button
                    variant='text'
                    color='primary'
                    onClick={() => navigate('/tailwind-test')}
                    className='whitespace-nowrap'
                  >
                    Tailwind Тест
                  </Button>
                  <Button
                    variant='text'
                    color='primary'
                    onClick={handleLogout}
                    className='whitespace-nowrap'
                  >
                    Выйти
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant='text'
                    color='primary'
                    onClick={() => navigate('/tailwind-test')}
                    className='whitespace-nowrap'
                  >
                    Tailwind Тест
                  </Button>
                  <Button
                    variant='outlined'
                    color='primary'
                    onClick={() => navigate('/login')}
                    className='whitespace-nowrap'
                  >
                    Вход
                  </Button>
                  <Button
                    variant='filled'
                    color='primary'
                    onClick={() => navigate('/register')}
                    className='whitespace-nowrap'
                  >
                    Регистрация
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className='flex-grow'>{children}</main>

      <footer className='py-4 text-center border-t border-gray-100 bg-gray-50 dark:bg-black dark:border-gray-800'>
        <div className='container mx-auto px-4'>
          <p className='text-sm text-gray-500 dark:text-gray-400'>
            © {new Date().getFullYear()} Ботанический сад
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
