import React from 'react';

export type PatternType = 'flora' | 'dendrology' | 'flowering' | 'abstract' | 'geometric';

interface AbstractPatternProps {
  type: PatternType;
  className?: string;
  height?: string;
}

/**
 * Компонент для отображения легких абстрактных паттернов вместо тяжелых изображений
 */
const AbstractPattern: React.FC<AbstractPatternProps> = ({ 
  type, 
  className = '', 
  height = 'h-40'
}) => {
  
  // Набор паттернов с градиентами и формами
  const patterns = {
    dendrology: {
      bgColor: 'bg-gradient-to-br from-emerald-600 via-green-500 to-teal-700',
      pattern: (
        <div className="relative w-full h-full overflow-hidden will-change-transform">
          {/* Дерево (силуэт) */}
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-28">
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2 h-14 bg-white/20 rounded-sm"></div>
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-white/10 rounded-full"></div>
            <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 w-14 h-14 bg-white/15 rounded-full"></div>
            <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-white/20 rounded-full"></div>
          </div>
          
          {/* Статичные декоративные элементы */}
          <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-white/10"></div>
          <div className="absolute left-10 bottom-5 w-16 h-16 rounded-full bg-white/15"></div>
          <div className="absolute left-1/4 top-1/3 w-12 h-12 rounded-sm rotate-45 bg-white/10"></div>
          
          {/* Дополнительные листья */}
          <div className="absolute right-10 top-10 w-6 h-6 bg-white/10 rounded-full transform rotate-45"></div>
          <div className="absolute left-4 top-16 w-4 h-8 bg-white/10 rounded-full transform -rotate-12"></div>
        </div>
      ),
    },
    flora: {
      bgColor: 'bg-gradient-to-tr from-blue-600 via-indigo-500 to-blue-400',
      pattern: (
        <div className="relative w-full h-full overflow-hidden will-change-transform">
          {/* Цветок в центре */}
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 bg-white/20 rounded-full"></div>
              <div className="absolute left-1/2 top-0 transform -translate-x-1/2 w-6 h-10 rounded-full bg-white/15 origin-bottom rotate-0"></div>
              <div className="absolute left-1/2 top-0 transform -translate-x-1/2 w-6 h-10 rounded-full bg-white/15 origin-bottom rotate-60"></div>
              <div className="absolute left-1/2 top-0 transform -translate-x-1/2 w-6 h-10 rounded-full bg-white/15 origin-bottom rotate-120"></div>
              <div className="absolute left-1/2 top-0 transform -translate-x-1/2 w-6 h-10 rounded-full bg-white/15 origin-bottom rotate-180"></div>
              <div className="absolute left-1/2 top-0 transform -translate-x-1/2 w-6 h-10 rounded-full bg-white/15 origin-bottom rotate-240"></div>
              <div className="absolute left-1/2 top-0 transform -translate-x-1/2 w-6 h-10 rounded-full bg-white/15 origin-bottom rotate-300"></div>
            </div>
          </div>
          
          {/* Статичные декоративные элементы */}
          <div className="absolute right-8 bottom-4 w-20 h-20 rounded-full bg-white/10"></div>
          <div className="absolute left-4 top-3 w-14 h-14 rounded-full bg-white/15"></div>
          <div className="absolute right-1/3 top-1/3 w-10 h-16 rounded-lg bg-white/10"></div>
          
          {/* Дополнительные растения */}
          <div className="absolute left-10 bottom-10 w-3 h-12 bg-white/15 rounded-full"></div>
          <div className="absolute left-14 bottom-12 w-3 h-10 bg-white/15 rounded-full"></div>
          <div className="absolute left-18 bottom-8 w-3 h-14 bg-white/15 rounded-full"></div>
        </div>
      ),
    },
    flowering: {
      bgColor: 'bg-gradient-to-r from-pink-500 via-rose-500 to-pink-400',
      pattern: (
        <div className="relative w-full h-full overflow-hidden will-change-transform">
          {/* Цветочные элементы */}
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-70">
            <div className="relative w-24 h-24">
              <div className="absolute inset-3 rounded-full bg-white/20"></div>
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-full bg-white/25"></div>
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-full bg-white/25"></div>
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-white/25"></div>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-white/25"></div>
              <div className="absolute top-2 right-2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-white/25"></div>
              <div className="absolute bottom-2 left-2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-white/25"></div>
            </div>
          </div>
          
          {/* Статичные декоративные элементы */}
          <div className="absolute left-6 bottom-5 w-16 h-16 rounded-full bg-white/10"></div>
          <div className="absolute right-10 top-6 w-12 h-12 rounded-full bg-white/15"></div>
          <div className="absolute left-1/3 top-1/2 w-10 h-10 rounded-full bg-white/20"></div>
          
          {/* Стебли и листья */}
          <div className="absolute right-1/4 bottom-0 w-1 h-20 bg-white/15 rounded-full"></div>
          <div className="absolute right-1/4 bottom-16 w-10 h-5 bg-white/10 rounded-full transform -rotate-45"></div>
        </div>
      ),
    },
    abstract: {
      bgColor: 'bg-gradient-to-br from-purple-500 to-indigo-600',
      pattern: (
        <div className="relative w-full h-full overflow-hidden will-change-transform">
          <div className="absolute w-40 h-40 -right-10 -top-10 rounded-full bg-white/10"></div>
          <div className="absolute w-32 h-32 -left-10 -bottom-10 rounded-full bg-white/10"></div>
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-white/20"></div>
        </div>
      ),
    },
    geometric: {
      bgColor: 'bg-gradient-to-r from-amber-500 to-orange-600',
      pattern: (
        <div className="relative w-full h-full overflow-hidden will-change-transform">
          <div className="absolute left-5 top-5 w-14 h-14 rotate-45 bg-white/10"></div>
          <div className="absolute right-8 bottom-8 w-16 h-16 rotate-12 bg-white/15"></div>
          <div className="absolute right-1/4 top-1/4 w-10 h-10 rotate-45 bg-white/10"></div>
          <div className="absolute left-1/3 bottom-1/3 w-8 h-8 rotate-12 bg-white/15"></div>
        </div>
      ),
    },
  };
  
  // Выбираем нужный паттерн или используем абстрактный по умолчанию
  const selectedPattern = patterns[type] || patterns.abstract;
  
  return (
    <div className={`${height} overflow-hidden transform-gpu ${selectedPattern.bgColor} ${className}`}>
      {selectedPattern.pattern}
    </div>
  );
};

export default AbstractPattern; 