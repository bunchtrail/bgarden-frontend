import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../modules/auth/contexts/AuthContext';
import { useNotifications } from '../../modules/notifications';
import { 
  COLORS,
  cardClasses,
  textClasses,
  buttonClasses,
  layoutClasses,
  animationClasses,
  chipClasses
} from '../../styles/global-styles';

const ProfilePage: React.FC = () => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const { showSuccess } = useNotifications();

  const handleLogout = async () => {
    await logout(true);
    navigate('/login');
  };

  const handleEditProfile = () => {
    // В будущем здесь будет реализация редактирования профиля
    showSuccess('Функция будет доступна в ближайшем обновлении');
  };

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0A84FF] mx-auto'></div>
          <p className='mt-4 text-[#86868B]'>Загрузка профиля...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className={`${cardClasses.base} ${animationClasses.fadeIn} p-8 max-w-md w-full text-center`}>
          <div className='mb-4'>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-[#86868B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m0 0v2m0-2h2m-2 0H9m3-10a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.982 21c.522 0 .987-.5 1.018-1.027a10.01 10.01 0 00-4.968-9.475m-3.02 9.503A10.039 10.039 0 018.438 12C8.1 10.447 7.276 9.063 6.135 8H5a2 2 0 00-2 2v1a2 2 0 002 2h2.649c.218.46.478.892.774 1.294" />
            </svg>
          </div>
          <p className={`${textClasses.body} ${textClasses.secondary} mb-6`}>Пользователь не найден или срок сессии истёк.</p>
          <button
            onClick={() => navigate('/login')}
            className={`${buttonClasses.base} ${buttonClasses.primary}`}
          >
            Войти в систему
          </button>
        </div>
      </div>
    );
  }

  // Получаем роль в виде строки
  const userRole = typeof user.role === 'number'
    ? ['Пользователь', 'Редактор', 'Администратор'][user.role] || 'Пользователь'
    : user.role;

  // Определяем цвет чипа роли
  const getRoleColor = () => {
    if (userRole === 'Администратор') return 'bg-[#FFE5E5] text-[#FF3B30]';
    if (userRole === 'Редактор') return 'bg-[#E1F0FF] text-[#0A84FF]';
    return 'bg-[#E2F9EB] text-[#30D158]';
  };

  return (
    <div className='min-h-screen py-12 px-4 sm:px-6 lg:px-8'>
      <div className={`max-w-4xl mx-auto ${cardClasses.base} ${animationClasses.transition} shadow-sm overflow-visible`}>
        {/* Верхняя часть профиля с аватаром */}
        <div className='relative'>
          {/* Фоновый баннер */}
          <div className='h-48 bg-gradient-to-r from-[#0A84FF] via-[#0071E3] to-[#30D158] rounded-t-2xl relative overflow-hidden'>
            {/* Декоративные элементы */}
            <div className="absolute top-0 left-0 right-0 bottom-0 opacity-10">
              <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-white"></div>
              <div className="absolute bottom-5 right-20 w-32 h-32 rounded-full bg-white"></div>
              <div className="absolute top-20 right-40 w-16 h-16 rounded-full bg-white"></div>
            </div>
          </div>
          
          {/* Аватар и информация о пользователе */}
          <div className='px-6 -mt-20 flex flex-col sm:flex-row items-center sm:items-end sm:justify-between pb-6'>
            <div className='flex flex-col items-center sm:items-start sm:flex-row sm:space-x-5'>
              {/* Аватар пользователя */}
              <div className='bg-white rounded-full p-1.5 shadow-md mb-3 sm:mb-0 ring-4 ring-white'>
                <div className='w-28 h-28 rounded-full bg-[#F2F7FF] flex items-center justify-center text-[#0A84FF] text-4xl font-semibold 
                     transition-all duration-300 hover:scale-105 cursor-pointer'>
                  {user.fullName ? user.fullName.charAt(0).toUpperCase() : user.username.charAt(0).toUpperCase()}
                </div>
              </div>
              
              {/* Основная информация */}
              <div className='text-center sm:text-left pt-2'>
                <h1 className={`${textClasses.heading} !text-2xl`}>{user.fullName || user.username}</h1>
                <p className={`${textClasses.body} ${textClasses.secondary}`}>{user.email}</p>
                
                {/* Бэйдж с ролью */}
                <div className='mt-3 flex items-center flex-wrap gap-2'>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRoleColor()}`}>
                    {userRole}
                  </span>
                  {user.position && (
                    <span className={`${chipClasses.base} ${chipClasses.neutral}`}>
                      {user.position}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Кнопка редактирования профиля */}
            <div className='mt-4 sm:mt-0'>
              <button 
                onClick={handleEditProfile}
                className={`${buttonClasses.base} ${buttonClasses.secondary} flex items-center ${animationClasses.springHover}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Редактировать
              </button>
            </div>
          </div>
        </div>
        
        {/* Информационные секции */}
        <div className='px-6 py-6 border-t border-[#E5E5EA]'>
          {/* Статистика */}
          <div className='grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8'>
            <div className='bg-[#F5F5F7] p-4 rounded-xl border border-[#E5E5EA] transition-all duration-300 hover:shadow-sm hover:bg-white cursor-pointer'>
              <p className={`${textClasses.tertiary} text-xs`}>Активность</p>
              <p className='text-xl font-bold text-[#1D1D1F] mt-1'>Высокая</p>
            </div>
            <div className='bg-[#F5F5F7] p-4 rounded-xl border border-[#E5E5EA] transition-all duration-300 hover:shadow-sm hover:bg-white cursor-pointer'>
              <p className={`${textClasses.tertiary} text-xs`}>Записи</p>
              <p className='text-xl font-bold text-[#1D1D1F] mt-1'>{7 + (user.role || 0) * 5}</p>
            </div>
            <div className='bg-[#F5F5F7] p-4 rounded-xl border border-[#E5E5EA] transition-all duration-300 hover:shadow-sm hover:bg-white cursor-pointer'>
              <p className={`${textClasses.tertiary} text-xs`}>Отчёты</p>
              <p className='text-xl font-bold text-[#1D1D1F] mt-1'>{(user.role || 0) * 3}</p>
            </div>
            <div className='bg-[#F5F5F7] p-4 rounded-xl border border-[#E5E5EA] transition-all duration-300 hover:shadow-sm hover:bg-white cursor-pointer'>
              <p className={`${textClasses.tertiary} text-xs`}>Дней в системе</p>
              <p className='text-xl font-bold text-[#1D1D1F] mt-1'>27</p>
            </div>
          </div>

          <div className={`${layoutClasses.gridSm2} gap-8`}>
            {/* Основная информация */}
            <div className={`${cardClasses.base} p-5 hover:shadow-sm transition-all duration-300 border-[#E5E5EA]`}>
              <h2 className={`${textClasses.subheading} mb-4 flex items-center`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#0A84FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Основная информация
              </h2>
              
              <div className='space-y-4'>
                <div className='p-3 rounded-lg bg-[#F5F5F7]'>
                  <h3 className={`text-sm font-medium ${textClasses.tertiary}`}>
                    Имя пользователя
                  </h3>
                  <p className='mt-1 text-base font-medium text-[#1D1D1F]'>
                    {user.username}
                  </p>
                </div>

                <div className='p-3 rounded-lg bg-[#F5F5F7]'>
                  <h3 className={`text-sm font-medium ${textClasses.tertiary}`}>
                    Email
                  </h3>
                  <p className='mt-1 text-base font-medium text-[#1D1D1F]'>
                    {user.email}
                  </p>
                </div>

                <div className='p-3 rounded-lg bg-[#F5F5F7]'>
                  <h3 className={`text-sm font-medium ${textClasses.tertiary}`}>
                    Полное имя
                  </h3>
                  <p className='mt-1 text-base font-medium text-[#1D1D1F]'>
                    {user.fullName || 'Не указано'}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Дополнительная информация */}
            <div className={`${cardClasses.base} p-5 hover:shadow-sm transition-all duration-300 border-[#E5E5EA]`}>
              <h2 className={`${textClasses.subheading} mb-4 flex items-center`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#30D158]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Дополнительная информация
              </h2>
              
              <div className='space-y-4'>
                <div className='p-3 rounded-lg bg-[#F5F5F7]'>
                  <h3 className={`text-sm font-medium ${textClasses.tertiary}`}>
                    Должность
                  </h3>
                  <p className='mt-1 text-base font-medium text-[#1D1D1F]'>
                    {user.position || 'Не указана'}
                  </p>
                </div>

                <div className='p-3 rounded-lg bg-[#F5F5F7]'>
                  <h3 className={`text-sm font-medium ${textClasses.tertiary}`}>
                    Последний вход
                  </h3>
                  <p className='mt-1 text-base font-medium text-[#1D1D1F] flex items-center'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-[#0A84FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {new Date(user.lastLogin).toLocaleString('ru-RU')}
                  </p>
                </div>
                
                <div className='p-3 rounded-lg bg-[#F5F5F7]'>
                  <h3 className={`text-sm font-medium ${textClasses.tertiary}`}>
                    Активность
                  </h3>
                  <div className='mt-1 flex items-center'>
                    <div className='h-2.5 w-2.5 rounded-full bg-[#30D158] mr-2 animate-pulse'></div>
                    <p className='text-base font-medium text-[#1D1D1F]'>
                      Онлайн
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Нижняя часть с действиями */}
        <div className='px-6 py-5 border-t border-[#E5E5EA] flex flex-wrap gap-2 sm:gap-4 justify-end items-center'>
          <button
            onClick={() => navigate('/')}
            className={`${buttonClasses.base} ${buttonClasses.secondary} ${animationClasses.springHover}`}
          >
            <span className='flex items-center'>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              На главную
            </span>
          </button>
          <button
            onClick={handleLogout}
            className={`${buttonClasses.base} ${buttonClasses.danger} ${animationClasses.springHover}`}
          >
            <span className='flex items-center'>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Выйти из системы
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
