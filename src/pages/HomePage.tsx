import React, { useEffect, useState } from 'react';
import { useAuth } from '../modules/auth/contexts/AuthContext';
import { layoutClasses } from '../styles/global-styles';
import { 
  getTimeBasedGreeting, 
  PublicHomePage, 
  AuthenticatedHomePage,
  TimeInfo
} from '../components/home';

/**
 * Главная страница с адаптивным отображением в зависимости от типа пользователя
 * и времени суток
 */
const HomePage: React.FC = () => {
  const { isAuthenticated, user, loading } = useAuth();
  const [timeInfo, setTimeInfo] = useState<TimeInfo>(getTimeBasedGreeting());

  // Обновление времени каждую минуту
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeInfo(getTimeBasedGreeting());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);

  // Показываем загрузку во время проверки авторизации
  if (loading) {
    return (
      <div className={`flex justify-center items-center ${layoutClasses.page}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  // Отображение для незарегистрированных пользователей
  if (!isAuthenticated || !user) {
    return <PublicHomePage timeInfo={timeInfo} />;
  }

  // Отображение для авторизованных пользователей
  // Преобразуем UserDto в формат User для компонента
  const adaptedUser = {
    id: user.id.toString(),
    email: user.email,
    role: user.role,
    name: user.fullName || user.username
  };

  return <AuthenticatedHomePage timeInfo={timeInfo} user={adaptedUser} />;
};

export default HomePage;
