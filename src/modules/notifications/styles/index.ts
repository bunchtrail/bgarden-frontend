// Стили для модуля уведомлений, интегрированные с глобальными стилями проекта

export const notificationStyles = {
  // Контейнер уведомлений
  container: [
    'fixed',
    'top-20',
    'right-4',
    'z-[9999]',
    'w-full',
    'max-w-md',
    'max-h-[calc(100vh-6rem)]',
    'overflow-y-auto',
    'overflow-x-hidden',
    'transition-all',
    'duration-300',
    'ease-out',
    // Мобильные устройства
    'sm:right-6',
    'sm:max-w-lg',
    // Планшеты и больше
    'lg:right-8',
    'lg:max-w-xl',
  ].join(' '),

  // Базовый элемент уведомления
  item: {
    base: [
      'bg-white/95',
      'backdrop-blur-sm',
      'border',
      'border-gray-200/60',
      'rounded-xl',
      'shadow-lg',
      'p-4',
      'transition-all',
      'duration-300',
      'ease-out',
      'will-change-transform',
      'border-l-4',
      'word-break',
    ].join(' '),

    // Типы уведомлений
    success: [
      'bg-green-50/95',
      'border-green-200/60',
      'border-l-green-500',
    ].join(' '),

    error: [
      'bg-red-50/95',
      'border-red-200/60',
      'border-l-red-500',
    ].join(' '),

    warning: [
      'bg-yellow-50/95',
      'border-yellow-200/60',
      'border-l-yellow-500',
    ].join(' '),

    info: [
      'bg-blue-50/95',
      'border-blue-200/60',
      'border-l-blue-500',
    ].join(' '),
  },

  // Состояния анимации
  animation: {
    initial: [
      'opacity-0',
      'translate-x-full',
      'scale-95',
    ].join(' '),

    enter: [
      'opacity-100',
      'translate-x-0',
      'scale-100',
    ].join(' '),

    exit: [
      'opacity-0',
      'translate-x-1/2',
      'scale-90',
      'pointer-events-none',
    ].join(' '),
  },

  // Элементы содержимого
  content: {
    layout: [
      'flex',
      'items-start',
      'gap-3',
    ].join(' '),

    icon: [
      'flex-shrink-0',
      'w-5',
      'h-5',
    ].join(' '),

    body: [
      'flex-1',
      'min-w-0',
    ].join(' '),

    title: [
      'text-sm',
      'font-semibold',
      'text-gray-900',
      'mb-1',
      'leading-tight',
    ].join(' '),

    message: [
      'text-sm',
      'text-gray-600',
      'leading-relaxed',
    ].join(' '),
  },

  // Кнопка закрытия
  closeButton: [
    'flex-shrink-0',
    'w-6',
    'h-6',
    'bg-transparent',
    'border-0',
    'rounded-md',
    'text-gray-400',
    'cursor-pointer',
    'transition-all',
    'duration-200',
    'ease-out',
    'flex',
    'items-center',
    'justify-center',
    'hover:bg-gray-100',
    'hover:text-gray-600',
    'hover:scale-110',
    'active:scale-95',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-blue-500',
    'focus:ring-offset-2',
  ].join(' '),

  // Responsive классы
  responsive: {
    mobile: [
      'max-sm:left-4',
      'max-sm:right-4',
      'max-sm:top-16',
      'max-sm:max-w-none',
    ].join(' '),
  },
};

// Утилиты для работы со стилями уведомлений
export const getNotificationClasses = (
  type: 'success' | 'error' | 'warning' | 'info',
  animationState: 'initial' | 'enter' | 'exit'
) => {
  return [
    notificationStyles.item.base,
    notificationStyles.item[type],
    notificationStyles.animation[animationState],
  ].join(' ');
};

// Цвета для иконок (соответствуют глобальным стилям)
export const notificationIconColors = {
  success: 'text-green-500',
  error: 'text-red-500',
  warning: 'text-yellow-500',
  info: 'text-blue-500',
} as const;

// Темная тема
export const darkNotificationStyles = {
  item: {
    base: [
      'dark:bg-gray-800/95',
      'dark:border-gray-700/60',
    ].join(' '),

    success: [
      'dark:bg-green-900/30',
      'dark:border-green-700/60',
    ].join(' '),

    error: [
      'dark:bg-red-900/30',
      'dark:border-red-700/60',
    ].join(' '),

    warning: [
      'dark:bg-yellow-900/30',
      'dark:border-yellow-700/60',
    ].join(' '),

    info: [
      'dark:bg-blue-900/30',
      'dark:border-blue-700/60',
    ].join(' '),
  },

  content: {
    title: [
      'dark:text-gray-100',
    ].join(' '),

    message: [
      'dark:text-gray-300',
    ].join(' '),
  },

  closeButton: [
    'dark:text-gray-500',
    'dark:hover:bg-gray-700',
    'dark:hover:text-gray-300',
  ].join(' '),
}; 