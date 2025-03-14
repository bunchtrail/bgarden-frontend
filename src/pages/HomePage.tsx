import React from 'react';
import { Link } from 'react-router-dom';
import AbstractPattern, { PatternType } from '../components/AbstractPattern';
import SectorCard from '../components/SectorCard';
import { useAuth } from '../modules/auth/contexts/AuthContext';
import { UserRole } from '../modules/auth/types';
import { SectorType } from '../modules/specimens/types';
import { appStyles, layoutClasses } from '../styles/global-styles';

/**
 * Главная страница с адаптивным отображением в зависимости от типа пользователя
 */
const HomePage: React.FC = () => {
  const { isAuthenticated, user, loading } = useAuth();

  // Показываем загрузку во время проверки авторизации
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  const sectorData = [
    {
      id: SectorType.Dendrology,
      title: 'Дендрология',
      description:
        'Раздел ботаники, изучающий древесные растения (деревья, кустарники, кустарнички, древесные лианы).',
      patternType: 'dendrology' as PatternType,
      imageUrl: '/images/sectors/dendrology.jpg'
    },
    {
      id: SectorType.Flora,
      title: 'Флора',
      description:
        'Исторически сложившаяся совокупность всех видов растений на определённой территории.',
      patternType: 'flora' as PatternType,
      imageUrl: '/images/sectors/flora.jpg'
    },
    {
      id: SectorType.Flowering,
      title: 'Цветоводство',
      description:
        'Искусство выращивания декоративно-цветущих растений как в открытом, так и в защищённом грунте.',
      patternType: 'flowering' as PatternType,
      imageUrl: '/images/sectors/flowering.jpg'
    },
  ];

  // Определим интерфейс для publicFeatures
  interface PublicFeature {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    link: string;
  }

  const publicFeatures: PublicFeature[] = [
    // Удалена секция с картой
  ];

  const employeeTools = [
    {
      id: 'specimens',
      title: 'Каталог растений',
      description:
        'Управление каталогом всех видов растений, представленных в ботаническом саду.',
      link: '/specimens',
    },
    {
      id: 'map',
      title: 'Карта сада',
      description:
        'Интерактивная карта ботанического сада с возможностью просмотра и управления расположением растений.',
      link: '/map',
    },
    {
      id: 'expositions',
      title: 'Экспозиции',
      description:
        'Управление временными и постоянными экспозициями ботанического сада.',
      link: '/expositions',
    },
  ];

  const adminTools = [
    {
      id: 'admin',
      title: 'Административная панель',
      description:
        'Доступ к расширенным административным функциям и настройкам системы.',
      link: '/admin',
    },
  ];

  // Отображение для незарегистрированных пользователей
  if (!isAuthenticated || !user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className='text-center mb-12'>
          <h1 className="text-4xl font-bold text-[#1D1D1F] sm:text-5xl mb-4 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-green-700 to-green-500">
            Добро пожаловать в Ботанический сад
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-[#86868B] mb-8">
            Исследуйте удивительный мир растений и планируйте ваше посещение
          </p>
          <div className='flex gap-4 justify-center mb-12'>
            <Link to='/specimens'>
              <button className={`${appStyles.button.base} ${appStyles.button.primary}`}>
                Каталог растений
              </button>
            </Link>
            <Link to='/map'>
              <button className={`${appStyles.button.base} ${appStyles.button.secondary}`}>
                Карта сада
              </button>
            </Link>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-[#1D1D1F] mb-6 text-center">Наши основные секторы</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 transform-gpu">
          {sectorData.map((sector) => (
            <div key={sector.id} className="transform-gpu transition-transform duration-300 hover:translate-y-[-4px] will-change-transform">
              <SectorCard
                key={sector.id}
                id={sector.id}
                title={sector.title}
                description={sector.description}
                patternType={sector.patternType}
              />
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {publicFeatures.map((feature) => (
            <div key={feature.id} className={appStyles.card.base}>
              <div className={appStyles.card.body}>
                <h3 className={appStyles.card.title}>{feature.title}</h3>
                <p className={`${appStyles.text.body} ${appStyles.text.secondary} mt-2 mb-4`}>
                  {feature.description}
                </p>
                <Link to={feature.link}>
                  <button className={`${appStyles.button.base} ${appStyles.button.success} mt-2`}>
                    Перейти
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-[#F5F5F7] rounded-2xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-[#1D1D1F] mb-2">Исследуйте наш сад</h2>
            <p className="text-[#86868B]">Посетите наш ботанический сад и откройте для себя удивительное разнообразие растений</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-[#E5E5EA] flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-[#E2F9EB] flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[#30D158]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              </div>
              <h3 className="font-medium text-[#1D1D1F] mb-2">Экскурсии</h3>
              <p className="text-[#86868B] text-sm">Познавательные экскурсии с нашими специалистами</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-[#E5E5EA] flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-[#E1F0FF] flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[#0A84FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-medium text-[#1D1D1F] mb-2">События</h3>
              <p className="text-[#86868B] text-sm">Регулярные мероприятия и мастер-классы</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-[#E5E5EA] flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-[#FFF2E3] flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[#FF9F0A]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="font-medium text-[#1D1D1F] mb-2">Обучение</h3>
              <p className="text-[#86868B] text-sm">Образовательные программы для всех возрастов</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Отображение для авторизованных пользователей
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className='text-center mb-12'>
        <h1 className="text-4xl font-bold text-[#1D1D1F] sm:text-5xl mb-4 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-green-600 via-green-500 to-emerald-400">
          Ботанический сад
        </h1>
        <p className="max-w-2xl mx-auto text-lg text-[#86868B] mb-4">
          Добро пожаловать, {user?.fullName || user?.username}! Выберите один из секторов для работы
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 mb-16 transform-gpu">
        {sectorData.map((sector) => (
          <div key={sector.id} className="transform-gpu transition-transform duration-300 hover:translate-y-[-4px] will-change-transform">
            <SectorCard
              id={sector.id}
              title={sector.title}
              description={sector.description}
              patternType={sector.patternType}
            />
          </div>
        ))}
      </div>

      <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border border-[#E5E5EA] p-5 mt-8">
        <h2 className="text-base font-medium mb-3 text-[#86868B] flex items-center">
          <svg className="w-4 h-4 mr-2 text-[#0A84FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
          </svg>
          Дополнительные инструменты
        </h2>
        <div className='flex gap-3 flex-wrap items-start transition-opacity duration-300 opacity-90 hover:opacity-100'>
          {employeeTools.map((tool) => (
            <Link key={tool.id} to={tool.link} className={`${appStyles.tool.base} text-xs py-2`}>
              <div className={appStyles.tool.icon}>
                {tool.id === 'specimens' ? (
                  <svg
                    className='w-4 h-4'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10'
                    />
                  </svg>
                ) : (
                  <svg
                    className='w-4 h-4'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z'
                    />
                  </svg>
                )}
              </div>
              <span className={appStyles.tool.title}>{tool.title}</span>
            </Link>
          ))}

          {user?.role === UserRole.Administrator && (
            <Link
              to='/admin'
              className={`${appStyles.tool.base} bg-[#F2F8F5] border-[#D1E7DB] text-xs py-2`}
            >
              <div className={appStyles.tool.adminIcon}>
                <svg
                  className='w-4 h-4'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z'
                  />
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                  />
                </svg>
              </div>
              <span className={appStyles.tool.title}>
                Административная панель
              </span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
