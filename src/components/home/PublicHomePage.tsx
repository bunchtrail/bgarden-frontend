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
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${layoutClasses.container}`}>
      {/* Приветствие */}
      <TimeBasedGreeting timeInfo={timeInfo} />

      {/* Секторы */}
      <SectorGrid />
      
      {/* Кнопки навигации */}
      <div className="flex flex-wrap gap-4 justify-center mb-8">
        <Link to='/specimens'>
          <button className={`${buttonClasses.base} ${buttonClasses.primary}`}>
            Каталог растений
          </button>
        </Link>
        <Link to='/map'>
          <button className={`${buttonClasses.base} ${buttonClasses.secondary}`}>
            Карта сада
          </button>
        </Link>
      </div>

      {/* Информационная секция */}
      <div className="mb-8 bg-gray-50 rounded-xl p-6">
        <div className="text-center mb-4">
          <h2 className={`${textClasses.heading} text-xl mb-2`}>Исследуйте наш сад</h2>
          <p className={textClasses.secondary}>Посетите наш ботанический сад и откройте для себя удивительное разнообразие растений</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Карточки преимуществ */}
          <div className="bg-white rounded-lg p-4 text-center">
            <h3 className={`${textClasses.heading} text-base mb-1`}>Экскурсии</h3>
            <p className={`${textClasses.secondary} text-sm`}>Познавательные экскурсии с нашими специалистами</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <h3 className={`${textClasses.heading} text-base mb-1`}>События</h3>
            <p className={`${textClasses.secondary} text-sm`}>Регулярные мероприятия и мастер-классы</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <h3 className={`${textClasses.heading} text-base mb-1`}>Обучение</h3>
            <p className={`${textClasses.secondary} text-sm`}>Образовательные программы для всех возрастов</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicHomePage; 