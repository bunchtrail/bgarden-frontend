import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useNavigation } from '../hooks';
import { NavConfig } from '../types';
import { defaultNavConfig } from './configs/defaultNavConfig';
import { CloseIcon, MenuIcon } from './icons';
import { NavbarItem } from './NavbarItem';

interface NavbarProps {
  config?: NavConfig;
  className?: string;
}

const navStyles = {
  // Минималистичный светлый фон с тонкой тенью
  container:
    'bg-white text-gray-800 border-b border-gray-200 shadow-sm backdrop-blur-sm bg-opacity-95',

  // Улучшаем отзывчивость и добавляем небольшой вертикальный отступ
  innerContainer: 'max-w-7xl mx-auto px-6 py-3 sm:px-8',

  // Оптимизируем высоту и выравнивание
  flexWrapper: 'flex justify-between items-center h-14',

  // Сохраняем базовое выравнивание
  logoContainer: 'flex items-center',

  // Утонченный логотип
  logo: 'flex-shrink-0 flex items-center',

  // Сохраняем размер, но с улучшенным качеством отображения
  logoImage: 'h-10 w-10 object-contain rounded-full',

  // Шрифт в стиле Apple - легкий, но четкий
  logoText: 'ml-3 font-medium text-lg tracking-tight',

  // Увеличиваем расстояние между элементами для большей воздушности
  desktopNav: 'hidden md:flex items-center space-x-8',

  // Улучшаем мобильную кнопку
  mobileMenuBtn: 'md:hidden flex items-center',

  // Более утонченная кнопка меню с нейтральным взаимодействием
  menuButton:
    'inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-800 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all duration-200',

  // Улучшаем мобильное меню, добавляя плавность и стеклянный эффект
  mobileMenu:
    'md:hidden px-4 pt-3 pb-4 space-y-2 bg-white bg-opacity-98 shadow-md rounded-lg',

  // Минималистичные кнопки авторизации
  authButton:
    'px-5 py-2 rounded-full bg-gray-800 text-white hover:bg-gray-700 transition-colors duration-200 text-sm font-medium',

  // Согласованные стили для мобильного вида
  mobileAuthButton:
    'block w-full text-left px-4 py-2.5 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-200 text-sm font-medium',
};

export const Navbar: React.FC<NavbarProps> = ({
  config = defaultNavConfig,
  className = '',
}) => {
  const {
    isMenuOpen,
    toggleMenu,
    closeMenu,
    handleLogout,
    user,
    filteredItems,
    isItemActive,
  } = useNavigation(config.items);

  const renderAuthButton = useCallback(
    (isMobile = false) => {
      const buttonClasses = isMobile
        ? navStyles.mobileAuthButton
        : navStyles.authButton;

      if (user) {
        return (
          <button onClick={handleLogout} className={buttonClasses}>
            Выйти
          </button>
        );
      }

      return (
        <Link
          to='/login'
          className={buttonClasses}
          onClick={isMobile ? closeMenu : undefined}
        >
          Войти
        </Link>
      );
    },
    [user, handleLogout, closeMenu]
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
