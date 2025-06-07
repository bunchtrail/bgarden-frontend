import React, { useEffect, useState } from 'react';
import { 
  PublicHomePage, 
  AuthenticatedHomePage, 
  getTimeBasedGreeting,
  TimeInfo
} from '../modules/home';
import { useAuth } from '../modules/auth/hooks';
import { User } from '../modules/auth/types';
import { LoadingSpinner } from '../modules/ui';

const Home: React.FC = () => {
  const { isAuthenticated, user, loading } = useAuth();
  const [timeInfo, setTimeInfo] = useState<TimeInfo>(getTimeBasedGreeting());

  // Обновляем приветствие каждые 30 минут
  useEffect(() => {
    const updateTimeInfo = () => {
      setTimeInfo(getTimeBasedGreeting());
    };

    // Запускаем таймер обновления
    const timer = setInterval(updateTimeInfo, 30 * 60 * 1000);

    // Очистка при размонтировании
    return () => clearInterval(timer);
  }, []);

  // Адаптируем UserDto к типу User
  const adaptedUser: User | null = user ? {
    id: String(user.id), // Преобразуем числовой id в строку
    email: user.email,
    role: user.role,
    name: user.fullName ? user.fullName.split(' ')[0] : user.username // Имя без фамилии
  } : null;

  // Показываем загрузчик, пока проверяется аутентификация
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-64px)]">
        <LoadingSpinner size="large" message="Загрузка данных..." />
      </div>
    );
  }

  return isAuthenticated && adaptedUser ? (
    <AuthenticatedHomePage 
      timeInfo={timeInfo} 
      user={adaptedUser}
    />
  ) : (
    <PublicHomePage 
      timeInfo={timeInfo}
    />
  );
};

export default Home; 