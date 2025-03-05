import React from 'react';

/**
 * Тестовый компонент для демонстрации возможностей Tailwind CSS
 */
const TailwindTest: React.FC = () => {
  return (
    <div className='p-6 max-w-sm mx-auto bg-white rounded-xl shadow-md flex items-center space-x-4'>
      <div className='flex-shrink-0'>
        <div className='h-12 w-12 bg-indigo-500 rounded-full flex items-center justify-center'>
          <svg
            className='h-8 w-8 text-white'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M13 10V3L4 14h7v7l9-11h-7z'
            />
          </svg>
        </div>
      </div>
      <div>
        <div className='text-xl font-medium text-black'>Tailwind CSS 3.3.0</div>
        <p className='text-gray-500'>
          Тестовый компонент для проверки работы Tailwind CSS
        </p>
      </div>
    </div>
  );
};

export default TailwindTest;
