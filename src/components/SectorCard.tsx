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
      <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg border border-[#E5E5EA] h-full flex flex-col transition-all duration-500 hover:border-transparent will-change-transform">
        <div className="h-52 sm:h-64 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-30 group-hover:opacity-10 transition-opacity duration-500 z-10"></div>
          <div className="transform-gpu transition-transform duration-500 group-hover:scale-105 h-full">
            <AbstractPattern 
              type={patternType} 
              height="h-full"
            />
          </div>
        </div>
        
        <div className="p-6 flex-1 flex flex-col relative">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#E5E5EA] via-[#0A84FF]/30 to-[#E5E5EA] 
                        opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <div className="relative mb-6 mt-2 overflow-hidden">
            <h3 className="text-3xl font-bold text-[#1D1D1F] group-hover:text-[#0A84FF] transition-colors duration-500">{title}</h3>
            
            <div className="absolute bottom-0 left-0 h-1 w-12 bg-[#0A84FF]/70 rounded-full 
                         transform translate-y-6 group-hover:translate-y-2 transition-transform duration-500"></div>
          </div>
          
          <div className="mt-auto flex items-center justify-end">
            <span className="inline-flex items-center text-[#0A84FF] text-sm font-medium group-hover:translate-x-1 transition-transform duration-300">
              Перейти к разделу
              <svg
                className="w-4 h-4 ml-1.5"
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
