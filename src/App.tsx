import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { Footer, Header } from './components/ui';
import { ProtectedRoute } from './modules/auth/components/ProtectedRoute';
import { AuthProvider } from './modules/auth/contexts/AuthContext';
import { UserRole } from './modules/auth/types';
import { 
  NotificationProvider, 
  NotificationContainer, 
  ConfirmationProvider 
} from './modules/notifications';

// Страницы
import LoginPage from './pages/auth/LoginPage';
import ProfilePage from './pages/auth/ProfilePage';
import RegisterPage from './pages/auth/RegisterPage';
import ErrorPage from './pages/ErrorPage';
import ExpositionDetailPage from './pages/ExpositionDetailPage';
import ExpositionsPage from './pages/ExpositionsPage';
import HomePage from './pages/HomePage';
import MapPage from './pages/MapPage';
import NotFoundPage from './pages/NotFoundPage';
import { SpecimensPage } from './pages/SpecimensPage';

function App() {
  // Вспомогательная функция для добавления отступов обычным страницам
  const PageWithPadding: React.FC<{ component: React.ReactNode }> = ({ component }) => {
    return <div className="py-6">{component}</div>;
  };
  
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <ConfirmationProvider>
            <div className='flex flex-col min-h-screen bg-gray-50'>
              <Header />
              <main className='flex-grow container mx-auto px-4'>
                <Routes>
                  {/* Публичные маршруты - доступны всем */}
                  <Route path='/' element={<PageWithPadding component={<HomePage />} />} />
                  <Route path='/login' element={<LoginPage />} />
                  <Route path='/register' element={<RegisterPage />} />

                  {/* Маршруты только для сотрудников и администраторов */}
                  <Route
                    path='/specimens'
                    element={
                      <ProtectedRoute
                        requiredRoles={[UserRole.Administrator, UserRole.Employee]}
                      >
                        <PageWithPadding component={<SpecimensPage />} />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path='/expositions'
                    element={
                      <ProtectedRoute
                        requiredRoles={[UserRole.Administrator, UserRole.Employee]}
                      >
                        <PageWithPadding component={<ExpositionsPage />} />
                      </ProtectedRoute>
                    }
                  />
                  
                  <Route
                    path='/expositions/:id'
                    element={
                      <ProtectedRoute
                        requiredRoles={[UserRole.Administrator, UserRole.Employee]}
                      >
                        <PageWithPadding component={<ExpositionDetailPage />} />
                      </ProtectedRoute>
                    }
                  />

                  {/* Маршрут для карты */}
                  <Route
                    path='/map'
                    element={
                      <ProtectedRoute
                        requiredRoles={[UserRole.Administrator, UserRole.Employee]}
                      >
                        <PageWithPadding component={<MapPage />} />
                      </ProtectedRoute>
                    }
                  />

                  {/* Защищенные маршруты для всех авторизованных пользователей */}
                  <Route
                    path='/profile'
                    element={
                      <ProtectedRoute>
                        <PageWithPadding component={<ProfilePage />} />
                      </ProtectedRoute>
                    }
                  />

                  {/* Маршруты для администратора */}
                  <Route
                    path='/admin'
                    element={
                      <ProtectedRoute requiredRoles={UserRole.Administrator}>
                        <PageWithPadding 
                          component={
                            <ErrorPage
                              title='В разработке'
                              message='Административная панель находится в разработке'
                              code={503}
                            />
                          } 
                        />
                      </ProtectedRoute>
                    }
                  />

                  {/* Маршрут для ошибок */}
                  <Route 
                    path='/error' 
                    element={<PageWithPadding component={<ErrorPage />} />} 
                  />

                  {/* Страница 404 */}
                  <Route 
                    path='*' 
                    element={<PageWithPadding component={<NotFoundPage />} />} 
                  />
                </Routes>
              </main>
              <Footer />
              {/* Компонент для отображения уведомлений */}
              <NotificationContainer />
            </div>
          </ConfirmationProvider>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
