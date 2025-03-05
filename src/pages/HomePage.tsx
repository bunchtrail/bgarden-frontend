import React from 'react';
import { Link } from 'react-router-dom';
import { SectorType } from '../modules/specimens';

const HomePage: React.FC = () => {
  const categories = [
    {
      id: 'dendrology',
      title: 'Дендрология',
      description:
        'Изучение древесных растений, их анатомии, физиологии, систематики и экологических характеристик',
      image:
        'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80',
      sectorType: SectorType.Dendrology,
    },
    {
      id: 'flora',
      title: 'Флора',
      description:
        'Исследование видового разнообразия растений, их распространения и взаимодействия с окружающей средой',
      image:
        'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&q=80',
      sectorType: SectorType.Dendrology, // пока используем дендрологию, можно будет добавить новый тип
    },
    {
      id: 'floriculture',
      title: 'Цветоводство',
      description:
        'Искусство выращивания цветов, создания композиций и ухода за декоративными растениями',
      image:
        'https://images.unsplash.com/photo-1523810192022-5a0fb9aa7ff8?auto=format&fit=crop&q=80',
      sectorType: SectorType.Floriculture,
    },
  ];

  return (
    <div className='min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-black'>
      <header className='py-16 md:py-24'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <h1 className='text-4xl md:text-5xl font-bold mb-4 tracking-tight text-secondary-dark dark:text-secondary-light'>
            Ботанический сад
          </h1>
          <p className='text-lg text-gray-700 dark:text-gray-300 max-w-2xl'>
            Погрузитесь в удивительный мир растений и откройте для себя
            природное разнообразие нашей планеты
          </p>
        </div>
      </header>

      <section className='py-12'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {categories.map((category) => (
              <Link
                to={`/specimens?sector=${category.sectorType}`}
                key={category.id}
                className='block no-underline transition-transform duration-300 hover:translate-y-[-4px]'
              >
                <div className='bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-card hover:shadow-lg transition-shadow duration-300'>
                  <div className='h-48 overflow-hidden'>
                    <img
                      src={category.image}
                      alt={category.title}
                      className='w-full h-full object-cover transition-transform duration-500 hover:scale-105'
                    />
                  </div>
                  <div className='p-6'>
                    <h2 className='text-xl font-semibold mb-2 text-secondary-dark dark:text-secondary-light'>
                      {category.title}
                    </h2>
                    <p className='text-gray-600 dark:text-gray-400 mb-4 line-clamp-3'>
                      {category.description}
                    </p>
                    <span className='inline-block px-4 py-2 bg-primary hover:bg-primary-600 text-white rounded-pill font-medium transition-colors'>
                      Исследовать
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
