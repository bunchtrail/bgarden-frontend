/**
 * Экспорт унифицированных сервисов по работе с регионами
 * После рефакторинга все компоненты должны использовать эти сервисы 
 * вместо дублирующихся
 */

export * from './RegionService';
export * from './PolygonFactory';
export { default as RegionService } from './RegionService'; 