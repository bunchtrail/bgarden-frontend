// Экспорт компонентов
export { default as LoadingSpinner } from './components/LoadingSpinner';
export { default as AbstractPattern } from './components/AbstractPattern';
export { default as SectorCard } from './components/SectorCard';
export { default as Button } from './components/Button';
export { default as Card } from './components/Card';

// Экспорт компонентов формы
export * from './components/Form';

// Общие типы
export interface BaseComponentProps {
  className?: string;
}

// Реэкспорт типов для UI компонентов
export type { PatternType } from './components/AbstractPattern';
export type { ButtonProps, ButtonVariant, ButtonSize } from './components/Button';
export type { TextFieldProps } from './components/Form/TextField';
export type { CardProps } from './components/Card';

/**
 * Модуль UI содержит базовые переиспользуемые компоненты интерфейса.
 * Все компоненты, которые используются в нескольких местах, должны быть определены здесь.
 * Модуль должен быть независим от бизнес-логики других модулей.
 */ 