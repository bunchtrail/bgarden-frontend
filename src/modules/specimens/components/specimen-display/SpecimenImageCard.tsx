import React, { useState } from 'react';
import Card from '../../../../modules/ui/components/Card';
import { Specimen } from '../../types';
import { cardClasses, textClasses, animationClasses } from '../../../../styles/global-styles';
import { useSpecimenImage } from '../../hooks';
import Button from '../../../../modules/ui/components/Button';
import Modal from '../../../../modules/ui/components/Modal';
import ImageUploader from '../specimen-form/ImageUploader';
import useNotification from '../../../../modules/notifications/hooks/useNotification';
import { useAuth } from '../../../auth/hooks';

interface SpecimenImageCardProps {
  specimen: Specimen;
}

/**
 * Компонент для отображения фотографии образца
 */
const SpecimenImageCard: React.FC<SpecimenImageCardProps> = ({ specimen }) => {
  // Состояния для управления модальным окном и изображениями
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const { isAuthenticated } = useAuth();
  
  // Используем сервис уведомлений
  const notification = useNotification();
  
  // Используем хук для работы с изображениями
  const { 
    imageSrc, 
    isLoading, 
    handleImageError, 
    uploadImage, 
    isUploading, 
    uploadProgress,
    placeholderImage,
  } = useSpecimenImage(
    specimen.id,
    specimen.imageUrl
  );
  
  // Обработчик закрытия модального окна
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedImages([]);
  };
  
  // Обработчик выбора изображений
  const handleImagesChange = (files: File[]) => {
    setSelectedImages(files);
  };
  
  // Обработчик ошибок загрузки изображений
  const handleUploadError = (message: string) => {
    notification.error(message);
  };
  
  // Обработчик открытия модального окна
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
  
  // Обработчик сохранения изображений
  const handleSaveImage = async () => {
    if (selectedImages.length === 0) {
      notification.warning('Сначала выберите изображение');
      return;
    }
    
    try {
      notification.info('Загрузка изображения...', { duration: 3000 });
      
      // Загружаем изображение и устанавливаем его как основное
      await uploadImage(selectedImages, { isMain: true });
      
      notification.success('Изображение образца успешно обновлено', { duration: 5000 });
      
      // Закрываем модальное окно
      handleCloseModal();
    } catch (error: any) {
      console.error('Ошибка при загрузке изображения:', error);
      notification.error(`Ошибка при загрузке изображения: ${error.message || 'Неизвестная ошибка'}`);
    }
  };
  
  return (
    <Card className={`${cardClasses.elevated} ${animationClasses.transition} ${animationClasses.springHover}`}>
      <div className={cardClasses.header}>
        <h2 className={cardClasses.title}>Фотография растения</h2>
        {isAuthenticated && (
          <Button 
            variant="primary" 
            size="small" 
            onClick={handleOpenModal}
            className="ml-auto"
            leftIcon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            }
          >
            Изменить фото
          </Button>
        )}
      </div>
      <div className={cardClasses.content}>
        <div className="flex flex-col items-center">
          <div className="w-full h-64 overflow-hidden rounded-lg mb-3">
            {isLoading ? (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <span className="text-gray-500">Загрузка изображения...</span>
              </div>
            ) : imageSrc === '/images/specimens/placeholder.jpg' ? (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 border-2 border-dashed border-gray-200">
                <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <p className="mt-2 text-gray-500 font-medium">Изображение отсутствует</p>
                {isAuthenticated ? (
                  <p className="text-xs text-gray-400 mt-1">Добавьте изображение растения, нажав на кнопку "Изменить фото"</p>
                ) : (
                  <p className="text-xs text-gray-400 mt-1">Изображение не добавлено</p>
                )}
              </div>
            ) : (
              <img
                src={imageSrc || placeholderImage}
                alt={`${specimen.russianName} (${specimen.latinName})`}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                onError={handleImageError}
              />
            )}
          </div>
          <div className="text-center mt-2 w-full">
            <p className={`${textClasses.small} ${textClasses.secondary}`}>
              {specimen.russianName}
            </p>
            <p className={`${textClasses.small} italic ${textClasses.secondary}`}>
              {specimen.latinName}
            </p>
          </div>
        </div>
      </div>
      
      {/* Модальное окно для изменения изображения */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Изменение фотографии образца"
        size="medium"
        animation="fade"
        footer={
          <div className="flex justify-end space-x-2">
            <Button 
              variant="neutral" 
              onClick={handleCloseModal}
            >
              Отмена
            </Button>
            <Button 
              variant="primary" 
              onClick={handleSaveImage}
              isLoading={isUploading}
            >
              Сохранить
            </Button>
          </div>
        }
      >
        <div className="p-4">
          <ImageUploader
            onChange={handleImagesChange}
            value={selectedImages}
            onError={handleUploadError}
            maxImages={1}
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
    </Card>
  );
};

export default SpecimenImageCard; 