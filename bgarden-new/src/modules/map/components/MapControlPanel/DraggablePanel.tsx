import React from 'react';

type DraggablePanelProps = {
  position: { x: number; y: number };
  isDragging: boolean;
  isCollapsed: boolean;
  children: React.ReactNode;
};

// Для того, чтобы можно было передать ref, используем forwardRef
const DraggablePanel = React.forwardRef<HTMLDivElement, DraggablePanelProps>(
  function DraggablePanel(
    { position, isDragging, isCollapsed, children },
    ref
  ) {
    const panelStyle: React.CSSProperties = {
      position: 'fixed',
      left: `${position.x}px`,
      top: `${position.y}px`,
      zIndex: 9999,
      cursor: isDragging ? 'grabbing' : 'auto',
      width: '360px', // слегка уменьшил ширину для минимализма
      opacity: 0.98, // Повысил непрозрачность для лучшей читаемости
    };

    const maxHeight = isCollapsed ? '40px' : '80vh';

    return (
      <div ref={ref} style={panelStyle}>
        <div
          className={`
            bg-white rounded-md shadow-sm border 
            ${isCollapsed ? 'border-gray-300' : 'border-gray-200'}
          `}
          style={{ 
            maxHeight, 
            overflow: 'hidden', 
            transition: 'max-height 0.2s ease',
          }}
        >
          {children}
        </div>
      </div>
    );
  }
);

export default DraggablePanel;
