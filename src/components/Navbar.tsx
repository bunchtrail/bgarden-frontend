import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../modules/auth';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout(true);
  };

  return (
    <nav className='bg-green-700 text-white shadow-lg'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between h-16'>
          <div className='flex items-center'>
            <Link to='/' className='flex-shrink-0 flex items-center'>
              <img
                className='h-10 w-10'
                src='/logo192.png'
                alt='Ботанический сад'
              />
              <span className='ml-3 font-bold text-xl'>Ботанический сад</span>
            </Link>
          </div>

          <div className='hidden md:flex items-center space-x-4'>
            <Link
              to='/specimens'
              className='px-3 py-2 rounded-md hover:bg-green-600 transition-colors'
            >
              Каталог растений
            </Link>
            {user ? (
              <>
                <Link
                  to='/profile'
                  className='px-3 py-2 rounded-md hover:bg-green-600 transition-colors'
                >
                  Профиль
                </Link>
                <button
                  onClick={handleLogout}
                  className='px-3 py-2 rounded-md hover:bg-green-600 transition-colors'
                >
                  Выйти
                </button>
              </>
            ) : (
              <Link
                to='/login'
                className='px-3 py-2 rounded-md hover:bg-green-600 transition-colors'
              >
                Войти
              </Link>
            )}
          </div>

          <div className='md:hidden flex items-center'>
            <button
              onClick={toggleMenu}
              className='inline-flex items-center justify-center p-2 rounded-md hover:bg-green-600 focus:outline-none focus:bg-green-600 transition-colors'
            >
              <svg
                className='h-6 w-6'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M6 18L18 6M6 6l12 12'
                  />
                ) : (
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M4 6h16M4 12h16M4 18h16'
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Мобильное меню */}
      {isMenuOpen && (
        <div className='md:hidden'>
          <div className='px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-green-700'>
            <Link
              to='/specimens'
              className='block px-3 py-2 rounded-md hover:bg-green-600 transition-colors'
              onClick={() => setIsMenuOpen(false)}
            >
              Каталог растений
            </Link>
            {user ? (
              <>
                <Link
                  to='/profile'
                  className='block px-3 py-2 rounded-md hover:bg-green-600 transition-colors'
                  onClick={() => setIsMenuOpen(false)}
                >
                  Профиль
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className='block w-full text-left px-3 py-2 rounded-md hover:bg-green-600 transition-colors'
                >
                  Выйти
                </button>
              </>
            ) : (
              <Link
                to='/login'
                className='block px-3 py-2 rounded-md hover:bg-green-600 transition-colors'
                onClick={() => setIsMenuOpen(false)}
              >
                Войти
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
