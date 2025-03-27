import React from 'react';
import { imageCounterStyles } from '../../../styles';

interface ImageCounterProps {
  currentIndex: number;
  totalImages: number;
}

const ImageCounter: React.FC<ImageCounterProps> = ({ currentIndex, totalImages }) => {
  if (totalImages <= 0) return null;
  
  return (
    <div className={imageCounterStyles.container}>
      <span className={imageCounterStyles.activeText}>
        {currentIndex + 1}
      </span> из {totalImages}
    </div>
  );
};

export default ImageCounter; 