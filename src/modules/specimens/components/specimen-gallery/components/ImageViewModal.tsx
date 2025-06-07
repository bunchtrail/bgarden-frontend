import React from 'react';
import Button from '../../../../../modules/ui/components/Button';
import Modal from '../../../../../modules/ui/components/Modal';
import { SpecimenImage } from '../../../types';
import { imageViewModalStyles } from '../../../styles';
import { animationClasses } from '../../../../../styles/global-styles';

interface ImageViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentImage: SpecimenImage | null;
  specimenName: string;
  latinName: string;
  onDelete: (imageId: number) => void;
  onSetMain: (imageId: number) => void;
}

const ImageViewModal: React.FC<ImageViewModalProps> = ({ 
  isOpen, 
  onClose, 
  currentImage, 
  specimenName, 
  latinName, 
  onDelete, 
  onSetMain 
}) => {
  if (!currentImage) return null;
  
  // Базовые классы для кнопок
  const baseButtonClasses = `flex items-center py-1.5 ${animationClasses.transition}`;
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Изображение: ${specimenName} (${latinName})`}
      size="large"
      animation="fade"
      blockScroll={false}
      footer={
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-3">
            <Button 
              variant="danger" 
              size="small"
              onClick={() => onDelete(currentImage.id)}
              className={baseButtonClasses}
              leftIcon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
              }
            >
              Удалить
            </Button>
            {!currentImage.isMain && (
              <Button 
                variant="primary" 
                size="small"
                onClick={() => onSetMain(currentImage.id)}
                className={baseButtonClasses}
                leftIcon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                }
              >
                Сделать основным
              </Button>
            )}
          </div>
          <Button 
            variant="neutral" 
            onClick={onClose}
            className={baseButtonClasses}
          >
            Закрыть
          </Button>
        </div>
      }
    >
      <div className="flex flex-col items-center p-4">
        {currentImage.isMain && (
          <div className={imageViewModalStyles.mainImageBadge}>
            <span className="flex items-center">
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Основное изображение
            </span>
          </div>
        )}
        <div className="w-full max-h-[75vh] overflow-hidden rounded-lg transition-all duration-300">
          <img 
            src={`data:${currentImage.contentType};base64,${currentImage.imageDataBase64}`}
            alt={`${specimenName} (${latinName})`}
            className="w-full h-full object-contain transition-transform duration-300"
          />
        </div>
        {currentImage.description && (
          <div className="mt-4 text-center">
            <p className="text-base text-gray-700">{currentImage.description}</p>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ImageViewModal; 