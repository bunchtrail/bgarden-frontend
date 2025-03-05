/**
 * Общие классы Tailwind для переиспользования в компонентах как строковые литералы
 */

// Классы для контейнеров
export const CONTAINER = 'container mx-auto px-4 sm:px-6 lg:px-8';
export const SECTION = 'py-12';

// Классы для карточек
export const CARD = 'bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-card transition-shadow duration-300 hover:shadow-lg';
export const CARD_BODY = 'p-6';
export const CARD_TITLE = 'text-xl font-semibold mb-2 text-secondary-dark dark:text-secondary-light';
export const CARD_TEXT = 'text-gray-600 dark:text-gray-400';

// Классы для заголовков
export const HEADING = {
  h1: 'text-4xl md:text-5xl font-bold tracking-tight text-secondary-dark dark:text-secondary-light',
  h2: 'text-3xl md:text-4xl font-bold tracking-tight text-secondary-dark dark:text-secondary-light',
  h3: 'text-2xl md:text-3xl font-semibold tracking-tight text-secondary-dark dark:text-secondary-light',
  h4: 'text-xl md:text-2xl font-semibold text-secondary-dark dark:text-secondary-light',
};

// Классы для текста
export const TEXT = {
  body: 'text-base text-gray-700 dark:text-gray-300',
  small: 'text-sm text-gray-600 dark:text-gray-400',
  muted: 'text-gray-500 dark:text-gray-500',
};

// Классы для формы
export const FORM = {
  group: 'mb-4',
  label: 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1',
  input: 'w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 bg-white dark:bg-gray-800 text-gray-900 dark:text-white',
  error: 'mt-1 text-sm text-red-600 dark:text-red-500',
  hint: 'mt-1 text-sm text-gray-500 dark:text-gray-400',
};

// Классы для сетки
export const GRID = {
  container: 'grid gap-6',
  cols1: 'grid-cols-1',
  cols2: 'grid-cols-1 md:grid-cols-2',
  cols3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  cols4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
};

// Классы для flex контейнеров
export const FLEX = {
  row: 'flex flex-row',
  col: 'flex flex-col',
  wrap: 'flex-wrap',
  center: 'items-center justify-center',
  between: 'justify-between',
  gap2: 'gap-2',
  gap4: 'gap-4',
};

// Классы для отступов
export const SPACING = {
  mb2: 'mb-2',
  mb4: 'mb-4',
  mb6: 'mb-6',
  mt2: 'mt-2',
  mt4: 'mt-4',
  mt6: 'mt-6',
  py2: 'py-2',
  py4: 'py-4',
  py6: 'py-6',
  px2: 'px-2',
  px4: 'px-4',
  px6: 'px-6',
};

// Классы для цветов
export const COLORS = {
  primary: 'text-primary',
  error: 'text-red-600',
  success: 'text-green-600',
  warning: 'text-amber-600',
  info: 'text-blue-600',
};

// Классы для анимаций
export const ANIMATIONS = {
  fadeIn: 'animate-fadeIn',
  pulse: 'animate-pulse',
  spin: 'animate-spin',
}; 