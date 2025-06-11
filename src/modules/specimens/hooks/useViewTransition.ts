import { useState, useEffect, useCallback } from 'react';

type ViewType = 'grid' | 'list';
type TransitionState = 'idle' | 'exiting' | 'entering';

interface UseViewTransitionOptions {
  transitionDuration?: number;
}

interface UseViewTransitionReturn {
  currentView: ViewType;
  displayView: ViewType;
  transitionState: TransitionState;
  isTransitioning: boolean;
  changeView: (newView: ViewType) => void;
  getTransitionClasses: () => string;
  getContainerClasses: () => string;
}

/**
 * Хук для плавного переключения между видами списка и сетки
 */
export const useViewTransition = (
  initialView: ViewType = 'grid',
  options: UseViewTransitionOptions = {}
): UseViewTransitionReturn => {
  const { transitionDuration = 400 } = options;

  const [currentView, setCurrentView] = useState<ViewType>(initialView);
  const [displayView, setDisplayView] = useState<ViewType>(initialView);
  const [transitionState, setTransitionState] =
    useState<TransitionState>('idle');
  const [isTransitioning, setIsTransitioning] = useState(false);

  const changeView = useCallback(
    (newView: ViewType) => {
      if (newView === currentView || isTransitioning) return;

      // Начинаем переход
      setIsTransitioning(true);
      setTransitionState('exiting');

      // После завершения анимации выхода
      setTimeout(() => {
        setDisplayView(newView);
        setCurrentView(newView);
        setTransitionState('entering');

        // После завершения анимации входа
        setTimeout(() => {
          setTransitionState('idle');
          setIsTransitioning(false);
        }, transitionDuration * 0.6); // 60% от общего времени для входа
      }, transitionDuration * 0.4); // 40% от общего времени для выхода
    },
    [currentView, isTransitioning, transitionDuration]
  );

  const getTransitionClasses = useCallback(() => {
    switch (transitionState) {
      case 'exiting':
        return 'animate-fadeOutScale';
      case 'entering':
        return 'animate-fadeInScale';
      default:
        return '';
    }
  }, [transitionState]);

  const getContainerClasses = useCallback(() => {
    if (isTransitioning) {
      return 'animate-containerTransition';
    }
    return '';
  }, [isTransitioning]);
  // Синхронизация с внешним состоянием
  useEffect(() => {
    if (!isTransitioning && displayView !== initialView) {
      setDisplayView(initialView);
      setCurrentView(initialView);
    }
  }, [initialView, displayView, isTransitioning]);

  return {
    currentView,
    displayView,
    transitionState,
    isTransitioning,
    changeView,
    getTransitionClasses,
    getContainerClasses,
  };
};
