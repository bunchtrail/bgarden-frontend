import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { Footer, Header } from './components/ui';
import { ProtectedRoute } from './modules/auth/components/ProtectedRoute';
import { AuthProvider } from './modules/auth/contexts/AuthContext';
import { UserRole } from './modules/auth/types';

// Страницы
import LoginPage from './pages/auth/LoginPage';
import ProfilePage from './pages/auth/ProfilePage';
import RegisterPage from './pages/auth/RegisterPage';
import ErrorPage from './pages/ErrorPage';
import ExpositionDetailPage from './pages/ExpositionDetailPage';
import ExpositionsPage from './pages/ExpositionsPage';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import SpecimenDetailPage from './pages/SpecimenDetailPage';
import { SpecimensPage } from './pages/SpecimensPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className='flex flex-col min-h-screen bg-gray-50'>
          <Header />
          <main className='flex-grow container mx-auto px-4 py-6'>
            <Routes>
              {/* Публичные маршруты */}
              <Route path='/' element={<HomePage />} />
              <Route path='/login' element={<LoginPage />} />
              <Route path='/register' element={<RegisterPage />} />
              <Route path='/specimens' element={<SpecimensPage />} />
              <Route
                path='/specimen-detail/:id'
                element={<SpecimenDetailPage />}
              />
              <Route path='/expositions' element={<ExpositionsPage />} />
              <Route
                path='/expositions/:id'
                element={<ExpositionDetailPage />}
              />

              {/* Защищенные маршруты */}
              <Route
                path='/profile'
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />

              {/* Маршруты для админа/редактора (пример) */}
              <Route
                path='/admin'
                element={
                  <ProtectedRoute requiredRole={UserRole.Administrator}>
                    <ErrorPage
                      title='В разработке'
                      message='Административная панель находится в разработке'
                      code={503}
                    />
                  </ProtectedRoute>
                }
              />

              {/* Маршрут для ошибок */}
              <Route path='/error' element={<ErrorPage />} />

              {/* Страница 404 */}
              <Route path='*' element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
