
import { useRoutes } from 'react-router-dom';
import './App.css';
import { routes } from './routes';





function App() {
  // Используем useRoutes для создания элементов маршрутизации из конфигурации
  const routeElements = useRoutes(routes);
  
  // Возвращаем элементы маршрутизации
  return routeElements;
}

export default App;
