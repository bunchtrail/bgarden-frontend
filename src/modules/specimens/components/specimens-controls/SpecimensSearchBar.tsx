import React, { useState } from 'react';
import { cardClasses, buttonClasses } from '@/styles/global-styles';

type SearchCategory = 'all' | 'name' | 'id' | 'family';

interface SpecimensSearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchCategory: SearchCategory;
  setSearchCategory: (category: SearchCategory) => void;
}

/**
 * Улучшенный компонент строки поиска образцов в стиле формы
 */
const SpecimensSearchBar: React.FC<SpecimensSearchBarProps> = ({
  searchQuery,
  setSearchQuery,
  searchCategory,
  setSearchCategory
}) => {
  const [focused, setFocused] = useState(false);
  
  const categoryLabels = {
    all: 'Везде',
    name: 'По названию',
    id: 'По номеру',
    family: 'По семейству'
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Дополнительная логика поиска при необходимости
  };
  
  const getPlaceholder = () => {
    switch(searchCategory) {
      case 'name': return 'Введите название растения...';
      case 'id': return 'Введите инвентарный номер...';
      case 'family': return 'Введите название семейства...';
      default: return 'Поиск по растениям в коллекции...';
    }
  };
  
  return (
    <form onSubmit={handleSearch} className={`${cardClasses.outlined} ${focused ? 'ring-2 ring-[#0A84FF]' : ''} rounded-xl overflow-hidden transition-all duration-200`}>
      <div className="flex flex-col md:flex-row">
        {/* Строка поиска */}
        <div className="flex-grow relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          <input
            type="text"
            className="w-full px-4 py-4 pl-12 border-0 focus:outline-none bg-white transition-all duration-200"
            placeholder={getPlaceholder()}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          />
          
          {searchQuery && (
            <button 
              type="button"
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
              onClick={() => setSearchQuery('')}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        
        {/* Разделитель для десктопной версии */}
        <div className="hidden md:block w-px bg-gray-200 my-2"></div>
        
        {/* Категории поиска */}
        <div className="flex items-center px-4 py-2 md:py-0 border-t md:border-t-0 border-gray-200">
          <div className="flex-grow md:flex-grow-0 flex space-x-2">
            {(Object.keys(categoryLabels) as Array<keyof typeof categoryLabels>).map((category) => (
              <button
                key={category}
                type="button"
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  searchCategory === category
                    ? 'bg-[#E1F0FF] text-[#0A84FF]'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                onClick={() => setSearchCategory(category)}
              >
                {categoryLabels[category]}
              </button>
            ))}
          </div>
          
          <button
            type="submit"
            className={`${buttonClasses.base} ${buttonClasses.primary} ml-2 px-4 whitespace-nowrap`}
          >
            Найти
          </button>
        </div>
      </div>
    </form>
  );
};

export default SpecimensSearchBar; 