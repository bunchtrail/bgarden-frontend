import React, { useMemo } from 'react';
import { textClasses } from '../../../../styles/global-styles';

interface AnimatedTextProps {
  text: string;
  baseDelay: number;
  isName?: boolean;
  animationStage: number;
}

const AnimatedText: React.FC<AnimatedTextProps> = React.memo(({ text, baseDelay, isName = false, animationStage }) => {
  const words = useMemo(() => text.split(' '), [text]);

  return (
    <span className={`inline-flex flex-wrap ${textClasses.primary}`}>
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="inline-flex mr-[0.25em] last:mr-0">
          {word.split('').map((char, charIndex) => (
            <span
              key={charIndex}
              className={`inline-block transition-all duration-500 ease-out transform
                ${animationStage >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}
                ${animationStage >= 4 && !isName ? 'hover-effect hover-wave-text' : ''}`}
              style={{
                transitionDelay: `${baseDelay + wordIndex * 40 + charIndex * 30}ms`,
                animationDelay: `${(wordIndex * 40 + charIndex * 80)}ms`,
                '--char-index': charIndex
              } as React.CSSProperties}
            >
              {char}
            </span>
          ))}
        </span>
      ))}
    </span>
  );
});

export default AnimatedText; 