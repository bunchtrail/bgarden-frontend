import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import React, { useEffect, useRef } from 'react';
import { SectorType } from '../../specimens/types';
import { useMapContext } from '../contexts/MapContext';
import PlantLayer from './layers/PlantLayer';
import MapControls from './MapControls';

// Необходимо для исправления проблемы с иконками маркеров в Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapProps {
  mapId?: number;
  sectorType?: SectorType;
}

const Map: React.FC<MapProps> = ({
  mapId = 1,
  sectorType = SectorType.Dendrology,
}) => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const initializingRef = useRef<boolean>(false);
  const initializedRef = useRef<boolean>(false);
  const { state, setMap, setMapReady, selectSector, setError } =
    useMapContext();

  // Установка выбранного сектора при первом рендеринге
  useEffect(() => {
    if (sectorType !== state.selectedSector) {
      selectSector(sectorType);
    }
  }, [sectorType, selectSector, state.selectedSector]);

  // Инициализация карты при монтировании компонента
  useEffect(() => {
    // Если карта уже инициализирована или процесс инициализации уже запущен, пропускаем
    if (
      !mapContainerRef.current ||
      initializingRef.current ||
      initializedRef.current
    ) {
      return;
    }

    // Устанавливаем флаг, что инициализация началась
    initializingRef.current = true;

    // Создаем карту Leaflet
    try {
      mapRef.current = L.map(mapContainerRef.current).setView(
        [55.75, 37.61],
        13
      );

      // Добавляем базовый слой OSM
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapRef.current);

      // Проверяем корректность инициализации карты
      if (mapRef.current && typeof mapRef.current.getContainer === 'function') {
        // Устанавливаем обработчик на событие загрузки карты
        mapRef.current.once('load', () => {
          // Убираем лишний console.log
        });

        // Сохраняем экземпляр карты в контексте
        setMap(mapRef.current);

        // Отметим, что карта готова через небольшой таймаут
        setTimeout(() => {
          if (mapRef.current) {
            initializedRef.current = true;
            setMapReady(true);
            // Запускаем обновление размера карты для корректного отображения
            mapRef.current.invalidateSize();
          }
          // Снимаем флаг инициализации
          initializingRef.current = false;
        }, 300);
      } else {
        console.error(
          'Ошибка: экземпляр карты не был корректно инициализирован'
        );
        initializingRef.current = false;
      }
    } catch (error) {
      console.error('Ошибка при инициализации карты:', error);
      setError('Ошибка при инициализации карты');
      initializingRef.current = false;
    }

    // Очистка при размонтировании
    return () => {
      if (mapRef.current) {
        // Убираем лишний console.log

        // Сначала сбрасываем флаги
        initializedRef.current = false;

        // Только потом меняем состояние контекста
        setMapReady(false);

        try {
          mapRef.current.remove();
        } catch (e) {
          console.error('Ошибка при удалении карты:', e);
        }

        mapRef.current = null;
        // Сбрасываем ссылку на карту в контексте
        setMap(null);
      }
    };
  }, [setMap, setMapReady, setError]);

  return (
    <div className='map-container'>
      <div
        ref={mapContainerRef}
        className='leaflet-container'
        style={{ height: '600px', width: '100%', borderRadius: '8px' }}
      />

      {state.mapReady && state.mapInstance && (
        <>
          <PlantLayer />
          <MapControls />
        </>
      )}
    </div>
  );
};

export default Map;
