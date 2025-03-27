import React from 'react';
import Button from '../../../../../modules/ui/components/Button';
import { galleryHeaderStyles } from '../../../styles';

interface GalleryHeaderProps {
  onAddClick: () => void;
}

const GalleryHeader: React.FC<GalleryHeaderProps> = ({ onAddClick }) => {
  return (
    <div className={galleryHeaderStyles.container}>
      <h2 className={galleryHeaderStyles.title}>Фотографии растения</h2>
      <Button 
        variant="primary" 
        size="small" 
        onClick={onAddClick}
        className="ml-auto"
        leftIcon={
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
        }
      >
        Добавить фото
      </Button>
    </div>
  );
};

export default GalleryHeader; 