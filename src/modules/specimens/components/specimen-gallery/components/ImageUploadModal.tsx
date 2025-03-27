import React from 'react';
import Button from '../../../../../modules/ui/components/Button';
import Modal from '../../../../../modules/ui/components/Modal';
import ImageUploader from '../../specimen-form/ImageUploader';

interface ImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  onChange: (files: File[]) => void;
  selectedImages: File[];
  onError: (message: string) => void;
  isUploading: boolean;
  uploadProgress: number;
}

const ImageUploadModal: React.FC<ImageUploadModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  onChange, 
  selectedImages, 
  onError, 
  isUploading, 
  uploadProgress 
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Добавление фотографий образца"
      size="medium"
      animation="fade"
      footer={
        <div className="flex justify-end space-x-2">
          <Button 
            variant="neutral" 
            onClick={onClose}
          >
            Отмена
          </Button>
          <Button 
            variant="primary" 
            onClick={onSave}
            isLoading={isUploading}
          >
            Сохранить
          </Button>
        </div>
      }
    >
      <div className="p-4">
        <ImageUploader
          onChange={onChange}
          value={selectedImages}
          onError={onError}
          maxImages={5}
        />
        
        {isUploading && (
          <div className="mt-2">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-green-600 h-2.5 rounded-full" 
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-1">Загрузка: {uploadProgress}%</p>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ImageUploadModal; 