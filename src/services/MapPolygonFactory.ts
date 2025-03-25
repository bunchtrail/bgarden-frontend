/**
 * @deprecated Этот файл устарел и будет удален в следующих обновлениях.
 * Используйте вместо него унифицированную фабрику из src/services/regions
 * import { PolygonFactory } from '@/services/regions';
 */

import { PolygonFactory, PolygonOptions, PolygonStyles } from '@/services/regions/PolygonFactory';

// Реэкспортируем типы и классы для обратной совместимости
export type { PolygonOptions, PolygonStyles };
export class MapPolygonFactory extends PolygonFactory {}

export default MapPolygonFactory; 