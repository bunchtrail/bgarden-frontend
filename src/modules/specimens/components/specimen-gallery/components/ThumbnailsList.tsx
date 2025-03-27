import React from 'react';
import { SpecimenImage } from '../../../types';

interface ThumbnailsListProps {
  images: SpecimenImage[];
  currentIndex: number;
  onThumbnailClick: (index: number) => void;
}

const ThumbnailsList: React.FC<ThumbnailsListProps> = ({ 
  images, 
  currentIndex, 
  onThumbnailClick 
}) => {
  if (images.length <= 1) return null;
  
  return (
    <div className="flex overflow-x-auto space-x-3 mt-3 pb-2 px-1 max-w-full scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
      {images.map((image, index) => (
        <div 
          key={image.id} 
          className={`relative flex-shrink-0 w-20 h-20 cursor-pointer rounded-lg overflow-hidden transition-all duration-300 transform 
            ${currentIndex === index 
              ? 'ring-2 ring-green-500 scale-[1.05] shadow-md z-10' 
              : 'filter brightness-90 hover:brightness-100 hover:scale-[1.03]'}`}
          onClick={() => onThumbnailClick(index)}
        >
          <img 
            src={`data:${image.contentType};base64,${image.imageDataBase64}`} 
            alt={`Миниатюра ${index + 1}`}
            className="w-full h-full object-cover transition-transform duration-300"
          />
          {image.isMain && (
            <div className="absolute top-1 right-1 bg-green-500 rounded-full w-5 h-5 flex items-center justify-center shadow-sm">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ThumbnailsList; 