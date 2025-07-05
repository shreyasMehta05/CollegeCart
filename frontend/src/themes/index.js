// frontend/src/theme/index.js
import { createTheme } from '@mui/material/styles';

const getTheme = (mode) => {
  const isLight = mode === 'light';

  return createTheme({
    palette: {
      mode,
      primary: {
        // Dark-blue based
        main: '#0d3b66', // dark blue
        light: '#1e5a85',
        dark: '#062b3a',
        contrastText: '#ffffff',
      },
      secondary: {
        // Vibrant orange shades (glitter accents)
        main: '#f25c05', 
        light: '#f47c30',
        dark: '#c74300',
        contrastText: '#ffffff',
      },
      background: {
        default: isLight ? '#f8fafc' : '#0f172a',
        paper: isLight ? '#ffffff' : '#1e293b',
        alternate: isLight ? '#f1f5f9' : '#334155',
      },
      text: {
        primary: isLight ? '#1e293b' : '#f8fafc',
        secondary: isLight ? '#64748b' : '#cbd5e1',
      },
      divider: isLight ? '#e2e8f0' : '#334155',
      error: {
        main: '#ef4444',
      },
      success: {
        main: '#22c55e',
      },
      warning: {
        main: '#f59e0b',
      },
      info: {
        main: '#3b82f6',
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontSize: '2.5rem',
        fontWeight: 700,
        lineHeight: 1.2,
      },
      h2: {
        fontSize: '2rem',
        fontWeight: 600,
        lineHeight: 1.3,
      },
      h3: {
        fontSize: '1.75rem',
        fontWeight: 600,
        lineHeight: 1.3,
      },
      h4: {
        fontSize: '1.5rem',
        fontWeight: 600,
        lineHeight: 1.4,
      },
      h5: {
        fontSize: '1.25rem',
        fontWeight: 600,
        lineHeight: 1.4,
      },
      h6: {
        fontSize: '1rem',
        fontWeight: 600,
        lineHeight: 1.4,
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
      MuiCssBaseline: {
        styleOverrides: {
          // Define global keyframes for fadeIn animation
          '@keyframes fadeIn': {
            '0%': { opacity: 0, transform: 'translateY(20px)' },
            '100%': { opacity: 1, transform: 'translateY(0)' },
          },
          // Apply fadeIn to the body for a smooth page load animation
          body: {
            animation: 'fadeIn 0.6s ease-out',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            padding: '8px 16px',
            fontWeight: 500,
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            },
            transition: 'all 0.2s ease-in-out',
          },
          contained: {
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
          elevation1: {
            boxShadow: isLight 
              ? '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)'
              : '0 1px 3px rgba(0,0,0,0.3), 0 1px 2px rgba(0,0,0,0.2)',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: isLight
                ? '0 10px 20px rgba(0,0,0,0.1)'
                : '0 10px 20px rgba(0,0,0,0.3)',
            },
            transition: 'all 0.3s ease-in-out',
          },
        },
      },
      MuiInputBase: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
        },
      },
    },
  });
};

export default getTheme;
