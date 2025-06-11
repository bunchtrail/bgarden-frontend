import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../modules/auth/contexts/AuthContext';
import { useNotification } from '../../modules/notifications';
import {
  cardClasses,
  buttonClasses,
  chipClasses,
  textClasses,
  pageClasses,
  layoutClasses,
  animationClasses,
} from '../../styles/global-styles';

const ProfilePage: React.FC = () => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const notification = useNotification();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleEditProfile = () => {
    notification.info('Функция будет доступна в ближайшем обновлении');
  };

  if (loading) {
    return (
      <div className={`${pageClasses.fullscreen} ${pageClasses.centerContent}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0A84FF] mx-auto"></div>
          <p className="mt-4 text-[#86868B]">Загрузка профиля...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={`${pageClasses.fullscreen} ${pageClasses.centerContent}`}>
        <div className={pageClasses.containerXs}>
          <div className="p-8 w-full text-center bg-white/80 backdrop-blur-lg rounded-2xl border border-[#E5E5EA]/80 shadow-lg">
            <div className="mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mx-auto text-[#86868B]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 15v2m0 0v2m0-2h2m-2 0H9m3-10a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M17.982 21c.522 0 .987-.5 1.018-1.027a10.01 10.01 0 00-4.968-9.475m-3.02 9.503A10.039 10.039 0 018.438 12C8.1 10.447 7.276 9.063 6.135 8H5a2 2 0 00-2 2v1a2 2 0 002 2h2.649c.218.46.478.892.774 1.294"
                />
              </svg>
            </div>
            <p className="text-sm text-[#86868B] mb-6">
              Пользователь не найден или срок сессии истёк.
            </p>
            <button
              onClick={() => navigate('/login')}
              className={`${buttonClasses.base} ${buttonClasses.primary} w-full`}
            >
              Войти в систему
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Получаем роль в виде строки
  const userRole =
    typeof user.role === 'number'
      ? ['Пользователь', 'Редактор', 'Администратор'][user.role] ||
        'Пользователь'
      : user.role;

  // Определяем цвет чипа роли
  const getRoleChipClass = () => {
    if (userRole === 'Администратор') return chipClasses.danger;
    if (userRole === 'Редактор') return chipClasses.primary;
    return chipClasses.secondary;
  };

  return (
    <div className={`${pageClasses.fullscreen}`}>
      <div
        className={`${pageClasses.container} ${pageClasses.sectionCompact} overflow-y-auto`}
      >
        {/* Заголовок страницы */}
        <div className={`${layoutClasses.flexBetween} mb-8`}>
          <h1 className={`${textClasses.heading} text-2xl`}>
            Персональный профиль
          </h1>
          <span className={`${chipClasses.base} ${getRoleChipClass()}`}>
            {userRole}
          </span>
        </div>

        {/* Основная информация - карточка */}
        <div
          className={`${cardClasses.base} ${cardClasses.elevated} mb-8 ${animationClasses.transition}`}
        >
          <div className={`${cardClasses.header} border-b border-[#E5E5EA]`}>
            <h2 className={`${cardClasses.title} flex items-center`}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-[#0A84FF]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              Основная информация
            </h2>
          </div>

          <div className={`${cardClasses.content}`}>
            <div className={`${layoutClasses.grid2} gap-6`}>
              <div className="space-y-4">
                <div className="border border-[#E5E5EA] p-4 rounded-lg">
                  <h3
                    className={`${textClasses.secondary} text-sm font-medium mb-1`}
                  >
                    Имя пользователя
                  </h3>
                  <p className={`${textClasses.primary} text-base font-medium`}>
                    {user.username}
                  </p>
                </div>

                <div className="border border-[#E5E5EA] p-4 rounded-lg">
                  <h3
                    className={`${textClasses.secondary} text-sm font-medium mb-1`}
                  >
                    Email
                  </h3>
                  <p className={`${textClasses.primary} text-base font-medium`}>
                    {user.email}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="border border-[#E5E5EA] p-4 rounded-lg">
                  <h3
                    className={`${textClasses.secondary} text-sm font-medium mb-1`}
                  >
                    Полное имя
                  </h3>
                  <p className={`${textClasses.primary} text-base font-medium`}>
                    {user.fullName || 'Не указано'}
                  </p>
                </div>

                <div className="border border-[#E5E5EA] p-4 rounded-lg">
                  <h3
                    className={`${textClasses.secondary} text-sm font-medium mb-1`}
                  >
                    Дата регистрации
                  </h3>
                  <p className={`${textClasses.primary} text-base font-medium`}>
                    {new Date().toLocaleDateString() || 'Не указано'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className={`${cardClasses.footer} ${layoutClasses.flexBetween}`}>
            <button
              onClick={handleEditProfile}
              className={`${buttonClasses.base} ${buttonClasses.secondary} ${animationClasses.springHover}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1.5 inline-block"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
              Редактировать профиль
            </button>

            <button
              onClick={handleLogout}
              className={`${buttonClasses.base} ${buttonClasses.danger} ${animationClasses.springHover}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1.5 inline-block"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Выйти из системы
            </button>
          </div>
        </div>

        {/* Дополнительные действия */}
        <div className="flex justify-center md:justify-end">
          <button
            onClick={() => navigate('/')}
            className={`${buttonClasses.base} ${buttonClasses.neutral} ${animationClasses.springHover}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1.5 inline-block"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            На главную
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
