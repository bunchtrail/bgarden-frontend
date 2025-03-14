import React from 'react';
import { User } from '../../modules/auth/types';
import { layoutClasses } from '../../styles/global-styles';
import TimeBasedGreeting, { TimeInfo } from './TimeBasedGreeting';
import SectorGrid from './SectorGrid';
import UserTools from './UserTools';

interface AuthenticatedHomePageProps {
  timeInfo: TimeInfo;
  user: User;
}

const AuthenticatedHomePage: React.FC<AuthenticatedHomePageProps> = ({ timeInfo, user }) => {
  // Получаем имя пользователя из объекта user
  const userName = user.name || user.email;

  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col ${layoutClasses.container}`}>
      <div className="flex-grow">
        {/* Приветствие */}
        <TimeBasedGreeting 
          timeInfo={timeInfo} 
          userName={userName} 
        />

        {/* Секторы */}
        <SectorGrid className="lg:gap-10" />
      </div>

      {/* Инструменты пользователя */}
      <UserTools userRole={user.role} />
    </div>
  );
};

export default AuthenticatedHomePage; 