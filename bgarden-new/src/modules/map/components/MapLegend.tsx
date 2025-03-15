// Легенда карты с обозначениями
import React from 'react';
import { COLORS } from '../../../styles/global-styles';

type LegendItem = {
  color: string;
  label: string;
};

const legendItems: LegendItem[] = [
  { color: COLORS.secondary.main, label: 'Растения' },
  { color: COLORS.primary.main, label: 'Водоемы' },
  { color: '#6E7C87', label: 'Дорожки' }
];

const MapLegend: React.FC = () => {
  return (
    <div className='space-y-1.5'>
      {legendItems.map((item, index) => (
        <div key={index} className='flex items-center gap-1.5'>
          <div
            className='w-3 h-3 rounded-full'
            style={{ backgroundColor: item.color }}
          ></div>
          <span className='text-xs'>{item.label}</span>
        </div>
      ))}
    </div>
  );
};

export default MapLegend;
