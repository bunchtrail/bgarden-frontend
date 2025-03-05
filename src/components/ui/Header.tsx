import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../modules/auth';
import { headerClasses } from '../../styles/global-styles';

interface HeaderProps {
  logoUrl?: string;
  title?: string;
}

const Header: React.FC<HeaderProps> = ({
  logoUrl = '/images/logo.jpg',
  title = 'Ботанический сад',
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout(true);
  };

  return (
    <header className={headerClasses.header}>
      <div className={headerClasses.container}>
        <div className={headerClasses.logoContainer}>
          <img src={logoUrl} alt='Логотип' className={headerClasses.logo} />
          <h1 className={headerClasses.title}>{title}</h1>
        </div>

        <nav className={headerClasses.nav}>
          <Link to='/' className={headerClasses.navLink}>
            Главная
          </Link>
          <Link to='/specimens' className={headerClasses.navLink}>
            Дендрология
          </Link>
          <Link to='/expositions' className={headerClasses.navLink}>
            Экспозиции
          </Link>
          {user ? (
            <>
              <Link to='/profile' className={headerClasses.navLink}>
                Профиль
              </Link>
              <button
                onClick={handleLogout}
                className={`${headerClasses.navLink} bg-transparent border-none cursor-pointer`}
              >
                Выйти
              </button>
            </>
          ) : (
            <Link to='/login' className={headerClasses.navLink}>
              Вход
            </Link>
          )}
        </nav>

        <button className={headerClasses.menuButton} onClick={toggleMenu}>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-6 w-6'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M4 6h16M4 12h16M4 18h16'
            />
          </svg>
        </button>
      </div>

      {/* Мобильное меню */}
      {isMenuOpen && (
        <div className='md:hidden py-2 px-4 bg-white'>
          <div className='flex flex-col space-y-2'>
            <Link to='/' className={headerClasses.navLink}>
              Главная
            </Link>
            <Link to='/specimens' className={headerClasses.navLink}>
              Дендрология
            </Link>
            <Link to='/expositions' className={headerClasses.navLink}>
              Экспозиции
            </Link>
            {user ? (
              <>
                <Link
                  to='/profile'
                  className={headerClasses.navLink}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Профиль
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className={`${headerClasses.navLink} bg-transparent border-none cursor-pointer text-left`}
                >
                  Выйти
                </button>
              </>
            ) : (
              <Link
                to='/login'
                className={headerClasses.navLink}
                onClick={() => setIsMenuOpen(false)}
              >
                Вход
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
