import React from 'react';
import { SpecimenFilterParams } from '../../types';
import { FilterListIcon, SearchIcon } from '../icons';
import { buttonClasses, formClasses } from '../styles';

interface SpecimensFilterProps {
  filterParams: SpecimenFilterParams;
  onFilterChange: (filterParams: SpecimenFilterParams) => void;
  onSearch: (filterParams: SpecimenFilterParams) => void;
  familyOptions: { id: number; name: string }[];
  sectorOptions: { id: number; name: string }[];
  regionOptions: { id: number; name: string }[];
  expositionOptions?: { id: number; name: string }[];
}

export const SpecimensFilter: React.FC<SpecimensFilterProps> = ({
  filterParams,
  onFilterChange,
  onSearch,
  familyOptions,
  sectorOptions,
  regionOptions,
  expositionOptions = [],
}) => {
  const handleSearchFieldChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    onFilterChange({
      ...filterParams,
      searchField: event.target.value as
        | 'inventoryNumber'
        | 'russianName'
        | 'latinName',
      searchValue: '',
    });
  };

  const handleSearchValueChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    onFilterChange({
      ...filterParams,
      searchValue: event.target.value,
    });
  };

  const handleFamilyFilterChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    onFilterChange({
      ...filterParams,
      familyId: event.target.value ? Number(event.target.value) : undefined,
    });
  };

  const handleSectorFilterChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    onFilterChange({
      ...filterParams,
      sectorType: event.target.value ? Number(event.target.value) : undefined,
    });
  };

  const handleRegionFilterChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    onFilterChange({
      ...filterParams,
      regionId: event.target.value ? Number(event.target.value) : undefined,
    });
  };

  const handleExpositionFilterChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    onFilterChange({
      ...filterParams,
      expositionId: event.target.value ? Number(event.target.value) : undefined,
    });
  };

  const handleSearch = () => {
    onSearch(filterParams);
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className={`${formClasses.section} mb-6`}>
      <h3 className='text-lg font-medium mb-3 flex items-center'>
        <FilterListIcon className='mr-2' /> Поиск и фильтры
      </h3>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-4'>
        {/* Поле поиска */}
        <div className='mb-4'>
          <label htmlFor='searchField' className={formClasses.label}>
            Поиск по
          </label>
          <select
            id='searchField'
            className={formClasses.select}
            value={filterParams.searchField}
            onChange={handleSearchFieldChange}
          >
            <option value='inventoryNumber'>Инвентарному номеру</option>
            <option value='russianName'>Русскому названию</option>
            <option value='latinName'>Латинскому названию</option>
          </select>
        </div>

        {/* Значение поиска */}
        <div className='mb-4'>
          <label htmlFor='searchValue' className={formClasses.label}>
            Значение поиска
          </label>
          <div className='relative'>
            <input
              id='searchValue'
              type='text'
              className={`${formClasses.input} pr-10`}
              placeholder='Введите текст для поиска...'
              value={filterParams.searchValue}
              onChange={handleSearchValueChange}
              onKeyPress={handleKeyPress}
            />
            <button
              className='absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600'
              onClick={handleSearch}
              title='Поиск'
            >
              <SearchIcon />
            </button>
          </div>
        </div>

        {/* Фильтр по семейству */}
        <div className='mb-4'>
          <label htmlFor='familyFilter' className={formClasses.label}>
            Семейство
          </label>
          <select
            id='familyFilter'
            className={formClasses.select}
            value={filterParams.familyId || ''}
            onChange={handleFamilyFilterChange}
          >
            <option value=''>Все семейства</option>
            {familyOptions.map((family) => (
              <option key={family.id} value={family.id}>
                {family.name}
              </option>
            ))}
          </select>
        </div>

        {/* Фильтр по сектору */}
        <div className='mb-4'>
          <label htmlFor='sectorFilter' className={formClasses.label}>
            Сектор
          </label>
          <select
            id='sectorFilter'
            className={formClasses.select}
            value={filterParams.sectorType || ''}
            onChange={handleSectorFilterChange}
          >
            <option value=''>Все сектора</option>
            {sectorOptions.map((sector) => (
              <option key={sector.id} value={sector.id}>
                {sector.name}
              </option>
            ))}
          </select>
        </div>

        {/* Фильтр по региону происхождения */}
        <div className='mb-4'>
          <label htmlFor='regionFilter' className={formClasses.label}>
            Регион происхождения
          </label>
          <select
            id='regionFilter'
            className={formClasses.select}
            value={filterParams.regionId || ''}
            onChange={handleRegionFilterChange}
          >
            <option value=''>Все регионы</option>
            {regionOptions.map((region) => (
              <option key={region.id} value={region.id}>
                {region.name}
              </option>
            ))}
          </select>
        </div>

        {/* Фильтр по экспозиции */}
        {expositionOptions.length > 0 && (
          <div className='mb-4'>
            <label htmlFor='expositionFilter' className={formClasses.label}>
              Экспозиция
            </label>
            <select
              id='expositionFilter'
              className={formClasses.select}
              value={filterParams.expositionId || ''}
              onChange={handleExpositionFilterChange}
            >
              <option value=''>Все экспозиции</option>
              {expositionOptions.map((exposition) => (
                <option key={exposition.id} value={exposition.id}>
                  {exposition.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Кнопка поиска */}
      <div className='flex justify-end'>
        <button
          className={`${buttonClasses.primary} flex items-center`}
          onClick={handleSearch}
        >
          <SearchIcon className='mr-2' /> Поиск
        </button>
      </div>
    </div>
  );
};
