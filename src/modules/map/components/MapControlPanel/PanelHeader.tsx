import React from 'react';

type PanelHeaderProps = {
  isCollapsed: boolean;
  onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
  onResetPosition: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onToggleCollapse: (e: React.MouseEvent<SVGSVGElement>) => void;
  showCollapseIndicator: boolean;
  showDragHint: boolean;
  hideDragHint: () => void;
};

const PanelHeader: React.FC<PanelHeaderProps> = ({
  isCollapsed,
  onMouseDown,
  onResetPosition,
  onToggleCollapse,
  showCollapseIndicator,
  showDragHint,
  hideDragHint,
}) => {
  return (
    <>
      <div
        className='border-b border-gray-200 py-2 px-3 flex justify-between items-center select-none'
        onMouseDown={onMouseDown}
        style={{ cursor: 'grab' }}
        title='Перетащите, чтобы переместить панель'
      >
        <h3 className='text-sm font-medium text-gray-800 flex items-center'>
          <svg
            className='w-3.5 h-3.5 mr-1 text-gray-600'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          Управление
        </h3>
        <div className='flex items-center gap-2'>
          <svg
            className={`
              w-5 h-5 transition-transform duration-200
              ${isCollapsed ? 'rotate-180' : ''}
              text-gray-600 
              cursor-pointer hover:text-gray-800
            `}
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
            onClick={onToggleCollapse}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
          <button
            className='text-gray-500 hover:text-gray-700 transition-colors'
            onClick={onResetPosition}
            title='Сбросить позицию панели'
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      {/* Минималистичная подсказка о перетаскивании */}
      {showDragHint && (
        <div className='bg-gray-50 border-t border-gray-200 px-3 py-1 text-xs text-gray-500 flex items-center'>
          <span>Перетащите за заголовок для перемещения</span>
          <button
            className='ml-auto text-gray-400 hover:text-gray-600'
            onClick={hideDragHint}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </>
  );
};

export default PanelHeader;
