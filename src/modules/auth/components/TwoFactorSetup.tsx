import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { TwoFactorSetupDto } from '../types';

interface TwoFactorSetupProps {
  onSuccess?: () => void;
}

export const TwoFactorSetup: React.FC<TwoFactorSetupProps> = ({
  onSuccess,
}) => {
  const [setupData, setSetupData] = useState<TwoFactorSetupDto | null>(null);
  const [code, setCode] = useState('');
  const [success, setSuccess] = useState(false);
  const { setupTwoFactor, enableTwoFactor, disableTwoFactor, loading, error } =
    useAuth();

  useEffect(() => {
    const fetchSetupData = async () => {
      try {
        const data = await setupTwoFactor();
        setSetupData(data);
      } catch (error) {
        console.error(
          'Ошибка при получении данных двухфакторной аутентификации:',
          error
        );
      }
    };

    fetchSetupData();
  }, [setupTwoFactor]);

  const handleEnableTwoFactor = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await enableTwoFactor(code);
      if (result) {
        setSuccess(true);
        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (error) {
      console.error(
        'Ошибка при включении двухфакторной аутентификации:',
        error
      );
    }
  };

  const handleDisableTwoFactor = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await disableTwoFactor(code);
      if (result) {
        setSuccess(true);
        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (error) {
      console.error(
        'Ошибка при отключении двухфакторной аутентификации:',
        error
      );
    }
  };

  if (!setupData && loading) {
    return <div>Загрузка...</div>;
  }

  return (
    <div className='two-factor-setup'>
      <h2>Настройка двухфакторной аутентификации</h2>

      {success ? (
        <div className='success-message'>
          <p>Двухфакторная аутентификация успешно настроена!</p>
          <button
            className='btn btn-primary'
            onClick={() => onSuccess && onSuccess()}
          >
            Продолжить
          </button>
        </div>
      ) : (
        <>
          {error && <div className='error-message'>{error}</div>}

          {setupData && (
            <div className='setup-instructions'>
              <ol>
                <li>
                  <p>
                    Установите приложение аутентификации на свое устройство:
                  </p>
                  <ul>
                    <li>
                      <a
                        href='https://apps.apple.com/us/app/google-authenticator/id388497605'
                        target='_blank'
                        rel='noopener noreferrer'
                      >
                        Google Authenticator для iOS
                      </a>
                    </li>
                    <li>
                      <a
                        href='https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2'
                        target='_blank'
                        rel='noopener noreferrer'
                      >
                        Google Authenticator для Android
                      </a>
                    </li>
                    <li>
                      <a
                        href='https://apps.apple.com/us/app/microsoft-authenticator/id983156458'
                        target='_blank'
                        rel='noopener noreferrer'
                      >
                        Microsoft Authenticator для iOS
                      </a>
                    </li>
                    <li>
                      <a
                        href='https://play.google.com/store/apps/details?id=com.azure.authenticator'
                        target='_blank'
                        rel='noopener noreferrer'
                      >
                        Microsoft Authenticator для Android
                      </a>
                    </li>
                  </ul>
                </li>
                <li>
                  <p>Отсканируйте QR-код или введите ключ вручную:</p>
                  <div className='qr-code'>
                    <img
                      src={setupData.qrCodeUrl}
                      alt='QR-код для двухфакторной аутентификации'
                    />
                  </div>
                  <div className='secret-key'>
                    <p>
                      Секретный ключ: <strong>{setupData.secretKey}</strong>
                    </p>
                  </div>
                </li>
                <li>
                  <p>
                    Введите 6-значный код из приложения аутентификации для
                    подтверждения:
                  </p>
                  <form onSubmit={handleEnableTwoFactor}>
                    <div className='form-group'>
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
                    <div className='button-group'>
                      <button
                        type='submit'
                        className='btn btn-primary'
                        disabled={loading}
                      >
                        {loading
                          ? 'Проверка...'
                          : 'Включить двухфакторную аутентификацию'}
                      </button>
                      <button
                        type='button'
                        className='btn btn-outline-secondary'
                        onClick={(e) => handleDisableTwoFactor(e)}
                        disabled={loading}
                      >
                        Отключить двухфакторную аутентификацию
                      </button>
                    </div>
                  </form>
                </li>
              </ol>
            </div>
          )}
        </>
      )}
    </div>
  );
};
