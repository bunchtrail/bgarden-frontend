import { Navigate } from 'react-router-dom';
import { Layout } from './components';
import { ProtectedRoute } from './modules/auth/components/ProtectedRoute';
import {
  AuthOverviewPage,
  HomePage,
  LoginPage,
  ProfilePage,
  RegisterPage,
} from './pages';

export const routes = [
  {
    path: '/login',
    element: (
      <Layout>
        <LoginPage />
      </Layout>
    ),
  },
  {
    path: '/register',
    element: (
      <Layout>
        <RegisterPage />
      </Layout>
    ),
  },
  {
    path: '/profile',
    element: (
      <Layout>
        <ProtectedRoute>
          <ProfilePage />
        </ProtectedRoute>
      </Layout>
    ),
  },
  {
    path: '/auth-overview',
    element: (
      <Layout>
        <AuthOverviewPage />
      </Layout>
    ),
  },
  {
    path: '/',
    element: (
      <Layout>
        <HomePage />
      </Layout>
    ),
  },
  {
    path: '*',
    element: <Navigate to='/' replace />,
  },
];
