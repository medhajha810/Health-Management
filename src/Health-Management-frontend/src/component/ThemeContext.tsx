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
            contrastText: darkMode ? '#000000' : '#ffffff',
          },
          secondary: {
            main: darkMode ? '#f48fb1' : '#dc004e',
            contrastText: darkMode ? '#000000' : '#ffffff',
          },
          background: {
            default: darkMode ? '#121212' : '#f5f5f5',
            paper: darkMode ? '#1e1e1e' : '#fff',
          },
          text: {
            primary: darkMode ? '#ffffff' : 'rgba(0, 0, 0, 0.87)',
            secondary: darkMode ? '#e0e0e0' : 'rgba(0, 0, 0, 0.6)',
          },
          // Ensure alerts and other components have proper contrast in dark mode
          success: {
            main: darkMode ? '#66bb6a' : '#43a047',
            contrastText: darkMode ? '#000000' : '#ffffff',
          },
          error: {
            main: darkMode ? '#f44336' : '#d32f2f',
            contrastText: darkMode ? '#000000' : '#ffffff',
          },
          warning: {
            main: darkMode ? '#ffb74d' : '#f57c00',
            contrastText: darkMode ? '#000000' : '#ffffff',
          },
          info: {
            main: darkMode ? '#29b6f6' : '#0288d1',
            contrastText: darkMode ? '#000000' : '#ffffff',
          },
        },
        typography: {
          fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
          h1: {
            fontWeight: 500,
            color: darkMode ? '#ffffff' : undefined,
          },
          h2: {
            fontWeight: 500,
            color: darkMode ? '#ffffff' : undefined,
          },
          h3: {
            fontWeight: 500,
            color: darkMode ? '#ffffff' : undefined,
          },
          h4: {
            fontWeight: 500,
            color: darkMode ? '#ffffff' : undefined,
          },
          h5: {
            fontWeight: 500,
            color: darkMode ? '#ffffff' : undefined,
          },
          h6: {
            fontWeight: 500,
            color: darkMode ? '#ffffff' : undefined,
          },
          subtitle1: {
            color: darkMode ? '#e0e0e0' : undefined,
          },
          subtitle2: {
            color: darkMode ? '#e0e0e0' : undefined,
          },
          body1: {
            color: darkMode ? '#e0e0e0' : undefined,
          },
          body2: {
            color: darkMode ? '#e0e0e0' : undefined,
          },
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                color: darkMode ? 'inherit' : undefined,
              },
              contained: {
                color: darkMode ? '#ffffff' : undefined,
              },
              outlined: {
                borderColor: darkMode ? 'rgba(255, 255, 255, 0.3)' : undefined,
              },
              text: {
                color: darkMode ? '#90caf9' : undefined,
              },
            },
          },
          MuiIconButton: {
            styleOverrides: {
              root: {
                color: darkMode ? '#ffffff' : undefined,
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: 'none',
                color: darkMode ? '#ffffff' : undefined,
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                backgroundColor: darkMode ? '#1e1e1e' : '#ffffff',
                color: darkMode ? '#ffffff' : undefined,
              },
            },
          },
          MuiCardContent: {
            styleOverrides: {
              root: {
                color: darkMode ? '#ffffff' : undefined,
              },
            },
          },
          MuiTableCell: {
            styleOverrides: {
              root: {
                color: darkMode ? '#e0e0e0' : undefined,
                borderColor: darkMode ? 'rgba(255, 255, 255, 0.12)' : undefined,
              },
              head: {
                color: darkMode ? '#ffffff' : undefined,
                fontWeight: 600,
              },
            },
          },
          MuiAlert: {
            styleOverrides: {
              message: {
                color: darkMode ? '#fff' : undefined
              },
              standardSuccess: {
                color: darkMode ? '#000' : undefined,
                backgroundColor: darkMode ? 'rgba(102, 187, 106, 0.9)' : undefined,
                '& .MuiAlert-icon': {
                  color: darkMode ? '#000' : undefined
                }
              },
              standardError: {
                color: darkMode ? '#000' : undefined, 
                backgroundColor: darkMode ? 'rgba(244, 67, 54, 0.9)' : undefined,
                '& .MuiAlert-icon': {
                  color: darkMode ? '#000' : undefined
                }
              },
              standardWarning: {
                color: darkMode ? '#000' : undefined,
                backgroundColor: darkMode ? 'rgba(255, 183, 77, 0.9)' : undefined,
                '& .MuiAlert-icon': {
                  color: darkMode ? '#000' : undefined
                }
              },
              standardInfo: {
                color: darkMode ? '#000' : undefined,
                backgroundColor: darkMode ? 'rgba(41, 182, 246, 0.9)' : undefined,
                '& .MuiAlert-icon': {
                  color: darkMode ? '#000' : undefined
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
          MuiTextField: {
            styleOverrides: {
              root: {
                '& .MuiInputBase-input': {
                  color: darkMode ? '#e0e0e0' : undefined,
                },
                '& .MuiInputLabel-root': {
                  color: darkMode ? '#b0b0b0' : undefined,
                },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: darkMode ? 'rgba(255, 255, 255, 0.23)' : undefined,
                  },
                  '&:hover fieldset': {
                    borderColor: darkMode ? 'rgba(255, 255, 255, 0.5)' : undefined,
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: darkMode ? '#90caf9' : undefined,
                  },
                },
              },
            },
          },
          MuiFormHelperText: {
            styleOverrides: {
              root: {
                color: darkMode ? '#b0b0b0' : undefined,
              },
            },
          },
          MuiMenuItem: {
            styleOverrides: {
              root: {
                color: darkMode ? '#e0e0e0' : undefined,
              },
            },
          },
          MuiDialog: {
            styleOverrides: {
              paper: {
                backgroundColor: darkMode ? '#1e1e1e' : undefined,
                color: darkMode ? '#ffffff' : undefined,
              },
            },
          },
          MuiDialogTitle: {
            styleOverrides: {
              root: {
                color: darkMode ? '#ffffff' : undefined,
              },
            },
          },
          MuiDialogContent: {
            styleOverrides: {
              root: {
                color: darkMode ? '#e0e0e0' : undefined,
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