import React, { ReactNode, useEffect, useState, useMemo } from 'react';
import { textClasses } from '../../../styles/global-styles';

export interface TimeInfo {
  greeting: string;
  icon: ReactNode;
  textColor: string;
}

const ICONS = {
  morning: (
    <svg className="w-8 h-8 text-[#E97451]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
    </svg>
  ),
  day: (
    <svg className="w-8 h-8 text-[#3882F6]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" />
    </svg>
  ),
  evening: (
    <svg className="w-8 h-8 text-[#E97451]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
    </svg>
  ),
  night: (
    <svg className="w-8 h-8 text-[#6366F1]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 0 1 .162.819A8.97 8.97 0 0 0 9 6a9 9 0 0 0 9 9 8.97 8.97 0 0 0 3.463-.69.75.75 0 0 1 .981.98 10.503 10.503 0 0 1-9.694 6.46c-5.799 0-10.5-4.7-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 0 1 .818.162Z" clipRule="evenodd" />
    </svg>
  )
};

// Массивы с разными вариантами приветствий для каждого времени суток
const MORNING_GREETINGS = [
  'Доброе утро, сад пробуждается вместе с тобой',
  'Цветущего начала дня',
  'Утро приносит новые ростки',
  'Встречай утро среди зелени',
  'Пусть день зацветёт ярко',
  'Утренняя свежесть сада ждёт тебя',
  'Пора сеять доброе'
];

const DAY_GREETINGS = [
  'Пусть день будет полон цветущих идей',
  'Зелёного вдохновения тебе сегодня',
  'Солнечный сад рад тебе',
  'День прекрасен для роста',
  'Расцветай вместе с садом',
  'Сад наполнен жизнью и ждёт твоих рук',
  'Пусть день принесёт плоды твоих усилий'
];

const EVENING_GREETINGS = [
  'Мягкого вечера среди цветов',
  'Вечерний сад вдохновляет на размышления',
  'Закат рисует в саду особую атмосферу',
  'Время бережного ухода за садом',
  'Сад благодарен за твой труд сегодня',
  'Пусть вечер принесёт удовлетворение от проделанного',
  'Сумерки в саду — время вдохновения'
];

const NIGHT_GREETINGS = [
  'Ночь открывает секреты',
  'Под лунными лучами',
  'Время ночных растений',
  'Ночная смена в саду',
  'Царство ночных цветов',
  'Тропический ноктюрн',
  'Сад под звёздами'
];

// Функция для получения случайного элемента из массива
const getRandomGreeting = (greetings: string[]): string => {
  const randomIndex = Math.floor(Math.random() * greetings.length);
  return greetings[randomIndex];
};

export const getTimeBasedGreeting = (): TimeInfo => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) {
    return { 
      greeting: getRandomGreeting(MORNING_GREETINGS), 
      textColor: 'text-[#E97451]', 
      icon: ICONS.morning 
    };
  } else if (hour >= 12 && hour < 17) {
    return { 
      greeting: getRandomGreeting(DAY_GREETINGS), 
      textColor: 'text-[#3882F6]', 
      icon: ICONS.day 
    };
  } else if (hour >= 17 && hour < 22) {
    return { 
      greeting: getRandomGreeting(EVENING_GREETINGS), 
      textColor: 'text-[#E97451]', 
      icon: ICONS.evening 
    };
  } else {
    return { 
      greeting: getRandomGreeting(NIGHT_GREETINGS), 
      textColor: 'text-[#6366F1]', 
      icon: ICONS.night 
    };
  }
};

interface AnimatedTextProps {
  text: string;
  baseDelay: number;
  isName?: boolean;
  animationStage: number;
}

const AnimatedText: React.FC<AnimatedTextProps> = React.memo(({ text, baseDelay, isName = false, animationStage }) => {
  const words = useMemo(() => text.split(' '), [text]);

  return (
    <span className="inline-flex flex-wrap">
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="inline-flex mr-[0.25em] last:mr-0">
          {word.split('').map((char, charIndex) => (
            <span
              key={charIndex}
              className={`inline-block transition-all duration-500 ease-out transform
                ${animationStage >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}
                ${animationStage >= 4 && !isName ? 'hover-effect' : ''}`}
              style={{ 
                transitionDelay: `${baseDelay + wordIndex * 40 + charIndex * 30}ms`,
                animationDelay: `${3000 + wordIndex * 40 + charIndex * 30}ms`
              }}
            >
              {char}
            </span>
          ))}
        </span>
      ))}
    </span>
  );
});

interface TimeBasedGreetingProps {
  timeInfo: TimeInfo;
  userName?: string;
}

const TimeBasedGreeting: React.FC<TimeBasedGreetingProps> = ({ timeInfo, userName }) => {
  const [animationStage, setAnimationStage] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setAnimationStage(1), 100),   // Анимация иконки
      setTimeout(() => setAnimationStage(2), 300),   // Анимация приветствия
      setTimeout(() => setAnimationStage(3), 600),   // Анимация подтекста
      setTimeout(() => setAnimationStage(4), 2000)   // Финальный эффект
    ];
    return () => timers.forEach(timer => clearTimeout(timer));
  }, []);

  const glowColor = useMemo(() => {
    if (timeInfo.textColor.includes('E97451')) return 'glow-orange';
    if (timeInfo.textColor.includes('3882F6')) return 'glow-blue';
    if (timeInfo.textColor.includes('6366F1')) return 'glow-indigo';
    return '';
  }, [timeInfo.textColor]);

  // Определяем класс анимации в зависимости от типа иконки
  const iconAnimationClass = useMemo(() => {
    if (timeInfo.icon === ICONS.morning) return 'morning-animation';
    if (timeInfo.icon === ICONS.day) return 'day-animation';
    if (timeInfo.icon === ICONS.evening) return 'evening-animation';
    if (timeInfo.icon === ICONS.night) return 'night-animation';
    return '';
  }, [timeInfo.icon]);

  return (
    <div className="mb-8 pt-2">
      <div className="flex items-center overflow-hidden">
        <span 
          className={`mr-3 transition-all duration-700 ease-out transform 
            ${animationStage >= 1 ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-50 -rotate-45'} 
            ${glowColor}
            ${animationStage >= 1 ? iconAnimationClass : ''}
            ${animationStage >= 4 ? 'pulse-effect' : ''}`}
        >
          {timeInfo.icon}
        </span>
        <h1 
          className={`text-3xl sm:text-4xl font-normal text-[#1D1D1F] transition-all duration-700 ease-out
            ${animationStage >= 2 ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-10 opacity-0 scale-95'}
            ${glowColor}`}
        >
          <AnimatedText text={timeInfo.greeting} baseDelay={300} animationStage={animationStage} />
          {userName && (
            <>
              <span 
                className={`inline-block mr-[0.15em] transition-all duration-500 ease-out transform
                  ${animationStage >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
                style={{ 
                  transitionDelay: `${300 + timeInfo.greeting.length * 30 + 50}ms`
                }}
              >,</span>
              <AnimatedText text={userName} baseDelay={500} isName animationStage={animationStage} />
            </>
          )}
        </h1>
      </div>
      {!userName && (
        <p 
          className={`${textClasses.body} text-base ml-11 mt-1 text-[#86868B] transition-all duration-1000 ease-out
            ${animationStage >= 3 ? 'translate-x-0 opacity-100 translate-y-0' : 'translate-x-5 opacity-0 translate-y-3'}`}
        >
          <span className="inline-block overflow-hidden">
            {animationStage >= 3 && (
              <AnimatedText 
                text="Добро пожаловать в Ботанический сад" 
                baseDelay={700} 
                animationStage={animationStage}
              />
            )}
          </span>
        </p>
      )}
      <style>{`
        .glow-orange { filter: drop-shadow(0 0 3px rgba(233, 116, 81, 0.3)); }
        .glow-blue { filter: drop-shadow(0 0 3px rgba(56, 130, 246, 0.3)); }
        .glow-indigo { filter: drop-shadow(0 0 3px rgba(99, 102, 241, 0.3)); }
        
        /* Базовая пульсация */
        .pulse-effect { animation: pulse-animation 2s infinite ease-in-out; }
        @keyframes pulse-animation { 0% { transform: scale(1); } 50% { transform: scale(1.05); } 100% { transform: scale(1); } }
        
        /* Анимация для утренней иконки - восход с сиянием */
        .morning-animation {
          animation: morning-appear 1.5s ease-out forwards, morning-shine 4s ease-in-out 1.5s infinite;
        }
        @keyframes morning-appear {
          0% { transform: translateY(10px) scale(0.5); opacity: 0; }
          60% { transform: translateY(-5px) scale(1.1); opacity: 0.9; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
        @keyframes morning-shine {
          0% { filter: drop-shadow(0 0 2px rgba(233, 116, 81, 0.3)); }
          50% { filter: drop-shadow(0 0 8px rgba(233, 116, 81, 0.6)); }
          100% { filter: drop-shadow(0 0 2px rgba(233, 116, 81, 0.3)); }
        }
        
        /* Анимация для дневной иконки - вращение и масштабирование */
        .day-animation {
          animation: day-appear 1.2s ease-out forwards, day-rotate 10s linear 1.2s infinite;
          transform-origin: center;
        }
        @keyframes day-appear {
          0% { transform: scale(0.1) rotate(180deg); opacity: 0; }
          50% { transform: scale(1.2) rotate(-20deg); opacity: 0.5; }
          100% { transform: scale(1) rotate(0); opacity: 1; }
        }
        @keyframes day-rotate {
          0% { transform: rotate(0); }
          25% { transform: rotate(5deg) scale(1.02); }
          50% { transform: rotate(0) scale(1); }
          75% { transform: rotate(-5deg) scale(1.02); }
          100% { transform: rotate(0) scale(1); }
        }
        
        /* Анимация для вечерней иконки - волновой эффект */
        .evening-animation {
          animation: evening-appear 1.3s ease-out forwards, evening-wave 6s ease-in-out 1.3s infinite;
        }
        @keyframes evening-appear {
          0% { transform: translateX(-15px) scale(0.8); opacity: 0; }
          70% { transform: translateX(5px) scale(1); opacity: 0.8; }
          100% { transform: translateX(0) scale(1); opacity: 1; }
        }
        @keyframes evening-wave {
          0% { transform: translateX(0); }
          25% { transform: translateX(-2px) rotate(-5deg); }
          50% { transform: translateX(0) rotate(0); }
          75% { transform: translateX(2px) rotate(5deg); }
          100% { transform: translateX(0) rotate(0); }
        }
        
        /* Анимация для ночной иконки - мерцание */
        .night-animation {
          animation: night-appear 1.8s ease-out forwards, night-twinkle 5s ease-in-out 1.8s infinite;
        }
        @keyframes night-appear {
          0% { transform: scale(0.4) rotate(-30deg); opacity: 0; }
          40% { transform: scale(1.1) rotate(10deg); opacity: 0.6; }
          70% { transform: scale(0.9) rotate(-5deg); opacity: 0.9; }
          100% { transform: scale(1) rotate(0); opacity: 1; }
        }
        @keyframes night-twinkle {
          0% { filter: drop-shadow(0 0 2px rgba(99, 102, 241, 0.3)); }
          25% { filter: drop-shadow(0 0 4px rgba(99, 102, 241, 0.5)); transform: scale(1.03); }
          50% { filter: drop-shadow(0 0 8px rgba(99, 102, 241, 0.7)); transform: scale(1); }
          75% { filter: drop-shadow(0 0 4px rgba(99, 102, 241, 0.5)); transform: scale(0.98); }
          100% { filter: drop-shadow(0 0 2px rgba(99, 102, 241, 0.3)); transform: scale(1); }
        }
        
        .hover-effect { transition: all 0.3s ease; position: relative; }
        .hover-effect:hover { transform: translateY(-2px); }
      `}</style>
    </div>
  );
};

export default React.memo(TimeBasedGreeting); 