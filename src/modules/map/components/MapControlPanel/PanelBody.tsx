import React from 'react';

type PanelBodyProps = {
  isCollapsed: boolean;
  children: React.ReactNode;
};

const PanelBody: React.FC<PanelBodyProps> = ({ isCollapsed, children }) => {
  if (isCollapsed) {
    // Скрываем содержимое, показываем лишь шапку
    return null;
  }

  return (
    <div
      className='p-2 space-y-1.5 overflow-y-auto'
      style={{ 
        maxHeight: 'calc(80vh - 40px)',
        scrollbarWidth: 'thin',
        scrollbarColor: '#D1D5DB #F9FAFB'
      }}
    >
      {children}
    </div>
  );
};

export default PanelBody;
