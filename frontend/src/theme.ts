import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#19376D', // dark blue
      contrastText: '#fff',
    },
    secondary: {
      main: '#43ea7c', // green accent
    },
    background: {
      default: '#f7fafd', // light blue background
      paper: '#e3eafc', // card background
    },
    error: {
      main: '#e74c3c', // red
    },
    success: {
      main: '#43ea7c', // green
    },
    info: {
      main: '#b6d4fa', // info blue
    },
    text: {
      primary: '#19376D',
      secondary: '#7b8fa6',
    },
  },
  typography: {
    fontFamily: 'Inter, Arial, sans-serif',
    fontWeightBold: 700,
    fontWeightMedium: 600,
    fontWeightRegular: 500,
  },
  shape: {
    borderRadius: 12,
  },
});

export default theme;
