import { createTheme, PaletteMode } from '@mui/material';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

export const ColorModeContext = createContext({
  toggleColorMode: () => {},
});

export const useColorMode = () => {
  return useContext(ColorModeContext);
};

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [mode, setMode] = useState<PaletteMode>('light');

  useEffect(() => {
    // Определяем предпочтения пользователя
    const prefersDarkMode = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;
    setMode(prefersDarkMode ? 'dark' : 'light');

    // Слушаем изменения предпочтений
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (event: MediaQueryListEvent) => {
      setMode(event.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    []
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === 'light'
            ? {
                // Светлая тема
                primary: {
                  main: '#0071e3',
                },
                secondary: {
                  main: '#86868b',
                },
                error: {
                  main: '#ff3b30',
                },
                warning: {
                  main: '#ffcc00',
                },
                info: {
                  main: '#007aff',
                },
                success: {
                  main: '#34c759',
                },
                background: {
                  default: '#fbfbfd',
                  paper: '#ffffff',
                },
                text: {
                  primary: '#1d1d1f',
                  secondary: '#86868b',
                },
              }
            : {
                // Темная тема
                primary: {
                  main: '#0071e3',
                },
                secondary: {
                  main: '#86868b',
                },
                error: {
                  main: '#ff453a',
                },
                warning: {
                  main: '#ffd60a',
                },
                info: {
                  main: '#0a84ff',
                },
                success: {
                  main: '#30d158',
                },
                background: {
                  default: '#000000',
                  paper: '#1c1c1e',
                },
                text: {
                  primary: '#f5f5f7',
                  secondary: '#86868b',
                },
              }),
        },
        typography: {
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
          h1: {
            fontWeight: 600,
            letterSpacing: '-0.025em',
          },
          h2: {
            fontWeight: 600,
            letterSpacing: '-0.02em',
          },
          h3: {
            fontWeight: 500,
            letterSpacing: '-0.015em',
          },
          h4: {
            fontWeight: 500,
            letterSpacing: '-0.015em',
          },
          h5: {
            fontWeight: 500,
            letterSpacing: '-0.01em',
          },
          h6: {
            fontWeight: 500,
            letterSpacing: '-0.005em',
          },
          button: {
            textTransform: 'none',
            fontWeight: 500,
          },
        },
        shape: {
          borderRadius: 12,
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 980,
                boxShadow: 'none',
                padding: '10px 20px',
                transition: 'background-color 0.2s ease, transform 0.1s ease',
                '&:active': {
                  transform: 'scale(0.98)',
                },
              },
              contained: {
                '&:hover': {
                  boxShadow: 'none',
                },
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              rounded: {
                borderRadius: 16,
              },
              elevation1: {
                boxShadow: '0 2px 12px rgba(0, 0, 0, 0.05)',
              },
            },
          },
          MuiTextField: {
            styleOverrides: {
              root: {
                '& .MuiOutlinedInput-root': {
                  borderRadius: 8,
                },
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: 16,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                overflow: 'hidden',
              },
            },
          },
          MuiAppBar: {
            styleOverrides: {
              root: {
                boxShadow: 'none',
              },
            },
          },
        },
      }),
    [mode]
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default ThemeProvider;
