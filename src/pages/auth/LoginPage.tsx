import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../modules/auth/contexts/AuthContext';
import { appStyles } from '../../styles/global-styles';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const { login, error, loading, clearError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    clearError();

    // Валидация формы
    if (!username || !password) {
      setFormError('Пожалуйста, заполните все поля');
      return;
    }

    try {
      // Попытка авторизации
      const success = await login({
        username,
        password,
        UserAgent: navigator.userAgent,
        IpAddress: '127.0.0.1', // На фронте это поле можно оставить пустым, его заполнит сервер
      });

      if (success) {
        // Перенаправление на главную страницу
        navigate('/');
      }
    } catch (err) {
      // Ошибки уже обрабатываются в контексте auth
      console.error('Ошибка входа:', err);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-[#F5F5F7] py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8'>
        <div>
          <h2 className='mt-6 text-center text-3xl font-semibold text-[#1D1D1F] tracking-tight'>
            Вход в систему
          </h2>
          <p className='mt-2 text-center text-sm text-[#86868B]'>
            Или{' '}
            <Link
              to='/register'
              className='font-medium text-[#0A84FF] hover:text-[#0071E3] transition-colors duration-200'
            >
              зарегистрируйтесь, если у вас нет аккаунта
            </Link>
          </p>
        </div>

        {/* Форма входа */}
        <form className='mt-8 space-y-6' onSubmit={handleSubmit}>
          <div className={`${appStyles.card.base} ${appStyles.card.body} py-8`}>
            <div className='space-y-4'>
              <div>
                <label htmlFor='username' className={appStyles.form.label}>
                  Имя пользователя
                </label>
                <input
                  id='username'
                  name='username'
                  type='text'
                  autoComplete='username'
                  required
                  className={appStyles.form.input}
                  placeholder='Введите имя пользователя'
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor='password' className={appStyles.form.label}>
                  Пароль
                </label>
                <input
                  id='password'
                  name='password'
                  type='password'
                  autoComplete='current-password'
                  required
                  className={appStyles.form.input}
                  placeholder='Введите пароль'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {(error || formError) && (
              <div className={appStyles.form.error}>
                {formError || error}
              </div>
            )}

            <div className='mt-6'>
              <button
                type='submit'
                disabled={loading}
                className={`${appStyles.button.base} ${appStyles.button.primary} w-full ${
                  loading ? appStyles.button.disabled : ''
                }`}
              >
                {loading ? 'Вход...' : 'Войти'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
