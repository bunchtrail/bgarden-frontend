import React from 'react';

/**
 * Страница с интерактивной картой ботанического сада
 * Доступна для всех пользователей, включая Клиентов
 */
const MapPage: React.FC = () => {
  return (
    <div className='max-w-5xl mx-auto'>
      <h1 className='text-3xl font-bold mb-6 text-green-800'>
        Интерактивная карта ботанического сада
      </h1>

      <div className='bg-white shadow-md rounded-lg p-6 mb-6'>
        <h2 className='text-xl font-semibold mb-4 text-green-700'>
          Функция в разработке
        </h2>
        <p className='text-gray-600 mb-4'>
          Интерактивная карта ботанического сада находится в разработке. Скоро
          здесь появится возможность просматривать различные зоны и экспозиции,
          узнавать о растениях и планировать маршрут посещения.
        </p>

        <div className='bg-green-50 border border-green-200 rounded-lg p-4 text-green-800'>
          <p className='font-medium'>Планируемые возможности:</p>
          <ul className='list-disc list-inside mt-2 space-y-1'>
            <li>Интерактивная карта территории</li>
            <li>Поиск и фильтрация растений</li>
            <li>Построение маршрутов посещения</li>
            <li>Информация о текущих экспозициях</li>
            <li>Сезонные особенности сада</li>
          </ul>
        </div>
      </div>

      <div className='bg-gray-100 border border-gray-200 rounded-lg p-8 flex items-center justify-center'>
        <div className='text-center'>
          <svg
            className='w-16 h-16 mx-auto text-gray-400'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={1.5}
              d='M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7'
            />
          </svg>
          <p className='mt-4 text-gray-600'>
            Здесь будет размещена карта ботанического сада
          </p>
        </div>
      </div>
    </div>
  );
};

export default MapPage;
