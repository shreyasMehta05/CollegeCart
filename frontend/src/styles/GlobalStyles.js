// frontend/src/styles/GlobalStyles.js
import { createGlobalStyle } from 'styled-components';


const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: 'Poppins', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${props => props.theme.palette.background.default};
  }

  ::-webkit-scrollbar-thumb {
    background: ${props => props.theme.palette.primary.main};
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${props => props.theme.palette.primary.dark};
  }
`;

export default GlobalStyles;