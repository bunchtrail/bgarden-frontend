import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../modules/auth/contexts/AuthContext';

const ProfilePage: React.FC = () => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout(true);
    navigate('/login');
  };

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto'></div>
          <p className='mt-4 text-gray-600'>Загрузка профиля...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <p className='text-gray-600'>Пользователь не найден.</p>
          <button
            onClick={() => navigate('/login')}
            className='mt-4 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded'
          >
            Войти в систему
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-3xl mx-auto bg-white shadow rounded-lg overflow-hidden'>
        <div className='px-6 py-8 border-b border-gray-200'>
          <h1 className='text-3xl font-bold text-gray-900'>
            Профиль пользователя
          </h1>
        </div>

        <div className='px-6 py-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='space-y-4'>
              <div>
                <h3 className='text-sm font-medium text-gray-500'>
                  Имя пользователя
                </h3>
                <p className='mt-1 text-lg font-medium text-gray-900'>
                  {user.username}
                </p>
              </div>

              <div>
                <h3 className='text-sm font-medium text-gray-500'>Email</h3>
                <p className='mt-1 text-lg font-medium text-gray-900'>
                  {user.email}
                </p>
              </div>

              <div>
                <h3 className='text-sm font-medium text-gray-500'>
                  Полное имя
                </h3>
                <p className='mt-1 text-lg font-medium text-gray-900'>
                  {user.fullName}
                </p>
              </div>
            </div>

            <div className='space-y-4'>
              <div>
                <h3 className='text-sm font-medium text-gray-500'>Роль</h3>
                <p className='mt-1 text-lg font-medium text-gray-900'>
                  {typeof user.role === 'number'
                    ? ['Пользователь', 'Редактор', 'Администратор'][
                        user.role
                      ] || 'Пользователь'
                    : user.role}
                </p>
              </div>

              <div>
                <h3 className='text-sm font-medium text-gray-500'>Должность</h3>
                <p className='mt-1 text-lg font-medium text-gray-900'>
                  {user.position || 'Не указана'}
                </p>
              </div>

              <div>
                <h3 className='text-sm font-medium text-gray-500'>
                  Последний вход
                </h3>
                <p className='mt-1 text-lg font-medium text-gray-900'>
                  {new Date(user.lastLogin).toLocaleString('ru-RU')}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className='px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end'>
          <button
            onClick={handleLogout}
            className='bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md'
          >
            Выйти из системы
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
