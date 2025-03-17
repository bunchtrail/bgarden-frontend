import React from 'react';
import { cardClasses } from '../../../styles/global-styles';

interface SpecimensSearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

/**
 * Компонент строки поиска образцов
 */
const SpecimensSearchBar: React.FC<SpecimensSearchBarProps> = ({
  searchQuery,
  setSearchQuery
}) => {
  return (
    <div className={`mb-4 p-5 ${cardClasses.elevated}`}>
      <div className="relative">
        <input
          type="text"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg pl-12 focus:outline-none focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent transition-all duration-200"
          placeholder="Поиск по названию, номеру, семейству..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        {searchQuery && (
          <button 
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
            onClick={() => setSearchQuery('')}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default SpecimensSearchBar; 