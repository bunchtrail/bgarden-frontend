import { CssBaseline } from '@mui/material';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { AuthProvider } from './modules/auth';
import { routes } from './routes';
import ThemeProvider from './theme';
import TailwindTest from './components/TailwindTest';

function App() {
  return (
    <Router>
      <CssBaseline />
      <ThemeProvider>
        <AuthProvider>
          <div className="p-4">
            <TailwindTest />
          </div>
          <Routes>
            {routes.map((route, index) => (
              <Route key={index} path={route.path} element={route.element} />
            ))}
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
