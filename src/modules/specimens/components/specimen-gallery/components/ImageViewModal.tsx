import React from 'react';
import Button from '../../../../../modules/ui/components/Button';
import Modal from '../../../../../modules/ui/components/Modal';
import { SpecimenImage } from '../../../types';

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
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Изображение: ${specimenName}`}
      size="large"
      animation="fade"
      blockScroll={true}
      footer={
        <div className="flex justify-between items-center w-full">
          <div>
            <Button 
              variant="danger" 
              size="small"
              onClick={() => onDelete(currentImage.id)}
              className="mr-2"
            >
              Удалить
            </Button>
            {!currentImage.isMain && (
              <Button 
                variant="secondary" 
                size="small"
                onClick={() => onSetMain(currentImage.id)}
              >
                Сделать основным
              </Button>
            )}
          </div>
          <Button variant="neutral" onClick={onClose}>
            Закрыть
          </Button>
        </div>
      }
    >
      <div className="flex flex-col items-center p-4">
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