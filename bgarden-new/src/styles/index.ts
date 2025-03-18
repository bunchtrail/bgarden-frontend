/**
 * Экспорт всех глобальных стилей приложения
 */

// Импортируем CSS файл (без экспорта)
import './animations.css';
import { appStyles } from './global-styles';

// Экспорт глобальных стилей и переиспользуемых классов
export * from './global-styles';

// Экспорт по умолчанию для удобства
export default appStyles; 