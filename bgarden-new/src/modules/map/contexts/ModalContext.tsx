import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

interface ModalInstance {
  id: string;
  plantId: string;
}

interface ModalContextType {
  openModals: ModalInstance[];
  openModal: (plantId: string) => void;
  closeModal: (id: string) => void;
  closeAllModals: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ 
  children: ReactNode;
  renderModal?: (modalId: string, plantId: string, onClose: () => void) => React.ReactNode;
}> = ({ children, renderModal }) => {
  const [openModals, setOpenModals] = useState<ModalInstance[]>([]);

  // Открытие нового модального окна
  const openModal = useCallback((plantId: string) => {
    // Проверяем, есть ли уже открытое модальное окно для этого растения
    setOpenModals(prevModals => {
      // Если модальное окно для этого plantId уже существует, не создаем новое
      if (prevModals.some(modal => modal.plantId === plantId)) {
        return prevModals;
      }
      
      // Создаем новое модальное окно
      const modalId = `modal-${Date.now()}`;
      return [...prevModals, { id: modalId, plantId }];
    });
  }, []);

  // Закрытие модального окна по ID
  const closeModal = useCallback((id: string) => {
    setOpenModals(prevModals => prevModals.filter(modal => modal.id !== id));
  }, []);

  // Закрытие всех модальных окон
  const closeAllModals = useCallback(() => {
    setOpenModals([]);
  }, []);

  // Предоставляем доступ к модальным окнам через контекст
  const value = {
    openModals,
    openModal,
    closeModal,
    closeAllModals
  };

  return (
    <ModalContext.Provider value={value}>
      {children}
      
      {/* Рендерим все открытые модальные окна через renderModal пропс */}
      {renderModal && openModals.map(modal => (
        <React.Fragment key={modal.id}>
          {renderModal(modal.id, modal.plantId, () => closeModal(modal.id))}
        </React.Fragment>
      ))}
    </ModalContext.Provider>
  );
};

// Хук для использования контекста модальных окон
export const useModalContext = (): ModalContextType => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModalContext must be used within a ModalProvider');
  }
  return context;
};

export default ModalContext; 