import { useState, useEffect } from 'react';
import { MapData, getActiveMap } from '@/modules/map/services/mapService';

export function useMapData() {
  const [mapData, setMapData] = useState<MapData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMap = async () => {
      try {
        setLoading(true);
        const maps = await getActiveMap();
        setMapData(maps && maps.length > 0 ? maps[0] : null);
      } catch (error) {
        console.error('Ошибка при загрузке карты:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMap();
  }, []);

  return { mapData, loading };
} 