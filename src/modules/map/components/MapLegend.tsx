// Легенда карты с обозначениями
import React from 'react';
import {
  COLORS,
  containerClasses,
  layoutClasses,
  textClasses,
} from '../../../styles/global-styles';

const MapLegend: React.FC = () => {
  return (
    <div className={`p-3 bg-[${COLORS.BACKGROUND}] border border-[${COLORS.SEPARATOR}] rounded-lg`}>
      <span className={`${textClasses.body} block mb-2 font-medium`}>
        Условные обозначения
      </span>
      <div className='space-y-3'>
        <div className={layoutClasses.flexCenter + ' gap-2'}>
          <div
            className='w-5 h-5 rounded-full'
            style={{ backgroundColor: COLORS.SUCCESS }}
          ></div>
          <span className={textClasses.body}>Растения</span>
        </div>
        <div className={layoutClasses.flexCenter + ' gap-2'}>
          <div
            className='w-5 h-5 rounded-full'
            style={{ backgroundColor: COLORS.PRIMARY }}
          ></div>
          <span className={textClasses.body}>Водоемы</span>
        </div>
        <div className={layoutClasses.flexCenter + ' gap-2'}>
          <div
            className='w-5 h-5 rounded-full'
            style={{ backgroundColor: COLORS.TEXT_SECONDARY }}
          ></div>
          <span className={textClasses.body}>Дорожки</span>
        </div>
      </div>
    </div>
  );
};

export default MapLegend;
