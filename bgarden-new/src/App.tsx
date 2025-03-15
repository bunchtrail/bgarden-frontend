import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import './App.css';

// Компоненты страниц
const Home = () => (
  <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-green-100 to-green-300 p-6">
    <div className="w-full max-w-4xl rounded-xl bg-white p-8 shadow-xl">
      <h1 className="mb-6 text-center text-4xl font-bold text-green-700">Ботанический Сад</h1>
      <p className="mb-8 text-center text-xl text-gray-600">
        Добро пожаловать в наше приложение ботанического сада
      </p>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {['Растения', 'Карта', 'События', 'О нас'].map((item) => (
          <div key={item} className="rounded-lg bg-green-50 p-6 text-center shadow-md transition-all hover:scale-105 hover:bg-green-100">
            <h2 className="mb-2 text-xl font-semibold text-green-800">{item}</h2>
            <p className="text-gray-600">Узнайте больше о {item.toLowerCase()}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const NotFound = () => (
  <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
    <h1 className="mb-4 text-6xl font-bold text-red-600">404</h1>
    <p className="mb-6 text-xl text-gray-700">Страница не найдена</p>
    <a href="/" className="rounded-lg bg-green-600 px-6 py-2 text-white transition hover:bg-green-700">
      Вернуться на главную
    </a>
  </div>
);

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
