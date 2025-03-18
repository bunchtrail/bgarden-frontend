import { useRoutes } from 'react-router-dom';
import './App.css';
import { routes } from './routes';
import { NotificationContainer } from './modules/notifications';

function App() {
  // Используем useRoutes для создания элементов маршрутизации из конфигурации
  const routeElements = useRoutes(routes);
  
  // Возвращаем элементы маршрутизации с контейнером уведомлений
  return (
    <>
      {routeElements}
      <NotificationContainer />
    </>
  );
}

export default App;
