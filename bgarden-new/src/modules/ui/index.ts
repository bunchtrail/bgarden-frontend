// Экспорт компонентов
export { default as LoadingSpinner } from './components/LoadingSpinner';
export { default as AbstractPattern } from './components/AbstractPattern';
export { default as SectorCard } from './components/SectorCard';

// Общие типы
export interface BaseComponentProps {
  className?: string;
}

// Реэкспорт типа PatternType для совместимости
export type { PatternType } from './components/AbstractPattern';

/**
 * Модуль UI содержит базовые переиспользуемые компоненты интерфейса.
 * Все компоненты, которые используются в нескольких местах, должны быть определены здесь.
 * Модуль должен быть независим от бизнес-логики других модулей.
 */ 