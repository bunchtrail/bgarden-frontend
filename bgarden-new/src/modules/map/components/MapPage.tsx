import React, { useEffect, useState } from 'react';
import { MapContainer, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getActiveMap, getMapImageUrl, MapData } from '../services/mapService';
import { getAllRegions, convertRegionsToAreas } from '../services/regionService';
import { useMap as useMapHook } from '../hooks';
import { useMapConfig, MapConfigProvider } from '../context/MapConfigContext';
import { RegionData } from '../types/mapTypes';
import { MAP_STYLES } from '../styles';
import { Card, LoadingSpinner, Button } from '../../ui';
import { 
  MapRegionsLayer, 
  MapImageLayer, 
  MapBoundsHandler,
  ErrorView,
  EmptyMapView,
  LoadingView,
  MapControlPanel
} from './map-components';

// Основной компонент карты с логикой
const MapPageContent: React.FC = () => {
  const [mapData, setMapData] = useState<MapData | null>(null);
  const [regions, setRegions] = useState<RegionData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [imageBounds, setImageBounds] = useState<L.LatLngBoundsExpression>([[0, 0], [1000, 1000]]);
  const [showControlPanel, setShowControlPanel] = useState<boolean>(false);
  const { mapConfig } = useMapConfig();
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

  const handleRefresh = () => window.location.reload();

  const toggleControlPanel = () => setShowControlPanel(prev => !prev);

  // Проверяем, находится ли слой в видимых слоях
  const isLayerVisible = (layerName: string) => {
    return mapConfig.visibleLayers.includes(layerName);
  };

  // Рендер содержимого карты
  const renderMapContent = () => {
    if (loading) {
      return <LoadingView message="Загрузка данных карты..." />;
    }
    
    if (error) {
      return <ErrorView error={error} onRefresh={handleRefresh} />;
    }
    
    if (!mapImageUrl) {
      return <EmptyMapView onRefresh={handleRefresh} />;
    }
    
    return (
      <div className={MAP_STYLES.mapContent}>
        {/* Кнопка отображения панели настроек */}
        <Button
          variant="secondary"
          size="small"
          className="absolute top-4 right-4 z-[999]"
          onClick={toggleControlPanel}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </Button>

        {/* Панель управления картой */}
        {showControlPanel && (
          <MapControlPanel onClose={toggleControlPanel} />
        )}

        {/* Обработка изображения для расчета границ вне MapContainer */}
        {isLayerVisible('imagery') && (
          <MapImageLayer 
            imageUrl={mapImageUrl} 
            setImageBounds={setImageBounds} 
          />
        )}
        
        <MapContainer
          center={mapConfig.center}
          zoom={mapConfig.zoom}
          maxZoom={mapConfig.maxZoom}
          minZoom={mapConfig.minZoom}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
          crs={L.CRS.Simple}
          maxBounds={mapConfig.maxBounds}
          maxBoundsViscosity={mapConfig.maxBoundsViscosity}
          attributionControl={false}
          className={mapConfig.lightMode ? MAP_STYLES.lightMode : ''}
        >
          <ZoomControl position={mapConfig.zoomControlPosition} />
          
          {/* Слой изображения карты */}
          {isLayerVisible('imagery') && (
            <MapImageLayer 
              imageUrl={mapImageUrl} 
              bounds={imageBounds} 
            />
          )}
          
          {/* Слой регионов */}
          {isLayerVisible('regions') && (
            <MapRegionsLayer 
              regions={regions} 
              highlightSelected={!mapConfig.lightMode}
              showTooltips={mapConfig.showTooltips}
            />
          )}
          
          {/* Обработчик границ карты */}
          <MapBoundsHandler imageBounds={imageBounds} />
        </MapContainer>
      </div>
    );
  };

  // Титул карты
  const mapTitle = mapConfig.lightMode 
    ? "Облегченная карта" 
    : (mapData?.name || "Интерактивная карта ботанического сада");

  return (
    <div className={MAP_STYLES.mapContainer}>
      <Card 
        title={mapTitle}
        headerAction={loading && <LoadingSpinner size="small" message="" />}
        variant="elevated"
        contentClassName="p-0"
      >
        {renderMapContent()}
      </Card>
    </div>
  );
};

// Обертка с провайдером конфигурации
const MapPage: React.FC = () => {
  return (
    <MapConfigProvider>
      <MapPageContent />
    </MapConfigProvider>
  );
};

export default MapPage; 