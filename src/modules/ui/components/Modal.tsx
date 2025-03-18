import React, { useEffect, useRef, useState } from 'react';
import { COLORS, cardClasses, textClasses, buttonClasses, animationClasses } from '../../../styles/global-styles';

export interface ModalProps {
  /**
   * Флаг, открыто ли модальное окно
   */
  isOpen: boolean;
  /**
   * Обработчик закрытия модального окна
   */
  onClose: () => void;
  /**
   * Заголовок модального окна
   */
  title?: React.ReactNode;
  /**
   * Дополнительные действия в заголовке модального окна (справа)
   */
  headerAction?: React.ReactNode;
  /**
   * Содержимое модального окна
   */
  children: React.ReactNode;
  /**
   * Содержимое футера модального окна
   */
  footer?: React.ReactNode;
  /**
   * Размер модального окна
   */
  size?: 'small' | 'medium' | 'large' | 'fullscreen';
  /**
   * Вариант стиля модального окна
   */
  variant?: 'outlined' | 'elevated' | 'filled';
  /**
   * Дополнительные CSS классы для контейнера модального окна
   */
  className?: string;
  /**
   * Дополнительные CSS классы для внутреннего контейнера модального окна
   */
  contentClassName?: string;
  /**
   * Флаг, закрывается ли модальное окно при клике на оверлей
   */
  closeOnOverlayClick?: boolean;
  /**
   * Флаг, закрывается ли модальное окно при нажатии Escape
   */
  closeOnEsc?: boolean;
  /**
   * Флаг, показывать ли кнопку закрытия
   */
  showCloseButton?: boolean;
  /**
   * Позиция модального окна по вертикали
   */
  verticalPosition?: 'top' | 'center' | 'bottom';
  /**
   * Анимация появления модального окна
   */
  animation?: 'fade' | 'slide' | 'scale' | 'none';
  /**
   * Блокировать ли прокрутку страницы при открытии модального окна
   */
  blockScroll?: boolean;
}

/**
 * Универсальный компонент модального окна.
 * Поддерживает различные размеры, анимации, стили и настройки поведения.
 */
const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  headerAction,
  children,
  footer,
  size = 'medium',
  variant = 'elevated',
  className = '',
  contentClassName = '',
  closeOnOverlayClick = true,
  closeOnEsc = true,
  showCloseButton = true,
  verticalPosition = 'center',
  animation = 'fade',
  blockScroll = false
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Получаем базовый класс карточки для стилизации
  const baseClass = cardClasses.base;
  
  // Класс для варианта стиля
  const variantClass = variant === 'outlined' 
    ? cardClasses.outlined
    : variant === 'filled'
    ? cardClasses.filled
    : cardClasses.elevated;
  
  // Определяем класс размера
  const sizeClass = {
    small: 'w-full max-w-sm',
    medium: 'w-full max-w-lg',
    large: 'w-full max-w-3xl',
    fullscreen: 'w-[95vw] h-[90vh] max-w-none'
  }[size];
  
  // Определяем класс вертикального положения
  const positionClass = {
    top: 'mt-24',
    center: 'my-auto',
    bottom: 'mb-24'
  }[verticalPosition];
  
  // Определяем класс анимации
  const animationClass = {
    fade: 'animate-fadeIn',
    slide: 'animate-slideInUp',
    scale: 'animate-scaleIn',
    none: ''
  }[animation];
  
  // Базовые классы для модального окна
  const modalClasses = `${baseClass} ${variantClass} ${sizeClass} ${positionClass} ${animationClass} ${className} z-50 overflow-auto max-h-[90vh]`;
  
  // Функция обработки клика на оверлей
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && closeOnOverlayClick) {
      onClose();
    }
  };
  
  // Добавляем и удаляем обработчик нажатия клавиши Escape
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && closeOnEsc) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, closeOnEsc, onClose]);
  
  // Управляем отображением модального окна с анимацией
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      // Блокируем прокрутку body только если это необходимо
      if (blockScroll) {
        document.body.style.overflow = 'hidden';
      }
    } else {
      // Задержка, чтобы успела проиграться анимация при закрытии
      const timer = setTimeout(() => {
        setIsVisible(false);
        // Разблокируем прокрутку body, если она была заблокирована
        if (blockScroll) {
          document.body.style.overflow = '';
        }
      }, 300);
      return () => clearTimeout(timer);
    }
    
    return () => {
      // Разблокируем прокрутку body при размонтировании компонента
      if (blockScroll) {
        document.body.style.overflow = '';
      }
    };
  }, [isOpen, blockScroll]);
  
  // Если модальное окно закрыто и не должно быть видимым, не рендерим его
  if (!isVisible && !isOpen) {
    return null;
  }
  
  return (
    <div 
      className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity ${
        isOpen ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-hidden={!isOpen}
      style={{ pointerEvents: 'all' }}
    >
      <div 
        ref={modalRef}
        className={modalClasses}
        onClick={(e) => e.stopPropagation()}
        style={{ pointerEvents: 'all' }}
      >
        {/* Шапка модального окна */}
        {(title || showCloseButton) && (
          <div className={`${cardClasses.header} border-b border-[#E5E5EA]`}>
            <div className="flex-grow">
              {typeof title === 'string' ? (
                <h3 className={cardClasses.title}>{title}</h3>
              ) : (
                title
              )}
            </div>
            <div className="flex items-center">
              {headerAction && <div className="mr-2">{headerAction}</div>}
              {showCloseButton && (
                <button 
                  type="button"
                  className="p-1 rounded-full text-[#86868B] hover:text-[#1D1D1F] hover:bg-[#F5F5F7] transition-colors"
                  onClick={onClose}
                  aria-label="Закрыть"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              )}
            </div>
          </div>
        )}
        
        {/* Содержимое модального окна */}
        <div className={`${cardClasses.content} ${contentClassName}`}>
          {children}
        </div>
        
        {/* Футер модального окна */}
        {footer && (
          <div className={cardClasses.footer}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal; 