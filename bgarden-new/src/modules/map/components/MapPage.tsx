import React, { useEffect, useState } from 'react';
import { MapContainer, ImageOverlay, ZoomControl, useMap, Polygon, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getActiveMap, getMapImageUrl, MapData } from '../services/mapService';
import { getAllRegions, parseCoordinates, convertRegionsToAreas } from '../services/regionService';
import { useMap as useMapHook } from '../hooks';
import { RegionData } from '../types/mapTypes';
import { MAP_STYLES } from '../styles';
import { Card, Button, LoadingSpinner } from '../../ui';
import { COLORS, layoutClasses, textClasses } from '../../../styles/global-styles';

// Компонент для корректной установки границ изображения
const SetBoundsRectangle = ({ imageBounds }: { imageBounds: L.LatLngBoundsExpression }) => {
  const map = useMap();
  
  useEffect(() => {
    if (imageBounds) {
      map.fitBounds(imageBounds);
    }
  }, [map, imageBounds]);
  
  return null;
};

// Компонент для отображения регионов на карте
const MapRegions = ({ regions }: { regions: RegionData[] }) => {
  const { setSelectedAreaId, selectedAreaId } = useMapHook();
  
  return (
    <>
      {regions.map((region) => {
        const coordinates = parseCoordinates(region.polygonCoordinates);
        if (coordinates.length < 3) return null; // Полигон должен иметь как минимум 3 точки
        
        const isSelected = selectedAreaId === `region-${region.id}`;
        
        return (
          <Polygon
            key={`region-${region.id}`}
            positions={coordinates}
            pathOptions={{
              fillColor: isSelected ? COLORS.primary.main : (region.fillColor || COLORS.text.secondary),
              color: isSelected ? COLORS.primary.dark : (region.strokeColor || COLORS.text.primary),
              fillOpacity: isSelected ? 0.4 : (region.fillOpacity || 0.3),
              weight: isSelected ? 3 : 2,
              opacity: 0.8
            }}
            eventHandlers={{
              click: () => {
                console.log('Выбран регион:', region.name);
                setSelectedAreaId(`region-${region.id}`);
              },
              mouseover: (e) => {
                const layer = e.target;
                layer.setStyle({
                  fillOpacity: 0.5,
                  weight: isSelected ? 3 : 2.5,
                });
              },
              mouseout: (e) => {
                const layer = e.target;
                layer.setStyle({
                  fillOpacity: isSelected ? 0.4 : (region.fillOpacity || 0.3),
                  weight: isSelected ? 3 : 2,
                });
              }
            }}
          >
            <Tooltip sticky>
              <div className={MAP_STYLES.regionTooltip}>
                <strong className={textClasses.subheading}>{region.name}</strong>
                {region.description && <p className={textClasses.secondary}>{region.description}</p>}
                <p className={`${textClasses.body} ${MAP_STYLES.regionInfo}`}>
                  Экземпляров: <span className={MAP_STYLES.regionCount} style={{color: COLORS.primary.main}}>{region.specimensCount}</span>
                </p>
              </div>
            </Tooltip>
          </Polygon>
        );
      })}
    </>
  );
};

// Компонент для обработки размеров изображения и настройки ограничений карты
const ImageSizeHandler = ({ src, setImageBounds }: { src: string, setImageBounds: (bounds: L.LatLngBoundsExpression) => void }) => {
  useEffect(() => {
    if (!src) return;
    
    // Создаем новый объект изображения для получения размеров
    const img = new Image();
    img.onload = () => {
      const width = img.width;
      const height = img.height;
      console.log(`Загружено изображение: ${width}x${height}`);
      
      // Создаем ограничения карты на основе размеров изображения
      // Используем систему координат, где [0,0] - верхний левый угол
      const bounds: L.LatLngBoundsExpression = [
        [0, 0],    // верхний левый угол
        [height, width]  // нижний правый угол
      ];
      
      setImageBounds(bounds);
    };
    
    img.src = src;
  }, [src, setImageBounds]);
  
  return null;
};

const MapPage: React.FC = () => {
  const [mapData, setMapData] = useState<MapData | null>(null);
  const [regions, setRegions] = useState<RegionData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [imageBounds, setImageBounds] = useState<L.LatLngBoundsExpression>([[0, 0], [1000, 1000]]);
  const { setAreas } = useMapHook();
  
  useEffect(() => {
    const fetchMapData = async () => {
      try {
        setLoading(true);
        
        // Получаем данные активной карты
        const maps = await getActiveMap();
        if (maps && maps.length > 0) {
          setMapData(maps[0]);
        }
        
        // Получаем регионы карты
        const regionsData = await getAllRegions();
        setRegions(regionsData);
        
        // Преобразуем данные регионов для MapContext
        if (regionsData && regionsData.length > 0) {
          const areasData = convertRegionsToAreas(regionsData);
          setAreas(areasData);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Ошибка при загрузке данных карты:', err);
        setError('Не удалось загрузить данные карты. Пожалуйста, попробуйте позже.');
        setLoading(false);
      }
    };

    fetchMapData();
  }, [setAreas]);

  // Получаем URL изображения карты
  const mapImageUrl = mapData ? getMapImageUrl(mapData) : null;

  return (
    <div className={MAP_STYLES.mapContainer}>
      <Card 
        title={mapData?.name || "Интерактивная карта ботанического сада"}
        headerAction={loading && <LoadingSpinner size="small" message="" />}
        variant="elevated"
        contentClassName="p-0"
      >
        {loading && (
          <div className={layoutClasses.flexCenter + " py-16"}>
            <LoadingSpinner message="Загрузка данных карты..." />
          </div>
        )}
        
        {error && (
          <div className="p-8 text-center">
            <div className="inline-block p-4 mb-4 rounded-xl bg-red-50 text-red-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-center">{error}</p>
            </div>
            <Button 
              variant="primary" 
              onClick={() => window.location.reload()}
            >
              Обновить страницу
            </Button>
          </div>
        )}
        
        {!loading && !error && mapImageUrl && (
          <div className={MAP_STYLES.mapContent}>
            {mapImageUrl && <ImageSizeHandler src={mapImageUrl} setImageBounds={setImageBounds} />}
            
            <MapContainer
              center={[500, 500]}
              zoom={0}
              maxZoom={4}
              minZoom={-2}
              style={{ height: '100%', width: '100%' }}
              zoomControl={false}
              crs={L.CRS.Simple}
              maxBounds={[[-1000, -1000], [2000, 2000]]} // Ограничиваем перемещение карты
              maxBoundsViscosity={1.0} // Непреодолимое ограничение
              attributionControl={false}
            >
              <ZoomControl position="bottomright" />
              {mapImageUrl && (
                <ImageOverlay
                  url={mapImageUrl}
                  bounds={imageBounds}
                  opacity={1}
                  zIndex={10}
                />
              )}
              <MapRegions regions={regions} />
              <SetBoundsRectangle imageBounds={imageBounds} />
            </MapContainer>
          </div>
        )}
        
        {!loading && !error && !mapImageUrl && (
          <div className="p-8 text-center">
            <div className="inline-block p-4 mb-4 rounded-xl bg-yellow-50 text-yellow-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-center">Карта не найдена. Убедитесь, что на сервере есть активная карта.</p>
            </div>
            <Button 
              variant="secondary" 
              onClick={() => window.location.reload()}
            >
              Проверить еще раз
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default MapPage; 