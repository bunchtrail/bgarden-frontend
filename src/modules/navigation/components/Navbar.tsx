import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useNavigation } from '../hooks';
import { NavConfig, NavItem } from '../types';
import { defaultNavConfig } from './configs/defaultNavConfig';
import { CloseIcon, MenuIcon } from './icons';
import { NavbarItem } from './NavbarItem';
import { buttonClasses, layoutClasses, COLORS } from '../../../styles/global-styles';

interface NavbarProps {
  config?: NavConfig;
  className?: string;
}

// Стили для навигации, специфичные для компонента
const navStyles = {
  // Контейнер и основная структура - использование глобальных стилей
  container: 'w-full bg-white shadow-sm z-10 fixed top-0 left-0 right-0',
  innerContainer: `${layoutClasses.container} mx-auto px-4 sm:px-6 lg:px-8`,
  flexWrapper: 'flex justify-between items-center py-3',
  
  // Логотип и брендинг
  logoContainer: 'flex items-center',
  logo: 'flex items-center text-[#1D1D1F] hover:opacity-90 transition-opacity',
  logoImage: 'h-8 w-auto',
  logoText: 'ml-2 text-lg font-medium',
  
  // Навигационные элементы для desktop
  desktopNav: 'hidden md:flex items-center space-x-6',
  desktopLink: 'text-[#1D1D1F] hover:text-[#0A84FF] transition-colors duration-200 text-sm font-medium',
  desktopActiveLink: 'text-[#0A84FF] font-semibold',
  
  // Мобильное меню
  mobileMenuBtn: 'flex items-center md:hidden',
  menuButton: 'inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none',
  mobileMenu: 'md:hidden bg-white shadow-lg fixed inset-x-0 top-14 z-50 transform transition-transform duration-300 ease-in-out',
  mobileMenuInner: 'px-4 pt-2 pb-3 space-y-1',
  mobileLink: 'block px-4 py-2.5 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-200 text-sm font-medium',
  mobileActiveLink: 'bg-gray-50 text-[#0A84FF] font-semibold',
  
  // Кнопки авторизации из глобальных стилей
  authButton: `${buttonClasses.base} ${buttonClasses.primary}`,
  mobileAuthButton: `block w-full text-left px-4 py-2.5 rounded-md hover:bg-gray-50 transition-colors duration-200 text-sm font-medium ${buttonClasses.neutral}`,
};

export const Navbar: React.FC<NavbarProps> = ({
  config = defaultNavConfig,
  className = '',
}) => {
  const {
    isMenuOpen,
    toggleMenu,
    closeMenu,
    user,
    filteredItems,
    isItemActive,
  } = useNavigation(config.items);

  const renderAuthButton = useCallback(
    (isMobile = false) => {
      const btnClasses = isMobile
        ? navStyles.mobileAuthButton
        : navStyles.authButton;

      // Если пользователь авторизован, не показываем кнопку входа/профиля
      // т.к. пункт профиля уже есть в конфигурации меню
      if (user) {
        return null;
      }

      return (
        <Link
          to='/login'
          className={btnClasses}
          onClick={isMobile ? closeMenu : undefined}
        >
          Войти
        </Link>
      );
    },
    [user, closeMenu]
  );

  return (
    <nav
      className={`${navStyles.container} ${className}`}
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
      }}
    >
      <div className={navStyles.innerContainer}>
        <div className={navStyles.flexWrapper}>
          <div className={navStyles.logoContainer}>
            <Link to={config.logo.path} className={navStyles.logo}>
              <img
                className={navStyles.logoImage}
                src={config.logo.imageSrc}
                alt={config.logo.title}
              />
              <span className={navStyles.logoText}>{config.logo.title}</span>
            </Link>
          </div>

          {/* Desktop навигация */}
          <div className={navStyles.desktopNav}>
            {filteredItems.map((item) => (
              <NavbarItem
                key={item.id}
                item={item}
                onItemClick={closeMenu}
                isActive={isItemActive(item)}
              />
            ))}

            {renderAuthButton()}
          </div>

          {/* Кнопка мобильного меню */}
          <div className={navStyles.mobileMenuBtn}>
            <button
              onClick={toggleMenu}
              className={navStyles.menuButton}
              aria-label={isMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
            >
              {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </div>

      {/* Мобильное меню */}
      {isMenuOpen && (
        <div className={navStyles.mobileMenu}>
          {filteredItems.map((item) => (
            <NavbarItem
              key={item.id}
              item={item}
              isMobile
              onItemClick={closeMenu}
              isActive={isItemActive(item)}
            />
          ))}

          {renderAuthButton(true)}
        </div>
      )}
    </nav>
  );
};
