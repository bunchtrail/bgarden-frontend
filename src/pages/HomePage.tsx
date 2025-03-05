import React from 'react';
import SectorCard from '../components/SectorCard';
import { SectorType } from '../modules/specimens/types';
import { layoutClasses } from '../styles/global-styles';

/**
 * Главная страница с выбором отдела
 */
const HomePage: React.FC = () => {
  // URL для заглушек изображений
  const placeholderImages = {
    dendrology: '/logo512.png',
    flora: '/logo512.png',
    flowering: '/logo512.png',
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

  return (
    <div>
      <div className='text-center mb-8'>
        <h1 className='text-3xl font-extrabold text-gray-900 sm:text-4xl mb-4'>
          Добро пожаловать в Ботанический сад
        </h1>
        <p className='max-w-2xl mx-auto text-lg text-gray-600'>
          Выберите интересующий вас раздел для просмотра каталога растений и
          работы с данными
        </p>
      </div>

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
  );
};

export default HomePage;
