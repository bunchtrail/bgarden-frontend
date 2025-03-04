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
                padding: '8px 16px',
                transition: 'all 0.2s ease',
                '&:active': {
                  transform: 'scale(0.98)',
                },
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              },
              contained: {
                '&:hover': {
                  boxShadow: 'none',
                  backgroundColor: ({
                    theme,
                    ownerState,
                  }: {
                    theme: any;
                    ownerState: any;
                  }) =>
                    ownerState.color === 'primary'
                      ? theme.palette.primary.dark
                      : ownerState.color === 'secondary'
                      ? theme.palette.secondary.dark
                      : undefined,
                  opacity: 0.9,
                },
              },
              outlined: {
                '&:hover': {
                  backgroundColor: () =>
                    mode === 'light'
                      ? 'rgba(0, 113, 227, 0.08)'
                      : 'rgba(10, 132, 255, 0.15)',
                },
              },
              sizeSmall: {
                padding: '4px 12px',
                fontSize: '0.8125rem',
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
              root: {
                overflow: 'hidden',
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
          MuiModal: {
            styleOverrides: {
              root: {
                '& .MuiBox-root': {
                  maxHeight: '90vh',
                  overflow: 'auto',
                },
              },
            },
          },
          MuiTableContainer: {
            styleOverrides: {
              root: {
                overflow: 'auto',
              },
            },
          },
          MuiTab: {
            styleOverrides: {
              root: {
                minWidth: 'auto',
                padding: '12px 16px',
                whiteSpace: 'nowrap',
                '&.Mui-selected': {
                  backgroundColor:
                    mode === 'light'
                      ? 'rgba(0, 113, 227, 0.08)'
                      : 'rgba(10, 132, 255, 0.15)',
                },
              },
            },
          },
          MuiFormControl: {
            styleOverrides: {
              root: {
                width: '100%',
              },
            },
          },
          MuiButtonGroup: {
            styleOverrides: {
              root: {
                '& .MuiButton-root': {
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                },
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
