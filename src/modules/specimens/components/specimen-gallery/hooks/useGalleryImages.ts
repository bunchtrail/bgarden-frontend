import { useState, useEffect, useCallback } from 'react';
import { SpecimenImage } from '../../../types';
import { specimenService } from '../../../services';
import useNotification from '../../../../../modules/notifications/hooks/useNotification';
import { useSpecimenImage } from '../../../hooks';

interface UseGalleryImagesProps {
  specimenId: number;
  imageUrl?: string;
}

interface UseGalleryImagesReturn {
  allImages: SpecimenImage[];
  isLoading: boolean;
  error: string | null;
  currentImageIndex: number;
  selectedImageId: number | null;
  selectedImages: File[];
  isModalOpen: boolean;
  isUploadModalOpen: boolean;
  isUploading: boolean;
  uploadProgress: number;
  
  // Actions
  setCurrentImageIndex: (index: number) => void;
  handleOpenImageModal: (imageId: number) => void;
  handleCloseImageModal: () => void;
  handleOpenUploadModal: () => void;
  handleCloseUploadModal: () => void;
  handleNextImage: () => void;
  handlePrevImage: () => void;
  handleImagesChange: (files: File[]) => void;
  handleSaveImages: () => Promise<void>;
  handleUploadError: (message: string) => void;
  handleSetMainImage: (imageId: number) => Promise<void>;
  handleDeleteImage: (imageId: number) => Promise<void>;
  handleImageError: () => void;
  reloadImages: () => Promise<void>;
}

export const useGalleryImages = ({ specimenId, imageUrl }: UseGalleryImagesProps): UseGalleryImagesReturn => {
  const [allImages, setAllImages] = useState<SpecimenImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedImageId, setSelectedImageId] = useState<number | null>(null);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  
  const notification = useNotification();
  
  const { 
    imageSrc, 
    isLoading: isImageLoading, 
    handleImageError, 
    uploadImage, 
    isUploading, 
    uploadProgress,
    setImageAsMain,
    deleteImage
  } = useSpecimenImage(
    specimenId,
    imageUrl
  );
  
  // Загружаем все изображения
  const loadImages = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const images = await specimenService.getSpecimenImages(specimenId, true);
      setAllImages(images);

      // После загрузки изображений выбираем основное изображение
      const mainIndex = images.findIndex(img => img.isMain);
      setCurrentImageIndex(mainIndex !== -1 ? mainIndex : 0);

      setIsLoading(false);
    } catch (err) {
      console.error('Ошибка при загрузке изображений:', err);
      setError('Не удалось загрузить изображения образца');
      setIsLoading(false);
      notification.error('Не удалось загрузить все изображения образца');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [specimenId]); // Убираем notification из зависимостей
  
  // Загружаем изображения при монтировании компонента
  useEffect(() => {
    loadImages();
  }, [loadImages]);
  
  // Открытие модального окна для просмотра изображения
  const handleOpenImageModal = useCallback((imageId: number) => {
    setSelectedImageId(imageId);
    setIsModalOpen(true);
  }, []);
  
  // Закрытие модального окна просмотра
  const handleCloseImageModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedImageId(null);
  }, []);
  
  // Открытие модального окна загрузки
  const handleOpenUploadModal = useCallback(() => {
    setIsUploadModalOpen(true);
  }, []);
  
  // Закрытие модального окна загрузки
  const handleCloseUploadModal = useCallback(() => {
    setIsUploadModalOpen(false);
    setSelectedImages([]);
  }, []);
  
  // Переход к следующему изображению
  const handleNextImage = useCallback(() => {
    setCurrentImageIndex(prevIndex => 
      prevIndex === allImages.length - 1 ? 0 : prevIndex + 1
    );
  }, [allImages.length]);
  
  // Переход к предыдущему изображению
  const handlePrevImage = useCallback(() => {
    setCurrentImageIndex(prevIndex => 
      prevIndex === 0 ? allImages.length - 1 : prevIndex - 1
    );
  }, [allImages.length]);
  
  // Обработчик выбора изображений
  const handleImagesChange = useCallback((files: File[]) => {
    setSelectedImages(files);
  }, []);
  
  // Обработчик ошибок загрузки
  const handleUploadError = useCallback((message: string) => {
    notification.error(message);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Обработчик сохранения изображений
  const handleSaveImages = useCallback(async () => {
    if (selectedImages.length === 0) {
      notification.warning('Не выбрано ни одного изображения');
      return;
    }
    
    try {
      await uploadImage(selectedImages, {
        isMain: allImages.length === 0
      });
      
      await loadImages();
      handleCloseUploadModal();
      notification.success('Изображения успешно загружены');
    } catch (error) {
      console.error('Ошибка при загрузке изображений:', error);
      notification.error('Не удалось загрузить изображения');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedImages, uploadImage, allImages.length, loadImages, handleCloseUploadModal]);
  
  // Установка изображения как основного
  const handleSetMainImage = useCallback(async (imageId: number) => {
    try {
      await setImageAsMain(imageId);
      notification.success('Изображение установлено как основное');
      await loadImages();
    } catch (error) {
      console.error('Ошибка при установке основного изображения:', error);
      notification.error('Не удалось установить изображение как основное');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setImageAsMain, loadImages]);
  
  // Удаление изображения
  const handleDeleteImage = useCallback(async (imageId: number) => {
    if (!window.confirm('Вы уверены, что хотите удалить это изображение?')) {
      return;
    }
    
    try {
      await deleteImage(imageId);
      await loadImages();
      
      // Если удалили текущее изображение, переходим к первому
      if (currentImageIndex >= allImages.length - 1) {
        setCurrentImageIndex(allImages.length > 1 ? allImages.length - 2 : 0);
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteImage, loadImages, currentImageIndex, allImages.length, isModalOpen, handleCloseImageModal]);
  
  // Перезагрузка изображений
  const reloadImages = useCallback(async () => {
    await loadImages();
  }, [loadImages]);
  
  return {
    allImages,
    isLoading: isLoading || isImageLoading,
    error,
    currentImageIndex,
    selectedImageId,
    selectedImages,
    isModalOpen,
    isUploadModalOpen,
    isUploading,
    uploadProgress,
    
    setCurrentImageIndex,
    handleOpenImageModal,
    handleCloseImageModal,
    handleOpenUploadModal,
    handleCloseUploadModal,
    handleNextImage,
    handlePrevImage,
    handleImagesChange,
    handleSaveImages,
    handleUploadError,
    handleSetMainImage,
    handleDeleteImage,
    handleImageError,
    reloadImages
  };
}; 