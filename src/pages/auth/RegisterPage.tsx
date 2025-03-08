import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../modules/auth/contexts/AuthContext';
import { appStyles } from '../../styles/global-styles';

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    clearError();

    // Валидация формы
    if (
      !username ||
      !email ||
      !password ||
      !confirmPassword ||
      !firstName ||
      !lastName
    ) {
      setFormError('Пожалуйста, заполните все поля');
      return;
    }

    if (password !== confirmPassword) {
      setFormError('Пароли не совпадают');
      return;
    }

    if (password.length < 6) {
      setFormError('Пароль должен содержать не менее 6 символов');
      return;
    }

    try {
      // Регистрация пользователя
      const success = await register({
        username,
        email,
        password,
        confirmPassword,
        firstName,
        lastName,
        UserAgent: navigator.userAgent,
        IpAddress: '127.0.0.1', // На фронте это поле можно оставить пустым, его заполнит сервер
      });

      if (success) {
        // Перенаправление на главную страницу после успешной регистрации
        navigate('/');
      }
    } catch (err) {
      // Ошибки уже обрабатываются в контексте auth
      console.error('Ошибка регистрации:', err);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-[#F5F5F7] py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8'>
        <div>
          <h2 className='mt-6 text-center text-3xl font-semibold text-[#1D1D1F] tracking-tight'>
            Регистрация
          </h2>
          <p className='mt-2 text-center text-sm text-[#86868B]'>
            Уже есть аккаунт?{' '}
            <Link
              to='/login'
              className='font-medium text-[#0A84FF] hover:text-[#0071E3] transition-colors duration-200'
            >
              Войдите в систему
            </Link>
          </p>
        </div>

        {/* Форма регистрации */}
        <form className='mt-8 space-y-6' onSubmit={handleSubmit}>
          <div className={`${appStyles.card.base} ${appStyles.card.body} py-8`}>
            <div className='space-y-5'>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label htmlFor='firstName' className={appStyles.form.label}>
                    Имя
                  </label>
                  <input
                    id='firstName'
                    name='firstName'
                    type='text'
                    required
                    className={appStyles.form.input}
                    placeholder='Введите имя'
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor='lastName' className={appStyles.form.label}>
                    Фамилия
                  </label>
                  <input
                    id='lastName'
                    name='lastName'
                    type='text'
                    required
                    className={appStyles.form.input}
                    placeholder='Введите фамилию'
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>

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
                <label htmlFor='email' className={appStyles.form.label}>
                  Email
                </label>
                <input
                  id='email'
                  name='email'
                  type='email'
                  autoComplete='email'
                  required
                  className={appStyles.form.input}
                  placeholder='Введите email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  autoComplete='new-password'
                  required
                  className={appStyles.form.input}
                  placeholder='Введите пароль'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor='confirmPassword' className={appStyles.form.label}>
                  Подтверждение пароля
                </label>
                <input
                  id='confirmPassword'
                  name='confirmPassword'
                  type='password'
                  autoComplete='new-password'
                  required
                  className={appStyles.form.input}
                  placeholder='Повторите пароль'
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            {(error || formError) && (
              <div className={`${appStyles.form.error} mt-4`}>
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
                {loading ? 'Регистрация...' : 'Зарегистрироваться'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
