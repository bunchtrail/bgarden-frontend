import {
  Box,
  Button,
  Container,
  Divider,
  List,
  ListItem,
  ListItemText,
  Paper,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../modules/auth';
import { AuthHistory } from '../modules/auth/components/AuthHistory';
import { TwoFactorSetup } from '../modules/auth/components/TwoFactorSetup';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const ProfilePage: React.FC = () => {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const [tabValue, setTabValue] = useState(0);

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to='/login' />;
  }

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <Container maxWidth='md'>
      <Box mt={4} mb={4}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Box
            display='flex'
            justifyContent='space-between'
            alignItems='center'
            mb={2}
          >
            <Typography variant='h4' component='h1'>
              Профиль пользователя
            </Typography>
            <Button variant='outlined' color='primary' onClick={handleLogout}>
              Выйти
            </Button>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Box sx={{ mb: 4 }}>
            <Typography variant='h6' gutterBottom>
              Информация пользователя
            </Typography>
            <List dense>
              <ListItem>
                <ListItemText
                  primary='Имя пользователя'
                  secondary={user.username}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary='Имя'
                  secondary={`${user.firstName} ${user.lastName}`}
                />
              </ListItem>
              <ListItem>
                <ListItemText primary='Email' secondary={user.email} />
              </ListItem>
              <ListItem>
                <ListItemText primary='Роль' secondary={user.role} />
              </ListItem>
            </List>
          </Box>

          <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                aria-label='profile tabs'
              >
                <Tab label='Двухфакторная аутентификация' />
                <Tab label='История входов' />
              </Tabs>
            </Box>
            <TabPanel value={tabValue} index={0}>
              <TwoFactorSetup />
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              <AuthHistory />
            </TabPanel>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default ProfilePage;
