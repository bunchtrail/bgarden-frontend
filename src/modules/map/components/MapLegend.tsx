// Легенда карты с обозначениями
import React from 'react';
import { COLORS } from '../../../styles/global-styles';

const MapLegend: React.FC = () => {
  return (
    <div className='space-y-1.5'>
      <div className='flex items-center gap-1.5'>
        <div
          className='w-3 h-3 rounded-full'
          style={{ backgroundColor: COLORS.SUCCESS }}
        ></div>
        <span className='text-xs'>Растения</span>
      </div>
      <div className='flex items-center gap-1.5'>
        <div
          className='w-3 h-3 rounded-full'
          style={{ backgroundColor: COLORS.PRIMARY }}
        ></div>
        <span className='text-xs'>Водоемы</span>
      </div>
      <div className='flex items-center gap-1.5'>
        <div
          className='w-3 h-3 rounded-full'
          style={{ backgroundColor: COLORS.TEXT_SECONDARY }}
        ></div>
        <span className='text-xs'>Дорожки</span>
      </div>
    </div>
  );
};

export default MapLegend;
