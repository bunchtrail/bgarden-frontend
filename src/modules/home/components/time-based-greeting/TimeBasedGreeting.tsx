import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { textClasses } from '../../../../styles/global-styles';

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

  // Определяем время суток на основе цвета текста
  const timeOfDay = useMemo(() => {
    if (liveTimeInfo.textColor.includes('E97451')) {
      return new Date().getHours() >= 17 ? 'evening' : 'morning';
    }
    if (liveTimeInfo.textColor.includes('3882F6')) return 'day';
    if (liveTimeInfo.textColor.includes('6366F1')) return 'night';
    return 'day';
  }, [liveTimeInfo.textColor]);

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
        newTimeInfo.textColor !== liveTimeInfo.textColor
      ) {
        // Сначала «плавно прячем» старое приветствие
        setTransitionState('fading');
        setTimeout(() => {
          // После небольшой задержки обновляем
          setLiveTimeInfo(newTimeInfo);
          setTransitionState('appearing');
        }, 500);
      }
    }, 60000);

    return () => clearInterval(timer);
  }, [liveTimeInfo]);

  // При ререндере компонента извне сразу устанавливаем новое приветствие
  useEffect(() => {
    setLiveTimeInfo(timeInfo);
  }, [timeInfo]);

  // Выбираем CSS-класс для свечения в зависимости от текущего цвета текста
  const glowColor = useMemo(() => {
    if (liveTimeInfo.textColor.includes('E97451')) return 'glow-orange';
    if (liveTimeInfo.textColor.includes('3882F6')) return 'glow-blue';
    if (liveTimeInfo.textColor.includes('6366F1')) return 'glow-indigo';
    return '';
  }, [liveTimeInfo.textColor]);

  // Определяем класс анимации иконки
  const iconAnimationClass = useMemo(() => {
    if (liveTimeInfo.icon === ICONS.morning) return 'morning-animation';
    if (liveTimeInfo.icon === ICONS.day) return 'day-animation';
    if (liveTimeInfo.icon === ICONS.evening) return 'evening-animation';
    if (liveTimeInfo.icon === ICONS.night) return 'night-animation';
    return '';
  }, [liveTimeInfo.icon]);

  // Обработчик движения мыши для 3D-эффекта
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

  // Простая демонстрация звукового эффекта
  const playSoundEffect = useCallback(() => {
    try {
      const audio = new Audio();
      if (timeOfDay === 'morning') {
        audio.src = '/sounds/morning.mp3';
      } else if (timeOfDay === 'day') {
        audio.src = '/sounds/day.mp3';
      } else if (timeOfDay === 'evening') {
        audio.src = '/sounds/evening.mp3';
      } else if (timeOfDay === 'night') {
        audio.src = '/sounds/night.mp3';
      }
      audio.volume = 0.3;
      audio.play().catch(e => console.log('Ошибка воспроизведения звука:', e));
    } catch (e) {
      console.log('Звуковой эффект недоступен:', e);
    }
  }, [timeOfDay]);

  return (
    <div className="flex flex-col items-center justify-center">
      {/* Контейнер для 3D-эффекта */}
      <div
        ref={containerRef}
        className={`
          flex items-center justify-center mb-3 bg-white/70 backdrop-blur-sm px-5 py-3 
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
        {/* Плавающие элементы в фоне */}
        <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
          <FloatingElements timeOfDay={timeOfDay} count={7} />
        </div>

        {/* Иконка времени суток */}
        <span
          className={`
            mr-3 transition-all duration-500 ease-out transform z-10 relative
            ${animationStage >= 1 ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-50 -rotate-45'} 
            ${glowColor}
            ${animationStage >= 1 ? iconAnimationClass : ''}
            ${isHovered ? 'hover-pulse-effect scale-110' : ''}
          `}
        >
          {liveTimeInfo.icon}
        </span>

        {/* Заголовок приветствия */}
        <h1
          className={`
            ${textClasses.heading} text-black text-2xl font-medium transition-all 
            duration-500 ease-out z-10 relative
            ${animationStage >= 2 ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-10 opacity-0 scale-95'}
            ${glowColor}
          `}
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

      {/* Встроенные стили, при желании можно вынести в .css или .module.css */}
      <style>{`
        .glow-orange { filter: drop-shadow(0 0 3px rgba(233, 116, 81, 0.3)); }
        .glow-blue { filter: drop-shadow(0 0 3px rgba(56, 130, 246, 0.3)); }
        .glow-indigo { filter: drop-shadow(0 0 3px rgba(99, 102, 241, 0.3)); }

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

        /* Волновая анимация символов текста при наведении */
        .hover-active .hover-wave-text {
          animation: wave-text 3s ease-in-out infinite;
          animation-delay: calc(0.1s * var(--char-index));
        }
        @keyframes wave-text {
          0% { transform: translateY(0); }
          25% { transform: translateY(-2px); }
          50% { transform: translateY(0); }
          75% { transform: translateY(2px); }
          100% { transform: translateY(0); }
        }

        /* Анимации для иконок утра, дня, вечера, ночи */
        .morning-animation {
          animation: morning-appear 1s ease-out forwards, morning-shine 4s ease-in-out 1s infinite;
        }
        @keyframes morning-appear {
          0% { transform: translateY(10px) scale(0.5); opacity: 0; }
          60% { transform: translateY(-3px) scale(1.1); opacity: 0.9; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
        @keyframes morning-shine {
          0% { filter: drop-shadow(0 0 2px rgba(233, 116, 81, 0.4)); }
          50% { filter: drop-shadow(0 0 6px rgba(233, 116, 81, 0.7)); }
          100% { filter: drop-shadow(0 0 2px rgba(233, 116, 81, 0.4)); }
        }

        .day-animation {
          animation: day-appear 0.8s ease-out forwards, day-rotate 8s ease-in-out 0.8s infinite;
        }
        @keyframes day-appear {
          0% { transform: scale(0.1) rotate(180deg); opacity: 0; }
          50% { transform: scale(1.2) rotate(-20deg); opacity: 0.5; }
          100% { transform: scale(1) rotate(0); opacity: 1; }
        }
        @keyframes day-rotate {
          0% { transform: rotate(0); filter: brightness(1); }
          25% { transform: rotate(5deg) scale(1.02); filter: brightness(1.1); }
          50% { transform: rotate(0) scale(1); filter: brightness(1); }
          75% { transform: rotate(-5deg) scale(1.02); filter: brightness(1.1); }
          100% { transform: rotate(0) scale(1); filter: brightness(1); }
        }

        .evening-animation {
          animation: evening-appear 0.9s ease-out forwards, evening-wave 5s ease-in-out 0.9s infinite;
        }
        @keyframes evening-appear {
          0% { transform: translateX(-15px) scale(0.8); opacity: 0; }
          70% { transform: translateX(3px) scale(1); opacity: 0.8; }
          100% { transform: translateX(0) scale(1); opacity: 1; }
        }
        @keyframes evening-wave {
          0% { transform: translateX(0); filter: saturate(1); }
          25% { transform: translateX(-2px) rotate(-3deg); filter: saturate(1.2); }
          50% { transform: translateX(0) rotate(0); filter: saturate(1); }
          75% { transform: translateX(2px) rotate(3deg); filter: saturate(1.2); }
          100% { transform: translateX(0) rotate(0); filter: saturate(1); }
        }

        .night-animation {
          animation: night-appear 1.2s ease-out forwards, night-twinkle 4s ease-in-out 1.2s infinite;
        }
        @keyframes night-appear {
          0% { transform: scale(0.4) rotate(-30deg); opacity: 0; }
          40% { transform: scale(1.1) rotate(10deg); opacity: 0.6; }
          70% { transform: scale(0.9) rotate(-5deg); opacity: 0.9; }
          100% { transform: scale(1) rotate(0); opacity: 1; }
        }
        @keyframes night-twinkle {
          0% { filter: drop-shadow(0 0 2px rgba(99, 102, 241, 0.4)); }
          25% { filter: drop-shadow(0 0 4px rgba(99, 102, 241, 0.6)); transform: scale(1.02); }
          50% { filter: drop-shadow(0 0 7px rgba(99, 102, 241, 0.8)); transform: scale(1); }
          75% { filter: drop-shadow(0 0 4px rgba(99, 102, 241, 0.6)); transform: scale(0.99); }
          100% { filter: drop-shadow(0 0 2px rgba(99, 102, 241, 0.4)); transform: scale(1); }
        }

        .hover-effect {
          transition: all 0.2s ease;
          position: relative;
        }
        .hover-effect:hover {
          transform: translateY(-2px);
          text-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
      `}</style>
    </div>
  );
};

export default React.memo(TimeBasedGreeting); 