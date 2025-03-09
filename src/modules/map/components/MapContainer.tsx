import React, { useEffect, useState } from 'react';
import { SectorType } from '../../specimens/types';
import { MapProvider } from '../contexts/MapContext';
import { mapService } from '../services/mapService';
import { MapData } from '../types';
import Map from './Map';

interface MapContainerProps {
  mapId?: number;
  sectorType?: SectorType;
}

const MapContainer: React.FC<MapContainerProps> = ({
  mapId = 1,
  sectorType = SectorType.Dendrology,
}) => {
  const [mapData, setMapData] = useState<MapData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Загрузка данных карты при монтировании
  useEffect(() => {
    const loadMap = async () => {
      try {
        setLoading(true);
        // Используем новый метод для получения активной карты
        let data = null;
        
        if (mapId) {
          // Если указан конкретный ID карты, используем его
          data = await mapService.getMapById(mapId);
        } else {
          // Иначе получаем активную карту
          data = await mapService.getActiveMap();
          
          // Если активная карта не найдена, пробуем получить карту с ID = 1
          if (!data) {
            data = await mapService.getMapById(1);
          }
        }
        
        setMapData(data);
        setError(null);
      } catch (err) {
        console.error('Ошибка при загрузке карты:', err);
        setError('Не удалось загрузить карту');
      } finally {
        setLoading(false);
      }
    };

    loadMap();
  }, [mapId]);

  if (loading) {
    return (
      <div className='map-loading p-8 text-center'>
        <div className='animate-pulse text-lg'>Загрузка карты...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='map-error p-8 text-center bg-red-50 border border-red-200 rounded-lg'>
        <div className='text-red-600'>{error}</div>
      </div>
    );
  }

  return (
    <MapProvider>
      <div className='map-container-wrapper'>
        <div className='map-header mb-4'>
          <h2 className='text-2xl font-bold'>
            {mapData?.name || 'Карта ботанического сада'}
          </h2>
          {mapData?.description && (
            <p className='text-gray-600 mt-2'>{mapData.description}</p>
          )}
        </div>

        <Map mapId={mapId} sectorType={sectorType} />
      </div>
    </MapProvider>
  );
};

export default MapContainer;
