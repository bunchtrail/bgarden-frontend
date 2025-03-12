# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

## Стилизация проекта

Проект использует Tailwind CSS v3.3.0 и глобальные стили в стиле Apple для создания минималистичного и элегантного дизайна.

### Глобальные стили

Все глобальные стили определены в файле `src/styles/global-styles.ts`. Этот файл содержит:

- Константы цветов (основной: #0A84FF, успех: #30D158, предупреждение: #FF9F0A, опасность: #FF3B30)
- Предопределенные классы для кнопок, карточек, форм, таблиц и других компонентов
- Утилиты для работы с текстом, анимациями и макетами

### Документация по стилям для модулей

Каждый модуль содержит отдельную документацию по стилям в директории `docs`:

- Модуль авторизации: `src/modules/auth/docs/styles-guide.md`
- Модуль экспозиций: `src/modules/expositions/docs/styles-guide.md`
- Модуль карты: `src/modules/map/docs/styles-guide.md`
- Модуль навигации: `src/modules/navigation/docs/styles-guide.md`
- Модуль образцов: `src/modules/specimens/docs/styles-guide.md`
- Модуль утилит: `src/modules/utils/docs/styles-guide.md`

Эти руководства содержат подробную информацию о стилизации компонентов внутри каждого модуля.

### Рекомендации по стилизации

1. Всегда используйте предопределенные стили из `global-styles.ts` вместо прямого применения классов Tailwind
2. Для модульных компонентов используйте CSS-модули (например, `map.module.css`)
3. Проверяйте отображение компонентов на разных размерах экранов
4. Соблюдайте минималистичный дизайн в стиле Apple

## Модуль авторизации

В приложение интегрирован полноценный модуль авторизации со следующими возможностями:

- Регистрация новых пользователей
- Авторизация пользователей
- Защищенные маршруты
- Профиль пользователя
- Обработка JWT токенов
- Автоматическое обновление токенов

### Страницы авторизации

- `/login` - страница входа
- `/register` - страница регистрации
- `/profile` - страница профиля (доступна только авторизованным пользователям)
- `/admin` - административная панель (доступна только администраторам)

### Настройка API

Адрес API сервера настраивается через переменную окружения `REACT_APP_API_URL`. По умолчанию: `http://localhost:7254/api`

Для изменения адреса API создайте файл `.env.local` в корне проекта и добавьте:

```
REACT_APP_API_URL=http://your-api-server.com/api
```
