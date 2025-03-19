import React from 'react';
import { Link } from 'react-router-dom';
import { buttonClasses, layoutClasses, textClasses } from '../../../styles/global-styles';
import { TimeBasedGreeting, TimeInfo } from './time-based-greeting';
import SectorGrid from './SectorGrid';

interface PublicHomePageProps {
  timeInfo: TimeInfo;
}

const PublicHomePage: React.FC<PublicHomePageProps> = ({ timeInfo }) => {
  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col ${layoutClasses.section}`}>
      <div className="flex-grow">
        {/* Приветствие */}
        <TimeBasedGreeting timeInfo={timeInfo} />

        {/* Секторы */}
        <SectorGrid className="lg:gap-10" />
      </div>
      
      {/* Навигационные инструменты для незарегистрированных пользователей */}
      <div className="mt-auto mb-4 pt-4">
        <div className="flex flex-wrap gap-4 justify-center">
          <Link to='/specimens' className="flex items-center rounded-full px-5 py-2.5 border border-[#E5E5EA] shadow-sm transition-all duration-500 hover:shadow-md hover:border-[#D1D1D6] hover:bg-[#F9F9FB] group">
            <span className="text-sm font-medium text-[#1D1D1F] group-hover:text-[#3882F6] transition-colors duration-300">Каталог растений</span>
          </Link>
          
          <Link to='/map' className="flex items-center rounded-full px-5 py-2.5 border border-[#E5E5EA] shadow-sm transition-all duration-500 hover:shadow-md hover:border-[#D1D1D6] hover:bg-[#F9F9FB] group">
            <span className="text-sm font-medium text-[#1D1D1F] group-hover:text-[#E97451] transition-colors duration-300">Карта сада</span>
          </Link>
          
          <Link to='/login' className="flex items-center rounded-full px-5 py-2.5 border border-[#E5E5EA] shadow-sm transition-all duration-500 hover:shadow-md hover:border-[#D1D1D6] hover:bg-[#F9F9FB] group">
            <span className="text-sm font-medium text-[#1D1D1F] group-hover:text-[#6366F1] transition-colors duration-300">Войти</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PublicHomePage; 