import React, { createContext, useState, useContext, useMemo, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

interface ThemeContextType {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  darkMode: false,
  toggleDarkMode: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const CustomThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    // Get saved theme preference from localStorage
    const savedTheme = localStorage.getItem('darkMode');
    return savedTheme === 'true';
  });

  useEffect(() => {
    // Save theme preference to localStorage
    localStorage.setItem('darkMode', String(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? 'dark' : 'light',
          primary: {
            main: darkMode ? '#90caf9' : '#1976d2',
          },
          secondary: {
            main: darkMode ? '#f48fb1' : '#dc004e',
          },
          background: {
            default: darkMode ? '#121212' : '#f5f5f5',
            paper: darkMode ? '#1e1e1e' : '#fff',
          },
          text: {
            primary: darkMode ? '#ffffff' : 'rgba(0, 0, 0, 0.87)',
            secondary: darkMode ? '#c5c5c5' : 'rgba(0, 0, 0, 0.6)',
          },
          // Ensure alerts and other components have proper contrast in dark mode
          success: {
            main: darkMode ? '#66bb6a' : '#43a047',
          },
          error: {
            main: darkMode ? '#f44336' : '#d32f2f',
          },
          warning: {
            main: darkMode ? '#ffb74d' : '#f57c00',
          },
          info: {
            main: darkMode ? '#29b6f6' : '#0288d1',
          },
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                color: darkMode ? 'inherit' : undefined,
              },
            },
          },
          MuiIconButton: {
            styleOverrides: {
              root: {
                color: darkMode ? 'inherit' : undefined,
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: 'none',
              },
            },
          },
          MuiAlert: {
            styleOverrides: {
              message: {
                color: darkMode ? '#fff' : undefined
              },
              standardSuccess: {
                color: darkMode ? '#fff' : undefined,
                '& .MuiAlert-icon': {
                  color: darkMode ? '#fff' : undefined
                }
              },
              standardError: {
                color: darkMode ? '#fff' : undefined,
                '& .MuiAlert-icon': {
                  color: darkMode ? '#fff' : undefined
                }
              },
              standardWarning: {
                color: darkMode ? '#fff' : undefined,
                '& .MuiAlert-icon': {
                  color: darkMode ? '#fff' : undefined
                }
              },
              standardInfo: {
                color: darkMode ? '#fff' : undefined,
                '& .MuiAlert-icon': {
                  color: darkMode ? '#fff' : undefined
                }
              },
            },
          },
          MuiChip: {
            styleOverrides: {
              root: {
                color: darkMode ? '#ffffff' : undefined,
              },
            },
          },
        },
      }),
    [darkMode]
  );

  const themeContextValue = useMemo(
    () => ({
      darkMode,
      toggleDarkMode,
    }),
    [darkMode]
  );

  return (
    <ThemeContext.Provider value={themeContextValue}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}; 