import React from 'react';
import { User } from '../../../modules/auth/types';
import { pageClasses } from '../../../styles/global-styles';
import { TimeBasedGreeting, TimeInfo } from './time-based-greeting';
import SectorGrid from './SectorGrid';
import UserTools from './UserTools';

interface AuthenticatedHomePageProps {
  timeInfo: TimeInfo;
  user: User;
}

const AuthenticatedHomePage: React.FC<AuthenticatedHomePageProps> = ({
  timeInfo,
  user,
}) => {
  // Получаем имя пользователя из объекта user
  const userName = user.name || user.email;
  return (
    <div className={pageClasses.base}>
      {/* Основное содержимое с приветствием и секторами */}
      <div className="flex-1 pb-16">
        <div className={`${pageClasses.container} ${pageClasses.section}`}>
          {/* Центрированный контент */}
          <div className={pageClasses.centerContent}>
            {/* Приветствие */}
            <div className="mb-8 text-center">
              <TimeBasedGreeting timeInfo={timeInfo} userName={userName} />
            </div>

            {/* Секторы - центрированные */}
            <div className="flex justify-center">
              <SectorGrid className="lg:gap-10 max-w-5xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Инструменты пользователя - фиксированные внизу экрана */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <UserTools userRole={user.role} />
      </div>
    </div>
  );
};

export default AuthenticatedHomePage;
