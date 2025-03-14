import React, { useEffect, useState, useRef, useCallback } from 'react';
import { SpecimenData, getSpecimenById } from '../../services/plantService';
import styles from '../../styles/map.module.css';

interface PlantDetailsModalProps {
  plantId: string;
  modalId?: string; // ID для отслеживания множественных модальных окон
  onClose: () => void;
}

// Функция для расчета начальной позиции модального окна
const calculateInitialPosition = (modalId?: string) => {
  const seedValue = modalId ? parseInt(modalId.split('-')[1]) % 500 : 0;
  
  // Смещаем окно на основе seedValue
  const offsetX = (seedValue % 200) + 10;
  const offsetY = ((seedValue / 5) % 150) + 10;
  
  // Фиксированные значения ширины и высоты для согласованного отображения
  const modalWidth = 320;
  const modalHeight = 400;
  
  // Рассчитываем центр экрана и добавляем смещение
  const centerX = (window.innerWidth - modalWidth) / 2 + offsetX;
  const centerY = Math.max(10, (window.innerHeight - modalHeight) / 2 + offsetY);
  
  return { x: centerX, y: centerY };
};

const PlantDetailsModal: React.FC<PlantDetailsModalProps> = ({ plantId, modalId, onClose }) => {
  const [specimenData, setSpecimenData] = useState<SpecimenData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('general');
  
  // Добавляем анимацию появления для каждой вкладки
  const [tabChanged, setTabChanged] = useState<boolean>(false);
  
  // Добавляем состояния для перетаскивания
  const [isDragging, setIsDragging] = useState<boolean>(false);
  
  // Инициализируем начальную позицию сразу по центру экрана
  const [position, setPosition] = useState<{ x: number; y: number }>(calculateInitialPosition(modalId));
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  
  // Добавляем состояние для отслеживания свернутого/развернутого состояния
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  
  // Добавляем состояния для анимации сворачивания/разворачивания
  const [isMinimizing, setIsMinimizing] = useState<boolean>(false);
  const [isMaximizing, setIsMaximizing] = useState<boolean>(false);
  
  // Добавляем состояние, чтобы отслеживать первый рендер и избегать транзиций
  const [isFirstRender, setIsFirstRender] = useState<boolean>(true);
  
  // Добавляем состояние для анимации закрытия модального окна
  const [isClosing, setIsClosing] = useState<boolean>(false);
  
  // Добавляем состояние для расширенного режима просмотра
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  
  // Ссылки на таймеры для анимаций
  const minimizeTimerRef = useRef<number | null>(null);
  const closeTimerRef = useRef<number | null>(null);
  
  const modalRef = useRef<HTMLDivElement>(null);

  // Добавляем состояние для отслеживания позиции z-index
  const [zIndexLevel, setZIndexLevel] = useState<number>(1000);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Извлекаем числовой ID из строки формата "specimen-123"
        const numericId = parseInt(plantId.replace('specimen-', ''));
        
        if (isNaN(numericId)) {
          throw new Error('Неверный формат ID растения');
        }
        
        const data = await getSpecimenById(numericId);
        setSpecimenData(data);
      } catch (error) {
        console.error('Ошибка при получении данных растения:', error);
        setError(error instanceof Error ? error.message : 'Неизвестная ошибка при получении данных');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [plantId]);

  // Функция для рендеринга значений с проверкой на null или пустую строку
  const renderValue = (value: any, defaultText = 'Нет данных') => {
    if (value === null || value === undefined || value === '') {
      return <span className={`${styles.dataValue} ${styles.empty}`}>{defaultText}</span>;
    }
    
    // Для числовых значений
    if (typeof value === 'number') {
      // Если это год, проверяем, что он имеет смысл
      if (value === 0) {
        return <span className={`${styles.dataValue} ${styles.empty}`}>{defaultText}</span>;
      }
      return value;
    }
    
    // Для булевых значений
    if (typeof value === 'boolean') {
      return value ? 
        <span className="text-[#30D158] font-medium">Да</span> : 
        <span className="text-[#FF3B30] font-medium">Нет</span>;
    }
    
    // Для строковых значений
    if (typeof value === 'string') {
      // Проверяем, является ли строка WKT-координатами
      if (value.startsWith('POINT') || value.startsWith('POLYGON') || value.startsWith('LINESTRING')) {
        return <span className="font-mono text-xs bg-[#F5F5F7] p-1 rounded inline-block max-w-full overflow-x-auto">{value}</span>;
      }
      
      // Проверяем, является ли строка URL
      if (value.startsWith('http://') || value.startsWith('https://')) {
        return <a href={value} target="_blank" rel="noopener noreferrer" className="text-[#0A84FF] hover:underline">{value}</a>;
      }
    }
    
    return value;
  };

  const handleTabChange = (tab: string) => {
    if (tab !== activeTab) {
      setTabChanged(true);
      setActiveTab(tab);
      // Сбрасываем флаг анимации через короткий промежуток времени
      setTimeout(() => setTabChanged(false), 300);
    }
  };

  // Функция переключения между свернутым и развернутым состоянием с анимацией
  const toggleMinimize = useCallback(() => {
    // Если окно закрывается, ничего не делаем
    if (isClosing) return;
    
    // Сбрасываем предыдущие таймеры
    if (minimizeTimerRef.current) {
      clearTimeout(minimizeTimerRef.current);
      minimizeTimerRef.current = null;
    }
    
    if (isMinimized) {
      // Если сейчас свернуто - разворачиваем
      setIsMaximizing(true);
      setIsMinimizing(false);
      
      // Через время анимации меняем основное состояние
      minimizeTimerRef.current = window.setTimeout(() => {
        setIsMinimized(false);
        
        // Небольшая задержка перед удалением класса анимации
        setTimeout(() => {
          setIsMaximizing(false);
        }, 50);
        
        minimizeTimerRef.current = null;
      }, 200);
    } else {
      // Если сейчас развернуто - сворачиваем
      setIsMinimizing(true);
      setIsMaximizing(false);
      
      // Через время анимации меняем основное состояние
      minimizeTimerRef.current = window.setTimeout(() => {
        setIsMinimized(true);
        
        // Небольшая задержка перед удалением класса анимации
        setTimeout(() => {
          setIsMinimizing(false);
        }, 50);
        
        minimizeTimerRef.current = null;
      }, 200);
    }
  }, [isMinimized, isClosing]);

  // Обработчик для открытия подробной информации о растении
  const handleOpenDetailed = (id: string | number) => {
    window.open(`/specimens/${id}`, '_blank');
  };

  // Обработчик для закрытия модального окна
  const handleClose = () => {
    // Запускаем анимацию закрытия
    setIsClosing(true);
    
    // Ждем завершения анимации перед вызовом onClose
    setTimeout(() => {
      onClose();
    }, 200); // Время должно соответствовать длительности анимации в CSS
  };

  // Очищаем таймеры при размонтировании компонента
  useEffect(() => {
    return () => {
      if (minimizeTimerRef.current) {
        clearTimeout(minimizeTimerRef.current);
      }
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  // Функции для перетаскивания модального окна
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target instanceof HTMLElement && e.target.closest(`.${styles.plantDetailsHeader}`)) {
      setIsDragging(true);
      
      // Рассчитываем смещение от точки клика до левого верхнего угла
      const rect = modalRef.current?.getBoundingClientRect();
      if (rect) {
        setDragOffset({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }
      
      // Повышаем z-index при перетаскивании
      setZIndexLevel(2000);
      
      // Предотвращаем выделение текста при перетаскивании
      e.preventDefault();
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      // Получаем размеры окна браузера
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      
      // Получаем размеры модального окна, если возможно
      let modalWidth = modalRef.current?.offsetWidth || 320;
      let modalHeight = modalRef.current?.offsetHeight || 400;
      
      // Если окно свёрнуто, используем другие значения по умолчанию
      if (isMinimized) {
        modalWidth = modalRef.current?.offsetWidth || 240;
        modalHeight = modalRef.current?.offsetHeight || 56;
      }
      
      // Рассчитываем новую позицию с ограничениями, чтобы не выходить за пределы экрана
      const newX = Math.max(0, Math.min(windowWidth - modalWidth, e.clientX - dragOffset.x));
      const newY = Math.max(0, Math.min(windowHeight - 100, e.clientY - dragOffset.y));
      
      // Обновляем позицию с учетом ограничений
      setPosition({
        x: newX,
        y: newY
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Добавляем и удаляем обработчики событий
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, isMinimized]);

  // Увеличиваем z-index при начале перетаскивания, чтобы окно было поверх всех других элементов
  useEffect(() => {
    if (isDragging) {
      setZIndexLevel(2000);
    }
  }, [isDragging]);

  // Вспомогательная функция для добавления индикатора статуса
  const renderStatusIndicator = (value: boolean | string | number | null) => {
    if (value === null || value === undefined || value === '' || value === 0) {
      return <span className="inline-block w-2 h-2 rounded-full bg-[#D1D1D6]" />;
    }
    
    if (typeof value === 'boolean') {
      return value ? 
        <span className="inline-block w-2 h-2 rounded-full bg-[#30D158]" /> :
        <span className="inline-block w-2 h-2 rounded-full bg-[#D1D1D6]" />;
    }
    
    return <span className="inline-block w-2 h-2 rounded-full bg-[#0A84FF]" />;
  };

  // Определяем классы для состояния модального окна
  const modalClasses = [
    styles.plantDetailsModal,
    styles.minimalist,
    isDragging ? styles.dragging : '',
    isFirstRender ? styles.noTransition : '',
    isClosing ? styles.closing : '',
    isMinimized ? styles.minimized : '',
    isMinimizing ? styles.minimizing : '',
    isMaximizing ? styles.maximizing : '',
    isExpanded ? styles.expanded : '',
  ].filter(Boolean).join(' ');

  // Удаляем класс noTransition после первого рендера и позиционирования
  useEffect(() => {
    if (isFirstRender) {
      // Сначала дождемся завершения монтирования компонента
      const timeoutId = requestAnimationFrame(() => {
        // Затем, после отрисовки рамки, убираем класс noTransition
        requestAnimationFrame(() => {
          setIsFirstRender(false);
        });
      });
      
      return () => cancelAnimationFrame(timeoutId);
    }
  }, [isFirstRender]);
  
  // Обновляем позицию при изменении размера окна
  useEffect(() => {
    const handleResize = () => {
      if (!isDragging) { // Не обновляем позицию, если окно перетаскивается
        setPosition(calculateInitialPosition(modalId));
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [modalId, isDragging]);

  if (loading) {
    return (
      <div 
        ref={modalRef}
        className={modalClasses}
        style={{
          position: 'fixed',
          left: `${position.x}px`,
          top: `${position.y}px`,
          cursor: isDragging ? 'grabbing' : 'auto',
          zIndex: zIndexLevel
        }}
        onMouseDown={handleMouseDown}
      >
        <div className={`${styles.plantDetailsHeader} ${isDragging ? styles.dragging : ''}`}>
          <span className={styles.plantDetailsTitle}>Загрузка...</span>
          <div className="flex items-center">
            <button onClick={handleClose} className={styles.plantDetailsCloseButton}>
              &times;
            </button>
          </div>
        </div>
        <div className="flex justify-center items-center p-4">
          <div className="w-5 h-5 rounded-full border-2 border-[#0A84FF] border-t-transparent animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div 
        ref={modalRef}
        className={modalClasses}
        style={{
          position: 'fixed',
          left: `${position.x}px`,
          top: `${position.y}px`,
          cursor: isDragging ? 'grabbing' : 'auto',
          zIndex: zIndexLevel
        }}
        onMouseDown={handleMouseDown}
      >
        <div className={`${styles.plantDetailsHeader} ${isDragging ? styles.dragging : ''}`}>
          <span className={styles.plantDetailsTitle}>Ошибка</span>
          <div className="flex items-center">
            <button onClick={handleClose} className={styles.plantDetailsCloseButton}>
              &times;
            </button>
          </div>
        </div>
        <div className="p-4">
          <p className="text-[#FF3B30] text-sm">
            Ошибка при загрузке данных:
          </p>
          <p className="text-[#8E8E93] text-xs mt-1">
            {error}
          </p>
        </div>
      </div>
    );
  }

  if (!specimenData) {
    return null;
  }

  // Отображаем модальное окно в зависимости от состояния
  return (
    <div 
      ref={modalRef}
      className={modalClasses}
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: isDragging ? 'grabbing' : 'auto',
        zIndex: zIndexLevel
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Заголовок панели */}
      <div 
        className={`${styles.plantDetailsHeader} ${isDragging ? styles.dragging : ''}`}
        onDoubleClick={toggleMinimize}
      >
        <span className={styles.plantDetailsTitle}>
          <span className="inline-flex items-center gap-1">
            <span className="truncate">{specimenData.russianName}</span>
            <span className="text-xs text-[#86868B] ml-1 whitespace-nowrap">(ID: {specimenData.id})</span>
          </span>
        </span>
        <div className="flex items-center gap-1 flex-shrink-0 ml-2">
          <button 
            className={styles.plantDetailsMinimizeButton} 
            onClick={toggleMinimize}
            title={isMinimized ? "Развернуть" : "Свернуть"}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              {isMinimized ? (
                <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z" fill="#007AFF"/>
              ) : (
                <path d="M19 13H5V11H19V13Z" fill="#007AFF"/>
              )}
            </svg>
          </button>
          <button 
            className={styles.plantDetailsCloseButton}
            onClick={handleClose}
            title="Закрыть"
          >
            &times;
          </button>
        </div>
      </div>

      {/* Контент модального окна */}
      <div className={styles.modalContent}>
        {/* Основная информация - упрощенная версия */}
        <div className="px-3 py-2 border-b border-[#E5E5EA]">
          <p className="text-sm text-[#86868B] italic">{specimenData.latinName || 'Нет латинского названия'}</p>
          <div className="flex flex-wrap gap-1 mt-1">
            {specimenData.inventoryNumber && (
              <span className="inline-flex items-center px-1.5 py-0.5 text-xs rounded-full bg-[#E1F0FF] text-[#0A84FF]">
                Инв.№: {specimenData.inventoryNumber}
              </span>
            )}
            {specimenData.hasHerbarium && (
              <span className="inline-flex items-center px-1.5 py-0.5 text-xs rounded-full bg-[#FFF2E3] text-[#FF9F0A]">
                Гербарий
              </span>
            )}
            {specimenData.plantingYear !== null && specimenData.plantingYear > 0 && (
              <span className="inline-flex items-center px-1.5 py-0.5 text-xs rounded-full bg-[#E8FFF0] text-[#30D158]">
                Год: {specimenData.plantingYear}
              </span>
            )}
          </div>
        </div>

        {/* Вкладки */}
        <div className="flex flex-wrap border-b border-[#E5E5EA]">
          <button 
            className={`flex-1 py-1.5 text-xs font-medium transition-colors ${
              activeTab === 'general' 
                ? 'text-[#0A84FF] border-b-2 border-[#0A84FF]' 
                : 'text-[#86868B] hover:text-[#1D1D1F] hover:bg-[#F2F2F7]'
            }`}
            onClick={() => handleTabChange('general')}
          >
            Основное
          </button>
          <button 
            className={`flex-1 py-1.5 text-xs font-medium transition-colors ${
              activeTab === 'taxonomy' 
                ? 'text-[#0A84FF] border-b-2 border-[#0A84FF]' 
                : 'text-[#86868B] hover:text-[#1D1D1F] hover:bg-[#F2F2F7]'
            }`}
            onClick={() => handleTabChange('taxonomy')}
          >
            Таксономия
          </button>
          <button 
            className={`flex-1 py-1.5 text-xs font-medium transition-colors ${
              activeTab === 'location' 
                ? 'text-[#0A84FF] border-b-2 border-[#0A84FF]' 
                : 'text-[#86868B] hover:text-[#1D1D1F] hover:bg-[#F2F2F7]'
            }`}
            onClick={() => handleTabChange('location')}
          >
            Локация
          </button>
          <button 
            className={`flex-1 py-1.5 text-xs font-medium transition-colors ${
              activeTab === 'ecology' 
                ? 'text-[#0A84FF] border-b-2 border-[#0A84FF]' 
                : 'text-[#86868B] hover:text-[#1D1D1F] hover:bg-[#F2F2F7]'
            }`}
            onClick={() => handleTabChange('ecology')}
          >
            Экология
          </button>
          <button 
            className={`flex-1 py-1.5 text-xs font-medium transition-colors ${
              activeTab === 'additional' 
                ? 'text-[#0A84FF] border-b-2 border-[#0A84FF]' 
                : 'text-[#86868B] hover:text-[#1D1D1F] hover:bg-[#F2F2F7]'
            }`}
            onClick={() => handleTabChange('additional')}
          >
            Доп. инфо
          </button>
        </div>

        {/* Содержимое вкладок */}
        <div className={`p-3 overflow-y-auto ${isExpanded ? 'max-h-[500px]' : 'max-h-[320px]'} scrollbar-thin scrollbar-thumb-[#E5E5EA] scrollbar-track-transparent ${tabChanged ? styles.tabFadeIn : ''}`}>
          {activeTab === 'general' && (
            <div className={`space-y-3 ${styles.modalTabContent}`}>
              {/* Основная информация */}
              <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
                <div className={styles.dataField}>
                  <p className={styles.dataLabel}>Инвентарный номер</p>
                  <p className={styles.dataValue}>{renderValue(specimenData.inventoryNumber)}</p>
                </div>
                <div className={styles.dataField}>
                  <p className={styles.dataLabel}>Год посадки</p>
                  <p className={styles.dataValue}>{renderValue(specimenData.plantingYear)}</p>
                </div>
                <div className={styles.dataField}>
                  <p className={styles.dataLabel}>Экспозиция</p>
                  <p className={styles.dataValue}>{renderValue(specimenData.expositionName)}</p>
                </div>
                <div className={styles.dataField}>
                  <p className={styles.dataLabel}>Гербарий</p>
                  <p className={styles.dataValue}>
                    {specimenData.hasHerbarium ? 
                      <span className="text-[#30D158] font-medium">Да</span> : 
                      <span className="text-[#FF3B30] font-medium">Нет</span>}
                  </p>
                </div>
              </div>
              
              {/* Дополнительная информация */}
              <div className={styles.dataField}>
                <p className={styles.dataLabel}>Определил</p>
                <p className={styles.dataValue}>{renderValue(specimenData.determinedBy)}</p>
              </div>
              
              {/* Примечания - если есть */}
              {specimenData.notes && (
                <div className={styles.dataField}>
                  <p className={styles.dataLabel}>Примечания</p>
                  <p className="text-sm p-2 bg-[#F5F5F7] rounded-lg">{specimenData.notes}</p>
                </div>
              )}
              
              {/* Информация о заполнении */}
              <div className={styles.dataField}>
                <p className={styles.dataLabel}>Заполнил</p>
                <p className={styles.dataValue}>{renderValue(specimenData.filledBy)}</p>
              </div>
            </div>
          )}

          {activeTab === 'taxonomy' && (
            <div className={`space-y-3 ${styles.modalTabContent}`}>
              <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
                <div className={styles.dataField}>
                  <p className={styles.dataLabel}>Русское название</p>
                  <p className={styles.dataValue}>{renderValue(specimenData.russianName)}</p>
                </div>
                <div className={styles.dataField}>
                  <p className={styles.dataLabel}>Латинское название</p>
                  <p className={`${styles.dataValue} italic`}>{renderValue(specimenData.latinName)}</p>
                </div>
                <div className={styles.dataField}>
                  <p className={styles.dataLabel}>Род</p>
                  <p className={styles.dataValue}>{renderValue(specimenData.genus)}</p>
                </div>
                <div className={styles.dataField}>
                  <p className={styles.dataLabel}>Вид</p>
                  <p className={styles.dataValue}>{renderValue(specimenData.species)}</p>
                </div>
                <div className={styles.dataField}>
                  <p className={styles.dataLabel}>Семейство</p>
                  <p className={styles.dataValue}>{renderValue(specimenData.familyName)}</p>
                </div>
                <div className={styles.dataField}>
                  <p className={styles.dataLabel}>ID семейства</p>
                  <p className={styles.dataValue}>{renderValue(specimenData.familyId)}</p>
                </div>
              </div>
              
              {/* Дополнительная таксономическая информация */}
              <div className="space-y-2">
                {specimenData.cultivar && (
                  <div className={styles.dataField}>
                    <p className={styles.dataLabel}>Культивар</p>
                    <p className={styles.dataValue}>{specimenData.cultivar}</p>
                  </div>
                )}
                {specimenData.form && (
                  <div className={styles.dataField}>
                    <p className={styles.dataLabel}>Форма</p>
                    <p className={styles.dataValue}>{specimenData.form}</p>
                  </div>
                )}
                {specimenData.synonyms && (
                  <div className={styles.dataField}>
                    <p className={styles.dataLabel}>Синонимы</p>
                    <p className={styles.dataValue}>{specimenData.synonyms}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'location' && (
            <div className={`space-y-3 ${styles.modalTabContent}`}>
              <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
                <div className={styles.dataField}>
                  <p className={styles.dataLabel}>Широта</p>
                  <p className={styles.dataValue}>{renderValue(specimenData.latitude)}</p>
                </div>
                <div className={styles.dataField}>
                  <p className={styles.dataLabel}>Долгота</p>
                  <p className={styles.dataValue}>{renderValue(specimenData.longitude)}</p>
                </div>
                <div className={styles.dataField}>
                  <p className={styles.dataLabel}>Тип сектора</p>
                  <p className={styles.dataValue}>{renderValue(specimenData.sectorType)}</p>
                </div>
                <div className={styles.dataField}>
                  <p className={styles.dataLabel}>ID сектора</p>
                  <p className={styles.dataValue}>{renderValue(specimenData.regionId)}</p>
                </div>
                <div className={styles.dataField}>
                  <p className={styles.dataLabel}>Название сектора</p>
                  <p className={styles.dataValue}>{renderValue(specimenData.regionName)}</p>
                </div>
                <div className={styles.dataField}>
                  <p className={styles.dataLabel}>Страна</p>
                  <p className={styles.dataValue}>{renderValue(specimenData.country)}</p>
                </div>
              </div>
              
              {/* Дополнительная информация о местоположении */}
              <div className={styles.dataField}>
                <p className={styles.dataLabel}>WKT координаты</p>
                <p className="text-sm font-mono text-xs bg-[#F5F5F7] p-1.5 rounded overflow-x-auto">{renderValue(specimenData.locationWkt)}</p>
              </div>
              
              <div className={styles.dataField}>
                <p className={styles.dataLabel}>Происхождение образца</p>
                <p className={styles.dataValue}>{renderValue(specimenData.sampleOrigin)}</p>
              </div>
              
              <div className={styles.dataField}>
                <p className={styles.dataLabel}>Естественный ареал</p>
                <p className={styles.dataValue}>{renderValue(specimenData.naturalRange)}</p>
              </div>
            </div>
          )}
          
          {activeTab === 'ecology' && (
            <div className={`space-y-3 ${styles.modalTabContent}`}>
              <div className={styles.dataField}>
                <p className={styles.dataLabel}>Экология и биология</p>
                <p className="text-sm p-2 bg-[#F5F5F7] rounded-lg">{renderValue(specimenData.ecologyAndBiology)}</p>
              </div>
              
              <div className={styles.dataField}>
                <p className={styles.dataLabel}>Экономическое использование</p>
                <p className="text-sm p-2 bg-[#F5F5F7] rounded-lg">{renderValue(specimenData.economicUse)}</p>
              </div>
              
              <div className={styles.dataField}>
                <p className={styles.dataLabel}>Статус сохранения</p>
                <p className={styles.dataValue}>{renderValue(specimenData.conservationStatus)}</p>
              </div>
            </div>
          )}
          
          {activeTab === 'additional' && (
            <div className={`space-y-3 ${styles.modalTabContent}`}>
              <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
                <div className={styles.dataField}>
                  <p className={styles.dataLabel}>Оригинальный селекционер</p>
                  <p className={styles.dataValue}>{renderValue(specimenData.originalBreeder)}</p>
                </div>
                <div className={styles.dataField}>
                  <p className={styles.dataLabel}>Год оригинала</p>
                  <p className={styles.dataValue}>{renderValue(specimenData.originalYear)}</p>
                </div>
                <div className={styles.dataField}>
                  <p className={styles.dataLabel}>ID экспозиции</p>
                  <p className={styles.dataValue}>{renderValue(specimenData.expositionId)}</p>
                </div>
                <div className={styles.dataField}>
                  <p className={styles.dataLabel}>ID образца</p>
                  <p className={styles.dataValue}>{renderValue(specimenData.id)}</p>
                </div>
              </div>
              
              {/* Дополнительная информация */}
              <div className={styles.dataField}>
                <p className={styles.dataLabel}>Информация о дубликатах</p>
                <p className={styles.dataValue}>{renderValue(specimenData.duplicatesInfo)}</p>
              </div>
              
              {specimenData.illustration && (
                <div className={styles.dataField}>
                  <p className={styles.dataLabel}>Иллюстрация</p>
                  <p className={styles.dataValue}>{specimenData.illustration}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Нижняя панель с кнопками действий */}
        <div className="px-3 py-2 border-t border-[#E5E5EA] flex justify-between">
          <button 
            className={`${styles.expandButton} ${isExpanded ? styles.expanded : ''}`}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 13H5V11H19V13Z" fill="#007AFF"/>
                </svg>
                Свернуть
              </>
            ) : (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z" fill="#007AFF"/>
                </svg>
                Развернуть
              </>
            )}
          </button>
          <button 
            className="px-4 py-1.5 text-xs font-medium rounded-full bg-[#F5F5F7] text-[#007AFF] hover:bg-[#E5E5EA] transition-colors flex items-center gap-1.5 shadow-sm hover:shadow"
            onClick={() => handleOpenDetailed(specimenData.id)}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 19H5V5H12V3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V12H19V19ZM14 3V5H17.59L7.76 14.83L9.17 16.24L19 6.41V10H21V3H14Z" fill="#007AFF"/>
            </svg>
            Открыть подробно
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlantDetailsModal; 