// frontend/src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider as MUIThemeProvider, CssBaseline } from '@mui/material';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import GlobalStyles from './styles/GlobalStyles';
import getTheme from './themes/index.js';
import './global.css';
const mode = 'dark'; // or 'dark' - you can also store this in state
const theme = getTheme(mode);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* MUI Theme Provider */}
    <MUIThemeProvider theme={theme}>
      {/* styled-components Theme Provider */}
      <StyledThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles />
        <App />
      </StyledThemeProvider>
    </MUIThemeProvider>
  </React.StrictMode>
);
