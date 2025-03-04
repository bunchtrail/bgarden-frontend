import { CssBaseline } from '@mui/material';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { AuthProvider } from './modules/auth';
import { routes } from './routes';

function App() {
  return (
    <Router>
      <CssBaseline />
      <AuthProvider>
        <Routes>
          {routes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
          ))}
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
