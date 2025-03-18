import React from 'react';

export type PatternType = 'dendrology' | 'flora' | 'flowering';

interface AbstractPatternProps {
  type: PatternType;
  className?: string;
}

const AbstractPattern: React.FC<AbstractPatternProps> = ({ type, className = '' }) => {
  // Здесь должна быть логика отображения абстрактного паттерна в зависимости от типа
  // Это заглушка, которую нужно реализовать
  
  const patternClasses = {
    dendrology: 'bg-gradient-to-br from-green-100 to-green-200',
    flora: 'bg-gradient-to-br from-blue-100 to-indigo-200',
    flowering: 'bg-gradient-to-br from-pink-100 to-yellow-200'
  };
  
  return (
    <div className={`absolute inset-0 opacity-50 ${patternClasses[type]} ${className}`}></div>
  );
};

export default AbstractPattern; 