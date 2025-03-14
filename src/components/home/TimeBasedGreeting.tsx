import React, { ReactNode, useEffect, useState, useMemo } from 'react';
import { textClasses } from '../../styles/global-styles';

export interface TimeInfo {
  greeting: string;
  icon: ReactNode;
  textColor: string;
}

const ICONS = {
  morning: (
    <svg className="w-8 h-8 text-[#E97451]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" d="M12 1.5a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 12 1.5Zm5.05 3.2a.75.75 0 0 1 1.06 0 .75.75 0 0 1 0 1.06l-1.06 1.06a.75.75 0 0 1-1.06-1.06l1.06-1.06ZM18.75 12a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1 0-1.5h1.5a.75.75 0 0 1 .75.75ZM12 18a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 12 18Zm-8.25-6a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1-.75-.75Zm5.05-6.76a.75.75 0 0 1 0 1.06L7.76 7.76a.75.75 0 0 1-1.06-1.06l1.06-1.06a.75.75 0 0 1 1.06 0Zm-1.06 12.46a.75.75 0 0 1 1.06 0l1.06-1.06a.75.75 0 0 1-1.06-1.06l-1.06 1.06a.75.75 0 0 1 0 1.06Zm8.46-10.34a.75.75 0 0 0-1.06-1.06L14.1 7.76a.75.75 0 0 0 1.06 1.06l1.06-1.06Zm-10.34 9.28a.75.75 0 0 0 0-1.06l-1.06-1.06a.75.75 0 0 0-1.06 1.06l1.06 1.06a.75.75 0 0 0 1.06 0Z" clipRule="evenodd" />
    </svg>
  ),
  day: (
    <svg className="w-8 h-8 text-[#3882F6]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" d="M12 1.5a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 12 1.5Zm5.05 3.2a.75.75 0 0 1 1.06 0 .75.75 0 0 1 0 1.06l-1.06 1.06a.75.75 0 0 1-1.06-1.06l1.06-1.06ZM18.75 12a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1 0-1.5h1.5a.75.75 0 0 1 .75.75ZM12 18a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 12 18Zm-8.25-6a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1-.75-.75Zm5.05-6.76a.75.75 0 0 1 0 1.06L7.76 7.76a.75.75 0 0 1-1.06-1.06l1.06-1.06a.75.75 0 0 1 1.06 0Zm-1.06 12.46a.75.75 0 0 1 1.06 0l1.06-1.06a.75.75 0 0 1-1.06-1.06l-1.06 1.06a.75.75 0 0 1 0 1.06Zm8.46-10.34a.75.75 0 0 0-1.06-1.06L14.1 7.76a.75.75 0 0 0 1.06 1.06l1.06-1.06Zm-10.34 9.28a.75.75 0 0 0 0-1.06l-1.06-1.06a.75.75 0 0 0-1.06 1.06l1.06 1.06a.75.75 0 0 0 1.06 0Z" clipRule="evenodd" />
    </svg>
  ),
  evening: (
    <svg className="w-8 h-8 text-[#E97451]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.53 16.28a.75.75 0 0 1-1.06 0 7.5 7.5 0 0 1 0-10.6.75.75 0 0 1 1.06 1.06 6 6 0 0 0 0 8.48.75.75 0 0 1 0 1.06ZM15.72 13.1a.75.75 0 0 1-1.06 0 4.5 4.5 0 0 1 0-6.36.75.75 0 1 1 1.06 1.06 3 3 0 0 0 0 4.24.75.75 0 0 1 0 1.06ZM9.34 13.1a.75.75 0 0 1-1.06 0 4.5 4.5 0 0 1 0-6.36.75.75 0 0 1 1.06 1.06 3 3 0 0 0 0 4.24.75.75 0 0 1 0 1.06ZM6.15 16.28a.75.75 0 0 1-1.06 0 7.5 7.5 0 0 1 0-10.6.75.75 0 0 1 1.06 1.06 6 6 0 0 0 0 8.48.75.75 0 0 1 0 1.06ZM2.96 19.46a.75.75 0 0 1-1.06 0 10.5 10.5 0 0 1 0-14.84.75.75 0 1 1 1.06 1.06 9 9 0 0 0 0 12.72.75.75 0 0 1 0 1.06ZM18.9 19.46a.75.75 0 0 1-1.06 0 9 9 0 0 0 0-12.72.75.75 0 1 1 1.06-1.06 10.5 10.5 0 0 1 0 14.84.75.75 0 0 1-1.06 0Z" />
    </svg>
  ),
  night: (
    <svg className="w-8 h-8 text-[#6366F1]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 0 1 .162.819A8.97 8.97 0 0 0 9 6a9 9 0 0 0 9 9 8.97 8.97 0 0 0 3.463-.69.75.75 0 0 1 .981.98 10.503 10.503 0 0 1-9.694 6.46c-5.799 0-10.5-4.7-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 0 1 .818.162Z" clipRule="evenodd" />
    </svg>
  )
};

export const getTimeBasedGreeting = (): TimeInfo => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) {
    return { greeting: 'Доброе утро', textColor: 'text-[#E97451]', icon: ICONS.morning };
  } else if (hour >= 12 && hour < 17) {
    return { greeting: 'Добрый день', textColor: 'text-[#3882F6]', icon: ICONS.day };
  } else if (hour >= 17 && hour < 22) {
    return { greeting: 'Добрый вечер', textColor: 'text-[#E97451]', icon: ICONS.evening };
  } else {
    return { greeting: 'Доброй ночи', textColor: 'text-[#6366F1]', icon: ICONS.night };
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

  return (
    <div className="mb-8 pt-2">
      <div className="flex items-center overflow-hidden">
        <span 
          className={`mr-3 transition-all duration-700 ease-out transform 
            ${animationStage >= 1 ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-50 -rotate-45'} 
            ${glowColor}
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
                className={`inline-block mx-[0.15em] transition-all duration-500 ease-out transform
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
        .pulse-effect { animation: pulse-animation 2s infinite ease-in-out; }
        @keyframes pulse-animation { 0% { transform: scale(1); } 50% { transform: scale(1.05); } 100% { transform: scale(1); } }
        .hover-effect { transition: all 0.3s ease; position: relative; }
        .hover-effect:hover { transform: translateY(-2px); }
      `}</style>
    </div>
  );
};

export default React.memo(TimeBasedGreeting);
