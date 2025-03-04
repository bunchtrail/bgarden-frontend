import HistoryIcon from '@mui/icons-material/History';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import SecurityIcon from '@mui/icons-material/Security';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import {
  Box,
  Container,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
} from '@mui/material';
import React from 'react';

const AuthOverviewPage: React.FC = () => {
  return (
    <Container maxWidth='md'>
      <Box mt={4} mb={4}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant='h4' component='h1' gutterBottom>
            Обзор функций авторизации
          </Typography>

          <Typography variant='body1' paragraph>
            Наш модуль авторизации обеспечивает полную безопасность и удобство
            использования с различными функциями:
          </Typography>

          <Divider sx={{ my: 3 }} />

          <List>
            <ListItem>
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText
                primary='Регистрация и вход'
                secondary='Простая регистрация и вход в систему с проверкой учетных данных и защитой от атак перебором.'
              />
            </ListItem>

            <ListItem>
              <ListItemIcon>
                <SecurityIcon />
              </ListItemIcon>
              <ListItemText
                primary='Двухфакторная аутентификация'
                secondary='Дополнительный уровень безопасности с помощью TOTP (временные одноразовые пароли) через приложения Google Authenticator, Microsoft Authenticator и другие.'
              />
            </ListItem>

            <ListItem>
              <ListItemIcon>
                <VpnKeyIcon />
              </ListItemIcon>
              <ListItemText
                primary='JWT авторизация'
                secondary='Использование JSON Web Tokens для безопасной авторизации между клиентом и сервером без сохранения состояния.'
              />
            </ListItem>

            <ListItem>
              <ListItemIcon>
                <HistoryIcon />
              </ListItemIcon>
              <ListItemText
                primary='История входов'
                secondary='Отслеживание всех попыток входа с информацией о времени, IP-адресе и устройстве для обеспечения безопасности.'
              />
            </ListItem>

            <ListItem>
              <ListItemIcon>
                <LockIcon />
              </ListItemIcon>
              <ListItemText
                primary='Управление профилем'
                secondary='Возможность просмотра и редактирования данных профиля, смены пароля и настройки безопасности.'
              />
            </ListItem>
          </List>

          <Divider sx={{ my: 3 }} />

          <Typography variant='h6' gutterBottom>
            Как работает наша система безопасности
          </Typography>

          <Typography variant='body1' paragraph>
            1. <strong>Безопасное хранение паролей</strong> с использованием
            современных алгоритмов хеширования.
          </Typography>

          <Typography variant='body1' paragraph>
            2. <strong>Защита от распространенных атак</strong>, таких как XSS,
            CSRF, инъекции и перебор.
          </Typography>

          <Typography variant='body1' paragraph>
            3. <strong>Механизм блокировки аккаунта</strong> после нескольких
            неудачных попыток входа.
          </Typography>

          <Typography variant='body1' paragraph>
            4. <strong>Автоматическое обновление токенов</strong> для
            обеспечения безопасности длительных сессий.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default AuthOverviewPage;
