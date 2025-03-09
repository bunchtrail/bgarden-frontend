import React, { useState } from 'react';
import { MapContainer } from '../modules/map';
import { SectorType } from '../modules/specimens/types';

const MapPage: React.FC = () => {
  const [selectedSector, setSelectedSector] = useState<SectorType>(SectorType.Dendrology);
  
  // Обработчик изменения сектора
  const handleSectorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSector(parseInt(e.target.value, 10) as SectorType);
  };
  
  return (
    <div className="map-page p-4">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-6">Карта ботанического сада</h1>
        
        <div className="mb-4">
          <label htmlFor="sector-select" className="mr-2 font-medium">Выберите сектор:</label>
          <select 
            id="sector-select"
            value={selectedSector}
            onChange={handleSectorChange}
            className="p-2 border rounded"
          >
            <option value={SectorType.Dendrology}>Дендрологический</option>
            <option value={SectorType.Flora}>Флора</option>
            <option value={SectorType.Flowering}>Цветущие</option>
          </select>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <MapContainer mapId={1} sectorType={selectedSector} />
        </div>
      </div>
    </div>
  );
};

export default MapPage; 