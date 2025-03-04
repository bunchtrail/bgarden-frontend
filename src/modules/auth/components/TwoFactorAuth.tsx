import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface TwoFactorAuthProps {
  onSuccess?: () => void;
}

export const TwoFactorAuth: React.FC<TwoFactorAuthProps> = ({ onSuccess }) => {
  const [code, setCode] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const { verifyTwoFactor, loading, error, temporaryUsername } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await verifyTwoFactor(code, rememberMe);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Ошибка при проверке кода:', error);
    }
  };

  return (
    <div className='two-factor-auth'>
      <h2>Двухфакторная аутентификация</h2>
      <p>
        Для продолжения входа, пожалуйста, введите код из вашего приложения
        аутентификации.
      </p>
      {temporaryUsername && <p>Пользователь: {temporaryUsername}</p>}

      {error && <div className='error-message'>{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <label htmlFor='code'>Код подтверждения</label>
          <input
            type='text'
            id='code'
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder='Введите 6-значный код'
            maxLength={6}
            required
          />
        </div>

        <div className='form-check'>
          <input
            type='checkbox'
            id='rememberMe'
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          <label htmlFor='rememberMe'>
            Запомнить это устройство на 30 дней
          </label>
        </div>

        <button type='submit' className='btn btn-primary' disabled={loading}>
          {loading ? 'Проверка...' : 'Подтвердить'}
        </button>
      </form>
    </div>
  );
};
