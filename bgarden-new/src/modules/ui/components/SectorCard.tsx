import React from 'react';
import { Link } from 'react-router-dom';
import AbstractPattern, { PatternType } from './AbstractPattern';

export interface SectorCardProps {
  id?: string;
  title: string;
  description?: string;
  patternType: PatternType;
  imageUrl?: string;
  onClick?: () => void;
}

const SectorCard: React.FC<SectorCardProps> = ({ 
  id, 
  title, 
  description, 
  patternType,
  imageUrl,
  onClick
}) => {
  // Создаем компонент-обертку (либо Link, либо div, в зависимости от наличия id)
  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    if (id) {
      return <Link to={`/sectors/${id}`} className="block h-full">{children}</Link>;
    }
    
    return (
      <div 
        className={`block h-full ${onClick ? 'cursor-pointer' : ''}`} 
        onClick={onClick}
      >
        {children}
      </div>
    );
  };
  
  return (
    <Wrapper>
      <div className="relative overflow-hidden rounded-2xl h-full border border-[#E5E5EA]/80 bg-white/90 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-300">
        {/* Фоновая картинка или паттерн */}
        {imageUrl ? (
          <div className="absolute inset-0 opacity-50">
            <img 
              src={imageUrl} 
              alt={title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#00000040]"></div>
          </div>
        ) : (
          <AbstractPattern type={patternType} />
        )}
        
        <div className="relative z-10 p-6 h-full flex flex-col">
          <h3 className="text-xl font-semibold mb-2 text-[#1D1D1F]">{title}</h3>
          {description && (
            <p className="text-sm text-[#86868B] mb-4">{description}</p>
          )}
          <div className="mt-auto flex justify-end">
            <span className="text-sm font-medium text-[#3882F6] flex items-center">
              {id ? 'Перейти' : 'Подробнее'}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default SectorCard; 