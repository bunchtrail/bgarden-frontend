import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ErrorMessage } from '../components';
import { useAuth } from '../modules/auth';
import {
  formatErrorMessage,
  getErrorAction,
  getErrorDetails,
  getErrorType,
} from '../utils';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, error, clearError, handleAuthError } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [errorDetail, setErrorDetail] = useState<string | undefined>(undefined);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (!username.trim()) {
      errors.username = 'Введите имя пользователя';
    }
    if (!password) {
      errors.password = 'Введите пароль';
    } else if (password.length < 6) {
      errors.password = 'Пароль должен содержать минимум 6 символов';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setLoginError(null);
    setErrorDetail(undefined);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Используем результат авторизации для определения необходимости перенаправления
      const loginSuccess = await login({ username, password });

      // Перенаправляем только при успешной авторизации
      if (loginSuccess) {
        navigate('/profile');
      }
    } catch (err) {
      if (!handleAuthError(err)) {
        const formattedError = formatErrorMessage(err);
        setLoginError(formattedError);
        setErrorDetail(getErrorDetails(err));
      }
      setLoading(false);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (field: string, value: string) => {
    if (field === 'username') {
      setUsername(value);
    } else if (field === 'password') {
      setPassword(value);
    }

    // Сбрасываем ошибку для поля при его изменении
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: '' }));
    }

    // Сбрасываем общие ошибки при любом изменении
    if (loginError || error) {
      setLoginError(null);
      setErrorDetail(undefined);
      clearError();
    }
  };

  // Получаем действие для ошибки
  const getActionForError = () => {
    const currentError = error || loginError;
    if (!currentError) return null;

    return getErrorAction(currentError);
  };

  // Обработчик действия для ошибки
  const handleErrorAction = () => {
    const errorType = getErrorType(error || loginError || '').type;

    if (errorType === 'network') {
      // Создаем событие с методом preventDefault
      const mockEvent = {
        preventDefault: () => {},
      };
      handleSubmit(mockEvent as React.FormEvent);
    } else if (errorType === 'auth') {
      // Очищаем поля формы и ошибки
      setUsername('');
      setPassword('');
      setLoginError(null);
      setErrorDetail(undefined);
      clearError();
    }
  };

  const combinedError = error || loginError;
  const actionText = getActionForError();

  return (
    <Container maxWidth='sm'>
      <Box mt={8} display='flex' flexDirection='column' alignItems='center'>
        <Paper
          elevation={3}
          sx={{
            padding: 3,
            width: '100%',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
          }}
        >
          <Typography
            component='h1'
            variant='h5'
            align='center'
            gutterBottom
            sx={{ fontWeight: 600, mb: 3 }}
          >
            Вход в систему
          </Typography>

          <ErrorMessage
            message={combinedError}
            detail={errorDetail}
            severity={
              combinedError
                ? getErrorType(combinedError).type === 'auth'
                  ? 'error'
                  : getErrorType(combinedError).type === 'network'
                  ? 'warning'
                  : 'info'
                : 'error'
            }
            variant='standard'
            actionText={actionText || undefined}
            onAction={actionText ? handleErrorAction : undefined}
            onClose={() => {
              setLoginError(null);
              setErrorDetail(undefined);
              clearError();
            }}
          />

          <Box
            component='form'
            onSubmit={(e) => {
              // Гарантируем, что перезагрузка страницы не произойдет
              e.preventDefault();
              handleSubmit(e);
              // Явно предотвращаем действие формы по умолчанию
              return false;
            }}
            noValidate
          >
            <TextField
              margin='normal'
              required
              fullWidth
              id='username'
              label='Имя пользователя'
              name='username'
              autoComplete='username'
              autoFocus
              value={username}
              onChange={(e) => handleFieldChange('username', e.target.value)}
              error={!!fieldErrors.username}
              helperText={fieldErrors.username}
              sx={{ mb: 2 }}
              InputProps={{
                sx: { borderRadius: '8px' },
              }}
            />
            <TextField
              margin='normal'
              required
              fullWidth
              name='password'
              label='Пароль'
              type='password'
              id='password'
              autoComplete='current-password'
              value={password}
              onChange={(e) => handleFieldChange('password', e.target.value)}
              error={!!fieldErrors.password}
              helperText={fieldErrors.password}
              sx={{ mb: 2 }}
              InputProps={{
                sx: { borderRadius: '8px' },
              }}
            />
            <Button
              type='submit'
              fullWidth
              variant='contained'
              sx={{
                mt: 3,
                mb: 2,
                height: '48px',
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 500,
                fontSize: '16px',
                boxShadow: 'none',
                '&:hover': {
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                },
              }}
              disabled={loading}
            >
              {loading ? 'Вход...' : 'Войти'}
            </Button>
            <Box display='flex' justifyContent='center'>
              <Link to='/register' style={{ textDecoration: 'none' }}>
                <Typography
                  variant='body2'
                  sx={{
                    color: 'primary.main',
                    fontWeight: 500,
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  Нет аккаунта? Зарегистрироваться
                </Typography>
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default LoginPage;
