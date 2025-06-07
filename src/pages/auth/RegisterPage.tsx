import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../modules/auth/contexts/AuthContext';
import { appStyles } from '../../styles/global-styles';
import { useNotification } from '../../modules/notifications';

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [formError, setFormError] = useState('');

  const { register, error, loading, clearError } = useAuth();
  const navigate = useNavigate();
  const notification = useNotification();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    clearError();

    // Валидация формы
    if (!username || !password || !confirmPassword || !firstName || !lastName || !email) {
      setFormError('Пожалуйста, заполните все обязательные поля');
      notification.warning('Пожалуйста, заполните все обязательные поля');
      return;
    }

    if (password !== confirmPassword) {
      setFormError('Пароли не совпадают');
      notification.warning('Пароли не совпадают');
      return;
    }

    if (password.length < 6) {
      setFormError('Пароль должен содержать не менее 6 символов');
      notification.warning('Пароль должен содержать не менее 6 символов');
      return;
    }

    try {
      // Попытка регистрации
      const success = await register({
        username,
        email,
        password,
        confirmPassword,
        firstName,
        lastName,
        UserAgent: navigator.userAgent,
      });

      if (success) {
        notification.success('Регистрация успешно завершена');
        navigate('/');
      }
    } catch (err) {
      // Ошибки обрабатываются в AuthContext
      notification.error(error || 'Ошибка при регистрации');
    }
  };

  return (
    <div className='flex items-center justify-center min-h-screen'>
      <div className='w-full max-w-xl px-4 sm:px-6 lg:px-8 mx-auto'>
        <div className='space-y-4 animate-fadeIn'>
          <div className='text-center space-y-2'>
            <h1 className='text-2xl sm:text-3xl font-bold text-[#1D1D1F] tracking-tight transition-all duration-300 hover:scale-105'>
              Регистрация
            </h1>
            <p className='text-center text-xs sm:text-sm text-[#86868B]'>
              Уже есть аккаунт?{' '}
              <Link
                to='/login'
                className='font-medium text-[#0A84FF] hover:text-[#0071E3] transition-colors duration-300 hover:underline'
              >
                Войдите в систему
              </Link>
            </p>
          </div>

          <form 
            className='mt-4 space-y-4' 
            onSubmit={handleSubmit}
            noValidate
          >
            <div className='bg-white/80 backdrop-blur-lg rounded-2xl border border-[#E5E5EA]/80 p-4 sm:p-5 shadow-lg transition-all duration-300 hover:shadow-xl space-y-4'>
              <div className='space-y-3 md:space-y-4'>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4'>
                  <div className='group transition-all duration-200'>
                    <label 
                      htmlFor='firstName' 
                      className='block text-xs font-medium text-gray-700 mb-1 group-hover:text-[#0A84FF] transition-colors duration-200'
                    >
                      Имя
                    </label>
                    <input
                      id='firstName'
                      name='firstName'
                      type='text'
                      required
                      className='block w-full px-3 py-2 rounded-lg border border-[#E5E5EA] bg-white/50 
                               placeholder-[#AEAEB2] transition-all duration-200
                               focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent
                               hover:border-[#0A84FF] hover:shadow-sm
                               group-hover:border-[#0A84FF] text-sm'
                      placeholder='Введите имя'
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                  <div className='group transition-all duration-200'>
                    <label 
                      htmlFor='lastName' 
                      className='block text-xs font-medium text-gray-700 mb-1 group-hover:text-[#0A84FF] transition-colors duration-200'
                    >
                      Фамилия
                    </label>
                    <input
                      id='lastName'
                      name='lastName'
                      type='text'
                      required
                      className='block w-full px-3 py-2 rounded-lg border border-[#E5E5EA] bg-white/50 
                               placeholder-[#AEAEB2] transition-all duration-200
                               focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent
                               hover:border-[#0A84FF] hover:shadow-sm
                               group-hover:border-[#0A84FF] text-sm'
                      placeholder='Введите фамилию'
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                </div>

                <div className='group transition-all duration-200'>
                  <label 
                    htmlFor='username' 
                    className='block text-xs font-medium text-gray-700 mb-1 group-hover:text-[#0A84FF] transition-colors duration-200'
                  >
                    Имя пользователя
                  </label>
                  <input
                    id='username'
                    name='username'
                    type='text'
                    autoComplete='username'
                    required
                    className='block w-full px-3 py-2 rounded-lg border border-[#E5E5EA] bg-white/50 
                             placeholder-[#AEAEB2] transition-all duration-200
                             focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent
                             hover:border-[#0A84FF] hover:shadow-sm
                             group-hover:border-[#0A84FF] text-sm'
                    placeholder='Введите имя пользователя'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>

                <div className='group transition-all duration-200'>
                  <label 
                    htmlFor='email' 
                    className='block text-xs font-medium text-gray-700 mb-1 group-hover:text-[#0A84FF] transition-colors duration-200'
                  >
                    Email
                  </label>
                  <input
                    id='email'
                    name='email'
                    type='email'
                    autoComplete='email'
                    required
                    className='block w-full px-3 py-2 rounded-lg border border-[#E5E5EA] bg-white/50 
                             placeholder-[#AEAEB2] transition-all duration-200
                             focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent
                             hover:border-[#0A84FF] hover:shadow-sm
                             group-hover:border-[#0A84FF] text-sm'
                    placeholder='Введите email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className='group transition-all duration-200'>
                  <label 
                    htmlFor='password' 
                    className='block text-xs font-medium text-gray-700 mb-1 group-hover:text-[#0A84FF] transition-colors duration-200'
                  >
                    Пароль
                  </label>
                  <input
                    id='password'
                    name='password'
                    type='password'
                    autoComplete='new-password'
                    required
                    className='block w-full px-3 py-2 rounded-lg border border-[#E5E5EA] bg-white/50 
                             placeholder-[#AEAEB2] transition-all duration-200
                             focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent
                             hover:border-[#0A84FF] hover:shadow-sm
                             group-hover:border-[#0A84FF] text-sm'
                    placeholder='Введите пароль'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <div className='group transition-all duration-200'>
                  <label 
                    htmlFor='confirmPassword' 
                    className='block text-xs font-medium text-gray-700 mb-1 group-hover:text-[#0A84FF] transition-colors duration-200'
                  >
                    Подтверждение пароля
                  </label>
                  <input
                    id='confirmPassword'
                    name='confirmPassword'
                    type='password'
                    autoComplete='new-password'
                    required
                    className='block w-full px-3 py-2 rounded-lg border border-[#E5E5EA] bg-white/50 
                             placeholder-[#AEAEB2] transition-all duration-200
                             focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent
                             hover:border-[#0A84FF] hover:shadow-sm
                             group-hover:border-[#0A84FF] text-sm'
                    placeholder='Повторите пароль'
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>

              {(error || formError) && (
                <div className='animate-shake text-[#FF3B30] text-xs mt-3 py-2 px-3 bg-[#FFE5E5]/50 rounded-lg border border-[#FF3B30]/20'>
                  {formError || error}
                </div>
              )}

              <div className='pt-2 md:pt-3'>
                <button
                  type='submit'
                  disabled={loading}
                  className='w-full py-2 px-4 rounded-lg text-white text-sm sm:text-base font-medium
                           bg-gradient-to-r from-[#0A84FF] to-[#0071E3]
                           transition-all duration-300 transform
                           hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]
                           disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100'
                >
                  {loading ? (
                    <span className='flex items-center justify-center'>
                      <svg className='animate-spin -ml-1 mr-2 h-4 w-4 text-white' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                        <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                        <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                      </svg>
                      Регистрация...
                    </span>
                  ) : 'Зарегистрироваться'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
