/**
 * Экспорт всех глобальных стилей приложения
 */

// Импортируем CSS файл (без экспорта)
import './animations.css';
import { appStyles } from './global-styles';

export * from './global-styles';

// Экспорт по умолчанию для удобства
export default appStyles; 