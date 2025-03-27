/**
 * Общие стили для модуля образцов
 */

// Импортируем стили галереи
import galleryStyles, {
  galleryContainerStyles,
  galleryHeaderStyles,
  mainImageStyles,
  imageCounterStyles,
  thumbnailStyles,
  specimenInfoStyles,
  imageViewModalStyles,
  imageUploadModalStyles,
  errorStateStyles
} from './specimen-gallery-styles';

// Цвета для типов секторов
export const sectorTypeColors = {
  // Дендрология (деревья и кустарники) - зеленые оттенки
  0: {
    bg: 'bg-green-100',
    border: 'border-green-300',
    text: 'text-green-800',
    hoverBg: 'hover:bg-green-200',
  },
  // Флора (цветковые растения) - фиолетовые оттенки
  1: {
    bg: 'bg-purple-100',
    border: 'border-purple-300',
    text: 'text-purple-800',
    hoverBg: 'hover:bg-purple-200',
  },
  // Цветущие растения - розовые оттенки
  2: {
    bg: 'bg-pink-100',
    border: 'border-pink-300',
    text: 'text-pink-800',
    hoverBg: 'hover:bg-pink-200',
  },
};

// Стили для статусов сохранения
export const statusColors = {
  success: {
    bg: 'bg-green-100',
    border: 'border-green-300',
    text: 'text-green-800',
  },
  error: {
    bg: 'bg-red-100',
    border: 'border-red-300',
    text: 'text-red-800',
  },
  warning: {
    bg: 'bg-yellow-100',
    border: 'border-yellow-300',
    text: 'text-yellow-800',
  },
  info: {
    bg: 'bg-blue-100',
    border: 'border-blue-300',
    text: 'text-blue-800',
  },
};

// Стили для форм
export const formStyles = {
  input: 'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
  select: 'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
  textarea: 'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
  checkbox: 'h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500',
  radio: 'h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500',
  label: 'block text-sm font-medium text-gray-700 mb-1',
  errorText: 'text-red-600 text-sm mt-1',
  fieldset: 'p-4 border rounded-md',
  legend: 'text-lg font-medium px-2',
};

// Стили для кнопок
export const buttonStyles = {
  primary: 'px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
  secondary: 'px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2',
  danger: 'px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2',
  success: 'px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2',
};

// Реэкспортируем стили галереи
export { 
  galleryContainerStyles,
  galleryHeaderStyles, 
  mainImageStyles,
  imageCounterStyles,
  thumbnailStyles,
  specimenInfoStyles,
  imageViewModalStyles,
  imageUploadModalStyles,
  errorStateStyles
};

export default {
  sectorTypeColors,
  statusColors,
  formStyles,
  buttonStyles,
  gallery: galleryStyles,
}; 