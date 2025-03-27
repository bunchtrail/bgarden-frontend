import React, { useState, useEffect } from 'react';
import { Specimen, SpecimenImage } from '../../types';
import { useSpecimenImage } from '../../hooks';
import { cardClasses, textClasses, animationClasses } from '../../../../styles/global-styles';
import Button from '../../../../modules/ui/components/Button';
import Card from '../../../../modules/ui/components/Card';
import Modal from '../../../../modules/ui/components/Modal';
import ImageUploader from '../specimen-form/ImageUploader';
import useNotification from '../../../../modules/notifications/hooks/useNotification';
import { specimenService } from '../../services';

interface SpecimenGalleryProps {
  specimen: Specimen;
}

/**
 * Компонент галереи для отображения нескольких фотографий образца
 */
const SpecimenGallery: React.FC<SpecimenGalleryProps> = ({ specimen }) => {
  // Состояния для управления модальным окном и изображениями
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedImageId, setSelectedImageId] = useState<number | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [allImages, setAllImages] = useState<SpecimenImage[]>([]);
  
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
    fetchAllImages,
    setImageAsMain,
    deleteImage
  } = useSpecimenImage(
    specimen.id,
    specimen.imageUrl
  );

  // Загружаем все изображения при монтировании компонента
  useEffect(() => {
    const loadImages = async () => {
      try {
        // Запрашиваем все изображения с данными (includeImageData=true)
        const images = await specimenService.getSpecimenImages(specimen.id, true);
        setAllImages(images);
      } catch (error) {
        console.error('Ошибка при загрузке изображений:', error);
        notification.error('Не удалось загрузить все изображения образца');
      }
    };
    
    loadImages();
  }, [specimen.id]);
  
  // Обработчик закрытия модального окна загрузки
  const handleCloseUploadModal = () => {
    setIsUploadModalOpen(false);
    setSelectedImages([]);
  };
  
  // Обработчик выбора изображений
  const handleImagesChange = (files: File[]) => {
    setSelectedImages(files);
  };
  
  // Обработчик сохранения изображений
  const handleSaveImages = async () => {
    if (selectedImages.length === 0) {
      notification.warning('Не выбрано ни одного изображения');
      return;
    }
    
    try {
      const result = await uploadImage(selectedImages, {
        isMain: allImages.length === 0, // Первое загруженное изображение становится основным
        onProgress: (progress) => console.log(`Прогресс загрузки: ${progress}%`)
      });
      
      // Обновляем список всех изображений
      const updatedImages = await specimenService.getSpecimenImages(specimen.id, true);
      setAllImages(updatedImages);
      
      // Закрываем модальное окно загрузки
      handleCloseUploadModal();
      notification.success('Изображения успешно загружены');
    } catch (error) {
      console.error('Ошибка при загрузке изображений:', error);
      notification.error('Не удалось загрузить изображения');
    }
  };
  
  // Обработчик ошибок загрузки изображений
  const handleUploadError = (message: string) => {
    notification.error(message);
  };
  
  // Обработчик открытия модального окна загрузки
  const handleOpenUploadModal = () => {
    setIsUploadModalOpen(true);
  };
  
  // Переход к следующему изображению
  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === allImages.length - 1 ? 0 : prevIndex + 1
    );
  };
  
  // Переход к предыдущему изображению
  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? allImages.length - 1 : prevIndex - 1
    );
  };
  
  // Открытие модального окна для просмотра изображения
  const handleOpenImageModal = (imageId: number) => {
    setSelectedImageId(imageId);
    setIsModalOpen(true);
  };
  
  // Закрытие модального окна просмотра
  const handleCloseImageModal = () => {
    setIsModalOpen(false);
    setSelectedImageId(null);
  };
  
  // Установка изображения как основного
  const handleSetMainImage = async (imageId: number) => {
    try {
      await setImageAsMain(imageId);
      notification.success('Изображение установлено как основное');
      
      // Обновляем список изображений
      const updatedImages = await specimenService.getSpecimenImages(specimen.id, true);
      setAllImages(updatedImages);
    } catch (error) {
      console.error('Ошибка при установке основного изображения:', error);
      notification.error('Не удалось установить изображение как основное');
    }
  };
  
  // Удаление изображения
  const handleDeleteImage = async (imageId: number) => {
    if (!window.confirm('Вы уверены, что хотите удалить это изображение?')) {
      return;
    }
    
    try {
      await deleteImage(imageId);
      
      // Обновляем список изображений
      const updatedImages = await specimenService.getSpecimenImages(specimen.id, true);
      setAllImages(updatedImages);
      
      // Если удалили текущее изображение, переходим к первому
      if (currentImageIndex >= updatedImages.length) {
        setCurrentImageIndex(updatedImages.length > 0 ? 0 : 0);
      }
      
      notification.success('Изображение успешно удалено');
      
      // Закрываем модальное окно, если оно открыто
      if (isModalOpen) {
        handleCloseImageModal();
      }
    } catch (error) {
      console.error('Ошибка при удалении изображения:', error);
      notification.error('Не удалось удалить изображение');
    }
  };
  
  // Получаем текущее изображение для отображения
  const currentImage = allImages.length > 0 ? allImages[currentImageIndex] : null;
  const currentImageSrc = currentImage 
    ? (currentImage.imageDataBase64 
        ? `data:${currentImage.contentType};base64,${currentImage.imageDataBase64}` 
        : `/api/v1/specimen-images/${currentImage.id}/content`)
    : '/images/specimens/placeholder.jpg';
  
  return (
    <Card className={`${cardClasses.elevated} ${animationClasses.transition} ${animationClasses.springHover}`}>
      <div className={cardClasses.header}>
        <h2 className={cardClasses.title}>Фотографии растения</h2>
        <Button 
          variant="primary" 
          size="small" 
          onClick={handleOpenUploadModal}
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
      
      <div className="flex flex-col items-center">
        <div className="w-full h-64 overflow-hidden rounded-lg mb-3 relative">
          {isLoading ? (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <span className="text-gray-500">Загрузка изображений...</span>
            </div>
          ) : allImages.length === 0 ? (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 border-2 border-dashed border-gray-200">
              <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              <p className="mt-2 text-gray-500 font-medium">Изображения отсутствуют</p>
              <p className="text-xs text-gray-400 mt-1">Добавьте изображения растения, нажав на кнопку "Добавить фото"</p>
            </div>
          ) : (
            <>
              <img 
                src={currentImageSrc} 
                alt={`${specimen.russianName} (${specimen.latinName})`}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                onError={handleImageError}
                onClick={() => currentImage && handleOpenImageModal(currentImage.id)}
              />
              
              {/* Навигационные кнопки для переключения изображений */}
              {allImages.length > 1 && (
                <>
                  <button 
                    onClick={handlePrevImage}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-2 hover:bg-opacity-90 transition-all"
                    aria-label="Предыдущее изображение"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                    </svg>
                  </button>
                  <button 
                    onClick={handleNextImage}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-2 hover:bg-opacity-90 transition-all"
                    aria-label="Следующее изображение"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </button>
                </>
              )}
            </>
          )}
        </div>
        
        {/* Индикатор количества изображений */}
        {allImages.length > 0 && (
          <div className="flex items-center justify-center mt-2 mb-3">
            <span className={`${textClasses.small} ${textClasses.secondary}`}>
              {currentImageIndex + 1} из {allImages.length}
            </span>
          </div>
        )}
        
        {/* Миниатюры изображений */}
        {allImages.length > 1 && (
          <div className="flex overflow-x-auto space-x-2 mt-2 pb-2 max-w-full">
            {allImages.map((image, index) => (
              <div 
                key={image.id} 
                className={`relative flex-shrink-0 w-16 h-16 cursor-pointer ${currentImageIndex === index ? 'ring-2 ring-green-500' : ''}`}
                onClick={() => setCurrentImageIndex(index)}
              >
                <img 
                  src={`data:${image.contentType};base64,${image.imageDataBase64}`} 
                  alt={`Миниатюра ${index + 1}`}
                  className="w-full h-full object-cover rounded"
                />
                {image.isMain && (
                  <div className="absolute top-0 right-0 bg-green-500 rounded-full w-4 h-4 flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        
        <div className="w-full text-center mt-2">
          <p className={`${textClasses.small} ${textClasses.secondary}`}>
            {specimen.russianName}
          </p>
          <p className={`${textClasses.small} italic ${textClasses.secondary}`}>
            {specimen.latinName}
          </p>
        </div>
      </div>
      
      {/* Модальное окно для просмотра увеличенного изображения */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseImageModal}
        title={`Изображение: ${specimen.russianName}`}
        size="large"
        animation="fade"
        blockScroll={true}
        footer={
          <div className="flex justify-between items-center w-full">
            <div>
              {selectedImageId && currentImage && (
                <>
                  <Button 
                    variant="danger" 
                    size="small"
                    onClick={() => handleDeleteImage(currentImage.id)}
                    className="mr-2"
                  >
                    Удалить
                  </Button>
                  {!currentImage.isMain && (
                    <Button 
                      variant="secondary" 
                      size="small"
                      onClick={() => handleSetMainImage(currentImage.id)}
                    >
                      Сделать основным
                    </Button>
                  )}
                </>
              )}
            </div>
            <Button variant="neutral" onClick={handleCloseImageModal}>
              Закрыть
            </Button>
          </div>
        }
      >
        <div className="flex flex-col items-center p-4">
          <div className="w-full max-h-[70vh] overflow-hidden rounded-lg">
            {currentImage && (
              <img 
                src={`data:${currentImage.contentType};base64,${currentImage.imageDataBase64}`}
                alt={`${specimen.russianName} (${specimen.latinName})`}
                className="w-full h-full object-contain"
              />
            )}
          </div>
          {currentImage && currentImage.description && (
            <div className="mt-4 text-center">
              <p className="text-base text-gray-700">{currentImage.description}</p>
            </div>
          )}
        </div>
      </Modal>
      
      {/* Модальное окно для загрузки новых изображений */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={handleCloseUploadModal}
        title="Добавление фотографий образца"
        size="medium"
        animation="fade"
        footer={
          <div className="flex justify-end space-x-2">
            <Button 
              variant="neutral" 
              onClick={handleCloseUploadModal}
            >
              Отмена
            </Button>
            <Button 
              variant="primary" 
              onClick={handleSaveImages}
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
    </Card>
  );
};

export default SpecimenGallery; 