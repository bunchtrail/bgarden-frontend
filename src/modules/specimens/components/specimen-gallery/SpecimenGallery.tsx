import React, { useState } from 'react';
import { specimenContainerClasses } from '../styles';

interface SpecimenImage {
  id: number;
  url: string;
  title: string;
  description?: string;
}

interface SpecimenGalleryProps {
  images: SpecimenImage[];
  specimenName: string;
}

export const SpecimenGallery: React.FC<SpecimenGalleryProps> = ({
  images,
  specimenName,
}) => {
  const [selectedImage, setSelectedImage] = useState<SpecimenImage | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (image: SpecimenImage) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const nextImage = () => {
    if (!selectedImage) return;
    const currentIndex = images.findIndex((img) => img.id === selectedImage.id);
    const nextIndex = (currentIndex + 1) % images.length;
    setSelectedImage(images[nextIndex]);
  };

  const prevImage = () => {
    if (!selectedImage) return;
    const currentIndex = images.findIndex((img) => img.id === selectedImage.id);
    const prevIndex = (currentIndex - 1 + images.length) % images.length;
    setSelectedImage(images[prevIndex]);
  };

  // Если нет изображений, показываем заглушку
  if (images.length === 0) {
    return (
      <div className={`${specimenContainerClasses.card} p-4 mb-6`}>
        <h3 className='text-lg font-semibold mb-2'>Фотогалерея</h3>
        <div className='h-40 flex items-center justify-center bg-gray-100 rounded-md'>
          <p className='text-gray-500'>Изображения отсутствуют</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={`${specimenContainerClasses.card} p-4 mb-6`}>
        <h3 className='text-lg font-semibold mb-2'>Фотогалерея</h3>
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2'>
          {images.map((image) => (
            <div
              key={image.id}
              className='relative h-32 overflow-hidden rounded-md cursor-pointer shadow-sm hover:shadow-md transition-shadow duration-200'
              onClick={() => openModal(image)}
            >
              <img
                src={image.url}
                alt={image.title}
                className='object-cover w-full h-full'
              />
              <div className='absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-1 text-xs truncate'>
                {image.title}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Модальное окно для просмотра изображений */}
      {isModalOpen && selectedImage && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 p-4'>
          <div className='bg-white rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col'>
            <div className='p-4 border-b flex justify-between items-center'>
              <h3 className='text-lg font-semibold'>{selectedImage.title}</h3>
              <button
                onClick={closeModal}
                className='text-gray-700 hover:text-gray-900 focus:outline-none'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-6 w-6'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M6 18L18 6M6 6l12 12'
                  />
                </svg>
              </button>
            </div>

            <div className='relative flex-grow overflow-auto'>
              <img
                src={selectedImage.url}
                alt={selectedImage.title}
                className='object-contain max-h-[60vh] w-full'
              />

              {/* Кнопки навигации */}
              <button
                onClick={prevImage}
                className='absolute left-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-2 shadow-md hover:bg-opacity-100 transition-all'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-6 w-6'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M15 19l-7-7 7-7'
                  />
                </svg>
              </button>

              <button
                onClick={nextImage}
                className='absolute right-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-2 shadow-md hover:bg-opacity-100 transition-all'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-6 w-6'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9 5l7 7-7 7'
                  />
                </svg>
              </button>
            </div>

            {selectedImage.description && (
              <div className='p-4 border-t'>
                <p className='text-gray-700'>{selectedImage.description}</p>
              </div>
            )}

            <div className='p-2 border-t'>
              <p className='text-xs text-gray-500'>
                {`Образец: ${specimenName} | Изображение ${
                  images.findIndex((img) => img.id === selectedImage.id) + 1
                } из ${images.length}`}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}; 