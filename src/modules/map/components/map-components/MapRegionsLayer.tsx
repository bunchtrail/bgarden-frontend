import React from 'react';
import { Polygon, Tooltip, useMap as useLeafletMap } from 'react-leaflet';
import { RegionData } from '@/modules/map/types/mapTypes';
import { PolygonFactory } from '@/services/regions/PolygonFactory';
import { useMap } from '@/modules/map/hooks';
import { useMapConfig } from '@/modules/map/contexts/MapConfigContext';
import regionBridge from '@/services/regions/RegionBridge';

export interface MapRegionsLayerProps {
  regions: RegionData[];
  highlightSelected?: boolean;
  showTooltips?: boolean;
  onClick?: (regionId: string) => void;
}

const MapRegionsLayer: React.FC<MapRegionsLayerProps> = ({
  regions,
  highlightSelected = true,
  showTooltips = true,
  onClick,
}) => {
  const { setSelectedAreaId, selectedAreaId } = useMap();
  const { mapConfig } = useMapConfig();
  const leafletMap = useLeafletMap();

  const handleRegionClick = (
    regionId: string | number,
    e?: L.LeafletMouseEvent
  ) => {
    // Преобразование ID региона
    const id =
      typeof regionId === 'number'
        ? regionBridge.regionIdToAreaId(regionId)
        : regionId;

    // Устанавливаем выбранный регион
    setSelectedAreaId(id);

    // Вызываем обработчик onClick, если он передан в пропсы
    if (onClick) {
      onClick(typeof regionId === 'number' ? String(regionId) : regionId);
    }

    // Важно: не останавливаем распространение события, чтобы оно дошло до карты
    // и можно было установить маркер при клике на область
  };

  // Добавляем обработчик для перехвата клика по всей карте с низким приоритетом
  React.useEffect(() => {
    if (!leafletMap) return;

    // Получаем контейнер карты
    const mapContainer = leafletMap.getContainer();

    // Функция обработки клика по карте (запасной вариант)
    const handleMapContainerClick = (e: MouseEvent) => {
      // Если клик был по полигону, но не обработан маркером
      if ((e.target as HTMLElement).closest('.leaflet-overlay-pane')) {
        // Не останавливаем распространение события здесь
        // и не предотвращаем дальнейшую обработку
      }
    };

    // Используем фазу перехвата (true) с самым низким приоритетом
    // чтобы обработчики MapMarker имели возможность обработать событие первыми
    mapContainer.addEventListener('click', handleMapContainerClick, true);

    return () => {
      mapContainer.removeEventListener('click', handleMapContainerClick, true);
    };
  }, [leafletMap]);

  return (
    <>
      {' '}
      {regions.map((region) => {
        // Используем RegionBridge для преобразования RegionData в Area и получения points
        const area = regionBridge.toArea(region, mapConfig.mapType);
        if (area.points.length < 3) return null; // Полигон должен иметь как минимум 3 точки

        const isSelected = highlightSelected && selectedAreaId === area.id;

        // Используем унифицированную фабрику для создания стилей полигонов
        const pathOptions = PolygonFactory.createStyles({
          isSelected,
          strokeColor: region.strokeColor,
          fillColor: region.fillColor,
          fillOpacity: region.fillOpacity,
        });

        // Добавляем дополнительные стили для улучшения обработки кликов
        pathOptions.className = 'region-polygon clickable-region'; // Добавляем классы для CSS

        // Используем унифицированную фабрику для создания обработчиков событий
        const eventHandlers = PolygonFactory.createEventHandlers(
          {
            isSelected,
            onClick: handleRegionClick,
          },
          region
        );

        // Заменяем обработчик клика для прозрачности полигона для событий
        eventHandlers.click = (e) => {
          // Вызываем основной обработчик
          handleRegionClick(region.id, e);

          // Не останавливаем событие, чтобы оно дошло до карты
          // e.originalEvent.stopPropagation();
        };

        // Обработчики наведения для визуальной обратной связи
        eventHandlers.mouseover = () => {
          const polygonElement = document.querySelector(
            `[data-region-id="${region.id}"]`
          );
          if (polygonElement) {
            polygonElement.classList.add('region-hover');
          }
        };

        eventHandlers.mouseout = () => {
          const polygonElement = document.querySelector(
            `[data-region-id="${region.id}"]`
          );
          if (polygonElement) {
            polygonElement.classList.remove('region-hover');
          }
        };

        return (
          <Polygon
            key={`region-${region.id}`}
            positions={area.points}
            pathOptions={pathOptions}
            eventHandlers={eventHandlers}
            data-region-id={region.id} // Добавляем data-атрибут для идентификации
            bubblingMouseEvents={true} // ВАЖНО: Разрешаем "всплытие" событий мыши для проброса клика
            interactive={true} // Явно указываем, что элемент интерактивный
          >
            {showTooltips && (
              <Tooltip direction="center" opacity={0.9} permanent={false}>
                <div className="font-medium text-sm">
                  {region.name || 'Unnamed Region'}
                </div>
                {region.description && (
                  <div className="text-xs mt-1 text-gray-600">
                    {region.description}
                  </div>
                )}
              </Tooltip>
            )}
          </Polygon>
        );
      })}
    </>
  );
};

export default MapRegionsLayer;
