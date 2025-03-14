import React from 'react';
import { Link } from 'react-router-dom';
import { SectorType } from '../modules/specimens/types';
import { appStyles } from '../styles/global-styles';
import AbstractPattern, { PatternType } from './AbstractPattern';

interface SectorCardProps {
  id: SectorType;
  title: string;
  description: string;
  imageUrl?: string;
  patternType: PatternType;
}

const SectorCard: React.FC<SectorCardProps> = ({
  id,
  title,
  description,
  imageUrl,
  patternType,
}) => {
  return (
    <Link
      to={`/specimens?sector=${id}`}
      className='block w-full h-full group'
    >
      <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg border border-[#E5E5EA] h-full flex flex-col transition-all duration-300 hover:border-transparent will-change-transform">
        <div className="h-52 sm:h-60 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-20 group-hover:opacity-0 transition-opacity duration-300 z-10"></div>
          <div className="transform-gpu transition-transform duration-500 group-hover:scale-105 h-full">
            <AbstractPattern 
              type={patternType} 
              height="h-full"
            />
          </div>
          
          <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/0 group-hover:bg-white/10 transition-colors duration-300 z-20"></div>
          <div className="absolute bottom-4 left-4 w-8 h-8 rounded-full bg-white/0 group-hover:bg-white/10 transition-colors duration-300 z-20"></div>
        </div>
        
        <div className="p-6 flex-1 flex flex-col relative">
          <div className="absolute top-14 left-6 right-6 h-0.5 bg-[#E5E5EA] opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
          
          <h3 className="text-2xl font-bold text-[#1D1D1F] mb-4 group-hover:text-[#0A84FF] transition-colors duration-300">{title}</h3>
          <p className="text-[#86868B] text-sm leading-relaxed flex-1 mb-6">{description}</p>
          
          <div className="mt-auto flex items-center justify-end">
            <span className="inline-flex items-center text-[#0A84FF] text-sm font-medium group-hover:translate-x-1 transition-transform duration-300">
              Перейти к разделу
              <svg
                className="w-4 h-4 ml-1 transform transition-transform duration-300 group-hover:translate-x-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default SectorCard;
