import {
  Alert,
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../modules/auth';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, error, clearError, isTwoFactorRequired, verifyTwoFactor } =
    useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setLoginError(null);
    setLoading(true);

    try {
      await login({ username, password });
      if (!isTwoFactorRequired) {
        navigate('/profile');
      }
    } catch (err) {
      if (err instanceof Error) {
        setLoginError(err.message);
      } else {
        setLoginError('Произошла ошибка при входе');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTwoFactorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setLoginError(null);
    setLoading(true);

    try {
      await verifyTwoFactor(twoFactorCode, rememberMe);
      navigate('/profile');
    } catch (err) {
      if (err instanceof Error) {
        setLoginError(err.message);
      } else {
        setLoginError('Произошла ошибка при проверке кода');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth='sm'>
      <Box mt={8} display='flex' flexDirection='column' alignItems='center'>
        <Paper elevation={3} style={{ padding: 24, width: '100%' }}>
          <Typography component='h1' variant='h5' align='center' gutterBottom>
            {isTwoFactorRequired
              ? 'Двухфакторная аутентификация'
              : 'Вход в систему'}
          </Typography>

          {(error || loginError) && (
            <Alert severity='error' sx={{ mb: 2 }}>
              {error || loginError}
            </Alert>
          )}

          {!isTwoFactorRequired ? (
            <Box component='form' onSubmit={handleSubmit} noValidate>
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
                onChange={(e) => setUsername(e.target.value)}
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
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                type='submit'
                fullWidth
                variant='contained'
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
              >
                {loading ? 'Вход...' : 'Войти'}
              </Button>
              <Box display='flex' justifyContent='center'>
                <Link to='/register'>
                  <Typography variant='body2'>
                    Нет аккаунта? Зарегистрироваться
                  </Typography>
                </Link>
              </Box>
            </Box>
          ) : (
            <Box component='form' onSubmit={handleTwoFactorSubmit} noValidate>
              <TextField
                margin='normal'
                required
                fullWidth
                id='twoFactorCode'
                label='Код подтверждения'
                name='twoFactorCode'
                autoFocus
                value={twoFactorCode}
                onChange={(e) => setTwoFactorCode(e.target.value)}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    name='rememberMe'
                    color='primary'
                  />
                }
                label='Запомнить устройство'
              />
              <Button
                type='submit'
                fullWidth
                variant='contained'
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
              >
                {loading ? 'Проверка...' : 'Подтвердить'}
              </Button>
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default LoginPage;
