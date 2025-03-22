import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { textClasses, layoutClasses, COLORS } from '../../../../styles/global-styles';

// Импортируем наши утилиты и типы
import {
  TimeInfo,
  getTimeBasedGreeting,
  ICONS
} from './timeUtils';

// Импортируем подкомпоненты
import AnimatedText from './AnimatedText';
import FloatingElements from './FloatingElements';

interface TimeBasedGreetingProps {
  timeInfo: TimeInfo;
  userName?: string;
}

const TimeBasedGreeting: React.FC<TimeBasedGreetingProps> = ({ timeInfo, userName }) => {
  const [animationStage, setAnimationStage] = useState<number>(0);
  const [transform, setTransform] = useState<string>('perspective(1000px) rotateX(0deg) rotateY(0deg)');
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [liveTimeInfo, setLiveTimeInfo] = useState<TimeInfo>(timeInfo);
  const [transitionState, setTransitionState] = useState<string>('');
  const containerRef = useRef<HTMLDivElement>(null);

  // Определяем время суток для выбора анимации
  const timeOfDay = useMemo(() => {
    if (liveTimeInfo.type === 'morning' || liveTimeInfo.type === 'evening') return liveTimeInfo.type;
    if (liveTimeInfo.type === 'day') return 'day';
    if (liveTimeInfo.type === 'night') return 'night';
    return 'day';
  }, [liveTimeInfo.type]);

  // Запускаем начальную анимацию
  useEffect(() => {
    const timers = [
      setTimeout(() => setAnimationStage(1), 100),
      setTimeout(() => setAnimationStage(2), 300),
      setTimeout(() => setAnimationStage(3), 600),
      setTimeout(() => setAnimationStage(4), 1500)
    ];
    return () => timers.forEach(timer => clearTimeout(timer));
  }, []);

  // Обновляем информацию о приветствии раз в минуту
  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeInfo = getTimeBasedGreeting();
      if (
        newTimeInfo.greeting !== liveTimeInfo.greeting ||
        newTimeInfo.type !== liveTimeInfo.type
      ) {
        setTransitionState('fading');
        setTimeout(() => {
          setLiveTimeInfo(newTimeInfo);
          setTransitionState('appearing');
        }, 500);
      }
    }, 60000);

    return () => clearInterval(timer);
  }, [liveTimeInfo]);

  // При изменении timeInfo снаружи
  useEffect(() => {
    setLiveTimeInfo(timeInfo);
  }, [timeInfo]);

  // Цвета и эффекты в зависимости от времени суток
  const { textColor, glowEffect, iconAnimation } = useMemo(() => {
    let textColor, glowEffect, iconAnimation;
    
    switch(liveTimeInfo.type) {
      case 'morning':
        textColor = COLORS.warning.main;
        glowEffect = `drop-shadow(0 0 3px ${COLORS.warning.light})`;
        iconAnimation = 'morning-animation';
        break;
      case 'day':
        textColor = COLORS.primary.main;
        glowEffect = `drop-shadow(0 0 3px ${COLORS.primary.light})`;
        iconAnimation = 'day-animation';
        break;
      case 'evening':
        textColor = COLORS.warning.main;
        glowEffect = `drop-shadow(0 0 3px ${COLORS.warning.light})`;
        iconAnimation = 'evening-animation';
        break;
      case 'night':
        textColor = COLORS.secondary.main;
        glowEffect = `drop-shadow(0 0 3px ${COLORS.secondary.light})`;
        iconAnimation = 'night-animation';
        break;
      default:
        textColor = COLORS.primary.main;
        glowEffect = `drop-shadow(0 0 3px ${COLORS.primary.light})`;
        iconAnimation = 'day-animation';
    }
    
    return { textColor, glowEffect, iconAnimation };
  }, [liveTimeInfo.type]);

  // Обработчики для 3D-эффекта
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTransform(`perspective(1000px) rotateX(${y * 10}deg) rotateY(${-x * 10}deg) scale(1.02)`);
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)');
  }, []);

  // Звуковой эффект
  const playSoundEffect = useCallback(() => {
    try {
      const audio = new Audio();
      audio.src = `/sounds/${timeOfDay}.mp3`;
      audio.volume = 0.3;
      audio.play().catch(e => {/* Обработка ошибки */});
    } catch (e) {
      // Тихая обработка ошибок
    }
  }, [timeOfDay]);

  return (
    <div className={`${layoutClasses.flexCenter} flex-col`}>
      {/* Контейнер для 3D-эффекта */}
      <div
        ref={containerRef}
        className={`
          ${layoutClasses.flexCenter} mb-3 bg-white/70 backdrop-blur-sm px-5 py-3 
          rounded-xl shadow-sm border border-gray-100 transition-all duration-300 ease-out 
          relative overflow-hidden
          ${transitionState === 'fading' ? 'opacity-0 scale-95' : ''} 
          ${transitionState === 'appearing' ? 'opacity-100 scale-100' : ''}
          ${isHovered ? 'shadow-md border-gray-200 hover-active' : ''}
        `}
        style={{ transform }}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={playSoundEffect}
      >
        {/* Фоновые элементы */}
        <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
          <FloatingElements timeOfDay={timeOfDay} count={7} />
        </div>

        {/* Иконка времени суток */}
        <span
          className={`
            mr-3 transition-all duration-500 ease-out transform z-10 relative
            ${animationStage >= 1 ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-50 -rotate-45'} 
            ${animationStage >= 1 ? iconAnimation : ''}
            ${isHovered ? 'hover-pulse-effect scale-110' : ''}
          `}
          style={{ color: textColor, filter: glowEffect }}
        >
          {liveTimeInfo.icon}
        </span>

        {/* Заголовок приветствия */}
        <h1
          className={`
            ${textClasses.heading} ${textClasses.primary} text-2xl font-medium transition-all 
            duration-500 ease-out z-10 relative
            ${animationStage >= 2 ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-10 opacity-0 scale-95'}
          `}
          style={{ filter: glowEffect }}
        >
          <AnimatedText
            text={liveTimeInfo.greeting}
            baseDelay={250}
            animationStage={animationStage}
          />

          {userName && (
            <>
              <span
                className={`
                  inline-block mr-[0.15em] transition-all duration-300 ease-out transform
                  ${animationStage >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}
                `}
                style={{
                  transitionDelay: `${300 + liveTimeInfo.greeting.length * 15}ms`
                }}
              >
                ,
              </span>
              <AnimatedText
                text={userName}
                baseDelay={350}
                isName={true}
                animationStage={animationStage}
              />
            </>
          )}
        </h1>
      </div>

      {/* Встроенные стили для анимаций */}
      <style>{`
        /* При наведении анимация частиц запускается */
        .hover-active .morning-particle,
        .hover-active .day-particle,
        .hover-active .evening-particle,
        .hover-active .night-particle {
          animation-play-state: running;
        }

        .hover-pulse-effect {
          animation: pulse-animation 3s infinite ease-in-out;
        }
        @keyframes pulse-animation {
          0% { transform: scale(1); filter: brightness(1); }
          50% { transform: scale(1.05); filter: brightness(1.1); }
          100% { transform: scale(1); filter: brightness(1); }
        }

        /* Плавающие частицы */
        .morning-particle,
        .day-particle,
        .evening-particle,
        .night-particle {
          animation: float-animation linear infinite paused;
        }
        .night-particle {
          animation: float-animation linear infinite paused, twinkle 4s ease-in-out infinite paused;
        }
        .hover-active .night-particle {
          animation: float-animation linear infinite running, twinkle 4s ease-in-out infinite running;
        }
        @keyframes float-animation {
          0% { transform: translateY(0) rotate(0deg); }
          100% { transform: translateY(120vh) rotate(360deg); }
        }
        @keyframes twinkle {
          0% { opacity: 0.2; }
          50% { opacity: 0.7; }
          100% { opacity: 0.2; }
        }

        /* Анимация волны для текста */
        .hover-wave-text {
          display: inline-block;
          animation: none;
        }
        .hover-effect:hover .hover-wave-text {
          animation: wave-text 2s infinite;
          animation-delay: calc(0.1s * var(--char-index));
        }
        @keyframes wave-text {
          0% { transform: translateY(0); }
          25% { transform: translateY(-2px); }
          50% { transform: translateY(0); }
          75% { transform: translateY(2px); }
          100% { transform: translateY(0); }
        }

        /* Анимации для иконок разного времени суток */
        .morning-animation {
          animation: morning-animation 15s infinite ease-in-out;
        }
        .day-animation {
          animation: day-animation 15s infinite ease-in-out;
        }
        .evening-animation {
          animation: evening-animation 15s infinite ease-in-out;
        }
        .night-animation {
          animation: night-animation 15s infinite ease-in-out;
        }

        @keyframes morning-animation {
          0%, 100% { transform: rotate(0deg) scale(1); }
          25% { transform: rotate(10deg) scale(1.05); }
          75% { transform: rotate(-5deg) scale(0.98); }
        }
        @keyframes day-animation {
          0%, 100% { transform: rotate(0deg) scale(1); filter: brightness(1); }
          33% { transform: rotate(8deg) scale(1.08); filter: brightness(1.15); }
          66% { transform: rotate(-8deg) scale(0.95); filter: brightness(0.92); }
        }
        @keyframes evening-animation {
          0%, 100% { transform: rotate(0deg) translateX(0); }
          33% { transform: rotate(-5deg) translateX(-2px); }
          66% { transform: rotate(5deg) translateX(2px); }
        }
        @keyframes night-animation {
          0%, 100% { transform: scale(1) rotate(0); opacity: 1; }
          25% { transform: scale(1.1) rotate(5deg); opacity: 0.8; }
          75% { transform: scale(0.9) rotate(-5deg); opacity: 0.9; }
        }
      `}</style>
    </div>
  );
};

export default React.memo(TimeBasedGreeting); 