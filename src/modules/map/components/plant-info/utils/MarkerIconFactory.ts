import L from 'leaflet';
import { Plant } from '@/services/regions/types';
import { MAP_COLORS } from '../../../styles';

/**
 * Фабрика для создания и стилизации маркеров и кластеров
 */
export const MarkerIconFactory = {
  /**
   * Создает стилизованный маркер для растения
   * @param plant Данные растения
   * @returns Иконка маркера Leaflet
   */
  createStyledMarkerIcon(plant: Plant): L.DivIcon {
    // Определяем цвет маркера на основе имеющихся данных о растении
    let markerColor = MAP_COLORS.primary;
    let markerSize = 15;

    // Пытаемся определить тип растения по описанию или названию
    const latinName = plant.latinName?.toLowerCase() || '';
    const name = plant.name.toLowerCase();
    const description = plant.description?.toLowerCase() || '';

    // Примерная категоризация растений по названию или описанию
    if (
      latinName.includes('conifer') ||
      name.includes('хвой') ||
      description.includes('хвой')
    ) {
      markerColor = '#2D8731'; // Темно-зеленый для хвойных
      markerSize = 14;
    } else if (
      latinName.includes('flower') ||
      name.includes('цвет') ||
      description.includes('цвет')
    ) {
      markerColor = '#E86A33'; // Оранжевый для цветущих
      markerSize = 13;
    } else if (
      latinName.includes('shrub') ||
      name.includes('куст') ||
      description.includes('куст')
    ) {
      markerColor = '#41924B'; // Зеленый для кустарников
      markerSize = 12;
    } else if (
      latinName.includes('tree') ||
      name.includes('дерев') ||
      description.includes('дерев')
    ) {
      markerColor = '#1A5D1A'; // Темно-зеленый для деревьев
      markerSize = 16;
    }

    const halfSize = markerSize / 2;

    return L.divIcon({
      className: 'custom-plant-marker',
      html: `<div style="
        width: ${markerSize}px;
        height: ${markerSize}px;
        background-color: ${markerColor};
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
        cursor: pointer;
      "></div>`,
      iconSize: [markerSize, markerSize],
      iconAnchor: [halfSize, halfSize],
    });
  },

  /**
   * Создает иконку кластера
   * @param cluster Кластер маркеров Leaflet
   * @returns Иконка кластера
   */
  createClusterIcon(cluster: L.MarkerCluster): L.DivIcon {
    const count = cluster.getChildCount();
    // Определяем размер кластера в зависимости от количества маркеров
    let size = 30;
    if (count > 50) size = 40;
    else if (count > 20) size = 35;

    return L.divIcon({
      html: `<div style="
        display: flex;
        align-items: center;
        justify-content: center;
        width: ${size}px;
        height: ${size}px;
        background-color: ${MAP_COLORS.primary};
        color: white;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 3px 6px rgba(0, 0, 0, 0.3);
        font-weight: bold;
        font-size: ${count > 99 ? '10px' : '12px'};
      ">${count > 99 ? '99+' : count}</div>`,
      className: 'plant-cluster-icon',
      iconSize: L.point(size, size),
    });
  },
};
