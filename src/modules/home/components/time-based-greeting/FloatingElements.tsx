import React, { useMemo } from 'react';
import { COLORS } from '../../../../styles/global-styles';

interface FloatingElementProps {
  timeOfDay: string;
  count?: number;
}

const FloatingElements: React.FC<FloatingElementProps> = React.memo(({ timeOfDay, count = 5 }) => {
  const elements = useMemo(() => {
    let elementType = '';
    let baseColor = '';

    switch (timeOfDay) {
      case 'morning':
        elementType = 'morning-particle';
        baseColor = `from-[${COLORS.warning.light}] to-[${COLORS.neutral.light}]`;
        break;
      case 'day':
        elementType = 'day-particle';
        baseColor = `from-[${COLORS.primary.light}] to-white`;
        break;
      case 'evening':
        elementType = 'evening-particle';
        baseColor = `from-[${COLORS.warning.light}] to-[${COLORS.neutral.light}]`;
        break;
      case 'night':
        elementType = 'night-particle';
        baseColor = `from-[${COLORS.secondary.light}] to-[${COLORS.primary.light}]`;
        break;
      default:
        elementType = 'day-particle';
        baseColor = `from-[${COLORS.primary.light}] to-white`;
    }

    return Array.from({ length: count }, (_, i) => {
      const size = 8 + Math.random() * 20; // размер (px)
      const left = Math.random() * 100;    // случайная позиция по горизонтали
      const animationDuration = 15 + Math.random() * 20; // 15s–35s
      const animationDelay = Math.random() * 10;         // 0s–10s
      const opacity = 0.3 + Math.random() * 0.4;         // 0.3–0.7

      return (
        <div
          key={i}
          className={`absolute rounded-full pointer-events-none bg-gradient-to-b ${baseColor} ${elementType}`}
          style={{
            width: `${size}px`,
            height: `${size}px`,
            left: `${left}%`,
            top: '-20px',
            opacity,
            animationDuration: `${animationDuration}s`,
            animationDelay: `${animationDelay}s`,
            animationPlayState: 'paused'
          }}
        />
      );
    });
  }, [timeOfDay, count]);

  return <>{elements}</>;
});

export default FloatingElements; 