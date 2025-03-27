/**
 * Единый файл стилей для галереи образцов растений
 * Здесь собраны все стили, используемые в компонентах галереи
 */

// Основные стили галереи
export const galleryContainerStyles = {
  wrapper: 'w-full h-full',
};

// Стили для заголовка галереи
export const galleryHeaderStyles = {
  container: 'flex items-center justify-between mb-4',
  title: 'text-lg font-medium text-gray-800',
  addButton: 'p-2 rounded-full text-blue-600 hover:bg-blue-100 transition-colors',
};

// Стили для основного отображения изображения
export const mainImageStyles = {
  container: 'w-full h-80 overflow-hidden rounded-xl mb-3 relative group',
  image: 'w-full h-full object-contain transition-transform duration-300',
  placeholder: 'w-full h-full flex items-center justify-center bg-gray-100 rounded-xl',
  overlay: 'absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity',
  navigationContainer: 'absolute inset-0 flex items-center justify-between px-3',
  navigationButton: 'p-2 rounded-full bg-white bg-opacity-70 hover:bg-opacity-100 transition-all transform hover:scale-110',
  errorContainer: 'w-full h-full flex flex-col items-center justify-center bg-red-50 rounded-xl text-red-500',
  loaderContainer: 'w-full h-full flex items-center justify-center bg-gray-50',
};

// Стили для счетчика изображений
export const imageCounterStyles = {
  container: 'flex items-center justify-center mb-2 text-sm text-gray-500',
  activeText: 'font-medium text-blue-600',
};

// Стили для списка миниатюр
export const thumbnailStyles = {
  container: 'flex items-center justify-center gap-2 flex-wrap mb-3 overflow-x-auto',
  thumbnail: 'w-14 h-14 rounded-md object-cover cursor-pointer border-2 border-transparent transition-all',
  activeThumbnail: 'border-blue-500 shadow-md',
  thumbnailWrapper: 'relative',
  indicator: 'absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs',
};

// Стили для подвала с информацией об образце
export const specimenInfoStyles = {
  container: 'mt-3 text-center',
  russianName: 'text-lg font-medium text-gray-800',
  latinName: 'text-sm italic text-gray-500',
};

// Стили для модального окна просмотра изображений
export const imageViewModalStyles = {
  content: 'rounded-lg p-0 overflow-hidden max-w-4xl w-full mx-auto my-8',
  backdropOverlay: 'fixed inset-0 bg-black bg-opacity-75 transition-opacity',
  image: 'w-full h-auto max-h-[70vh] object-contain',
  controls: 'flex items-center justify-between p-4 bg-white',
  closeButton: 'p-2 rounded-full hover:bg-gray-100 transition-colors',
  actionButton: 'flex items-center gap-1 px-3 py-1.5 rounded-md text-sm',
  primaryButton: 'bg-blue-50 text-blue-600 hover:bg-blue-100',
  dangerButton: 'bg-red-50 text-red-600 hover:bg-red-100',
};

// Стили для модального окна загрузки изображений
export const imageUploadModalStyles = {
  content: 'rounded-lg overflow-hidden max-w-2xl w-full mx-auto my-8',
  header: 'p-4 border-b',
  title: 'text-lg font-medium',
  body: 'p-4',
  dropzone: 'border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors',
  dropzoneActive: 'border-blue-500 bg-blue-50',
  previewContainer: 'grid grid-cols-3 gap-3 mt-4',
  previewItem: 'relative rounded-md overflow-hidden',
  previewImage: 'w-full h-24 object-cover',
  removeButton: 'absolute top-1 right-1 p-1 rounded-full bg-white bg-opacity-70 hover:bg-opacity-100 text-gray-700 hover:text-red-500',
  progressBar: 'h-2 bg-blue-100 rounded-full overflow-hidden',
  progressFill: 'h-full bg-blue-500 transition-all',
  footer: 'p-4 border-t flex justify-end gap-3',
  cancelButton: 'px-4 py-2 rounded-md border text-gray-700 hover:bg-gray-50',
  submitButton: 'px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700',
};

// Стили для состояния ошибки
export const errorStateStyles = {
  container: 'p-6 flex flex-col items-center justify-center text-center',
  icon: 'text-red-500 mb-2 w-12 h-12',
  heading: 'text-lg font-medium text-gray-800 mb-2',
  message: 'text-sm text-gray-500 mb-4',
  retryButton: 'px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700',
};

// Экспорт всех стилей
export default {
  galleryContainerStyles,
  galleryHeaderStyles,
  mainImageStyles,
  imageCounterStyles,
  thumbnailStyles,
  specimenInfoStyles,
  imageViewModalStyles,
  imageUploadModalStyles,
  errorStateStyles,
}; 