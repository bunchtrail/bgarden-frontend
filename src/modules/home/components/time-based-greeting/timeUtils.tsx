import React, { ReactNode } from 'react';

// ====== Тип иконки времени суток ======
export interface TimeInfo {
  greeting: string;
  icon: ReactNode;
  textColor: string;
  type: 'morning' | 'day' | 'evening' | 'night';
}

// ====== Иконки для разных периодов суток ======
export const ICONS = {
  morning: (
    <svg className="w-8 h-8 text-[#E97451]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
    </svg>
  ) as ReactNode,
  day: (
    <svg className="w-8 h-8 text-[#3882F6]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" />
    </svg>
  ) as ReactNode,
  evening: (
    <svg className="w-8 h-8 text-[#E97451]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
    </svg>
  ) as ReactNode,
  night: (
    <svg className="w-8 h-8 text-[#6366F1]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 0 1 .162.819A8.97 8.97 0 0 0 9 6a9 9 0 0 0 9 9 8.97 8.97 0 0 0 3.463-.69.75.75 0 0 1 .981.98 10.503 10.503 0 0 1-9.694 6.46c-5.799 0-10.5-4.7-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 0 1 .818.162Z" clipRule="evenodd" />
    </svg>
  ) as ReactNode
};

// ====== Массивы приветствий ======
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

// Сезонные приветствия
const SEASONAL_GREETINGS = {
  spring: {
    morning: ['Весеннее утро наполнено свежим ароматом', 'Встречай утро с первыми цветами'],
    day: ['Весенний день полон возможностей', 'День расцветает вместе с садом'],
    evening: ['Весенний вечер наполнен ароматами первоцвета', 'Вечер в весеннем саду — время чудес'],
    night: ['Сад отдыхает под весенним небом', 'Майская ночь окутывает сад теплом']
  },
  summer: {
    morning: ['Летнее утро в саду полно жизни', 'Утро начинается с ароматов лета'],
    day: ['Летний день - время активного роста', 'Сад созревает под летним солнцем'],
    evening: ['Летний вечер в саду полон гармонии', 'Вечерняя прохлада освежает летний сад'],
    night: ['Лунный свет и летний сад - идеальное сочетание', 'Звёздное небо над летним садом']
  },
  autumn: {
    morning: ['Осеннее утро, туман над садом', 'Утро разукрашено осенними красками'],
    day: ['Осенний день - время сбора урожая', 'Золотая осень в разгаре'],
    evening: ['Вечер в осеннем саду - время раздумий', 'Осенний закат окрасил сад в алые тона'],
    night: ['Прохладная осенняя ночь в саду', 'Осенние звёзды ярче над спящим садом']
  },
  winter: {
    morning: ['Морозное утро в спящем саду', 'Утро под зимним покрывалом'],
    day: ['Зимний день - время планировать будущий сезон', 'Сад отдыхает под снежным одеялом'],
    evening: ['Ранний зимний вечер окутывает сад', 'Вечерний снегопад украшает сад'],
    night: ['Зимняя ночь - время покоя для сада', 'Снежные узоры под лунным светом']
  }
};

// Праздничные приветствия
const HOLIDAY_GREETINGS = {
  newYear: ['С Новым Годом! Пусть сад расцветёт новыми идеями', 'Новогодняя ночь полна чудес для сада'],
  christmas: ['С Рождеством! Пусть сад наполнится волшебством', 'Рождественское настроение в каждом уголке сада'],
  spring8: ['С 8 марта! Пусть сад цветёт для вас', 'День весны и цветов для самых прекрасных садоводов'],
  may9: ['С Днём Победы! Мирного неба над садом', 'День памяти и гордости за нашу землю']
};

// ====== Вспомогательные функции ======

// Получить случайный элемент массива
export const getRandomGreeting = (greetings: string[]): string => {
  const randomIndex = Math.floor(Math.random() * greetings.length);
  return greetings[randomIndex];
};

// Определение текущего сезона
export const getCurrentSeason = (): string => {
  const month = new Date().getMonth();
  if (month >= 2 && month <= 4) return 'spring';
  if (month >= 5 && month <= 7) return 'summer';
  if (month >= 8 && month <= 10) return 'autumn';
  return 'winter';
};

// Определение текущего праздника
export const getCurrentHoliday = (): string | null => {
  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth();

  // Новый год (1 января)
  if (month === 0 && day === 1) return 'newYear';
  // Рождество (7 января)
  if (month === 0 && day === 7) return 'christmas';
  // 8 марта
  if (month === 2 && day === 8) return 'spring8';
  // 9 мая
  if (month === 4 && day === 9) return 'may9';

  return null;
};

// Формирование итогового приветствия на базе времени/сезона/праздника
export const getTimeBasedGreeting = (): TimeInfo => {
  const hour = new Date().getHours();
  const season = getCurrentSeason();
  const holiday = getCurrentHoliday();

  let timeOfDay = '';
  let randomGreeting = '';
  let textColor = '';
  let icon = null;

  // Определение времени суток
  if (hour >= 5 && hour < 12) {
    timeOfDay = 'morning';
    textColor = 'text-[#E97451]';
    icon = ICONS.morning;
  } else if (hour >= 12 && hour < 17) {
    timeOfDay = 'day';
    textColor = 'text-[#3882F6]';
    icon = ICONS.day;
  } else if (hour >= 17 && hour < 22) {
    timeOfDay = 'evening';
    textColor = 'text-[#E97451]';
    icon = ICONS.evening;
  } else {
    timeOfDay = 'night';
    textColor = 'text-[#6366F1]';
    icon = ICONS.night;
  }

  // Выбор приветствия (праздничное, сезонное или обычное)
  if (holiday) {
    randomGreeting = getRandomGreeting(HOLIDAY_GREETINGS[holiday as keyof typeof HOLIDAY_GREETINGS]);
  } else {
    // С небольшой вероятностью возьмём сезонное приветствие
    const useSeasonalGreeting = Math.random() < 0.3;

    if (
      useSeasonalGreeting &&
      SEASONAL_GREETINGS[season as keyof typeof SEASONAL_GREETINGS] &&
      SEASONAL_GREETINGS[season as keyof typeof SEASONAL_GREETINGS][timeOfDay as keyof (typeof SEASONAL_GREETINGS)['spring']]
    ) {
      const seasonalGreetings = SEASONAL_GREETINGS[season as keyof typeof SEASONAL_GREETINGS][timeOfDay as keyof (typeof SEASONAL_GREETINGS)['spring']];
      randomGreeting = getRandomGreeting(seasonalGreetings);
    } else {
      // Обычные приветствия в зависимости от времени суток
      if (timeOfDay === 'morning') {
        randomGreeting = getRandomGreeting(MORNING_GREETINGS);
      } else if (timeOfDay === 'day') {
        randomGreeting = getRandomGreeting(DAY_GREETINGS);
      } else if (timeOfDay === 'evening') {
        randomGreeting = getRandomGreeting(EVENING_GREETINGS);
      } else {
        randomGreeting = getRandomGreeting(NIGHT_GREETINGS);
      }
    }
  }

  return { 
    greeting: randomGreeting, 
    textColor, 
    icon, 
    type: timeOfDay as 'morning' | 'day' | 'evening' | 'night' 
  };
}; 