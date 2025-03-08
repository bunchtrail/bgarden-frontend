import React from 'react';
import { Link } from 'react-router-dom';
import SectorCard from '../components/SectorCard';
import { useAuth } from '../modules/auth/contexts/AuthContext';
import { UserRole } from '../modules/auth/types';
import { SectorType } from '../modules/specimens/types';
import { appStyles, layoutClasses } from '../styles/global-styles';

/**
 * Главная страница с адаптивным отображением в зависимости от типа пользователя
 */
const HomePage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  // URL для заглушек изображений
  const placeholderImages = {
    dendrology: '/logo512.png',
    flora: '/logo512.png',
    flowering: '/logo512.png',
    map: '/logo512.png',
    info: '/logo512.png',
  };

  const sectorData = [
    {
      id: SectorType.Dendrology,
      title: 'Дендрология',
      description:
        'Раздел ботаники, изучающий древесные растения (деревья, кустарники, кустарнички, древесные лианы).',
      imageUrl: placeholderImages.dendrology,
    },
    {
      id: SectorType.Flora,
      title: 'Флора',
      description:
        'Исторически сложившаяся совокупность всех видов растений на определённой территории.',
      imageUrl: placeholderImages.flora,
    },
    {
      id: SectorType.Flowering,
      title: 'Цветоводство',
      description:
        'Искусство выращивания декоративно-цветущих растений как в открытом, так и в защищённом грунте.',
      imageUrl: placeholderImages.flowering,
    },
  ];

  const publicFeatures = [
    {
      id: 'map',
      title: 'Интерактивная карта',
      description:
        'Ознакомьтесь с интерактивной картой ботанического сада для планирования вашего визита.',
      imageUrl: placeholderImages.map,
      link: '/map',
    },
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
      <div>
        <div className='text-center mb-8'>
          <h1
            className={`text-3xl font-semibold text-[#1D1D1F] sm:text-4xl mb-4 tracking-tight`}
          >
            Добро пожаловать в Ботанический сад
          </h1>
          <p className={`max-w-2xl mx-auto text-lg text-[#86868B] mb-6`}>
            Исследуйте удивительный мир растений и планируйте ваше посещение
          </p>
          <div className='flex gap-4 justify-center mb-8'>
            <Link to='/login'>
              <button
                className={`${appStyles.button.base} ${appStyles.button.primary}`}
              >
                Войти в систему
              </button>
            </Link>
            <Link to='/register'>
              <button
                className={`${appStyles.button.base} ${appStyles.button.secondary}`}
              >
                Зарегистрироваться
              </button>
            </Link>
          </div>
        </div>

        <div className={layoutClasses.gridSm2}>
          {publicFeatures.map((feature) => (
            <div key={feature.id} className={appStyles.card.base}>
              <div className={appStyles.card.body}>
                <h3 className={appStyles.card.title}>{feature.title}</h3>
                <p
                  className={`${appStyles.text.body} ${appStyles.text.secondary} mt-2 mb-4`}
                >
                  {feature.description}
                </p>
                <Link to={feature.link}>
                  <button
                    className={`${appStyles.button.base} ${appStyles.button.success} mt-2`}
                  >
                    Перейти
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Отображение для сотрудников и администраторов
  if (user.role === UserRole.Employee || user.role === UserRole.Administrator) {
    return (
      <div>
        <div className='text-center mb-6'>
          <h1 className={`text-2xl font-medium text-[#1D1D1F] mb-2`}>
            Ботанический сад
          </h1>
          <p
            className={`max-w-xl mx-auto text-sm text-[#86868B] border-b border-[#E5E5EA] pb-4`}
          >
            Рабочая панель сотрудника
          </p>
        </div>

        <div className='mb-4'>
          <div className={`${layoutClasses.gridSm3} gap-6`}>
            {sectorData.map((sector) => (
              <div key={sector.id} className='relative group'>
                <Link
                  to={`/specimens?sector=${sector.id}`}
                  className='block h-full'
                >
                  <div className={appStyles.card.sectorCard}>
                    <div className={appStyles.card.sectorImage}>
                      <img
                        src={sector.imageUrl}
                        alt={sector.title}
                        className={appStyles.card.sectorImageInner}
                      />
                    </div>
                    <div className={appStyles.card.sectorContent}>
                      <h2 className={appStyles.card.sectorTitle}>
                        {sector.title}
                      </h2>
                      <p className={appStyles.card.sectorDescription}>
                        {sector.description}
                      </p>
                      <div className='flex items-center justify-center'>
                        <span className={appStyles.card.sectorButton}>
                          <svg
                            className='w-3 h-3 mr-1'
                            fill='none'
                            stroke='currentColor'
                            viewBox='0 0 24 24'
                            xmlns='http://www.w3.org/2000/svg'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2}
                              d='M9 5l7 7-7 7'
                            />
                          </svg>
                          Управление разделом
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className='flex gap-4 flex-wrap justify-center items-start mt-6'>
          {employeeTools.map((tool) => (
            <Link key={tool.id} to={tool.link} className={appStyles.tool.base}>
              <div className={appStyles.tool.icon}>
                {tool.id === 'specimens' ? (
                  <svg
                    className='w-5 h-5'
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
                    className='w-5 h-5'
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

          {user.role === UserRole.Administrator && (
            <Link
              to='/admin'
              className={`${appStyles.tool.base} bg-[#F2F8F5] border-[#D1E7DB]`}
            >
              <div className={appStyles.tool.adminIcon}>
                <svg
                  className='w-5 h-5'
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

          <Link to='/map' className={appStyles.tool.base}>
            <div className={appStyles.tool.icon}>
              <svg
                className='w-5 h-5'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7'
                />
              </svg>
            </div>
            <span className={appStyles.tool.title}>Карта сада</span>
          </Link>
        </div>
      </div>
    );
  }

  // Отображение для клиентов
  return (
    <div>
      <div className='text-center mb-8'>
        <h1 className='text-3xl font-extrabold text-gray-900 sm:text-4xl mb-4'>
          Добро пожаловать в Ботанический сад
        </h1>
        <p className='max-w-2xl mx-auto text-lg text-gray-600'>
          Исследуйте удивительный мир растений в нашем ботаническом саду
        </p>
      </div>

      <div className='bg-white rounded-lg shadow-md p-6 mb-8'>
        <h2 className='text-xl font-semibold mb-4 text-green-800'>
          Полезные инструменты
        </h2>
        <div className={layoutClasses.gridSm2}>
          {publicFeatures.map((feature) => (
            <div
              key={feature.id}
              className='border border-gray-200 rounded-lg overflow-hidden'
            >
              <div className='p-6'>
                <h3 className='text-xl font-semibold text-gray-900 mb-2'>
                  {feature.title}
                </h3>
                <p className='text-gray-600 mb-4'>{feature.description}</p>
                <Link to={feature.link}>
                  <button className='bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md'>
                    Перейти
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className='bg-white rounded-lg shadow-md p-6'>
        <h2 className='text-xl font-semibold mb-4 text-green-800'>
          Разделы ботанического сада
        </h2>
        <div className={layoutClasses.gridSm3}>
          {sectorData.map((sector) => (
            <SectorCard
              key={sector.id}
              id={sector.id}
              title={sector.title}
              description={sector.description}
              imageUrl={sector.imageUrl}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
