import React from 'react';
import { Link } from 'react-router-dom';
import { buttonClasses, layoutClasses, textClasses } from '../../styles/global-styles';
import TimeBasedGreeting, { TimeInfo } from './TimeBasedGreeting';
import SectorGrid from './SectorGrid';

interface PublicHomePageProps {
  timeInfo: TimeInfo;
}

const PublicHomePage: React.FC<PublicHomePageProps> = ({ timeInfo }) => {
  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col ${layoutClasses.container}`}>
      <div className="flex-grow">
        {/* Приветствие */}
        <TimeBasedGreeting timeInfo={timeInfo} />

        {/* Секторы */}
        <SectorGrid className="lg:gap-10" />
      </div>
      
      {/* Навигационные инструменты для незарегистрированных пользователей */}
      <div className="mt-auto mb-4 pt-4">
        <h3 className="text-lg font-medium text-[#1D1D1F] mb-3 text-center">Исследуйте наш сад</h3>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link to='/specimens' className="flex items-center rounded-full px-4 py-2 border border-[#E5E5EA] shadow-sm transition-all duration-300 hover:shadow-md hover:border-[#D1D1D6] group">
            <span className="text-[#3882F6] p-1.5 rounded-full mr-2.5 transition-all duration-300 group-hover:scale-110">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M6.32 2.577a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 0 1-1.085.67L12 18.089l-7.165 3.583A.75.75 0 0 1 3.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93Z" clipRule="evenodd" />
              </svg>
            </span>
            <span className="text-sm font-medium text-[#1D1D1F]">Каталог растений</span>
          </Link>
          
          <Link to='/map' className="flex items-center rounded-full px-4 py-2 border border-[#E5E5EA] shadow-sm transition-all duration-300 hover:shadow-md hover:border-[#D1D1D6] group">
            <span className="text-[#E97451] p-1.5 rounded-full mr-2.5 transition-all duration-300 group-hover:scale-110">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M8.161 2.58a1.875 1.875 0 0 1 1.678 0l4.993 2.498c.106.052.23.052.336 0l3.869-1.935A1.875 1.875 0 0 1 21.75 4.82v12.485c0 .71-.401 1.36-1.037 1.677l-4.875 2.437a1.875 1.875 0 0 1-1.676 0l-4.994-2.497a.375.375 0 0 0-.336 0l-3.868 1.935A1.875 1.875 0 0 1 2.25 19.18V6.695c0-.71.401-1.36 1.036-1.677l4.875-2.437ZM9 6a.75.75 0 0 1 .75.75V15a.75.75 0 0 1-1.5 0V6.75A.75.75 0 0 1 9 6Zm6.75 3a.75.75 0 0 0-1.5 0v8.25a.75.75 0 0 0 1.5 0V9Z" clipRule="evenodd" />
              </svg>
            </span>
            <span className="text-sm font-medium text-[#1D1D1F]">Карта сада</span>
          </Link>
          
          <Link to='/login' className="flex items-center rounded-full px-4 py-2 border border-[#E5E5EA] shadow-sm transition-all duration-300 hover:shadow-md hover:border-[#D1D1D6] group">
            <span className="text-[#6366F1] p-1.5 rounded-full mr-2.5 transition-all duration-300 group-hover:scale-110">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M7.5 3.75A1.5 1.5 0 0 0 6 5.25v13.5a1.5 1.5 0 0 0 1.5 1.5h6a1.5 1.5 0 0 0 1.5-1.5V15a.75.75 0 0 1 1.5 0v3.75a3 3 0 0 1-3 3h-6a3 3 0 0 1-3-3V5.25a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3V9A.75.75 0 0 1 15 9V5.25a1.5 1.5 0 0 0-1.5-1.5h-6Zm10.72 4.72a.75.75 0 0 1 1.06 0l3 3a.75.75 0 0 1 0 1.06l-3 3a.75.75 0 1 1-1.06-1.06l1.72-1.72H9a.75.75 0 0 1 0-1.5h10.94l-1.72-1.72a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
              </svg>
            </span>
            <span className="text-sm font-medium text-[#1D1D1F]">Войти</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PublicHomePage; 